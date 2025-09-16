import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import paymentService from "@/lib/payments";

// POST /api/admin/refunds/:id/approve - Approve a refund request and create Stripe refund
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const refundRequest = await prisma.refund.findUnique({
      where: { id: params.id },
      include: { order: true },
    });

    if (!refundRequest) {
      return NextResponse.json({ error: "Refund request not found" }, { status: 404 });
    }

    if (refundRequest.status !== "PENDING") {
      return NextResponse.json({ error: "Refund request already processed" }, { status: 400 });
    }

    const order = refundRequest.order as any;
    if (!order?.stripePaymentIntentId) {
      return NextResponse.json({ error: "Order has no Stripe payment" }, { status: 400 });
    }

    const amountCents = Math.round(Number(order.finalAmount || 0) * 100);
    if (!amountCents || amountCents <= 0) {
      return NextResponse.json({ error: "Invalid order amount" }, { status: 400 });
    }

    // Create refund in Stripe
    const refund = await paymentService.createRefund({
      paymentIntentId: order.stripePaymentIntentId,
      amount: amountCents,
      reason: "requested_by_customer",
    });

    // Update DB statuses
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "REFUNDED" as any,
          status: "REFUNDED" as any,
          updatedAt: new Date(),
        },
      }),
      prisma.refund.update({
        where: { id: refundRequest.id },
        data: {
          status: "APPROVED",
          stripeRefundId: refund.id,
          approvedAt: new Date(),
        },
      }),
    ]);

    // Send email notification
    try {
      const { emailService } = await import("@/lib/email");
      const template = emailService.getRefundApprovedEmail?.(order.orderNumber || order.id, (amountCents / 100).toFixed(2));
      if (template) {
        await emailService.sendEmail({
          to: order.billingEmail || (refundRequest.userId as string),
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
      }
    } catch (e) {
      console.warn("Failed to send refund approved email");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Approve refund failed:", error);
    return NextResponse.json({ error: "Approve refund failed", details: error.message }, { status: 500 });
  }
}


