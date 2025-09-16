import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

// GET /api/admin/orders - Get all orders for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const cacheKey = `admin:orders:${JSON.stringify({ page, limit, status, search })}`;

    const result = await CacheService.getOrSet(
      cacheKey,
      async () => {
        // Build where clause
        const where: any = {};
        if (status && status !== 'all') {
          where.status = status;
        }
        if (search) {
          where.OR = [
            { orderNumber: { contains: search, mode: 'insensitive' } },
            { user: { name: { contains: search, mode: 'insensitive' } } },
            { user: { email: { contains: search, mode: 'insensitive' } } },
            { plan: { planName: { contains: search, mode: 'insensitive' } } },
            { plan: { locationName: { contains: search, mode: 'insensitive' } } }
          ];
        }

        // Get orders with pagination
        const [orders, total] = await Promise.all([
          prisma.order.findMany({
            where,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              },
              plan: {
                select: {
                  id: true,
                  planName: true,
                  locationName: true
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
    console.error('Failed to get admin orders:', error);
    return NextResponse.json(
      { error: 'Failed to get orders', details: error.message },
      { status: 500 }
    );
  }
}
