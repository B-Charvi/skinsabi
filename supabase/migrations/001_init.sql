# SkinSabi Supabase initial schema
create extension if not exists pgcrypto;
create type public.product_category as enum ('Cleanser','Soap','Face Wash','Moisturizer','Sunscreen','Treatment','Toner','Scrub','Oil','Other');
create type public.flag_type as enum ('Red Flag','Yellow Flag','Green Flag','Neutral');
create type public.treatment_level as enum ('None','Level 1','Level 2','Prescription');
create type public.patch_status as enum ('Not Started','In Progress','Passed','Caution','Stopped');
create type public.review_status as enum ('Pending','Approved','Flagged','Deleted');

create table public.products (
 id uuid primary key default gen_random_uuid(), brand text not null, product_name text not null,
 category public.product_category not null default 'Other', price_range_naira text,
 ingredients_list text not null default '', source text not null default 'Seed', verified boolean not null default false,
 date_added timestamptz not null default now(), average_user_rating text check (average_user_rating in ('Good','Okay','Bad')),
 treatment_level public.treatment_level not null default 'None', special_note text,
 created_at timestamptz not null default now(), unique(brand, product_name)
);
create table public.ingredients (
 id uuid primary key default gen_random_uuid(), ingredient_name text not null unique,
 type public.flag_type not null default 'Neutral', simple_explanation text not null default '',
 clogging_risk int check (clogging_risk between 0 and 5), safe_for_sensitive boolean,
 treatment_level public.treatment_level not null default 'None', synonyms text[] not null default '{}'
);
create table public.user_products (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 product_id uuid references public.products(id) on delete set null, custom_name text, custom_ingredients text not null default '',
 patch_test_status public.patch_status not null default 'Not Started', patch_started_at timestamptz,
 patch_day int not null default 0 check (patch_day between 0 and 14), sandwich_mode boolean not null default false,
 itching_reported boolean not null default false, consecutive_itch_days int not null default 0,
 treatment_level public.treatment_level not null default 'None', state text, city text,
 created_at timestamptz not null default now(), unique(user_id, product_id)
);
create table public.check_ins (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 user_product_id uuid not null references public.user_products(id) on delete cascade,
 check_in_type text not null check (check_in_type in ('daily','weekly')),
 skin_feel text, new_pimples boolean, irritation boolean, irritation_duration text, severe_reaction boolean not null default false,
 dark_spots_result text check (dark_spots_result in ('Lighter','Same','Darker','Not Applicable')),
 overall_skin text, sandwich_tried boolean, sandwich_helped boolean, triggers text[], photo_path text, check_in_date date not null default current_date,
 created_at timestamptz not null default now()
);
create table public.reviews (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade, user_product_id uuid not null references public.user_products(id) on delete cascade,
 skin_type text not null, caused_pimples boolean not null, caused_burning boolean not null,
 dark_spots_result text, would_buy_again text not null, comment varchar(200), helpful_count int not null default 0,
 created_at timestamptz not null default now(), is_verified_test boolean not null default false,
 status public.review_status not null default 'Pending', used_sandwich_method boolean not null default false,
 sandwich_helped boolean, state text, city text, unique(user_id, product_id)
);
create table public.dermatologists (
 id uuid primary key default gen_random_uuid(), name text not null, clinic_name text, state text not null, city text not null,
 address text, phone text, whatsapp text, consultation_fee_naira int, services text[] not null default '{}',
 is_verified boolean not null default false, rating numeric(2,1), public_listing_url text, created_at timestamptz not null default now()
);
create table public.product_prices (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
 user_id uuid references auth.users(id) on delete set null, state text not null, city text not null,
 price_naira int not null check (price_naira > 0), date_reported timestamptz not null default now(), status text not null default 'Pending'
);
create table public.import_logs (
 id uuid primary key default gen_random_uuid(), source text not null, started_at timestamptz not null default now(),
 finished_at timestamptz, products_added int not null default 0, status text not null default 'Pending', details jsonb not null default '{}'
);
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade, full_name text, skin_type text, main_concern text,
 budget text, skin_tone text, albinism boolean not null default false, reactive_skin boolean not null default false,
 state text, city text, preferred_checkin_day text default 'Sunday', created_at timestamptz not null default now()
);
create table public.photo_deletions (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, photo_path text not null, created_at timestamptz not null default now());

