/*
  Warnings:

  - Added the required column `color` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "color" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "updatedAt" DROP DEFAULT;
