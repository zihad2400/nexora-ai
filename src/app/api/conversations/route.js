import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import { getAuthUser, error } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const user = await getAuthUser();
    if (!user) return error('Unauthorized', 401);

    await connectDB();
    
    // Fetch top 15 recent conversations for this user
    const conversations = await Conversation.find({ userId: user._id })
      .sort({ lastMessageAt: -1 })
      .limit(15)
      .select('_id title');

    return NextResponse.json({ conversations });
  } catch (err) {
    return error('Failed to fetch conversations', 500);
  }
}
