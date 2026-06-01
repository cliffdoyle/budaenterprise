import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { schoolSchema } from '@/lib/validations';
import type { School } from '@/lib/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = schoolSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { name, logo_url, work_description, testimonial, year, is_visible } = parsed.data;

  try {
    const rows = (await sql`
      UPDATE schools SET
        name             = COALESCE(${name             ?? null}, name),
        logo_url         = COALESCE(${logo_url         ?? null}, logo_url),
        work_description = COALESCE(${work_description ?? null}, work_description),
        testimonial      = COALESCE(${testimonial      ?? null}, testimonial),
        year             = COALESCE(${year             ?? null}, year),
        is_visible       = COALESCE(${is_visible       ?? null}, is_visible)
      WHERE id = ${id}
      RETURNING *
    `) as School[];
    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    await sql`DELETE FROM schools WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
