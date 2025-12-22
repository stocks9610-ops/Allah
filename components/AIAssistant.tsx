
import React, { useState, useRef, useEffect } from 'react';
import { deepMarketAnalysis } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: '• **STATUS**: Market Analyst Hub Online\n• **ACCESS**: Global Execution Support\n\nSubmit a chart for a deep market audit or select a task below. I am ready to calculate your next win.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{data: string, type: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUGGESTED_TASKS = [
    { label: "Market Audit", prompt: "Perform deep technical analysis on this screenshot. Identify key entry zones and profit targets.", icon: "📊" },
    { label: "Risk Evaluator", prompt: "Evaluate my current strategy for the high-volatility market environment.", icon: "🔍" },
    { label: "Alpha Signal", prompt: "Summarize the next 48-hour outlook for the major market pairs based on current sentiment.", icon: "🌐" }
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage({ data: base64String, type: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaskClick = (prompt: string) => {
    if (prompt.includes("screenshot") && !selectedImage) {
      fileInputRef.current?.click();
      return;
    }
    setInput(prompt);
  };

  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    e?.preventDefault();
    const finalPrompt = customPrompt || input;
    if ((!finalPrompt.trim() && !selectedImage) || isLoading) return;

    const userMsg = finalPrompt;
    const currentImg = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setMessages(prev => [...prev, { role: 'user', text: userMsg || "[Market Image Upload]" }]);
    setIsLoading(true);

    const response = await deepMarketAnalysis(userMsg, currentImg?.data, currentImg?.type);
    
    setMessages(prev => [...prev, { role: 'model', text: response || "Analysis currently unavailable." }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-[#1e222d] border-l border-[#2a2e39] shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-[#2a2e39] flex items-center justify-between bg-[#131722] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f01a64] rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(240,26,100,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <span className="font-black text-white text-sm tracking-widest uppercase block leading-none">Market Analyst Hub</span>
            <span className="text-[9px] text-[#00b36b] font-bold tracking-[0.2em]">GEMINI-3 PRO ACTIVE</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-6 bg-[#131722]/60 scroll-smooth no-scrollbar">
        {messages.length === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-1.5 h-1.5 bg-[#f01a64] rounded-full"></div>
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Select Analysis Vector:</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {SUGGESTED_TASKS.map((task, i) => (
                <button 
                  key={i}
                  onClick={() => handleTaskClick(task.prompt)}
                  className="text-left p-4 bg-[#1e222d] border border-[#2a2e39] rounded-2xl group hover:border-[#f01a64] transition-all flex items-center gap-4 shadow-xl"
                >
                  <span className="text-xl">{task.icon}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-white block uppercase group-hover:text-[#f01a64] transition-colors">{task.label}</span>
                    <span className="text-[9px] text-gray-500 truncate block font-medium uppercase tracking-tighter">Initiate market execution audit</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[90%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed font-medium shadow-2xl ${
              msg.role === 'user' ? 'bg-[#f01a64] text-white' : 'bg-[#1e222d] text-gray-200 border border-[#2a2e39]'
            }`}>
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1e222d] p-4 rounded-2xl border border-[#2a2e39] flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-bounce [animation-delay:-0.5s]"></span>
              </div>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Analyzing Market Data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#131722] border-t border-[#2a2e39] shrink-0">
        {selectedImage && (
          <div className="mb-4 p-3 bg-pink-500/10 border border-[#f01a64]/30 rounded-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#f01a64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
              <span className="text-[10px] text-[#f01a64] font-black uppercase">Analysis Image Ready</span>
            </div>
            <button onClick={() => setSelectedImage(null)} className="text-white hover:text-red-500 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-4 bg-[#1e222d] border border-[#2a2e39] text-gray-400 rounded-2xl hover:text-white hover:border-[#f01a64] transition-all shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
          </button>
          <div className="relative flex-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Market Analyst..."
              className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-[#f01a64] transition-all shadow-xl font-bold placeholder:text-gray-600"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-[#f01a64] text-white rounded-xl shadow-lg hover:bg-pink-700 transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
