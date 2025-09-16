-- DropForeignKey
ALTER TABLE "public"."plans" DROP CONSTRAINT "plans_planCategories_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_plans" DROP CONSTRAINT "user_plans_planId_fkey";

-- AlterTable
ALTER TABLE "public"."plans" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."plans" ADD CONSTRAINT "plans_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."plan_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_plans" ADD CONSTRAINT "user_plans_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
