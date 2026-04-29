/**
 * claudemd-kit subscription Worker
 *
 * Endpoints:
 *   POST /api/subscribe        — accepts email + Turnstile token, sends kit
 *   GET  /api/health           — simple health check
 *
 * Required secrets (set via `wrangler secret put`):
 *   RESEND_API_KEY             — Resend API key
 *   TURNSTILE_SECRET_KEY       — Turnstile server-side secret
 *
 * Required vars (in wrangler.toml [vars]):
 *   RESEND_AUDIENCE_ID         — Resend audience to add contacts to
 *   FROM_EMAIL                 — Verified sender email
 *   FROM_NAME                  — Display name
 *   DOWNLOAD_URL               — Public R2 URL for the kit zip
 *   ARTICLE_URL                — Link to the published article
 *   ALLOWED_ORIGIN             — Your Pages domain
 *
 * Optional bindings:
 *   DB                         — D1 database for local subscriber storage
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (url.pathname === '/api/health' && request.method === 'GET') {
      return json({ ok: true, service: 'claudemd-kit-subscribe' }, 200, env);
    }

    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      return handleSubscribe(request, env, ctx);
    }

    return json({ error: 'Not found' }, 404, env);
  }
};

async function handleSubscribe(request, env, ctx) {
  let email, turnstileToken;
  try {
    const body = await request.json();
    email = (body.email || '').trim().toLowerCase();
    turnstileToken = body.turnstileToken;
  } catch {
    return json({ error: 'Invalid request body' }, 400, env);
  }

  if (!email || !isValidEmail(email)) {
    return json({ error: 'Please provide a valid email address.' }, 400, env);
  }

  if (!turnstileToken) {
    return json({ error: 'Missing bot check token. Please refresh and try again.' }, 400, env);
  }

  const clientIp = request.headers.get('CF-Connecting-IP') || '';
  const turnstileOk = await verifyTurnstile(turnstileToken, clientIp, env);
  if (!turnstileOk) {
    return json({ error: 'Bot check failed. Please refresh and try again.' }, 403, env);
  }

  if (isDisposableEmail(email)) {
    return json({ error: 'Please use a permanent email address.' }, 400, env);
  }

  if (env.DB) {
    try {
      await env.DB.prepare(
        `INSERT INTO subscribers (email, source, created_at)
         VALUES (?1, 'claudemd-kit', ?2)
         ON CONFLICT(email) DO UPDATE SET last_seen_at = excluded.created_at`
      )
        .bind(email, new Date().toISOString())
        .run();
    } catch (err) {
      console.error('D1 insert failed:', err);
    }
  }

  const audienceResult = await addToResendAudience(email, env);
  if (!audienceResult.ok) {
    console.error('Audience add failed:', audienceResult.error);
  }

  const emailResult = await sendDownloadEmail(email, env);
  if (!emailResult.ok) {
    return json(
      { error: "We couldn't send the email right now. Try again in a moment." },
      502,
      env
    );
  }

  return json({ success: true, message: 'Email sent.' }, 200, env);
}

async function verifyTurnstile(token, ip, env) {
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return false;
  }

  const formData = new FormData();
  formData.append('secret', env.TURNSTILE_SECRET_KEY);
  formData.append('response', token);
  if (ip) formData.append('remoteip', ip);

  try {
    const resp = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: formData }
    );
    const data = await resp.json();
    if (!data.success) {
      console.error('Turnstile rejected:', data['error-codes']);
    }
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verify error:', err);
    return false;
  }
}

async function addToResendAudience(email, env) {
  if (!env.RESEND_AUDIENCE_ID) {
    return { ok: false, error: 'RESEND_AUDIENCE_ID not configured' };
  }

  const resp = await fetch(
    `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, unsubscribed: false })
    }
  );

  if (!resp.ok) {
    const text = await resp.text();
    return { ok: false, error: `Resend audience: ${resp.status} ${text}` };
  }

  return { ok: true };
}

async function sendDownloadEmail(email, env) {
  const html = renderEmailHtml(env);
  const text = renderEmailText(env);

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
      to: [email],
      subject: 'Your CLAUDE.md Starter Kit',
      html,
      text,
      tags: [{ name: 'campaign', value: 'claudemd-kit' }]
    })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error(`Resend send failed: ${resp.status} ${errText}`);
    return { ok: false };
  }

  return { ok: true };
}

function renderEmailHtml(env) {
  const downloadUrl = env.DOWNLOAD_URL;
  const articleUrl = env.ARTICLE_URL;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'IBM Plex Sans', -apple-system, sans-serif; background: #F5F2EB; color: #1A1A18; padding: 40px 20px; line-height: 1.6; margin: 0; }
  .wrap { max-width: 560px; margin: 0 auto; background: #FAF8F2; padding: 40px; border: 1px solid rgba(0,0,0,0.08); border-radius: 4px; }
  h1 { font-family: Georgia, serif; font-size: 28px; line-height: 1.2; margin: 0 0 20px; font-weight: 400; }
  h1 em { color: #B8472A; font-style: italic; }
  p { margin: 0 0 16px; font-size: 15px; }
  .btn { display: inline-block; background: #1A1A18; color: #F5F2EB !important; padding: 14px 24px; text-decoration: none; border-radius: 3px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; margin: 20px 0; }
  .meta { color: #6B6B65; font-size: 13px; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.08); }
  code { font-family: 'IBM Plex Mono', monospace; font-size: 13px; background: #ECE7DC; padding: 1px 6px; border-radius: 2px; }
  a { color: #B8472A; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>The <em>kit</em> is ready.</h1>
    <p>Fourteen files, ~15KB. Drop the <code>home/</code> contents into <code>~/.claude/</code> and the <code>project/</code> contents into any repo.</p>
    <p><a href="${downloadUrl}" class="btn">Download kit (.zip) →</a></p>
    <p>The README walks through install. Edit the placeholders in <code>~/.claude/CLAUDE.md</code> first — that's the file that matters most.</p>
    <p>If you haven't read the full article: <a href="${articleUrl}">CLAUDE.md Is Not a Config File</a>. It explains the why behind the structure.</p>
    <div class="meta">
      You'll occasionally hear from me about Claude Code workflow stuff. Nothing else. One-click unsubscribe in every email.<br><br>
      — Frank @ Kurka Labs
    </div>
  </div>
</body>
</html>`;
}

function renderEmailText(env) {
  return `The kit is ready.

Fourteen files, ~15KB. Drop the home/ contents into ~/.claude/ and the project/ contents into any repo.

Download: ${env.DOWNLOAD_URL}

The README walks through install. Edit the placeholders in ~/.claude/CLAUDE.md first — that's the file that matters most.

If you haven't read the full article: ${env.ARTICLE_URL}

You'll occasionally hear from me about Claude Code workflow stuff. Nothing else. One-click unsubscribe in every email.

— Frank @ Kurka Labs`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com',
  'throwaway.email', 'tempmail.com', 'temp-mail.org',
  'yopmail.com', 'trashmail.com', 'sharklasers.com',
  'getnada.com', 'mailnesia.com', 'maildrop.cc'
]);

function isDisposableEmail(email) {
  const domain = email.split('@')[1];
  return DISPOSABLE_DOMAINS.has(domain);
}

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

function json(data, status, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(env)
    }
  });
}
