import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, Wrench, Paintbrush, Clock, CheckCircle, School, Star, Hammer, Shield, Award, Users } from 'lucide-react';
import FadeIn from '@/components/public/FadeIn';
import { sql } from '@/lib/db';
import type { PortfolioImage, School as SchoolType } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Vimilip Enterprise — premium painting, welding, plumbing and transport services. Trusted by 30+ schools across Kenya including Hospital Hill, Olympic, Lakewood Girls and more.',
};

export const revalidate = 60;

const SERVICES = [
  {
    slug: 'painting',
    label: 'Painting',
    icon: Paintbrush,
    desc: 'Premium interior and exterior painting for schools, commercial buildings and homes. Certified painters. Flawless, weather-resistant finishes guaranteed.',
    color: 'bg-orange-50 text-orange-600',
    badge: 'Our Flagship',
  },
  {
    slug: 'welding',
    label: 'Welding & Fabrication',
    icon: Hammer,
    desc: 'Custom steel fabrication — student dormitory beds, school locktables, security gates, grilles and structural metalwork for institutions and homes.',
    color: 'bg-red-50 text-red-600',
    badge: null,
  },
  {
    slug: 'plumbing',
    label: 'Plumbing',
    icon: Wrench,
    desc: 'Expert pipe installation, bathroom fitting and emergency repairs for schools, hospitals and commercial buildings across Kenya.',
    color: 'bg-cyan-50 text-cyan-600',
    badge: null,
  },
  {
    slug: 'transport',
    label: 'Transport',
    icon: Truck,
    desc: 'Safe, on-time transport of school furniture, construction materials and goods across Nairobi, Nakuru and surrounding regions.',
    color: 'bg-blue-50 text-blue-600',
    badge: null,
  },
];

const WHY_CHOOSE_US = [
  {
    icon: Shield,
    title: 'Verified Professionals',
    desc: 'Every team member is trained and supervised by a senior craftsman. We never outsource your job to unvetted day-labourers.',
  },
  {
    icon: Award,
    title: '10+ Years of Excellence',
    desc: "Over a decade delivering quality painting, fabrication and construction to Kenya's most respected institutions.",
  },
  {
    icon: Users,
    title: 'Dedicated Project Teams',
    desc: 'A dedicated team and site supervisor is assigned to every project — one point of contact from start to finish.',
  },
  {
    icon: CheckCircle,
    title: 'Work Guaranteed',
    desc: "All painting and fabrication work carries a workmanship guarantee. If it's not right, we fix it at no extra cost.",
  },
];

const STATS = [
  { label: 'Years in Business', value: '10+', icon: Star },
  { label: 'Projects Completed', value: '500+', icon: CheckCircle },
  { label: 'Schools Served', value: '30+', icon: School },
  { label: 'Availability', value: '24 / 7', icon: Clock },
];

async function getRecentImages(): Promise<PortfolioImage[]> {
  try {
    return (await sql`
      SELECT * FROM portfolio_images
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 6
    `) as PortfolioImage[];
  } catch {
    return [];
  }
}

