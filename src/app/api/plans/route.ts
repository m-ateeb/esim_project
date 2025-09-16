import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

// GET /api/plans - Get all active plans with filters or single plan by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId');
    const onlyFilters = searchParams.get('onlyFilters') === 'true';
    
    // If planId is provided, return single plan
    if (planId) {
      const cacheKey = CACHE_KEYS.PLAN_BY_ID(planId);
      
      const result = await CacheService.getOrSet(
        cacheKey,
        async () => {
          const plan = await prisma.plan.findUnique({
            where: { 
              id: planId,
              status: 'ACTIVE'
            },
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

          return {
            success: true,
            data: {
              plans: [plan]
            }
          };
        },
        CACHE_TTL.MEDIUM
      );

      if (!result) {
        return NextResponse.json(
          { error: 'Plan not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(result);
    }

    // Otherwise, return filtered plans or only filters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const country = searchParams.get('country') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const dataAmount = searchParams.get('dataAmount') || '';
    const duration = searchParams.get('duration') || '';

    // Create cache key for filtered results
    const cacheKey = `plans_${JSON.stringify({ onlyFilters, page, limit, search, categoryId, country, minPrice, maxPrice, dataAmount, duration })}`;
    const cachedPlans = getCachedData(cacheKey);
    if (cachedPlans) {
      const res = NextResponse.json(cachedPlans);
      res.headers.set('Cache-Control', onlyFilters ? 's-maxage=3600, stale-while-revalidate=86400' : 's-maxage=300, stale-while-revalidate=600');
      return res;
    }

    const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
          status: 'ACTIVE' // Only show active plans
        };
        
        if (search) {
          where.OR = [
            ...(where.OR || []),
            { planName: { contains: search, mode: 'insensitive' } },
            { locationName: { contains: search, mode: 'insensitive' } },
            { planCategory: { contains: search, mode: 'insensitive' } }
          ];
        }

        if (categoryId) {
          where.categoryId = categoryId;
        }

        if (country) {
          where.AND = [
            ...(where.AND || []),
            { OR: [
              { locationName: { contains: country, mode: 'insensitive' } },
              { country: { contains: country, mode: 'insensitive' } }
            ]}
          ];
        }

        if (minPrice) {
          where.price = { gte: parseFloat(minPrice) };
        }

        if (maxPrice) {
          where.price = { ...where.price, lte: parseFloat(maxPrice) };
        }

        if (dataAmount && dataAmount !== 'Unlimited') {
          const gbAmount = parseFloat(dataAmount.replace('GB', ''));
          if (!Number.isNaN(gbAmount)) {
            where.gbs = { gte: gbAmount };
          }
        }

        if (duration) {
          where.days = parseInt(duration);
        }

    let plans: any[] = [];
    let total = 0;

    if (!onlyFilters) {
      // Get plans with pagination
      const result = await Promise.all([
        prisma.plan.findMany({
          where,
          include: {
            category: true,
            _count: {
              select: {
                orders: true,
                userPlans: true
              }
            }
          },
          orderBy: [
            { isPopular: 'desc' },
            { createdAt: 'desc' }
          ],
          skip,
          take: limit
        }),
        prisma.plan.count({ where })
      ]);
      plans = result[0];
      total = result[1];
    }

    // Get categories for filter options (lightweight)
    const categories = await prisma.planCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    // Get countries for filter options using a lightweight grouping query
    // Avoids loading entire plans table into memory
    const countryGroups = await prisma.plan.groupBy({
      by: ['locationName', 'country'],
      where: { status: 'ACTIVE' },
      _count: { _all: true }
    });
    const countriesWithIso = countryGroups
      .map((g: any) => {
        const name = g.locationName || g.country;
        if (!name) return null;
        // If country field looks like ISO alpha-2, keep it; else null
        const iso = (g.country && /^[A-Za-z]{2}$/.test(g.country)) ? g.country.toUpperCase() : null;
        return { name, iso };
      })
      .filter(Boolean) as Array<{ name: string; iso: string | null }>;
    const countries = [...new Set(countriesWithIso.map((c) => c.name))].sort();
    const countriesWithIsoUnique = Array.from(
      countriesWithIso.reduce((map, curr) => {
        if (!map.has(curr.name)) map.set(curr.name, curr);
        return map;
      }, new Map<string, { name: string; iso: string | null }>()).values()
    ).sort((a, b) => a.name.localeCompare(b.name));

    const result = {
      success: true,
      data: {
        plans,
        pagination: {
          page,
          limit,
          total,
          pages: limit > 0 ? Math.ceil((total || 0) / limit) : 0
        },
        filters: {
          categories,
          countries,
          countriesWithIso: countriesWithIsoUnique,
          dataAmounts: ['1GB', '2GB', '5GB', '10GB', '20GB', '50GB', '100GB', 'Unlimited'],
          durations: [7, 15, 30, 60, 90, 180, 365]
        }
      }
    };
        return {
          success: true,
          data: {
            plans,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit)
            },
            filters: {
              categories,
              countries,
              dataAmounts: ['1GB', '2GB', '5GB', '10GB', '20GB', '50GB', '100GB', 'Unlimited'],
              durations: [7, 15, 30, 60, 90, 180, 365]
            }
          }
        };
      },
      CACHE_TTL.MEDIUM
    );

    // Cache the result
    setCachedData(cacheKey, result);
    const res = NextResponse.json(result);
    res.headers.set('Cache-Control', onlyFilters ? 's-maxage=3600, stale-while-revalidate=86400' : 's-maxage=300, stale-while-revalidate=600');
    return res;
  } catch (error: any) {
    console.error('Failed to get plans:', error);
    return NextResponse.json(
      { error: 'Failed to get plans', details: error.message },
      { status: 500 }
    );
  }
}
