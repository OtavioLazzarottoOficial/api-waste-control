-- DropForeignKey
ALTER TABLE "mealItens" DROP CONSTRAINT "mealItens_meal_id_fkey";

-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_user_id_fkey";

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users "("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mealItens" ADD CONSTRAINT "mealItens_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
