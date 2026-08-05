// Serverless API route: GET/POST bridge between the frontend and Vercel KV.
//
//   GET  /api/kv?key=chords-log        -> { value: <parsed JSON value or null> }
//   POST /api/kv  { key, value }       -> stores value under key, { ok: true }
//
// Requires a Vercel KV database attached to this project (Vercel Dashboard ->
// your project -> Storage -> Create Database -> KV). Once attached, Vercel
// automatically injects the KV_REST_API_URL / KV_REST_API_TOKEN environment
// variables this route needs — no manual env var setup required.
//
// Note: this endpoint has no authentication. Anyone who knows your deployed
// URL could read or write these keys. That's fine for a personal practice
// tool with an obscure URL, but if you ever want it locked down, a simple
// shared-secret header is an easy next step — just ask.

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const key = req.query.key;
      if (!key || typeof key !== 'string') {
        res.status(400).json({ error: 'Missing "key" query parameter.' });
        return;
      }
      const value = await kv.get(key);
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
      await kv.set(key, value);
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error('KV handler error:', err);
    res.status(500).json({ error: 'Storage request failed.' });
  }
}
