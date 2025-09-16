import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

// GET /api/plans/[id] - Get plan by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const cacheKey = CACHE_KEYS.PLAN_BY_ID(id);

    const result = await CacheService.getOrSet(
      cacheKey,
      async () => {
        const plan = await prisma.plan.findUnique({
          where: { id },
          include: {
            category: true,
            _count: {
              select: {
                orders: true,
                userPlans: true
              }
            }
          }
        });

        if (!plan) {
          return null;
        }

        return { success: true, data: plan };
      },
      CACHE_TTL.MEDIUM
    );

    if (!result) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Failed to get plan by ID:', error);
    return NextResponse.json(
      { error: 'Failed to get plan by ID', details: error.message },
      { status: 500 }
    );
  }
}
