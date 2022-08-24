-- DropForeignKey
ALTER TABLE "Invoices" DROP CONSTRAINT "Invoices_accountMetaTraderId_fkey";

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_accountMetaTraderId_fkey" FOREIGN KEY ("accountMetaTraderId") REFERENCES "AccountMetaTrader"("id") ON DELETE CASCADE ON UPDATE CASCADE;
