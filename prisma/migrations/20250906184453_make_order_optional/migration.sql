-- DropForeignKey
ALTER TABLE "public"."user_plans" DROP CONSTRAINT "user_plans_orderId_fkey";

-- AlterTable
ALTER TABLE "public"."user_plans" ALTER COLUMN "orderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."user_plans" ADD CONSTRAINT "user_plans_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
