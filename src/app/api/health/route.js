import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = { ok: true, db: 'unknown', ai: env.aiStatus(), time: new Date().toISOString() };
  try {
    await connectDB();
    result.db = 'connected';
  } catch (err) {
    result.ok = false;
    result.db = 'error';
    result.dbError = err.message;
  }
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
