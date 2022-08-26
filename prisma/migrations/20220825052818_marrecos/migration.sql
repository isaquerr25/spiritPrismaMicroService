/*
  Warnings:

  - Added the required column `local` to the `PlanToAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlanToAccount" ADD COLUMN     "local" TEXT NOT NULL;
