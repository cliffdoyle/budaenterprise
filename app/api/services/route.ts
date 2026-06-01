import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Service } from '@/lib/types';

export async function GET() {
  try {
    const data = (await sql`SELECT * FROM services ORDER BY slug`) as Service[];
    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
