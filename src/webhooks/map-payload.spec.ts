import { Severity } from '@prisma/client';
import { mapPayloadToInbox } from './map-payload';

describe('mapPayloadToInbox', () => {
  it('maps title, message, and severity', () => {
    const result = mapPayloadToInbox({
      provider: 'sentry',
      payload: {
        title: 'DB pool exhausted',
        message: 'All connections in use',
        severity: 'critical',
      },
    });

    expect(result).toEqual({
      title: 'DB pool exhausted',
      summary: 'All connections in use',
      severity: Severity.CRITICAL,
    });
  });

  it('falls back when fields are missing', () => {
    const result = mapPayloadToInbox({
      provider: 'github',
      payload: { type: 'ping' },
    });

    expect(result.title).toBe('ping');
    expect(result.summary).toBe('No summary provided');
    expect(result.severity).toBe(Severity.MEDIUM);
  });
});
