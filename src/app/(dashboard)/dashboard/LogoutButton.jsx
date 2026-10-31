'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out');
      window.location.href = '/login';
    } catch {
      toast.error('Logout failed');
      setLoading(false);
    }
  }

  return (
    <button onClick={onClick} disabled={loading} className="btn btn-outline btn-sm">
      {loading ? <span className="loading loading-spinner loading-xs" /> : 'Logout'}
    </button>
  );
}
