
import React, { useState, useEffect } from 'react';
import { Trader } from '../types';
import { getTraderEdgeFast } from '../services/geminiService';

interface TraderProfileModalProps {
  trader: Trader;
  currentProfit?: number; // New Prop
  currentWinRate?: number; // New Prop
  onClose: () => void;
  onCopyClick: () => void;
}

const useCountUp = (endValue: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = endValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [endValue]);
  return count;
};

const TraderProfileModal: React.FC<TraderProfileModalProps> = ({ trader, currentProfit, currentWinRate, onClose, onCopyClick }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const [showDeployConfig, setShowDeployConfig] = useState(false);
  const [investAmount, setInvestAmount] = useState<number>(1000);
  
  const animatedRoi = useCountUp(trader.roi);

  // Initial Scan Animation
  useEffect(() => {
    const steps = [
      "Connecting to Market Channel...",
      "Verifying Blockchain History...",
      "Analyzing Portfolio Protocols...",
      "Syncing Live PnL..."
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setScanStep(currentStep);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 350); // Fast scan

    // Fetch AI Insight in background
    const fetchInsight = async () => {
      const summary = await getTraderEdgeFast(trader.bio);
      setAiInsight(summary);
    };
    fetchInsight();

    return () => clearInterval(interval);
  }, [trader]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestAmount(Number(e.target.value));
  };

  const projectedProfit = (investAmount * (trader.roi / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 });

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#131722]/95 backdrop-blur-xl">
        <div className="text-center space-y-4 p-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-[#2a2e39] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#f01a64] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black text-white">{Math.floor(Math.random() * 99)}%</span>
            </div>
          </div>
          <div>
             <h3 className="text-white font-black uppercase tracking-widest text-lg animate-pulse">Analyzing Performance Data</h3>
             <p className="text-[#00b36b] font-mono text-xs mt-2 uppercase tracking-tight">
               {["Connecting...", "Verifying History...", "Checking Liquidity...", "Syncing..."][scanStep] || "Finalizing..."}
             </p>
          </div>
        </div>
      </div>
    );
  }

  // Use passed props or default values
  const displayWinRate = currentWinRate ? currentWinRate.toFixed(1) : trader.winRate;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#131722] w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-[2.5rem] flex flex-col overflow-hidden animate-in zoom-in-95 shadow-2xl border border-white/5">
        
        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-[#2a2e39] bg-gradient-to-r from-[#1e222d] to-[#131722] shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 p-2 hover:text-white transition-colors bg-white/5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
               <img src={trader.avatar} className="w-16 h-16 md:w-24 md:h-24 rounded-2xl object-cover ring-2 ring-[#f01a64]/50 shadow-[0_0_20px_rgba(240,26,100,0.3)]" />
               <div className="absolute -bottom-1 -right-1 bg-[#00b36b] text-[8px] font-black text-white px-2 py-0.5 rounded-full border border-[#131722] animate-pulse">
                 LIVE
               </div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter truncate">{trader.name}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-[9px] font-black bg-white/10 text-white px-2 py-0.5 rounded uppercase tracking-widest">{trader.type}</span>
                <span className="text-[9px] font-black bg-[#f01a64]/10 text-[#f01a64] px-2 py-0.5 rounded uppercase tracking-widest">Safety Score: {trader.riskScore}/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLL CONTENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#131722]">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* KPI GRID */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#1e222d] p-4 rounded-2xl border border-[#2a2e39] text-center">
                <span className="text-[8px] text-gray-500 uppercase font-black block mb-1">Total Return</span>
                <span className="text-lg md:text-2xl font-black text-[#00b36b]">+{animatedRoi.toFixed(0)}%</span>
              </div>
              <div className="bg-[#1e222d] p-4 rounded-2xl border border-[#2a2e39] text-center">
                <span className="text-[8px] text-gray-500 uppercase font-black block mb-1">Accuracy</span>
                <span className="text-lg md:text-2xl font-black text-white">{displayWinRate}%</span>
              </div>
              <div className="bg-[#1e222d] p-4 rounded-2xl border border-[#2a2e39] text-center">
                <span className="text-[8px] text-gray-500 uppercase font-black block mb-1">Followers</span>
                <span className="text-lg md:text-2xl font-black text-blue-500">{(trader.followers / 1000).toFixed(1)}k</span>
              </div>
            </div>

            {/* PERFORMANCE CHART */}
            <div className="bg-[#1e222d] rounded-2xl border border-[#2a2e39] p-5 relative overflow-hidden group">
               <div className="flex justify-between items-center mb-4">
                 <h4 className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Growth Curve (30D)</h4>
                 <span className="text-[9px] text-[#00b36b] bg-[#00b36b]/10 px-2 py-0.5 rounded font-black uppercase">Exponential</span>
               </div>
               <div className="h-32 w-full relative">
                  {/* FAKE CHART SVG */}
                  <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00b36b" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#00b36b" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 35 C 10 35, 15 30, 25 28 S 40 32, 50 20 S 65 15, 80 10 S 90 5, 100 2" fill="none" stroke="#00b36b" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    <path d="M0 35 C 10 35, 15 30, 25 28 S 40 32, 50 20 S 65 15, 80 10 S 90 5, 100 2 V 40 H 0 Z" fill="url(#chartFill)" stroke="none" />
                  </svg>
                  {/* Hover Marker */}
                  <div className="absolute top-0 right-0 h-full w-[1px] bg-white/20"></div>
                  <div className="absolute top-2 right-0 translate-x-1/2 w-2 h-2 bg-[#00b36b] rounded-full shadow-[0_0_10px_#00b36b]"></div>
               </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div>
               <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 border-l-2 border-[#f01a64] pl-3">Live Trade Stream</h4>
               <div className="space-y-2">
                 {[
                   { pair: 'BTC/USDT', type: 'LONG', pnl: '+12.5%', time: '2m ago' },
                   { pair: 'ETH/USDT', type: 'SHORT', pnl: '+5.2%', time: '15m ago' },
                   { pair: 'XAU/USD', type: 'LONG', pnl: '+8.1%', time: '1h ago' },
                 ].map((t, i) => (
                   <div key={i} className="flex items-center justify-between bg-[#1e222d] p-3 rounded-xl border border-white/5 hover:bg-[#252a36] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${t.type === 'LONG' ? 'bg-[#00b36b]/20 text-[#00b36b]' : 'bg-red-500/20 text-red-500'}`}>{t.type}</span>
                        <span className="text-xs font-bold text-white">{t.pair}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-black text-[#00b36b]">{t.pnl}</span>
                        <span className="block text-[8px] text-gray-600 font-medium">{t.time}</span>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* AI SUMMARY */}
            <div className="bg-gradient-to-br from-[#1e222d] to-black p-5 rounded-2xl border border-white/10 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f01a64]/10 rounded-full blur-3xl"></div>
               <h4 className="text-[9px] text-[#f01a64] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                 Market Edge Analysis
               </h4>
               <p className="text-gray-300 text-xs font-medium italic leading-relaxed relative z-10">
                 "{aiInsight || 'Analyzing historical market performance data...'}"
               </p>
            </div>
            
          </div>
        </div>

        {/* STICKY FOOTER - INVESTMENT ENGINE */}
        <div className="bg-[#1e222d] border-t border-[#2a2e39] p-4 md:p-6 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
          
          {!showDeployConfig ? (
             <button 
               onClick={() => setShowDeployConfig(true)}
               className="w-full bg-[#f01a64] hover:bg-pink-700 py-4 rounded-xl font-black text-white text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(240,26,100,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
             >
               Copy Strategy
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
             </button>
          ) : (
             <div className="space-y-5 animate-in slide-in-from-bottom-4 fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Mirror Amount (USDT)</span>
                  <span className="text-xl font-black text-white">${investAmount.toLocaleString()}</span>
                </div>
                
                <input 
                  type="range" 
                  min="100" 
                  max="50000" 
                  step="100" 
                  value={investAmount} 
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-[#131722] rounded-lg appearance-none cursor-pointer accent-[#00b36b]"
                />
                
                <div className="bg-[#131722] p-3 rounded-xl border border-[#00b36b]/30 flex justify-between items-center">
                   <span className="text-[9px] text-[#00b36b] font-black uppercase tracking-widest">Est. Total Return</span>
                   <span className="text-sm font-black text-[#00b36b]">+${projectedProfit}</span>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowDeployConfig(false)}
                    className="px-6 py-4 rounded-xl font-black text-gray-500 bg-[#131722] hover:bg-[#2a2e39] text-xs uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => { onClose(); onCopyClick(); }}
                    className="flex-1 bg-[#00b36b] hover:bg-green-600 py-4 rounded-xl font-black text-white text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,179,107,0.4)] active:scale-95 transition-all"
                  >
                    Confirm Copy
                  </button>
                </div>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TraderProfileModal;
