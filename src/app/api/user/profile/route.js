import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthUser, error } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

// GET current user profile
export async function GET() {
  const user = await getAuthUser();
  if (!user) return error('Unauthorized', 401);
  return NextResponse.json({ user: user.toSafeJSON() });
}

// UPDATE user profile
export async function PATCH(req) {
  const user = await getAuthUser();
  if (!user) return error('Unauthorized', 401);

  try {
    const body = await req.json();
    await connectDB();
    
    const dbUser = await User.findById(user._id);

    // Update basic info
    if (body.name) dbUser.name = body.name;
    if (body.email) dbUser.email = body.email;

    // Update password if provided
    if (body.newPassword && body.currentPassword) {
      const isValid = await dbUser.comparePassword(body.currentPassword);
      if (!isValid) return error('Current password is incorrect', 400);
      dbUser.password = body.newPassword; // Will be hashed by pre-save hook
    }

    // Update preferences
    if (body.preferences) {
      dbUser.preferences = { ...dbUser.preferences, ...body.preferences };
    }

    await dbUser.save();
    return NextResponse.json({ message: 'Profile updated successfully', user: dbUser.toSafeJSON() });

  } catch (err) {
    if (err.code === 11000) return error('Email is already in use', 400);
    return error(err.message || 'Update failed', 500);
  }
}
