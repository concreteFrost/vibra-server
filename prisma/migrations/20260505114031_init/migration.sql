/*
  Warnings:

  - You are about to drop the column `filepath` on the `Track` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "filepath",
ADD COLUMN     "fileKey" TEXT NOT NULL DEFAULT '';
