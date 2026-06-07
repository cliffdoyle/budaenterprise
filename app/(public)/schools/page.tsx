import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { School as SchoolIcon, Quote } from 'lucide-react';
import FadeIn from '@/components/public/FadeIn';
import { sql } from '@/lib/db';
import type { School } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Schools & Institutions',
  description:
    'Vimilip Enterprise is trusted by schools and institutions across Kisumu for transport, plumbing and painting services.',
};

export const revalidate = 60;

async function getSchools(): Promise<School[]> {
  try {
    return (await sql`
      SELECT * FROM schools
      WHERE is_visible = true
      ORDER BY year DESC
    `) as School[];
  } catch {
    return [];
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
        <div className="max-w-4xl mx-auto px-4">
          {schools.length === 0 ? (
            <p className="text-center text-gray-500 py-16">School profiles coming soon.</p>
          ) : (
            <div className="space-y-6">
              {schools.map((school, i) => (
                <FadeIn key={school.id} delay={i * 0.08}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-5">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                      {school.logo_url ? (
                        <Image
                          src={school.logo_url}
                          alt={`${school.name} logo`}
                          width={56}
                          height={56}
                          className="object-contain rounded"
                        />
                      ) : (
                        <SchoolIcon size={28} className="text-accent" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-bold text-navy text-lg">{school.name}</h3>
                        {school.year && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {school.year}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{school.work_description}</p>
                      {school.testimonial && (
                        <div className="mt-3 flex items-start gap-2 bg-blue-50 rounded-lg p-3">
                          <Quote size={14} className="text-accent shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 italic">{school.testimonial}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
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
