export const marketingPrompts = {
  socialPost: (platform: string, topic: string, tone: string = "professional") => `
You are an expert social media marketer. Generate a compelling ${platform} post about: ${topic}
Tone: ${tone}
Requirements:
- Engaging and concise
- ${platform === "twitter" ? "Under 280 characters" : ""}
- ${platform === "linkedin" ? "Professional but personable" : ""}
- Include relevant call-to-action
- ${platform === "twitter" ? "Add 1-2 relevant hashtags" : ""}
${platform === "instagram" ? "- Can be longer, use emojis naturally" : ""}

Generate ONLY the post content, no explanations.
`,

  emailCopyShort: (subject: string, product: string, tone: string = "friendly") => `
You are an expert email copywriter. Write a short, persuasive email.
Subject: ${subject}
Product/Service: ${product}
Tone: ${tone}

Requirements:
- Start with engaging hook
- 2-3 benefit-focused paragraphs
- Clear, compelling CTA
- Personable and authentic
- Under 100 words

Generate ONLY the email body, no subject line.
`,

  emailCopyLong: (subject: string, product: string, tone: string = "professional") => `
You are an expert email copywriter. Write a detailed, persuasive email.
Subject: ${subject}
Product/Service: ${product}
Tone: ${tone}

Requirements:
- Compelling subject line (make it punchy and curiosity-inducing)
- Personable opening
- 3-4 benefit-focused sections with subheadings
- Social proof or testimonial element
- Strong CTA with urgency
- Professional sign-off
- 150-300 words

Generate the complete email including subject line.
`,

  adCopy: (product: string, audience: string, platform: string = "facebook") => `
You are an expert ad copywriter. Write compelling ad copy.
Product: ${product}
Target Audience: ${audience}
Platform: ${platform}

Requirements:
${platform === "facebook" ? "- Headline (max 27 characters)" : ""}
${platform === "google" ? "- Headline 1, 2, 3 (max 30 chars each)" : ""}
- Body text that highlights unique value
- Clear, action-oriented CTA
- Create urgency or exclusivity
- Speak directly to audience pain points

Generate ONLY the ad copy structured clearly.
`,

  landingPageCopy: (productName: string, productCategory: string) => `
You are an expert landing page copywriter. Write compelling landing page sections.
Product: ${productName}
Category: ${productCategory}

Generate sections for:
1. HEADLINE: Compelling main headline (max 10 words)
2. SUBHEADLINE: Supporting message (max 15 words)
3. HERO_CTA: Button text
4. BENEFIT_1, BENEFIT_2, BENEFIT_3: Top three benefits
5. CTA_BUTTON: Final CTA text

Format as JSON: {"HEADLINE": "...", "SUBHEADLINE": "...", etc}
`,

  contentIdeas: (topic: string, numberOfIdeas: number = 5) => `
You are a creative content strategist. Generate ${numberOfIdeas} unique content ideas.
Topic: ${topic}

Requirements:
- Mix different content types (blog, video, infographic, social series, case study)
- Specific angles and hooks
- Clear target audience for each idea
- Actionable and implementable

Format as JSON array with: {"title": "...", "type": "...", "angle": "...", "audience": "..."}
`,

  hashtagGenerator: (topic: string, platform: string = "twitter") => `
You are a social media expert. Generate relevant hashtags.
Topic: ${topic}
Platform: ${platform}

Requirements:
${platform === "twitter" ? "- Mix trending and niche hashtags (5-10 total)" : ""}
${platform === "instagram" ? "- Include popular and niche tags (15-25 total)" : ""}
${platform === "linkedin" ? "- Professional hashtags (3-5 total)" : ""}
- Relevant to the topic
- Currently popular or evergreen
- Mix of broad and specific

Generate ONLY hashtags, one per line, without explanation.
`,

  toneAnalyzer: (content: string) => `
You are a content tone analyzer. Analyze this content and suggest improvements.
Content: ${content}

Analyze:
1. Current tone (formal, casual, aggressive, friendly, etc.)
2. Consistency with professional brand voice
3. Specific phrases to improve
4. Overall effectiveness

Format response as JSON with these keys: {"currentTone": "...", "issues": [...], "suggestions": {...}}
`,

  campaignOutline: (objective: string, targetAudience: string, duration: string = "2 weeks") => `
You are a marketing strategist. Create a campaign outline.
Objective: ${objective}
Target Audience: ${targetAudience}
Duration: ${duration}

Plan:
1. CAMPAIGN_THEME: Main message (max 10 words)
2. Week 1 MESSAGE: Focus
3. Week 2 MESSAGE: Focus
${duration.includes("3") ? "4. Week 3 MESSAGE: Focus" : ""}
5. PLATFORMS: Best channels for this audience
6. KEY_METRICS: What to measure
7. CALLS_TO_ACTION: Specific CTAs for each phase

Format as JSON.
`,

  abTestVariations: (originalCopy: string, testType: string = "headline") => `
You are an A/B testing expert. Create variations of this ${testType}.
Original: ${originalCopy}

Generate 2 alternative versions:
1. More emotional/benefit-focused
2. More direct/urgent

Requirements:
- Same length or shorter
- Different angle
- Optimized for higher conversion

Format as JSON: {"original": "...", "variation_1": "...", "variation_2": "..."}
`,
};

export const generatePrompt = (
  contentType: string,
  params: Record<string, any>
): string => {
  const prompts: Record<string, any> = marketingPrompts;
  
  const promptFn = Object.entries(prompts).find(([key]) =>
    contentType.toLowerCase().includes(key.replace(/([A-Z])/g, "_$1").toLowerCase())
  );

  if (promptFn) {
    const [, fn] = promptFn;
    return fn(params);
  }

  return `Generate marketing content of type: ${contentType}\nContext: ${JSON.stringify(params)}`;
};
