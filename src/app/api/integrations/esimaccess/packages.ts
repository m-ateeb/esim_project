import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { syncPackagesWithDatabase, getPackages, searchPackages } from '@/lib/esimaccess';
import { CacheService } from '@/lib/redis';

// GET /api/integrations/esimaccess/packages - Get all packages
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const minData = searchParams.get('minData') ? parseInt(searchParams.get('minData')!) : undefined;
    const maxData = searchParams.get('maxData') ? parseInt(searchParams.get('maxData')!) : undefined;
    const minDuration = searchParams.get('minDuration') ? parseInt(searchParams.get('minDuration')!) : undefined;
    const maxDuration = searchParams.get('maxDuration') ? parseInt(searchParams.get('maxDuration')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

    let packages;
    
    if (country || minData !== undefined || maxData !== undefined || 
        minDuration !== undefined || maxDuration !== undefined || maxPrice !== undefined) {
      packages = await searchPackages({
        country: country || undefined,
        minData,
        maxData,
        minDuration,
        maxDuration,
        maxPrice
      });
    } else {
      packages = await getPackages();
    }

    return NextResponse.json({
      success: true,
      data: packages,
      count: packages.length
    });
  } catch (error: any) {
    console.error('Failed to get packages:', error);
    return NextResponse.json(
      { error: 'Failed to get packages', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/integrations/esimaccess/packages - Sync packages with database
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await syncPackagesWithDatabase();

    // Invalidate eSIM and plans cache after sync
    await CacheService.invalidateEsimCache();
    await CacheService.invalidatePlansCache();

    return NextResponse.json({
      success: true,
      message: 'Packages synced successfully'
    });
  } catch (error: any) {
    console.error('Failed to sync packages:', error);
    return NextResponse.json(
      { error: 'Failed to sync packages', details: error.message },
      { status: 500 }
    );
  }
}