-- CreateEnum
CREATE TYPE "Enum" AS ENUM ('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER', 'GUEST');

-- CreateEnum
CREATE TYPE "AccountMetaTraderEnum" AS ENUM ('WAIT_PAYMENT', 'WORK', 'DOCUMENT_SEND_INVALID', 'LATE_INVOICES', 'PROCESS', 'PAY_TO_ACTIVATE', 'STOP');

-- CreateEnum
CREATE TYPE "AccountMetaTraderTypeEnum" AS ENUM ('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER', 'GUEST');

-- CreateEnum
CREATE TYPE "PlanInvoicesTypeEnum" AS ENUM ('ALL', 'SPECIFIC_ACCOUNT');

-- CreateEnum
CREATE TYPE "PlanInvoicesStatusEnum" AS ENUM ('OPEN', 'COMPLETE');

-- CreateEnum
CREATE TYPE "InvoicesEnum" AS ENUM ('WAIT_PAYMENT', 'DOCUMENT_SEND_INVALID', 'LATE_INVOICES', 'PROCESS', 'PAID_OUT', 'CANCEL');

-- CreateEnum
CREATE TYPE "OrdersStatusEnum" AS ENUM ('CLOSE', 'OPEN', 'PROBLEM');

-- CreateEnum
CREATE TYPE "OrdersTypeEnum" AS ENUM ('NORMAL', 'SPECIAL', 'CORRECTION');

-- CreateEnum
CREATE TYPE "OrdersDirectionEnum" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "LoteAutoCalculateDangerEnum" AS ENUM ('LOW', 'NORMAL', 'AGGRESSIVE', 'DEFAULT');

-- CreateEnum
CREATE TYPE "styleEnum" AS ENUM ('FIX', 'MULTIPLY_2', 'MULTIPLY_1_1', 'MULTIPLY_1_2', 'MULTIPLY_1_3', 'MULTIPLY_1_4', 'MULTIPLY_1_5');

-- CreateEnum
CREATE TYPE "PaymentProofEnum" AS ENUM ('INVALID', 'VALID', 'PROCESS');

-- CreateEnum
CREATE TYPE "PaymentAffilietedEnum" AS ENUM ('WAIT_CLOSE_CYCLO', 'NORMAL', 'AGGRESSIVE', 'DEFAULT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hashPayment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "affiliatedId" INTEGER,
    "percentAffiliated" INTEGER,
    "percentFess" INTEGER,
    "Enum" "Enum" NOT NULL DEFAULT E'GUEST',
    "confirm" TEXT DEFAULT E'notValid',
    "numberTelephone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountMetaTrader" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "server" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "balanceCredit" INTEGER NOT NULL,
    "accountNumber" INTEGER NOT NULL,
    "status" "AccountMetaTraderEnum" NOT NULL DEFAULT E'WAIT_PAYMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "finishDate" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "typeAccount" "AccountMetaTraderTypeEnum" NOT NULL DEFAULT E'GUEST',
    "local" TEXT[],

    CONSTRAINT "AccountMetaTrader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanInvoices" (
    "id" SERIAL NOT NULL,
    "beginDate" TIMESTAMP(3) NOT NULL,
    "finishDate" TIMESTAMP(3) NOT NULL,
    "realDollarQuote" INTEGER NOT NULL,
    "accountNumber" INTEGER,
    "grossProfitDollar" INTEGER,
    "profitDollar" INTEGER,
    "affiliatedProfitDollar" INTEGER,
    "type" "PlanInvoicesTypeEnum" NOT NULL DEFAULT E'ALL',
    "status" "PlanInvoicesStatusEnum" NOT NULL DEFAULT E'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanInvoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoices" (
    "id" SERIAL NOT NULL,
    "valueDollar" INTEGER NOT NULL,
    "valueReal" INTEGER NOT NULL,
    "dollarQuote" INTEGER NOT NULL,
    "percentProfit" INTEGER NOT NULL,
    "percentFess" INTEGER NOT NULL,
    "status" "InvoicesEnum" NOT NULL DEFAULT E'WAIT_PAYMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymenbeginDate" TIMESTAMP(3),
    "paymentDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountMetaTraderId" INTEGER NOT NULL,
    "planInvoicesId" INTEGER,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdersAccount" (
    "id" SERIAL NOT NULL,
    "par" TEXT NOT NULL,
    "direction" "OrdersDirectionEnum" NOT NULL,
    "lote" INTEGER NOT NULL,
    "ticket" INTEGER NOT NULL,
    "local" TEXT NOT NULL,
    "type" "OrdersTypeEnum" NOT NULL,
    "status" "OrdersStatusEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountMetaTraderId" INTEGER NOT NULL,
    "ordersId" INTEGER NOT NULL,

    CONSTRAINT "OrdersAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "par" TEXT NOT NULL,
    "direction" "OrdersDirectionEnum" NOT NULL,
    "lote" INTEGER NOT NULL,
    "ticket" INTEGER NOT NULL,
    "local" TEXT NOT NULL,
    "type" "OrdersTypeEnum" NOT NULL,
    "status" "OrdersStatusEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoteAutoCalculate" (
    "id" SERIAL NOT NULL,
    "minCapital" INTEGER NOT NULL,
    "maxCapital" INTEGER NOT NULL,
    "maxLot" INTEGER,
    "minLot" INTEGER,
    "local" TEXT NOT NULL,
    "valueBase" INTEGER NOT NULL,
    "type" "LoteAutoCalculateDangerEnum" NOT NULL,
    "styleMath" "styleEnum" NOT NULL DEFAULT E'MULTIPLY_1_1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoteAutoCalculate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentProof" (
    "id" SERIAL NOT NULL,
    "state" "PaymentProofEnum" DEFAULT E'PROCESS',
    "fileName" TEXT NOT NULL,
    "invoicesId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentProof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAffilieted" (
    "id" SERIAL NOT NULL,
    "valueDolar" INTEGER NOT NULL,
    "valueReal" INTEGER NOT NULL,
    "dollarQuote" INTEGER NOT NULL,
    "status" "InvoicesEnum" NOT NULL DEFAULT E'WAIT_PAYMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymenbeginDate" TIMESTAMP(3),
    "paymentDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountMetaTraderId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PaymentAffilieted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_affiliatedId_key" ON "User"("affiliatedId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_affiliatedId_fkey" FOREIGN KEY ("affiliatedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountMetaTrader" ADD CONSTRAINT "AccountMetaTrader_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_accountMetaTraderId_fkey" FOREIGN KEY ("accountMetaTraderId") REFERENCES "AccountMetaTrader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_planInvoicesId_fkey" FOREIGN KEY ("planInvoicesId") REFERENCES "PlanInvoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersAccount" ADD CONSTRAINT "OrdersAccount_accountMetaTraderId_fkey" FOREIGN KEY ("accountMetaTraderId") REFERENCES "AccountMetaTrader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersAccount" ADD CONSTRAINT "OrdersAccount_ordersId_fkey" FOREIGN KEY ("ordersId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentProof" ADD CONSTRAINT "PaymentProof_invoicesId_fkey" FOREIGN KEY ("invoicesId") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAffilieted" ADD CONSTRAINT "PaymentAffilieted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
