import { type NextRequest, NextResponse } from "next/server"

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const SYSTEM_PROMPT = `You are an AI assistant for a business WhatsApp bot. 
Answer concisely and helpfully. For product inquiries, check inventory via Google Sheets integration.
Provide pricing in local currency (KSh for Kenya). Be professional but friendly.`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.object !== "page") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const messages = changes?.value?.messages

    if (!messages || !messages[0]) {
      return NextResponse.json({ status: "ok" })
    }

    const message = messages[0]
    const from = message.from
    const text = message.text?.body

    if (!from || !text) {
      return NextResponse.json({ status: "no_valid_message" })
    }

    const aiReply = await getAiResponse(text, from)

    await sendWhatsAppReply(from, aiReply)

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("[whatsapp-webhook] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getAiResponse(message: string, phoneNumber: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that request."
}

async function sendWhatsAppReply(to: string, message: string): Promise<void> {
  if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
    throw new Error("WhatsApp credentials not configured")
  }

  await fetch(
    `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        text: { body: message },
      }),
    }
  )
}