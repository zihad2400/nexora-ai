'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        const issueMsg = data.issues?.[0]?.message;
        toast.error(issueMsg || data.error || 'Registration failed');
        return;
      }
      toast.success('Account created successfully!');
      window.location.href = '/dashboard';
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bg-glow"></div>
      <div className="glass-panel p-8 md:p-10 w-full animate-fade-in-up">
        
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-accent/20 rounded-2xl">
              <Sparkles className="text-accent w-6 h-6" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gradient tracking-tight">NEXORA AI</h1>
          <p className="mt-2 text-sm text-base-content/60">Create your account to get started</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" autoComplete="off">
          <div className="form-control w-full">
            <label className="label pb-1"><span className="label-text text-base-content/80 font-medium">Full Name</span></label>
            <input
              type="text" required autoComplete="off" minLength={2} maxLength={80}
              className="input input-bordered w-full bg-base-200/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Zihad Bin Samsu"
            />
          </div>

          <div className="form-control w-full">
            <label className="label pb-1"><span className="label-text text-base-content/80 font-medium">Email Address</span></label>
            <input
              type="email" required autoComplete="off"
              className="input input-bordered w-full bg-base-200/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-control w-full">
            <label className="label pb-1"><span className="label-text text-base-content/80 font-medium">Password</span></label>
            <div className="relative">
              {/* autoComplete="new-password" forces Chrome to hide autofill */}
              <input
                type={showPassword ? 'text' : 'password'} required autoComplete="new-password" minLength={8}
                className="input input-bordered w-full bg-base-200/50 pr-12 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
            {loading ? <Spinner size="sm" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-base-content/60">
          Already registered?{' '}
          <Link href="/login" className="link link-primary font-semibold hover:text-primary/80">Sign in</Link>
        </div>
      </div>
    </>
  );
}
