import React, { useState, useEffect, useTransition, useRef } from 'react';
import Navbar from './components/Navbar';
import TickerTape from './components/TickerTape';
import Hero from './components/Hero';
import MarketChart from './components/MarketChart';
import Features from './components/Features';
import TraderList from './components/TraderList';
import AIAssistant from './components/AIAssistant';
import SupportBot from './components/SupportBot';
import Footer from './components/Footer';
import SignupModal from './components/SignupModal';
import Dashboard from './components/Dashboard';
import SuccessGallery from './components/SuccessGallery';
import InfoSection from './components/InfoSection';
import LiveActivityFeed from './components/LiveActivityFeed'; 
import { authService, UserProfile } from './services/authService';
import { Trader } from './types';

const App: React.FC = () => {
  const [showAI, setShowAI] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showMentorshipModal, setShowMentorshipModal] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const threshold = 80;

  const traderSectionRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
      setView('dashboard');
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) startY.current = e.touches[0].pageY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      const currentY = e.touches[0].pageY;
      const distance = currentY - startY.current;
      if (distance > 0) setPullDistance(Math.min(distance * 0.5, 120));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= threshold) triggerRefresh();
    else setPullDistance(0);
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setPullDistance(80);
    setTimeout(() => {
      setIsRefreshing(false);
      setPullDistance(0);
      const currentUser = authService.getUser();
      if (currentUser) setUser({...currentUser});
    }, 1500);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('landing');
  };

  const handleLoginSuccess = (u: UserProfile) => {
    setUser(u);
    startTransition(() => {
      setView('dashboard');
      setShowSignup(false);
    });
  };

  const navigateToDashboard = () => {
    if (user) {
      startTransition(() => {
        setView('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      setShowSignup(true);
    }
  };

  const handleCopyTrader = (trader: Trader) => {
    if (!user) {
      setShowSignup(true);
      return;
    }
    const currentTraders = user.activeTraders || [];
    if (currentTraders.find(t => t.id === trader.id)) {
      navigateToDashboard();
      return;
    }
    if (currentTraders.length >= 3) {
      alert("⚠️ PORTFOLIO LIMIT REACHED\n\nMaximum of 3 concurrent Active Strategies allowed.");
      return;
    }
    if (currentTraders.length >= 1 && !user.hasDeposited) {
      alert("🔒 MULTI-STRATEGY ACCESS LOCKED\n\nTo run multiple simultaneous strategies, you must verify your wallet with a Security Deposit ($500+).");
      navigateToDashboard();
      return;
    }
    const updatedUser = authService.updateUser({ activeTraders: [...currentTraders, trader] });
    if (updatedUser) {
      setUser(updatedUser);
      navigateToDashboard();
    }
  };

  const scrollToTraders = () => traderSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
    } else return true;
    return false;
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-pink-500/30 overflow-x-hidden bg-[#131722] relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute left-0 right-0 z-[100] flex justify-center pointer-events-none transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance - 60}px)`, opacity: pullDistance / threshold }}
      >
        <div className={`bg-[#1e222d] border border-[#f01a64]/30 p-3 rounded-full shadow-[0_0_20px_rgba(240,26,100,0.3)] flex items-center justify-center ${isRefreshing ? 'animate-sync-spin' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f01a64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>

      <TickerTape />
      <Navbar 
        onJoinClick={() => setShowSignup(true)} 
        onGalleryClick={() => setShowGallery(true)}
        user={user}
        onLogout={handleLogout}
        onDashboardClick={navigateToDashboard}
        onHomeClick={() => user ? setView('dashboard') : setView('landing')}
      />
      
      <LiveActivityFeed />

      <main 
        className={`flex-grow transition-all duration-300 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
        style={{ transform: `translateY(${pullDistance * 0.5}px)` }}
      >
        {view === 'landing' ? (
          <>
            <Hero 
              onJoinClick={() => setShowSignup(true)} 
              onInstallRequest={handleInstallClick} 
              onStartJourney={scrollToTraders}
              externalShowMentorship={() => setShowMentorshipModal(true)} 
            />
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10 mb-8 md:mb-12">
              <div className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden h-[450px] md:h-[600px] border-t-[#00b36b] border-t-2">
                <MarketChart />
              </div>
            </div>
            <div ref={traderSectionRef}>
              <TraderList onCopyClick={handleCopyTrader} />
            </div>
            <Features />
          </>
        ) : (
          user && (
            <Dashboard 
              user={user} 
              onUserUpdate={handleLoginSuccess} 
              onSwitchTrader={() => {
                startTransition(() => {
                  setView('landing');
                  setTimeout(() => scrollToTraders(), 100);
                });
              }}
            />
          )
        )}
      </main>

      <InfoSection />
      <Footer />

      {/* RESTRUCTURED FLOATING ACTION COMMAND STACK */}
      <div className="fixed bottom-10 right-4 md:right-10 flex flex-col gap-5 z-[95]">
        
        {/* TOP: GOOGLE MEET (MENTORSHIP) */}
        <button 
          onClick={() => setShowMentorshipModal(true)}
          className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-transform hover:scale-110 active:scale-95 group relative border border-white/20"
          title="Elite Mentorship"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg" alt="Meet" className="w-7 h-7 md:w-8 md:h-8" />
          <span className="absolute right-full mr-4 px-3 py-1.5 bg-[#131722] border border-white/10 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest shadow-2xl pointer-events-none">
            Live Mentorship
          </span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00b36b] rounded-full animate-pulse shadow-[0_0_8px_#00b36b]"></div>
        </button>

        {/* MIDDLE: TELEGRAM (COMMUNITY) */}
        <button 
          onClick={() => window.open('https://t.me/MentorwithZuluTrade_bot', '_blank')}
          className="w-14 h-14 md:w-16 md:h-16 bg-[#0088cc] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,136,204,0.3)] transition-transform hover:scale-110 active:scale-95 group relative border border-white/10"
          title="Telegram Hub"
        >
          <svg className="h-7 w-7 md:h-8 md:w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.27l-1.56 7.42c-.116.545-.44.68-.895.425l-2.37-1.75-1.145 1.1c-.125.127-.23.234-.473.234l.17-2.42 4.41-3.98c.19-.17-.04-.26-.297-.09l-5.45 3.43-2.34-.73c-.51-.16-.52-.51.107-.756l9.15-3.53c.42-.15.79.1.663.667z"/>
          </svg>
          <span className="absolute right-full mr-4 px-3 py-1.5 bg-[#0088cc] text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest shadow-2xl pointer-events-none">
            Join Telegram
          </span>
        </button>

        {/* BOTTOM: SARAH (AI ANALYST) */}
        <button 
          onClick={() => setShowAI(!showAI)}
          className="w-14 h-14 md:w-16 md:h-16 bg-[#f01a64] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(240,26,100,0.3)] transition-transform hover:scale-110 active:scale-95 group relative border border-white/10"
          title="Sarah AI Assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="absolute right-full mr-4 px-3 py-1.5 bg-[#f01a64] text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest shadow-2xl pointer-events-none">
            Analyze with Sarah
          </span>
        </button>
      </div>

      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
      
      {showSignup && (
        <SignupModal 
          onClose={() => setShowSignup(false)} 
          onSuccess={handleLoginSuccess}
        />
      )}

      {showGallery && (
        <SuccessGallery onClose={() => setShowGallery(false)} />
      )}

      {/* INTERNAL MENTORSHIP MODAL SYNC */}
      {showMentorshipModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in">
          <div className="bg-[#1e222d] border border-white/10 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <div className="p-10 md:p-14 space-y-8 relative">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-[#00b36b] rounded-2xl flex items-center justify-center text-white shadow-[0_0_25px_rgba(0,179,107,0.3)]">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg" className="w-8 h-8 invert brightness-0" alt="" />
                   </div>
                   <div>
                      <h3 className="text-white font-black uppercase text-xl tracking-tighter italic">Live Mentorship</h3>
                      <span className="text-[10px] text-[#00b36b] font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
                        Professional Education Hub
                      </span>
                   </div>
                </div>
                <button onClick={() => setShowMentorshipModal(false)} className="text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="bg-[#131722] p-8 rounded-[2rem] border border-white/5 space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                       <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Yearly Retainer</span>
                       <span className="text-[#00b36b] font-black text-xl">$5,000.00</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                       <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Weekly Coaching</span>
                       <span className="text-[#00b36b] font-black text-xl">$100.00</span>
                    </div>
                 </div>
                 <p className="text-gray-300 text-xs font-bold text-center leading-relaxed italic uppercase tracking-tight pt-4">
                   "Unlock institutional replication and 1-on-1 coaching with Sarah and the elite trade department."
                 </p>
              </div>

              <button 
                onClick={() => setShowMentorshipModal(false)}
                className="w-full py-5 bg-[#00b36b] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl border border-white/10 active:scale-95"
              >
                Accept Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;