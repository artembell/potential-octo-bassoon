/*
  Warnings:

  - Added the required column `subscriptionId` to the `SubscriptionPart` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "SubscriptionPart" ADD COLUMN     "subscriptionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SubscriptionPart" ADD CONSTRAINT "SubscriptionPart_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
