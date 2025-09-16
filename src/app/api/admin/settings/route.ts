import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/settings - Get system settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // For now, return default settings
    // In a real app, you'd store these in a database table
    const settings = {
      general: {
        siteName: 'eSIM Global',
        siteDescription: 'Global eSIM connectivity solutions',
        supportEmail: 'support@esimglobal.com',
        timezone: 'UTC',
        currency: 'USD',
        language: 'en'
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        orderAlerts: true,
        userAlerts: true,
        systemAlerts: true
      },
      integrations: {
        stripeEnabled: true,
        paypalEnabled: false,
        esimAccessEnabled: true,
        mailchimpEnabled: false,
        twilioEnabled: false
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 24,
        passwordMinLength: 8,
        loginAttempts: 5,
        ipWhitelist: []
      }
    };

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    console.error('Failed to get settings:', error);
    return NextResponse.json(
      { error: 'Failed to get settings', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update system settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();

    // Validate settings structure
    const requiredSections = ['general', 'notifications', 'integrations', 'security'];
    for (const section of requiredSections) {
      if (!body[section]) {
        return NextResponse.json({ error: `Missing ${section} settings` }, { status: 400 });
      }
    }

    // In a real app, you'd save these to a database table
    // For now, we'll just return success
    console.log('Settings updated:', body);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error: any) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings', details: error.message },
      { status: 500 }
    );
  }
}
