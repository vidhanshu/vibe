/*
  Warnings:

  - The values [image,video] on the enum `MediaType` will be removed. If these variants are still used in the database, this will fail.
  - The values [media,text] on the enum `StatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MediaType_new" AS ENUM ('IMAGE', 'VIDEO');
ALTER TABLE "medias" ALTER COLUMN "mediaType" TYPE "MediaType_new" USING ("mediaType"::text::"MediaType_new");
ALTER TYPE "MediaType" RENAME TO "MediaType_old";
ALTER TYPE "MediaType_new" RENAME TO "MediaType";
DROP TYPE "MediaType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StatusType_new" AS ENUM ('MEDIA', 'TEXT');
ALTER TABLE "statuses" ALTER COLUMN "statusType" TYPE "StatusType_new" USING ("statusType"::text::"StatusType_new");
ALTER TYPE "StatusType" RENAME TO "StatusType_old";
ALTER TYPE "StatusType_new" RENAME TO "StatusType";
DROP TYPE "StatusType_old";
COMMIT;
