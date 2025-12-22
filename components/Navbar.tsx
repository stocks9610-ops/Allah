
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../services/authService';

interface NavbarProps {
  onJoinClick: () => void;
  onGalleryClick: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onDashboardClick: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onJoinClick, onGalleryClick, user, onLogout, onDashboardClick, onHomeClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      onDashboardClick();
    } else {
      onHomeClick();
    }
  };

  const handleLinkClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  const tradeProfit = user ? Math.max(0, user.balance - 1000) : 0;

  return (
    <>
      <nav className="bg-[#1e222d] border-b border-[#2a2e39] py-3 md:py-4 px-4 md:px-10 flex items-center justify-between sticky top-0 z-[60] backdrop-blur-md bg-opacity-95">
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer shrink-0 group" 
          onClick={handleLogoClick}
          title="Return Home"
        >
          <div className="bg-[#f01a64] p-1 md:p-1.5 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-[#f01a64]/20">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 3v11h7l-7 7V10H6l7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-[#f01a64] tracking-tighter uppercase leading-none">
              CopyTrade
            </h1>
            <span className="text-[8px] md:text-[10px] text-gray-500 block -mt-0.5 font-black uppercase whitespace-nowrap tracking-widest">Professional Hub</span>
          </div>
        </div>
        
        <div className="hidden md:flex gap-10 text-[10px] font-black text-gray-500 uppercase tracking-widest">
          <button onClick={(e) => handleLinkClick(e, onHomeClick)} className="hover:text-white transition-colors relative group">
            Marketplace
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f01a64] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button onClick={(e) => handleLinkClick(e, onGalleryClick)} className="hover:text-[#f01a64] transition-colors relative group">
            Success Hall
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f01a64] group-hover:w-full transition-all duration-300"></span>
          </button>
          {user && (
            <button onClick={(e) => handleLinkClick(e, onDashboardClick)} className="text-[#f01a64] hover:text-white transition-colors relative group">
              My Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 md:gap-3 p-1.5 pr-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 bg-black/20"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] md:text-xs text-white font-black uppercase tracking-tighter truncate max-w-[80px] md:max-w-none">
                    {user.username.split(' ')[0]}
                  </span>
                  <span className={`text-[7px] md:text-[9px] font-black tracking-widest uppercase ${user.hasDeposited ? 'text-[#00b36b]' : 'text-amber-500'}`}>
                    {user.hasDeposited ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-xl flex items-center justify-center border border-[#2a2e39] shadow-2xl">
                   <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-[#1e222d] border border-[#2a2e39] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[70] animate-in slide-in-from-top-2 fade-in">
                  <div className="p-4 border-b border-[#2a2e39] bg-[#131722]">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] block">Command Center Hub</span>
                  </div>
                  <div className="p-2 space-y-1">
                    <button onClick={() => { setShowHistory(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-[#2a2e39] rounded-2xl group transition-all">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-white uppercase tracking-wider group-hover:text-[#f01a64] transition-colors">Account Ledger</span>
                        <span className="text-[8px] text-gray-500 uppercase tracking-tight">Performance History</span>
                      </div>
                    </button>
                    <div className="h-px bg-[#2a2e39] my-1 mx-3"></div>
                    <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-2xl group transition-all text-red-500">
                      <span className="text-[11px] font-black uppercase tracking-wider">Terminate Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={(e) => handleLinkClick(e, onJoinClick)}
              className="bg-[#f01a64] text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black text-[10px] md:text-[11px] hover:bg-pink-700 transition-all shadow-[0_10px_25px_rgba(240,26,100,0.3)] uppercase tracking-widest active:scale-95 border border-white/10"
            >
              Access Terminal
            </button>
          )}
        </div>
      </nav>

      {showHistory && user && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#1e222d] border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#131722]">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-[#00b36b] rounded-full animate-pulse shadow-[0_0_8px_#00b36b]"></div>
                 <h3 className="text-white font-black uppercase text-xs tracking-[0.2em] italic">Account Integrity Ledger</h3>
              </div>
              <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-center p-5 bg-[#131722] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Protocol Initialized</span>
                <span className="text-white font-black text-xs uppercase tracking-tight">{new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-5 bg-[#131722] rounded-2xl border border-white/5 hover:border-[#00b36b]/30 transition-colors">
                <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Audited Profit</span>
                <span className="text-[#00b36b] font-black text-sm uppercase">
                  +${tradeProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center p-5 bg-[#131722] rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors">
                <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Global Balance</span>
                <span className={`font-black text-sm uppercase ${user.hasDeposited ? 'text-[#00b36b]' : 'text-amber-500'}`}>
                  ${user.balance.toLocaleString()} {!user.hasDeposited && '(PENDING)'}
                </span>
              </div>

              <div className="flex justify-between items-center p-5 bg-[#131722] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Success Rate</span>
                <span className="text-white font-black text-sm uppercase">{user.wins}W / {user.losses}L</span>
              </div>

              <div className="pt-6 text-center">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] leading-relaxed italic">
                   "All data is synchronized with the global liquidity network."
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
