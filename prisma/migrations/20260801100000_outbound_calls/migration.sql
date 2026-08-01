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

CREATE INDEX "outbound_calls_inboxItemId_createdAt_idx" ON "outbound_calls"("inboxItemId", "createdAt");

ALTER TABLE "outbound_calls" ADD CONSTRAINT "outbound_calls_inboxItemId_fkey" FOREIGN KEY ("inboxItemId") REFERENCES "inbox_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
