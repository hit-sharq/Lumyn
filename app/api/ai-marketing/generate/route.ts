import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isFreeLaunch } from "@/lib/pricing";
import { recordAIGeneration } from "@/lib/pricing-eval";
import {
  generateSocialPost,
  generateEmailCopy,
  generateAdCopy,
  generateLandingPageCopy,
  generateHashtags,
  generateCampaignOutline,
  generateABTestVariations,
  generateContentIdeas,
} from "@/lib/ai/marketing/content-generator";

const FREE_LIMIT = 5;

async function getUserMonthlyUsage(userId: string): Promise<number> {
  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  const count = await prisma.aIMarketingUsage.count({
    where: { userId, month },
  })

  return count
}

async function incrementUserMonthlyUsage(userId: string): Promise<void> {
  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  await prisma.aIMarketingUsage.upsert({
    where: { userId_month: { userId, month } },
    create: { userId, month, count: 1 },
    update: { count: { increment: 1 } },
  })
}

async function hasActiveAISubscription(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      plan: "ai_marketing_pro",
      status: "active",
    },
  })

  if (!subscription) return false
  if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < new Date()) return false
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contentType,
      platform,
      topic,
      product,
      audience,
      subject,
      objective,
      targetAudience,
      tone = "professional",
      saveAsTemplate = false,
      templateTitle,
    } = body;

    if (!contentType) {
      return NextResponse.json(
        { error: "contentType is required" },
        { status: 400 }
      );
    }

    let content: any;

    switch (contentType) {
      case "social_post":
        if (!platform || !topic) {
          return NextResponse.json(
            { error: "platform and topic are required for social posts" },
            { status: 400 }
          );
        }
        content = await generateSocialPost(platform, topic, tone);
        break;

      case "email_short":
        if (!subject || !product) {
          return NextResponse.json(
            { error: "subject and product are required for emails" },
            { status: 400 }
          );
        }
        content = await generateEmailCopy(subject, product, "short", tone);
        break;

      case "email_long":
        if (!subject || !product) {
          return NextResponse.json(
            { error: "subject and product are required for emails" },
            { status: 400 }
          );
        }
        content = await generateEmailCopy(subject, product, "long", tone);
        break;

      case "ad_copy":
        if (!product || !audience) {
          return NextResponse.json(
            { error: "product and audience are required for ad copy" },
            { status: 400 }
          );
        }
        content = await generateAdCopy(product, audience, platform || "facebook");
        break;

      case "landing_page":
        if (!product || !audience) {
          return NextResponse.json(
            { error: "product and audience are required for landing pages" },
            { status: 400 }
          );
        }
        content = await generateLandingPageCopy(product, audience);
        break;

      case "hashtags":
        if (!topic) {
          return NextResponse.json(
            { error: "topic is required for hashtags" },
            { status: 400 }
          );
        }
        content = await generateHashtags(topic, platform || "twitter");
        break;

      case "blog_post":
        if (!topic) {
          return NextResponse.json(
            { error: "topic is required for blog posts" },
            { status: 400 }
          );
        }
        content = await generateContentIdeas(topic, 3);
        content = typeof content === "string" ? content : content.content || content;
        break;

      case "campaign_outline":
        if (!topic) {
          return NextResponse.json(
            { error: "topic is required for campaign outlines" },
            { status: 400 }
          );
        }
        content = await generateCampaignOutline(
          objective || topic,
          targetAudience || "general audience",
          "2 weeks"
        );
        break;

      case "ab_test":
        if (!topic) {
          return NextResponse.json(
            { error: "topic is required for A/B test variations" },
            { status: 400 }
          );
        }
        content = await generateABTestVariations(topic, "headline");
        break;

      default:
        return NextResponse.json(
          { error: `Unknown content type: ${contentType}` },
          { status: 400 }
        );
    }

    const userId = request.headers.get("x-user-id") || "public-user"
    // During FREE_LAUNCH everyone is treated as Pro (unlimited generations).
    const freeLaunch = await isFreeLaunch()
    const isPro =
      freeLaunch || (userId !== "public-user" && (await hasActiveAISubscription(userId)))

    if (!isPro) {
      const usage = await getUserMonthlyUsage(userId)
      if (usage >= FREE_LIMIT) {
        return NextResponse.json(
          { error: "Free tier limit reached. Upgrade to Pro for unlimited generations.", upgradeRequired: true },
          { status: 402 }
        )
      }
      await incrementUserMonthlyUsage(userId)
    }

    // Count every generation toward the launch-phase auto-switch threshold.
    await recordAIGeneration()

    if (saveAsTemplate && templateTitle) {
      await prisma.aITemplate.create({
        data: {
          title: templateTitle,
          type: contentType,
          content: typeof content === "string" ? content : content.content,
          platform: platform || null,
          tone,
          createdBy: userId,
          isPublic: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      contentType,
      content:
        typeof content === "string" ? content : content.content || content,
      savedAsTemplate: saveAsTemplate && templateTitle,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content" },
      { status: 500 }
    );
  }
}
