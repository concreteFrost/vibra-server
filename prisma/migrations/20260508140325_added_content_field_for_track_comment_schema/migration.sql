/*
  Warnings:

  - Added the required column `content` to the `TrackComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrackComment" ADD COLUMN     "content" TEXT NOT NULL;
