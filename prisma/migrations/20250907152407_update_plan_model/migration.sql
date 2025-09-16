/*
  Warnings:

  - You are about to drop the column `applied_markup_pct` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `country_codes` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `days` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `gbs` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `location_name` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `operators` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `our_cost` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `plan_category` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `plan_id` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `plan_name` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `pre_activation_days` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `proposed_price_usd` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `reloadable` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `sms` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `plans` table. All the data in the column will be lost.
  - Added the required column `dataAmount` to the `plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `plans` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `plans` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."plans_plan_id_key";

-- DropIndex
DROP INDEX "public"."plans_slug_key";

-- AlterTable
ALTER TABLE "public"."plans" DROP COLUMN "applied_markup_pct",
DROP COLUMN "country",
DROP COLUMN "country_codes",
DROP COLUMN "days",
DROP COLUMN "gbs",
DROP COLUMN "location_name",
DROP COLUMN "operators",
DROP COLUMN "our_cost",
DROP COLUMN "plan_category",
DROP COLUMN "plan_id",
DROP COLUMN "plan_name",
DROP COLUMN "pre_activation_days",
DROP COLUMN "proposed_price_usd",
DROP COLUMN "reloadable",
DROP COLUMN "slug",
DROP COLUMN "sms",
DROP COLUMN "type",
ADD COLUMN     "countries" TEXT[],
ADD COLUMN     "dataAmount" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "originalPrice" DECIMAL(10,2),
ALTER COLUMN "price" SET NOT NULL;
