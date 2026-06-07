import type { Metadata } from 'next';
import { sql } from '@/lib/db';
import type { PortfolioImage } from '@/lib/types';
import PortfolioGrid from '@/components/public/PortfolioGrid';
import FadeIn from '@/components/public/FadeIn';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Browse completed projects by Vimilip Enterprise — transport deliveries, plumbing installations and painting work across Kisumu.',
};

export const revalidate = 60;

async function getAllImages(): Promise<PortfolioImage[]> {
  try {
    return (await sql`
      SELECT * FROM portfolio_images
      WHERE is_active = true
      ORDER BY sort_order, created_at DESC
    `) as PortfolioImage[];
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const images = await getAllImages();

  return (
    <>
      {/* Header */}
      <section className="bg-navy py-16 px-4 text-white text-center">
        <FadeIn>
          <p className="text-cta text-xs uppercase tracking-widest font-semibold mb-2">Our Work</p>
          <h1 className="text-4xl font-extrabold">Portfolio</h1>
          <p className="mt-2 text-white/70 max-w-lg mx-auto">
            A collection of completed transport, plumbing and painting projects across Kisumu.
          </p>
        </FadeIn>
      </section>

      {/* Grid */}
      <section className="py-16 bg-warm-white">
        <div className="max-w-6xl mx-auto px-4">
          <PortfolioGrid images={images} />
        </div>
      </section>
    </>
  );
}
