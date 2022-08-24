/*
  Warnings:

  - The values [ERRO_LOGIN] on the enum `AccountMetaTraderEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountMetaTraderEnum_new" AS ENUM ('WAIT_PAYMENT', 'WORK', 'DOCUMENT_SEND_INVALID', 'LATE_INVOICES', 'PROCESS', 'PAY_TO_ACTIVATE', 'STOP', 'ERROR_LOGIN');
ALTER TABLE "AccountMetaTrader" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "AccountMetaTrader" ALTER COLUMN "status" TYPE "AccountMetaTraderEnum_new" USING ("status"::text::"AccountMetaTraderEnum_new");
ALTER TYPE "AccountMetaTraderEnum" RENAME TO "AccountMetaTraderEnum_old";
ALTER TYPE "AccountMetaTraderEnum_new" RENAME TO "AccountMetaTraderEnum";
DROP TYPE "AccountMetaTraderEnum_old";
ALTER TABLE "AccountMetaTrader" ALTER COLUMN "status" SET DEFAULT 'WAIT_PAYMENT';
COMMIT;
