import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { settingsSchema } from '@/lib/validations';
import type { SiteSettings } from '@/lib/types';

export async function GET() {
  try {
    const rows = (await sql`SELECT key, value FROM site_settings`) as { key: string; value: string }[];
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value])) as unknown as SiteSettings;
    return NextResponse.json({ data: settings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  try {
    // Upsert each key individually (portable across DBs)
    for (const [key, value] of Object.entries(parsed.data)) {
      await sql`
        INSERT INTO site_settings (key, value) VALUES (${key}, ${value as string})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
