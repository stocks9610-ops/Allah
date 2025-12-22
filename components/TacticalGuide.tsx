import React, { useEffect, useState } from 'react';

interface TacticalGuideProps {
  step: 'init' | 'deposit_needed' | 'ready' | 'investing' | 'profit';
  customMessage?: string;
}

const TacticalGuide: React.FC<TacticalGuideProps> = ({ step, customMessage }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      let msg = "";
      switch (step) {
        case 'init':
          msg = "💡 <span class='text-white font-bold'>TIP:</span> <span class='text-[#f01a64] font-black uppercase'>Copy winning traders instantly.</span> Mirror their trades and earn automatically.";
          break;
        case 'deposit_needed':
          msg = "🔒 <span class='text-amber-500 font-bold'>ACCESS RESTRICTED:</span> Mirroring requires <span class='text-white font-bold'>Account Verification ($500+)</span>. Follow top traders now.";
          break;
        case 'ready':
          msg = "🚀 <span class='text-[#00b36b] font-bold'>SYSTEM PRIME:</span> No experience needed. <span class='text-white font-black uppercase'>Just copy profits.</span> Select a strategy below.";
          break;
        case 'investing':
          msg = "⚙️ <span class='text-[#f01a64] font-bold'>EXECUTING:</span> Mirroring expert trades in real time. <span class='text-white font-bold'>Syncing market orders...</span>";
          break;
        case 'profit':
          msg = "✅ <span class='text-[#00b36b] font-bold'>SUCCESS:</span> Strategy mirroring complete. <span class='text-white font-bold'>Profits routed to Account Ledger.</span>";
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
      className={`fixed bottom-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[420px] z-40 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      <div className="bg-[#1e222d]/80 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-2xl flex items-center gap-5 relative overflow-hidden group">
        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-transparent via-[#f01a64] to-transparent opacity-50 animate-pulse"></div>
        
        <div className="shrink-0 w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full animate-ping ${step === 'investing' ? 'bg-[#f01a64]' : 'bg-[#00b36b]'}`}></div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Tactical Market Guide</span>
            <span className="text-[9px] font-mono text-gray-600">Active Traders: 45k+</span>
          </div>
          <p 
            className="text-[11px] md:text-xs text-gray-300 font-medium leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>

        <div className={`absolute -right-8 -bottom-8 w-24 h-24 blur-3xl rounded-full opacity-20 pointer-events-none transition-colors duration-500 ${step === 'deposit_needed' ? 'bg-amber-500' : step === 'investing' ? 'bg-[#f01a64]' : 'bg-[#00b36b]'}`}></div>
      </div>
    </div>
  );
};

export default TacticalGuide;