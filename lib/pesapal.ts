const PESAPAL_BASE_URL =
  process.env.PESAPAL_ENVIRONMENT === "production"
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/pesapalv3"

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getPesapalToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const res = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }),
  })

  if (!res.ok) {
    throw new Error(`Pesapal auth failed: ${res.status}`)
  }

  const data = await res.json()
  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + 4 * 60 * 60 * 1000,
  }
  return data.token
}

export async function registerIPN(): Promise<string> {
  const token = await getPesapalToken()
  const ipnUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.REPLIT_DEV_DOMAIN || "http://localhost:5000"}/api/payments/ipn`

  const res = await fetch(`${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: ipnUrl.startsWith("http") ? ipnUrl : `https://${ipnUrl}`,
      ipn_notification_type: "GET",
    }),
  })

  const data = await res.json()
  return data.ipn_id
}

export interface PesapalOrderPayload {
  id: string
  currency: string
  amount: number
  description: string
  callback_url: string
  notification_id: string
  billing_address: {
    email_address: string
    first_name: string
    last_name?: string
    phone_number?: string
  }
}

export async function submitOrder(payload: PesapalOrderPayload): Promise<{
  order_tracking_id: string
  merchant_reference: string
  redirect_url: string
}> {
  const token = await getPesapalToken()

  const res = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Pesapal order failed: ${err}`)
  }

  return res.json()
}

export async function getTransactionStatus(orderTrackingId: string): Promise<{
  payment_method: string
  amount: number
  created_date: string
  confirmation_code: string
  payment_status_description: string
  description: string
  message: string
  payment_account: string
  call_back_url: string
  status_code: number
  merchant_reference: string
  currency: string
}> {
  const token = await getPesapalToken()

  const res = await fetch(
    `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.json()
}
