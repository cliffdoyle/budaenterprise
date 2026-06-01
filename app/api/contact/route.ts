import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { contactSchema } from '@/lib/validations';
import { Resend } from 'resend';

// In-memory rate limiter — per IP, max 5 per hour
// NOTE: For multi-instance production, replace with Upstash Redis
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const WINDOW = 60 * 60 * 1000; // 1 hour
  const MAX = 5;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW });
    return true;
  }
  if (entry.count >= MAX) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again in an hour.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { name, phone, service, message } = parsed.data;

  try {
    await sql`INSERT INTO enquiries (name, phone, service, message) VALUES (${name}, ${phone}, ${service}, ${message})`;
  } catch {
    return NextResponse.json({ error: 'Failed to save your message. Please try again.' }, { status: 500 });
  }

  // Optional: send email notification via Resend
  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'noreply@budaenterprise.co.ke',
        to: process.env.ADMIN_EMAIL,
        subject: `New enquiry from ${name} — ${service}`,
        text: `Name: ${name}\nPhone: ${phone}\nService: ${service}\n\nMessage:\n${message}`,
      });
    } catch {
      // Email notification failure should not block the response
    }
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
