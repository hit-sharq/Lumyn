import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic();

interface AITemplateRequest {
  prompt: string;
  category?: string;
  pricing?: number;
}

// Template generation prompt
const TEMPLATE_SYSTEM_PROMPT = `You are an expert web template designer. Generate a complete, production-ready HTML/CSS template based on the user's description.

IMPORTANT RULES:
1. Generate ONLY valid HTML and CSS
2. Include modern, professional styling
3. Make it mobile-responsive
4. Include proper typography and spacing
5. Use a clean color scheme
6. Include placeholder content that matches the category
7. Return a complete HTML file with embedded CSS
8. Do NOT include any markdown, explanations, or code blocks
9. Start directly with <!DOCTYPE html>

Generate a template for: `;

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    const { prompt, category, pricing = 5000 } = (await request.json()) as AITemplateRequest;

    if (!prompt || prompt.length < 10) {
      return NextResponse.json({ error: 'Prompt too short (min 10 characters)' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    // Get or create creator profile
    let creatorProfile = await prisma.marketCreatorProfile.findUnique({
      where: { userId },
    });

    if (!creatorProfile) {
      creatorProfile = await prisma.marketCreatorProfile.create({
        data: {
          userId,
          userEmail: user?.emailAddresses[0]?.emailAddress || '',
          displayName: user?.firstName || 'AI Creator',
        },
      });
    }

    // Call Claude to generate HTML template
    console.log('[v0] Calling Claude to generate template...');
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: TEMPLATE_SYSTEM_PROMPT + prompt,
        },
      ],
      system: TEMPLATE_SYSTEM_PROMPT.slice(0, -TEMPLATE_SYSTEM_PROMPT.length + 50),
    });

    const htmlContent = message.content[0].type === 'text' ? message.content[0].text : '';

    if (!htmlContent.includes('<!DOCTYPE')) {
      throw new Error('Invalid template generated');
    }

  

    // Create product in market (not studio)
    const product = await prisma.marketProduct.create({
      data: {
        creatorId: creatorProfile.id,
        title: `AI: ${prompt.substring(0, 50)}`,
        description: `AI-generated template based on: "${prompt}"`,
        category: category || 'landing',
        price: pricing,
        fileUrl: `data:text/html;base64,${Buffer.from(htmlContent).toString('base64')}`,
        previewImage: `https://images.unsplash.com/photo-1633356122544-f134324ef6f8?w=400&h=300&fit=crop`,
        tags: ['ai-generated', 'template', category || 'landing'],
        isPublished: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        previewImage: product.previewImage,
      },
      message: `Template generated successfully! 🎨`,
    });
  } catch (error: any) {
    console.error('[v0] AI generation error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Template generation failed' },
      { status: 500 }
    );
  }
}
