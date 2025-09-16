# Redis Cache Testing Guide

This guide will help you verify that Upstash Redis caching is properly implemented and working in your eSIM project.

## 🚀 Quick Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```env
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"
```

### 2. Get Upstash Redis Credentials

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and REST Token
4. Add them to your `.env.local` file

## 🧪 Testing Methods

### Method 1: Response Time Testing

#### Test 1: Plans API Caching

```bash
# First request (should be slow - database hit)
time curl -X GET "http://localhost:3000/api/plans" -H "Content-Type: application/json"

# Second request (should be fast - cache hit)
time curl -X GET "http://localhost:3000/api/plans" -H "Content-Type: application/json"
```

**Expected Results:**

- First request: ~200-500ms
- Second request: ~10-50ms (5-10x faster)

#### Test 2: Currency Rates API

```bash
# First request
time curl -X GET "http://localhost:3000/api/currency/rates"

# Second request (should be much faster)
time curl -X GET "http://localhost:3000/api/currency/rates"
```

#### Test 3: Admin Dashboard

```bash
# Login first to get session cookie, then:
time curl -X GET "http://localhost:3000/api/admin/dashboard" -H "Cookie: your-session-cookie"
time curl -X GET "http://localhost:3000/api/admin/dashboard" -H "Cookie: your-session-cookie"
```

### Method 2: Redis CLI Testing

#### Connect to Redis

```bash
# Install redis-cli if not installed
npm install -g redis-cli

# Connect to your Upstash Redis instance
redis-cli -u "redis://your-upstash-redis-url" -a "your-upstash-redis-token"
```

#### Check Cache Keys

```bash
# List all cache keys
KEYS *

# Check specific cache keys
GET "plans:filtered:{\"page\":1,\"limit\":20,\"search\":\"\",\"categoryId\":\"\",\"country\":\"\",\"minPrice\":\"\",\"maxPrice\":\"\",\"dataAmount\":\"\",\"duration\":\"\"}"
GET "currency:rates"
GET "admin:dashboard"
```

#### Monitor Cache Activity

```bash
# Monitor all Redis commands in real-time
MONITOR
```

### Method 3: Browser Developer Tools

#### Network Tab Analysis

1. Open browser DevTools (F12)
2. Go to Network tab
3. Make API requests to cached endpoints
4. Check response times:
   - First request: Higher response time
   - Subsequent requests: Lower response time

#### Console Logging

Add temporary logging to see cache hits/misses:

```javascript
// In your API route, add:
console.log("Cache hit:", cachedData ? "YES" : "NO");
console.log("Response time:", Date.now() - startTime, "ms");
```

### Method 4: Application Logs

#### Check Server Logs

```bash
# Start your development server
npm run dev

# Watch for cache-related logs
tail -f .next/server.log | grep -i cache
```

#### Add Debug Logging

Temporarily add this to your API routes:

```typescript
const startTime = Date.now();
console.log(`[CACHE] Starting request for ${cacheKey}`);

const result = await CacheService.getOrSet(
  cacheKey,
  async () => {
    console.log(`[CACHE] Cache miss for ${cacheKey}`);
    // ... your database query
  },
  CACHE_TTL.MEDIUM
);

