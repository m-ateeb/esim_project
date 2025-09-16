// lib/cache-monitor.ts
import { CacheService } from './redis';

interface CacheMetrics {
  endpoint: string;
  cacheHit: boolean;
  responseTime: number;
  timestamp: Date;
  cacheKey: string;
}

class CacheMonitor {
  private metrics: CacheMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics

  // Log cache performance
  logCachePerformance(
    endpoint: string,
    cacheKey: string,
    cacheHit: boolean,
    responseTime: number
  ) {
    const metric: CacheMetrics = {
      endpoint,
      cacheKey,
      cacheHit,
      responseTime,
      timestamp: new Date()
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const status = cacheHit ? 'HIT' : 'MISS';
      console.log(`[CACHE] ${endpoint} - ${status} - ${responseTime}ms - ${cacheKey}`);
    }
  }

  // Get cache hit rate for an endpoint
  getCacheHitRate(endpoint: string, timeWindowMinutes: number = 60): number {
    const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(
      m => m.endpoint === endpoint && m.timestamp >= cutoffTime
    );

    if (recentMetrics.length === 0) return 0;

    const hits = recentMetrics.filter(m => m.cacheHit).length;
    return (hits / recentMetrics.length) * 100;
  }

  // Get average response time for an endpoint
  getAverageResponseTime(endpoint: string, timeWindowMinutes: number = 60): number {
    const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(
      m => m.endpoint === endpoint && m.timestamp >= cutoffTime
    );

    if (recentMetrics.length === 0) return 0;

    const totalTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0);
    return totalTime / recentMetrics.length;
  }

  // Get all metrics for an endpoint
  getEndpointMetrics(endpoint: string, timeWindowMinutes: number = 60): CacheMetrics[] {
    const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
    return this.metrics.filter(
      m => m.endpoint === endpoint && m.timestamp >= cutoffTime
    );
  }

  // Get overall cache statistics
  getOverallStats(timeWindowMinutes: number = 60) {
    const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoffTime);

    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        cacheHits: 0,
        cacheMisses: 0,
        hitRate: 0,
        averageResponseTime: 0,
        endpoints: {}
      };
    }

    const hits = recentMetrics.filter(m => m.cacheHit).length;
    const misses = recentMetrics.length - hits;
    const hitRate = (hits / recentMetrics.length) * 100;
    const averageResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;

    // Group by endpoint
    const endpoints: Record<string, any> = {};
    const endpointGroups = recentMetrics.reduce((acc, m) => {
      if (!acc[m.endpoint]) acc[m.endpoint] = [];
      acc[m.endpoint].push(m);
      return acc;
    }, {} as Record<string, CacheMetrics[]>);

    Object.entries(endpointGroups).forEach(([endpoint, metrics]) => {
      const endpointHits = metrics.filter(m => m.cacheHit).length;
      const endpointHitRate = (endpointHits / metrics.length) * 100;
      const endpointAvgTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length;

      endpoints[endpoint] = {
        totalRequests: metrics.length,
        cacheHits: endpointHits,
        cacheMisses: metrics.length - endpointHits,
        hitRate: endpointHitRate,
        averageResponseTime: endpointAvgTime
      };
    });

    return {
      totalRequests: recentMetrics.length,
      cacheHits: hits,
      cacheMisses: misses,
      hitRate,
      averageResponseTime,
      endpoints
    };
  }

  // Clear old metrics
  clearOldMetrics(olderThanHours: number = 24) {
    const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp >= cutoffTime);
  }

  // Get cache health status
  getCacheHealth(): 'healthy' | 'warning' | 'critical' {
    const stats = this.getOverallStats(60); // Last hour

    if (stats.totalRequests === 0) return 'healthy';

    // Critical: Hit rate below 50% or average response time above 1000ms
    if (stats.hitRate < 50 || stats.averageResponseTime > 1000) {
      return 'critical';
    }

    // Warning: Hit rate below 70% or average response time above 500ms
    if (stats.hitRate < 70 || stats.averageResponseTime > 500) {
      return 'warning';
    }

    return 'healthy';
  }
}

// Create singleton instance
export const cacheMonitor = new CacheMonitor();

// Helper function to wrap API routes with monitoring
export function withCacheMonitoring<T extends any[]>(
  endpoint: string,
  cacheKey: string,
  fn: (...args: T) => Promise<any>
) {
  return async (...args: T) => {
    const startTime = Date.now();
    let cacheHit = false;

    try {
      const result = await fn(...args);
      const responseTime = Date.now() - startTime;
      
      cacheMonitor.logCachePerformance(endpoint, cacheKey, cacheHit, responseTime);
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      cacheMonitor.logCachePerformance(endpoint, cacheKey, cacheHit, responseTime);
      throw error;
    }
  };
}

// Enhanced CacheService with monitoring
export class MonitoredCacheService extends CacheService {
  static async getOrSet<T>(
    key: string,
    fallbackFn: () => Promise<T>,
    ttl: number = 1800,
    endpoint: string = 'unknown'
  ): Promise<T> {
    const startTime = Date.now();
    let cacheHit = false;

    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        cacheHit = true;
        const responseTime = Date.now() - startTime;
        cacheMonitor.logCachePerformance(endpoint, key, cacheHit, responseTime);
        return cached;
      }

      // If not in cache, execute fallback function
      const data = await fallbackFn();
      
      // Store in cache
      await this.set(key, data, ttl);
      
      const responseTime = Date.now() - startTime;
      cacheMonitor.logCachePerformance(endpoint, key, cacheHit, responseTime);
      
      return data;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      cacheMonitor.logCachePerformance(endpoint, key, cacheHit, responseTime);
      // If Redis fails, still execute fallback function
      return await fallbackFn();
    }
  }
}

export default cacheMonitor;
