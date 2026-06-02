/*
  Warnings:

  - A unique constraint covering the columns `[playlistId,position]` on the table `PlaylistTrack` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PlaylistTrack" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistTrack_playlistId_position_key" ON "PlaylistTrack"("playlistId", "position");
