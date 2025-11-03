/*
  Warnings:

  - You are about to alter the column `name` on the `Cocktail` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `quantity` on the `CocktailIngredient` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Ingredient` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `photo` on the `Ingredient` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "Cocktail" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "CocktailIngredient" ALTER COLUMN "quantity" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "photo" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;

-- CreateIndex
CREATE INDEX "CocktailIngredient_cocktailId_idx" ON "CocktailIngredient"("cocktailId");

-- CreateIndex
CREATE INDEX "CocktailIngredient_ingredientId_idx" ON "CocktailIngredient"("ingredientId");
