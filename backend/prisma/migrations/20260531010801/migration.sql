/*
  Warnings:

  - The values [USER] on the enum `RolesType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `quantity_consumeds` on the `mealItens` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users ` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users ` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quantity_consumed` to the `mealItens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users ` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RolesType_new" AS ENUM ('ADMIN', 'EMPLOYEE');
ALTER TABLE "users " ALTER COLUMN "roles" TYPE "RolesType_new" USING ("roles"::text::"RolesType_new");
ALTER TYPE "RolesType" RENAME TO "RolesType_old";
ALTER TYPE "RolesType_new" RENAME TO "RolesType";
DROP TYPE "RolesType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "foods" DROP CONSTRAINT "foods_category_id_fkey";

-- DropIndex
DROP INDEX "users _username_key";

-- AlterTable
ALTER TABLE "mealItens" DROP COLUMN "quantity_consumeds",
ADD COLUMN     "quantity_consumed" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "users " DROP COLUMN "username",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users _email_key" ON "users "("email");

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
