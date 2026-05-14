/*
  Warnings:

  - You are about to drop the column `artistId` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_artistId_fkey";

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "artistId";

-- DropTable
DROP TABLE "Artist";
