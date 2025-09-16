import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { applyWebhookToOrder, WebhookPayload } from '@/lib/esimaccess_v1';

// Verify webhook signature using the shared secret
function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-access-signature');
    const secret = process.env.ESIMACCESS_SECRET;
    // Signature is optional per provider docs. If both header and secret are present, verify; otherwise accept.
    if (signature && secret) {
      if (!verifySignature(rawBody, signature, secret)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload: WebhookPayload = rawBody ? JSON.parse(rawBody) : { notifyType: 'UNKNOWN', content: {} };
    // Update order per provider docs (notifyType + content)
    await applyWebhookToOrder(payload);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('eSIM Access webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing error', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Simple health check so the provider can validate the endpoint
  return NextResponse.json({ ok: true });
}


