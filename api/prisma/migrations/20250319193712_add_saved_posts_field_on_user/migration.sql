-- CreateTable
CREATE TABLE "_saved_posts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_saved_posts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_saved_posts_B_index" ON "_saved_posts"("B");

-- AddForeignKey
ALTER TABLE "_saved_posts" ADD CONSTRAINT "_saved_posts_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_saved_posts" ADD CONSTRAINT "_saved_posts_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
