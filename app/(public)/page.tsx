import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, Wrench, Paintbrush, Clock, CheckCircle, School, Star } from 'lucide-react';
import FadeIn from '@/components/public/FadeIn';
import { sql } from '@/lib/db';
import type { PortfolioImage, School as SchoolType } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Buda Enterprise — professional transport, plumbing and painting services in Kisumu, Kenya. Trusted by homes, schools and businesses.',
};

export const revalidate = 60;

const SERVICES = [
  {
    slug: 'transport',
    label: 'Transport',
    icon: Truck,
    desc: 'Reliable pickup truck delivery across all Kisumu estates and surrounding areas.',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    slug: 'plumbing',
    label: 'Plumbing',
    icon: Wrench,
    desc: 'Emergency repairs to full bathroom installations — homes, schools and businesses.',
    color: 'bg-cyan-50 text-cyan-700',
  },
  {
    slug: 'painting',
    label: 'Painting',
    icon: Paintbrush,
    desc: 'Interior and exterior painting with durable, weather-resistant finishes.',
    color: 'bg-purple-50 text-purple-700',
  },
];

const STATS = [
  { label: 'Years in Business', value: '10+', icon: Star },
  { label: 'Jobs Completed', value: '500+', icon: CheckCircle },
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
  const phone = process.env.NEXT_PUBLIC_PHONE ?? '+254 712 345 678';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '254712345678';

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
            Buda Enterprise
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
