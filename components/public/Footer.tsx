import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

// Inline SVG icons for Facebook & Instagram (lucide-react v1 removed brand icons)
function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const services = [
  { href: '/transport', label: 'Transport' },
  { href: '/plumbing', label: 'Plumbing' },
  { href: '/painting', label: 'Painting' },
];

const pages = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/schools', label: 'Schools' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_PHONE ?? '+254 713 925 354';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '254713925354';

  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <p className="text-white font-bold text-xl mb-2">
            Vimilip<span className="text-cta">Enterprise</span>
          </p>
          <p className="text-sm leading-relaxed">
            Your reliable partner for transport, plumbing and painting in Kisumu, Kenya.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
            <FacebookIcon size={16} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
            <InstagramIcon size={16} />
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Services</h3>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-cta transition-colors">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Pages */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Company</h3>
          <ul className="space-y-2 text-sm">
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="hover:text-cta transition-colors">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-cta shrink-0" />
              <a href={`tel:${phone}`} className="hover:text-cta transition-colors">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-cta shrink-0" />
              <a
                href="mailto:info@vimilipenterprise.co.ke"
                className="hover:text-cta transition-colors"
              >
                info@vimilipenterprise.co.ke
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-cta shrink-0 mt-0.5" />
              <span>Kisumu, Kenya</span>
            </li>
          </ul>
          <a
            href={`https://wa.me/${whatsapp}?text=Hello%2C%20I%20need%20a%20quote`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} Vimilip Enterprise. All rights reserved.
      </div>
    </footer>
  );
}
