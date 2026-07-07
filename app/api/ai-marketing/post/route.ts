import { NextRequest, NextResponse } from "next/server"
import { postToTwitter, postToLinkedIn } from "@/lib/marketing/social"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, platform, postType = "announcement" } = body

    if (!content || !platform) {
      return NextResponse.json(
        { error: "content and platform are required" },
        { status: 400 }
      )
    }

    if (platform !== "twitter" && platform !== "linkedin") {
      return NextResponse.json(
        { error: "platform must be twitter or linkedin" },
        { status: 400 }
      )
    }

    let result
    if (platform === "twitter") {
      result = await postToTwitter({ content })
    } else {
      result = await postToLinkedIn({ content })
    }

    return NextResponse.json({
      success: result.success,
      platform,
      skipped: result.skipped || false,
      postId: result.postId || null,
      error: result.error || null,
    })
  } catch (error: any) {
    console.error("Social post API error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to post to social media" },
      { status: 500 }
    )
  }
}
