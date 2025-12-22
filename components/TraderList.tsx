
import React, { useState, useEffect, useRef } from 'react';
import { Trader } from '../types';
import TraderProfileModal from './TraderProfileModal';
import { playProfitSound } from '../services/audioService';

export interface ExtendedTrader extends Trader {
  category: 'crypto' | 'binary' | 'gold' | 'forex';
}

/** 
 * LOCAL IMAGE MAP 
 * These paths point to public/traders/ on your GitHub.
 * Rename your images to 1.webp, 2.webp, etc. and upload them to that folder.
 */
const TRADER_IMAGES = {
  anas: '/traders/1.webp',
  thomas: '/traders/2.webp',
  t3: '/traders/3.webp',
  t4: '/traders/4.webp',
  t5: '/traders/5.webp',
  t6: '/traders/6.webp',
  t7: '/traders/7.webp',
  t8: '/traders/8.webp',
  t9: '/traders/9.webp',
  t10: '/traders/10.webp',
  t11: '/traders/11.webp',
  t12: '/traders/12.webp',
  t13: '/traders/13.webp',
  t14: '/traders/14.webp',
  t15: '/traders/15.webp',
  t16: '/traders/16.webp',
  t17: '/traders/17.webp',
  t18: '/traders/18.webp',
  t19: '/traders/19.webp',
  t20: '/traders/20.webp',
};

