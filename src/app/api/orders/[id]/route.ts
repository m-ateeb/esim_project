import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

// GET /api/orders/[id] - Get order by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: orderId } = await context.params;
    const cacheKey = CACHE_KEYS.ORDER_BY_ID(orderId);

    const result = await CacheService.getOrSet(
      cacheKey,
      async () => {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            plan: {
              select: {
                name: true,
                dataAmount: true,
                duration: true,
                countries: true,
                features: true
              }
            },
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        });

        if (!order) {
          return null;
        }

        // Check if user owns this order or is admin
        if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
          return { error: 'Unauthorized', status: 403 };
        }

        return { success: true, data: order };
      },
      CACHE_TTL.SHORT
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    // Shape plan fields to what the UI expects
    const shaped = {
      ...order,
      plan: order.plan
        ? {
            name: (order.plan as any).planName || 'eSIM Plan',
            dataAmount: (order.plan as any).gbs ? `${(order.plan as any).gbs} GB` : '—',
            duration: (order.plan as any).days || 0
          }
        : null
    } as any;

    return NextResponse.json({
      success: true,
      data: shaped
    });
  } catch (error: any) {
    console.error('Failed to get order:', error);
    return NextResponse.json(
      { error: 'Failed to get order', details: error.message },
      { status: 500 }
    );
  }
}
