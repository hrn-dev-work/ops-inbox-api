import { Injectable, NotFoundException } from '@nestjs/common';
import { InboxItem, InboxStatus, Severity } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InboxService {
  constructor(private readonly prisma: PrismaService) {}

  list(filters: { status?: InboxStatus; severity?: Severity }) {
    return this.prisma.inboxItem.findMany({
      where: {
        status: filters.status,
        severity: filters.severity,
      },
      include: { outboundCalls: { orderBy: { createdAt: 'asc' } } },
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
      take: 100,
    });
  }

  async updateStatus(id: string, status: InboxStatus): Promise<InboxItem> {
    try {
      return await this.prisma.inboxItem.update({
        where: { id },
        data: { status },
        include: { outboundCalls: { orderBy: { createdAt: 'asc' } } },
      });
    } catch {
      throw new NotFoundException(`Inbox item ${id} not found`);
    }
  }
}