console.log(`[CACHE] Request completed in ${Date.now() - startTime}ms`);
```

## 🔍 Verification Checklist

### ✅ Cache Implementation Verification

#### API Routes with Caching:

- [ ] `/api/plans` - Plans listing and filtering
- [ ] `/api/plans/[id]` - Single plan details
- [ ] `/api/admin/dashboard` - Admin dashboard stats
- [ ] `/api/admin/analytics` - Admin analytics data
- [ ] `/api/admin/users` - Admin users listing
- [ ] `/api/admin/orders` - Admin orders listing
- [ ] `/api/orders` - User orders
- [ ] `/api/orders/[id]` - Single order details
- [ ] `/api/dashboard/user-plans` - User dashboard
- [ ] `/api/users/profile` - User profile
- [ ] `/api/currency/rates` - Currency exchange rates

#### External API Caching:

- [ ] eSIM Access packages
- [ ] eSIM Access balance
- [ ] eSIM Access locations
- [ ] eSIM Access countries

#### Cache Invalidation:

- [ ] Plan CRUD operations invalidate plans cache
- [ ] Order creation invalidates user orders cache
- [ ] User updates invalidate user cache
- [ ] Admin operations invalidate admin cache

### ✅ Performance Verification

#### Response Time Improvements:

- [ ] Plans API: 5-10x faster on cache hit
- [ ] Currency API: 10-20x faster on cache hit
- [ ] Admin Dashboard: 3-5x faster on cache hit
- [ ] User Orders: 3-5x faster on cache hit

#### Database Load Reduction:

- [ ] Fewer database queries in server logs
- [ ] Reduced database connection usage
- [ ] Lower database CPU usage

## 🐛 Troubleshooting

### Common Issues

#### 1. Cache Not Working

**Symptoms:** No performance improvement, same response times
**Solutions:**

- Check Redis connection: `redis-cli ping`
- Verify environment variables are set
- Check for Redis connection errors in logs

#### 2. Cache Keys Not Found

**Symptoms:** `KEYS *` returns empty
**Solutions:**

- Make API requests first to populate cache
- Check cache key generation logic
- Verify TTL settings

#### 3. Stale Data

**Symptoms:** Old data returned after updates
**Solutions:**

- Check cache invalidation logic
- Verify mutation operations call `CacheService.invalidate*()`
- Check TTL settings (too long)

#### 4. Redis Connection Errors

**Symptoms:** `Redis connection failed` errors
**Solutions:**

- Verify UPSTASH_REDIS_REST_URL format
- Check UPSTASH_REDIS_REST_TOKEN validity
- Ensure Upstash database is active

### Debug Commands

#### Check Redis Connection

```bash
redis-cli -u "redis://your-url" -a "your-token" ping
# Should return: PONG
```

#### Check Cache Statistics

```bash
redis-cli -u "redis://your-url" -a "your-token" info stats
```

#### Clear All Cache (for testing)

```bash
redis-cli -u "redis://your-url" -a "your-token" FLUSHALL
```

## 📊 Performance Monitoring

### Key Metrics to Track

1. **Cache Hit Rate**: Should be >80% for frequently accessed data
2. **Response Time**: Should improve by 3-10x for cached endpoints
3. **Database Queries**: Should decrease significantly
4. **Memory Usage**: Monitor Redis memory usage

### Monitoring Tools

#### Upstash Console

- Monitor Redis performance
- Check memory usage
- View connection statistics

#### Application Metrics

```typescript
// Add to your API routes for monitoring
const cacheHit = cachedData ? "HIT" : "MISS";
console.log(
  `[METRICS] ${endpoint} - Cache: ${cacheHit} - Time: ${responseTime}ms`
);
```

## 🎯 Expected Results

### Before Caching:

- Plans API: 300-800ms
- Currency API: 200-500ms
- Admin Dashboard: 500-1500ms
- Database queries: High

### After Caching:

- Plans API: 20-100ms (cache hit)
- Currency API: 10-50ms (cache hit)
- Admin Dashboard: 100-300ms (cache hit)
- Database queries: Significantly reduced

### Cache Hit Rates:

- Plans API: 85-95%
- Currency API: 90-98%
- Admin Dashboard: 80-90%
- User-specific data: 70-85%

## 🚀 Production Considerations

1. **Monitor Redis Memory**: Set up alerts for memory usage
2. **Cache Warming**: Pre-populate frequently accessed data
3. **Cache Invalidation**: Ensure proper invalidation on data changes
4. **Error Handling**: Graceful fallback when Redis is unavailable
5. **Security**: Use Redis AUTH and TLS in production

---

**Note:** This testing guide assumes you have a working Next.js application with the Redis caching implementation. Make sure to test in a development environment first before deploying to production.
