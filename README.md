# eSIM Website - Complete Integration Guide

This project implements a comprehensive eSIM website with eSIM Access API integration, payment processing, and advanced features.

## 🚀 Features Implemented

### Core Functionality
- **eSIM API Integration**: Full integration with eSIM Access API
- **Customer Dashboard**: View purchased plans, remaining data, expiry alerts
- **Admin Panel**: Create/edit plans, pricing, analytics, order history
- **Notifications System**: Email & optional SMS notifications
- **Payment Processing**: Stripe, PayPal, Apple Pay, Google Pay support
- **One-click Checkout**: Streamlined payment flow
- **Promo Codes & Vouchers**: Discount system with validation
- **Affiliate/Referral Tracking**: User referral system
- **Automatic eSIM Delivery**: QR code generation and email delivery
- **Real-time Activation**: Instant eSIM activation through API
- **Order Management**: Complete order lifecycle management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account
- Twilio account (for SMS)
- SMTP server (for emails)

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd eSIM
npm install
```

### 2. Environment Variables
Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/esim_db"
DIRECT_URL="postgresql://username:password@localhost:5432/esim_db"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# eSIM Access API
ESIMACCESS_API_BASE="https://api.esimaccess.com/v1"
ESIMACCESS_ACCESS_CODE="your-access-code"
ESIMACCESS_SECRET="your-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@esim-website.com"

# Twilio (SMS)
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Database Setup
```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

## 📚 API Documentation

### Authentication
All API endpoints require authentication via NextAuth session token.

### eSIM Access Integration

#### 1. Get Available Packages
```http
GET /api/integrations/esimaccess/packages
Authorization: Bearer <session-token>

Query Parameters:
- country: Filter by country code
- minData: Minimum data amount (MB)
- maxData: Maximum data amount (MB)
- minDuration: Minimum validity days
- maxDuration: Maximum validity days
- maxPrice: Maximum price
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "package_id",
      "name": "10GB Europe",
      "description": "10GB data for Europe",
      "data_mb": 10240,
      "validity_days": 30,
      "price": 19.99,
      "currency": "USD",
      "country": "EU",
      "operator": "Vodafone",
      "features": ["4G", "5G"]
    }
  ],
  "count": 1
}
```

#### 2. Sync Packages with Database
```http
POST /api/integrations/esimaccess/packages
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "action": "sync"
}
```

#### 3. Create eSIM Order
```http
POST /api/integrations/esimaccess/orders
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "packageId": "package_id",
  "customerData": {
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "country": "US"
  }
}
```

#### 4. Get Order Status
```http
GET /api/integrations/esimaccess/orders?orderId=order_id
Authorization: Bearer <session-token>
```

#### 5. Activate eSIM
```http
PUT /api/integrations/esimaccess/orders
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "orderId": "order_id"
}
```

#### 6. Cancel Order
```http
DELETE /api/integrations/esimaccess/orders?orderId=order_id&reason=User request
Authorization: Bearer <session-token>
```

### Payment Processing

#### 1. Create Payment Intent
```http
POST /api/checkout/create-payment-intent
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "planId": "plan_id",
  "quantity": 1,
  "promoCode": "SAVE20",
  "paymentMethod": "STRIPE"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "orderId": "order_id",
    "orderNumber": "ORD-1234567890",
    "amount": 19.99,
    "currency": "usd"
  }
}
```

### Admin APIs

#### 1. Manage Plans
```http
# Get all plans
GET /api/admin/plans?page=1&limit=20&search=Europe&status=ACTIVE

# Create plan
POST /api/admin/plans
{
  "name": "New Plan",
  "description": "Plan description",
  "dataAmount": "5GB",
  "duration": 30,
  "countries": ["US", "CA"],
  "price": 15.99,
  "status": "ACTIVE"
}

# Update plan
PUT /api/admin/plans
{
  "id": "plan_id",
  "name": "Updated Plan Name"
}

# Delete plan
DELETE /api/admin/plans?id=plan_id
```

#### 2. Analytics
```http
GET /api/admin/analytics?period=30&startDate=2024-01-01&endDate=2024-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-01-01T00:00:00.000Z",
      "end": "2024-01-31T23:59:59.999Z",
      "days": 31
    },
    "revenue": {
      "totalRevenue": 1599.20,
      "averageOrderValue": 19.99,
      "orderCount": 80,
      "dailyRevenue": [...],
      "paymentMethodBreakdown": {...}
    },
    "orders": {
      "totalOrders": 80,
      "completedOrders": 75,
      "pendingOrders": 3,
      "cancelledOrders": 2,
      "completionRate": 93.75
    },
    "users": {
      "newUsers": 45,
      "totalUsers": 1200,
      "activeUsers": 890,
      "userGrowthRate": 3.75
    },
    "plans": {
      "totalPlans": 25,
      "activePlans": 22,
      "popularPlans": 8,
      "topSellingPlans": [...]
    },
    "countries": [...]
  }
}
```

### Customer Dashboard

