-- ============================================================
-- Buda Enterprise — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- Services (3 seed rows)
insert into services (slug, title, description, features, hero_image_url) values
(
  'transport',
  'Fast, Reliable Goods Transport in Kisumu',
  'Whether you are moving house, delivering stock, or transporting equipment across Kisumu, our pickup truck service gets your goods there safely and on time.',
  '["Same-day delivery available","Careful handling of fragile goods","Competitive rates by distance","Available 7 days a week","Serves all Kisumu estates and surrounding areas"]',
  null
),
(
  'plumbing',
  'Expert Plumbing Services — Homes, Schools & Businesses',
  'From leaking pipes to full bathroom installations, we provide professional plumbing solutions with clean workmanship and lasting results.',
  '["Emergency leak repairs","New pipe installation","Water tank plumbing","Bathroom & kitchen fitting","School and commercial projects","All work guaranteed"]',
  null
),
(
  'painting',
  'Professional Painting for Interior & Exterior Spaces',
  'Transform your space with quality paintwork. We serve residential homes, offices, and institutions across Kisumu with neat, durable finishes.',
  '["Interior and exterior painting","Wall preparation and priming","Colour consultation","Schools and large buildings","Weather-resistant exterior finishes","Clean site management"]',
  null
)
on conflict (slug) do nothing;

-- Site settings defaults
insert into site_settings (key, value) values
  ('phone',          '+254 713 925 354'),
  ('whatsapp',       '254713925354'),
  ('email',          'info@budaenterprise.co.ke'),
  ('address',        'Kisumu, Kenya'),
  ('business_hours', 'Mon–Sat 7 am–6 pm | Sun by appointment')
on conflict (key) do nothing;

-- Sample schools (social proof)
insert into schools (name, logo_url, work_description, testimonial, year, is_visible) values
(
  'Kisumu Boys High School',
  null,
  'Completed full repaint of four classroom blocks and the administration wing. Work finished ahead of schedule.',
  'The team was professional, punctual and the finish quality exceeded our expectations.',
  2024,
  true
),
(
  'Aga Khan Primary School',
  null,
  'Installed new plumbing for the science laboratories and repaired all leaking roof gutters.',
  'Excellent workmanship — we will definitely use Buda Enterprise for future projects.',
  2023,
  true
),
(
  'Kisumu Girls Secondary School',
  null,
  'Transported all furniture and equipment during the school''s block renovation project.',
  null,
  2025,
  true
)
on conflict do nothing;
