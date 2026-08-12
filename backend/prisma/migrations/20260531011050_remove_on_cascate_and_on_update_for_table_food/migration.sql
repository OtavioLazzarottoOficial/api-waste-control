-- DropForeignKey
ALTER TABLE "foods" DROP CONSTRAINT "foods_category_id_fkey";

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
