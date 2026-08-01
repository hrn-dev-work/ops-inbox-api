import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OutboundCall, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type OutboundNotifyInput = {
  inboxItemId: string;
  provider: string;
  title: string;
  summary: string;
};

@Injectable()
export class OutboundService {
  private readonly logger = new Logger(OutboundService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async notifyInboxCreated(input: OutboundNotifyInput): Promise<OutboundCall> {
    const mode = (
      this.config.get<string>('OUTBOUND_MODE') ?? 'mock'
    ).toLowerCase();
    const targetUrl =
      this.config.get<string>('OUTBOUND_URL') ?? 'mock://ops-inbox/notify';

    const requestBody = {
      event: 'inbox.item.created',
      inboxItemId: input.inboxItemId,
      provider: input.provider,
      title: input.title,
      summary: input.summary,
    };

    if (mode === 'http') {
      return this.postHttp(targetUrl, input.inboxItemId, requestBody);
    }

    return this.prisma.outboundCall.create({
      data: {
        inboxItemId: input.inboxItemId,
        targetUrl: 'mock://ops-inbox/notify',
        statusCode: 200,
        requestBody: requestBody,
        responseBody: { mocked: true },
      },
    });
  }

  private async postHttp(
    targetUrl: string,
    inboxItemId: string,
    requestBody: Record<string, unknown>,
  ): Promise<OutboundCall> {
    let statusCode = 0;
    let responseBody: Prisma.InputJsonValue = { error: 'no response' };
    const timeoutMs = Number(
      this.config.get<string>('OUTBOUND_TIMEOUT_MS') ?? '5000',
    );

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(
          Number.isFinite(timeoutMs) ? timeoutMs : 5000,
        ),
      });
      statusCode = res.status;
      const text = await res.text();
      try {
        responseBody = JSON.parse(text) as Prisma.InputJsonValue;
      } catch {
        responseBody = { raw: text.slice(0, 2000) };
      }
    } catch (error) {
      statusCode = 0;
      responseBody = {
        error: error instanceof Error ? error.message : 'outbound failed',
      };
      this.logger.warn(
        `Outbound HTTP failed for inboxItemId=${inboxItemId} (no payload logged)`,
      );
    }

    return this.prisma.outboundCall.create({
      data: {
        inboxItemId,
        targetUrl,
        statusCode,
        requestBody: requestBody as Prisma.InputJsonValue,
        responseBody,
      },
    });
  }
}