async function getSchools(): Promise<SchoolType[]> {
  try {
    return (await sql`
      SELECT id, name, logo_url FROM schools
      WHERE is_visible = true
      LIMIT 10
    `) as SchoolType[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [recentImages, schools] = await Promise.all([getRecentImages(), getSchools()]);
  const phone = process.env.NEXT_PUBLIC_PHONE ?? '+254 713 925 354';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '254713925354';

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1400&q=80"
            alt="Professional painting services by Vimilip Enterprise"
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-white">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-cta/20 border border-cta/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-cta animate-pulse" />
              <span className="text-cta text-sm font-semibold tracking-wide">Kenya's Trusted Craftsmen</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Painting &amp; Construction <span className="text-cta">Excellence</span>
            </h1>
            <p className="text-xl text-white/80 mt-4 max-w-xl font-light leading-relaxed">
              From school repaints to custom metalwork — Vimilip Enterprise delivers verified, professional craftsmanship across Kenya.
            </p>
            <ul className="mt-5 space-y-2">
              {[
                '30+ schools served nationwide',
                'Certified painters, welders & plumbers',
                'Free site assessment & quote',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-white/75 text-sm">
                  <CheckCircle size={16} className="text-cta shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/painting"
                className="px-7 py-3 bg-cta text-navy font-bold rounded-lg hover:bg-cta/90 transition-colors text-base"
              >
                Our Painting Work
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-navy transition-colors text-base"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PAINTING SHOWCASE ───────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <p className="text-cta font-semibold text-sm uppercase tracking-widest mb-3">Our Flagship Service</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-navy leading-tight">
                  Professional Painting<br />That Speaks for Itself
                </h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  We have repainted classrooms, dormitories, administration blocks and market structures for some of Kenya&apos;s most recognisable institutions — including Hospital Hill High School, Olympic High School, Lakewood Girls Nakuru, Upperhill School and Stage Market Nairobi.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Every project starts with thorough surface preparation, quality primer and only premium paint. Our painters are full-time employees — supervised on every job to ensure consistent, lasting results you can verify.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Interior Painting', sub: 'Classrooms, halls & offices' },
                    { label: 'Exterior Painting', sub: 'Weather-resistant finishes' },
                    { label: 'Surface Preparation', sub: 'Stripping, filling & priming' },
                    { label: 'Large Institutions', sub: 'Schools, hospitals & markets' },
                  ].map((item) => (
                    <div key={item.label} className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                      <p className="font-semibold text-navy text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/painting"
                  className="inline-flex items-center mt-6 px-6 py-2.5 bg-navy text-white font-bold rounded-lg hover:bg-navy/90 transition-colors"
                >
                  View Painting Services →
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="relative h-80 lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80"
                  alt="Professional painters at work on a school building"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/90 to-transparent p-5">
                  <p className="text-white font-bold">Hospital Hill High School Repaint</p>
                  <p className="text-white/70 text-sm">Nairobi · Completed 2024</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ────────────────────────────────────── */}
      <section id="services" className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy">All Our Services</h2>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">Four specialisations. One trusted, professional team you can verify.</p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.slug} delay={i * 0.08}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                  {s.badge && (
                    <span className="absolute top-3 right-3 text-xs bg-cta text-navy font-bold px-2 py-0.5 rounded-full">
                      {s.badge}
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                    <s.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{s.label}</h3>
                  <p className="text-gray-600 text-sm flex-1 leading-relaxed">{s.desc}</p>
                  <Link
                    href={`/${s.slug}`}
                    className="mt-5 inline-flex items-center text-sm font-semibold text-accent hover:text-navy transition-colors"
                  >
                    Learn More →
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="py-16 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon size={32} className="text-cta mx-auto mb-2" />
                  <p className="text-3xl font-extrabold text-white">{s.value}</p>
                  <p className="text-sm text-white/70 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SCHOOL LOGOS STRIP ───────────────────────────────── */}
      {schools.length > 0 && (
        <section className="py-12 bg-white overflow-hidden border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Trusted by leading institutions across Kenya
            </p>
          </div>
          <div className="flex gap-8 animate-scroll-x w-max">
            {[...schools, ...schools].map((school, i) => (
              <div
                key={`${school.id}-${i}`}
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                <School size={16} className="text-accent" />
                {school.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy">Why Institutions Choose Us</h2>
              <p className="mt-2 text-gray-500 max-w-lg mx-auto">
                Our work is verifiable — visit any of the schools we have served and see the quality for yourself.
              </p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-4">
                    <item.icon size={22} className="text-cta" />
                  </div>
                  <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WELDING HIGHLIGHT ────────────────────────────────── */}
      <section className="py-16 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <div>
                <p className="text-cta font-semibold text-sm uppercase tracking-widest mb-3">Metalwork & Fabrication</p>
                <h2 className="text-3xl font-extrabold leading-tight">
                  Custom Welding for<br />Schools & Institutions
                </h2>
                <p className="mt-4 text-white/75 leading-relaxed">
                  We have fabricated hundreds of student dormitory beds and school locktables for institutions across Kenya. Our certified welders use quality steel and precision techniques to deliver furniture and fixtures built to last for decades.
                </p>
                <ul className="mt-5 space-y-2">
                  {[
                    'Student dormitory beds — standard & double decker',
                    'School locktables (lockable storage desks)',
                    'Security gates and window grilles',
                    'Custom steel furniture and structural metalwork',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-white/75 text-sm">
                      <CheckCircle size={15} className="text-cta shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/welding"
                  className="inline-flex items-center mt-6 px-6 py-2.5 bg-cta text-navy font-bold rounded-lg hover:bg-cta/90 transition-colors"
                >
                  Explore Welding Services →
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80"
                  alt="Professional welding and metal fabrication"
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── RECENT WORK ──────────────────────────────────────── */}
      {recentImages.length > 0 && (
        <section className="py-20 bg-warm-white">
          <div className="max-w-7xl mx-auto px-4">
            <FadeIn>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-navy">Recent Work</h2>
                  <p className="mt-1 text-gray-500">A glimpse of what we deliver.</p>
                </div>
                <Link href="/portfolio" className="text-sm font-semibold text-accent hover:text-navy transition-colors">
                  View all →
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recentImages.map((img, i) => (
                <FadeIn key={img.id} delay={i * 0.05}>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    <Image
                      src={img.url}
                      alt={img.caption ?? `${img.service_slug} project`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <span className="absolute bottom-2 left-2 bg-navy/80 text-white text-xs px-2 py-0.5 rounded-full capitalize">
                      {img.service_slug}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-16 bg-cta">
        <FadeIn>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
              Ready to transform your space?
            </h2>
            <p className="mt-2 text-navy/70">Call or WhatsApp us for a free site assessment and quote.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <a
                href={`tel:${phone}`}
                className="px-6 py-3 bg-navy text-white font-bold rounded-lg hover:bg-navy/90 transition-colors"
              >
                📞 {phone}
              </a>
              <a
                href={`https://wa.me/${whatsapp}?text=Hello%2C%20I%20need%20a%20quote`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}


  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-navy">
        {/* Background image — replace with real hero photo */}
        {/* Unsplash search: "Kisumu Kenya pickup truck road" */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80"
            alt="Transport and construction services in Kisumu"
            fill
            className="object-cover opacity-25"
            priority
            sizes="100vw"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 text-white">
          <p className="text-cta font-semibold text-sm uppercase tracking-widest mb-4">
            Kisumu, Kenya
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-2xl">
            Vimilip Enterprise
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 mt-3 max-w-xl font-light">
            Your Reliable Partner in Kisumu
          </p>
          <p className="mt-4 text-white/70 max-w-lg leading-relaxed">
            Transport, plumbing and painting services trusted by homes, schools and businesses across the region.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/#services"
              className="px-7 py-3 bg-cta text-navy font-bold rounded-lg hover:bg-cta/90 transition-colors text-base"
            >
              View Services
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-navy transition-colors text-base"
            >
              Contact Us Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ────────────────────────────────────── */}
      <section id="services" className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy">Our Services</h2>
              <p className="mt-2 text-gray-500">Three specialisations. One trusted team.</p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.slug} delay={i * 0.1}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                    <s.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{s.label}</h3>
                  <p className="text-gray-600 text-sm flex-1">{s.desc}</p>
                  <Link
                    href={`/${s.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-accent hover:text-navy transition-colors"
                  >
                    Learn More →
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="py-16 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold mb-10">Why Choose Us</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1}>
                <div className="text-center">
                  <s.icon size={32} className="text-cta mx-auto mb-2" />
                  <p className="text-3xl font-extrabold text-white">{s.value}</p>
                  <p className="text-sm text-white/70 mt-1">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHOOL LOGOS STRIP ───────────────────────────────── */}
      {schools.length > 0 && (
        <section className="py-12 bg-white overflow-hidden border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Trusted by Kisumu institutions
            </p>
          </div>
          <div className="flex gap-8 animate-scroll-x w-max">
            {[...schools, ...schools].map((school, i) => (
              <div
                key={`${school.id}-${i}`}
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                <School size={16} className="text-accent" />
                {school.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── RECENT WORK ──────────────────────────────────────── */}
      {recentImages.length > 0 && (
        <section className="py-20 bg-warm-white">
          <div className="max-w-7xl mx-auto px-4">
            <FadeIn>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-navy">Recent Work</h2>
                  <p className="mt-1 text-gray-500">A glimpse of what we deliver.</p>
                </div>
                <Link href="/portfolio" className="text-sm font-semibold text-accent hover:text-navy transition-colors">
                  View all →
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recentImages.map((img, i) => (
                <FadeIn key={img.id} delay={i * 0.05}>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    <Image
                      src={img.url}
                      alt={img.caption ?? `${img.service_slug} project`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <span className="absolute bottom-2 left-2 bg-navy/80 text-white text-xs px-2 py-0.5 rounded-full capitalize">
                      {img.service_slug}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-16 bg-cta">
        <FadeIn>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
              Need a quote? Call or WhatsApp now
            </h2>
            <p className="mt-2 text-navy/70">We respond within the hour.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <a
                href={`tel:${phone}`}
                className="px-6 py-3 bg-navy text-white font-bold rounded-lg hover:bg-navy/90 transition-colors"
              >
                📞 {phone}
              </a>
              <a
                href={`https://wa.me/${whatsapp}?text=Hello%2C%20I%20need%20a%20quote`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
