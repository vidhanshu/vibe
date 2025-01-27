-- CreateTable
CREATE TABLE "status_views" (
    "id" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "status_views_statusId_idx" ON "status_views"("statusId");

-- CreateIndex
CREATE INDEX "status_views_viewerId_idx" ON "status_views"("viewerId");

-- CreateIndex
CREATE UNIQUE INDEX "status_views_viewerId_statusId_key" ON "status_views"("viewerId", "statusId");

-- AddForeignKey
ALTER TABLE "status_views" ADD CONSTRAINT "status_views_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_views" ADD CONSTRAINT "status_views_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
