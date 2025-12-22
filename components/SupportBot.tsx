
import React, { useState, useRef, useEffect } from 'react';
import { startSupportChat } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface SupportBotProps {
  onClose: () => void;
}

const SUGGESTIONS = [
  "How to earn the $500 referral bonus?",
  "How to withdraw my $1,000 profit?",
  "Is the 98% success rate verified?",
  "Show me the deposit address."
];

const SupportBot: React.FC<SupportBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "• **HUB STATUS**: Sarah Online\n• **ACCESS**: Senior Account Support\n\nHello, I am Sarah. I am here to ensure your market replication is running at peak efficiency. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = [...messages, userMessage].map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await startSupportChat(history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText || "Market sync interrupted. Please verify your connection." }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-[420px] h-full sm:h-[650px] bg-[#1e222d] border-l sm:border border-[#2a2e39] sm:rounded-[3rem] shadow-2xl z-[70] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6">
      {/* HEADER */}
      <div className="p-6 bg-[#131722] border-b border-[#2a2e39] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-[#f01a64] rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(240,26,100,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00b36b] border-2 border-[#131722] rounded-full"></div>
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest leading-none">Sarah (Account)</h3>
            <span className="text-[9px] text-[#00b36b] font-black uppercase tracking-[0.2em] flex items-center gap-1 mt-1">
              Real-Time Connection Active
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* CHAT AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[#131722]/60 scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[88%] p-5 rounded-[1.5rem] text-xs sm:text-sm font-medium leading-relaxed shadow-xl ${
              m.role === 'user' ? 'bg-[#f01a64] text-white rounded-tr-none' : 'bg-[#1e222d] text-gray-200 border border-[#2a2e39] rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap font-sans">{m.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1e222d] p-4 rounded-2xl border border-[#2a2e39] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-bounce [animation-delay:-0.5s]"></span>
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-2">Processing...</span>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-6 bg-[#131722] border-t border-[#2a2e39]">
        <div className="flex flex-wrap gap-2 mb-5">
          {SUGGESTIONS.map(s => (
            <button 
              key={s} 
              onClick={() => handleSend(s)}
              disabled={isLoading}
              className="text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-2 rounded-xl hover:border-[#f01a64] hover:text-[#f01a64] transition-all disabled:opacity-30 active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative">
          <input 
            type="text" 
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Sarah..."
            className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-2xl py-5 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-[#f01a64] transition-all font-bold placeholder:text-gray-700 shadow-2xl disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#f01a64] p-2 rounded-xl text-white shadow-lg hover:bg-pink-700 transition-all active:scale-90 disabled:opacity-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        <p className="text-[8px] text-center text-gray-600 font-black uppercase tracking-widest mt-4">
          Professional Copy-Trade Hub / Encrypted v5.0
        </p>
      </div>
    </div>
  );
};

export default SupportBot;
