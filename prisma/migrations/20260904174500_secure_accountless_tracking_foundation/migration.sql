CREATE TYPE "OrderNotificationChannel" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');
CREATE TYPE "OrderNotificationEvent" AS ENUM ('ORDER_CREATED', 'ORDER_STATUS_CHANGED');
CREATE TYPE "OrderNotificationDeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED');

ALTER TABLE "OrderRequest" ADD COLUMN "trackingTokenHash" CHAR(64);

CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL,
    "orderRequestId" TEXT NOT NULL,
    "previousStatus" "OrderRequestStatus",
    "newStatus" "OrderRequestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderNotification" (
    "id" TEXT NOT NULL,
    "orderRequestId" TEXT NOT NULL,
    "statusHistoryId" TEXT,
    "channel" "OrderNotificationChannel" NOT NULL,
    "eventType" "OrderNotificationEvent" NOT NULL,
    "orderStatus" "OrderRequestStatus",
    "deliveryStatus" "OrderNotificationDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "deduplicationKey" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OrderNotification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OrderRequest_trackingTokenHash_key" ON "OrderRequest"("trackingTokenHash");
CREATE INDEX "OrderStatusHistory_orderRequestId_createdAt_idx" ON "OrderStatusHistory"("orderRequestId", "createdAt");
CREATE INDEX "OrderStatusHistory_newStatus_createdAt_idx" ON "OrderStatusHistory"("newStatus", "createdAt");
CREATE UNIQUE INDEX "OrderNotification_deduplicationKey_key" ON "OrderNotification"("deduplicationKey");
CREATE UNIQUE INDEX "OrderNotification_statusHistoryId_channel_key" ON "OrderNotification"("statusHistoryId", "channel");
CREATE INDEX "OrderNotification_orderRequestId_createdAt_idx" ON "OrderNotification"("orderRequestId", "createdAt");
CREATE INDEX "OrderNotification_deliveryStatus_availableAt_idx" ON "OrderNotification"("deliveryStatus", "availableAt");
CREATE INDEX "OrderNotification_eventType_createdAt_idx" ON "OrderNotification"("eventType", "createdAt");

ALTER TABLE "OrderRequest" ADD CONSTRAINT "OrderRequest_trackingTokenHash_format_check" CHECK ("trackingTokenHash" IS NULL OR "trackingTokenHash" ~ '^[0-9a-f]{64}$');
ALTER TABLE "OrderNotification" ADD CONSTRAINT "OrderNotification_attemptCount_check" CHECK ("attemptCount" >= 0);
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderRequestId_fkey" FOREIGN KEY ("orderRequestId") REFERENCES "OrderRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderNotification" ADD CONSTRAINT "OrderNotification_orderRequestId_fkey" FOREIGN KEY ("orderRequestId") REFERENCES "OrderRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderNotification" ADD CONSTRAINT "OrderNotification_statusHistoryId_fkey" FOREIGN KEY ("statusHistoryId") REFERENCES "OrderStatusHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
