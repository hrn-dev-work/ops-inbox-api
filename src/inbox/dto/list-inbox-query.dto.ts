import { ApiPropertyOptional } from '@nestjs/swagger';
import { InboxStatus, Severity } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class ListInboxQueryDto {
  @ApiPropertyOptional({ enum: InboxStatus })
  @IsOptional()
  @IsEnum(InboxStatus)
  status?: InboxStatus;

  @ApiPropertyOptional({ enum: Severity })
  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;
}
