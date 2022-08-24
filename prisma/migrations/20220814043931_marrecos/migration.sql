-- CreateEnum
CREATE TYPE "PlanToAccountStatusEnum" AS ENUM ('OPEN', 'COMPLETE');

-- AlterTable
ALTER TABLE "PlanToAccount" ADD COLUMN     "status" "PlanInvoicesStatusEnum" NOT NULL DEFAULT E'OPEN';
