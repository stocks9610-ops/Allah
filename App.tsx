
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
    // Initial Hydration
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
      setView('dashboard');
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) startY.current = e.touches[0].pageY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      const distance = e.touches[0].pageY - startY.current;
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
    }, 1200);
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
      alert("⚠️ PORTFOLIO LIMIT REACHED\n\nScale up your connection with a deposit to unlock more slots.");
      return;
    }
    if (currentTraders.length >= 1 && !user.hasDeposited) {
      alert("🔒 DEPOSIT REQUIRED\n\nFree tier supports 1 Active Node. Deposit $500+ for multi-strategy scaling.");
      navigateToDashboard();
      return;
    }
    const updatedUser = authService.updateUser({ activeTraders: [...currentTraders, trader] });
    if (updatedUser) {
      setUser(updatedUser);
      navigateToDashboard();
    }
  };

  const scrollToTraders = () => traderSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleGlobalShare = () => {
    const refLink = `${window.location.origin}/join?ref=${user?.email.split('@')[0] || 'elite'}`;
    const text = `🔥 Start your wealth journey with $1,000 Signup Bonus! \n\n${refLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(text)}`, '_blank');
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
        <div className={`bg-[#1e222d] border border-[#f01a64]/30 p-3 rounded-full shadow-2xl ${isRefreshing ? 'animate-neural-spin' : ''}`}>
          <svg className="h-6 w-6 text-[#f01a64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        className={`flex-grow transition-all duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}
        style={{ transform: `translateY(${pullDistance * 0.5}px)` }}
      >
        {view === 'landing' ? (
          <>
            <Hero onJoinClick={() => setShowSignup(true)} onInstallRequest={async () => true} onStartJourney={scrollToTraders} />
            <div className="max-w-7xl mx-auto px-2 relative z-10 mb-8">
              <div className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden h-[450px] md:h-[600px] border-t-[#00b36b] border-t-2">
                <MarketChart />
              </div>
            </div>
            <div ref={traderSectionRef}><TraderList onCopyClick={handleCopyTrader} /></div>
            <Features />
          </>
        ) : (
          user && <Dashboard user={user} onUserUpdate={handleLoginSuccess} onSwitchTrader={() => { setView('landing'); setTimeout(scrollToTraders, 100); }} />
        )}
      </main>

      <InfoSection />
      <Footer />

      <div className="fixed bottom-8 right-4 flex flex-col gap-4 z-[90]">
        <button 
          onClick={handleGlobalShare}
          className="w-14 h-14 bg-[#0088cc] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-bounce"
        >
          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 8.146l-2.003 9.442c-.149.659-.537.818-1.089.508l-3.048-2.247-1.47 1.415c-.162.162-.299.3-.612.3l.219-3.106 5.651-5.108c.245-.219-.054-.341-.379-.126l-6.985 4.4-3.007-.941c-.654-.203-.667-.654.137-.967l11.75-4.529c.544-.203 1.02.123.836.761z"/></svg>
        </button>

        <button 
          onClick={() => setShowAI(!showAI)}
          className="w-14 h-14 bg-[#f01a64] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        >
          <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </button>
      </div>

      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSuccess={handleLoginSuccess} />}
      {showGallery && <SuccessGallery onClose={() => setShowGallery(false)} />}
    </div>
  );
};

export default App;
