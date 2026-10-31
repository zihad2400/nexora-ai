import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import DashboardShell from '@/components/layout/DashboardShell';

export default async function DashboardLayout({ children }) {
  const session = await getSessionFromCookies();
  if (!session?.sub) redirect('/login');

  await connectDB();
  const user = await User.findById(session.sub).select('-password');
  if (!user || user.status === 'suspended') redirect('/login');

  const plainUser = {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  return <DashboardShell user={plainUser}>{children}</DashboardShell>;
}
