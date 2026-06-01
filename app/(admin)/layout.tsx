import AdminSidebar from '@/components/admin/AdminSidebar';
import { sql } from '@/lib/db';

async function getUnreadCount(): Promise<number> {
  try {
    const rows = await sql`SELECT COUNT(*) AS count FROM enquiries WHERE is_read = false`;
    return Number((rows[0] as { count: string }).count);
  } catch {
    return 0;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const unreadCount = await getUnreadCount();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar unreadCount={unreadCount} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
