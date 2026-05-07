-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_uploaderId_fkey";

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
