import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;

    // This would need a username field in LaunchPortfolio or a separate username table
    // For now, we'll fetch by displayName or create a lookup
    const creator = await prisma.marketCreatorProfile.findFirst({
      where: {
        displayName: {
          equals: username,
          mode: 'insensitive'
        }
      },
      include: {
        products: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            price: true,
            previewImage: true,
            tags: true,
            salesCount: true
          },
          orderBy: { createdAt: 'desc' },
          take: 12
        }
      }
    });

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: creator.id,
      displayName: creator.displayName,
      bio: creator.bio,
      avatarUrl: creator.avatarUrl,
      website: creator.website,
      twitter: creator.twitter,
      isVerified: creator.isVerified,
      tier: 'bronze', // Default tier - add to schema if needed
      followers: 0, // Default followers - add to schema if needed
      products: creator.products
    });
  } catch (error) {
    console.error('[v0] Error fetching creator:', error);
    return NextResponse.json(
      { error: 'Failed to fetch creator' },
      { status: 500 }
    );
  }
}
