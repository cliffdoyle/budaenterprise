import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { schoolSchema } from '@/lib/validations';
import type { School } from '@/lib/types';

export async function GET(req: NextRequest) {
  const session = await auth();
  const all = req.nextUrl.searchParams.get('all') === 'true' && !!session;

  try {
    const data = all
      ? ((await sql`SELECT * FROM schools ORDER BY year DESC`) as School[])
      : ((await sql`SELECT * FROM schools WHERE is_visible = true ORDER BY year DESC`) as School[]);
    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = schoolSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { name, logo_url, work_description, testimonial, year, is_visible } = parsed.data;

  try {
    const rows = (await sql`
      INSERT INTO schools (name, logo_url, work_description, testimonial, year, is_visible)
      VALUES (${name}, ${logo_url ?? null}, ${work_description}, ${testimonial ?? null}, ${year ?? null}, ${is_visible ?? true})
      RETURNING *
    `) as School[];
    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
