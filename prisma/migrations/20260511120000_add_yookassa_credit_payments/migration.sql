-- CreateTable
CREATE TABLE "CreditPayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "amountKopecks" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RUB',
    "status" TEXT NOT NULL DEFAULT 'created',
    "idempotenceKey" TEXT NOT NULL,
    "yookassaPaymentId" TEXT,
    "confirmationUrl" TEXT,
    "creditedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditPayment_idempotenceKey_key" ON "CreditPayment"("idempotenceKey");

-- CreateIndex
CREATE UNIQUE INDEX "CreditPayment_yookassaPaymentId_key" ON "CreditPayment"("yookassaPaymentId");

-- CreateIndex
CREATE INDEX "CreditPayment_userId_createdAt_idx" ON "CreditPayment"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CreditPayment_status_createdAt_idx" ON "CreditPayment"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "CreditPayment" ADD CONSTRAINT "CreditPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
