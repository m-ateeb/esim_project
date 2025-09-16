// lib/esimaccess.ts
import crypto from 'crypto';
import { prisma } from './prisma';
import { CacheService, CACHE_KEYS, CACHE_TTL } from './redis';

const API_BASE = process.env.ESIMACCESS_API_BASE!;
const ACCESS_CODE = process.env.ESIMACCESS_ACCESS_CODE!;
const SECRET = process.env.ESIMACCESS_SECRET!;

interface EsimAccessPackage {
  id: string;
  name: string;
  description?: string;
  data_mb: number;
  validity_days: number;
  price: number;
  currency: string;
  country: string;
  operator?: string;
  apn?: string;
  features?: string[];
}

interface EsimAccessOrder {
  id: string;
  package_id: string;
  status: string;
  esim_code?: string;
  qr_code?: string;
  activation_date?: string;
  expiry_date?: string;
  data_used?: number;
  data_remaining?: number;
}

interface EsimAccessResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

function signPayload(payload: any): string {
  const json = typeof payload === 'string' ? payload : JSON.stringify(payload || {});
  return crypto.createHmac('sha256', SECRET).update(json).digest('hex');
}

async function logApiCall(endpoint: string, method: string, requestData?: any, responseData?: any, statusCode?: number, errorMessage?: string, duration?: number) {
  try {
    // Log to console for now
    console.log('eSIM API Call:', {
      endpoint,
      method,
      requestData,
      responseData,
      statusCode,
      errorMessage,
      duration
    });
  } catch (error) {
    console.error('Failed to log API call:', error);
  }
}

export async function esimRequest<T>(
  path: string, 
  opts: { method?: string; body?: any } = {}
): Promise<EsimAccessResponse<T>> {
  const startTime = Date.now();
  const method = opts.method || 'GET';
  const url = `${API_BASE}${path}`;
  const body = opts.body ? JSON.stringify(opts.body) : undefined;
  const signature = signPayload(opts.body || '');

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Code': ACCESS_CODE,
        'X-Access-Signature': signature,
        'User-Agent': 'eSIM-Website/1.0'
      },
      body
    });

    const responseData = await response.json();
    const duration = Date.now() - startTime;

    // Log the API call
    await logApiCall(path, method, opts.body, responseData, response.status, undefined, duration);

    if (!response.ok) {
      const providerError = responseData?.error || responseData?.errorMsg || responseData?.message;
      throw new Error(`eSIM Access error ${response.status}: ${providerError || 'Unknown error'} (path: ${path})`);
    }

    return responseData;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    await logApiCall(path, method, opts.body, undefined, undefined, error.message, duration);
    throw error;
  }
}

// Get available packages
export async function getPackages(): Promise<EsimAccessPackage[]> {
  return await CacheService.getOrSet(
    CACHE_KEYS.ESIM_PACKAGES,
    async () => {
      const response = await esimRequest<EsimAccessPackage[]>('/packages');
      return response.data || [];
    },
    CACHE_TTL.MEDIUM
  );
}

// Get package by ID
export async function getPackage(packageId: string): Promise<EsimAccessPackage | null> {
  return await CacheService.getOrSet(
    CACHE_KEYS.ESIM_PACKAGE(packageId),
    async () => {
      const response = await esimRequest<EsimAccessPackage>(`/packages/${packageId}`);
      return response.data || null;
    },
    CACHE_TTL.MEDIUM
  );
}

// Create order
export async function createOrder(packageId: string, customerData: {
  email: string;
  name?: string;
  phone?: string;
  country?: string;
}): Promise<EsimAccessOrder> {
  const response = await esimRequest<EsimAccessOrder>('/orders', {
    method: 'POST',
    body: {
      package_id: packageId,
      customer: customerData
    }
  });

  if (!response.data) {
    throw new Error(response.error || 'Failed to create order');
  }

  return response.data;
}

// Get order status
export async function getOrderStatus(orderId: string): Promise<EsimAccessOrder | null> {
  const response = await esimRequest<EsimAccessOrder>(`/orders/${orderId}`);
  return response.data || null;
}

// Activate eSIM
export async function activateEsim(orderId: string): Promise<EsimAccessOrder> {
  const response = await esimRequest<EsimAccessOrder>(`/orders/${orderId}/activate`, {
    method: 'POST'
  });

  if (!response.data) {
    throw new Error(response.error || 'Failed to activate eSIM');
  }

  return response.data;
}

// Get eSIM usage data
export async function getEsimUsage(orderId: string): Promise<{
  data_used: number;
  data_remaining: number;
  last_updated: string;
}> {
  const response = await esimRequest<{
    data_used: number;
    data_remaining: number;
    last_updated: string;
  }>(`/orders/${orderId}/usage`);

  if (!response.data) {
    throw new Error(response.error || 'Failed to get usage data');
  }

  return response.data;
}

// Cancel order
export async function cancelOrder(orderId: string, reason?: string): Promise<boolean> {
  const response = await esimRequest<{ success: boolean }>(`/orders/${orderId}/cancel`, {
    method: 'POST',
    body: reason ? { reason } : {}
  });

  return response.success || false;
}

// Sync packages with database
export async function syncPackagesWithDatabase(): Promise<void> {
  try {
    const packages = await getPackages();
    
    for (const pkg of packages) {
      await prisma.plan.upsert({
        where: { id: pkg.id },
        update: {
          name: pkg.name,
          description: pkg.description,
          dataAmount: `${pkg.data_mb}MB`,
          duration: pkg.validity_days,
          countries: [pkg.country],
          price: pkg.price,
          status: 'ACTIVE'
        },
        create: {
          id: pkg.id,
          name: pkg.name,
          description: pkg.description,
          dataAmount: `${pkg.data_mb}MB`,
          duration: pkg.validity_days,
          countries: [pkg.country],
          price: pkg.price,
          status: 'ACTIVE',
          features: [],
          maxSpeed: '4G'
        }
      });
    }
  } catch (error) {
    console.error('Failed to sync packages:', error);
    throw error;
  }
}

// Get available countries
export async function getCountries(): Promise<string[]> {
  return await CacheService.getOrSet(
    CACHE_KEYS.ESIM_COUNTRIES,
    async () => {
      const packages = await getPackages();
      const countries = new Set<string>();
      
      packages.forEach(pkg => {
        if (pkg.country) {
          countries.add(pkg.country);
        }
      });
      
      return Array.from(countries);
    },
    CACHE_TTL.LONG
  );
}

// Search packages by criteria
export async function searchPackages(criteria: {
  country?: string;
  minData?: number;
  maxData?: number;
  minDuration?: number;
  maxDuration?: number;
  maxPrice?: number;
}): Promise<EsimAccessPackage[]> {
  let packages = await getPackages();
  
  if (criteria.country) {
    packages = packages.filter(pkg => pkg.country === criteria.country);
  }
  
  if (criteria.minData !== undefined) {
    packages = packages.filter(pkg => pkg.data_mb >= criteria.minData!);
  }
  
  if (criteria.maxData !== undefined) {
    packages = packages.filter(pkg => pkg.data_mb <= criteria.maxData!);
  }
  
  if (criteria.minDuration !== undefined) {
    packages = packages.filter(pkg => pkg.validity_days >= criteria.minDuration!);
  }
  
  if (criteria.maxDuration !== undefined) {
    packages = packages.filter(pkg => pkg.validity_days <= criteria.maxDuration!);
  }
  
  if (criteria.maxPrice !== undefined) {
    packages = packages.filter(pkg => pkg.price <= criteria.maxPrice!);
  }
  
  return packages;
}