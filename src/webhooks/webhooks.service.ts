import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InboxItem, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IngestWebhookDto } from './dto/ingest-webhook.dto';
import { mapPayloadToInbox } from './map-payload';
import { verifySignature } from './webhook-signature';

export type IngestResult = {
  created: boolean;
  item: InboxItem;
};

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async ingest(input: {
    provider: string;
    dto: IngestWebhookDto;
    rawBody: string;
    signatureHeader: string | undefined;
  }): Promise<IngestResult> {
    const secret = this.config.get<string>('WEBHOOK_SIGNING_SECRET');
    if (!secret) {
      throw new BadRequestException('WEBHOOK_SIGNING_SECRET is not configured');
    }

    if (!verifySignature(secret, input.rawBody, input.signatureHeader)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const existing = await this.prisma.webhookEvent.findUnique({
      where: {
        provider_externalId: {
          provider: input.provider,
          externalId: input.dto.externalId,
        },
      },
      include: { inboxItem: true },
    });

    if (existing?.inboxItem) {
      return { created: false, item: existing.inboxItem };
    }

    const mapped = mapPayloadToInbox({
      provider: input.provider,
      payload: input.dto.payload,
    });

    try {
      const item = await this.prisma.$transaction(async (tx) => {
        const event = await tx.webhookEvent.create({
          data: {
            provider: input.provider,
            externalId: input.dto.externalId,
            payload: input.dto.payload as Prisma.InputJsonValue,
            processedAt: new Date(),
          },
        });

        return tx.inboxItem.create({
          data: {
            title: mapped.title,
            summary: mapped.summary,
            severity: mapped.severity,
            provider: input.provider,
            sourceEventId: event.id,
          },
        });
      });

      return { created: true, item };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const raced = await this.prisma.webhookEvent.findUnique({
          where: {
            provider_externalId: {
              provider: input.provider,
              externalId: input.dto.externalId,
            },
          },
          include: { inboxItem: true },
        });
        if (raced?.inboxItem) {
          return { created: false, item: raced.inboxItem };
        }
      }
      throw error;
    }
  }
}
