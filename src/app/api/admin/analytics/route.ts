import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

// GET /api/admin/analytics - Get analytics data for admin
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
    const range = searchParams.get('range') || '30d';
    const cacheKey = CACHE_KEYS.ADMIN_ANALYTICS + `:${range}`;

    const result = await CacheService.getOrSet(
      cacheKey,
      async () => {
        // Calculate date range
        const now = new Date();
        let startDate = new Date();
        
        switch (range) {
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(now.getDate() - 90);
            break;
          case '1y':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
          default:
            startDate.setDate(now.getDate() - 30);
        }

    // Get previous period for growth calculations
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(startDate);
    previousStartDate.setTime(startDate.getTime() - (now.getTime() - startDate.getTime()));

    // Overview stats
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
      prisma.user.count({
        where: { createdAt: { lt: startDate } }
      }),
      prisma.order.count({
        where: { createdAt: { gte: previousStartDate, lt: startDate } }
      }),
      prisma.order.aggregate({
        where: { 
          status: 'COMPLETED',
          createdAt: { gte: previousStartDate, lt: startDate }
        },
        _sum: { finalAmount: true }
      }),
      prisma.plan.count({ 
        where: { 
          status: 'ACTIVE',
          createdAt: { lt: startDate }
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

    // Top performing plans
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

    // Top countries (based on plan locations)
    const topCountries = await prisma.plan.groupBy({
      by: ['locationName'],
      _count: { orders: true },
      orderBy: { orders: { _count: 'desc' } },
      take: 10
    });

    const topCountriesWithRevenue = await Promise.all(
      topCountries.map(async (country) => {
        const revenue = await prisma.order.aggregate({
          where: { 
            plan: { locationName: country.locationName },
            status: 'COMPLETED'
          },
          _sum: { finalAmount: true }
        });
        return {
          country: country.locationName || 'Unknown',
          orders: country._count.orders,
          revenue: revenue._sum.finalAmount || 0
        };
      })
    );

    // Recent activity
    const recentOrders = await prisma.order.findMany({
      include: {
        user: { select: { name: true } },
        plan: { select: { planName: true, locationName: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const recentActivity = recentOrders.map(order => ({
      id: order.id,
      type: 'order' as const,
      description: `New order from ${order.user.name} for ${order.plan.planName || order.plan.locationName}`,
      timestamp: order.createdAt.toISOString(),
      amount: order.finalAmount
    }));

    // Monthly stats for the selected range
    const monthlyStats = [];
    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const [monthUsers, monthOrders, monthRevenue] = await Promise.all([
        prisma.user.count({
          where: { 
            createdAt: { gte: monthStart, lte: monthEnd }
          }
        }),
        prisma.order.count({
          where: { 
            createdAt: { gte: monthStart, lte: monthEnd }
          }
        }),
        prisma.order.aggregate({
          where: { 
            status: 'COMPLETED',
            createdAt: { gte: monthStart, lte: monthEnd }
          },
          _sum: { finalAmount: true }
        })
      ]);

      monthlyStats.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        users: monthUsers,
        orders: monthOrders,
        revenue: monthRevenue._sum.finalAmount || 0
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

        return {
          success: true,
          data: {
            overview: {
              totalUsers,
              totalOrders,
              totalRevenue: totalRevenue._sum.finalAmount || 0,
              activePlans,
              userGrowth: Math.round(userGrowth * 100) / 100,
              orderGrowth: Math.round(orderGrowth * 100) / 100,
              revenueGrowth: Math.round(revenueGrowth * 100) / 100,
              planGrowth: Math.round(planGrowth * 100) / 100
            },
            topPlans: topPlansWithRevenue,
            topCountries: topCountriesWithRevenue,
            recentActivity,
            monthlyStats
          }
        };
      },
      CACHE_TTL.SHORT
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Failed to get analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics', details: error.message },
      { status: 500 }
    );
  }
}