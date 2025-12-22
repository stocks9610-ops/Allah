
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
  
  // Refresh Logic States
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const threshold = 80;

  // Navigation Refs
  const traderSectionRef = useRef<HTMLDivElement>(null);

  // Transitions allow us to mark heavy renders (like switching views) as non-urgent
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
      setView('dashboard');
    }

    // Capture the PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  // Custom Pull-to-Refresh Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      const currentY = e.touches[0].pageY;
      const distance = currentY - startY.current;
      if (distance > 0) {
        // Apply resistance
        setPullDistance(Math.min(distance * 0.5, 120));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= threshold) {
      triggerRefresh();
    } else {
      setPullDistance(0);
    }
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setPullDistance(80); // Hold at active position
    
    // Simulate data refresh (Neural Sync)
    setTimeout(() => {
      setIsRefreshing(false);
      setPullDistance(0);
      
      // Refresh user data or reload components conceptually
      const currentUser = authService.getUser();
      if (currentUser) setUser({...currentUser});
      
      console.log("Neural Clusters Synchronized");
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

  // ----- CORE TRADER COPY LOGIC (THE TRAP) -----
  const handleCopyTrader = (trader: Trader) => {
    if (!user) {
      setShowSignup(true);
      return;
    }

    const currentTraders = user.activeTraders || [];
    const isAlreadyActive = currentTraders.find(t => t.id === trader.id);

    // Case 1: Already active -> Just go to dashboard
    if (isAlreadyActive) {
      navigateToDashboard();
      return;
    }

    // Case 2: Max Limit Reached (3)
    if (currentTraders.length >= 3) {
      alert("⚠️ PORTFOLIO LIMIT REACHED\n\nMaximum of 3 concurrent Active Strategies allowed. Please stop an existing strategy to add a new one.");
      return;
    }

    // Case 3: Pay-to-Scale Logic (Slot 2 & 3 require Deposit)
    if (currentTraders.length >= 1 && !user.hasDeposited) {
      alert("🔒 MULTI-STRATEGY ACCESS LOCKED\n\nFree Tier is limited to 1 Active Strategy.\n\nTo run multiple simultaneous strategies (Diversification Protocol), you must verify your wallet with a Security Deposit ($500+).");
      navigateToDashboard(); // Go to dashboard so they see the Deposit screen
      return;
    }

    // Case 4: Success -> Add Trader
    const updatedTraders = [...currentTraders, trader];
    const updatedUser = authService.updateUser({ activeTraders: updatedTraders });
    
    if (updatedUser) {
      setUser(updatedUser);
      navigateToDashboard();
    }
  };

  const scrollToTraders = () => {
    traderSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      return true; 
    }
    return false;
  };

  const handleGlobalShare = () => {
    const refLink = `${window.location.origin}/join?ref=${user?.email.split('@')[0] || 'elite'}`;
    const text = `🔥 Join CopyTrade now! Get a $1,000 sign-up bonus instantly. If you use my link, I get a $500 referral bonus too! 💸 Let's grow wealth together: \n\n${refLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-pink-500/30 overflow-x-hidden bg-[#131722] relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* PULL-TO-REFRESH INDICATOR */}
      <div 
        className="absolute left-0 right-0 z-[100] flex justify-center pointer-events-none transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance - 60}px)`, opacity: pullDistance / threshold }}
      >
        <div className={`bg-[#1e222d] border border-[#f01a64]/30 p-3 rounded-full shadow-[0_0_20px_rgba(240,26,100,0.3)] flex items-center justify-center ${isRefreshing ? 'animate-neural-spin' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f01a64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        {pullDistance >= threshold && !isRefreshing && (
          <span className="absolute top-14 text-[8px] font-black text-[#f01a64] uppercase tracking-[0.3em] whitespace-nowrap animate-pulse">
            RELEASE TO SYNC
          </span>
        )}
        {isRefreshing && (
          <span className="absolute top-14 text-[8px] font-black text-[#00b36b] uppercase tracking-[0.3em] whitespace-nowrap">
            SYNCING MARKETS...
          </span>
        )}
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
      
      {/* GLOBAL FOMO FEED */}
      <LiveActivityFeed />

      <main 
        className={`flex-grow transition-all duration-300 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
        style={{ transform: `translateY(${pullDistance * 0.5}px)` }}
      >
        {view === 'landing' ? (
          <>
            <Hero onJoinClick={() => setShowSignup(true)} onInstallRequest={handleInstallClick} onStartJourney={scrollToTraders} />
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

      {/* FLOATING ACTION BUTTONS - High Z-Index & Raised Position for Mobile Safety */}
      <div className="fixed bottom-8 right-4 md:bottom-10 md:right-8 flex flex-col gap-4 z-[90]">
        
        {/* REFERRAL BUTTON WITH PULSE RING */}
        <div className="relative group">
          <div className="absolute inset-0 bg-[#0088cc] rounded-full animate-ping opacity-20"></div>
          <button 
            onClick={handleGlobalShare}
            className="relative w-14 h-14 md:w-16 md:h-16 bg-[#0088cc] hover:bg-[#0077b5] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,136,204,0.5)] transition-transform hover:scale-110 z-10 animate-bounce"
            title="Share & Earn $500"
          >
            <svg className="h-6 w-6 md:h-7 md:w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 8.146l-2.003 9.442c-.149.659-.537.818-1.089.508l-3.048-2.247-1.47 1.415c-.162.162-.299.3-.612.3l.219-3.106 5.651-5.108c.245-.219-.054-.341-.379-.126l-6.985 4.4-3.007-.941c-.654-.203-.667-.654.137-.967l11.75-4.529c.544-.203 1.02.123.836.761z"/>
            </svg>
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0088cc] text-white text-[10px] font-black rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
              EARN $500
            </div>
          </button>
        </div>

        <button 
          onClick={() => window.open('https://t.me/MentorwithZuluTrade_bot', '_blank')}
          className="w-12 h-12 md:w-14 md:h-14 bg-[#0088cc] hover:bg-[#0077b5] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 group relative border border-white/20"
          title="Mentor Bot"
        >
          <svg className="h-6 w-6 md:h-7 md:w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.27l-1.56 7.42c-.116.545-.44.68-.895.425l-2.37-1.75-1.145 1.1c-.125.127-.23.234-.473.234l.17-2.42 4.41-3.98c.19-.17-.04-.26-.297-.09l-5.45 3.43-2.34-.73c-.51-.16-.52-.51.107-.756l9.15-3.53c.42-.15.79.1.663.667z"/>
          </svg>
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#0088cc] text-white text-[9px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">MENTOR BOT</span>
        </button>

        <button 
          onClick={() => { setShowAI(!showAI); setShowSupport(false); }}
          className="w-12 h-12 md:w-14 md:h-14 bg-[#f01a64] hover:bg-pink-700 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 group relative"
          title="Market Oracle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#f01a64] text-white text-[9px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">MARKET ORACLE</span>
        </button>
      </div>

      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
      {showSupport && <SupportBot onClose={() => setShowSupport(false)} />}
      
      {showSignup && (
        <SignupModal 
          onClose={() => setShowSignup(false)} 
          onSuccess={handleLoginSuccess}
        />
      )}

      {showGallery && (
        <SuccessGallery onClose={() => setShowGallery(false)} />
      )}
    </div>
  );
};

export default App;
