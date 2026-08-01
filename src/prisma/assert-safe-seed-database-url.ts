/**
 * Refuse destructive seeds against non-local databases.
 * Allowlist matches local Compose / host-dev only (see docs/en/local-seed.md).
 */
export function assertSafeSeedDatabaseUrl(
  databaseUrl: string | undefined,
  env: NodeJS.ProcessEnv = process.env,
): void {
  if ((env.NODE_ENV ?? '').toLowerCase() === 'production') {
    throw new Error('Refusing to seed: NODE_ENV=production');
  }

  if (!databaseUrl || databaseUrl.trim() === '') {
    throw new Error('Refusing to seed: DATABASE_URL is empty');
  }

  let parsed: URL;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error('Refusing to seed: DATABASE_URL is not a valid URL');
  }

  const host = parsed.hostname.toLowerCase();
  const allowedHosts = new Set([
    'localhost',
    '127.0.0.1',
    '::1',
    'host.docker.internal',
    'db', // Docker Compose service name
  ]);

  if (!allowedHosts.has(host)) {
    throw new Error(
      `Refusing to seed: DATABASE_URL host "${host}" is not in the local allowlist (${[...allowedHosts].join(', ')})`,
    );
  }
}
