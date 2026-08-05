// Serverless API route: GET/POST bridge between the frontend and the
// Upstash Redis database attached via the Vercel Marketplace.
//
//   GET  /api/storage?key=chords-log   -> { value: <parsed JSON value or null> }
//   POST /api/storage  { key, value }  -> stores value under key, { ok: true }
//
// Requires an Upstash Redis database connected to this project (Vercel
// Dashboard -> your project -> Storage -> Browse Storage -> Upstash).
// Vercel automatically injects the credentials this route needs as
// environment variables — no manual copy/paste required. The exact
// variable names Vercel creates can vary depending on how the database was
// connected, so this checks both known naming conventions rather than
// hard-coding one.
//
// Edit password: reads (GET) are always open — anyone with the link can
// view the data. Writes (POST) require a matching x-site-password header
// if a SITE_PASSWORD environment variable is set on this project. If
// SITE_PASSWORD isn't set, writes are open too (so the site keeps working
// exactly as before until you deliberately turn this on). The frontend's
// login widget (index.html) sends this header automatically once someone
// enters the correct password.
//
// The frontend also uses a reserved key, "__verify__", to check a password
// is correct without writing any real data — this route recognizes it and
// responds without touching Redis at all.

import { Redis } from '@upstash/redis';

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const sitePassword = process.env.SITE_PASSWORD || '';

const redis = new Redis({ url: redisUrl, token: redisToken });

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const key = req.query.key;
      if (!key || typeof key !== 'string') {
        res.status(400).json({ error: 'Missing "key" query parameter.' });
        return;
      }
      if (!redisUrl || !redisToken) {
        res.status(500).json({
          error: 'No Redis credentials found. Make sure an Upstash database is connected to this project in Storage, and that you redeployed after connecting it.'
        });
        return;
      }
      const value = await redis.get(key);
      res.status(200).json({ value: value === undefined ? null : value });
      return;
    }

    if (req.method === 'POST') {
      if (sitePassword) {
        const provided = req.headers['x-site-password'];
        if (provided !== sitePassword) {
          res.status(401).json({ error: 'Incorrect password.' });
          return;
        }
      }

      const body = req.body || {};
      const { key, value } = body;
      if (!key || typeof key !== 'string') {
        res.status(400).json({ error: 'Missing "key" in request body.' });
        return;
      }

      // Verify-only request from the login widget — password already
      // checked above, nothing to actually write.
      if (key === '__verify__') {
        res.status(200).json({ ok: true });
        return;
      }

      if (!redisUrl || !redisToken) {
        res.status(500).json({
          error: 'No Redis credentials found. Make sure an Upstash database is connected to this project in Storage, and that you redeployed after connecting it.'
        });
        return;
      }
      await redis.set(key, value);
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error('Redis handler error:', err);
    res.status(500).json({ error: 'Storage request failed.' });
  }
}
