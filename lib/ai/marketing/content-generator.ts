import { generateText, streamText } from "ai";
import { createGoogle } from "@ai-sdk/google";
import { marketingPrompts, generatePrompt } from "./prompts";

const getModel = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  const googleProvider = createGoogle({ apiKey });
  return googleProvider("gemini-2.5-flash");
};

export async function generateMarketingContent(
  contentType: string,
  params: Record<string, any>,
  streaming: boolean = false
) {
  const prompt = generatePrompt(contentType, params);
  const model = getModel();

  try {
    if (streaming) {
      return await streamText({
        model: model as any,
        prompt,
        temperature: 0.7,
      });
    } else {
      const result = await generateText({
        model: model as any,
        prompt,
        temperature: 0.7,
      });

      return {
        content: result.text,
        usage: {
          promptTokens: (result as any).usage?.promptTokens || 0,
          completionTokens: (result as any).usage?.completionTokens || 0,
        },
      };
    }
  } catch (error) {
    console.error("Content generation error:", error);
    throw new Error(`Failed to generate ${contentType}: ${error}`);
  }
}

export async function generateSocialPost(
  platform: "twitter" | "linkedin" | "instagram" | "tiktok",
  topic: string,
  tone: string = "professional",
  streaming: boolean = false
) {
  return generateMarketingContent(
    "socialPost",
    { platform, topic, tone },
    streaming
  );
}

export async function generateEmailCopy(
  subject: string,
  product: string,
  length: "short" | "long" = "short",
  tone: string = "friendly",
  streaming: boolean = false
) {
  const contentType = length === "short" ? "emailCopyShort" : "emailCopyLong";
  return generateMarketingContent(
    contentType,
    { subject, product, tone },
    streaming
  );
}

export async function generateAdCopy(
  product: string,
  audience: string,
  platform: "facebook" | "google" | "linkedin" | "instagram" = "facebook",
  streaming: boolean = false
) {
  return generateMarketingContent(
    "adCopy",
    { product, audience, platform },
    streaming
  );
}

export async function generateLandingPageCopy(
  productName: string,
  productCategory: string,
  streaming: boolean = false
) {
  return generateMarketingContent(
    "landingPageCopy",
    { productName, productCategory },
    streaming
  );
}

export async function generateContentIdeas(
  topic: string,
  numberOfIdeas: number = 5,
  streaming: boolean = false
) {
  return generateMarketingContent(
    "contentIdeas",
    { topic, numberOfIdeas },
    streaming
  );
}

export async function generateHashtags(
  topic: string,
  platform: "twitter" | "instagram" | "linkedin" | "tiktok" = "twitter",
  streaming: boolean = false
) {
  return generateMarketingContent(
    "hashtagGenerator",
    { topic, platform },
    streaming
  );
}

export async function analyzeTone(
  content: string,
  streaming: boolean = false
) {
  return generateMarketingContent(
    "toneAnalyzer",
    { content },
    streaming
  );
}

export async function generateCampaignOutline(
  objective: string,
  targetAudience: string,
  duration: string = "2 weeks",
  streaming: boolean = false
) {
  return generateMarketingContent(
    "campaignOutline",
    { objective, targetAudience, duration },
    streaming
  );
}

export async function generateABTestVariations(
  originalCopy: string,
  testType: "headline" | "body" | "cta" = "headline",
  streaming: boolean = false
) {
  return generateMarketingContent(
    "abTestVariations",
    { originalCopy, testType },
    streaming
  );
}

export async function generateMultiPlatformContent(
  topic: string,
  platforms: string[],
  tone: string = "professional"
) {
  const results: Record<string, any> = {};

  const platformPromises = platforms.map(async (platform) => {
    try {
      const content = await generateSocialPost(
        platform as any,
        topic,
        tone,
        false
      );
      results[platform] = content;
    } catch (error) {
      console.error(`Error generating for ${platform}:`, error);
      results[platform] = { error: `Failed to generate content for ${platform}` };
    }
  });

  await Promise.all(platformPromises);
  return results;
}
