import React, { useState, useEffect, useRef } from 'react';
import { Trader } from '../types';
import TraderProfileModal from './TraderProfileModal';

interface ExtendedTrader extends Trader {
  category: 'crypto' | 'binary' | 'gold' | 'forex';
}

const AVATAR_IDS = [
  '1535713875002-d1d0cf377fde', '1519085360753-af0119f7cbe7', '1507003211169-0a1dd7228f2d',
  '1500648767791-00dcc994a43e', '1552058544-f2b08422138a', '1472099645785-5658abf4ff4e',
  '1610375461490-6d615d666d9b', '1544005313-94ddf0286df2', '1506794778202-cad84cf45f1d',
  '1534528741775-53994a69daeb', '1521119989659-a3492de74725', '1554151228-14d9def656ec',
  '1599566150163-29194dcaad36', '1580489944761-15a19d654956', '1531427186611-ecfd6d936c79',
  '1560250097-0b93528c311a', '1573496359142-b8d87734a5a2', '1492562080023-ab3db95bfbce'
];

const INITIAL_TRADERS: ExtendedTrader[] = [
  { 
    id: '0', name: 'Anas Ali (Elite Signal)', 
    avatar: '/traders/anas.jpg', 
    roi: 342.5, drawdown: 3.2, followers: 185000, weeks: 156, strategy: 'Signal & Mindset Architecture',
    type: 'Educator', experienceYears: 6, markets: ['Crypto', 'Signals'], riskScore: 3,
    winRate: 88.5, avgDuration: '1 day', riskMethods: ['Mindset Control', 'Risk Awareness'], 
    bio: 'Young entrepreneur sharing skill teachings. Runs a massive trader signals community and educational content network focused on mindset and risk awareness.',
    category: 'crypto'
  },
  { 
    id: '1', name: 'Thomas Kralow (Pro)', 
    avatar: '/traders/thomas.jpg', 
    roi: 410.8, drawdown: 4.5, followers: 452000, weeks: 312, strategy: 'Business-Grade Market Logic',
    type: 'Trader', experienceYears: 9, markets: ['Crypto', 'Stocks'], riskScore: 4,
    winRate: 92.1, avgDuration: '3 days', riskMethods: ['Portfolio Hedging', 'Growth Scaling'], 
    bio: 'Investor and entrepreneur blending trading education with personal growth. Shares deep market insights and business lessons for serious wealth builders.',
    category: 'crypto'
  },
  { 
    id: '2', name: 'P4Provider Network', 
    avatar: '/traders/p4.jpg', 
    roi: 195.4, drawdown: 2.8, followers: 98000, weeks: 104, strategy: 'Finance Fundamentals',
    type: 'Analyst', experienceYears: 5, markets: ['Crypto', 'Forex'], riskScore: 2,
    winRate: 84.3, avgDuration: '1 week', riskMethods: ['Fundamental Analysis', 'Trend Confirmation'], 
    bio: 'Premier finance-related content provider offering tutorials on market fundamentals. Specialized in helping beginners understand market mechanics.',
    category: 'crypto'
  },
  { 
    id: '3', name: 'ElioDeFi Protocol', 
    avatar: '/traders/elio.jpg', 
    roi: 520.1, drawdown: 12.5, followers: 76500, weeks: 88, strategy: 'Decentralized Yield & Trend',
    type: 'Analyst', experienceYears: 4, markets: ['DeFi', 'Altcoins'], riskScore: 7,
    winRate: 76.9, avgDuration: '4 hours', riskMethods: ['Smart Contract Audit', 'Liquidity Analysis'], 
    bio: 'Focused on decentralized finance (DeFi) and crypto market topics. Explains complex blockchain concepts and navigates deep crypto liquidity markets.',
    category: 'crypto'
  },
  { 
    id: '4', name: 'Craig Percoco', 
    avatar: '/traders/craig.jpg', 
    roi: 289.6, drawdown: 6.1, followers: 112000, weeks: 416, strategy: 'Day Trading Momentum',
    type: 'Trader', experienceYears: 8, markets: ['Crypto', 'Futures'], riskScore: 5,
    winRate: 81.2, avgDuration: '30 min', riskMethods: ['Momentum Stops', 'Volume Profile'], 
    bio: 'Seasoned investor sharing his journey from young day trader to pro. Specializes in market approaches, crypto basics, and high-level execution tutorials.',
    category: 'crypto'
  },
  { 
    id: '5', name: 'Binary Edge Pro', 
    avatar: '/traders/binary.jpg', 
    roi: 312.5, drawdown: 8.9, followers: 15400, weeks: 92, strategy: 'M1 Reversal Scalping',
    type: 'Trader', experienceYears: 8, markets: ['Binary Options', 'Forex'], riskScore: 8,
    winRate: 89.1, avgDuration: '1 min', riskMethods: ['Fixed Percentage Stake'], 
    bio: 'Specialized in high-accuracy binary options signals with institutional-grade reversal logic.',
    category: 'binary'
  },
  { 
    id: '6', name: 'Gold Trend Master', 
    avatar: '/traders/gold.jpg', 
    roi: 245.9, drawdown: 3.1, followers: 67000, weeks: 210, strategy: 'XAU/USD Order Flow',
    type: 'Trader', experienceYears: 11, markets: ['Gold', 'Commodities'], riskScore: 4,
    winRate: 85.2, avgDuration: '3 days', riskMethods: ['Volume Profile Analysis'], 
    bio: 'Specialized in tracking large-scale institutional orders on Gold markets to ride the momentum of market makers.',
    category: 'gold'
  },
  { 
    id: '7', name: 'Forex Scalper Elite', 
    avatar: '/traders/forex.jpg', 
    roi: 389.2, drawdown: 11.4, followers: 12900, weeks: 88, strategy: 'Institutional Grid Scalping',
    type: 'Analyst', experienceYears: 6, markets: ['EUR/USD', 'GBP/JPY'], riskScore: 7,
    winRate: 92.1, avgDuration: '15 min', riskMethods: ['Hard SL', 'Grid Recovery'], 
    bio: 'Automated high-frequency signals tailored for the Forex markets. Extreme precision, high turnover.',
    category: 'forex'
  }
];

