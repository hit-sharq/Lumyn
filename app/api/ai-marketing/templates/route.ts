import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const platform = searchParams.get("platform");
    const isPublic = searchParams.get("public") === "true";
    const userId = request.headers.get("x-user-id");

    const where: any = {};

    if (type) where.type = type;
    if (platform) where.platform = platform;

    if (isPublic) {
      where.isPublic = true;
    } else if (userId) {
      // User's own templates + public templates
      where.OR = [
        { createdBy: userId },
        { isPublic: true }
      ];
    }

    const templates = await prisma.aITemplate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error: any) {
    console.error("Templates fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      type,
      content,
      platform,
      tone,
      isPublic = false,
      metadata,
    } = body;

    if (!title || !type || !content) {
      return NextResponse.json(
        { error: "title, type, and content are required" },
        { status: 400 }
      );
    }

    const template = await prisma.aITemplate.create({
      data: {
        title,
        type,
        content,
        platform: platform || null,
        tone: tone || null,
        isPublic,
        createdBy: userId,
        metadata: metadata || {},
      },
    });

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error: any) {
    console.error("Template creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create template" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("id");

    if (!userId || !templateId) {
      return NextResponse.json(
        { error: "User ID and template ID are required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, tone, isPublic, metadata } = body;

    // Verify ownership
    const template = await prisma.aITemplate.findUnique({
      where: { id: templateId },
    });

    if (!template || template.createdBy !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const updated = await prisma.aITemplate.update({
      where: { id: templateId },
      data: {
        title: title || template.title,
        content: content || template.content,
        tone: tone !== undefined ? tone : template.tone,
        isPublic: isPublic !== undefined ? isPublic : template.isPublic,
        metadata: metadata || template.metadata,
      },
    });

    return NextResponse.json({
      success: true,
      template: updated,
    });
  } catch (error: any) {
    console.error("Template update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update template" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("id");

    if (!userId || !templateId) {
      return NextResponse.json(
        { error: "User ID and template ID are required" },
        { status: 401 }
      );
    }

    // Verify ownership
    const template = await prisma.aITemplate.findUnique({
      where: { id: templateId },
    });

    if (!template || template.createdBy !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.aITemplate.delete({
      where: { id: templateId },
    });

    return NextResponse.json({
      success: true,
      message: "Template deleted",
    });
  } catch (error: any) {
    console.error("Template deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete template" },
      { status: 500 }
    );
  }
}