export const ALL_MASTER_TRADERS: ExtendedTrader[] = [
  { id: 'master_0', name: 'Anas Ali (Elite Signal)', avatar: TRADER_IMAGES.anas, roi: 342.5, drawdown: 3.2, followers: 185000, weeks: 156, strategy: 'Signal & Mindset Architecture', type: 'Educator', experienceYears: 6, markets: ['Crypto', 'Signals'], riskScore: 3, winRate: 88.5, avgDuration: '1 day', riskMethods: ['Mindset Control', 'Risk Awareness'], bio: 'Young entrepreneur sharing skill teachings. Runs a massive trader signals community.', category: 'crypto' },
  { id: 'master_1', name: 'Thomas Kralow (Pro)', avatar: TRADER_IMAGES.thomas, roi: 410.8, drawdown: 4.5, followers: 452000, weeks: 312, strategy: 'Business-Grade Market Logic', type: 'Trader', experienceYears: 9, markets: ['Crypto', 'Stocks'], riskScore: 4, winRate: 92.1, avgDuration: '3 days', riskMethods: ['Portfolio Hedging', 'Growth Scaling'], bio: 'Investor and entrepreneur blending trading education with personal growth.', category: 'crypto' },
  { id: 'master_2', name: 'P4Provider Network', avatar: TRADER_IMAGES.t3, roi: 195.4, drawdown: 2.8, followers: 98000, weeks: 104, strategy: 'Finance Fundamentals', type: 'Analyst', experienceYears: 5, markets: ['Crypto', 'Forex'], riskScore: 2, winRate: 84.3, avgDuration: '1 week', riskMethods: ['Fundamental Analysis'], bio: 'Premier finance-related content provider offering tutorials on market fundamentals.', category: 'crypto' },
  { id: 'master_3', name: 'ElioDeFi Protocol', avatar: TRADER_IMAGES.t4, roi: 520.1, drawdown: 12.5, followers: 76500, weeks: 88, strategy: 'Decentralized Yield & Trend', type: 'Analyst', experienceYears: 4, markets: ['DeFi', 'Altcoins'], riskScore: 7, winRate: 76.9, avgDuration: '4 hours', riskMethods: ['Smart Contract Audit'], bio: 'Focused on decentralized finance (DeFi) and crypto market topics.', category: 'crypto' },
  { id: 'master_4', name: 'Craig Percoco', avatar: TRADER_IMAGES.t5, roi: 289.6, drawdown: 6.1, followers: 112000, weeks: 416, strategy: 'Day Trading Momentum', type: 'Trader', experienceYears: 8, markets: ['Crypto', 'Futures'], riskScore: 5, winRate: 81.2, avgDuration: '30 min', riskMethods: ['Momentum Stops'], bio: 'Seasoned investor sharing his journey from young day trader to pro.', category: 'crypto' },
  { id: 'master_5', name: 'Binary Edge Pro', avatar: TRADER_IMAGES.t6, roi: 312.5, drawdown: 8.9, followers: 15400, weeks: 92, strategy: 'M1 Reversal Scalping', type: 'Trader', experienceYears: 8, markets: ['Binary Options'], riskScore: 8, winRate: 89.1, avgDuration: '1 min', riskMethods: ['Fixed Stake'], bio: 'High-accuracy binary options signals with institutional-grade reversal logic.', category: 'binary' },
  { id: 'master_6', name: 'Gold Trend Master', avatar: TRADER_IMAGES.t7, roi: 245.9, drawdown: 3.1, followers: 67000, weeks: 210, strategy: 'XAU/USD Order Flow', type: 'Trader', experienceYears: 11, markets: ['Gold'], riskScore: 4, winRate: 85.2, avgDuration: '3 days', riskMethods: ['Volume Profile'], bio: 'Tracking institutional orders on Gold markets to ride market maker momentum.', category: 'gold' },
  { id: 'master_7', name: 'Forex Scalper Elite', avatar: TRADER_IMAGES.t8, roi: 389.2, drawdown: 11.4, followers: 12900, weeks: 88, strategy: 'Neural Grid Scalping', type: 'Analyst', experienceYears: 6, markets: ['EUR/USD', 'GBP/JPY'], riskScore: 7, winRate: 92.1, avgDuration: '15 min', riskMethods: ['Hard SL'], bio: 'Automated high-frequency signals tailored for the Forex markets.', category: 'forex' },
  { id: 'master_8', name: 'Alpha Matrix', avatar: TRADER_IMAGES.t9, roi: 275.4, drawdown: 4.2, followers: 42000, weeks: 140, strategy: 'Quantum Momentum', type: 'Trader', experienceYears: 7, markets: ['Crypto', 'Forex'], riskScore: 5, winRate: 82.5, avgDuration: '2 hours', riskMethods: ['Trailing Stop'], bio: 'Utilizing matrix math to predict short-term price deviations.', category: 'crypto' },
  { id: 'master_9', name: 'Omega Flow', avatar: TRADER_IMAGES.t10, roi: 310.2, drawdown: 5.1, followers: 31500, weeks: 96, strategy: 'Liquidity Hunter', type: 'Analyst', experienceYears: 5, markets: ['Gold', 'Oil'], riskScore: 6, winRate: 79.8, avgDuration: '1 day', riskMethods: ['Gap Filling'], bio: 'Specialized in identifying liquidity pockets in commodity markets.', category: 'gold' },
  { id: 'master_10', name: 'Quantum Pulse', avatar: TRADER_IMAGES.t11, roi: 450.9, drawdown: 14.2, followers: 89000, weeks: 180, strategy: 'Flash Arbitrage', type: 'Trader', experienceYears: 10, markets: ['Binary', 'Crypto'], riskScore: 9, winRate: 94.2, avgDuration: '30 sec', riskMethods: ['Hedge Lock'], bio: 'High-speed execution across multiple exchanges for tiny, safe wins.', category: 'binary' },
  { id: 'master_11', name: 'Stellar Edge', avatar: TRADER_IMAGES.t12, roi: 188.4, drawdown: 2.1, followers: 54200, weeks: 240, strategy: 'Macro Swing', type: 'Educator', experienceYears: 12, markets: ['Stocks', 'Forex'], riskScore: 2, winRate: 88.1, avgDuration: '2 weeks', riskMethods: ['Diversification'], bio: 'Conservative growth specialist focused on long-term wealth preservation.', category: 'forex' },
  { id: 'master_12', name: 'Vector Wealth', avatar: TRADER_IMAGES.t13, roi: 295.1, drawdown: 6.8, followers: 22800, weeks: 72, strategy: 'Trend Reversal', type: 'Trader', experienceYears: 4, markets: ['Crypto', 'Altcoins'], riskScore: 6, winRate: 74.5, avgDuration: '4 hours', riskMethods: ['ATR Stops'], bio: 'Aggressive altcoin hunter using vector analysis to find early entries.', category: 'crypto' },
  { id: 'master_13', name: 'Neural Dynamics', avatar: TRADER_IMAGES.t14, roi: 367.8, drawdown: 8.2, followers: 41200, weeks: 110, strategy: 'AI Model Replicator', type: 'Analyst', experienceYears: 6, markets: ['Gold', 'Nasdaq'], riskScore: 5, winRate: 86.9, avgDuration: '1 hour', riskMethods: ['Dynamic Sizing'], bio: 'Bridge between high-level AI models and retail execution.', category: 'gold' },
  { id: 'master_14', name: 'Cyber Trend', avatar: TRADER_IMAGES.t15, roi: 242.6, drawdown: 3.9, followers: 19500, weeks: 56, strategy: 'Social Sentiment', type: 'Trader', experienceYears: 3, markets: ['Meme Coins'], riskScore: 10, winRate: 68.2, avgDuration: '15 min', riskMethods: ['Panic Exit'], bio: 'Trading the buzz. High risk, high reward social sentiment analysis.', category: 'crypto' },
  { id: 'master_15', name: 'Flux Assets', avatar: TRADER_IMAGES.t16, roi: 318.4, drawdown: 4.8, followers: 33200, weeks: 125, strategy: 'Fibonacci Master', type: 'Educator', experienceYears: 8, markets: ['Forex'], riskScore: 4, winRate: 81.4, avgDuration: '8 hours', riskMethods: ['Scale In'], bio: 'Teaching the art of harmonic patterns and Fibonacci levels.', category: 'forex' },
  { id: 'master_16', name: 'Matrix Capital', avatar: TRADER_IMAGES.t17, roi: 412.3, drawdown: 9.1, followers: 61000, weeks: 144, strategy: 'Order Block Pro', type: 'Trader', experienceYears: 9, markets: ['Nasdaq', 'Gold'], riskScore: 7, winRate: 89.5, avgDuration: '2 days', riskMethods: ['Supply/Demand'], bio: 'Institutional order flow tracking for precision entries.', category: 'gold' },
  { id: 'master_17', name: 'Core Logic', avatar: TRADER_IMAGES.t18, roi: 156.2, drawdown: 1.5, followers: 45000, weeks: 300, strategy: 'Risk-Free Compound', type: 'Educator', experienceYears: 15, markets: ['S&P 500'], riskScore: 1, winRate: 95.8, avgDuration: '1 month', riskMethods: ['Compound Interest'], bio: 'The "Safety First" node. Slow, steady, and practically guaranteed.', category: 'forex' },
  { id: 'master_18', name: 'Zenith Trader', avatar: TRADER_IMAGES.t19, roi: 334.9, drawdown: 5.4, followers: 27600, weeks: 82, strategy: 'M5 Scalp System', type: 'Trader', experienceYears: 5, markets: ['Crypto', 'Binary'], riskScore: 6, winRate: 83.2, avgDuration: '5 min', riskMethods: ['Fixed Risk'], bio: 'Rapid-fire day trader focused on the 5-minute time frame.', category: 'binary' },
  { id: 'master_19', name: 'Apex Signals', avatar: TRADER_IMAGES.t20, roi: 489.1, drawdown: 12.8, followers: 105000, weeks: 210, strategy: 'Whale Tracker', type: 'Analyst', experienceYears: 11, markets: ['Crypto', 'Large Cap'], riskScore: 8, winRate: 91.5, avgDuration: '3 days', riskMethods: ['On-chain Data'], bio: 'Following the biggest wallets in crypto to catch the massive waves.', category: 'crypto' }
];

