-- CreateEnum
CREATE TYPE "InvoicesTypeEnum" AS ENUM ('FINISH_ACCOUNT', 'OPEN_ACCOUNT', 'COMMON');

-- AlterTable
ALTER TABLE "Invoices" ADD COLUMN     "type" "InvoicesTypeEnum" NOT NULL DEFAULT E'COMMON';