const generateTraders = (): ExtendedTrader[] => {
  const generated: ExtendedTrader[] = [];
  const prefixes = ['Quantum', 'Alpha', 'Omega', 'Prime', 'Iron', 'Golden', 'Elite', 'Pro', 'Master', 'Rapid', 'Zenith', 'Apex', 'Nova', 'Stellar', 'Cosmic', 'Core', 'Smart', 'Safe', 'Trust', 'Venture', 'Wealth', 'Coin', 'Bit', 'Tech', 'Block', 'Rapid', 'Cyber', 'Flux', 'Matrix', 'Vector'];
  const suffixes = ['Trader', 'Invest', 'System', 'Logic', 'Signal', 'Edge', 'Flow', 'Wave', 'Trend', 'Scalp', 'Fund', 'Group', 'Labs', 'Hub', 'Capital', 'Assets', 'Strategies', 'Bot', 'AI', 'Algo', 'Dynamics', 'Solutions', 'Global', 'Network', 'Syndicate'];
  
  for (let i = 0; i < 50; i++) {
    const cat = (['crypto', 'binary', 'gold', 'forex'] as const)[Math.floor(Math.random() * 4)];
    const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]} ${Math.floor(Math.random() * 999)}`;
    const avatar = `https://images.unsplash.com/photo-${AVATAR_IDS[i % AVATAR_IDS.length]}?w=400&h=400&fit=crop`;
    
    generated.push({
      id: `gen_${i}`,
      name,
      avatar,
      roi: parseFloat((Math.random() * 400 + 50).toFixed(1)),
      drawdown: parseFloat((Math.random() * 15 + 1).toFixed(1)),
      followers: Math.floor(Math.random() * 50000) + 2000,
      weeks: Math.floor(Math.random() * 200) + 12,
      strategy: `${['High Frequency', 'Swing', 'Day', 'Scalp', 'Macro'][Math.floor(Math.random() * 5)]} ${cat === 'binary' ? 'Options' : 'Trend'} Strategy`,
      type: Math.random() > 0.7 ? 'Analyst' : 'Trader',
      experienceYears: Math.floor(Math.random() * 10) + 3,
      markets: [cat.toUpperCase(), 'USDT'],
      riskScore: Math.floor(Math.random() * 7) + 2,
      winRate: parseFloat((Math.random() * 20 + 75).toFixed(1)),
      avgDuration: ['1 min', '15 min', '1 hour', '4 hours', '1 day'][Math.floor(Math.random() * 5)],
      riskMethods: ['Stop Loss', 'Hedging', 'Grid'],
      bio: `Automated generated profile for elite ${cat} trading. Specialized in algorithmic replication.`,
      category: cat
    });
  }
  return generated;
};

const ALL_TRADERS = [...INITIAL_TRADERS, ...generateTraders()];

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
    
    ALL_TRADERS.forEach(t => {
      const baseProfit = t.id === '0' ? 245000.00 : 5000.00;
      initialProfits[t.id] = baseProfit + Math.random() * 45000;
      initialWinRates[t.id] = t.winRate; // Start with base win rate
    });
    
    setTraderProfits(initialProfits);
    setLiveWinRates(initialWinRates);

    const updateInterval = setInterval(() => {
      const filtered = ALL_TRADERS.filter(t => t.category === activeCategory);
      if (filtered.length === 0) return;
      const randomIdx = Math.floor(Math.random() * filtered.length);
      const trader = filtered[randomIdx];
      
      // Update Profit
      const baseIncrement = trader.id === '0' ? 850 : 250;
      const increment = baseIncrement + Math.random() * 1250;
      
      // Update Win Rate (Fluctuate slightly)
      const winRateFluctuation = (Math.random() - 0.5) * 0.4; // +/- 0.2%
      
      setTraderProfits(prev => ({ ...prev, [trader.id]: prev[trader.id] + increment }));
      setLiveWinRates(prev => ({ 
        ...prev, 
        [trader.id]: Math.min(100, Math.max(50, prev[trader.id] + winRateFluctuation)) 
      }));
      
      setAnimatingTraders(prev => ({ ...prev, [trader.id]: true }));
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
        {/* NEW HEADER DESIGN */}
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

        {/* BROWSER CONTAINER */}
        <div className="relative group/list">
          {/* DESKTOP NAV ARROWS */}
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
            {ALL_TRADERS.filter(t => t.category === activeCategory).map(trader => (
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
                  {/* REPLACED RISK WITH WIN RATE */}
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
          
          {/* MOBILE SWIPE HINT */}
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