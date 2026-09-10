ALTER TYPE "OrderNotificationDeliveryStatus" ADD VALUE 'DELIVERED';
ALTER TYPE "OrderNotificationDeliveryStatus" ADD VALUE 'READ';

ALTER TABLE "OrderNotification"
ADD COLUMN "deliveredAt" TIMESTAMP(3),
ADD COLUMN "failedAt" TIMESTAMP(3),
ADD COLUMN "lastAttemptAt" TIMESTAMP(3),
ADD COLUMN "providerMessageId" TEXT,
ADD COLUMN "readAt" TIMESTAMP(3),
ADD COLUMN "recipient" TEXT,
ADD COLUMN "templateLanguage" TEXT,
ADD COLUMN "templateName" TEXT;

ALTER TABLE "OrderRequest"
ADD COLUMN "idempotencyKeyHash" CHAR(64),
ADD COLUMN "whatsappOptInAt" TIMESTAMP(3);

ALTER TABLE "OrderStatusHistory" ADD COLUMN "changedByAdminId" TEXT;

CREATE UNIQUE INDEX "OrderNotification_providerMessageId_key" ON "OrderNotification"("providerMessageId");
CREATE UNIQUE INDEX "OrderRequest_idempotencyKeyHash_key" ON "OrderRequest"("idempotencyKeyHash");
CREATE INDEX "OrderStatusHistory_changedByAdminId_idx" ON "OrderStatusHistory"("changedByAdminId");

ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_changedByAdminId_fkey" FOREIGN KEY ("changedByAdminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
