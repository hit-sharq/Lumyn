import nodemailer from "nodemailer"
import { prisma } from "@/lib/db/prisma"

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || "587")
  const secure = process.env.SMTP_SECURE === "true"
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn("SMTP not configured — emails will be logged only")
    return null
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  return transporter
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  const from = process.env.SMTP_FROM || `"Lumyn Technologies" <${process.env.SMTP_USER}>`

  const log = await prisma.emailLog.create({
    data: { to, subject, template: subject, status: "pending" },
  })

  try {
    const tx = getTransporter()
    if (!tx) {
      console.log(`[EMAIL] ${subject} → ${to}`)
      await prisma.emailLog.update({
        where: { id: log.id },
        data: { status: "skipped", sentAt: new Date() },
      })
      return { success: true, skipped: true }
    }

    await tx.sendMail({
      from,
      to,
      subject,
      html,
      replyTo,
    })

    await prisma.emailLog.update({
      where: { id: log.id },
      data: { status: "sent", sentAt: new Date() },
    })

    return { success: true }
  } catch (error: any) {
    await prisma.emailLog.update({
      where: { id: log.id },
      data: { status: "failed", error: error.message },
    })
    console.error("Email send error:", error)
    return { success: false, error: error.message }
  }
}

export function renderBrandedTemplate({
  title,
  preheader,
  body,
  ctaText,
  ctaUrl,
  footerText,
}: {
  title: string
  preheader?: string
  body: string
  ctaText?: string
  ctaUrl?: string
  footerText?: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lumyn.com"

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; padding: 0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; }
    .logo { font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
    .logo span { color: #3b82f6; }
    .content { background: #ffffff; padding: 40px 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .cta-button { display: inline-block; padding: 14px 32px; background: #0f172a; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
    .footer { text-align: center; padding: 24px; color: #64748b; font-size: 12px; }
    .footer a { color: #64748b; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Lumyn<span>.</span></div>
    </div>
    <div class="content">
      ${preheader ? `<p style="color: #64748b; font-size: 14px; margin-top: 0;">${preheader}</p>` : ""}
      ${body}
      ${ctaText && ctaUrl ? `<a href="${ctaUrl}" class="cta-button">${ctaText}</a>` : ""}
    </div>
    <div class="footer">
      <p>${footerText || "© 2025 Lumyn Technologies. All rights reserved."}</p>
      <p><a href="${baseUrl}/unsubscribe?email={{email}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`
}
