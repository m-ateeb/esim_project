import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/payment-methods - Get user's payment methods
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return mock payment methods since we don't have a payment methods table
    // In a real app, you'd fetch from a payment_methods table
    const mockPaymentMethods = [
      {
        id: 'pm_1',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expMonth: 12,
        expYear: 2025,
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pm_2',
        type: 'card',
        last4: '5555',
        brand: 'mastercard',
        expMonth: 8,
        expYear: 2026,
        isDefault: false,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        paymentMethods: mockPaymentMethods
      }
    });
  } catch (error: any) {
    console.error('Failed to get payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to get payment methods', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/users/payment-methods - Add a new payment method
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, token, isDefault } = body;

    // In a real app, you'd integrate with Stripe or another payment processor
    // to create the payment method and store it in your database
    
    const newPaymentMethod = {
      id: `pm_${Date.now()}`,
      type: type || 'card',
      last4: '1234',
      brand: 'visa',
      expMonth: 12,
      expYear: 2025,
      isDefault: isDefault || false,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: {
        paymentMethod: newPaymentMethod
      }
    });
  } catch (error: any) {
    console.error('Failed to add payment method:', error);
    return NextResponse.json(
      { error: 'Failed to add payment method', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/users/payment-methods/[id] - Remove a payment method
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paymentMethodId = searchParams.get('id');

    if (!paymentMethodId) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }

    // In a real app, you'd delete from your database and potentially from Stripe
    
    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error: any) {
    console.error('Failed to delete payment method:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method', details: error.message },
      { status: 500 }
    );
  }
}
