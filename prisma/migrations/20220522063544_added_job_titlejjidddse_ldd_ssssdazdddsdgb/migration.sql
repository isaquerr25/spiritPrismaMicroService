/*
  Warnings:

  - You are about to drop the column `Enum` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Enum",
ADD COLUMN     "Role" "Role" NOT NULL DEFAULT E'GUEST';
