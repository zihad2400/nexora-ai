import { NextResponse } from 'next/server';
import { connectDB } from './mongodb';
import { getSessionFromCookies } from './auth';
import User from '@/models/User';

export function json(data, init) { return NextResponse.json(data, init); }

export function error(message, status = 400, extra = {}) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export async function getAuthUser() {
  const session = await getSessionFromCookies();
  if (!session?.sub) return null;
  await connectDB();
  const user = await User.findById(session.sub).select('-password');
  if (!user || user.status === 'suspended') return null;
  return user;
}

export function withAuth(handler) {
  return async (req, ctx) => {
    const user = await getAuthUser();
    if (!user) return error('Unauthorized', 401);
    return handler(req, { ...ctx, user });
  };
}

export function withAdmin(handler) {
  return async (req, ctx) => {
    const user = await getAuthUser();
    if (!user) return error('Unauthorized', 401);
    if (user.role !== 'admin') return error('Forbidden', 403);
    return handler(req, { ...ctx, user });
  };
}

// Simple in-memory rate limiter (resets on restart; use Redis in production)
const buckets = new Map();
export function rateLimit(key, max = 30, windowSec = 60) {
  const now = Date.now();
  const win = windowSec * 1000;
  const arr = (buckets.get(key) || []).filter((t) => now - t < win);
  if (arr.length >= max) {
    return { limited: true, retryAfter: Math.ceil((win - (now - arr[0])) / 1000) };
  }
  arr.push(now);
  buckets.set(key, arr);
  return { limited: false };
}