#### 1. Get User Plans
```http
GET /api/dashboard/user-plans?includeExpired=false
Authorization: Bearer <session-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "user_plan_id",
        "status": "ACTIVE",
        "activationDate": "2024-01-01T00:00:00.000Z",
        "expiryDate": "2024-01-31T23:59:59.999Z",
        "dataUsed": "2.5GB",
        "dataRemaining": "7.5GB",
        "plan": {
          "name": "10GB Europe",
          "dataAmount": "10GB",
          "duration": 30
        },
        "order": {
          "orderNumber": "ORD-1234567890",
          "esimQrCode": "data:image/png;base64,...",
          "esimCode": "ESIM123456"
        }
      }
    ],
    "summary": {
      "totalPlans": 3,
      "activePlans": 2,
      "expiringSoon": 1,
      "totalDataUsed": "5.2GB",
      "totalDataRemaining": "24.8GB"
    }
  }
}
```

#### 2. Activate Plan
```http
POST /api/dashboard/user-plans
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "planId": "plan_id"
}
```

#### 3. Update Plan Status
```http
PUT /api/dashboard/user-plans
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "planId": "plan_id",
  "action": "pause" // pause, resume, cancel
}
```

### Notifications

#### 1. Send Notification
```http
POST /api/notifications
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "userId": "user_id",
  "title": "Notification Title",
  "message": "Notification message",
  "type": "SUCCESS",
  "sendEmail": true,
  "sendSms": false
}
```

## 🔧 Configuration

### eSIM Access API
The integration supports the following eSIM Access endpoints:
- `/packages` - Get available packages
- `/orders` - Create and manage orders
- `/orders/{id}/activate` - Activate eSIM
- `/orders/{id}/usage` - Get usage data
- `/orders/{id}/cancel` - Cancel order

### Payment Methods
- **Stripe**: Credit cards, Apple Pay, Google Pay
- **PayPal**: PayPal accounts
- **Local Cards**: Regional payment methods

### Email Templates
Pre-built templates for:
- Welcome emails
- Order confirmations
- eSIM activation
- Data usage alerts
- Expiry reminders
- Password reset

### SMS Notifications
Twilio integration for:
- Order confirmations
- eSIM activation
- Data usage alerts
- Expiry reminders

## 🧪 Testing with Postman

### 1. Authentication Setup
1. Login to the website and get your session token
2. In Postman, add the token to your request headers:
   ```
   Authorization: Bearer <your-session-token>
   ```

### 2. Test eSIM API Integration
```bash
# Get packages
GET {{base_url}}/api/integrations/esimaccess/packages

# Sync packages
POST {{base_url}}/api/integrations/esimaccess/packages
{
  "action": "sync"
}

# Create order
POST {{base_url}}/api/integrations/esimaccess/orders
{
  "packageId": "test_package_id",
  "customerData": {
    "email": "test@example.com",
    "name": "Test User",
    "country": "US"
  }
}
```

### 3. Test Payment Flow
```bash
# Create payment intent
POST {{base_url}}/api/checkout/create-payment-intent
{
  "planId": "test_plan_id",
  "quantity": 1,
  "promoCode": "TEST20"
}

# Use the clientSecret in your Stripe test
```

### 3. Test Admin APIs
```bash
# Get plans (admin only)
GET {{base_url}}/api/admin/plans?page=1&limit=10

# Get analytics (admin only)
GET {{base_url}}/api/admin/analytics?period=30
```

### 4. Test Customer Dashboard
```bash
# Get user plans
GET {{base_url}}/api/dashboard/user-plans

# Activate plan
POST {{base_url}}/api/dashboard/user-plans
{
  "planId": "test_plan_id"
}
```

## 📊 Database Schema

The system includes the following main models:
- **User**: User accounts and profiles
- **Plan**: eSIM plans and packages
- **Order**: Purchase orders and payments
- **UserPlan**: Active user plans
- **PromoCode**: Discount codes and vouchers
- **Notification**: User notifications
- **Analytics**: Usage and performance data

## 🚨 Webhooks

### Stripe Webhooks
Configure the following webhook endpoint in your Stripe dashboard:
```
https://your-domain.com/api/webhooks/stripe
```

Events handled:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### eSIM Access Webhooks
Configure webhooks for:
- Order status updates
- eSIM activation
- Usage data updates

## 🔒 Security Features

- **Authentication**: NextAuth.js with multiple providers
- **Authorization**: Role-based access control (User/Admin)
- **API Security**: HMAC signature verification for eSIM Access
- **Payment Security**: Stripe webhook signature verification
- **Data Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 📈 Monitoring & Analytics

- **API Logging**: All eSIM API calls are logged
- **Performance Metrics**: Response times and success rates
- **Business Analytics**: Revenue, orders, user growth
- **Error Tracking**: Comprehensive error logging
- **Usage Monitoring**: Data consumption tracking

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
DATABASE_URL="your-production-db-url"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Build and Deploy
```bash
npm run build
npm start
```

## 📞 Support

For technical support or questions about the integration:
- Check the API documentation above
- Review the error logs in your console
- Verify your environment variables are correctly set
- Ensure your database is properly configured

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor eSIM Access API for changes
- Update Stripe webhook endpoints if needed
- Review and update email templates
- Monitor payment success rates
- Clean up old notifications and logs

### API Version Updates
The eSIM Access integration is designed to be easily updatable. Check their documentation regularly for:
- New endpoints
- Deprecated features
- Rate limit changes
- Authentication updates

---

**Note**: This is a production-ready implementation. Make sure to test thoroughly in a staging environment before deploying to production.
