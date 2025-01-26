/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `statuses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `statuses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "statuses" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "statuses_userId_key" ON "statuses"("userId");

-- CreateIndex
CREATE INDEX "statuses_userId_idx" ON "statuses"("userId");

-- AddForeignKey
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "statuses_userId_id_idx" ON "statuses"("userId", "id");
