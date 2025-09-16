/*
  Warnings:

  - You are about to drop the column `countries` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `dataAmount` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice` on the `plans` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plan_id]` on the table `plans` will be added. If there are existing duplicate values, this will fail.
  - Made the column `orderId` on table `user_plans` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."user_plans" DROP CONSTRAINT "user_plans_orderId_fkey";

-- AlterTable
ALTER TABLE "public"."plans" DROP COLUMN "countries",
DROP COLUMN "dataAmount",
DROP COLUMN "duration",
DROP COLUMN "name",
DROP COLUMN "originalPrice",
ADD COLUMN     "applied_markup_pct" DECIMAL(5,2),
ADD COLUMN     "country" TEXT,
ADD COLUMN     "country_codes" TEXT,
ADD COLUMN     "days" INTEGER,
ADD COLUMN     "gbs" DECIMAL(10,2),
ADD COLUMN     "location_name" TEXT,
ADD COLUMN     "operators" TEXT,
ADD COLUMN     "our_cost" DECIMAL(10,2),
ADD COLUMN     "plan_category" TEXT,
ADD COLUMN     "plan_id" TEXT,
ADD COLUMN     "plan_name" TEXT,
ADD COLUMN     "pre_activation_days" INTEGER,
ADD COLUMN     "proposed_price_usd" DECIMAL(10,2),
ADD COLUMN     "reloadable" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "sms" INTEGER,
ADD COLUMN     "type" TEXT,
ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."user_plans" ALTER COLUMN "orderId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "plans_slug_key" ON "public"."plans"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "plans_plan_id_key" ON "public"."plans"("plan_id");

-- AddForeignKey
ALTER TABLE "public"."user_plans" ADD CONSTRAINT "user_plans_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
