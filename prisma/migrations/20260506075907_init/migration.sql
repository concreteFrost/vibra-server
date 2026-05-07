/*
  Warnings:

  - Made the column `uploaderId` on table `Track` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_uploaderId_fkey";

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "uploaderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
