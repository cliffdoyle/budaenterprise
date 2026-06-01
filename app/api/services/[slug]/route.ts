import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { serviceUpdateSchema } from '@/lib/validations';
import type { Service } from '@/lib/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  if (!['transport', 'plumbing', 'painting'].includes(slug)) {
    return NextResponse.json({ error: 'Invalid service slug' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = serviceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { title, description, features } = parsed.data;

  try {
    const rows = (await sql`
      UPDATE services
      SET
        title       = COALESCE(${title       ?? null}, title),
        description = COALESCE(${description ?? null}, description),
        features    = COALESCE(${features ? JSON.stringify(features) : null}::jsonb, features),
        updated_at  = now()
      WHERE slug = ${slug}
      RETURNING *
    `) as Service[];
    if (!rows[0]) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    return NextResponse.json({ data: rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
