-- CreateEnum
CREATE TYPE "accountTypeEnum" AS ENUM ('LOW', 'NORMAL', 'AGGRESSIVE', 'DEFAULT');

-- AlterTable
ALTER TABLE "AccountMetaTrader" ADD COLUMN     "accountType" "accountTypeEnum" NOT NULL DEFAULT E'NORMAL';
