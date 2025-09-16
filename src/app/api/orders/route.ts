import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const cacheKey = CACHE_KEYS.USER_ORDERS(userId) + `:${status || 'all'}:${page}:${limit}`;

    const result = await CacheService.getOrSet(
      cacheKey,
      async () => {
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = { userId };
        if (status) {
          where.status = status;
        }

        // Get orders with pagination
        const [orders, total] = await Promise.all([
          prisma.order.findMany({
            where,
            include: {
              plan: {
                select: {
                  id: true,
                  planName: true,
                  locationName: true,
                  gbs: true,
                  days: true,
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.order.count({ where })
        ]);

        return {
          success: true,
          data: {
            orders,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit)
            }
          }
        };
      },
      CACHE_TTL.SHORT
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Failed to get orders:', error);
    return NextResponse.json(
      { error: 'Failed to get orders', details: error.message },
      { status: 500 }
    );
  }
}