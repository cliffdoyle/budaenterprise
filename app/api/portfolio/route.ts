import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { PortfolioImage } from '@/lib/types';

export async function GET(req: NextRequest) {
  const session = await auth();
  const { searchParams } = req.nextUrl;
  const service = searchParams.get('service');
  const all = searchParams.get('all') === 'true' && !!session;

  try {
    let data: PortfolioImage[];
    if (all && service) {
      data = (await sql`SELECT * FROM portfolio_images WHERE service_slug = ${service} ORDER BY sort_order, created_at DESC`) as PortfolioImage[];
    } else if (all) {
      data = (await sql`SELECT * FROM portfolio_images ORDER BY sort_order, created_at DESC`) as PortfolioImage[];
    } else if (service) {
      data = (await sql`SELECT * FROM portfolio_images WHERE is_active = true AND service_slug = ${service} ORDER BY sort_order, created_at DESC`) as PortfolioImage[];
    } else {
      data = (await sql`SELECT * FROM portfolio_images WHERE is_active = true ORDER BY sort_order, created_at DESC`) as PortfolioImage[];
    }
    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const service_slug = formData.get('service_slug') as string | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (!service_slug || !['transport', 'plumbing', 'painting'].includes(service_slug)) {
    return NextResponse.json({ error: 'Invalid service_slug' }, { status: 400 });
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return NextResponse.json({ error: 'File must be JPEG, PNG or WEBP' }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 5 MB' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, cloudinary_id } = await uploadToCloudinary(buffer);

    const rows = (await sql`
      INSERT INTO portfolio_images (url, cloudinary_id, service_slug, sort_order)
      VALUES (${url}, ${cloudinary_id}, ${service_slug}, 0)
      RETURNING *
    `) as PortfolioImage[];

    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