alter table public.products enable row level security;
alter table public.ingredients enable row level security;
alter table public.user_products enable row level security;
alter table public.check_ins enable row level security;
alter table public.reviews enable row level security;
alter table public.dermatologists enable row level security;
alter table public.product_prices enable row level security;
alter table public.import_logs enable row level security;
alter table public.profiles enable row level security;
alter table public.photo_deletions enable row level security;
create policy "Public can read products" on public.products for select using (true);
create policy "Users can suggest products" on public.products for insert with check (source = 'User-Added' and verified = false);
create policy "Public can read ingredients" on public.ingredients for select using (true);
create policy "Users manage own products" on public.user_products for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own check-ins" on public.check_ins for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public read approved reviews" on public.reviews for select using (status = 'Approved' or auth.uid() = user_id);
create policy "Users write own reviews" on public.reviews for insert with check (auth.uid() = user_id and is_verified_test = false);
create policy "Users update own reviews" on public.reviews for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public read verified clinicians" on public.dermatologists for select using (is_verified = true);
create policy "Users submit price reports" on public.product_prices for insert with check (auth.uid() = user_id);
create policy "Public read accepted prices" on public.product_prices for select using (status = 'Approved');
create policy "Own profile read/write" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Own photo deletion records" on public.photo_deletions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('user-photos','user-photos',false,1048576,array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
create policy "Users read own photos" on storage.objects for select to authenticated using (bucket_id='user-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "Users upload own photos" on storage.objects for insert to authenticated with check (bucket_id='user-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "Users delete own photos" on storage.objects for delete to authenticated using (bucket_id='user-photos' and (storage.foldername(name))[1]=auth.uid()::text);

insert into public.ingredients (ingredient_name,type,simple_explanation,clogging_risk,safe_for_sensitive,treatment_level,synonyms) values
('Hydroquinone','Red Flag','Avoid without a clinician; do not use on face based on an online recommendation.',0,false,'Prescription', '{}'),
('Mercury','Red Flag','Dangerous heavy metal; do not use.',0,false,'None',array['mercurous chloride']),
('Clobetasol','Red Flag','Prescription steroid; not a cosmetic brightener.',0,false,'Prescription',array['betamethasone']),
('Alcohol Denat','Red Flag','Can be drying when among the first ingredients.',0,false,'None',array['isopropyl alcohol']),
('Fragrance','Red Flag','May irritate reactive skin, especially near the top of the label.',0,false,'None',array['parfum']),
('Coconut Oil','Red Flag','Can clog pores for some acne-prone users.',5,false,'None', '{}'),
('Cocoa Butter','Red Flag','Can be heavy for acne-prone facial skin.',5,false,'None', '{}'),
('Wheat Germ Oil','Red Flag','Can clog pores for some acne-prone users.',5,false,'None', '{}'),
('Mineral Oil','Yellow Flag','May feel heavy on some faces; assess your own skin.',2,true,'None',array['paraffinum liquidum']),
('Shea Butter','Yellow Flag','Often rich; may feel heavy on facial skin.',2,true,'None', '{}'),
('Kojic Acid','Yellow Flag','Level 2. Use at night 2–3 times weekly, patch test 14 days, and use sunscreen. Not for sensitive/reactive skin.',1,false,'Level 2',array['5-hydroxy-2-(hydroxymethyl)-4-pyrone']),
('Glycolic Acid','Yellow Flag','Can irritate; introduce slowly at night.',0,false,'Level 2', '{}'),
('Lactic Acid','Yellow Flag','Can irritate; introduce slowly.',0,false,'Level 2', '{}'),
('Retinol','Yellow Flag','May cause dryness; introduce slowly and avoid without clinician advice if reactive.',0,false,'Prescription',array['retinal']),
('Adapalene','Yellow Flag','Treatment; get clinician guidance, especially for sensitive skin.',0,false,'Prescription', '{}'),
('Azelaic Acid','Green Flag','Often used for acne and dark marks; mild tingling can happen.',0,true,'Level 1', '{}'),
('Niacinamide','Green Flag','Common supportive ingredient; concentrations vary.',0,true,'Level 1', '{}'),
('Glycerin','Green Flag','Humectant that helps attract water.',0,true,'None', '{}'),
('Hyaluronic Acid','Green Flag','Humectant; pair with moisturizer.',0,true,'None', '{}'),
('Panthenol','Green Flag','Skin-conditioning ingredient.',0,true,'None', '{}'),
('Aloe Vera','Green Flag','Can soothe some skin; allergy is still possible.',0,true,'None', '{}'),
('Zinc Oxide','Green Flag','Mineral UV filter used in sunscreens.',0,true,'None', '{}'),
('Titanium Dioxide','Green Flag','Mineral UV filter used in sunscreens.',0,true,'None', '{}'),
('Salicylic Acid','Green Flag','Can help acne; introduce slowly.',0,false,'Level 1', '{}'),
('Alpha Arbutin','Green Flag','Gentler brightening option; patch test.',0,true,'Level 2', '{}'),
('Tranexamic Acid','Green Flag','Used for uneven tone; patch test.',0,true,'Level 2', '{}');

-- The 55 requested product names are provided by the app starter catalog. Do not bulk-seed invented INCI lists.
insert into public.products (brand,product_name,category,ingredients_list,source,verified,treatment_level,special_note) values
('Simple','Refreshing Facial Wash','Face Wash','','Seed',false,'None',null),('Simple','Micellar Gel Wash','Face Wash','','Seed',false,'None',null),('CeraVe','Hydrating Cleanser','Cleanser','','Seed',false,'None',null),('CeraVe','Foaming Cleanser','Cleanser','','Seed',false,'None',null),('Cetaphil','Gentle Skin Cleanser','Cleanser','','Seed',false,'None',null),('La Roche-Posay','Toleriane Hydrating Cleanser','Cleanser','','Seed',false,'None',null),('Neutrogena','Hydro Boost Cleanser','Cleanser','','Seed',false,'None',null),('Nivea','Refreshing Wash Gel','Face Wash','','Seed',false,'None',null),('Clean & Clear','Foaming Face Wash','Face Wash','','Seed',false,'None',null),('Good Molecules','Rosewater Daily Cleansing Gel','Cleanser','','Seed',false,'None',null),
('Dudu Osun','African Black Soap','Soap','','Seed',false,'None',null),('Shea Moisture','African Black Soap','Soap','','Seed',false,'None',null),('Nivea','Natural Fairness Soap','Soap','','Seed',false,'None',null),('Dove','Beauty Bar','Soap','','Seed',false,'None',null),('Tetmosol','Medicated Soap','Soap','','Seed',false,'None',null),('Kojie San','Kojic Acid Soap','Soap','','Seed',false,'Level 2','Body only, 2–3x weekly max; not for daily face use.'),
('CeraVe','Moisturizing Lotion','Moisturizer','','Seed',false,'None',null),('CeraVe','Moisturizing Cream','Moisturizer','','Seed',false,'None',null),('Simple','Light Moisturizer','Moisturizer','','Seed',false,'None',null),('Simple','Rich Moisturizer','Moisturizer','','Seed',false,'None',null),('Neutrogena','Hydro Boost Water Gel','Moisturizer','','Seed',false,'None',null),('Nivea','Soft','Moisturizer','','Seed',false,'None',null),('Nivea','Creme (Blue Tin)','Moisturizer','','Seed',false,'None',null),('Eucerin','Original Healing Lotion','Moisturizer','','Seed',false,'None',null),('Aveeno','Daily Moisturizing Lotion','Moisturizer','','Seed',false,'None',null),('Good Molecules','Lightweight Daily Moisturizer','Moisturizer','','Seed',false,'None',null),
('Simple','Protecting Moisturizer SPF 30','Sunscreen','','Seed',false,'None',null),('CeraVe','Hydrating Sunscreen SPF 30','Sunscreen','','Seed',false,'None',null),('CeraVe','Ultra-Light Moisturizing Lotion SPF 30','Sunscreen','','Seed',false,'None',null),('La Roche-Posay','Anthelios SPF 50+','Sunscreen','','Seed',false,'None',null),('Neutrogena','Ultra Sheer SPF 50','Sunscreen','','Seed',false,'None',null),('Black Girl Sunscreen','SPF 30','Sunscreen','','Seed',false,'None',null),('Supergoop','Unseen Sunscreen SPF 40','Sunscreen','','Seed',false,'None',null),('Dr Rashel','Sunscreen SPF 60','Sunscreen','','Seed',false,'None',null),('Biocos','Sunscreen','Sunscreen','','Seed',false,'None',null),('Nivea','Sun Protect SPF 50','Sunscreen','','Seed',false,'None',null),
('The Ordinary','Azelaic Acid Suspension 10%','Treatment','','Seed',false,'Level 1',null),('The Ordinary','Niacinamide 10% + Zinc 1%','Treatment','','Seed',false,'Level 1',null),('Good Molecules','Niacinamide Serum','Treatment','','Seed',false,'Level 1',null),('Good Molecules','Discoloration Correcting Serum','Treatment','','Seed',false,'Level 2','Contains Kojic Acid + Niacinamide per supplied product prompt.'),('CeraVe','Resurfacing Retinol Serum','Treatment','','Seed',false,'Prescription',null),('The Ordinary','Salicylic Acid 2% Solution','Treatment','','Seed',false,'Level 1',null),('La Roche-Posay','Effaclar Duo+','Treatment','','Seed',false,'Level 1',null),('Paula''s Choice','2% BHA Liquid Exfoliant','Treatment','','Seed',false,'Level 1',null),('Differin','Gel (Adapalene 0.1%)','Treatment','','Seed',false,'Prescription','Needs doctor.'),('Prescription','Azelaic Acid Gel 15%','Treatment','','Seed',false,'Prescription','Needs doctor.'),('The Ordinary','Alpha Arbutin 2% + HA','Treatment','','Seed',false,'Level 2',null),('Naturium','Tranexamic Acid Serum 5%','Treatment','','Seed',false,'Level 2',null),('Anua','Niacinamide + Tranexamic Acid Serum','Treatment','','Seed',false,'Level 2',null),('Good Molecules','Kojic Acid + Niacinamide Brightening Serum','Treatment','','Seed',false,'Level 2','Use 2–3 times weekly at night; sunscreen required.'),
('Thayers','Witch Hazel Toner','Toner','','Seed',false,'None',null),('Good Molecules','Niacinamide Brightening Toner','Toner','','Seed',false,'Level 1',null),('The Ordinary','Glycolic Acid 7% Toning Solution','Toner','','Seed',false,'Level 2',null),('Unverified','Rose Water Toner','Toner','','Seed',false,'None',null),('Unverified','Aloe Vera Gel (100% Pure)','Other','','Seed',false,'None',null)
on conflict (brand,product_name) do nothing;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, skin_type, main_concern, budget)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'skin_type',
    new.raw_user_meta_data ->> 'main_concern',
    new.raw_user_meta_data ->> 'budget'
  ) on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();


