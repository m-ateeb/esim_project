import { prisma } from './prisma';
import { CacheService, CACHE_KEYS, CACHE_TTL } from './redis';

const API_BASE = process.env.ESIMACCESS_API_BASE || 'https://api.esimaccess.com';
const ACCESS_CODE = process.env.ESIMACCESS_ACCESS_CODE!;

type ApiResponse<T> = {
  success: boolean;
  errorCode?: string;
  errorMsg?: string | null;
  obj?: T;
};

async function request<T>(path: string, body: any = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE.replace(/\/$/, '')}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'RT-AccessCode': ACCESS_CODE,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
    // ESIM Access expects POST even for queries; empty body is fine
  });
  const json = await response.json();
  return json as ApiResponse<T>;
}

// Balance
export async function queryBalance(): Promise<{ balance: number; lastUpdateTime?: string } | null> {
  return await CacheService.getOrSet(
    CACHE_KEYS.ESIM_BALANCE,
    async () => {
      const res = await request<{ balance?: number; lastUpdateTime?: string }>(
        '/api/v1/open/balance/query',
        ''
      );
      if (!res.success) throw new Error(res.errorMsg || 'Balance query failed');
      return res.obj ? { balance: res.obj.balance ?? 0, lastUpdateTime: res.obj.lastUpdateTime } : null;
    },
    CACHE_TTL.SHORT
  );
}

// Regions / locations
export interface LocationItem {
  code: string;
  name: string;
  type: number; // 1 single-country, 2 multi-country
  subLocationList?: Array<{ code: string; name: string } | null> | null;
}

export async function listLocations(): Promise<LocationItem[]> {
  return await CacheService.getOrSet(
    CACHE_KEYS.ESIM_LOCATIONS,
    async () => {
      const res = await request<{ locationList: LocationItem[] }>(
        '/api/v1/open/location/list',
        {}
      );
      if (!res.success) throw new Error(res.errorMsg || 'Location list failed');
      return res.obj?.locationList || [];
    },
    CACHE_TTL.LONG
  );
}

// Usage query
export interface UsageItem {
  esimTranNo: string;
  dataUsage: number; // bytes
  totalData: number; // bytes
  lastUpdateTime: string; // ISO-like with timezone
}

export async function queryUsage(esimTranNoList: string[]): Promise<UsageItem[]> {
  const res = await request<{ esimUsageList: UsageItem[] }>(
    '/api/v1/open/esim/usage/query',
    { esimTranNoList }
  );
  if (!res.success) throw new Error(res.errorMsg || 'Usage query failed');
  return res.obj?.esimUsageList || [];
}

// Minimal webhook helpers
export type WebhookPayload = {
  notifyType: 'CHECK_HEALTH' | 'ORDER_STATUS' | 'SMDP_EVENT' | 'ESIM_STATUS' | 'DATA_USAGE' | 'VALIDITY_USAGE' | string;
  content: any;
};

export async function applyWebhookToOrder(payload: WebhookPayload): Promise<void> {
  const { notifyType, content } = payload;
  const orderNo: string | undefined = content?.orderNo;
  if (!orderNo) return;

  const updates: any = { esimAccessData: content };

  // Map some fields
  if (content?.esimStatus) updates.status = content.esimStatus;
  if (content?.iccid) updates.esimCode = content.iccid;

  // Write to any order with matching external number (we store esimAccessOrderId as provider id)
  await prisma.order.updateMany({
    where: {
      OR: [
        { orderNumber: orderNo },
        { esimAccessOrderId: orderNo },
      ],
    },
    data: updates,
  });
}


