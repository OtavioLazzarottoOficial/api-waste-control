-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_user_id_fkey";

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users "("id") ON DELETE CASCADE ON UPDATE CASCADE;
