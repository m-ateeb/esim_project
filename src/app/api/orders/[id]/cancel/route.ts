import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/orders/:id/cancel - Cancel an order if unpaid
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order || order.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus !== "PENDING") {
      return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" as any },
    });

    // Optional: email notification
    try {
      const { emailService } = await import("@/lib/email");
      const template = emailService.getOrderCancelledEmail?.(order.orderNumber || order.id);
      if (template) {
        await emailService.sendEmail({
          to: order.billingEmail || (session.user as any).email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
      }
    } catch (e) {
      console.warn("Failed to send order cancelled email");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cancel order failed:", error);
    return NextResponse.json({ error: "Cancel order failed", details: error.message }, { status: 500 });
  }
}


