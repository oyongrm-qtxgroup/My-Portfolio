// Contact form: validate → honeypot → rate limit → Cloudflare Turnstile → Resend.
// Nothing is stored; the message goes straight to CONTACT_TO by email.
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import {
  CONTACT_FROM,
  CONTACT_TO,
  RESEND_API_KEY,
  TURNSTILE_SECRET,
  VERCEL_ENV,
} from 'astro:env/server';

const production = VERCEL_ENV === 'production';

// Cloudflare's documented test secret: every token passes. Never used in production.
const TEST_SECRET = '1x0000000000000000000000000000000AA';

// Best effort only: serverless instances don't share memory, so this slows a
// single noisy client rather than enforcing a global limit.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

async function passesTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = TURNSTILE_SECRET ?? (production ? undefined : TEST_SECRET);
  if (!secret) {
    console.error('contact: TURNSTILE_SECRET is not set');
    throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'The form is not set up yet.' });
  }
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await call('Turnstile', 'https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const outcome = (await res.json()) as { success?: boolean };
  return outcome.success === true;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

// Network failures reach the visitor as a plain "didn't send", never as a stack message.
async function call(what: string, url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(10_000) });
  } catch (err) {
    console.error(`contact: ${what} unreachable:`, err);
    throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: "The message didn't send." });
  }
}

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().trim().max(100, { error: 'Keep your name under 100 characters.' }).optional(),
      email: z
        .string({ error: 'Enter an email like name@company.com so I can reply.' })
        .trim()
        .max(254, { error: 'Enter an email like name@company.com so I can reply.' })
        .pipe(z.email({ error: 'Enter an email like name@company.com so I can reply.' })),
      message: z
        .string({ error: 'Tell me a little about what needs building.' })
        .trim()
        .min(10, { error: 'Tell me a little about what needs building (a sentence is plenty).' })
        .max(5000, { error: 'Keep the message under 5,000 characters; we can go into detail by email.' }),
      // Honeypot: hidden from people, irresistible to form-filling bots.
      company: z.string().optional(),
      'cf-turnstile-response': z.string().optional(),
    }),
    handler: async (input, context) => {
      // A bot gets the same "Received" as a person, and the message goes nowhere.
      if (input.company) return { received: true };

      const ip =
        context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        context.clientAddress ||
        '';
      if (ip && rateLimited(ip)) {
        throw new ActionError({
          code: 'TOO_MANY_REQUESTS',
          message: 'That is a lot of messages in a short time. Please try again in a few minutes.',
        });
      }

      const token = input['cf-turnstile-response'];
      if (!token || !(await passesTurnstile(token, ip))) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: "The spam check didn't pass (it needs JavaScript).",
        });
      }

      const name = oneLine(input.name ?? '');
      if (!RESEND_API_KEY) {
        if (production) {
          console.error('contact: RESEND_API_KEY is not set');
          throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'The form is not set up yet.' });
        }
        // Previews and local runs without a key: log instead of sending.
        console.info(`contact (dry run): ${input.email}, ${input.message.length} characters`);
        return { received: true };
      }

      const res = await call('Resend', 'https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: CONTACT_FROM,
          to: [CONTACT_TO],
          reply_to: input.email,
          subject: `Portfolio message from ${name || input.email}`,
          text: `${input.message}\n\n— ${name || 'No name given'} <${input.email}>`,
        }),
      });
      if (!res.ok) {
        console.error(`contact: Resend answered ${res.status}: ${await res.text()}`);
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: "The message didn't send." });
      }
      return { received: true };
    },
  }),
};
