import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

// GET /api/admin/dashboard - Get dashboard data for admin
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

    // Check cache first
    const cacheKey = CACHE_KEYS.ADMIN_DASHBOARD;

    const result = await CacheService.getOrSet(
      cacheKey,
      async () => {
        // Get overview stats
        const [
          totalUsers,
          totalOrders,
          totalRevenue,
          activePlans,
          previousTotalUsers,
          previousTotalOrders,
          previousTotalRevenue,
          previousActivePlans
        ] = await Promise.all([
          prisma.user.count(),
          prisma.order.count(),
          prisma.order.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { finalAmount: true }
          }),
          prisma.plan.count({ where: { status: 'ACTIVE' } }),
          // Previous period stats (last 30 days)
          prisma.user.count({
            where: { 
              createdAt: { 
                gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
                lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)   // 30 days ago
              }
            }
          }),
          prisma.order.count({
            where: { 
              createdAt: { 
                gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            }
          }),
          prisma.order.aggregate({
            where: { 
              status: 'COMPLETED',
              createdAt: { 
                gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            },
            _sum: { finalAmount: true }
          }),
          prisma.plan.count({ 
            where: { 
              status: 'ACTIVE',
              createdAt: { 
                gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            }
          })
        ]);

        // Calculate growth percentages
        const userGrowth = previousTotalUsers > 0 
          ? ((totalUsers - previousTotalUsers) / previousTotalUsers) * 100 
          : 0;
        const orderGrowth = previousTotalOrders > 0 
          ? ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100 
          : 0;
        const revenueGrowth = (previousTotalRevenue._sum.finalAmount || 0) > 0 
          ? (((totalRevenue._sum.finalAmount || 0) - (previousTotalRevenue._sum.finalAmount || 0)) / (previousTotalRevenue._sum.finalAmount || 0)) * 100 
          : 0;
        const planGrowth = previousActivePlans > 0 
          ? ((activePlans - previousActivePlans) / previousActivePlans) * 100 
          : 0;

        // Get recent orders
        const recentOrders = await prisma.order.findMany({
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            },
            plan: {
              select: {
                planName: true,
                locationName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        });

        // Get recent users
        const recentUsers = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        });

        // Get top plans
        const topPlans = await prisma.plan.findMany({
          include: {
            _count: {
              select: { orders: true }
            }
          },
          orderBy: { orders: { _count: 'desc' } },
          take: 10
        });

        const topPlansWithRevenue = await Promise.all(
          topPlans.map(async (plan) => {
            const revenue = await prisma.order.aggregate({
              where: { 
                planId: plan.id,
                status: 'COMPLETED'
              },
              _sum: { finalAmount: true }
            });
            return {
              id: plan.id,
              planName: plan.planName,
              locationName: plan.locationName,
              orders: plan._count.orders,
              revenue: revenue._sum.finalAmount || 0
            };
          })
        );

        return {
          success: true,
          data: {
            overview: {
              totalRevenue: totalRevenue._sum.finalAmount || 0,
              totalUsers,
              totalOrders,
              activePlans,
              revenueGrowth: Math.round(revenueGrowth * 100) / 100,
              userGrowth: Math.round(userGrowth * 100) / 100,
              orderGrowth: Math.round(orderGrowth * 100) / 100,
              planGrowth: Math.round(planGrowth * 100) / 100
            },
            recentOrders,
            recentUsers,
            topPlans: topPlansWithRevenue
          }
        };
      },
      CACHE_TTL.SHORT
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Failed to get dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to get dashboard data', details: error.message },
      { status: 500 }
    );
  }
}
