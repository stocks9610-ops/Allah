
import React, { useEffect, useState } from 'react';

interface HolographicGuideProps {
  step: 'init' | 'deposit_needed' | 'ready' | 'investing' | 'profit';
  customMessage?: string;
}

const HolographicGuide: React.FC<HolographicGuideProps> = ({ step, customMessage }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Animation reset on step change
    setVisible(false);
    const timer = setTimeout(() => {
      let msg = "";
      switch (step) {
        case 'init':
          msg = "💡 <span class='text-white font-bold'>TIP:</span> Tap a <span class='text-[#f01a64] font-bold'>Trader Card</span> above to auto-copy their strategy.";
          break;
        case 'deposit_needed':
          msg = "🔒 <span class='text-amber-500 font-bold'>ACCESS RESTRICTED:</span> Deposit <span class='text-white font-bold'>$500+</span> to unlock High-Frequency Nodes.";
          break;
        case 'ready':
          msg = "🚀 <span class='text-[#00b36b] font-bold'>SYSTEM PRIME:</span> Select an investment plan below to deploy liquidity.";
          break;
        case 'investing':
          msg = "⚙️ <span class='text-[#f01a64] font-bold'>EXECUTING:</span> Establishing bridge to Mainnet... Do not close.";
          break;
        case 'profit':
          msg = "✅ <span class='text-[#00b36b] font-bold'>SUCCESS:</span> Payout secured. Funds added to Ledger.";
          break;
      }
      if (customMessage) msg = customMessage;
      setMessage(msg);
      setVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [step, customMessage]);

  return (
    <div 
      className={`fixed bottom-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[400px] z-40 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      {/* GLASS CONTAINER */}
      <div className="bg-[#1e222d]/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-start gap-4 relative overflow-hidden group">
        
        {/* SCANNER LINE ANIMATION */}
        <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-[#f01a64] to-transparent opacity-50 animate-pulse"></div>
        
        {/* ICON */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          <div className={`w-2 h-2 rounded-full animate-ping ${step === 'investing' ? 'bg-[#f01a64]' : 'bg-[#00b36b]'}`}></div>
        </div>

        {/* TEXT CONTENT */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Tactical Guide</span>
            <span className="text-[8px] font-mono text-gray-500">v2.4</span>
          </div>
          <p 
            className="text-[10px] md:text-xs text-gray-300 font-medium leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>

        {/* BACKGROUND GLOW */}
        <div className={`absolute -right-4 -bottom-4 w-16 h-16 blur-2xl rounded-full opacity-20 pointer-events-none transition-colors duration-500 ${step === 'deposit_needed' ? 'bg-amber-500' : step === 'investing' ? 'bg-[#f01a64]' : 'bg-[#00b36b]'}`}></div>
      </div>
    </div>
  );
};

export default HolographicGuide;
