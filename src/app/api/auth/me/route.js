import { NextResponse } from 'next/server';
import { getAuthUser, error } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return error('Unauthorized', 401);
  return NextResponse.json({ user: user.toSafeJSON() });
}
