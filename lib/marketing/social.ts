import { prisma } from "@/lib/db/prisma"

export async function postToTwitter({
  content,
  jobId,
}: {
  content: string
  jobId?: string
}) {
  const apiKey = process.env.TWITTER_API_KEY
  const apiSecret = process.env.TWITTER_API_SECRET
  const accessToken = process.env.TWITTER_ACCESS_TOKEN
  const accessSecret = process.env.TWITTER_ACCESS_SECRET

  const log = await prisma.socialPost.create({
    data: {
      platform: "twitter",
      postType: jobId ? "job_post" : "announcement",
      referenceId: jobId || null,
      content,
      status: "pending",
    },
  })

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.log(`[SOCIAL/TWITTER] ${content}`)
    await prisma.socialPost.update({
      where: { id: log.id },
      data: { status: "skipped", postedAt: new Date() },
    })
    return { success: true, skipped: true, id: log.id }
  }

  try {
    const response = await fetch("https://upload.twitter.com/1.1/statuses/update.json", {
      method: "POST",
      headers: {
        Authorization: `OAuth oauth_consumer_key="${apiKey}", oauth_token="${accessToken}"`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ status: content }),
    })

    const data = await response.json()

    if (data.id_str) {
      await prisma.socialPost.update({
        where: { id: log.id },
        data: { status: "posted", platformPostId: data.id_str, postedAt: new Date() },
      })
      return { success: true, id: log.id, postId: data.id_str }
    } else {
      await prisma.socialPost.update({
        where: { id: log.id },
        data: { status: "failed", error: JSON.stringify(data) },
      })
      return { success: false, error: data.errors, id: log.id }
    }
  } catch (error: any) {
    await prisma.socialPost.update({
      where: { id: log.id },
      data: { status: "failed", error: error.message },
    })
    return { success: false, error: error.message, id: log.id }
  }
}

export async function postToLinkedIn({
  content,
  jobId,
}: {
  content: string
  jobId?: string
}) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
  const organizationId = process.env.LINKEDIN_ORGANIZATION_ID

  const log = await prisma.socialPost.create({
    data: {
      platform: "linkedin",
      postType: jobId ? "job_post" : "announcement",
      referenceId: jobId || null,
      content,
      status: "pending",
    },
  })

  if (!accessToken) {
    console.log(`[SOCIAL/LINKEDIN] ${content}`)
    await prisma.socialPost.update({
      where: { id: log.id },
      data: { status: "skipped", postedAt: new Date() },
    })
    return { success: true, skipped: true, id: log.id }
  }

  try {
    const response = await fetch(
      `https://api.linkedin.com/v2/ugcPosts?actors=urn:li:organization:${organizationId || "me"}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: `urn:li:organization:${organizationId || "me"}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: { text: content },
              shareMediaCategory: "NONE",
            },
          },
          visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
        }),
      }
    )

    const data = await response.json()

    if (data.id) {
      await prisma.socialPost.update({
        where: { id: log.id },
        data: { status: "posted", platformPostId: data.id, postedAt: new Date() },
      })
      return { success: true, id: log.id, postId: data.id }
    } else {
      await prisma.socialPost.update({
        where: { id: log.id },
        data: { status: "failed", error: JSON.stringify(data) },
      })
      return { success: false, error: data.message, id: log.id }
    }
  } catch (error: any) {
    await prisma.socialPost.update({
      where: { id: log.id },
      data: { status: "failed", error: error.message },
    })
    return { success: false, error: error.message, id: log.id }
  }
}

export async function autoPostJobToSocial(jobId: string, job: {
  jobTitle: string
  companyName: string
  location: string
  applicationUrl?: string
}) {
  const content = `We're hiring! ${job.jobTitle} at ${job.companyName} (${job.location}). Apply now: ${job.applicationUrl || process.env.NEXT_PUBLIC_APP_URL + "/hire"}`

  const [twitter, linkedin] = await Promise.allSettled([
    postToTwitter({ content, jobId }),
    postToLinkedIn({ content, jobId }),
  ])

  return {
    twitter: twitter.status === "fulfilled" ? twitter.value : null,
    linkedin: linkedin.status === "fulfilled" ? linkedin.value : null,
  }
}
