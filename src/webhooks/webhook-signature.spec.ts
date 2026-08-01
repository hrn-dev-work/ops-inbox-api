import { signPayload, verifySignature } from './webhook-signature';

describe('webhook-signature', () => {
  const secret = 'dev-webhook-secret-change-me';
  const body = '{"externalId":"evt_1","payload":{"title":"x"}}';

  it('accepts a matching signature', () => {
    const signature = signPayload(secret, body);
    expect(verifySignature(secret, body, signature)).toBe(true);
  });

  it('rejects a tampered body', () => {
    const signature = signPayload(secret, body);
    expect(verifySignature(secret, body + ' ', signature)).toBe(false);
  });

  it('rejects a missing signature', () => {
    expect(verifySignature(secret, body, undefined)).toBe(false);
  });
});
