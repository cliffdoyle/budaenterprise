-- ============================================================
-- Buda Enterprise — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- Services (4 seed rows)
insert into services (slug, title, description, features, hero_image_url) values
(
  'painting',
  'Professional Painting — Schools, Commercial & Residential',
  'Vimilip Enterprise is Kenya''s go-to painting contractor for institutions and businesses. From thorough surface preparation to premium finishes, our certified painters deliver results that last — on time and within budget.',
  '["Full interior & exterior painting","Thorough surface stripping, filling & priming","Premium weather-resistant exterior paints","Colour consultation & design advice","Schools, hospitals, markets & offices","Large-scale institutional projects","Clean site management daily","All work guaranteed"]',
  null
),
(
  'welding',
  'Welding & Steel Fabrication — Custom Metalwork for Schools & Homes',
  'Our certified welders fabricate high-quality school furniture and custom metalwork including student dormitory beds, lockable desks (locktables), security gates, window grilles and structural steel. Built to last, priced fairly.',
  '["Student dormitory beds — standard & double decker","School locktables (lockable storage desks)","Security gates and window grilles","Custom steel doors and frames","Staircases and balustrades","Workshop and industrial shelving","Outdoor benches and school furniture","All metalwork primed and painted"]',
  null
),
(
  'plumbing',
  'Expert Plumbing — Institutions, Homes & Commercial Buildings',
  'From emergency leak repairs to full pipe installations and bathroom fitting, our experienced plumbers handle every job with clean workmanship. We have completed plumbing projects in schools, hospitals and large commercial sites across Kenya.',
  '["Emergency leak & burst pipe repairs","New pipe installation (CPVC, PVC & galvanised)","Water tank installation & plumbing","Complete bathroom & kitchen fitting","School and institutional sanitation projects","Drainage and sewerage works","Water pump installation","All work guaranteed"]',
  null
),
(
  'transport',
  'Reliable Transport — Materials, Equipment & Goods Nationwide',
  'Whether you are moving school furniture, transporting construction materials or delivering stock, our fleet handles it safely and on time. We serve Nairobi, Nakuru and surrounding counties.',
  '["Same-day and scheduled delivery","School furniture & equipment transport","Construction materials haulage","Careful handling of fragile items","Competitive distance-based rates","Available 7 days a week","Countrywide coverage"]',
  null
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  features = excluded.features;

-- Site settings defaults
insert into site_settings (key, value) values
  ('phone',          '+254 713 925 354'),
  ('whatsapp',       '254713925354'),
  ('email',          'info@vimilipenterprise.co.ke'),
  ('address',        'Nairobi, Kenya'),
  ('business_hours', 'Mon–Sat 7 am–6 pm | Sun by appointment')
on conflict (key) do nothing;

-- Schools & Institutions (verified client references)
insert into schools (name, logo_url, work_description, testimonial, year, is_visible) values
(
  'Hospital Hill High School',
  null,
  'Complete repaint of all six classroom blocks, the administration wing and the school''s main hall. Surface preparation included stripping of old paint, crack filling and two coats of primer before the final finish. Work completed during the school term break.',
  'The transformation was incredible. Vimilip Enterprise''s team was disciplined, worked without supervision and left the site spotless every evening. We are very impressed.',
  2024,
  true
),
(
  'Olympic High School',
  null,
  'Interior and exterior painting of four dormitory buildings and the dining hall. We also fabricated and installed 120 student dormitory beds and 80 lockable desks (locktables) for the newly constructed dormitory block.',
  'From the painting to the metalwork, everything was done to an exceptionally high standard. The beds and locktables are solid and well-finished. Highly recommended.',
  2024,
  true
),
(
  'Lakewood Girls — Nakuru',
  null,
  'Full exterior repaint of the school perimeter wall, four classroom blocks and the administration office. We also carried out plumbing repairs to the school''s main water supply line and installed new bathroom fixtures in the girls'' dormitories.',
  'Professional, punctual and thorough. The painting quality has drawn compliments from parents and the community. We will be calling them again for our next phase.',
  2023,
  true
),
(
  'Dagoreti Mixed Secondary',
  null,
  'Repainted the school''s main hall, staffroom and two classroom blocks. Additionally fabricated and delivered 60 double-decker dormitory beds and carried out transport of all existing furniture during the renovation.',
  null,
  2023,
  true
),
(
  'Upperhill School',
  null,
  'Large-scale interior and exterior painting project covering the main school building, sports pavilion and newly constructed science laboratory block. Surface preparation was extensive — old paint stripped and all cracks repaired before painting.',
  'The team handled a very large and complex project with remarkable organisation. Quality of finish is excellent throughout.',
  2025,
  true
),
(
  'Stage Market — Nairobi',
  null,
  'Full exterior painting of the market''s main trading block and perimeter walls. We also fabricated and installed custom steel display shelving, security grilles on all windows and a heavy-duty security gate at the main entrance.',
  null,
  2022,
  true
)
on conflict do nothing;

-- Admin user (password: yourpassword — change after first login)
insert into admin_users (email, password_hash, name) values
  ('oyoocliff471@gmail.com', '$2b$12$NYCw66mvkgLSqO8tgZiReOfWmDKQTBZtnXJrtr01IO.6phH2yqiAu', 'Admin')
on conflict (email) do nothing;
