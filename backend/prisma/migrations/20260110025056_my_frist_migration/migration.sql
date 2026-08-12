-- CreateEnum
CREATE TYPE "RolesType" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "TurnsType" AS ENUM ('AFTERNOON', 'DINNER');

-- CreateEnum
CREATE TYPE "ReasonType" AS ENUM ('LEFTOVER', 'ITSPOILED', 'ERROR_PREPARATION');

-- CreateTable
CREATE TABLE "users " (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "RolesType" NOT NULL,

    CONSTRAINT "users _pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meals" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "turn" "TurnsType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mealItens" (
    "id" TEXT NOT NULL,
    "quantity_served" DECIMAL(10,2) NOT NULL,
    "quantity_consumeds" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "meal_id" TEXT NOT NULL,
    "food_id" TEXT NOT NULL,

    CONSTRAINT "mealItens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wastes" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" "ReasonType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "meal_item_id" TEXT NOT NULL,

    CONSTRAINT "wastes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users _username_key" ON "users "("username");

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users "("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mealItens" ADD CONSTRAINT "mealItens_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mealItens" ADD CONSTRAINT "mealItens_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wastes" ADD CONSTRAINT "wastes_meal_item_id_fkey" FOREIGN KEY ("meal_item_id") REFERENCES "mealItens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
