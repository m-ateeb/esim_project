import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/invoices - Get user's invoices
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get user's orders as invoices
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { 
          userId: session.user.id,
          status: 'COMPLETED'
        },
        include: {
          plan: {
            select: {
              planName: true,
              locationName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({
        where: { 
          userId: session.user.id,
          status: 'COMPLETED'
        }
      })
    ]);

    // Transform orders into invoice format
    const invoices = orders.map(order => ({
      id: order.id,
      invoiceNumber: `INV-${order.orderNumber}`,
      amount: order.finalAmount,
      status: 'paid',
      description: `${order.plan.planName || order.plan.locationName || 'eSIM Plan'} - ${order.quantity} ${order.quantity > 1 ? 'plans' : 'plan'}`,
      planName: order.plan.planName || order.plan.locationName || 'eSIM Plan',
      createdAt: order.createdAt,
      paidAt: order.paidAt || order.createdAt,
      downloadUrl: `/api/invoices/${order.id}/download`
    }));

    return NextResponse.json({
      success: true,
      data: {
        invoices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    console.error('Failed to get invoices:', error);
    return NextResponse.json(
      { error: 'Failed to get invoices', details: error.message },
      { status: 500 }
    );
  }
}
