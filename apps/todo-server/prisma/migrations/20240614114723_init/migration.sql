/*
  Warnings:

  - You are about to alter the column `color` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(7)`.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "color" SET DATA TYPE VARCHAR(7);
