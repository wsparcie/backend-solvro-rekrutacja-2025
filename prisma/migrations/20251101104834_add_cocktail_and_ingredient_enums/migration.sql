/*
  Warnings:

  - You are about to drop the column `instructions` on the `Cocktail` table. All the data in the column will be lost.
  - You are about to drop the column `isAlcohol` on the `Ingredient` table. All the data in the column will be lost.
  - Added the required column `instruction` to the `Cocktail` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Cocktail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `type` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CocktailCategory" AS ENUM ('ORDINARY_DRINK', 'COCKTAIL', 'SHAKE', 'COCOA', 'SHOT', 'COFFEE_TEA', 'HOMEMADE_LIQUEUR', 'PUNCH_PARTY_DRINK', 'BEER', 'SOFT_DRINK');

-- CreateEnum
CREATE TYPE "IngredientType" AS ENUM ('ALCOHOLIC', 'NON_ALCOHOLIC');

-- AlterTable
ALTER TABLE "Cocktail" DROP COLUMN "instructions",
ADD COLUMN     "instruction" TEXT NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "CocktailCategory" NOT NULL;

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "isAlcohol",
ADD COLUMN     "type" "IngredientType" NOT NULL;
