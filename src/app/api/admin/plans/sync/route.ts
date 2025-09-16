import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { syncPackagesWithDatabase } from '@/lib/esimaccess';

// POST /api/admin/plans/sync - Sync plans with eSIM Access
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'sync') {
      await syncPackagesWithDatabase();
      
      return NextResponse.json({
        success: true,
        message: 'Plans synced successfully with eSIM Access'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Failed to sync plans:', error);
    return NextResponse.json(
      { error: 'Failed to sync plans', details: error.message },
      { status: 500 }
    );
  }
}
