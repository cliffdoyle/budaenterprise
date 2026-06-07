import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { School as SchoolIcon, Quote, CheckCircle } from 'lucide-react';
import FadeIn from '@/components/public/FadeIn';
import { sql } from '@/lib/db';
import type { School } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Schools & Institutions',
  description:
    'Vimilip Enterprise is trusted by schools and institutions across Kenya for painting, welding, plumbing and transport services.',
};

export const revalidate = 60;

const FALLBACK_SCHOOLS: School[] = [
  {
    id: '1', name: 'Hospital Hill High School', logo_url: null, year: 2024, is_visible: true,
    work_description: 'Complete repaint of all six classroom blocks, the administration wing and the school\'s main hall. Surface preparation included stripping of old paint, crack filling and two coats of primer before the final finish. Work completed during the school term break.',
    testimonial: 'The transformation was incredible. Vimilip Enterprise\'s team was disciplined, worked without supervision and left the site spotless every evening. We are very impressed.',
  },
  {
    id: '2', name: 'Olympic High School', logo_url: null, year: 2024, is_visible: true,
    work_description: 'Interior and exterior painting of four dormitory buildings and the dining hall. We also fabricated and installed 120 student dormitory beds and 80 lockable desks (locktables) for the newly constructed dormitory block.',
    testimonial: 'From the painting to the metalwork, everything was done to an exceptionally high standard. The beds and locktables are solid and well-finished. Highly recommended.',
  },
  {
    id: '3', name: 'Lakewood Girls — Nakuru', logo_url: null, year: 2023, is_visible: true,
    work_description: 'Full exterior repaint of the school perimeter wall, four classroom blocks and the administration office. We also carried out plumbing repairs to the main water supply line and installed new bathroom fixtures in the girls\' dormitories.',
    testimonial: 'Professional, punctual and thorough. The painting quality has drawn compliments from parents and the community. We will be calling them again for our next phase.',
  },
  {
    id: '4', name: 'Dagoreti Mixed Secondary', logo_url: null, year: 2023, is_visible: true,
    work_description: 'Repainted the school\'s main hall, staffroom and two classroom blocks. Additionally fabricated and delivered 60 double-decker dormitory beds and carried out transport of all existing furniture during the renovation.',
    testimonial: null,
  },
  {
    id: '5', name: 'Upperhill School', logo_url: null, year: 2025, is_visible: true,
    work_description: 'Large-scale interior and exterior painting project covering the main school building, sports pavilion and newly constructed science laboratory block. Surface preparation was extensive — old paint stripped and all cracks repaired before painting.',
    testimonial: 'The team handled a very large and complex project with remarkable organisation. Quality of finish is excellent throughout.',
  },
  {
    id: '6', name: 'Stage Market — Nairobi', logo_url: null, year: 2022, is_visible: true,
    work_description: 'Full exterior painting of the market\'s main trading block and perimeter walls. We also fabricated and installed custom steel display shelving, security grilles on all windows and a heavy-duty security gate at the main entrance.',
    testimonial: null,
  },
];

const SERVICE_TAGS: Record<string, string[]> = {
  'Hospital Hill High School': ['Painting', 'Surface Prep'],
  'Olympic High School': ['Painting', 'Welding', 'Beds & Locktables'],
  'Lakewood Girls — Nakuru': ['Painting', 'Plumbing'],
  'Dagoreti Mixed Secondary': ['Painting', 'Welding', 'Transport'],
  'Upperhill School': ['Painting', 'Surface Prep'],
  'Stage Market — Nairobi': ['Painting', 'Welding', 'Security Gates'],
};

async function getSchools(): Promise<School[]> {
  try {
    const rows = (await sql`SELECT * FROM schools WHERE is_visible = true ORDER BY year DESC`) as School[];
    return rows.length > 0 ? rows : FALLBACK_SCHOOLS;
  } catch {
    return FALLBACK_SCHOOLS;
  }
}

export default async function SchoolsPage() {
  const schools = await getSchools();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '254713925354';

  return (
    <>
      {/* Header */}
      <section className="bg-navy text-white py-16 px-4 text-center">
        <FadeIn>
          <p className="text-cta text-xs uppercase tracking-widest font-semibold mb-2">Verified Track Record</p>
          <h1 className="text-4xl font-extrabold">Schools & Institutions We Have Served</h1>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto leading-relaxed">
            From Nairobi to Nakuru, Vimilip Enterprise has delivered painting, welding, plumbing and transport services to some of Kenya&apos;s most respected schools and institutions. Our work is verifiable — you can visit these sites and see the quality yourself.
          </p>
        </FadeIn>
      </section>

      {/* Stats bar */}
      <section className="bg-accent text-white py-6">
        <div className="max-w-3xl mx-auto px-4 grid grid-cols-3 text-center gap-4">
          <div>
            <p className="text-3xl font-extrabold">{schools.length || '30'}+</p>
            <p className="text-xs text-white/80 mt-0.5">Schools Served</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">500+</p>
            <p className="text-xs text-white/80 mt-0.5">Projects Completed</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">10+</p>
            <p className="text-xs text-white/80 mt-0.5">Years Active</p>
          </div>
        </div>
      </section>

      {/* School cards */}
      <section className="py-16 bg-warm-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {schools.map((school, i) => {
              const tags = SERVICE_TAGS[school.name] ?? [];
              return (
                <FadeIn key={school.id} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5">
                    {/* Card header */}
                    <div className="bg-gradient-to-r from-navy to-navy/80 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                          {school.logo_url ? (
                            <Image src={school.logo_url} alt={school.name} width={32} height={32} className="object-contain rounded" />
                          ) : (
                            <SchoolIcon size={20} className="text-cta" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base leading-tight">{school.name}</h3>
                          {school.year && <p className="text-white/50 text-xs">{school.year}</p>}
                        </div>
                      </div>
                      <CheckCircle size={18} className="text-cta shrink-0" />
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      {/* Service tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {tags.map((tag) => (
                            <span key={tag} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-gray-600 text-sm leading-relaxed">{school.work_description}</p>

                      {school.testimonial && (
                        <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                          <Quote size={14} className="text-accent shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 italic leading-relaxed">{school.testimonial}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-cta">
        <FadeIn>
          <div className="max-w-xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-extrabold text-navy">
              Is your institution looking for these services?
            </h2>
            <p className="mt-2 text-navy/70">
              We work with schools on painting, welding, plumbing and transport projects of all sizes across Kenya.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Link
                href="/contact"
                className="px-6 py-3 bg-navy text-white font-bold rounded-lg hover:bg-navy/90 transition-colors"
              >
                Contact Us
              </Link>
              <a
                href={`https://wa.me/${whatsapp}?text=Hello%2C%20we%20are%20a%20school%20interested%20in%20your%20services`}
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
