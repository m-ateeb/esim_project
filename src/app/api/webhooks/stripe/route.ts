import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/payments';
import { prisma } from '@/lib/prisma';
import { notificationService } from '@/lib/notifications';
import emailService from '@/lib/email';
import { createOrder, activateEsim } from '@/lib/esimaccess';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  try {
    const event = paymentService.verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Received Stripe webhook event:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
}

// Handle successful payment
async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    const { orderId, customerEmail } = paymentIntent.metadata;

    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // Update order payment status
    await paymentService.updateOrderPaymentStatus(orderId, paymentIntent.id, 'COMPLETED');

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { plan: true, user: true }
    });

    if (!order) {
      console.error('Order not found:', orderId);
      return;
    }

    // Send order confirmation notification
    await notificationService.sendOrderConfirmation(
      order.userId,
      order.orderNumber,
      order.plan?.name || 'eSIM Plan',
      `$${order.finalAmount}`
    );

    // If this is an eSIM order, activate it
    if (order.esimAccessOrderId) {
      try {
        const activatedOrder = await activateEsim(order.esimAccessOrderId);
        
        // Generate QR code
        let qrCodeUrl = null;
        if (activatedOrder.qr_code) {
          qrCodeUrl = await QRCode.toDataURL(activatedOrder.qr_code);
        }

        // Update order with activation details
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'COMPLETED',
            esimCode: activatedOrder.esim_code,
            esimQrCode: qrCodeUrl,
            activationDate: new Date(),
            expiryDate: activatedOrder.expiry_date ? new Date(activatedOrder.expiry_date) : null,
            esimAccessData: activatedOrder
          }
        });

        // Create user plan
        if (order.planId) {
          await prisma.userPlan.create({
            data: {
              userId: order.userId,
              planId: order.planId,
              orderId: order.id,
              status: 'ACTIVE',
              activationDate: new Date(),
              expiryDate: activatedOrder.expiry_date ? new Date(activatedOrder.expiry_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              esimAccessId: activatedOrder.id,
              esimAccessData: activatedOrder
            }
          });
        }

        // Send eSIM activation notification
        await notificationService.sendEsimActivation(order.userId, order.orderNumber);

        // Also send dedicated eSIM activation email with QR code
        if (order.billingEmail && qrCodeUrl) {
          const tmpl = emailService.getEsimActivationEmail(
            order.orderNumber,
            qrCodeUrl,
            'On your iPhone: Settings > Cellular > Add eSIM. Scan the QR. On Android: Settings > Network & Internet > SIMs > Add eSIM. Scan the QR. Ensure you are connected to Wi‑Fi during activation.'
          );
          await emailService.sendEmail({
            to: order.billingEmail,
            subject: tmpl.subject,
            html: tmpl.html,
            text: tmpl.text
          });
        }

        console.log('eSIM activated successfully for order:', orderId);
      } catch (error) {
        console.error('Failed to activate eSIM for order:', orderId, error);
      }
    }

    console.log('Payment succeeded for order:', orderId);
  } catch (error) {
    console.error('Failed to handle payment succeeded:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent: any) {
  try {
    const { orderId } = paymentIntent.metadata;

    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // Update order payment status
    await paymentService.updateOrderPaymentStatus(orderId, paymentIntent.id, 'FAILED');

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (order) {
      // Send payment failed notification
      await notificationService.sendNotification({
        userId: order.userId,
        title: 'Payment Failed',
        message: `Your payment for order ${order.orderNumber} has failed. Please try again or contact support.`,
        type: 'ERROR',
        sendEmail: true,
        sendSms: false
      });
    }

    console.log('Payment failed for order:', orderId);
  } catch (error) {
    console.error('Failed to handle payment failed:', error);
  }
}

// Handle canceled payment
async function handlePaymentCanceled(paymentIntent: any) {
  try {
    const { orderId } = paymentIntent.metadata;

    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // Update order payment status
    await paymentService.updateOrderPaymentStatus(orderId, paymentIntent.id, 'CANCELLED');

    console.log('Payment canceled for order:', orderId);
  } catch (error) {
    console.error('Failed to handle payment canceled:', error);
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    console.log('Invoice payment succeeded:', invoice.id);
    // Handle subscription renewals or recurring payments
  } catch (error) {
    console.error('Failed to handle invoice payment succeeded:', error);
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: any) {
  try {
    console.log('Invoice payment failed:', invoice.id);
    // Handle failed subscription payments
  } catch (error) {
    console.error('Failed to handle invoice payment failed:', error);
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log('Subscription created:', subscription.id);
    // Handle new subscription setup
  } catch (error) {
    console.error('Failed to handle subscription created:', error);
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log('Subscription updated:', subscription.id);
    // Handle subscription changes
  } catch (error) {
    console.error('Failed to handle subscription updated:', error);
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log('Subscription deleted:', subscription.id);
    // Handle subscription cancellation
  } catch (error) {
    console.error('Failed to handle subscription deleted:', error);
  }
}