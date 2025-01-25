/*
  Warnings:

  - You are about to drop the column `profileUrl` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `medias` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `medias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "postId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profileUrl";

-- CreateIndex
CREATE UNIQUE INDEX "medias_userId_key" ON "medias"("userId");

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
