# Chord Log & Practice — setup

This project has your existing app (`index.html`) plus one serverless API
route (`api/kv.js`) that reads and writes to Vercel KV. Storage is now
server-side and shared across every browser/device — not tied to any one
computer.

## One-time setup

1. **Deploy this whole folder to Vercel** — either drag-and-drop it in the
   Vercel dashboard, or push it to a GitHub repo and import that repo into
   Vercel. (This replaces the old "just upload one HTML file" workflow —
   Vercel needs `package.json` and `api/kv.js` alongside `index.html` to run
   the serverless function.)
2. In your Vercel project, go to **Storage → Create Database → KV**, and
   attach it to this project. Vercel automatically sets the
   `KV_REST_API_URL` / `KV_REST_API_TOKEN` environment variables the API
   route needs — you don't need to copy/paste anything yourself.
3. Redeploy once after attaching the database (Vercel will prompt you to,
   or just push again) so the new environment variables take effect.

That's it — open the site and everything you add will be saved in Vercel KV.

## Making future changes

From now on, when you want to update the app, you have two options:

**Option A — re-upload manually.** Edit `index.html` (or have Claude do it),
keep `api/kv.js` and `package.json` as-is unless the storage logic itself is
changing, then drag-and-drop the whole folder onto your existing Vercel
project again to redeploy.

**Option B — connect it to GitHub.** Push this folder to a GitHub repo once
and import that repo into Vercel. After that, every `git push` triggers an
automatic redeploy — no manual re-upload needed. Worth doing if you expect
to update this fairly often.

Either way, your data is safe: none of it lives in these files. It only
resets if you deploy to a *different* Vercel project (different KV
database attached), or if the storage key names in the code change. As
long as you redeploy to this same project and keep the keys as they are
(`chords-log`, `practice-log`, `one-minute-changes-log`,
`perfect-changes-log`), old entries stick around no matter how much the
UI or code around them changes.

## Heads up: no login/authentication

The `/api/kv` route is open — anyone who knows your deployed URL could read
or write these same keys. That's fine for a personal tool with an
unguessable URL, but if you ever want it locked down (e.g. a simple shared
password), that's a small addition — just ask.
