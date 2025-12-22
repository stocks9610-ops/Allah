
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

  return (
    <>
      <nav className="bg-[#1e222d] border-b border-[#2a2e39] py-3 md:py-4 px-4 md:px-10 flex items-center justify-between sticky top-0 z-[60] backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer shrink-0" onClick={user ? onDashboardClick : onHomeClick}>
          <div className="bg-[#f01a64] p-1 md:p-1.5 rounded-lg">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 3v11h7l-7 7V10H6l7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-[#f01a64] tracking-tighter uppercase leading-none">
              CopyTrade
            </h1>
            <span className="text-[8px] md:text-[10px] text-gray-500 block -mt-0.5 font-semibold uppercase whitespace-nowrap">Elite Terminal v5.0</span>
          </div>
        </div>
        
        <div className="hidden md:flex gap-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">
          <button onClick={onHomeClick} className="hover:text-white transition-colors">Marketplace</button>
          <button onClick={onGalleryClick} className="hover:text-pink-500 transition-colors">Success Hall</button>
          {user && <button onClick={onDashboardClick} className="text-[#f01a64] hover:text-white transition-colors">My Dashboard</button>}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 md:gap-3 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] md:text-xs text-white font-black uppercase tracking-tighter truncate max-w-[80px] md:max-w-none">
                    {user.username.split(' ')[0]}
                  </span>
                  <span className={`text-[7px] md:text-[9px] font-black tracking-widest uppercase ${user.hasDeposited ? 'text-[#00b36b]' : 'text-amber-500'}`}>
                    {user.hasDeposited ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </div>
                <div className="w-8 h-8 md:w-9 md:h-9 bg-black rounded-lg flex items-center justify-center border border-[#2a2e39] shadow-lg">
                   <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden z-[70] animate-in slide-in-from-top-2 fade-in">
                  <div className="p-3 border-b border-[#2a2e39] bg-[#131722]">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Command Center</span>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button onClick={() => { setShowHistory(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-[#2a2e39] rounded-xl group transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-wider">Neural Ledger</span>
                        <span className="text-[8px] text-gray-500 uppercase">Account History</span>
                      </div>
                    </button>
                    <div className="h-px bg-[#2a2e39] my-1 mx-2"></div>
                    <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 rounded-xl group transition-colors text-red-500">
                      <span className="text-[10px] font-black uppercase tracking-wider">Terminate Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onJoinClick}
              className="bg-[#f01a64] text-white px-5 md:px-7 py-2.5 md:py-3 rounded-xl font-black text-[9px] md:text-[10px] hover:bg-pink-700 transition-all shadow-[0_5px_15px_rgba(240,26,100,0.3)] uppercase tracking-widest active:scale-95"
            >
              Access Terminal
            </button>
          )}
        </div>
      </nav>

      {showHistory && user && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#1e222d] border border-[#2a2e39] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[#2a2e39] flex justify-between items-center bg-[#131722]">
              <h3 className="text-white font-black uppercase text-sm tracking-widest">Neural Ledger Account Status</h3>
              <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#131722] rounded-2xl border border-white/5">
                  <span className="text-gray-400 font-bold text-[10px] uppercase">Account Age</span>
                  <span className="text-white font-black text-xs uppercase">{new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#131722] rounded-2xl border border-white/5">
                  <span className="text-gray-400 font-bold text-[10px] uppercase">Total Balance</span>
                  <span className={`font-black text-xs uppercase ${user.hasDeposited ? 'text-[#00b36b]' : 'text-amber-500'}`}>
                    ${user.balance.toLocaleString()} {!user.hasDeposited && '(LOCKED)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
