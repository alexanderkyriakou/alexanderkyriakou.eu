const ALLOWED_ORIGINS = [
  'https://alexanderkyriakou.eu',
  'https://www.alexanderkyriakou.eu',
];
const ALLOWED_HOSTNAMES = ['alexanderkyriakou.eu', 'www.alexanderkyriakou.eu'];

const FROM = 'Contact Form <contact@alexanderkyriakou.eu>';

const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  messageMin: 10,
  messageMax: 3000,
  bodyMax: 10000,
};

// Name: no control characters at all (blocks CR/LF/tab and line separators).
const CONTROL_NAME = /[\u0000-\u001F\u007F\u2028\u2029]/;
// Name: no invisible zero-width or direction-override characters (subject spoofing).
const INVISIBLE = /[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/;
// Message: control characters rejected, except tab and line breaks.
const CONTROL_MESSAGE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
// Email: ASCII (Latin) characters only. This is the only Latin-restricted field.
const EMAIL =
  /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

const fail = (error, status) => json({ ok: false, error }, status);

export async function onRequest({ request, env }) {
  // 1. POST only
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'POST' });
  }

  // 2. Origin check (cheap, no network)
  const origin = request.headers.get('Origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return fail('forbidden', 403);
  }

  // 3. Server configuration present (never reveal which value is missing)
  if (!env.CONTACT_TO || !env.RESEND_API_KEY || !env.TURNSTILE_SECRET) {
    console.error('config_missing');
    return fail('server_error', 500);
  }

  // 4. Parse body
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.includes('application/json')) {
    return fail('invalid_request', 400);
  }
  const declaredLength = Number(request.headers.get('Content-Length') || 0);
  if (declaredLength > LIMITS.bodyMax) {
    return fail('invalid_request', 413);
  }

  let data;
  try {
    const raw = await request.text();
    if (raw.length > LIMITS.bodyMax) {
      return fail('invalid_request', 413);
    }
    data = JSON.parse(raw);
  } catch (e) {
    return fail('invalid_request', 400);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return fail('invalid_request', 400);
  }

  // 5. Turnstile verification, before any other processing of the content
  const token = typeof data.turnstileToken === 'string' ? data.turnstileToken : '';
  if (!token || token.length > 2048) {
    return fail('verification_failed', 400);
  }

  const verifyBody = new FormData();
  verifyBody.append('secret', env.TURNSTILE_SECRET);
  verifyBody.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) {
    verifyBody.append('remoteip', ip);
  }

  let verification;
  try {
    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: verifyBody }
    );
    verification = await verifyResponse.json();
  } catch (e) {
    console.error('turnstile_unreachable');
    return fail('verification_failed', 502);
  }

  // The hostname check fails with Cloudflare's dummy test keys. That is expected.
  if (
    !verification ||
    verification.success !== true ||
    !ALLOWED_HOSTNAMES.includes(verification.hostname)
  ) {
    return fail('verification_failed', 403);
  }

  // 6. Honeypot: fake success, send nothing
  if (
    data.website !== undefined &&
    data.website !== null &&
    String(data.website).trim() !== ''
  ) {
    return json({ ok: true });
  }

  // 7. Validate and trim
  if (
    typeof data.name !== 'string' ||
    typeof data.email !== 'string' ||
    typeof data.message !== 'string'
  ) {
    return fail('invalid_input', 400);
  }

  const name = data.name.trim().replace(/\s+/g, ' ');
  const email = data.email.trim();
  const message = data.message.trim().replace(/\r\n?/g, '\n');

  if (name.length < LIMITS.nameMin || name.length > LIMITS.nameMax) {
    return fail('invalid_input', 400);
  }
  if (CONTROL_NAME.test(name) || INVISIBLE.test(name)) {
    return fail('invalid_input', 400);
  }
  if (email.length > LIMITS.emailMax || !EMAIL.test(email)) {
    return fail('invalid_input', 400);
  }
  if (message.length < LIMITS.messageMin || message.length > LIMITS.messageMax) {
    return fail('invalid_input', 400);
  }
  if (CONTROL_MESSAGE.test(message)) {
    return fail('invalid_input', 400);
  }

  // 8. Send through Resend.
  // To and From are fixed. Subject uses only the validated name (no control characters).
  // Plain text only, so visitor input is never interpreted as HTML.
  const payload = {
    from: FROM,
    to: [String(env.CONTACT_TO).trim()],
    reply_to: email,
    subject: 'Website message from ' + name,
    text: 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message,
  };

  try {
    const sendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!sendResponse.ok) {
      // Log the status code only. Resend's error body can contain the account email.
      console.error('resend_status', sendResponse.status);
      return fail('send_failed', 502);
    }
  } catch (e) {
    console.error('resend_unreachable');
    return fail('send_failed', 502);
  }

  return json({ ok: true });
}