-- CreateTable
CREATE TABLE "Specilities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Specilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specilities_title_key" ON "Specilities"("title");

-- CreateIndex
CREATE INDEX "idx_speciality_isDeleted" ON "Specilities"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_speciality_title" ON "Specilities"("title");
