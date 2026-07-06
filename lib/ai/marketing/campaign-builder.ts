import { generateText } from "ai";
import { createGoogle } from "@ai-sdk/google";
import { generateMultiPlatformContent } from "./content-generator";

const getModel = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  const googleProvider = createGoogle({ apiKey });
  return googleProvider("gemini-2.5-flash");
};

export interface CampaignBlueprint {
  theme: string;
  objective: string;
  messages: string[];
  channels: string[];
  metrics: string[];
  ctaStrategy: string;
}

export interface MultiChannelContent {
  [key: string]: {
    headline?: string;
    body: string;
    cta?: string;
    metadata?: Record<string, any>;
  };
}

export async function buildCampaignBlueprint(
  objective: string,
  targetAudience: string,
  duration: string = "2 weeks",
  budget?: number
): Promise<CampaignBlueprint> {
  const prompt = "You are a marketing strategist. Create a detailed campaign blueprint.\nObjective: " + objective + "\nTarget Audience: " + targetAudience + "\nDuration: " + duration + (budget ? "\nBudget: $" + budget : "") + "\n\nCreate a comprehensive blueprint with:\n1. Campaign theme (main message)\n2. Key messaging points (3-4)\n3. Best channels for this audience\n4. Key performance metrics\n5. Call-to-action strategy\n\nFormat as JSON.";

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.7,
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error("Campaign blueprint error:", error);
    throw new Error("Failed to build campaign blueprint");
  }
}

export async function generateMultiChannelCampaign(
  topic: string,
  channels: string[],
  tone: string = "professional",
  includeHeadlines: boolean = true
): Promise<MultiChannelContent> {
  try {
    const platformContent = await generateMultiPlatformContent(topic, channels, tone);
    const result: MultiChannelContent = {};

    for (const [platform, content] of Object.entries(platformContent)) {
      if ((content as any).error) {
        result[platform] = { body: "", metadata: { error: (content as any).error } };
        continue;
      }

      const contentStr =
        typeof content === "string" ? content : (content as any).content || "";

      if (includeHeadlines && platform !== "email") {
        const headline = contentStr.split("\n")[0] || contentStr.slice(0, 50);
        result[platform] = {
          headline,
          body: contentStr,
          metadata: { platform, tone },
        };
      } else {
        result[platform] = {
          body: contentStr,
          metadata: { platform, tone },
        };
      }
    }

    return result;
  } catch (error) {
    console.error("Multi-channel generation error:", error);
    throw new Error("Failed to generate multi-channel campaign");
  }
}

export async function generateCampaignSchedule(
  campaignDuration: "1_week" | "2_weeks" | "1_month" | "quarter",
  numberOfPhases: number = 3
) {
  const prompt = "You are a campaign scheduler. Create a " + campaignDuration + " campaign schedule with " + numberOfPhases + " phases.\n\nFor each phase provide: duration, dates, key message focus, frequency, channel priorities, and specific deliverables.\n\nFormat as JSON.";

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.6,
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error("Schedule generation error:", error);
    throw new Error("Failed to generate campaign schedule");
  }
}

export async function generateCampaignAnalysis(
  campaignObjective: string,
  targetAudience: string,
  competitors?: string[]
) {
  const prompt = "You are a market analyst. Analyze this campaign opportunity.\nObjective: " + campaignObjective + "\nTarget Audience: " + targetAudience + (competitors ? "\nCompetitors: " + competitors.join(", ") : "") + "\n\nProvide: market opportunity assessment, audience pain points, key messaging angles, competitive positioning, success factors, potential challenges, and recommended channels.\n\nFormat as JSON.";

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.7,
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error("Campaign analysis error:", error);
    throw new Error("Failed to analyze campaign");
  }
}

export async function optimizeCampaignContent(
  content: MultiChannelContent,
  targetAudience: string,
  objective: string
): Promise<{ optimized: MultiChannelContent; improvements: string[] }> {
  const contentStr = JSON.stringify(content, null, 2);
  const prompt = "You are a campaign optimization expert. Optimize this multi-channel content.\nCurrent content: " + contentStr + "\nTarget audience: " + targetAudience + "\nObjective: " + objective + "\n\nAnalyze each channel and suggest optimizations for relevance, alignment, platform best practices, consistency, and engagement.\n\nFormat optimized content as JSON with improvements array.";

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.7,
    });

    const parsed = JSON.parse(result.text);

    return {
      optimized: parsed.optimized || content,
      improvements: parsed.improvements || [],
    };
  } catch (error) {
    console.error("Campaign optimization error:", error);
    return {
      optimized: content,
      improvements: ["Optimization service temporarily unavailable"],
    };
  }
}

export async function generateCampaignMetrics(
  campaignObjective: string,
  channels: string[]
): Promise<{
  primaryMetrics: string[];
  secondaryMetrics: string[];
  targets: Record<string, number>;
  benchmarks: Record<string, number>;
}> {
  const prompt = "You are a marketing analyst. Define metrics for this campaign.\nObjective: " + campaignObjective + "\nChannels: " + channels.join(", ") + "\n\nProvide: primary success metrics (2-3), secondary metrics (2-3), realistic targets, and industry benchmarks.\n\nFormat as JSON.";

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.6,
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error("Metrics generation error:", error);
    throw new Error("Failed to generate campaign metrics");
  }
}

export async function generateCampaignBrief(
  objective: string,
  targetAudience: string,
  tone: string = "professional",
  duration: string = "2 weeks"
): Promise<string> {
  const prompt = "You are a marketing director. Create a concise campaign brief.\nObjective: " + objective + "\nTarget Audience: " + targetAudience + "\nTone: " + tone + "\nDuration: " + duration + "\n\nInclude: executive summary, campaign objectives (SMART), key messaging, audience insights, channel strategy, timeline, success metrics, and budget considerations.\n\nWrite as a professional brief (300-400 words).";

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.7,
    });

    return result.text;
  } catch (error) {
    console.error("Brief generation error:", error);
    throw new Error("Failed to generate campaign brief");
  }
}
