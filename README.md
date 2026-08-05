# Chord Practice Notebook — Setup Guide

## What this is

Your chord/practice-log app, running as a real website. Data is saved on
the server (in a small database), not in one browser — so it looks the
same no matter what device or browser you open the site from.

## What's in this folder

- **`index.html`** — the app itself (what you see and click on)
- **`package.json`** — tells Vercel which small helper package the server
  needs
- **`api/storage.js`** — a tiny server function that saves and loads your
  data. The app calls this instead of saving anything in the browser.

You won't need to edit `package.json` or `api/storage.js` yourself for
normal use — only `index.html` changes when the app itself changes.

---

## Step 1: Put these files on GitHub

1. Go to [github.com](https://github.com) and sign in (or create a free
   account).
2. Click **+** (top right) → **New repository**.
3. Give it a name, e.g. `chord-practice-notebook`. Leave "Add a README"
   **unchecked**. Click **Create repository**.
4. On the new, empty repo page, click **"uploading an existing file."**
5. Drag in all four items from this folder: `index.html`, `package.json`,
   `README.md`, and the whole **`api`** folder (so `storage.js` ends up
   *inside* an `api` folder in the repo — check this once uploaded).
6. Scroll down, add a commit message like "Initial upload," click
   **Commit changes**.

## Step 2: Import the repo into Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New...** → **Project**.
3. Under "Import Git Repository," find and select the repo you just made.
4. Leave all build settings on their defaults.
5. Click **Deploy**.

The site will go live, but storage won't work yet — that's the next step.

## Step 3: Connect a database

1. In your new Vercel project, click **Storage** → **Browse Storage**.
2. Under "Marketplace Database Providers," click **Upstash**
   (labeled "Serverless DB — Redis, Vector, Queue, Search").
3. Click **Continue**, then create a new Redis database when prompted.
4. On the "Connect a Project" screen: your project should already be
   selected. Leave **Custom Prefix blank** — don't type anything there.
   Leave "Sensitive" turned on. Click through to finish connecting it.
5. Back in your project, go to **Deployments** and redeploy the latest
   deployment (or just wait — Vercel often does this automatically after
   a new storage connection).

## Step 4: Confirm it actually works

1. Open your site's URL.
2. Add a chord (or log a practice entry).
3. Reload the page. If the entry is still there, storage is working.
4. For extra confidence, open the site in a different browser (or an
   incognito window) — you should see the exact same data, since it's
   stored on the server now, not in any one browser.

If an entry disappears after reloading, the most common cause is the
database not finishing its connection before the last deploy. Go to
**Settings → Environment Variables** on your project and confirm you see
either `KV_REST_API_URL` + `KV_REST_API_TOKEN`, or
`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — either pair is
fine, `api/storage.js` checks for both. If neither pair is there, the
database isn't connected yet — repeat Step 3.

---

## Making changes later

Whenever you want to change the app:

1. Edit the file(s) on GitHub directly (open the file → pencil/edit icon
   → make changes → commit), or delete and re-upload a new version.
2. That's it — since this repo is connected to Vercel, every commit
   triggers an automatic redeploy. No manual upload to Vercel needed.

Your saved data lives in the database, completely separate from these
files, so editing or replacing `index.html` never touches it. It would
only reset if you connected a *different* database, or if the storage key
names in the code changed (they're currently `chords-log`, `practice-log`,
`one-minute-changes-log`, and `perfect-changes-log`).

## One thing worth knowing: no login/password

`api/storage.js` has no authentication — anyone who knows your site's URL
could read or write this same data. That's normal for a small personal
tool with an unguessable URL, but if you'd ever like a simple password
added, that's a small change — just ask.
