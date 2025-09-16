import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createOrder, getOrderStatus, activateEsim, getEsimUsage, cancelOrder } from '@/lib/esimaccess';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';

// POST /api/integrations/esimaccess/orders - Create new eSIM order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { packageId, customerData } = body;

    if (!packageId || !customerData) {
      return NextResponse.json(
        { error: 'Missing required fields: packageId, customerData' },
        { status: 400 }
      );
    }

    // Create order in eSIM Access
    const esimOrder = await createOrder(packageId, customerData);

    // Generate QR code if available
    let qrCodeUrl = null;
    if (esimOrder.qr_code) {
      try {
        qrCodeUrl = await QRCode.toDataURL(esimOrder.qr_code);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    }

    // Create order in our database
    const order = await prisma.order.create({
      data: {
        orderNumber: `ESIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        planId: packageId,
        unitPrice: 0, // Will be updated from plan
        totalAmount: 0, // Will be updated from plan
        finalAmount: 0, // Will be updated from plan
        status: 'PENDING',
        paymentStatus: 'PENDING',
        esimAccessOrderId: esimOrder.id,
        esimAccessData: esimOrder,
        esimQrCode: qrCodeUrl,
        billingEmail: customerData.email,
        billingName: customerData.name,
        billingCountry: customerData.country
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        esimOrderId: esimOrder.id,
        qrCodeUrl,
        status: esimOrder.status
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

// GET /api/integrations/esimaccess/orders/[id] - Get order status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId parameter' },
        { status: 400 }
      );
    }

    // Get order from our database
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { orderNumber: orderId },
          { esimAccessOrderId: orderId }
        ],
        userId: session.user.id
      },
      include: {
        plan: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get latest status from eSIM Access
    if (order.esimAccessOrderId) {
      try {
        const esimOrderStatus = await getOrderStatus(order.esimAccessOrderId);
        
        // Update order status if changed
        if (esimOrderStatus && esimOrderStatus.status !== order.status) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: esimOrderStatus.status as any,
              esimCode: esimOrderStatus.esim_code,
              esimQrCode: esimOrderStatus.qr_code ? await QRCode.toDataURL(esimOrderStatus.qr_code) : null,
              activationDate: esimOrderStatus.activation_date ? new Date(esimOrderStatus.activation_date) : null,
              expiryDate: esimOrderStatus.expiry_date ? new Date(esimOrderStatus.expiry_date) : null
            }
          });
        }

        return NextResponse.json({
          success: true,
          data: {
            order: {
              ...order,
              esimStatus: esimOrderStatus
            }
          }
        });
      } catch (error) {
        console.error('Failed to get eSIM order status:', error);
        // Return local order data if eSIM API fails
        return NextResponse.json({
          success: true,
          data: { order }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: { order }
    });
  } catch (error: any) {
    console.error('Failed to get order:', error);
    return NextResponse.json(
      { error: 'Failed to get order', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/integrations/esimaccess/orders/[id]/activate - Activate eSIM
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }

    // Get order from our database
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { orderNumber: orderId },
          { esimAccessOrderId: orderId }
        ],
        userId: session.user.id
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (!order.esimAccessOrderId) {
      return NextResponse.json(
        { error: 'Order not linked to eSIM Access' },
        { status: 400 }
      );
    }

    // Activate eSIM in eSIM Access
    const activatedOrder = await activateEsim(order.esimAccessOrderId);

    // Update order in our database
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'COMPLETED',
        esimCode: activatedOrder.esim_code,
        esimQrCode: activatedOrder.qr_code ? await QRCode.toDataURL(activatedOrder.qr_code) : null,
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
          expiryDate: activatedOrder.expiry_date ? new Date(activatedOrder.expiry_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
          esimAccessId: activatedOrder.id,
          esimAccessData: activatedOrder
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        order: updatedOrder,
        esimOrder: activatedOrder
      }
    });
  } catch (error: any) {
    console.error('Failed to activate eSIM:', error);
    return NextResponse.json(
      { error: 'Failed to activate eSIM', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/integrations/esimaccess/orders/[id] - Cancel order
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const reason = searchParams.get('reason') || 'Cancelled by user';

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId parameter' },
        { status: 400 }
      );
    }

    // Get order from our database
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { orderNumber: orderId },
          { esimAccessOrderId: orderId }
        ],
        userId: session.user.id
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Cancel order in eSIM Access if linked
    if (order.esimAccessOrderId) {
      try {
        await cancelOrder(order.esimAccessOrderId, reason);
      } catch (error) {
        console.error('Failed to cancel order in eSIM Access:', error);
      }
    }

    // Update order in our database
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'CANCELLED'
      }
    });

    return NextResponse.json({
      success: true,
      data: { order: updatedOrder }
    });
  } catch (error: any) {
    console.error('Failed to cancel order:', error);
    return NextResponse.json(
      { error: 'Failed to cancel order', details: error.message },
      { status: 500 }
    );
  }
}
