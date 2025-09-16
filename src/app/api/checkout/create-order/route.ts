import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { paymentService } from '@/lib/payments';
import { createOrder as createEsimAccessOrder } from '@/lib/esimaccess';
import QRCode from 'qrcode';
import { CacheService } from '@/lib/redis';

// POST /api/checkout/create-order - Create order and payment intent
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, quantity = 1, promoCode, billingDetails } = body;

    if (!planId || !billingDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the plan
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { category: true }
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    if (plan.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Plan is not available' },
        { status: 400 }
      );
    }

    // Check stock if applicable
    if (plan.stockQuantity !== null && plan.stockQuantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Calculate pricing
    let unitPrice = Number(plan.price);
    let discountAmount = 0;
    let finalAmount = unitPrice * quantity;

    // Apply promo code if provided
    let promoCodeId: string | null = null;
    if (promoCode) {
      const promo = await prisma.promoCode.findFirst({
        where: {
          code: promoCode,
          isActive: true,
          validFrom: { lte: new Date() },
          OR: [
            { validUntil: null },
            { validUntil: { gt: new Date() } }
          ]
        }
      });

      if (promo) {
        if (promo.type === 'PERCENTAGE') {
          discountAmount = (finalAmount * Number(promo.value)) / 100;
        } else {
          discountAmount = Math.min(Number(promo.value), finalAmount);
        }

        finalAmount -= discountAmount;
        promoCodeId = promo.id;
      }
    }

    // Create order
    let order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        planId: plan.id,
        quantity,
        unitPrice,
        totalAmount: unitPrice * quantity,
        discountAmount,
        finalAmount,
        status: 'PENDING',
        promoCodeId,
        billingName: billingDetails.name,
        billingEmail: billingDetails.email,
        billingAddress: billingDetails.address,
        billingCity: billingDetails.city,
        billingCountry: billingDetails.country,
        billingPostalCode: billingDetails.postalCode,
        paymentStatus: 'PENDING'
      }
    });

    // If plan is eSIM-enabled, pre-create an eSIM Access order and store IDs/QR for later activation
    if (plan.isEsimEnabled) {
      try {
        const packageId = plan.planId || plan.esimAccessId || plan.id;
        const esimOrder = await createEsimAccessOrder(packageId, {
          email: billingDetails.email,
          name: billingDetails.name,
          country: billingDetails.country
        });

        let qrCodeUrl: string | null = null;
        if (esimOrder.qr_code) {
          try {
            qrCodeUrl = await QRCode.toDataURL(esimOrder.qr_code);
          } catch (e) {
            console.error('Failed to generate QR data URL:', e);
          }
        }

        order = await prisma.order.update({
          where: { id: order.id },
          data: {
            esimAccessOrderId: esimOrder.id,
            esimAccessData: esimOrder as any,
            esimQrCode: qrCodeUrl
          }
        });
      } catch (e) {
        console.error('Failed to pre-create eSIM order:', e);
      }
    }

    // Create Stripe payment intent
    const paymentIntent = await paymentService.createPaymentIntent({
      amount: Math.round(finalAmount * 100), // Convert to cents
      currency: 'usd',
      orderId: order.id,
      customerEmail: billingDetails.email,
      metadata: {
        planId: plan.id,
        planName: plan.name,
        quantity: quantity.toString()
      }
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id }
    });

    // Invalidate user orders cache
    await CacheService.invalidateUserCache(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        order,
        paymentIntent: {
          clientSecret: paymentIntent.client_secret,
          id: paymentIntent.id
        }
      }
    });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}
