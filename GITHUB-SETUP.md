# Starting from GitHub: setting up a new Vercel project via import

This walks through the GitHub-first path: create the repo, push your files,
then import that repo into Vercel as a new project. No command-line/git
experience required — everything below can be done in the browser.

## 1. Create a GitHub account (skip if you have one)

Go to [github.com](https://github.com) and sign up. Free tier is all you need.

## 2. Create a new, empty repository

1. Click the **+** in the top-right of GitHub → **New repository**.
2. Give it a name, e.g. `chord-practice-notebook`.
3. Leave it **Public** or **Private** — either works with Vercel's free tier.
4. Do **not** check "Add a README" — leave the repo completely empty.
5. Click **Create repository**.

## 3. Upload your files (no git command line needed)

1. On the new repo's page, click **"uploading an existing file"** (a link
   shown on the empty repo page).
2. Drag in everything from this project folder: `index.html`, `package.json`,
   the `api` folder (with `kv.js` inside it), and the `README.md` /
   `GITHUB-SETUP.md` files if you want them there too.
3. Scroll down, add a commit message like "Initial upload," click
   **Commit changes**.

You should now see `index.html`, `package.json`, and an `api/` folder
containing `kv.js` sitting in the repo.

## 4. Import that repo into Vercel as a new project

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** → **Project**.
3. Under "Import Git Repository," authorize Vercel to access GitHub if
   prompted, then find and select `chord-practice-notebook`.
4. Leave the build settings as Vercel's defaults (it auto-detects this as
   a plain static site + serverless functions — no framework preset
   needed).
5. Click **Deploy**.

This creates a **new** Vercel project, separate from the one you made by
drag-and-drop earlier.

## 5. Attach a Redis database to this new project

Because this is a new project, it doesn't automatically have the database
from before. A quick note on naming: Vercel discontinued its own "KV"
product — the current equivalent is an Upstash Redis database through the
Vercel Marketplace. You'll see "Upstash" listed under Storage, not "KV."

You have two options:

**Option A — reuse your existing data.** In the new project, go to
**Storage** → **Browse Storage**, and look for a "connect existing" option
pointing at the Upstash database you already created for your original
project. This links the same underlying storage to this project too, so
all your existing chords, practice log, and leaderboard entries are still
there.

**Option B — start fresh.** Go to **Storage** → **Browse Storage** →
**Upstash** (under Marketplace Database Providers) and create a new Redis
database. This is simpler, but you'll start with an empty log (your old
data will still exist under the original project, just not connected to
this one).

After attaching, trigger one more redeploy (Vercel usually prompts you to)
so the environment variables take effect.

## 6. Clean up (optional)

Once you've confirmed the new GitHub-connected project works and has your
data, you can delete the old drag-and-drop project from Vercel to avoid
having two live copies of the site — or just leave it and stop using it.

## 7. From now on: making updates

1. Edit a file on GitHub's website (open the file, click the pencil/edit
   icon) — or edit locally and re-upload it the same way as step 3.
2. Commit the change.
3. Vercel automatically picks it up and redeploys within a minute or two —
   no manual upload to Vercel needed anymore.

Your data lives in that Redis database, separate from these files, so routine code
updates never touch it.

## If something goes wrong

- **Deploy fails:** check Vercel's deployment log (Project → Deployments →
  click the failed one) — it'll usually point to a missing file or a typo.
- **Site loads but storage doesn't work:** double check a Redis/Upstash
  database is attached under Project → Storage, and that you redeployed
  after attaching it.
