'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Plus, Image as ImageIcon, FileText, Code, 
  Settings, LogOut, User, PanelLeftClose, PanelLeft, Sparkles, MessageSquare, X
} from 'lucide-react';

export default function Sidebar({ user, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch('/api/conversations');
        if (res.ok) {
          const data = await res.json();
          setRecentChats(data.conversations || []);
        }
      } catch (err) {}
    }
    fetchChats();
  }, [pathname]);

  const navItems = [
    { name: 'New chat', href: '/chat', icon: Plus, isPrimary: true },
    { name: 'Images', href: '/images', icon: ImageIcon },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Coding', href: '/coding', icon: Code },
  ];

  // Mobile Drawer Classes
  const mobileClasses = `fixed md:relative top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
  } md:translate-x-0`;

  // Desktop Collapse Classes
  const widthClass = isCollapsed ? 'md:w-[60px]' : 'md:w-[260px]';
  const finalWidth = isMobileOpen ? 'w-[260px]' : `w-[260px] ${widthClass}`;

  if (isCollapsed) {
    return (
      <div className={`hidden md:flex flex-col items-center py-4 bg-[#171717] border-r border-[#2f2f2f] h-screen shrink-0 transition-all duration-300 ${widthClass}`}>
        <button onClick={() => setIsCollapsed(false)} className="p-2 hover:bg-[#2f2f2f] rounded-lg text-[#ececec]">
          <PanelLeft size={20} />
        </button>
        <button onClick={() => window.location.href='/chat'} className="mt-6 p-2 bg-[#2f2f2f] hover:bg-[#383838] rounded-lg text-white">
          <Plus size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className={`${mobileClasses} ${finalWidth} bg-[#171717] border-r border-[#2f2f2f] flex flex-col h-full shrink-0`}>
      
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <button onClick={() => setIsCollapsed(true)} className="hidden md:block p-2 hover:bg-[#2f2f2f] rounded-lg text-[#ececec] transition-colors">
          <PanelLeftClose size={20} />
        </button>
        <span className="font-semibold text-[#ececec] flex items-center gap-2">
          <Sparkles size={16} className="text-[#10a37f]" /> NEXORA AI
        </span>
        {/* Mobile Close Button */}
        <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Main Nav */}
      <div className="px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.isPrimary 
                  ? 'bg-[#2f2f2f] hover:bg-[#383838] text-[#ececec] font-medium' 
                  : isActive 
                    ? 'bg-[#2f2f2f] text-[#ececec] font-medium'
                    : 'text-[#ececec] hover:bg-[#2f2f2f]'
              }`}
            >
              <item.icon size={18} className={isActive || item.isPrimary ? "text-white" : "text-[#ececec]"} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Recents (Dynamic) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 mt-4">
        <div className="text-xs font-semibold text-[#b4b4b4] mb-2 px-3">Recents</div>
        <div className="space-y-0.5">
          {recentChats.length > 0 ? (
            recentChats.map((chat) => (
              <Link 
                key={chat._id} 
                href={`/chat?id=${chat._id}`} 
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#ececec] hover:bg-[#2f2f2f] rounded-lg truncate transition-colors group"
              >
                <MessageSquare size={14} className="text-gray-500 group-hover:text-gray-300 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </Link>
            ))
          ) : (
            <div className="px-3 text-xs text-gray-500 italic">No recent chats</div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-[#2f2f2f]">
        <div className="dropdown dropdown-top w-full">
          <div tabIndex={0} role="button" className="flex items-center gap-3 w-full p-2 hover:bg-[#2f2f2f] rounded-lg transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center text-white font-bold shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name || 'User'}</div>
              <div className="text-xs text-[#b4b4b4]">Free</div>
            </div>
          </div>
          
          <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow-2xl bg-[#2f2f2f] rounded-xl w-full mb-2 border border-white/10">
            <li><Link href="/settings"><Settings size={16} /> Settings</Link></li>
            <li>
              <button onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }} className="text-red-400 hover:text-red-300">
                <LogOut size={16} /> Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
