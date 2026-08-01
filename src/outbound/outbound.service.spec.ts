import { ConfigService } from '@nestjs/config';
import { OutboundService } from './outbound.service';

describe('OutboundService', () => {
  it('records a mock outbound call without HTTP', async () => {
    const create = jest.fn().mockResolvedValue({
      id: 'out_1',
      inboxItemId: 'item_1',
      targetUrl: 'mock://ops-inbox/notify',
      statusCode: 200,
    });

    const prisma = {
      outboundCall: { create },
    };

    const config = {
      get: (key: string) => {
        if (key === 'OUTBOUND_MODE') return 'mock';
        return undefined;
      },
    };

    const service = new OutboundService(
      prisma as never,
      config as unknown as ConfigService,
    );

    const result = await service.notifyInboxCreated({
      inboxItemId: 'item_1',
      provider: 'stripe',
      title: 'Payment failed',
      summary: 'Timeout',
    });

    expect(result.statusCode).toBe(200);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          inboxItemId: 'item_1',
          targetUrl: 'mock://ops-inbox/notify',
          statusCode: 200,
        }),
      }),
    );
  });
});
