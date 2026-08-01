import { Severity } from '@prisma/client';

type PayloadShape = {
  title?: unknown;
  message?: unknown;
  summary?: unknown;
  severity?: unknown;
  type?: unknown;
};

export function mapPayloadToInbox(input: {
  provider: string;
  payload: Record<string, unknown>;
}): {
  title: string;
  summary: string;
  severity: Severity;
} {
  const payload = input.payload as PayloadShape;
  const title =
    (typeof payload.title === 'string' && payload.title) ||
    (typeof payload.type === 'string' && payload.type) ||
    `${input.provider} event`;

  const summary =
    (typeof payload.message === 'string' && payload.message) ||
    (typeof payload.summary === 'string' && payload.summary) ||
    'No summary provided';

  return {
    title,
    summary,
    severity: normalizeSeverity(payload.severity),
  };
}

function normalizeSeverity(value: unknown): Severity {
  if (typeof value !== 'string') {
    return Severity.MEDIUM;
  }
  const upper = value.toUpperCase();
  if (upper in Severity) {
    return Severity[upper as keyof typeof Severity];
  }
  return Severity.MEDIUM;
}
