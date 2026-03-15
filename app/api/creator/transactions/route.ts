import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch all transactions from all revenue streams
    const [marketPurchases, studioPurchases, paymentOrders] = await Promise.all([
      prisma.marketPurchase.findMany({
        where: {
          product: {
            creator: { userId }
          }
        },
        include: {
          product: { select: { title: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      prisma.studioPurchase.findMany({
        where: { userId },
        include: {
          template: { select: { title: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      prisma.paymentOrder.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    ]);

    // Combine and format transactions
    const transactions = [
      ...marketPurchases.map(p => ({
        id: p.id,
        type: 'market' as const,
        title: `${p.product.title} sold`,
        amount: p.amount,
        date: p.createdAt.toISOString(),
        status: 'completed' as const
      })),
      ...studioPurchases.map(p => ({
        id: p.id,
        type: 'studio' as const,
        title: `${p.template.title} purchased`,
        amount: p.amount,
        date: p.createdAt.toISOString(),
        status: 'completed' as const
      })),
      ...paymentOrders.map(p => ({
        id: p.id,
        type: 'market' as const,
        title: `Payment received`,
        amount: p.netPayout,
        date: p.createdAt.toISOString(),
        status: p.status === 'COMPLETED' ? 'completed' : 'pending' as const
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('[v0] Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
