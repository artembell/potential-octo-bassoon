/*
  Warnings:

  - You are about to drop the column `endDate` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "endDate";

-- AlterTable
ALTER TABLE "UserOnContent" ADD COLUMN     "endDate" TIMESTAMP(3);
