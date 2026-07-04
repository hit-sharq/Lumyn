import { generateText } from "ai";

const getModel = () => {
  return process.env.AI_MODEL || "google/gemini-2.0-flash-exp";
};

export interface OptimizationResult {
  original: string;
  optimized: string;
  improvements: string[];
  score: {
    readability: number;
    engagement: number;
    clarity: number;
  };
}

export async function optimizeContent(
  content: string,
  contentType: "email" | "social" | "ad" | "headline",
  platform?: string
): Promise<OptimizationResult> {
  const prompt = `You are a content optimization expert. Improve this ${contentType} content.
Original content: ${content}
${platform ? `Platform: ${platform}` : ""}

Provide:
1. OPTIMIZED version that is more engaging and effective
2. List 3-4 specific improvements made
3. Score the original and optimized on: readability (0-10), engagement (0-10), clarity (0-10)

Format response as JSON: {
  "optimized": "...",
  "improvements": ["...", "...", "..."],
  "original_scores": {"readability": X, "engagement": X, "clarity": X},
  "optimized_scores": {"readability": X, "engagement": X, "clarity": X}
}`;

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.7,
    });

    const parsed = JSON.parse(result.text);

    return {
      original: content,
      optimized: parsed.optimized,
      improvements: parsed.improvements,
      score: {
        readability: (parsed.optimized_scores?.readability || 8) / 10,
        engagement: (parsed.optimized_scores?.engagement || 8) / 10,
        clarity: (parsed.optimized_scores?.clarity || 8) / 10,
      },
    };
  } catch (error) {
    console.error("Optimization error:", error);
    throw new Error("Failed to optimize content");
  }
}

export async function optimizeForSEO(
  content: string,
  keywords: string[]
): Promise<{ optimized: string; seoScore: number; suggestions: string[] }> {
  const prompt = `You are an SEO expert. Optimize this content for search engines.
Content: ${content}
Target keywords: ${keywords.join(", ")}

Requirements:
- Naturally incorporate keywords
- Improve readability
- Add engaging subheadings if applicable
- Rate SEO optimization (0-100)
- Provide 3 specific suggestions

Format as JSON: {
  "optimized": "...",
  "seoScore": X,
  "suggestions": ["...", "...", "..."]
}`;

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.6,
    });

    const parsed = JSON.parse(result.text);

    return {
      optimized: parsed.optimized,
      seoScore: parsed.seoScore / 100,
      suggestions: parsed.suggestions,
    };
  } catch (error) {
    console.error("SEO optimization error:", error);
    throw new Error("Failed to optimize for SEO");
  }
}

export async function optimizeForPlatform(
  content: string,
  platform: "twitter" | "linkedin" | "instagram" | "email"
): Promise<{ optimized: string; nativeChanges: string[] }> {
  const platformGuidelines = {
    twitter: "Max 280 characters, use hashtags, keep it punchy",
    linkedin: "Professional tone, encourage discussion, use line breaks",
    instagram: "Emojis for personality, call-to-action clear, hashtags at end",
    email: "Clear subject line, personalization, strong CTA, scannable",
  };

  const prompt = `You are a ${platform} expert. Optimize this content for ${platform}.
Content: ${content}
Platform guidelines: ${platformGuidelines[platform]}

Make native optimizations for ${platform}:
1. Adjust length and format
2. Add platform-specific elements (hashtags, emojis, line breaks, etc.)
3. Optimize for ${platform} algorithm

Format as JSON: {
  "optimized": "...",
  "changes": ["...", "...", "..."],
  "characterCount": X,
  "estimatedEngagement": "high/medium/low"
}`;

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.7,
    });

    const parsed = JSON.parse(result.text);

    return {
      optimized: parsed.optimized,
      nativeChanges: parsed.changes,
    };
  } catch (error) {
    console.error("Platform optimization error:", error);
    throw new Error(`Failed to optimize for ${platform}`);
  }
}

export async function generateVariations(
  originalContent: string,
  numberOfVariations: number = 3,
  tone?: string
): Promise<string[]> {
  const prompt = `You are a creative copywriter. Generate ${numberOfVariations} variations of this content.
Original: ${originalContent}
${tone ? `Tone: ${tone}` : ""}

Requirements:
- Different angles and approaches
- Same core message
- Varied length and style
- Optimized for different audiences

Generate ONLY the variations, numbered 1-${numberOfVariations}, one per line.`;

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.8,
    });

    return result.text
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .slice(0, numberOfVariations);
  } catch (error) {
    console.error("Variation generation error:", error);
    throw new Error("Failed to generate variations");
  }
}

export async function analyzePerformance(
  content: string,
  contentType: string,
  historicalMetrics?: { impressions: number; clicks: number; conversions: number }
): Promise<{
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  predictedPerformance: "high" | "medium" | "low";
}> {
  const prompt = `You are a marketing analyst. Analyze this ${contentType} content performance.
Content: ${content}
${historicalMetrics ? `Historical metrics: Impressions: ${historicalMetrics.impressions}, Clicks: ${historicalMetrics.clicks}, Conversions: ${historicalMetrics.conversions}` : ""}

Analyze:
1. Strengths: What works well
2. Weaknesses: What could improve
3. Specific improvement suggestions (3-4)
4. Predicted performance: high/medium/low based on content quality

Format as JSON: {
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "suggestions": ["...", "..."],
  "predictedPerformance": "..."
}`;

  try {
    const result = await generateText({
      model: getModel() as any,
      prompt,
      temperature: 0.6,
    });

    const parsed = JSON.parse(result.text);

    return {
      strengths: parsed.strengths,
      weaknesses: parsed.weaknesses,
      improvementSuggestions: parsed.suggestions,
      predictedPerformance: parsed.predictedPerformance,
    };
  } catch (error) {
    console.error("Performance analysis error:", error);
    throw new Error("Failed to analyze performance");
  }
}
