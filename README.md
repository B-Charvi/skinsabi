# SkinSabi

A mobile-first skincare education web app for Nigeria, built with Next.js App Router, TypeScript, and Supabase. It emphasizes product testing, ingredient transparency, and gentle routines. It is not medical advice.

## Local development

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and anon key (the service role is server-only and must never be exposed as a `NEXT_PUBLIC_` variable).
4. Run `npm run dev` and open http://localhost:3000. The first visit to each page compiles it, so it feels slower than the real site. For the true speed, run `npm run build` then `npm start`.
5. Run `npm run build` before deploying.

## Deploy in five steps

1. Clone the public `skinsabi` repository.
2. Create a Supabase project.
3. Run every file in `supabase/migrations/` in Supabase SQL Editor, in number order (`001` to `008`).
4. In Vercel Project Settings → Environment Variables, add the variables below for Production, Preview, and Development as appropriate.
5. Import the GitHub repository in Vercel and deploy.

### Vercel Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` = Project URL from Supabase → Project Settings → API.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = publishable/anon key from Supabase → Project Settings → API.
- `SUPABASE_SERVICE_ROLE_KEY` = service role key from Supabase → Project Settings → API. Keep this secret; only use it in trusted server-side code. The current UI does not require it.

## Admin page

`/admin` lets the owner approve or remove reviews, verify or delete products people added, import products from a spreadsheet, and see counts of sign-ups by skin type, concern, budget and state. No names or emails are shown.

Admin access is decided in the database (`006_admin_access.sql`), not by the page:

- An account is an admin only if its user id is in the `admin_users` table. An email address alone grants nothing.
- The session must also come from Google sign-in. Email and password logins are refused, even on the same account.
- To add the owner: sign in once with Google, then run `insert into public.admin_users (user_id) select id from auth.users where email = 'owner@example.com';` in the Supabase SQL Editor.

### Importing products from a spreadsheet

The Import section on `/admin` adds many products at once from a CSV file (`007_admin_import.sql`, `008_overview_counts_imports.sql`).

1. Press **Download template** and fill in one product per row. Columns: `brand`, `product_name`, `category`, `ingredients_list`, `ingredient_source_url`, `special_note`, `treatment_level`. The first four are required.
2. Save as CSV (Excel: *CSV UTF-8*; Google Sheets: *Download as CSV*). The file is limited to 1 MB and 500 products.
3. Choose the file. It is checked in the browser first and nothing is sent until **Import** is pressed. Rows with problems (empty fields, unknown category, bad link, duplicates in the file or the catalog) are listed and skipped. Things worth a second look (no source link, very short ingredient list, a treatment with level None) are listed as notes and do not block the row.
4. Imported products are saved with `source = 'Admin Import'` and `verified = false`. Row Level Security hides them from everyone except the owner until verified, and the Products page also hides them from the owner. Verify each one in **Products to review**, where the ingredients, source link and treatment level can still be edited.
5. Each import is written to `import_logs` and shown under **Import logs**.

Only the admin can insert products. People still add their own suggestions from Check a product, as before.

## Data and safety notes

The seed catalog has 55 named products. Ingredients are blank and products are marked unverified unless a trustworthy INCI source is added by an administrator. Do not treat brand names as ingredient evidence. The directory starts empty; no clinicians are invented. Configure Supabase Auth before collecting personal data. The SQL enables row-level security for user-owned records and creates a private photo bucket. Use signed URLs for photos and enforce the 1 MB upload limit in the application before turning photo uploads on.

Email sign-up and login use Supabase Auth when configured. Profiles are created by the database trigger. Routine selections save to `user_routines`; daily and weekly check-ins and optional compressed photos save privately; verified-test reviews can be submitted after 14 recorded daily check-ins and appear publicly only after moderation. Product price reports, Helpful review votes, and live verified dermatologist listings are not implemented yet. Do not expose the service role key in browser code.



