/*
  Warnings:

  - You are about to drop the `_AccountMetaTraderToPlanInvoices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AccountMetaTraderToPlanInvoices" DROP CONSTRAINT "_AccountMetaTraderToPlanInvoices_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccountMetaTraderToPlanInvoices" DROP CONSTRAINT "_AccountMetaTraderToPlanInvoices_B_fkey";

-- DropTable
DROP TABLE "_AccountMetaTraderToPlanInvoices";

-- CreateTable
CREATE TABLE "PlanToAccount" (
    "planInvoicesId" INTEGER NOT NULL,
    "accountMetaTraderId" INTEGER NOT NULL,

    CONSTRAINT "PlanToAccount_pkey" PRIMARY KEY ("planInvoicesId","accountMetaTraderId")
);

-- AddForeignKey
ALTER TABLE "PlanToAccount" ADD CONSTRAINT "PlanToAccount_accountMetaTraderId_fkey" FOREIGN KEY ("accountMetaTraderId") REFERENCES "AccountMetaTrader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanToAccount" ADD CONSTRAINT "PlanToAccount_planInvoicesId_fkey" FOREIGN KEY ("planInvoicesId") REFERENCES "PlanInvoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
