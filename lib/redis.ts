import { Redis } from '@upstash/redis';

// Redis client configuration
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache configuration
export const CACHE_KEYS = {
  // Plans
  PLANS: 'plans',
  PLAN_BY_ID: (id: string) => `plan:${id}`,
  PLANS_FILTERED: (filters: string) => `plans:filtered:${filters}`,
  
  // Admin Dashboard
  ADMIN_DASHBOARD: 'admin:dashboard',
  ADMIN_ANALYTICS: 'admin:analytics',
  
  // User Data
  USER_PLANS: (userId: string) => `user:${userId}:plans`,
  USER_ORDERS: (userId: string) => `user:${userId}:orders`,
  USER_PROFILE: (userId: string) => `user:${userId}:profile`,
  
  // External APIs
  CURRENCY_RATES: 'currency:rates',
  ESIM_PACKAGES: 'esim:packages',
  ESIM_PACKAGE: (id: string) => `esim:package:${id}`,
  ESIM_COUNTRIES: 'esim:countries',
  ESIM_BALANCE: 'esim:balance',
  ESIM_LOCATIONS: 'esim:locations',
  
  // Orders
  ORDER_BY_ID: (id: string) => `order:${id}`,
  ORDER_STATUS: (id: string) => `order:${id}:status`,
  
  // Categories
  CATEGORIES: 'categories',
  CATEGORY_BY_ID: (id: string) => `category:${id}`,
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 1800,    // 30 minutes
  LONG: 3600,      // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// Cache utility functions
export class CacheService {
  /**
   * Get data from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T | null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  /**
   * Set data in cache with TTL
   */
  static async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  /**
   * Delete data from cache
   */
  static async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  static async delPattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Redis DEL pattern error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  /**
   * Get or set cache with fallback function
   */
  static async getOrSet<T>(
    key: string,
    fallbackFn: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, execute fallback function
      const data = await fallbackFn();
      
      // Store in cache
      await this.set(key, data, ttl);
      
      return data;
    } catch (error) {
      console.error('Redis getOrSet error:', error);
      // If Redis fails, still execute fallback function
      return await fallbackFn();
    }
  }

  /**
   * Invalidate cache patterns
   */
  static async invalidatePattern(pattern: string): Promise<void> {
    try {
      await this.delPattern(pattern);
    } catch (error) {
      console.error('Redis invalidate pattern error:', error);
    }
  }

  /**
   * Invalidate user-specific cache
   */
  static async invalidateUserCache(userId: string): Promise<void> {
    const patterns = [
      `user:${userId}:*`,
      `order:*:user:${userId}`,
    ];
    
    for (const pattern of patterns) {
      await this.invalidatePattern(pattern);
    }
  }

  /**
   * Invalidate plans cache
   */
  static async invalidatePlansCache(): Promise<void> {
    const patterns = [
      'plans*',
      'plan:*',
      'category:*',
      'categories',
    ];
    
    for (const pattern of patterns) {
      await this.invalidatePattern(pattern);
    }
  }

  /**
   * Invalidate admin cache
   */
  static async invalidateAdminCache(): Promise<void> {
    const patterns = [
      'admin:*',
    ];
    
    for (const pattern of patterns) {
      await this.invalidatePattern(pattern);
    }
  }

  /**
   * Invalidate eSIM cache
   */
  static async invalidateEsimCache(): Promise<void> {
    const patterns = [
      'esim:*',
    ];
    
    for (const pattern of patterns) {
      await this.invalidatePattern(pattern);
    }
  }
}

// Export the Redis client for direct use if needed
export { redis };
export default CacheService;
