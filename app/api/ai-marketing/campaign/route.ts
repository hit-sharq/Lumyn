import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  buildCampaignBlueprint,
  generateMultiChannelCampaign,
  generateCampaignSchedule,
  generateCampaignAnalysis,
  generateCampaignMetrics,
  generateCampaignBrief,
} from "@/lib/ai/marketing/campaign-builder";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      objective,
      targetAudience,
      topic,
      channels,
      tone = "professional",
      duration = "2 weeks",
      saveCampaign = false,
      campaignTitle,
    } = body;

    if (!action) {
      return NextResponse.json(
        { error: "action is required" },
        { status: 400 }
      );
    }

    let result: any;

    switch (action) {
      case "blueprint":
        if (!objective || !targetAudience) {
          return NextResponse.json(
            { error: "objective and targetAudience are required" },
            { status: 400 }
          );
        }
        result = await buildCampaignBlueprint(
          objective,
          targetAudience,
          duration
        );
        break;

      case "multi_channel":
        if (!topic || !channels || channels.length === 0) {
          return NextResponse.json(
            { error: "topic and channels are required" },
            { status: 400 }
          );
        }
        result = await generateMultiChannelCampaign(topic, channels, tone);
        break;

      case "schedule":
        result = await generateCampaignSchedule(duration as any, 3);
        break;

      case "analysis":
        if (!objective || !targetAudience) {
          return NextResponse.json(
            { error: "objective and targetAudience are required" },
            { status: 400 }
          );
        }
        result = await generateCampaignAnalysis(objective, targetAudience);
        break;

      case "metrics":
        if (!objective || !channels || channels.length === 0) {
          return NextResponse.json(
            { error: "objective and channels are required" },
            { status: 400 }
          );
        }
        result = await generateCampaignMetrics(objective, channels);
        break;

      case "brief":
        if (!objective || !targetAudience) {
          return NextResponse.json(
            { error: "objective and targetAudience are required" },
            { status: 400 }
          );
        }
        result = await generateCampaignBrief(
          objective,
          targetAudience,
          tone,
          duration
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    // Optionally save campaign
    if (saveCampaign && campaignTitle && action === "multi_channel") {
      const userId = request.headers.get("x-user-id") || "public-user";
      await prisma.aICampaign.create({
        data: {
          title: campaignTitle,
          description: `Auto-generated campaign for: ${topic}`,
          createdBy: userId,
          objective: objective || "general",
          channels: channels || [],
          contentData: result || {},
          status: "draft",
        },
      });
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      saved: saveCampaign && campaignTitle,
    });
  } catch (error: any) {
    console.error("Campaign API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate campaign" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    const campaigns = await prisma.aICampaign.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      campaigns,
    });
  } catch (error: any) {
    console.error("Campaign fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
