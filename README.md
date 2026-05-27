# LEGENDS — Deploy Guide

## 1. Supabase Setup (5 min)

1. Go to supabase.com → create account → new project called "legends"
2. Go to SQL Editor → paste content of `schema.sql` → Run
3. Go to Settings → API → copy:
   - Project URL  (looks like: https://xxxxx.supabase.co)
   - anon public key  (long JWT string)

## 2. Local Setup (2 min)

```bash
cd legends-site
npm install
cp .env.local.example .env.local
# Edit .env.local with your Supabase URL and key
npm run dev
# Open http://localhost:3000
```

## 3. Deploy to Vercel (5 min)

### Option A — Via GitHub (recommended)
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy → Done

### Option B — Via Vercel CLI
```bash
npm install -g vercel
cd legends-site
vercel
# Follow prompts, add env variables when asked
```

## 4. NFC Setup

Each NFC tag should point to:
```
https://your-vercel-url.vercel.app/s/LEGENDID
```

Where LEGENDID is the 6-character ID of the Legend (e.g. WNG7K2).

You can write this URL to the NFC tag using:
- iOS: NFC Tools app (free)
- Android: NFC Tools app (free)

## URL Structure

```
/                    → Homepage (marketing + rules)
/summon              → Create a new Legend
/s/WNG7K2            → Spirit Dashboard for Legend WNG7K2
/s/WNG7K2/awaken     → Chronicle an Awakening for WNG7K2
/explore             → List of all Legends
```

## Notes

- The site is fully server-rendered (Next.js App Router)
- Supabase free tier supports 50,000 rows and 500MB — more than enough for Phase 0
- The /s/[id] page is cached for 60 seconds (configurable)
- No authentication required in Phase 0 — anyone can chronicle an awakening
