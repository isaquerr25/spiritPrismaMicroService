-- CreateTable
CREATE TABLE "_AccountMetaTraderToPlanInvoices" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccountMetaTraderToPlanInvoices_AB_unique" ON "_AccountMetaTraderToPlanInvoices"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountMetaTraderToPlanInvoices_B_index" ON "_AccountMetaTraderToPlanInvoices"("B");

-- AddForeignKey
ALTER TABLE "_AccountMetaTraderToPlanInvoices" ADD CONSTRAINT "_AccountMetaTraderToPlanInvoices_A_fkey" FOREIGN KEY ("A") REFERENCES "AccountMetaTrader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountMetaTraderToPlanInvoices" ADD CONSTRAINT "_AccountMetaTraderToPlanInvoices_B_fkey" FOREIGN KEY ("B") REFERENCES "PlanInvoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
