-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('image', 'video', 'text');

-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "statusId" TEXT;

-- CreateTable
CREATE TABLE "statuses" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "backgroundColor" TEXT DEFAULT '#000000',
    "statusType" "StatusType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "statuses_createdAt_idx" ON "statuses"("createdAt");

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
