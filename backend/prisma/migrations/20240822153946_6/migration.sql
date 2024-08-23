/*
  Warnings:

  - Added the required column `status` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('not_active', 'active', 'suspended', 'cancelled');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "status" "SubscriptionStatus" NOT NULL;
