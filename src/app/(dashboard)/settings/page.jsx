'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Settings, User, Shield, Bell, Monitor, Database, CreditCard, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [theme, setTheme] = useState('nexora-dark');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          setTheme(data.user.preferences?.theme || 'nexora-dark');
        }
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setFetching(false);
      }
    }
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, preferences: { theme } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { name: 'Profile', icon: User },
    { name: 'General', icon: Settings },
    { name: 'Appearance', icon: Monitor },
    { name: 'Notifications', icon: Bell },
    { name: 'Security and login', icon: Shield },
    { name: 'Data controls', icon: Database },
    { name: 'Billing', icon: CreditCard },
  ];

  if (fetching) return <div className="flex h-full items-center justify-center bg-[#212121]"><Loader2 className="animate-spin text-white" size={32} /></div>;

  return (
    <div className="flex flex-col md:flex-row h-full bg-[#212121]">
      
      {/* Settings Sidebar (Top on Mobile, Left on Desktop) */}
      <div className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-col shrink-0">
        <Link href="/chat" className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 p-2 transition-colors">
          <ArrowLeft size={16} /> Back to app
        </Link>
        
        <div className="relative mb-4 md:mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" placeholder="Search" 
            className="w-full bg-[#2f2f2f] text-white pl-9 pr-3 py-2 rounded-lg text-sm outline-none border border-transparent focus:border-white/20 transition-all"
          />
        </div>

        <div className="hidden md:block text-xs font-semibold text-gray-500 mb-2 px-2">Personal</div>
        
        {/* Horizontally Scrollable on Mobile, Vertical on Desktop */}
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                activeTab === item.name 
                  ? 'bg-[#2f2f2f] text-white' 
                  : 'text-gray-300 hover:bg-[#2f2f2f]'
              }`}
            >
              <item.icon size={16} className="text-gray-400" />
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-white mb-6 md:mb-8 flex items-center gap-2">
            <Link href="/chat" className="md:hidden p-1 -ml-1 text-gray-400 hover:text-white">
               <ArrowLeft size={20} />
            </Link>
            {activeTab}
          </h1>
          
          {activeTab === 'Profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 animate-fade-in-up">
              <div className="bg-[#2f2f2f] rounded-xl p-4 md:p-6 border border-white/5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#212121] text-white border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                  <input 
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#212121] text-white border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full md:w-auto">
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
              </button>
            </form>
          )}

          {activeTab === 'Appearance' && (
            <div className="bg-[#2f2f2f] rounded-xl p-4 md:p-6 border border-white/5 animate-fade-in-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-white">Theme</div>
                  <div className="text-sm text-gray-400">Select your preferred interface color</div>
                </div>
                <select 
                  value={theme} 
                  onChange={(e) => {
                    setTheme(e.target.value);
                    document.documentElement.setAttribute('data-theme', e.target.value);
                  }}
                  className="bg-[#212121] text-white border border-white/10 rounded-lg px-3 py-2 text-sm outline-none w-full md:w-auto"
                >
                  <option value="nexora-dark">Dark Mode</option>
                  <option value="nexora-light">Light Mode</option>
                </select>
              </div>
            </div>
          )}

          {activeTab !== 'Profile' && activeTab !== 'Appearance' && (
            <div className="bg-[#2f2f2f] rounded-xl p-8 border border-white/5 text-center animate-fade-in-up">
              <p className="text-gray-400">The <strong>{activeTab}</strong> settings are coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
