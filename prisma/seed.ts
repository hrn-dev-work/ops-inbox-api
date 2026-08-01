/**
 * Local-only demo seed. Uses Faker — never hardcode real PII or production rows.
 * Run: `npm run db:seed` (Compose Postgres + migrated schema required).
 */
import { faker } from '@faker-js/faker';
import {
  InboxStatus,
  PrismaClient,
  Severity,
} from '@prisma/client';
import { assertSafeSeedDatabaseUrl } from '../src/prisma/assert-safe-seed-database-url';

const prisma = new PrismaClient();

const PROVIDERS = ['stripe', 'github', 'pagerduty'] as const;

async function main(): Promise<void> {
  assertSafeSeedDatabaseUrl(process.env.DATABASE_URL);

  await prisma.outboundCall.deleteMany();
  await prisma.inboxItem.deleteMany();
  await prisma.webhookEvent.deleteMany();

  const count = 8;

  for (let i = 0; i < count; i += 1) {
    const provider = faker.helpers.arrayElement([...PROVIDERS]);
    const externalId = faker.string.uuid();
    const contactName = faker.person.fullName();
    const contactEmail = faker.internet.email();
    const contactPhone = faker.phone.number();
    const severity = faker.helpers.arrayElement(Object.values(Severity));
    const status = faker.helpers.arrayElement(Object.values(InboxStatus));
    const title = `${faker.hacker.verb()} ${faker.hacker.noun()} alert`;
    const summary = `${contactName} <${contactEmail}> · ${contactPhone} · ${faker.company.catchPhrase()}`;

    await prisma.webhookEvent.create({
      data: {
        provider,
        externalId,
        payload: {
          type: faker.hacker.noun(),
          customer: {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
          },
          note: faker.lorem.sentence(),
        },
        processedAt: new Date(),
        inboxItem: {
          create: {
            title,
            summary,
            severity,
            status,
            provider,
            outboundCalls: {
              create: {
                targetUrl: faker.internet.url(),
                statusCode: faker.helpers.arrayElement([200, 202, 502]),
                requestBody: {
                  title,
                  severity,
                  notifyEmail: contactEmail,
                },
                responseBody: {
                  ok: true,
                  requestId: faker.string.uuid(),
                },
              },
            },
          },
        },
      },
    });
  }

  console.log(`Seeded ${count} webhook→inbox→outbound demo rows (Faker PII only).`);
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
