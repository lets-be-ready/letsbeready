/* ============================================
   POST /api/subscribe
   Netlify function — saves a newsletter
   subscriber as a Sanity document.

   Same behavior as api/subscribe.js (the Vercel
   version); both stay in the repo so either host
   can serve the site.

   Required env vars (set in Netlify dashboard):
     SANITY_PROJECT_ID
     SANITY_DATASET
     SANITY_WRITE_TOKEN  ← write-only Sanity token

   Request body (JSON):
     { "email": "you@example.com",
       "source": "footer",         // optional
       "name": "Jane",             // optional
       "_hp": ""                   // honeypot — must be empty }

   Response:
     200 { ok: true }
     400 { ok: false, error: "..." }
     500 { ok: false, error: "..." }
   ============================================ */

import {createClient} from '@sanity/client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json'},
  });

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ok: false, error: 'Method not allowed'}), {
      status: 405,
      headers: {'Content-Type': 'application/json', Allow: 'POST'},
    });
  }

  let body;
  try {
    body = await req.json();
  } catch (_) {
    body = {};
  }
  if (!body || typeof body !== 'object') body = {};

  const email = String(body.email || '').trim().toLowerCase();
  const source = String(body.source || 'unknown').trim().slice(0, 100);
  const name = String(body.name || '').trim().slice(0, 200) || undefined;
  const honeypot = body._hp;

  // --- Honeypot: silently succeed if a bot filled it in ---
  if (honeypot) {
    return json(200, {ok: true});
  }

  // --- Validate email ---
  if (!email || !EMAIL_RE.test(email) || email.length > 320) {
    return json(400, {ok: false, error: 'Please enter a valid email address.'});
  }

  // --- Sanity client config ---
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_WRITE_TOKEN;

  if (!projectId || !token) {
    console.error('Missing SANITY_PROJECT_ID or SANITY_WRITE_TOKEN env var');
    return json(500, {ok: false, error: 'Server misconfigured. Please email us instead.'});
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  });

  try {
    // Check if this email already exists; if so, just return success
    // (don't create a duplicate, don't reveal whether they were already subscribed)
    const existing = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]{_id}`,
      {email},
    );

    if (existing) {
      return json(200, {ok: true});
    }

    // Create the new subscriber document
    const doc = {
      _type: 'subscriber',
      email,
      subscribed_at: new Date().toISOString(),
      source,
    };
    if (name) doc.name = name;

    await client.create(doc);

    return json(200, {ok: true});
  } catch (err) {
    console.error('Subscribe error:', err && err.message);
    return json(500, {ok: false, error: 'Something went wrong. Please try again or email us.'});
  }
}

export const config = {
  path: '/api/subscribe',
};
