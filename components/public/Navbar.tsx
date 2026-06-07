'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/painting', label: 'Painting' },
  { href: '/welding', label: 'Welding' },
  { href: '/plumbing', label: 'Plumbing' },
  { href: '/transport', label: 'Transport' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/schools', label: 'Schools' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl tracking-tight">
          Vimilip<span className="text-cta">Enterprise</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                pathname === l.href
                  ? 'bg-white/10 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10',
              ].join(' ')}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-3 px-4 py-1.5 bg-cta text-navy text-sm font-bold rounded hover:bg-cta/90 transition-colors"
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2 rounded hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          className="md:hidden bg-navy border-t border-white/10"
          aria-label="Mobile navigation"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                'block px-4 py-3 text-sm font-medium transition-colors border-b border-white/5',
                pathname === l.href
                  ? 'text-cta bg-white/5'
                  : 'text-white/80 hover:text-white hover:bg-white/10',
              ].join(' ')}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="p-4">
            <Link
              href="/contact"
              className="block text-center py-2.5 bg-cta text-navy font-bold rounded-lg hover:bg-cta/90 transition-colors"
              onClick={() => setOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
