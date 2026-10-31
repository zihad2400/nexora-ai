'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Mic, Globe, Image as ImageIcon, Edit3, ArrowUp } from 'lucide-react';

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Redirect to chat page with the prompt
    router.push(`/chat?q=${encodeURIComponent(input)}`);
  };

  const suggestions = [
    { text: "Create an image of a futuristic city", icon: ImageIcon },
    { text: "Write a cover letter", icon: Edit3 },
    { text: "Search the web for AI news", icon: Globe },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in-up h-full">
      
      {/* Center Logo/Icon */}
      <div className="mb-8">
        <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 70 L30 30 L70 70 L70 30" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h1 className="text-3xl font-semibold text-white mb-8">
        What's on the agenda today?
      </h1>

      {/* Main Input Box */}
      <div className="w-full max-w-3xl relative">
        <form onSubmit={handleSubmit} className="bg-[#2f2f2f] rounded-[28px] p-2 flex items-center shadow-lg border border-white/5">
          <button type="button" className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <Plus size={20} />
          </button>
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Ask NEXORA"
            className="flex-1 bg-transparent text-white placeholder-gray-400 px-2 outline-none text-lg"
          />
          <div className="flex items-center gap-1 pr-2">
            <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
              <Globe size={16} /> Think
            </button>
            <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
              <Mic size={20} />
            </button>
            <button 
              type="submit" disabled={!input.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                input.trim() ? 'bg-white text-black' : 'bg-[#676767] text-[#2f2f2f]'
              }`}
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap justify-center gap-2 mt-4 w-full max-w-3xl">
        {suggestions.map((item, i) => (
          <button 
            key={i}
            onClick={() => setInput(item.text)} 
            className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-[#2f2f2f] border border-white/10 rounded-full text-sm text-gray-300 transition-colors"
          >
            <item.icon size={16} /> {item.text}
          </button>
        ))}
      </div>
    </div>
  );
}
