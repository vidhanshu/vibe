/*
  Warnings:

  - The values [image,video] on the enum `StatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusType_new" AS ENUM ('media', 'text');
ALTER TABLE "statuses" ALTER COLUMN "statusType" TYPE "StatusType_new" USING ("statusType"::text::"StatusType_new");
ALTER TYPE "StatusType" RENAME TO "StatusType_old";
ALTER TYPE "StatusType_new" RENAME TO "StatusType";
DROP TYPE "StatusType_old";
COMMIT;
