-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('usd');

-- CreateEnum
CREATE TYPE "PricePeriod" AS ENUM ('week', 'month', 'year');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('paid', 'not_paid');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'usd',
    "amount" INTEGER NOT NULL,
    "period" "PricePeriod" NOT NULL,
    "productId" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "priceId" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPart" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL,

    CONSTRAINT "SubscriptionPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'paid',
    "subscriptionPartId" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionPartId_fkey" FOREIGN KEY ("subscriptionPartId") REFERENCES "SubscriptionPart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
