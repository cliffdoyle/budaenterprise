import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { portfolioImageSchema } from '@/lib/validations';
import type { PortfolioImage } from '@/lib/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = portfolioImageSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { caption, service_slug, sort_order, is_active } = parsed.data;

  try {
    const rows = (await sql`
      UPDATE portfolio_images
      SET
        caption      = COALESCE(${caption      ?? null}, caption),
        service_slug = COALESCE(${service_slug ?? null}, service_slug),
        sort_order   = COALESCE(${sort_order   ?? null}, sort_order),
        is_active    = COALESCE(${is_active    ?? null}, is_active)
      WHERE id = ${id}
      RETURNING *
    `) as PortfolioImage[];
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
    const rows = (await sql`SELECT cloudinary_id FROM portfolio_images WHERE id = ${id}`) as Pick<PortfolioImage, 'cloudinary_id'>[];
    if (rows[0]?.cloudinary_id) {
      await deleteFromCloudinary(rows[0].cloudinary_id).catch(() => null); // non-fatal
    }
    await sql`DELETE FROM portfolio_images WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
