import { assertSafeSeedDatabaseUrl } from './assert-safe-seed-database-url';

describe('assertSafeSeedDatabaseUrl', () => {
  const baseEnv = { NODE_ENV: 'development' } as NodeJS.ProcessEnv;

  it('allows localhost Compose-style URLs', () => {
    expect(() =>
      assertSafeSeedDatabaseUrl(
        'postgresql://app:app@localhost:5432/ops_inbox?schema=public',
        baseEnv,
      ),
    ).not.toThrow();
  });

  it('allows Docker service hostname db', () => {
    expect(() =>
      assertSafeSeedDatabaseUrl(
        'postgresql://app:app@db:5432/ops_inbox',
        baseEnv,
      ),
    ).not.toThrow();
  });

  it('rejects production NODE_ENV', () => {
    expect(() =>
      assertSafeSeedDatabaseUrl(
        'postgresql://app:app@localhost:5432/ops_inbox',
        {
          NODE_ENV: 'production',
        },
      ),
    ).toThrow(/NODE_ENV=production/);
  });

  it('rejects remote hosts', () => {
    expect(() =>
      assertSafeSeedDatabaseUrl(
        'postgresql://app:app@db.example.com:5432/ops_inbox',
        baseEnv,
      ),
    ).toThrow(/not in the local allowlist/);
  });

  it('rejects empty URL', () => {
    expect(() => assertSafeSeedDatabaseUrl('', baseEnv)).toThrow(/empty/);
  });
});
