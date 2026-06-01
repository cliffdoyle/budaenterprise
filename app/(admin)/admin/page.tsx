import type { Metadata } from 'next';
import Link from 'next/link';
import { Images, Wrench, School, Inbox, Settings } from 'lucide-react';
import { sql } from '@/lib/db';

export const metadata: Metadata = { title: 'Admin Dashboard' };

async function getStats() {
  try {
    const [img, enq, sch, unread] = await Promise.all([
      sql`SELECT COUNT(*) AS count FROM portfolio_images WHERE is_active = true`,
      sql`SELECT COUNT(*) AS count FROM enquiries`,
      sql`SELECT COUNT(*) AS count FROM schools WHERE is_visible = true`,
      sql`SELECT COUNT(*) AS count FROM enquiries WHERE is_read = false`,
    ]);
    return {
      images:    Number((img[0]    as { count: string }).count),
      enquiries: Number((enq[0]    as { count: string }).count),
      schools:   Number((sch[0]    as { count: string }).count),
      unread:    Number((unread[0] as { count: string }).count),
    };
  } catch {
    return { images: 0, enquiries: 0, schools: 0, unread: 0 };
  }
}

const QUICK_LINKS = [
  { href: '/admin/gallery',   label: 'Gallery Manager',    icon: Images,  desc: 'Upload & manage portfolio images' },
  { href: '/admin/services',  label: 'Services Editor',    icon: Wrench,  desc: 'Edit service content & features' },
  { href: '/admin/schools',   label: 'Schools Manager',    icon: School,  desc: 'Manage school partnerships' },
  { href: '/admin/contacts',  label: 'Enquiries Inbox',    icon: Inbox,   desc: 'View contact form submissions' },
  { href: '/admin/settings',  label: 'Site Settings',      icon: Settings, desc: 'Update phone, address & hours' },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here&apos;s your site overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Portfolio Images', value: stats.images },
          { label: 'Total Enquiries',  value: stats.enquiries },
          { label: 'Schools Listed',   value: stats.schools },
          { label: 'Unread Messages',  value: stats.unread, highlight: stats.unread > 0 },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-xl p-4 border ${s.highlight ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'} shadow-sm`}
          >
            <p className={`text-3xl font-extrabold ${s.highlight ? 'text-red-600' : 'text-navy'}`}>
              {s.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-navy/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center shrink-0">
              <Icon size={20} className="text-navy" />
            </div>
            <div>
              <p className="font-semibold text-navy text-sm">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* View site link */}
      <div className="mt-8 p-4 bg-navy/5 rounded-xl border border-navy/10 flex items-center justify-between">
        <div>
          <p className="font-semibold text-navy text-sm">View Public Site</p>
          <p className="text-xs text-gray-500">See how your site looks to visitors.</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition-colors"
        >
          Open →
        </Link>
      </div>
    </div>
  );
}
