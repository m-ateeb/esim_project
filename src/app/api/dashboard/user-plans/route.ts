import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

// GET /api/dashboard/user-plans - Get user's plans and dashboard stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const cacheKey = CACHE_KEYS.USER_PLANS(userId);

    const result = await CacheService.getOrSet(
      cacheKey,
      async () => {
        // Get user's plans
        const userPlans = await prisma.userPlan.findMany({
          where: { userId },
          include: {
            plan: {
              select: {
                id: true,
                planName: true,
                locationName: true,
                gbs: true,
                days: true,
                price: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        // Calculate stats
        const activePlans = userPlans.filter(up => up.isActive).length;
        
        // Calculate total data used (simplified - you might want to track this more accurately)
        const totalDataUsed = userPlans.reduce((total, up) => {
          const dataUsedMB = parseFloat(up.dataUsed.replace('MB', '').replace('GB', '')) * (up.dataUsed.includes('GB') ? 1024 : 1);
          return total + dataUsedMB;
        }, 0);
        
        const dataUsedFormatted = totalDataUsed > 1024 
          ? `${(totalDataUsed / 1024).toFixed(1)}GB` 
          : `${totalDataUsed.toFixed(0)}MB`;

        // Count unique countries visited
        const countriesVisited = new Set(
          userPlans
            .map(up => up.plan.locationName)
            .filter(Boolean)
        ).size;

        // Calculate total spent
        const totalSpent = userPlans.reduce((total, up) => {
          return total + Number(up.plan.price);
        }, 0);

        return {
          success: true,
          data: {
            userPlans,
            stats: {
              activePlans,
              dataUsed: dataUsedFormatted,
              countriesVisited,
              totalSpent
            }
          }
        };
      },
      CACHE_TTL.SHORT
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Failed to get user plans:', error);
    return NextResponse.json(
      { error: 'Failed to get user plans', details: error.message },
      { status: 500 }
    );
  }
}