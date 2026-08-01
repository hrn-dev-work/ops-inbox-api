-- CreateEnum
CREATE TYPE "InboxStatus" AS ENUM ('OPEN', 'ACKED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inbox_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "status" "InboxStatus" NOT NULL DEFAULT 'OPEN',
    "provider" TEXT NOT NULL,
    "sourceEventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inbox_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbound_calls" (
    "id" TEXT NOT NULL,
    "inboxItemId" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "requestBody" JSONB NOT NULL,
    "responseBody" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbound_calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "webhook_events_provider_receivedAt_idx" ON "webhook_events"("provider", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_provider_externalId_key" ON "webhook_events"("provider", "externalId");

-- CreateIndex
CREATE INDEX "inbox_items_status_severity_idx" ON "inbox_items"("status", "severity");

-- CreateIndex
CREATE INDEX "inbox_items_provider_createdAt_idx" ON "inbox_items"("provider", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "inbox_items_sourceEventId_key" ON "inbox_items"("sourceEventId");

-- CreateIndex
CREATE INDEX "outbound_calls_inboxItemId_createdAt_idx" ON "outbound_calls"("inboxItemId", "createdAt");

-- AddForeignKey
ALTER TABLE "inbox_items" ADD CONSTRAINT "inbox_items_sourceEventId_fkey" FOREIGN KEY ("sourceEventId") REFERENCES "webhook_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbound_calls" ADD CONSTRAINT "outbound_calls_inboxItemId_fkey" FOREIGN KEY ("inboxItemId") REFERENCES "inbox_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
