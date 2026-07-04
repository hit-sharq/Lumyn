import { generateText } from "ai";
import { generateMultiPlatformContent } from "./content-generator";

const getModel = () => {
  return process.env.AI_MODEL || "google/gemini-2.0-flash-exp";
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
  const prompt = `You are a marketing strategist. Create a detailed campaign blueprint.
Objective: ${objective}
Target Audience: ${targetAudience}
Duration: ${duration}
${budget ? `Budget: $${budget}` : ""}

Create a comprehensive blueprint with:
1. Campaign theme (main message)
2. Key messaging points (3-4)
3. Best channels for this audience
4. Key performance metrics
5. Call-to-action strategy

Format as JSON: {
  "theme": "...",
  "objective": "...",
  "messages": ["...", "..."],
  "channels": ["...", "..."],
  "metrics": ["...", "..."],
  "ctaStrategy": "..."
}`;

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
      if (content.error) {
        result[platform] = { body: "", metadata: { error: content.error } };
        continue;
      }

      // Parse the content - it could be a string or have a content property
      const contentStr =
        typeof content === "string" ? content : content.content || "";

      if (includeHeadlines && platform !== "email") {
        // Generate a headline for non-email platforms
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
  const prompt = `You are a campaign scheduler. Create a ${campaignDuration} campaign schedule with ${numberOfPhases} phases.

For each phase provide:
1. Duration and dates
2. Key message focus
3. Recommended frequency
4. Channel priorities
5. Specific deliverables

Format as JSON: {
  "phases": [
    {
      "phase": 1,
      "startDate": "...",
      "endDate": "...",
      "focus": "...",
      "frequency": "...",
      "primaryChannels": ["...", "..."],
      "deliverables": ["...", "..."]
    }
  ]
}`;

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
  const prompt = `You are a market analyst. Analyze this campaign opportunity.
Objective: ${campaignObjective}
Target Audience: ${targetAudience}
${competitors ? `Competitors: ${competitors.join(", ")}` : ""}

Provide:
1. Market opportunity assessment
2. Audience pain points (3-4)
3. Key messaging angles
4. Competitive positioning
5. Success factors
6. Potential challenges
7. Recommended channels

Format as JSON: {
  "opportunity": "...",
  "painPoints": ["...", "..."],
  "angles": ["...", "..."],
  "positioning": "...",
  "successFactors": ["...", "..."],
  "challenges": ["...", "..."],
  "recommendedChannels": ["...", "..."]
}`;

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
  const prompt = `You are a campaign optimization expert. Optimize this multi-channel content.
Current content: ${contentStr}
Target audience: ${targetAudience}
Objective: ${objective}

Analyze each channel and suggest optimizations for:
1. Relevance to audience
2. Alignment with objective
3. Platform best practices
4. Consistency across channels
5. Engagement potential

Format optimized content as JSON with same structure, and provide array of improvements made.`;

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
    // Return original content if optimization fails
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
  const prompt = `You are a marketing analyst. Define metrics for this campaign.
Objective: ${campaignObjective}
Channels: ${channels.join(", ")}

Provide:
1. Primary success metrics (2-3)
2. Secondary metrics (2-3)
3. Realistic targets for this campaign
4. Industry benchmarks for comparison

Format as JSON: {
  "primaryMetrics": ["...", "..."],
  "secondaryMetrics": ["...", "..."],
  "targets": {"metric": X, ...},
  "benchmarks": {"metric": X, ...}
}`;

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
  const prompt = `You are a marketing director. Create a concise campaign brief.
Objective: ${objective}
Target Audience: ${targetAudience}
Tone: ${tone}
Duration: ${duration}

Include:
- Executive summary
- Campaign objectives (SMART)
- Key messaging
- Audience insights
- Channel strategy
- Timeline and milestones
- Success metrics
- Budget considerations

Write as a professional brief (300-400 words).`;

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
