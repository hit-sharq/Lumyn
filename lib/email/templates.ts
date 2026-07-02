import { sendEmail, renderBrandedTemplate } from "./service"

export async function sendPurchaseConfirmation({
  to,
  name,
  item,
  amount,
  receiptUrl,
}: {
  to: string
  name: string
  item: string
  amount: string
  receiptUrl: string
}) {
  const body = `
    <h1 style="margin: 0 0 16px; font-size: 22px; color: #0f172a;">Purchase Confirmed</h1>
    <p style="margin: 0 0 16px; line-height: 1.6;">Hi ${name},</p>
    <p style="margin: 0 0 16px; line-height: 1.6;">Your purchase has been confirmed. Here are your details:</p>
    <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0 0 8px;"><strong>Item:</strong> ${item}</p>
      <p style="margin: 0 0 8px;"><strong>Amount:</strong> ${amount}</p>
    </div>
    <p style="margin: 0; line-height: 1.6;">Thank you for your purchase. If you have any questions, reply to this email.</p>
  `

  const html = renderBrandedTemplate({
    title: "Purchase Confirmed",
    preheader: `Your order for ${item} has been confirmed.`,
    body,
    ctaText: "View Receipt",
    ctaUrl: receiptUrl,
    footerText: "© 2025 Lumyn Technologies",
  })

  return sendEmail({ to, subject: `Purchase Confirmed: ${item}`, html })
}

export async function sendJobPostReceipt({
  to,
  name,
  jobTitle,
  company,
  amount,
  dashboardUrl,
}: {
  to: string
  name: string
  jobTitle: string
  company: string
  amount: string
  dashboardUrl: string
}) {
  const body = `
    <h1 style="margin: 0 0 16px; font-size: 22px; color: #0f172a;">Job Post Receipt</h1>
    <p style="margin: 0 0 16px; line-height: 1.6;">Hi ${name},</p>
    <p style="margin: 0 0 16px; line-height: 1.6;">Your job post has been successfully submitted for <strong>${company}</strong>.</p>
    <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0 0 8px;"><strong>Role:</strong> ${jobTitle}</p>
      <p style="margin: 0 0 8px;"><strong>Company:</strong> ${company}</p>
      <p style="margin: 0 0 8px;"><strong>Amount Paid:</strong> ${amount}</p>
    </div>
    <p style="margin: 0; line-height: 1.6;">You can manage your post from your dashboard.</p>
  `

  const html = renderBrandedTemplate({
    title: "Job Post Receipt",
    preheader: `Your job post for ${jobTitle} at ${company} is confirmed.`,
    body,
    ctaText: "Go to Dashboard",
    ctaUrl: dashboardUrl,
  })

  return sendEmail({ to, subject: `Job Post Confirmed: ${jobTitle}`, html })
}

export async function sendSubscriptionConfirmation({
  to,
  name,
  plan,
  amount,
  periodEnd,
  dashboardUrl,
}: {
  to: string
  name: string
  plan: string
  amount: string
  periodEnd: string
  dashboardUrl: string
}) {
  const body = `
    <h1 style="margin: 0 0 16px; font-size: 22px; color: #0f172a;">Subscription Active</h1>
    <p style="margin: 0 0 16px; line-height: 1.6;">Hi ${name},</p>
    <p style="margin: 0 0 16px; line-height: 1.6;">Your <strong>${plan}</strong> subscription is now active.</p>
    <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0 0 8px;"><strong>Plan:</strong> ${plan}</p>
      <p style="margin: 0 0 8px;"><strong>Amount:</strong> ${amount}</p>
      <p style="margin: 0 0 8px;"><strong>Next billing:</strong> ${periodEnd}</p>
    </div>
  `

  const html = renderBrandedTemplate({
    title: "Subscription Confirmed",
    preheader: `Your ${plan} subscription is active.`,
    body,
    ctaText: "Manage Subscription",
    ctaUrl: dashboardUrl,
  })

  return sendEmail({ to, subject: `Subscription Active: ${plan}`, html })
}

export async function sendRenewalReminder({
  to,
  name,
  plan,
  renewUrl,
}: {
  to: string
  name: string
  plan: string
  renewUrl: string
}) {
  const body = `
    <h1 style="margin: 0 0 16px; font-size: 22px; color: #0f172a;">Subscription Renewal Reminder</h1>
    <p style="margin: 0 0 16px; line-height: 1.6;">Hi ${name},</p>
    <p style="margin: 0 0 16px; line-height: 1.6;">Your <strong>${plan}</strong> subscription renews in <strong>7 days</strong>. Ensure your payment method is up to date to avoid service interruption.</p>
  `

  const html = renderBrandedTemplate({
    title: "Subscription Renewal Reminder",
    preheader: `Your ${plan} subscription renews soon.`,
    body,
    ctaText: "Renew Now",
    ctaUrl: renewUrl,
  })

  return sendEmail({ to, subject: `Your ${plan} subscription renews soon`, html })
}

