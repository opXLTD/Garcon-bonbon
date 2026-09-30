# Garçon Bonbon

Next.js 15 + Tailwind 4 + Framer Motion + Supabase + Google Gemini (free tier). Everything here runs on free plans.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values.
   - Gemini key: https://aistudio.google.com (Get API key)
   - Supabase: create a free project, copy URL, anon key, service-role key.
3. In Supabase SQL editor, run `supabase/schema.sql`.
4. `npm run dev` then open http://localhost:3000

## Deploy (free)
```
git init && git add . && git commit -m "Garçon Bonbon v1"
gh repo create garcon-bonbon --public --source=. --push
```
Vercel: Add New > Project > import repo > add the env vars from `.env.example` > Deploy.
Then set `NEXT_PUBLIC_SITE_URL` to your real URL and redeploy.

## SEO checklist
- Submit `/sitemap.xml` in Google Search Console (URL-prefix property works on vercel.app).
- Verify the site in Bing Webmaster Tools (IndexNow pings show up there).
- Fill in `sameAs` links in `app/page.tsx`.
- IndexNow key is served at `/indexnow-key` automatically from the `INDEXNOW_KEY` env var.

## Notes
- Gemini free-tier limits change; check your AI Studio dashboard. Switch `MODEL` in `app/api/generate/route.ts` to a Flash-Lite model if needed.
- Free-tier prompts may be used by Google; keep prompts non-private.
- Keep "The President of Italy" fictionalized and get the real person's OK.
