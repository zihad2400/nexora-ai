'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardShell({ user, children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-[#212121] overflow-hidden relative">
      {/* Animated Background */}
      <div className="bg-nexora-glow"></div>
      
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        user={user} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden flex items-center p-3 border-b border-[#2f2f2f] bg-[#171717] text-white">
          <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2">
            <Menu size={24} />
          </button>
          <span className="font-semibold ml-2 flex-1 text-center pr-8">NEXORA AI</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
