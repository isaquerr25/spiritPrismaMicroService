/*
  Warnings:

  - The primary key for the `PlanToAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `status` column on the `PlanToAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PlanToAccount" DROP CONSTRAINT "PlanToAccount_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PlanToAccountStatusEnum" NOT NULL DEFAULT E'OPEN',
ADD CONSTRAINT "PlanToAccount_pkey" PRIMARY KEY ("id");
