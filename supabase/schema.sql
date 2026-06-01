-- ============================================================
-- Buda Enterprise — Supabase Schema
-- Run this in the Supabase SQL editor
-- ============================================================

-- UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists services (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null check (slug in ('transport', 'plumbing', 'painting')),
  title       text not null,
  description text not null,
  features    jsonb not null default '[]',
  hero_image_url text,
  updated_at  timestamptz not null default now()
);

create table if not exists portfolio_images (
  id           uuid primary key default uuid_generate_v4(),
  url          text not null,
  caption      text,
  service_slug text not null check (service_slug in ('transport', 'plumbing', 'painting')),
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists schools (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  logo_url         text,
  work_description text not null,
  testimonial      text,
  year             integer,
  is_visible       boolean not null default true
);

create table if not exists enquiries (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  phone      text not null,
  service    text not null,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key   text primary key,
  value text not null
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table services         enable row level security;
alter table portfolio_images enable row level security;
alter table schools          enable row level security;
alter table enquiries        enable row level security;
alter table site_settings    enable row level security;

-- Public SELECT policies
create policy "public_read_services"
  on services for select using (true);

create policy "public_read_active_images"
  on portfolio_images for select using (is_active = true);

create policy "public_read_visible_schools"
  on schools for select using (is_visible = true);

create policy "public_read_settings"
  on site_settings for select using (true);

-- Enquiries: public can INSERT (contact form), no public reads
create policy "public_insert_enquiries"
  on enquiries for insert with check (true);

-- Admin CRUD goes through service_role key which bypasses RLS automatically.

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

-- Run these via the Supabase dashboard or Storage API:
-- 1. Create bucket named "portfolio"  (public: true)
-- 2. Create bucket named "schools"    (public: true)
