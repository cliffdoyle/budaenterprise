import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import FadeIn from '@/components/public/FadeIn';
import { sql } from '@/lib/db';
import type { Service, PortfolioImage } from '@/lib/types';

export const revalidate = 60;

const VALID_SLUGS = ['transport', 'plumbing', 'painting'] as const;
type Slug = (typeof VALID_SLUGS)[number];

const HOW_IT_WORKS: Record<Slug, { step: string; title: string; desc: string }[]> = {
  transport: [
    { step: '01', title: 'Book Your Pickup', desc: 'Call or WhatsApp with your pickup location and drop-off address.' },
    { step: '02', title: 'We Confirm & Arrive', desc: 'We confirm the booking and arrive on time with the right vehicle.' },
    { step: '03', title: 'Safe Delivery', desc: 'Goods delivered safely. Payment on completion.' },
  ],
  plumbing: [
    { step: '01', title: 'Describe the Problem', desc: 'Tell us what needs fixing — we diagnose over a call if needed.' },
    { step: '02', title: 'Site Visit & Quote', desc: 'We visit, assess the work and give a clear written quote.' },
    { step: '03', title: 'Work & Guarantee', desc: 'Plumbing completed to standard. All work is guaranteed.' },
  ],
  painting: [
    { step: '01', title: 'Request a Quote', desc: 'Share your space details and we provide a competitive quote.' },
    { step: '02', title: 'Preparation', desc: 'We prepare surfaces, lay protective sheets and prime the walls.' },
    { step: '03', title: 'Quality Finish', desc: 'Painting completed neatly. Site left clean on completion.' },
  ],
};

// Unsplash hero image hints per service
const HERO_IMAGES: Record<Slug, string> = {
  // Search: "pickup truck cargo delivery"
  transport: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80',
  // Search: "plumber pipes tools"
  plumbing:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  // Search: "painting house interior roller"
  painting:  'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&q=80',
};

async function getService(slug: string): Promise<Service | null> {
  try {
    const rows = (await sql`SELECT * FROM services WHERE slug = ${slug}`) as Service[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

async function getServiceImages(slug: string): Promise<PortfolioImage[]> {
  try {
    return (await sql`
      SELECT * FROM portfolio_images
      WHERE service_slug = ${slug} AND is_active = true
      ORDER BY sort_order
      LIMIT 6
    `) as PortfolioImage[];
  } catch {
    return [];
  }
}

// Seed fallback titles/features
const SEED: Record<Slug, Pick<Service, 'title' | 'description' | 'features'>> = {
  transport: {
    title: 'Fast, Reliable Goods Transport in Kisumu',
    description:
      'Whether you are moving house, delivering stock, or transporting equipment across Kisumu, our pickup truck service gets your goods there safely and on time.',
    features: [
      'Same-day delivery available',
      'Careful handling of fragile goods',
      'Competitive rates by distance',
      'Available 7 days a week',
      'Serves all Kisumu estates and surrounding areas',
    ],
  },
  plumbing: {
    title: 'Expert Plumbing Services — Homes, Schools & Businesses',
    description:
      'From leaking pipes to full bathroom installations, we provide professional plumbing solutions with clean workmanship and lasting results.',
    features: [
      'Emergency leak repairs',
      'New pipe installation',
      'Water tank plumbing',
      'Bathroom & kitchen fitting',
      'School and commercial projects',
      'All work guaranteed',
    ],
  },
  painting: {
    title: 'Professional Painting for Interior & Exterior Spaces',
    description:
      'Transform your space with quality paintwork. We serve residential homes, offices, and institutions across Kisumu with neat, durable finishes.',
    features: [
      'Interior and exterior painting',
      'Wall preparation and priming',
      'Colour consultation',
      'Schools and large buildings',
      'Weather-resistant exterior finishes',
      'Clean site management',
    ],
  },
};

export async function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ service: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  if (!VALID_SLUGS.includes(service as Slug)) return {};
  const slug = service as Slug;
  const seed = SEED[slug];
  return {
    title: seed.title,
    description: seed.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  if (!VALID_SLUGS.includes(service as Slug)) notFound();

  const slug = service as Slug;
  const [dbService, images] = await Promise.all([getService(slug), getServiceImages(slug)]);

  const data = dbService ?? { ...SEED[slug], hero_image_url: null };
  const heroSrc = data.hero_image_url ?? HERO_IMAGES[slug];
  const features = Array.isArray(data.features) ? data.features : [];
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '254713925354';
  const greeting = encodeURIComponent(`Hello, I need a quote for ${data.title}`);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-[60vh] flex items-center bg-navy overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroSrc}
            alt={data.title}
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-white">
          <p className="text-cta text-xs uppercase tracking-widest font-semibold mb-2 capitalize">
            {slug}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">{data.title}</h1>
          <p className="mt-3 text-white/75 max-w-xl text-lg">{data.description}</p>
          <a
            href={`https://wa.me/${whatsapp}?text=${greeting}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
          >
            WhatsApp Enquiry
          </a>
        </div>
      </section>

      {/* ── WHAT WE OFFER ────────────────────────────────── */}
      <section className="py-16 bg-warm-white">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-2xl font-bold text-navy mb-6">What We Offer</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-3">
            {features.map((feat, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                  <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{feat}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-2xl font-bold text-navy mb-10 text-center">How It Works</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS[slug].map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-navy text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-navy mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────── */}
      {images.length > 0 && (
        <section className="py-16 bg-warm-white">
          <div className="max-w-4xl mx-auto px-4">
            <FadeIn>
              <h2 className="text-2xl font-bold text-navy mb-6">Our Work</h2>
            </FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <FadeIn key={img.id} delay={i * 0.05}>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={img.url}
                      alt={img.caption ?? `${slug} project`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/portfolio"
                className="inline-flex items-center text-sm font-semibold text-accent hover:text-navy transition-colors"
              >
                View full portfolio →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-14 bg-cta">
        <FadeIn>
          <div className="max-w-xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-extrabold text-navy">Ready to get started?</h2>
            <p className="mt-2 text-navy/70">Send us a WhatsApp message and we will respond quickly.</p>
            <a
              href={`https://wa.me/${whatsapp}?text=${greeting}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-7 py-3 bg-navy text-white font-bold rounded-lg hover:bg-navy/90 transition-colors"
            >
              WhatsApp Us Now
            </a>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
