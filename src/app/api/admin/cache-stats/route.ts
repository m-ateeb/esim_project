import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cacheMonitor } from '@/lib/cache-monitor';
import { CacheService } from '@/lib/redis';

// GET /api/admin/cache-stats - Get cache performance statistics
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

    const { searchParams } = new URL(request.url);
    const timeWindow = parseInt(searchParams.get('timeWindow') || '60'); // minutes
    const endpoint = searchParams.get('endpoint');

    let stats;
    if (endpoint) {
      // Get stats for specific endpoint
      const hitRate = cacheMonitor.getCacheHitRate(endpoint, timeWindow);
      const avgResponseTime = cacheMonitor.getAverageResponseTime(endpoint, timeWindow);
      const metrics = cacheMonitor.getEndpointMetrics(endpoint, timeWindow);
      
      stats = {
        endpoint,
        timeWindow,
        hitRate,
        averageResponseTime: avgResponseTime,
        totalRequests: metrics.length,
        cacheHits: metrics.filter(m => m.cacheHit).length,
        cacheMisses: metrics.filter(m => !m.cacheHit).length,
        recentMetrics: metrics.slice(-10) // Last 10 requests
      };
    } else {
      // Get overall stats
      stats = cacheMonitor.getOverallStats(timeWindow);
      stats.timeWindow = timeWindow;
      stats.health = cacheMonitor.getCacheHealth();
    }

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Failed to get cache stats:', error);
    return NextResponse.json(
      { error: 'Failed to get cache stats', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/cache-stats - Clear cache or metrics
export async function POST(request: NextRequest) {
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
    const { action, pattern } = body;

    switch (action) {
      case 'clear_cache':
        if (pattern) {
          await CacheService.invalidatePattern(pattern);
        } else {
          // Clear all cache (use with caution)
          await CacheService.invalidatePattern('*');
        }
        break;

      case 'clear_metrics':
        cacheMonitor.clearOldMetrics(0); // Clear all metrics
        break;

      case 'clear_old_metrics':
        const hours = body.hours || 24;
        cacheMonitor.clearOldMetrics(hours);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Cache ${action} completed successfully`
    });
  } catch (error: any) {
    console.error('Failed to perform cache action:', error);
    return NextResponse.json(
      { error: 'Failed to perform cache action', details: error.message },
      { status: 500 }
    );
  }
}
