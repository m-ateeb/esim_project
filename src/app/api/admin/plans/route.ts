import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { syncPackagesWithDatabase } from '@/lib/esimaccess';
import { CacheService } from '@/lib/redis';

// GET /api/admin/plans - Get all plans with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const country = searchParams.get('country') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { planName: { contains: search, mode: 'insensitive' } },
        { locationName: { contains: search, mode: 'insensitive' } },
        { planCategory: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (country) {
      where.OR = [
        { locationName: { contains: country, mode: 'insensitive' } },
        { country: { contains: country, mode: 'insensitive' } }
      ];
    }

    // Get plans with pagination
    const [plans, total] = await Promise.all([
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.plan.count({ where })
    ]);

    // Get categories for filter options
    const categories = await prisma.planCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    // Get countries for filter options
    const allPlans = await prisma.plan.findMany({
      select: { 
        locationName: true,
        country: true 
      }
    });
    const countries = [...new Set(
      allPlans
        .map(p => p.locationName || p.country)
        .filter(Boolean)
    )].sort();

    return NextResponse.json({
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
          statuses: ['ACTIVE', 'INACTIVE', 'DRAFT']
        },
        stats: {
          totalPlans: await prisma.plan.count(),
          activePlans: await prisma.plan.count({ where: { status: 'ACTIVE' } }),
          totalSales: await prisma.order.count(),
          totalRevenue: await prisma.order.aggregate({
            _sum: { finalAmount: true }
          }).then(result => Number(result._sum.finalAmount || 0))
        }
      }
    });
  } catch (error: any) {
    console.error('Failed to get plans:', error);
    return NextResponse.json(
      { error: 'Failed to get plans', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/plans - Create new plan
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      planName,
      planCategory,
      locationName,
      gbs,
      days,
      countryCodes,
      price,
      status,
      isPopular,
      features,
      maxSpeed,
      activationType,
      stockQuantity,
      categoryId
    } = body;

    if (!planName || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.create({
      data: {
        planName,
        planCategory,
        locationName,
        gbs: gbs ? Number(gbs) : null,
        days: days ? Number(days) : null,
        countryCodes,
        price: Number(price),
        status: status || 'DRAFT',
        isPopular: isPopular || false,
        features: features || [],
        maxSpeed: maxSpeed || '4G',
        activationType: activationType || 'INSTANT',
        stockQuantity: stockQuantity ? Number(stockQuantity) : 1000,
        categoryId
      },
      include: {
        category: true
      }
    });

    // Invalidate plans cache
    await CacheService.invalidatePlansCache();

    return NextResponse.json({
      success: true,
      data: plan
    });
  } catch (error: any) {
    console.error('Failed to create plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/plans - Update plan
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing plan ID' },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });

    // Invalidate plans cache
    await CacheService.invalidatePlansCache();

    return NextResponse.json({
      success: true,
      data: plan
    });
  } catch (error: any) {
    console.error('Failed to update plan:', error);
    return NextResponse.json(
      { error: 'Failed to update plan', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/plans - Delete plan
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing plan ID' },
        { status: 400 }
      );
    }

    // Check if plan has orders
    const orderCount = await prisma.order.count({
      where: { planId: id }
    });

    if (orderCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete plan with existing orders' },
        { status: 400 }
      );
    }

    await prisma.plan.delete({
      where: { id }
    });

    // Invalidate plans cache
    await CacheService.invalidatePlansCache();

    return NextResponse.json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (error: any) {
    console.error('Failed to delete plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete plan', details: error.message },
      { status: 500 }
    );
  }
}


