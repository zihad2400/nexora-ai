import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { loginSchema, formatZodError } from '@/validators/auth';
import { signToken, setSessionCookie } from '@/lib/auth';
import { error, rateLimit } from '@/lib/api-helpers';

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const rl = rateLimit(`login:${ip}`, 10, 60);
    if (rl.limited) return error('Too many login attempts', 429, { retryAfter: rl.retryAfter });

    const body = await req.json().catch(() => null);
    if (!body) return error('Invalid JSON body', 400);

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return error('Validation failed', 400, { issues: formatZodError(parsed.error) });
    }

    await connectDB();

    const user = await User.findOne({ email: parsed.data.email }).select('+password');
    if (!user) return error('Invalid email or password', 401);
    if (user.status === 'suspended') return error('Account suspended', 403);

    const ok = await user.comparePassword(parsed.data.password);
    if (!ok) return error('Invalid email or password', 401);

    await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

    const token = await signToken({
      sub: String(user._id),
      email: user.email,
      role: user.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({ user: user.toSafeJSON() });
  } catch (err) {
    console.error('[auth/login]', err);
    return error('Internal server error', 500);
  }
}
