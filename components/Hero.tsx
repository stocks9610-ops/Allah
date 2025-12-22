
import React, { useState } from 'react';
import FloatingFlags from './FloatingFlags';

interface HeroProps {
  onJoinClick: () => void;
  onInstallRequest: () => Promise<boolean>;
  onStartJourney?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinClick, onInstallRequest, onStartJourney }) => {
  const [shareText, setShareText] = useState('SHARE & EARN $200');

  const handleShare = async () => {
    // Specific text requested by user for Telegram popup
    const text = "🔥 Earn $200 per referral! 💸\n\nInvite friends, they install the app, and YOU earn money! 💰\n\nStart your journey to financial freedom here:";
    const url = window.location.href;
    
    // Telegram Share URL structure
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    
    // Open Telegram immediately
    window.open(telegramUrl, '_blank');
    
    setShareText('OPENING TELEGRAM...');
    setTimeout(() => setShareText('SHARE & EARN $200'), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-32 md:pb-56 bg-[#131722]">
      {/* FLOATING FLAGS LAYER */}
      <FloatingFlags />

      {/* PROFESSIONAL BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1611974717525-587441658ee0?q=80&w=2070&auto=format&fit=crop" 
          alt="Professional World Trade Platform Setup" 
          className="w-full h-full object-cover opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e222d] via-transparent to-[#131722]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#131722] via-transparent to-[#131722] opacity-80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 md:mb-8">
          <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-ping"></span>
          <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] md:tracking-[0.3em]">SECURE CLUSTER ACTIVE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-[0.95] uppercase italic px-2">
          TRADE SMARTER,<br className="hidden sm:block" /> LIVE BETTER.
        </h1>
        
        {/* NEW BENEFIT POINTS SECTION */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-5xl mx-auto mb-8 px-2">
          {[
            "Save Time & Automate",
            "Daily Profit Withdrawals",
            "100% Transparent Operations",
            "Military-Grade Encryption",
            "Elite Learning Opportunities"
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-[#1e222d]/80 border border-[#2a2e39] px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: `${i * 100}ms` }}>
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#00b36b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[9px] md:text-[10px] font-black text-gray-200 uppercase tracking-widest">{benefit}</span>
            </div>
          ))}
        </div>

        <p className="max-w-3xl mx-auto text-sm md:text-xl text-gray-300 mb-10 px-6 font-bold leading-relaxed tracking-wide shadow-black drop-shadow-lg">
          Achieve financial freedom. Follow the pros and create a second income stream today. <span className="text-[#f01a64] uppercase font-black text-base md:text-2xl border-b-2 border-[#f01a64]">Simple, fast, and secure.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 px-4">
          <button 
            onClick={onStartJourney || onJoinClick}
            className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#f01a64] hover:bg-pink-700 text-white font-black text-base md:text-lg rounded-xl shadow-lg transform transition active:scale-95 uppercase tracking-tighter"
          >
            START JOURNEY
          </button>
          
          <div className="flex w-full sm:w-auto gap-2 justify-center">
            <button 
              onClick={handleShare}
              className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-5 bg-[#0088cc] hover:bg-[#0077b5] text-white font-black text-base md:text-lg rounded-xl shadow-[0_0_20px_rgba(0,136,204,0.4)] transform transition active:scale-95 uppercase tracking-tighter flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 8.146l-2.003 9.442c-.149.659-.537.818-1.089.508l-3.048-2.247-1.47 1.415c-.162.162-.299.3-.612.3l.219-3.106 5.651-5.108c.245-.219-.054-.341-.379-.126l-6.985 4.4-3.007-.941c-.654-.203-.667-.654.137-.967l11.75-4.529c.544-.203 1.02.123.836.761z"/>
              </svg>
              <span className="whitespace-nowrap">{shareText}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
