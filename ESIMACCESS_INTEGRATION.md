# eSIM Access Integration (Next.js App Router)

This document explains how the eSIM Access partner API is integrated in this project, required environment variables, available API routes, and Postman/cURL examples for testing.

## Overview

- Provider: eSIM Access
- **Base URL**: `https://api.esimaccess.com`
- **Auth Header**: `RT-AccessCode: <YOUR_ACCESS_CODE>`
- **Rate limit**: 8 requests/second
- Most query endpoints are `POST` with empty `{}` body or no body

We provide two client modules:
- `lib/esimaccess.ts` – Existing integration used by admin sync and order flows (internal abstraction with HMAC header for a different vendor style; keep for legacy internal use).
- `lib/esimaccess_v1.ts` – New v1 client aligned with the documentation you provided (RT-AccessCode header, v1 endpoints for balance, locations, usage).

You can use the v1 routes below for testing with Postman now.

## Environment Variables

Add these to `.env.local` (or environment of your hosting):

```
ESIMACCESS_API_BASE=https://api.esimaccess.com
ESIMACCESS_ACCESS_CODE=YOUR_ACCESS_CODE
ESIMACCESS_SECRET=YOUR_SHARED_SECRET_OPTIONAL
```

- `ESIMACCESS_SECRET` is only used if you want to verify webhook signatures (optional). If the provider sends an `x-access-signature`, we verify it; otherwise we accept the payload.

## API Routes (Internal)

All routes below are served by this Next.js app. Use these from Postman while keeping your real access code private in server env.

### 1) Query Balance
- **Method**: POST
- **Path**: `/api/integrations/esimaccess/balance`
- **Body**: none
- **Auth**: server-side via `RT-AccessCode`

cURL:
```
curl -X POST http://localhost:3000/api/integrations/esimaccess/balance
```

Postman:
- Method: POST
- URL: `http://localhost:3000/api/integrations/esimaccess/balance`
- No body required

Response:
```
{
  "success": true,
  "data": { "balance": 123.45, "lastUpdateTime": "2025-03-19T18:00:00+0000" }
}
```

### 2) List Supported Regions (Locations)
- **Method**: POST
- **Path**: `/api/integrations/esimaccess/regions`
- **Body**: `{}` (empty object)

cURL:
```
curl -X POST http://localhost:3000/api/integrations/esimaccess/regions
```

Postman:
- Method: POST
- URL: `http://localhost:3000/api/integrations/esimaccess/regions`
- Body: raw JSON `{}`

Response:
```
{
  "success": true,
  "data": [
    { "code": "ES", "name": "Spain", "type": 1 },
    { "code": "EU-42", "name": "Europe (40+ areas)", "type": 2, "subLocationList": [ ... ] }
  ]
}
```

### 3) Query Data Usage
- **Method**: POST
- **Path**: `/api/integrations/esimaccess/usage`
- **Body**:
```
{
  "esimTranNoList": ["25031120490003"]
}
```

cURL:
```
curl -X POST http://localhost:3000/api/integrations/esimaccess/usage \
  -H "Content-Type: application/json" \
  -d '{"esimTranNoList":["25031120490003"]}'
```

Postman:
- Method: POST
- URL: `http://localhost:3000/api/integrations/esimaccess/usage`
- Body: raw JSON as above

Response:
```
{
  "success": true,
  "data": [
    {
      "esimTranNo": "25031120490003",
      "dataUsage": 1453344832,
      "totalData": 5368709120,
      "lastUpdateTime": "2025-03-19T18:00:00+0000"
    }
  ]
}
```

### 4) Webhook Receiver
- **Method**: POST (provider → your app)
- **Path**: `/api/webhooks/esimaccess`
- **Body**: JSON with the shape `{ notifyType, content }` per docs
- **Signature**: Optional. If `x-access-signature` header is present and `ESIMACCESS_SECRET` is set, signature is verified. Otherwise, the payload is accepted.

Health Check:
- **Method**: GET
- **Path**: `/api/webhooks/esimaccess`
- **Response**: `{ ok: true }`

Example payloads:
```
{
  "notifyType": "ORDER_STATUS",
  "content": { "orderNo": "B23072016497499", "orderStatus": "GOT_RESOURCE" }
}
```
```
{
  "notifyType": "ESIM_STATUS",
  "content": {
    "orderNo": "B23072016497499",
    "iccid": "894310817000000003",
    "esimStatus": "IN_USE",
    "smdpStatus": "INSTALLATION"
  }
}
```

Behavior:
- We persist the full `content` into `orders.esimAccessData` for matching orders, where an order is matched by `orderNumber` or `esimAccessOrderId`.
- If present, we map `content.esimStatus` → `orders.status` and `content.iccid` → `orders.esimCode`.

cURL (simulate provider):
```
curl -X POST http://localhost:3000/api/webhooks/esimaccess \
  -H "Content-Type: application/json" \
  -d '{"notifyType":"ORDER_STATUS","content":{"orderNo":"B23072016497499","orderStatus":"GOT_RESOURCE"}}'
```

### 5) Existing Internal Admin/Order Routes (legacy abstraction)
These existed prior to v1 client and use `lib/esimaccess.ts`:
- `GET /api/integrations/esimaccess/packages` – Admin-only: retrieve packages (internal abstraction)
- `POST /api/integrations/esimaccess/packages` – Admin-only: sync packages into DB
- `POST /api/integrations/esimaccess/orders` – Create an order (requires user session)
- `GET /api/integrations/esimaccess/orders?orderId=...` – Get order status (requires user session)
- `PUT /api/integrations/esimaccess/orders` – Activate eSIM (requires user session; body `{ orderId }`)
- `DELETE /api/integrations/esimaccess/orders?orderId=...&reason=...` – Cancel eSIM (requires user session)

Each of the above is documented inline in the corresponding route file under `src/app/api/integrations/esimaccess/`.

## Postman Collection Tips
- Create an Environment with `baseUrl` = `http://localhost:3000` (or your deployed domain)
- Add variables for `esimTranNo`, etc.
- For routes calling the provider, you do NOT need to add `RT-AccessCode` in Postman; our server adds it from env.

## Notes & Limitations
- eSIM Access updates usage every 2–3 hours; usage endpoint is not real-time.
- Rate limit is 8 req/s; add throttling if invoking from UI.
- Ensure your DB has the fields required by webhook mapping (`orders.esimAccessData`, `orders.esimAccessOrderId`, `orders.esimCode`, `orders.status`). These already exist in `prisma/schema.prisma`.

## Where Things Live
- V1 client: `lib/esimaccess_v1.ts`
- Legacy client: `lib/esimaccess.ts`
- Webhook route: `src/app/api/webhooks/esimaccess/route.ts`
- Balance route: `src/app/api/integrations/esimaccess/balance/route.ts`
- Regions route: `src/app/api/integrations/esimaccess/regions/route.ts`
- Usage route: `src/app/api/integrations/esimaccess/usage/route.ts`

If you want, we can add dashboard UI buttons to call balance, regions, and usage for quick checks.
