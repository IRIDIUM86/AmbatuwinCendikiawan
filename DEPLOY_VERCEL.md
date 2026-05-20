# Deploy to Vercel

## Important first

This project has two Flask backends. They run as serverless Python functions
on Vercel. **Bedrock proposal generation can take 5-15 seconds**, which exceeds
the 10s limit on Vercel's Hobby plan. Use **Pro** (60s) or **Enterprise** (300s),
or the AI proposal endpoint will time out in production.

## One-time setup

### 1. Add environment variables in the Vercel dashboard

Project Settings → Environment Variables. Add these for **Production**:

| Key | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | from your `.env` |
| `AWS_SECRET_ACCESS_KEY` | from your `.env` |
| `AWS_REGION` | `ap-southeast-5` |
| `supabaseUrl` | from your `.env` |
| `supabaseKey` | from your `.env` |
| `supabaseSecret` | from your `.env` |
| `supabaseAnonPublic` | from your `.env` |
| `REACT_APP_SUPABASE_URL` | from your `.env` |
| `REACT_APP_SUPABASE_ANON_KEY` | from your `.env` |
| `TICKET_MASTER_CONSUMER_KEY` | from your `.env` (if used) |

The frontend `REACT_APP_API_BASE_URL` and `REACT_APP_CRUD_API_URL` are already
hardcoded in `.env.production` to point at the serverless functions.

### 2. Confirm `vercel.json` is set up

Already in repo. It tells Vercel:
- Build the React app with `npm run build`.
- Serve the result from `build/`.
- Mount `api_server.py` at `/api/v1/*` and `crud_api.py` at `/api/v2/*` as
  Python serverless functions with a 60s timeout.

## Deploy

### Option A: GitHub + Vercel dashboard (recommended)

```bash
git add .
git commit -m "Add Vercel deployment config"
git push origin main
```

Then in the Vercel dashboard, click **Add New → Project**, import the repo, and
deploy. All future pushes to `main` auto-deploy.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Build command (single line)

If you want to test the production build locally before pushing:

```bash
npm install && npm run build
```

That's the same command Vercel runs.

## Verify after deploy

After it deploys, hit these URLs (replace `your-app` with your project name):

- `https://your-app.vercel.app/` → home page
- `https://your-app.vercel.app/api/v1/api/health` → matching backend health
- `https://your-app.vercel.app/api/v2/api/health` → CRUD backend health

If both health endpoints return `{"status": "healthy"}` or
`{"success": true, ...}`, the wiring is correct.

## Known limitations

- **AWS Bedrock latency**: AI proposal generation takes 5-15s. Hobby plan
  caps functions at 10s, so the proposal feature will fail there. Upgrade or
  switch to a faster model.
- **No persistent connections**: Every API call cold-starts unless the function
  is warm. Expect a 1-2s delay on the first request after idle.
- **Test files excluded**: `.vercelignore` skips `test_*.py`, `check_*.py`,
  `chatbot.html`, the `venv/`, and the various `*_SUMMARY.md` docs. Edit it
  if you want any of those shipped.
- **Service role key on the client**: `crud_api.py` uses `supabaseSecret` for
  admin operations (delete user). Keep that key in Vercel env vars only,
  never in `REACT_APP_*`.
