-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnContent" (
    "userId" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "UserOnContent_pkey" PRIMARY KEY ("contentId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_productId_key" ON "Content"("productId");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnContent" ADD CONSTRAINT "UserOnContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnContent" ADD CONSTRAINT "UserOnContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
