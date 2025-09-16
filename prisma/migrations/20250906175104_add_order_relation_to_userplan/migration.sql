-- AddForeignKey
ALTER TABLE "public"."user_plans" ADD CONSTRAINT "user_plans_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
