import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { env } from '@/lib/env';
import User from '@/models/User';
import Workspace from '@/models/Workspace';
import Subscription from '@/models/Subscription';
import { registerSchema, formatZodError } from '@/validators/auth';
import { signToken, setSessionCookie } from '@/lib/auth';
import { error, rateLimit } from '@/lib/api-helpers';

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const rl = rateLimit(`register:${ip}`, 5, 60);
    if (rl.limited) return error('Too many requests', 429, { retryAfter: rl.retryAfter });

    const body = await req.json().catch(() => null);
    if (!body) return error('Invalid JSON body', 400);

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return error('Validation failed', 400, { issues: formatZodError(parsed.error) });
    }

    await connectDB();

    const existing = await User.findOne({ email: parsed.data.email });
    if (existing) return error('This email is already registered. Please sign in.', 409);

    const isAdmin = env.ADMIN_EMAIL && parsed.data.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();

    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      role: isAdmin ? 'admin' : 'user',
    });

    const workspace = await Workspace.create({
      userId: user._id,
      name: 'Personal Workspace',
      description: 'Your default workspace',
      isDefault: true,
    });

    await Subscription.create({ userId: user._id });
    user.preferences.defaultWorkspaceId = workspace._id;
    await user.save();

    const token = await signToken({ sub: String(user._id), email: user.email, role: user.role });
    await setSessionCookie(token);

    return NextResponse.json({ user: user.toSafeJSON() }, { status: 201 });
  } catch (err) {
    console.error('[auth/register] FULL ERROR:', err); // Terminal e error dekhabe
    // Mongoose duplicate key error catch
    if (err.code === 11000) {
      return error('This email is already registered.', 409);
    }
    // Return actual error message in dev so we can fix it easily
    return error(err.message || 'Internal server error', 500);
  }
}
