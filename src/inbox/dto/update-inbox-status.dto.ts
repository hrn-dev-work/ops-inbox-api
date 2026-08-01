import { ApiProperty } from '@nestjs/swagger';
import { InboxStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateInboxStatusDto {
  @ApiProperty({ enum: InboxStatus })
  @IsEnum(InboxStatus)
  status!: InboxStatus;
}
