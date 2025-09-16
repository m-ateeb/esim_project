/*
  Warnings:

  - The `paymentMethod` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentStatus` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('STRIPE', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY', 'LOCAL_CARD');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "esimAccessData" JSONB,
ADD COLUMN     "esimAccessOrderId" TEXT,
ADD COLUMN     "esimQrCode" TEXT,
ADD COLUMN     "paymentTransactionId" TEXT,
ADD COLUMN     "paypalOrderId" TEXT,
ADD COLUMN     "stripePaymentIntentId" TEXT,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "public"."PaymentMethod",
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."plans" ADD COLUMN     "esimAccessData" JSONB,
ADD COLUMN     "esimAccessId" TEXT,
ADD COLUMN     "isEsimEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."user_plans" ADD COLUMN     "esimAccessData" JSONB,
ADD COLUMN     "esimAccessId" TEXT,
ADD COLUMN     "lastSyncAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."esim_api_logs" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "requestData" JSONB,
    "responseData" JSONB,
    "statusCode" INTEGER,
    "errorMessage" TEXT,
    "duration" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "esim_api_logs_pkey" PRIMARY KEY ("id")
);
