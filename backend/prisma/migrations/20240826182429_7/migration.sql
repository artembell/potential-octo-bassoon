/*
  Warnings:

  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_subscriptionPartId_fkey";

-- DropTable
DROP TABLE "Invoice";

-- DropEnum
DROP TYPE "InvoiceStatus";
