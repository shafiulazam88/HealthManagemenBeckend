/*
  Warnings:

  - You are about to drop the `Specilities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctor_specialities" DROP CONSTRAINT "doctor_specialities_specialityId_fkey";

-- DropTable
DROP TABLE "Specilities";

-- CreateTable
CREATE TABLE "Specialities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Specialities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialities_title_key" ON "Specialities"("title");

-- CreateIndex
CREATE INDEX "idx_speciality_isDeleted" ON "Specialities"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_speciality_title" ON "Specialities"("title");

-- AddForeignKey
ALTER TABLE "doctor_specialities" ADD CONSTRAINT "doctor_specialities_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