export async function sendWelcomeEmail({
  to,
  name,
  referralCode,
  dashboardUrl,
}: {
  to: string
  name: string
  referralCode: string
  dashboardUrl: string
}) {
  const body = `
    <h1 style="margin: 0 0 16px; font-size: 22px; color: #0f172a;">Welcome to Lumyn</h1>
    <p style="margin: 0 0 16px; line-height: 1.6;">Hi ${name},</p>
    <p style="margin: 0 0 16px; line-height: 1.6;">Thanks for joining Lumyn. You now have access to templates, job listings, and a global creator marketplace.</p>
    ${referralCode ? `
    <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;">Your referral code</p>
      <p style="margin: 0; font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: 2px;">${referralCode}</p>
    </div>
    <p style="margin: 0 0 16px; line-height: 1.6;">Share your code with friends. When they make their first purchase, you'll earn rewards.</p>
    ` : ""}
  `

  const html = renderBrandedTemplate({
    title: "Welcome to Lumyn",
    preheader: "Get started with Lumyn templates, jobs, and marketplace.",
    body,
    ctaText: "Go to Dashboard",
    ctaUrl: dashboardUrl,
  })

  return sendEmail({ to, subject: "Welcome to Lumyn", html })
}

export async function sendOnboardingDrip({
  to,
  name,
  day,
  dashboardUrl,
}: {
  to: string
  name: string
  day: 1 | 3 | 7
  dashboardUrl: string
}) {
  const titles: Record<number, string> = {
    1: "Getting started with Lumyn",
    3: "3 tips to make the most of Lumyn",
    7: "Your first week on Lumyn — what's next?",
  }

  const bodies: Record<number, string> = {
    1: `<p style="margin: 0 0 16px; line-height: 1.6;">Hi ${name},</p><p style="margin: 0 0 16px; line-height: 1.6;">Start by exploring templates, posting a job, or browsing the marketplace. Your dashboard has everything you need.</p>`,
    3: `<p style="margin: 0 0 16px; line-height: 1.6;">Hi ${name},</p><p style="margin: 0 0 16px; line-height: 1.6;">Tip 1: Use featured listings for higher visibility. Tip 2: Complete your profile. Tip 3: Check the Hire section daily.</p>`,
    7: `<p style="margin: 0 0 16px; line-height: 1.6;">Hi ${name},</p><p style="margin: 0 0 16px; line-height: 1.6;">You've been with us for a week. Consider upgrading to Creator Pro or Job Unlimited for unlimited access.</p>`,
  }

  const html = renderBrandedTemplate({
    title: titles[day],
    body: bodies[day],
    ctaText: "Open Dashboard",
    ctaUrl: dashboardUrl,
  })

  return sendEmail({ to, subject: titles[day], html })
}

export async function sendNewsletter({
  to,
  subject,
  body,
  unsubscribeUrl,
}: {
  to: string
  subject: string
  body: string
  unsubscribeUrl: string
}) {
  const html = renderBrandedTemplate({
    title: subject,
    preheader: "Weekly updates from Lumyn.",
    body,
    footerText: "You're receiving this because you signed up for Lumyn updates.",
  })

  return sendEmail({ to, subject, html, replyTo: process.env.SMTP_FROM })
}

export async function sendAbandonedCartReminder({
  to,
  name,
  item,
  amount,
  resumeUrl,
}: {
  to: string
  name: string
  item: string
  amount: string
  resumeUrl: string
}) {
  const body = `
    <h1 style="margin: 0 0 16px; font-size: 22px; color: #0f172a;">You left something behind</h1>
    <p style="margin: 0 0 16px; line-height: 1.6;">Hi ${name},</p>
    <p style="margin: 0 0 16px; line-height: 1.6;">Your <strong>${item}</strong> (${amount}) is waiting. Complete your purchase before it expires.</p>
  `

  const html = renderBrandedTemplate({
    title: "Complete your purchase",
    preheader: `${item} — ${amount}`,
    body,
    ctaText: "Complete Purchase",
    ctaUrl: resumeUrl,
  })

  return sendEmail({ to, subject: `Complete your ${item} purchase`, html })
}

export async function sendUpsellEmail({
  to,
  name,
  currentPlan,
  recommendedPlan,
  benefits,
  upgradeUrl,
}: {
  to: string
  name: string
  currentPlan: string
  recommendedPlan: string
  benefits: string[]
  upgradeUrl: string
}) {
  const body = `
    <h1 style="margin: 0 0 16px; font-size: 22px; color: #0f172a;">Upgrade to ${recommendedPlan}</h1>
    <p style="margin: 0 0 16px; line-height: 1.6;">Hi ${name},</p>
    <p style="margin: 0 0 16px; line-height: 1.6;">You're on the <strong>${currentPlan}</strong> plan. Upgrade to <strong>${recommendedPlan}</strong> to unlock:</p>
    <ul style="margin: 0 0 16px; padding-left: 20px; line-height: 1.8;">
      ${benefits.map((b) => `<li>${b}</li>`).join("")}
    </ul>
  `

  const html = renderBrandedTemplate({
    title: `Upgrade to ${recommendedPlan}`,
    preheader: "Unlock more with Lumyn Pro.",
    body,
    ctaText: "Upgrade Now",
    ctaUrl: upgradeUrl,
  })

  return sendEmail({ to, subject: `Upgrade to ${recommendedPlan}`, html })
}
