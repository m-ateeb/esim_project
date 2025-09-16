import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { paymentService } from '@/lib/payments';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, quantity = 1, promoCode, paymentMethod } = body;

    if (!planId) {
      return NextResponse.json(
        { error: 'Missing required field: planId' },
        { status: 400 }
      );
    }

    // Get plan details
    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Calculate pricing
    let unitPrice = Number(plan.price);
    let totalAmount = unitPrice * quantity;
    let discountAmount = 0;
    let finalAmount = totalAmount;

    // Apply promo code if provided
    let appliedPromoCode = null;
    if (promoCode) {
      const promo = await prisma.promoCode.findFirst({
        where: {
          code: promoCode,
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
          OR: [
            { applicablePlans: { has: planId } },
            { applicablePlans: { isEmpty: true } }
          ],
          OR: [
            { applicableUsers: { has: session.user.id } },
            { applicableUsers: { isEmpty: true } }
          ]
        }
      });

      if (promo && promo.currentUses < (promo.maxUses || Infinity)) {
        appliedPromoCode = promo;
        
        if (promo.type === 'PERCENTAGE') {
          discountAmount = (totalAmount * Number(promo.value)) / 100;
          if (promo.maxDiscount) {
            discountAmount = Math.min(discountAmount, Number(promo.maxDiscount));
          }
        } else if (promo.type === 'FIXED_AMOUNT') {
          discountAmount = Number(promo.value);
        }
        
        finalAmount = totalAmount - discountAmount;
      }
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        planId,
        quantity,
        unitPrice,
        totalAmount,
        discountAmount,
        finalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: paymentMethod || 'STRIPE',
        promoCodeId: appliedPromoCode?.id,
        billingEmail: session.user.email || '',
        billingName: session.user.name || '',
        billingCountry: session.user.country || ''
      }
    });

    // Create Stripe payment intent
    const paymentIntent = await paymentService.createPaymentIntent({
      amount: Math.round(finalAmount * 100), // Convert to cents
      currency: 'usd',
      orderId: order.id,
      customerEmail: session.user.email || '',
      metadata: {
        planId,
        planName: plan.name,
        quantity: quantity.toString(),
        promoCode: promoCode || ''
      }
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentIntentId: paymentIntent.id
      }
    });

    // Update promo code usage if applied
    if (appliedPromoCode) {
      await prisma.promoCode.update({
        where: { id: appliedPromoCode.id },
        data: {
          currentUses: appliedPromoCode.currentUses + 1
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: finalAmount,
        currency: 'usd'
      }
    });
  } catch (error: any) {
    console.error('Failed to create payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: error.message },
      { status: 500 }
    );
  }
}
