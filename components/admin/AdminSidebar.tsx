'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Images,
  Wrench,
  School,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/gallery',   label: 'Gallery',     icon: Images },
  { href: '/admin/services',  label: 'Services',    icon: Wrench },
  { href: '/admin/schools',   label: 'Schools',     icon: School },
  { href: '/admin/contacts',  label: 'Enquiries',   icon: Inbox },
  { href: '/admin/settings',  label: 'Settings',    icon: Settings },
];

interface AdminSidebarProps {
  unreadCount?: number;
}

export default function AdminSidebar({ unreadCount = 0 }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const NavList = () => (
    <ul className="space-y-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setOpen(false)}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                active
                  ? 'bg-navy text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ].join(' ')}
            >
              <Icon size={18} />
              {label}
              {label === 'Enquiries' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-gray-200">
        <span className="font-bold text-navy">Admin Panel</span>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
            <p className="font-bold text-navy text-lg mb-4">Vimilip Enterprise</p>
            <NavList />
            <div className="mt-auto pt-4 border-t border-gray-200">
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors w-full"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </form>
            </div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="text-navy font-bold text-base">
            Vimilip<span className="text-cta">Enterprise</span>
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3" aria-label="Admin navigation">
          <NavList />
        </nav>
        <div className="p-3 border-t border-gray-200">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full px-3 py-2 rounded hover:bg-gray-100"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
