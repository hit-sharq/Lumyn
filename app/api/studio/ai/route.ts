import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GenerateRequest {
  prompt: string;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json() as GenerateRequest;

    if (!prompt || prompt.length < 5) {
      return NextResponse.json({ error: 'Prompt too short' }, { status: 400 });
    }

    // Simple AI mixer: parse keywords → template traits
    const lowerPrompt = prompt.toLowerCase();
    
    // Layout/category detection
    const category = lowerPrompt.includes('portfolio') || lowerPrompt.includes('resume') ? 'portfolio' :
                    lowerPrompt.includes('landing') || lowerPrompt.includes('product') ? 'landing' :
                    lowerPrompt.includes('agency') ? 'agency' :
                    lowerPrompt.includes('blog') ? 'blog' : 'portfolio';

    // Theme/tags detection
    const tags: string[] = [];
    if (lowerPrompt.includes('dark')) tags.push('dark');
    if (lowerPrompt.includes('minimal') || lowerPrompt.includes('minimalist')) tags.push('minimal');
    if (lowerPrompt.includes('modern')) tags.push('modern');
    if (lowerPrompt.includes('creative') || lowerPrompt.includes('color')) tags.push('creative');
    tags.push(...category.split('portfolio')[0] || '');

    // Generate title and description
    const titleWords = prompt.split(' ').slice(0, 4).join(' ');
    const title = `${titleWords.charAt(0).toUpperCase() + titleWords.slice(1)} Template`;
    
    const descriptions = {
      portfolio: 'Custom portfolio generated from your prompt.',
      landing: 'High-converting landing page tailored to your needs.',
      agency: 'Professional agency site with your unique style.',
      blog: 'Clean blog design for content creators.'
    };
    const description = descriptions[category as keyof typeof descriptions] || 'AI-generated template.';

    // Unsplash preview (dynamic based on category)
    const unsplashQueries = {
      portfolio: 'developer portfolio',
      landing: 'landing page mockup',
      agency: 'agency website',
      blog: 'blog mockup'
    };
    const query = unsplashQueries[category as keyof typeof unsplashQueries] || 'website mockup';
    const previewImage = `https://images.unsplash.com/photo?${query.replace(' ', '+')}&w=400&h=300&fit=crop`;

    // Create AI-generated template
    const aiTemplate = await prisma.studioTemplate.create({
      data: {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        category,
        previewImage,
        previewImages: [previewImage],
        tags,
        isFree: true,
        price: 0,
        featured: false,
        isPublished: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      template: aiTemplate,
      message: `AI generated "${title}" for you!` 
    });

  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