const SocialIcons: React.FC<{ color: string }> = ({ color }) => (
  <div className="flex gap-1.5 mt-1.5 opacity-60">
    <svg className={`w-2.5 h-2.5 ${color}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.054-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759 6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    <svg className={`w-2.5 h-2.5 ${color}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.27l-1.56 7.42c-.116.545-.44.68-.895.425l-2.37-1.75-1.145 1.1c-.125.127-.23.234-.473.234l.17-2.42 4.41-3.98c.19-.17-.04-.26-.297-.09l-5.45 3.43-2.34-.73c-.51-.16-.52-.51.107-.756l9.15-3.53c.42-.15.79.1.663.667z"/></svg>
  </div>
);

interface TraderListProps {
  onCopyClick: (trader: Trader) => void;
}

const TraderList: React.FC<TraderListProps> = ({ onCopyClick }) => {
  const [activeCategory, setActiveCategory] = useState<'crypto' | 'binary' | 'gold' | 'forex'>('crypto');
  const [traderProfits, setTraderProfits] = useState<Record<string, number>>({});
  const [liveWinRates, setLiveWinRates] = useState<Record<string, number>>({});
  const [animatingTraders, setAnimatingTraders] = useState<Record<string, boolean>>({});
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialProfits: Record<string, number> = {};
    const initialWinRates: Record<string, number> = {};
    
    ALL_MASTER_TRADERS.forEach(t => {
      const baseProfit = t.id === 'master_0' ? 245000.00 : 5000.00;
      initialProfits[t.id] = baseProfit + Math.random() * 45000;
      initialWinRates[t.id] = t.winRate;
    });
    
    setTraderProfits(initialProfits);
    setLiveWinRates(initialWinRates);

    const updateInterval = setInterval(() => {
      const filtered = ALL_MASTER_TRADERS.filter(t => t.category === activeCategory);
      if (filtered.length === 0) return;
      const randomIdx = Math.floor(Math.random() * filtered.length);
      const trader = filtered[randomIdx];
      
      const baseIncrement = trader.id === 'master_0' ? 850 : 250;
      const increment = baseIncrement + Math.random() * 1250;
      const winRateFluctuation = (Math.random() - 0.5) * 0.4;
      
      setTraderProfits(prev => ({ ...prev, [trader.id]: prev[trader.id] + increment }));
      setLiveWinRates(prev => ({ 
        ...prev, 
        [trader.id]: Math.min(100, Math.max(50, prev[trader.id] + winRateFluctuation)) 
      }));
      
      setAnimatingTraders(prev => ({ ...prev, [trader.id]: true }));
      playProfitSound();
      setTimeout(() => setAnimatingTraders(prev => ({ ...prev, [trader.id]: false })), 400);
    }, 1200);

    return () => clearInterval(updateInterval);
  }, [activeCategory]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const getCategoryStyles = (cat: string) => {
    const base = "px-8 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 active:scale-95 border-2";
    if (activeCategory !== cat) {
      return `${base} bg-[#1e222d] text-gray-400 border-[#2a2e39] hover:border-gray-500 hover:text-white`;
    }
    switch (cat) {
      case 'crypto': return `${base} bg-[#f01a64] text-white border-[#f01a64] shadow-[0_10px_30px_rgba(240,26,100,0.3)]`;
      case 'binary': return `${base} bg-blue-600 text-white border-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.3)]`;
      case 'gold': return `${base} bg-yellow-500 text-black border-yellow-500 shadow-[0_10px_30px_rgba(234,179,8,0.3)]`;
      case 'forex': return `${base} bg-emerald-600 text-white border-emerald-600 shadow-[0_10px_30px_rgba(5,150,105,0.3)]`;
      default: return base;
    }
  };

  return (
    <section className="py-16 md:py-28 bg-[#131722] border-t border-[#2a2e39] relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 space-y-6">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none bg-gradient-to-b from-white to-gray-500 text-transparent bg-clip-text drop-shadow-2xl">
            Top Traders From The World
          </h2>
          
          <p className="max-w-3xl mx-auto text-sm md:text-lg text-gray-400 font-medium leading-relaxed">
            Copy trading lets you automatically follow experienced traders. Choose a trader based on verified performance and trade <span className="text-[#00b36b] font-bold">risk-free</span> with our C-Level expert strategies.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {(['crypto', 'binary', 'gold', 'forex'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={getCategoryStyles(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group/list">
          <button 
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-black/50 hover:bg-[#f01a64] rounded-full items-center justify-center text-white backdrop-blur-md border border-white/10 shadow-xl transition-all opacity-0 group-hover/list:opacity-100 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <button 
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-black/50 hover:bg-[#f01a64] rounded-full items-center justify-center text-white backdrop-blur-md border border-white/10 shadow-xl transition-all opacity-0 group-hover/list:opacity-100 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-6 py-4 px-1 no-scrollbar snap-x snap-mandatory scroll-smooth"
          >
            {ALL_MASTER_TRADERS.filter(t => t.category === activeCategory).map(trader => (
              <div 
                key={trader.id}
                onClick={() => setSelectedTrader(trader)}
                className={`min-w-[85vw] sm:min-w-[320px] md:min-w-[340px] bg-[#1e222d] border border-[#2a2e39] rounded-3xl p-6 cursor-pointer transition-all snap-center relative group hover:border-[#f01a64]/50 hover:shadow-2xl ${
                  animatingTraders[trader.id] ? 'border-[#f01a64] scale-[1.01]' : ''
                }`}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <img loading="lazy" src={trader.avatar} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover ring-2 ring-white/5 bg-[#131722]" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00b36b] border-2 border-[#1e222d] rounded-full"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-black text-sm md:text-base truncate mb-1 group-hover:text-[#f01a64] transition-colors">{trader.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] bg-[#f01a64]/10 text-[#f01a64] px-2 py-0.5 rounded font-black uppercase tracking-widest">{trader.type}</span>
                      <SocialIcons color="text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#131722] p-5 rounded-2xl mb-5 border border-[#2a2e39] group-hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Total Profits</span>
                    <span className="text-[8px] text-[#00b36b] font-black uppercase tracking-widest animate-pulse">Live</span>
                  </div>
                  <div className={`text-2xl md:text-3xl font-black tracking-tight ${animatingTraders[trader.id] ? 'text-[#00b36b]' : 'text-white'}`}>
                    ${traderProfits[trader.id]?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39] text-center">
                    <span className="text-[7px] text-gray-500 uppercase font-black block mb-1">ROI</span>
                    <span className="text-[#00b36b] font-black text-sm">+{trader.roi}%</span>
                  </div>
                  <div className={`bg-[#131722] p-3 rounded-xl border border-[#2a2e39] text-center ${animatingTraders[trader.id] ? 'bg-[#00b36b]/5' : ''} transition-colors`}>
                    <span className="text-[7px] text-gray-500 uppercase font-black block mb-1">Accuracy</span>
                    <span className="text-[#00b36b] font-black text-sm">
                      {(liveWinRates[trader.id] || trader.winRate).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <button 
                  className="w-full py-4 bg-[#00b36b] hover:bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transform transition active:scale-95 group-hover:shadow-[#00b36b]/20"
                  onClick={(e) => { e.stopPropagation(); onCopyClick(trader); }}
                >
                  Copy Strategy
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex md:hidden justify-center mt-4 gap-2 opacity-50">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
            <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest ml-2">Swipe to explore</span>
          </div>
        </div>
      </div>

      {selectedTrader && (
        <TraderProfileModal 
          trader={selectedTrader} 
          currentProfit={traderProfits[selectedTrader.id]}
          currentWinRate={liveWinRates[selectedTrader.id]}
          onClose={() => setSelectedTrader(null)} 
          onCopyClick={() => onCopyClick(selectedTrader)} 
        />
      )}
    </section>
  );
};

export default TraderList;
