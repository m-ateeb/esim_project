import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { paymentService } from '@/lib/payments';

// POST /api/checkout/session - Get Stripe client_secret for an order's PaymentIntent
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.stripePaymentIntentId) {
      return NextResponse.json({ error: 'No payment intent for order' }, { status: 400 });
    }

    const pi = await paymentService.getPaymentIntent(order.stripePaymentIntentId);

    return NextResponse.json({
      success: true,
      data: {
        paymentIntentId: pi.id,
        clientSecret: (pi as any).client_secret,
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
      },
    });
  } catch (error: any) {
    console.error('Failed to get checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to get checkout session', details: error.message },
      { status: 500 }
    );
  }
}


