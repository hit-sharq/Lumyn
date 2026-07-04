import { NextRequest, NextResponse } from "next/server";
import {
  optimizeContent,
  optimizeForPlatform,
  generateVariations,
  analyzePerformance,
} from "@/lib/ai/marketing/optimizer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      content,
      contentType,
      platform,
      numberOfVariations = 3,
      historicalMetrics,
    } = body;

    if (!content || !action) {
      return NextResponse.json(
        { error: "content and action are required" },
        { status: 400 }
      );
    }

    let result: any;

    switch (action) {
      case "optimize":
        if (!contentType) {
          return NextResponse.json(
            { error: "contentType is required for optimization" },
            { status: 400 }
          );
        }
        result = await optimizeContent(content, contentType, platform);
        break;

      case "optimize_platform":
        if (!platform) {
          return NextResponse.json(
            { error: "platform is required for platform optimization" },
            { status: 400 }
          );
        }
        result = await optimizeForPlatform(
          content,
          platform as "twitter" | "linkedin" | "instagram" | "email"
        );
        break;

      case "generate_variations":
        result = await generateVariations(content, numberOfVariations);
        break;

      case "analyze_performance":
        result = await analyzePerformance(content, contentType, historicalMetrics);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result,
    });
  } catch (error: any) {
    console.error("Optimization API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to optimize content" },
      { status: 500 }
    );
  }
}
