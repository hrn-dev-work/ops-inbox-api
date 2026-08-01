import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { IngestWebhookDto } from './dto/ingest-webhook.dto';
import { WebhooksService } from './webhooks.service';

class IngestInboxItemResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  summary!: string;

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
  severity!: string;

  @ApiProperty({ enum: ['OPEN', 'ACKED', 'CLOSED'] })
  status!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  createdAt!: Date;
}

class IngestResponse {
  @ApiProperty({ description: 'true when a new InboxItem was created' })
  created!: boolean;

  @ApiProperty({ type: IngestInboxItemResponse })
  item!: IngestInboxItemResponse;
}

@ApiTags('webhooks')
@Controller('api/v1/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post(':provider')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Ingest a signed webhook (idempotent by provider + externalId)',
  })
  @ApiHeader({
    name: 'X-Signature-SHA256',
    description: 'Hex HMAC-SHA256 of the raw JSON body',
    required: true,
  })
  @ApiOkResponse({ type: IngestResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid signature' })
  async ingest(
    @Param('provider') provider: string,
    @Body() dto: IngestWebhookDto,
    @Headers('x-signature-sha256') signature: string | undefined,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<IngestResponse> {
    const rawBody = req.rawBody?.toString('utf8') ?? JSON.stringify(dto);

    const result = await this.webhooksService.ingest({
      provider,
      dto,
      rawBody,
      signatureHeader: signature,
    });

    return {
      created: result.created,
      item: {
        id: result.item.id,
        title: result.item.title,
        summary: result.item.summary,
        severity: result.item.severity,
        status: result.item.status,
        provider: result.item.provider,
        createdAt: result.item.createdAt,
      },
    };
  }
}
