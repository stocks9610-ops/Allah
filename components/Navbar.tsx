
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
  const [showSecurity, setShowSecurity] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAffiliateCopy = () => {
    const refLink = `${window.location.origin}/join?ref=${user?.email.split('@')[0] || 'trader'}`;
    navigator.clipboard.writeText(refLink);
    setShowMenu(false);
    alert("AFFILIATE UPLINK COPIED TO CLIPBOARD");
  };

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
            <span className="text-[8px] md:text-[10px] text-gray-400 block -mt-0.5 font-semibold uppercase whitespace-nowrap">Elite Terminal v3.1</span>
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
                className="flex items-center gap-2 md:gap-3 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 active:scale-95"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] md:text-xs text-white font-black uppercase tracking-tighter truncate max-w-[80px] md:max-w-none">
                    {user.username.split(' ')[0]}
                  </span>
                  <span className={`text-[7px] md:text-[9px] font-black tracking-widest uppercase ${user.hasDeposited ? 'text-[#00b36b]' : 'text-[#f01a64]'}`}>
                    {user.hasDeposited ? 'VERIFIED NODE' : 'UNVERIFIED'}
                  </span>
                </div>
                <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-[#1e222d] to-black rounded-lg flex items-center justify-center border border-[#2a2e39] shadow-lg">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden z-[70] animate-in slide-in-from-top-2 fade-in">
                  <div className="p-3 border-b border-[#2a2e39] bg-[#131722]">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Command Center</span>
                  </div>
                  
                  <div className="p-1.5 space-y-0.5">
                    <button onClick={() => { setShowHistory(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-[#2a2e39] rounded-xl group transition-colors">
                      <span className="text-gray-400 group-hover:text-white">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-wider">Ledger History</span>
                        <span className="text-[8px] text-gray-500 uppercase">View Transactions</span>
                      </div>
                    </button>

                    <button onClick={() => { setShowSecurity(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-[#2a2e39] rounded-xl group transition-colors">
                      <span className="text-gray-400 group-hover:text-white">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-wider">Security Node</span>
                        <span className="text-[8px] text-gray-500 uppercase">Active Promo Codes</span>
                      </div>
                    </button>

                    <button onClick={handleAffiliateCopy} className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-[#2a2e39] rounded-xl group transition-colors">
                      <span className="text-gray-400 group-hover:text-[#00b36b]">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-wider">Affiliate Uplink</span>
                        <span className="text-[8px] text-gray-500 uppercase">Copy Referral ID</span>
                      </div>
                    </button>

                    <div className="h-px bg-[#2a2e39] my-1 mx-2"></div>

                    <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 rounded-xl group transition-colors">
                      <span className="text-gray-400 group-hover:text-red-500">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-wider group-hover:text-red-500">Disconnect</span>
                        <span className="text-[8px] text-gray-500 uppercase">Terminate Session</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={onJoinClick}
                className="hidden sm:block text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                LOG IN
              </button>
              <button 
                onClick={onJoinClick}
                className="bg-transparent border border-[#f01a64] text-[#f01a64] px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] hover:bg-[#f01a64] hover:text-white transition-all shadow-lg uppercase tracking-widest active:scale-95"
              >
                JOIN
              </button>
            </>
          )}
        </div>
      </nav>

      {showHistory && user && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#1e222d] border border-[#2a2e39] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#2a2e39] flex justify-between items-center bg-[#131722]">
              <h3 className="text-white font-black uppercase text-sm tracking-widest">Digital Ledger</h3>
              <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-0 max-h-[60vh] overflow-y-auto no-scrollbar">
              <table className="w-full text-left text-[10px] md:text-xs">
                <thead className="bg-[#131722] text-gray-500 uppercase font-black tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2e39]">
                  <tr>
                    <td className="px-4 py-3 text-white font-bold">Trading Profit</td>
                    <td className="px-4 py-3 text-[#00b36b] font-mono">+${(user.balance - 1000).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-[#00b36b] font-black uppercase">Liquid</td>
                  </tr>
                  {user.hasDeposited && (
                    <tr>
                      <td className="px-4 py-3 text-white font-bold">Security Deposit</td>
                      <td className="px-4 py-3 text-[#00b36b] font-mono">+$1,000.00</td>
                      <td className="px-4 py-3 text-right text-[#00b36b] font-black uppercase">Verified</td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-4 py-3 text-white font-bold">Signup Bonus</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">+$1,000.00</td>
                    <td className="px-4 py-3 text-right text-amber-500 font-black uppercase">Locked</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 text-center">
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">End of Chain Records</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSecurity && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-[#1e222d] border border-[#2a2e39] w-full max-w-sm rounded-2xl p-6 text-center space-y-6 shadow-[0_0_50px_rgba(240,26,100,0.2)]">
              <div className="w-16 h-16 bg-[#f01a64]/10 rounded-full flex items-center justify-center mx-auto text-[#f01a64]">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-black uppercase text-lg tracking-tight mb-2">Terminal Access</h3>
                <p className="text-gray-400 text-xs">The following codes are active for your profile.</p>
              </div>
              <div className="bg-[#131722] border border-[#2a2e39] p-4 rounded-xl">
                 <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">System Promo Code</span>
                 <span className="text-2xl font-mono text-white tracking-[0.5em] font-black uppercase">4451</span>
              </div>
              <div className="bg-[#131722] border border-[#2a2e39] p-4 rounded-xl">
                 <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Global Sync Code</span>
                 <span className="text-2xl font-mono text-[#00b36b] tracking-[0.5em] font-black uppercase">2025</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowSecurity(false)} className="flex-1 bg-[#2a2e39] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#353a47]">Dismiss</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
