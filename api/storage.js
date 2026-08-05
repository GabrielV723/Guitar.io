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
// Note: this endpoint has no authentication. Anyone who knows your deployed
// URL could read or write these keys. That's fine for a personal practice
// tool with an obscure URL, but if you ever want it locked down, a simple
// shared-secret header is an easy next step — just ask.

import { Redis } from '@upstash/redis';

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = new Redis({ url: redisUrl, token: redisToken });

export default async function handler(req, res) {
  if (!redisUrl || !redisToken) {
    res.status(500).json({
      error: 'No Redis credentials found. Make sure an Upstash database is connected to this project in Storage, and that you redeployed after connecting it.'
    });
    return;
  }

  try {
    if (req.method === 'GET') {
      const key = req.query.key;
      if (!key || typeof key !== 'string') {
        res.status(400).json({ error: 'Missing "key" query parameter.' });
        return;
      }
      const value = await redis.get(key);
      res.status(200).json({ value: value === undefined ? null : value });
      return;
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const { key, value } = body;
      if (!key || typeof key !== 'string') {
        res.status(400).json({ error: 'Missing "key" in request body.' });
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
