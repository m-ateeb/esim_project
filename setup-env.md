# Environment Setup Guide

## Issue Resolution

The error you're seeing is because:

1. Prisma client needs to be generated
2. Environment variables are missing

## Steps to Fix

### 1. Create Environment File

Create a `.env.local` file in your project root with these essential variables:

```env
# Database (Required for Prisma)
DATABASE_URL="postgresql://username:password@localhost:5432/esim_db"
DIRECT_URL="postgresql://username:password@localhost:5432/esim_db"

# NextAuth (Required for authentication)
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional - Set these later for full functionality
# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# eSIM Access
ESIMACCESS_API_BASE="https://api.esimaccess.com/v1"
ESIMACCESS_ACCESS_CODE=""
ESIMACCESS_SECRET=""

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="noreply@esim-website.com"

# Twilio
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Mailchimp
MAILCHIMP_API_KEY=""
MAILCHIMP_LIST_ID=""
MAILCHIMP_SERVER_PREFIX="us1"

# Tawk.to
NEXT_PUBLIC_TAWK_TO_PROPERTY_ID=""
NEXT_PUBLIC_TAWK_TO_WIDGET_ID=""
NEXT_PUBLIC_TAWK_TO_USER_EMAIL=""
NEXT_PUBLIC_TAWK_TO_USER_NAME=""

# Upstash Redis (Required for caching)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

### 2. Generate Prisma Client

Run this command in your terminal:

```bash
npx prisma generate
```

### 3. Database Setup (Optional)

If you have a PostgreSQL database:

```bash
# Run migrations
npx prisma migrate dev

# Seed database
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

## Notes

- The Prisma client has been modified to handle missing DATABASE_URL gracefully
- You can start with just the essential variables and add others as needed
- For testing, you can use a local PostgreSQL database or a cloud service like Supabase
