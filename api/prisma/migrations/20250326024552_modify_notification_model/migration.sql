/*
  Warnings:

  - You are about to drop the column `userId` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `byUserId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forUserId` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "userId",
ADD COLUMN     "byUserId" TEXT NOT NULL,
ADD COLUMN     "forUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_byUserId_fkey" FOREIGN KEY ("byUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_forUserId_fkey" FOREIGN KEY ("forUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- CreateIndex
CREATE INDEX "notifications_byUserId_postId_idx" ON "notifications"("byUserId", "postId");

-- CreateIndex
CREATE INDEX "notifications_byUserId_statusId_idx" ON "notifications"("byUserId", "statusId");

-- CreateIndex
CREATE INDEX "notifications_byUserId_forUserId_idx" ON "notifications"("byUserId", "forUserId");


-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'STATUS';

-- DropIndex
DROP INDEX "notifications_byUserId_postId_idx";

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "commentId" TEXT;

-- CreateIndex
CREATE INDEX "notifications_byUserId_postId_type_idx" ON "notifications"("byUserId", "postId", "type");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- DropIndex
DROP INDEX "notifications_byUserId_forUserId_idx";

-- CreateIndex
CREATE INDEX "notifications_byUserId_forUserId_type_idx" ON "notifications"("byUserId", "forUserId", "type");

/*
  Warnings:

  - A unique constraint covering the columns `[byUserId,statusId]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[byUserId,forUserId,type]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "notifications_byUserId_statusId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "notifications_byUserId_statusId_key" ON "notifications"("byUserId", "statusId");