'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { PortfolioImage } from '@/lib/types';

type Filter = 'all' | 'transport' | 'plumbing' | 'painting';

const LABELS: Record<string, string> = {
  transport: 'Transport',
  plumbing: 'Plumbing',
  painting: 'Painting',
};

const BADGE_COLORS: Record<string, string> = {
  transport: 'bg-blue-600',
  plumbing:  'bg-cyan-600',
  painting:  'bg-purple-600',
};

interface PortfolioGridProps {
  images: PortfolioImage[];
}

export default function PortfolioGrid({ images }: PortfolioGridProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [lightbox, setLightbox] = useState<PortfolioImage | null>(null);
  const [page, setPage] = useState(1);

  const PER_PAGE = 12;
  const filtered = filter === 'all' ? images : images.filter((i) => i.service_slug === filter);
  const visible = filtered.slice(0, page * PER_PAGE);
  const hasMore = filtered.length > visible.length;

  const filters: { key: Filter; label: string }[] = [
    { key: 'all',       label: 'All' },
    { key: 'transport', label: 'Transport' },
    { key: 'plumbing',  label: 'Plumbing' },
    { key: 'painting',  label: 'Painting' },
  ];

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by service">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setPage(1); }}
            className={[
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
              filter === f.key
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-navy border-navy/30 hover:border-navy',
            ].join(' ')}
            aria-pressed={filter === f.key}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No images yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visible.map((img) => (
            <button
              key={img.id}
              className="relative group aspect-square overflow-hidden rounded-lg bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              onClick={() => setLightbox(img)}
              aria-label={img.caption ?? `${LABELS[img.service_slug]} project`}
            >
              <Image
                src={img.url}
                alt={img.caption ?? `${LABELS[img.service_slug]} project`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span
                className={`absolute top-2 left-2 px-2 py-0.5 text-xs text-white rounded-full font-medium ${BADGE_COLORS[img.service_slug]}`}
              >
                {LABELS[img.service_slug]}
              </span>
              {img.caption && (
                <p className="absolute bottom-0 left-0 right-0 px-2 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.caption}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2.5 border-2 border-navy text-navy font-semibold rounded-lg hover:bg-navy hover:text-white transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div className="relative max-w-3xl w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.url}
              alt={lightbox.caption ?? 'Portfolio image'}
              width={900}
              height={600}
              className="rounded-xl object-contain max-h-[75vh] w-full"
            />
            {lightbox.caption && (
              <p className="text-white text-center mt-3 text-sm">{lightbox.caption}</p>
            )}
            <button
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 transition-colors"
              onClick={() => setLightbox(null)}
              aria-label="Close image"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
