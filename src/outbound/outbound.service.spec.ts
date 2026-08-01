import { ConfigService } from '@nestjs/config';
import { OutboundService } from './outbound.service';

type CreateArg = {
  data: {
    inboxItemId: string;
    targetUrl: string;
    statusCode: number;
  };
};

describe('OutboundService', () => {
  it('records a mock outbound call without HTTP', async () => {
    const create = jest
      .fn<Promise<{ statusCode: number }>, [CreateArg]>()
      .mockResolvedValue({
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
    expect(create).toHaveBeenCalledTimes(1);
    const arg = create.mock.calls[0][0];
    expect(arg.data.inboxItemId).toBe('item_1');
    expect(arg.data.targetUrl).toBe('mock://ops-inbox/notify');
    expect(arg.data.statusCode).toBe(200);
  });

  it('applies AbortSignal timeout on HTTP outbound', async () => {
    const create = jest.fn().mockResolvedValue({
      id: 'out_2',
      inboxItemId: 'item_2',
      statusCode: 200,
    });
    const fetchMock = jest
      .fn<
        Promise<{ status: number; text: () => Promise<string> }>,
        [string, RequestInit?]
      >()
      .mockResolvedValue({
        status: 200,
        text: () => Promise.resolve('{"ok":true}'),
      });
    global.fetch = fetchMock as unknown as typeof fetch;

    const prisma = { outboundCall: { create } };
    const config = {
      get: (key: string) => {
        if (key === 'OUTBOUND_MODE') return 'http';
        if (key === 'OUTBOUND_URL') return 'https://example.com/hook';
        if (key === 'OUTBOUND_TIMEOUT_MS') return '2500';
        return undefined;
      },
    };

    const service = new OutboundService(
      prisma as never,
      config as unknown as ConfigService,
    );

    await service.notifyInboxCreated({
      inboxItemId: 'item_2',
      provider: 'github',
      title: 'x',
      summary: 'y',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://example.com/hook');
    expect(init?.method).toBe('POST');
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });
});
