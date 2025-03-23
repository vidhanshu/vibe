-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "repliedToMessageId" TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_repliedToMessageId_fkey" FOREIGN KEY ("repliedToMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
