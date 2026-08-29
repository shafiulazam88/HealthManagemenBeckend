/*
  Warnings:

  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "image",
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "profilePhoto" TEXT;
