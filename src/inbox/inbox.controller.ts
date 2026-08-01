import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ListInboxQueryDto } from './dto/list-inbox-query.dto';
import { UpdateInboxStatusDto } from './dto/update-inbox-status.dto';
import { InboxService } from './inbox.service';

class ListInboxItemResponse {
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

  @ApiProperty()
  updatedAt!: Date;
}

@ApiTags('inbox')
@Controller('api/v1/inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Get()
  @ApiOperation({ summary: 'List inbox items (newest / highest severity first)' })
  @ApiOkResponse({ type: [ListInboxItemResponse] })
  list(@Query() query: ListInboxQueryDto): Promise<ListInboxItemResponse[]> {
    return this.inboxService.list(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inbox item status' })
  @ApiOkResponse({ type: ListInboxItemResponse })
  @ApiNotFoundResponse()
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInboxStatusDto,
  ): Promise<ListInboxItemResponse> {
    return this.inboxService.updateStatus(id, dto.status);
  }
}
