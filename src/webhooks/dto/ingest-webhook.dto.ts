import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, MinLength } from 'class-validator';

export class IngestWebhookDto {
  @ApiProperty({
    description: 'Provider-side unique event id (used for idempotency)',
    example: 'evt_01JABC123',
  })
  @IsString()
  @MinLength(1)
  externalId!: string;

  @ApiProperty({
    description: 'Arbitrary JSON payload from the provider',
    example: {
      type: 'incident.created',
      title: 'Payment webhook failed',
      severity: 'HIGH',
      message: 'Stripe delivery timed out',
    },
  })
  @IsObject()
  payload!: Record<string, unknown>;
}
