# SkinSabi

A mobile-first skincare education web app for Nigeria, built with Next.js App Router, TypeScript, and Supabase. It emphasizes product testing, ingredient transparency, and gentle routines. It is not medical advice.

## Local development

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and anon key (the service role is server-only and must never be exposed as a `NEXT_PUBLIC_` variable).
4. Run `npm run dev` and open http://localhost:3000.
5. Run `npm run build` before deploying.

## Deploy in five steps

1. Clone the public `skinsabi` repository.
2. Create a Supabase project.
3. Run `supabase/migrations/001_init.sql`, then `supabase/migrations/002_app_flows.sql` in Supabase SQL Editor, in that order.
4. In Vercel Project Settings → Environment Variables, add the variables below for Production, Preview, and Development as appropriate.
5. Import the GitHub repository in Vercel and deploy.

### Vercel Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` = Project URL from Supabase → Project Settings → API.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = publishable/anon key from Supabase → Project Settings → API.
- `SUPABASE_SERVICE_ROLE_KEY` = service role key from Supabase → Project Settings → API. Keep this secret; only use it in trusted server-side code. The current UI does not require it.

## Data and safety notes

The seed catalog has 55 named products. Ingredients are blank and products are marked unverified unless a trustworthy INCI source is added by an administrator. Do not treat brand names as ingredient evidence. The directory starts empty; no clinicians are invented. Configure Supabase Auth before collecting personal data. The SQL enables row-level security for user-owned records and creates a private photo bucket. Use signed URLs for photos and enforce the 1 MB upload limit in the application before turning photo uploads on.

Email sign-up and login use Supabase Auth when configured. Profiles are created by the database trigger. Routine selections save to `user_routines`; daily and weekly check-ins and optional compressed photos save privately; verified-test reviews can be submitted after 14 recorded daily check-ins and appear publicly only after moderation. Product price reports, Helpful review votes, live verified dermatologist listings, and admin moderation UI are not implemented yet. Do not expose the service role key in browser code.



