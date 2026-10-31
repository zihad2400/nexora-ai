'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, Mic, Plus, Sparkles, Copy, Check, Share2, Edit3, RefreshCw, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import Spinner from '@/components/ui/Spinner';

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
          setInput(transcript);
        };
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = () => setIsListening(false);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error('Voice input not supported.');
    if (isListening) recognitionRef.current.stop();
    else { recognitionRef.current.start(); setIsListening(true); }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error('File too large (Max 5MB)');
      setAttachments([...attachments, { name: file.name, type: file.type }]);
    }
  };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSubmit(null, initialQuery);
      router.replace('/chat');
    }
  }, [initialQuery]);

  async function handleSubmit(e, overrideInput = null) {
    if (e) e.preventDefault();
    if (recognitionRef.current && isListening) { recognitionRef.current.stop(); setIsListening(false); }

    let textToSend = overrideInput || input;
    if (attachments.length > 0) textToSend += `\n[Attached: ${attachments.map(a => a.name).join(', ')}]`;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: 'user', content: textToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setAttachments([]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, modelId: selectedModel }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || data.error || 'Failed to get response');
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant', content: '' };
      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantMessage.content += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...assistantMessage };
          return updated;
        });
      }
    } catch (err) {
      toast.error('API Key invalid or Network error.');
      setMessages((prev) => prev.filter((msg, i) => i !== prev.length - 1 || msg.content !== ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full relative z-10 w-full overflow-hidden">
      <div className="h-14 flex items-center justify-between px-4 shrink-0 border-b border-white/5 md:border-none">
        <select 
          value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-transparent text-gray-200 font-semibold text-base md:text-lg hover:bg-[#2f2f2f] p-2 rounded-lg cursor-pointer outline-none transition-colors max-w-[200px] truncate"
        >
          <option value="gemini-1.5-flash">NEXORA Flash (Free)</option>
          <option value="gemini-1.5-pro">NEXORA Pro (Free)</option>
          <option value="gpt-4o-mini">GPT-4o Mini (Paid)</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <Sparkles className="w-12 h-12 text-[#10a37f] mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">How can I help you today?</h2>
            <p className="text-gray-400 text-sm md:text-base">Type a message, use voice, or attach a file.</p>
          </div>
        ) : (
          <div className="w-full max-w-3xl px-2 md:px-4 py-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group animate-fade-in-up`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-1">
                    <Sparkles size={14} className="text-black md:w-4 md:h-4" />
                  </div>
                )}
                
                <div className="flex flex-col max-w-[85%] md:max-w-[80%]">
                  <div className={`text-[14px] md:text-[15px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#2f2f2f] text-white px-4 md:px-5 py-2.5 rounded-2xl md:rounded-3xl' 
                      : 'text-gray-200 pt-1'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {msg.content !== '' && !loading && (
                    <div className={`flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <button onClick={() => { navigator.clipboard.writeText(msg.content); toast.success('Copied'); }} className="p-1 text-gray-400 hover:text-white"><Copy size={14} /></button>
                      {msg.role === 'assistant' && (
                         <button onClick={() => handleSubmit(null, messages[idx-1]?.content)} className="p-1 text-gray-400 hover:text-white"><RefreshCw size={14} /></button>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold text-xs mt-1">
                    U
                  </div>
                )}
              </div>
            ))}
            
            {loading && messages[messages.length-1]?.content === '' && (
               <div className="flex gap-3 md:gap-4">
                 <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-black animate-pulse" />
                 </div>
                 <div className="pt-1"><Spinner size="sm" /></div>
               </div>
            )}
            <div ref={messagesEndRef} className="h-20" />
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mx-auto px-2 md:px-4 pb-4 md:pb-6 pt-2 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent">
        
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 px-2">
            {attachments.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-[#2f2f2f] text-xs md:text-sm text-gray-300 px-3 py-1.5 rounded-lg border border-white/10 animate-fade-in-up">
                <FileText size={14} className="text-primary" /> {file.name}
                <button onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#2f2f2f] rounded-2xl md:rounded-[28px] p-1.5 md:p-2 flex items-center shadow-lg border border-white/5">
          
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf,.txt,.doc,.docx" />

          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 md:p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Attach File">
            <Plus size={18} className="md:w-5 md:h-5" />
          </button>
          
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask NEXORA"}
            className="flex-1 bg-transparent text-white placeholder-gray-400 px-1 md:px-2 outline-none text-base md:text-lg min-w-0"
            disabled={loading}
          />
          
          <div className="flex items-center gap-0.5 md:gap-1 pr-1 md:pr-2">
            <button 
              type="button" 
              onClick={toggleListening} 
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
            >
              <Mic size={18} className="md:w-5 md:h-5" />
            </button>

            <button 
              type="submit" disabled={(!input.trim() && attachments.length === 0) || loading}
              className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-colors ${
                (input.trim() || attachments.length > 0) ? 'bg-white text-black' : 'bg-[#676767] text-[#2f2f2f]'
              }`}
            >
              {loading ? <Spinner size="sm" /> : <Send size={16} className="-ml-0.5 md:w-[18px] md:h-[18px]" />}
            </button>
          </div>
        </form>
        <p className="text-center text-[10px] md:text-xs text-gray-500 mt-2">NEXORA AI can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-[#212121]"><Spinner size="lg" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
