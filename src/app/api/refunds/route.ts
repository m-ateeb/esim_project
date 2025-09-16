import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/refunds - Request a refund for an order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, reason } = body;

    if (!orderId || !reason) {
      return NextResponse.json(
        { error: "Order ID and reason are required" },
        { status: 400 }
      );
    }

    // Check order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus !== "COMPLETED") {
      return NextResponse.json(
        { error: "Refund is only allowed for completed payments" },
        { status: 400 }
      );
    }

    // Create refund request
    const refund = await prisma.refund.create({
      data: {
        orderId,
        userId: session.user.id,
        reason,
        status: "PENDING",
      },
    });

    // Optional: send acknowledgment email
    try {
      const { emailService } = await import("@/lib/email");
      const { getRefundRequestReceivedEmail } = emailService as any;
      if (emailService && typeof emailService.sendEmail === 'function') {
        const template = emailService.getRefundRequestReceivedEmail?.(order.orderNumber || order.id);
        if (template) {
          await emailService.sendEmail({
            to: order.billingEmail || (session.user.email as string),
            subject: template.subject,
            html: template.html,
            text: template.text,
          });
        }
      }
    } catch (e) {
      console.warn('Failed to send refund request acknowledgment email');
    }

    return NextResponse.json({
      success: true,
      data: refund,
    });
  } catch (error: any) {
    console.error("Refund request failed:", error);
    return NextResponse.json(
      { error: "Refund request failed", details: error.message },
      { status: 500 }
    );
  }
}
