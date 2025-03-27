-- CreateTable
CREATE TABLE "hash_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hash_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HashTagToPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HashTagToPost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "hash_tags_name_key" ON "hash_tags"("name");

-- CreateIndex
CREATE INDEX "_HashTagToPost_B_index" ON "_HashTagToPost"("B");

-- AddForeignKey
ALTER TABLE "_HashTagToPost" ADD CONSTRAINT "_HashTagToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "hash_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HashTagToPost" ADD CONSTRAINT "_HashTagToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
