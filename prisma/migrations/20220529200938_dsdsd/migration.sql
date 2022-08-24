-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "stopLoss" TEXT,
ADD COLUMN     "takeProfit" TEXT;

-- AlterTable
ALTER TABLE "OrdersAccount" ADD COLUMN     "stopLoss" TEXT,
ADD COLUMN     "takeProfit" TEXT;
