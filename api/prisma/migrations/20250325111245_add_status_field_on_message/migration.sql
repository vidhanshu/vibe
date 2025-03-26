-- AlterTable
ALTER TABLE "chat_members" ALTER COLUMN "role" SET DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "statusId" TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
