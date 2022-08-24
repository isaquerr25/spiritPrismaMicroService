/*
  Warnings:

  - The `Enum` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER', 'GUEST');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Enum",
ADD COLUMN     "Enum" "Role" NOT NULL DEFAULT E'GUEST';

-- DropEnum
DROP TYPE "Enum";
