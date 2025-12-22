
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, authService } from '../services/authService';
import { verifyPaymentProof } from '../services/geminiService';
import { Trader } from '../types';
import HolographicGuide from './HolographicGuide';

interface DashboardProps {
  user: UserProfile;
  onUserUpdate: (u: UserProfile) => void;
  onSwitchTrader: () => void;
}

const INVESTMENT_PLANS = [
  { id: 1, name: 'AI Flash Scalp', duration: '30 Seconds', durationMs: 30000, minRet: 20, maxRet: 25, risk: 'Low', minInvest: 500, vip: false },
  { id: 2, name: 'Rapid Momentum', duration: '1 Minute', durationMs: 60000, minRet: 30, maxRet: 40, risk: 'Medium', minInvest: 1000, vip: false },
  { id: 3, name: 'VIP Turbo Swing', duration: '5 Minutes', durationMs: 300000, minRet: 60, maxRet: 80, risk: 'Medium', minInvest: 2500, vip: true },
  { id: 4, name: 'Elite Market Maker', duration: '1 Hour', durationMs: 3600000, minRet: 120, maxRet: 150, risk: 'High', minInvest: 5000, vip: true },
  { id: 5, name: 'Whale Cycle (Pro)', duration: '4 Hours', durationMs: 14400000, minRet: 300, maxRet: 400, risk: 'High', minInvest: 10000, vip: true },
];

const NETWORKS = [
  { id: 'trc20', name: 'USDT (TRC-20)', address: '0x7592766391918c7d3E7F8Ae72D97e98979F25302' },
  { id: 'erc20', name: 'USDT (ERC-20)', address: '0x91F25302Ae72D97e989797592766391918c7d3E7' },
  { id: 'bep20', name: 'BNB (BEP-20)', address: '0x6991Bd59A34D0B2819653888f6aaAEf004b780ca' } 
];

type TradeStatus = 'idle' | 'bridging' | 'filling' | 'live' | 'completed';
type WithdrawStage = 'idle' | 'connecting' | 'verifying' | 'retrying' | 'error' | 'success';

/** 
 * Realistic Data Stream Component for Terminal 
 * Simulates a professional decoding/fetching effect
 */
const DecodingLine: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = '!@#$%^&*()_+{}:"<>?|';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
        if (index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

  return <div className="truncate">{displayText}</div>;
};

const TerminalLog: React.FC<{ logs: string[] }> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="font-mono text-[9px] md:text-[10px] leading-relaxed text-[#00b36b] h-full overflow-hidden flex flex-col justify-end">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-2 opacity-80">
          <span className="text-gray-600">[{new Date().toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
          <DecodingLine text={log} />
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ user, onUserUpdate, onSwitchTrader }) => {
  const [copied, setCopied] = useState(false);
  const [affiliateCopied, setAffiliateCopied] = useState(false);
  
  const activeTraders = user.activeTraders || [];
  const [focusedTraderId, setFocusedTraderId] = useState<string | null>(activeTraders.length > 0 ? activeTraders[0].id : null);

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'failed'>('idle');
  const [auditMessage, setAuditMessage] = useState<string>('');
  const [txId, setTxId] = useState('');
  const [timeLeft, setTimeLeft] = useState(1799); 

  const [withdrawStage, setWithdrawStage] = useState<WithdrawStage>('idle');
  const [withdrawLogs, setWithdrawLogs] = useState<string[]>([]);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const [aiPulse, setAiPulse] = useState<{sentiment: string, score: number, brief: string} | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]); 
  
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(500);
  const [isInvesting, setIsInvesting] = useState(false);
  
  const [activeTrade, setActiveTrade] = useState<{planName: string, amount: number, progress: number} | null>(null);
  const [tradeStatus, setTradeStatus] = useState<TradeStatus>('idle');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [livePnL, setLivePnL] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);

  const [isSyncing, setIsSyncing] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  
  const [signalStage, setSignalStage] = useState<'idle' | 'running' | 'locked'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const depositSectionRef = useRef<HTMLDivElement>(null);

  const [depositNetwork, setDepositNetwork] = useState(NETWORKS[0]);

  const getHudStep = () => {
    if (tradeStatus === 'completed') return 'profit';
    if (isInvesting) return 'investing';
    if (selectedPlanId && !isInvesting) return 'ready';
    if (!user.hasDeposited && activeTraders.length > 0) return 'deposit_needed';
    if (activeTraders.length === 0) return 'init';
    return 'ready';
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleDisconnect = (e: React.MouseEvent, traderId: string) => {
    e.stopPropagation();
    const confirm = window.confirm("Terminate this copy-trading node?");
    if (confirm) {
        const updatedTraders = activeTraders.filter(t => t.id !== traderId);
        const updatedUser = authService.updateUser({ activeTraders: updatedTraders });
        if(updatedUser) onUserUpdate(updatedUser);
        if (focusedTraderId === traderId) {
            setFocusedTraderId(updatedTraders.length > 0 ? updatedTraders[0].id : null);
        }
    }
  };

  const handleAddNodeClick = () => {
    if (activeTraders.length >= 1 && !user.hasDeposited) {
        alert("🔒 BANDWIDTH LIMITED\n\nAdditional slots require Mainnet verification (Deposit $500+).");
        depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    onSwitchTrader();
  };

  const handleSignalUpdate = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    setSignalStage('running');
    setAiPulse(null);
    setExecutionLogs([]);

    const tradingLogs = [
      "INITIALIZING: Market Data Fetcher...",
      "FETCH: Binance_BTCUSDT_Depth...",
      "FETCH: Coinbase_BTCUSD_Tape...",
      "CALC: RSI_14_M15_Standard...",
      "SYNC: Order_Flow_Imbalance_0.8...",
      "SCAN: Liquidity_Pools_Global...",
      "VERIFY: Institutional_Accum_Zones...",
      "NODE: Zulu_Alpha_Replication_ON...",
      "WEIGHTED_AVG_CROSS: Detected...",
      "SIGNAL: Confidence_Verified_96.4%",
      "TERMINAL: Ready for Deployment."
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < tradingLogs.length) {
        setExecutionLogs(prev => [...prev, tradingLogs[step]]);
        step++;
      } else {
        clearInterval(interval);
        setAiPulse({
          sentiment: "STRONG BUY",
          score: 96.4,
          brief: "• ASSET: Gold / BTC Correlation\n• ACTION: Aggressive Accumulation\n• TARGET: Institutional Liquidity Zone\n• STRATEGY: Zulu Replication Active"
        });
        setSignalStage('idle');
        setIsAiLoading(false);
      }
    }, 350);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (['4451', '7777', '2025', 'ZULU'].includes(pinInput.toUpperCase())) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
      setTimeout(() => setPinError(false), 500);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(depositNetwork.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAffiliateCopy = () => {
    const refLink = 'http://t.me/MentorwithZuluTrade_bot';
    navigator.clipboard.writeText(refLink);
    setAffiliateCopied(true);
    setTimeout(() => setAffiliateCopied(false), 2000);
  };

  const handleTelegramShare = () => {
    const refLink = `${window.location.origin}/join?ref=${user?.email.split('@')[0]}`;
    const text = `🔥 Growing capital with CopyTrade. Join for $1,000 bonus! 👇\n\n${refLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadStatus('uploading');
      setAuditMessage('Syncing with Explorer...');
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const result = await verifyPaymentProof(base64String, file.type);
        if (result.is_valid && result.detected_amount >= 500) {
          setUploadStatus('success');
          setAuditMessage(`Verified: ${result.detected_amount.toLocaleString()} USDT credited.`);
          setIsSyncing(true);
          const updated = authService.updateUser({ 
            hasDeposited: true,
            balance: (authService.getUser()?.balance || 0) + result.detected_amount 
          });
          if (updated) onUserUpdate(updated);
          setTimeout(() => setIsSyncing(false), 2000);
        } else {
          setUploadStatus('failed');
          setAuditMessage("Audit Failed: Receipt Invalid or Amount too low.");
          setTimeout(() => setUploadStatus('idle'), 5000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAddress.trim() || !amount || amount <= 0) return;
    if (amount > user.balance) {
        alert("Insufficient balance.");
        return;
    }
    setWithdrawStage('connecting');
    setWithdrawLogs(['> INITIALIZING...', '> ENCRYPTING PACKETS...', '> ROUTING...']);
    setTimeout(() => {
        setWithdrawStage('retrying');
        setWithdrawLogs(prev => [...prev, '> LATENCY DETECTED...', '> RE-ROUTING...']);
        setTimeout(() => {
            if (!user.hasDeposited) {
                setWithdrawStage('error');
                setWithdrawLogs(prev => [...prev, '> ERROR 909: SECURITY DEPOSIT REQUIRED']);
            } else {
                setWithdrawStage('success');
                setWithdrawLogs(prev => [...prev, '> SUCCESS: FUNDS DISPATCHED']);
                const newBal = user.balance - amount;
                const updated = authService.updateUser({ balance: newBal });
                if(updated) onUserUpdate(updated);
            }
        }, 2500);
    }, 2000); 
  };

  const handlePlanSelection = (planId: number) => {
    if (isInvesting) return;
    const plan = INVESTMENT_PLANS.find(p => p.id === planId);
    if (plan?.vip && !user.hasDeposited) {
      alert("🔒 VIP ACCESS DENIED: Deposit $500+ to unlock.");
      depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setSelectedPlanId(planId);
  };

  const startInvestment = () => {
    if (!user || selectedPlanId === null) return;
    const plan = INVESTMENT_PLANS.find(p => p.id === selectedPlanId);
    if (!plan || investAmount < plan.minInvest) return;
    
    const currentU = authService.getUser();
    if (!currentU || currentU.balance < investAmount) {
      depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    onUserUpdate(authService.updateUser({ 
      balance: currentU.balance - investAmount,
      totalInvested: currentU.totalInvested + investAmount
    })!);

    setIsInvesting(true);
    setTradeStatus('bridging');
    setTerminalLogs([`> INIT_EXECUTION_P${plan.id}`, `> ALLOCATING ${investAmount} USDT...`]);
    setActiveTrade({ planName: plan.name, amount: investAmount, progress: 0 });

    let step = 0;
    const bridgeInterval = setInterval(() => {
      step++;
      if (step === 1) setTerminalLogs(prev => [...prev, `> VALIDATING HASH...`]);
      if (step === 2) setTerminalLogs(prev => [...prev, `> BRIDGE: ESTABLISHED`]);
      if (step === 3) setTerminalLogs(prev => [...prev, `> POOL_ID: 0x Zulu`]);
      if (step === 4) {
        clearInterval(bridgeInterval);
        setTradeStatus('filling');
        setEntryPrice(64000 + Math.random() * 500);
        setTimeout(() => {
          setTradeStatus('live');
          startLiveTicker(plan, investAmount);
        }, 1500);
      }
    }, 600);
  };

  const startLiveTicker = (plan: typeof INVESTMENT_PLANS[0], amount: number) => {
    const roiFactor = (Math.random() * (plan.maxRet - plan.minRet) + plan.minRet) / 100;
    const targetProfit = amount * roiFactor;
    const animationDuration = 12000;
    let elapsed = 0;
    const tickInterval = setInterval(() => {
      elapsed += 100;
      const progress = Math.min(elapsed / animationDuration, 1);
      setLivePnL(progress < 0.2 ? -amount * 0.02 * Math.sin(progress * 10) : targetProfit * Math.pow(progress, 2));
      setActiveTrade(prev => prev ? { ...prev, progress: progress * 100 } : null);
      if (elapsed >= animationDuration) {
        clearInterval(tickInterval);
        finalizeTrade(amount, targetProfit);
      }
    }, 100);
  };

  const finalizeTrade = (principal: number, profit: number) => {
    setTradeStatus('completed');
    const u = authService.getUser();
    if (!u) return;
    onUserUpdate(authService.updateUser({
      balance: u.balance + principal + profit,
      totalInvested: Math.max(0, u.totalInvested - principal),
      wins: u.wins + 1
    })!);
    setTimeout(() => {
      setIsInvesting(false);
      setTradeStatus('idle');
      setSelectedPlanId(null);
    }, 3000);
  };

  return (
    <div className="bg-[#131722] min-h-screen pt-4 pb-32 px-4 sm:px-6 lg:px-8 relative">
      <HolographicGuide step={getHudStep()} />

      {showBonus && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in">
           <div className="bg-[#1e222d] border-2 border-[#f01a64] w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-white uppercase italic">CONGRATS!</h2>
              <p className="text-gray-300 font-bold text-sm">
                You won <span className="text-[#00b36b] text-xl">$1,000</span> for joining! Use this credit to follow leaders.
              </p>
              <button onClick={() => setShowBonus(false)} className="w-full bg-[#f01a64] text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs">START TRADING</button>
           </div>
        </div>
      )}

      {!isUnlocked && (
        <div className="fixed inset-0 z-[100] backdrop-blur-3xl bg-black/80 flex items-center justify-center p-4">
          <div className={`bg-[#1e222d] border border-[#2a2e39] w-full max-w-sm rounded-[2.5rem] p-8 text-center space-y-6 ${pinError ? 'animate-shake' : 'animate-in zoom-in-95'}`}>
            <h2 className="text-lg font-black text-white uppercase tracking-tighter">Enter Terminal Code</h2>
            <form onSubmit={handleUnlock} className="space-y-6">
              <input type="text" maxLength={4} value={pinInput} autoFocus onChange={(e) => setPinInput(e.target.value)} placeholder="CODE" className="w-full bg-[#131722] border-2 border-[#2a2e39] rounded-2xl py-4 text-center text-3xl font-black text-white uppercase tracking-[0.3em] placeholder:tracking-normal" />
              <button type="submit" className="w-full bg-[#f01a64] text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs">Activate Node</button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="overflow-x-auto no-scrollbar pb-2">
          <div className="flex gap-4">
             {activeTraders.map((trader, idx) => (
                <div 
                  key={trader.id}
                  onClick={() => setFocusedTraderId(trader.id)}
                  className={`relative w-72 p-4 rounded-2xl border-2 transition-all cursor-pointer ${focusedTraderId === trader.id ? 'bg-[#1e222d] border-[#f01a64] shadow-xl' : 'bg-[#131722] border-[#2a2e39] opacity-70'}`}
                >
                   <div className="flex items-center gap-4">
                      <img src={trader.avatar} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                         <h4 className="text-white font-black text-xs uppercase truncate">{trader.name}</h4>
                         <span className="text-[9px] text-[#00b36b] font-black uppercase tracking-widest bg-[#00b36b]/10 px-1.5 rounded">CONNECTED</span>
                      </div>
                   </div>
                   <div className="mt-4 flex justify-between items-end">
                      <span className="text-lg font-black text-[#00b36b]">+{trader.roi}%</span>
                      <button onClick={(e) => handleDisconnect(e, trader.id)} className="text-[8px] font-black text-red-500 uppercase">Terminate</button>
                   </div>
                </div>
             ))}
             {Array.from({ length: 3 - activeTraders.length }).map((_, idx) => (
                <div key={idx} onClick={handleAddNodeClick} className="w-72 p-4 rounded-2xl border-2 border-dashed border-[#2a2e39] bg-[#131722] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#f01a64]">
                   <span className="text-[10px] font-black uppercase text-gray-500">Empty Slot</span>
                </div>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl relative">
            <span className="text-[8px] text-gray-500 font-black uppercase block mb-1">Balance</span>
            <span className="text-xl sm:text-2xl font-black text-[#00b36b] block">${user.balance.toLocaleString()}</span>
            <button onClick={() => setIsUnlocked(false)} className="absolute top-3 right-3 text-gray-700 hover:text-[#f01a64]"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></button>
          </div>
          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl">
            <span className="text-[8px] text-gray-500 font-black uppercase block mb-1">In Play</span>
            <span className="text-xl sm:text-2xl font-black text-white block">${user.totalInvested.toLocaleString()}</span>
          </div>
          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl">
            <span className="text-[8px] text-gray-500 font-black uppercase block mb-1">Node Analytics</span>
            <span className="text-xl font-black text-[#00b36b]">{user.wins} <span className="text-gray-500">/</span> <span className="text-red-500">{user.losses}</span></span>
          </div>
          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl flex flex-col justify-center text-center cursor-pointer" onClick={onSwitchTrader}>
            <span className="text-[10px] font-black text-[#00b36b] uppercase">{activeTraders.length} Nodes Online</span>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#2a2e39] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <div className="p-8 border-b md:border-b-0 md:border-r border-[#2a2e39] bg-[#131722]/50 w-full md:w-64 flex flex-col items-center">
               <div className="w-24 h-24 rounded-full border-4 border-[#2a2e39] flex items-center justify-center relative mb-6">
                  <span className={`text-2xl font-black ${aiPulse ? 'text-[#00b36b]' : 'text-gray-700'}`}>{aiPulse ? aiPulse.score : '--'}%</span>
                  <div className={`absolute inset-0 border-4 ${aiPulse ? 'border-[#00b36b]' : 'border-transparent'} rounded-full animate-pulse`}></div>
               </div>
               <button onClick={handleSignalUpdate} disabled={signalStage !== 'idle'} className="w-full py-4 bg-[#f01a64] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-50">
                  {signalStage === 'idle' ? 'SCAN SIGNAL' : 'SCANNING...'}
               </button>
            </div>
            <div className="flex-1 p-8 bg-black/40 font-mono text-xs">
               <div className="flex justify-between items-center mb-6 border-b border-[#2a2e39] pb-2 text-[#00b36b] opacity-60">
                  <span>TERMINAL: FEED_STREAM</span>
                  <span>SYNC_ACTIVE</span>
               </div>
               <div className="min-h-[140px]">
                  {signalStage === 'running' && <TerminalLog logs={executionLogs} />}
                  {aiPulse && signalStage === 'idle' && (
                     <div className="space-y-3 animate-in fade-in">
                        <div className="text-lg font-black text-[#00b36b]">{aiPulse.sentiment}</div>
                        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{aiPulse.brief}</div>
                     </div>
                  )}
                  {!aiPulse && signalStage === 'idle' && (
                     <div className="flex h-full items-center justify-center text-gray-700 uppercase tracking-widest text-[10px]">Awaiting Uplink...</div>
                  )}
               </div>
            </div>
        </div>

        {isInvesting && (
          <div className="bg-[#0d1117] border-2 border-[#f01a64] rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
                <span className="text-[#f01a64] font-black text-xs uppercase tracking-widest">Live Strategy Deployment</span>
                <span className="text-gray-500 font-mono text-[10px]">HASH: {Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
             </div>
             <div className="text-center py-6">
                <div className={`text-5xl md:text-7xl font-black tabular-nums transition-all ${livePnL >= 0 ? 'text-[#00b36b]' : 'text-red-500'}`}>
                   {livePnL >= 0 ? '+' : ''}{livePnL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
                {tradeStatus === 'completed' && <div className="mt-4 text-[#00b36b] font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Equity Dispatched to Ledger</div>}
             </div>
             <div className="h-1.5 bg-[#1e222d] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${tradeStatus === 'completed' ? 'bg-[#00b36b]' : 'bg-[#f01a64]'}`} style={{ width: `${activeTrade?.progress || 0}%` }}></div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
             <h3 className="text-xl font-black text-white uppercase px-1">Institutional Plans</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INVESTMENT_PLANS.map(plan => (
                   <div key={plan.id} onClick={() => handlePlanSelection(plan.id)} className={`bg-[#1e222d] border-2 p-6 rounded-[2rem] cursor-pointer transition-all ${selectedPlanId === plan.id ? 'border-[#f01a64]' : 'border-[#2a2e39]'} ${plan.vip && !user.hasDeposited ? 'opacity-50 grayscale' : ''}`}>
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-white font-black text-xs uppercase">{plan.name}</span>
                         <span className="text-[#00b36b] text-[10px] font-black">+{plan.minRet}%</span>
                      </div>
                      <div className="flex justify-between items-end">
                         <span className="text-gray-500 text-[10px] uppercase font-bold">{plan.duration}</span>
                         <button className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase ${selectedPlanId === plan.id ? 'bg-[#f01a64] text-white' : 'bg-[#131722] text-[#f01a64]'}`}>SELECT</button>
                      </div>
                      {selectedPlanId === plan.id && (
                        <div className="mt-4 pt-4 border-t border-[#2a2e39] flex gap-2">
                           <input type="number" value={investAmount} onChange={e => setInvestAmount(Number(e.target.value))} className="flex-1 bg-[#131722] text-white text-xs p-2 rounded-xl" />
                           <button onClick={startInvestment} className="bg-[#00b36b] text-white px-4 py-2 rounded-xl font-black text-[10px]">START</button>
                        </div>
                      )}
                   </div>
                ))}
             </div>
          </div>
          <div ref={depositSectionRef} className="space-y-8">
             <div className="bg-[#1e222d] border border-[#2a2e39] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 bg-[#131722]/50 border-b border-[#2a2e39]">
                   <h3 className="text-lg font-black text-white uppercase mb-6">Security Deposit</h3>
                   <div className="flex gap-2 mb-4">
                      {NETWORKS.map(net => (
                        <button key={net.id} onClick={() => setDepositNetwork(net)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase border ${depositNetwork.id === net.id ? 'bg-[#f01a64] text-white border-[#f01a64]' : 'bg-[#131722] text-gray-500 border-[#2a2e39]'}`}>{net.id}</button>
                      ))}
                   </div>
                   <div className="bg-[#131722] p-6 rounded-2xl flex flex-col items-center border border-[#2a2e39]">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${depositNetwork.address}&color=f01a64&bgcolor=131722`} className="w-28 h-28 mb-4 rounded-xl" />
                      <button onClick={handleCopy} className="text-[9px] font-mono text-gray-400 break-all text-center hover:text-white transition-colors">{depositNetwork.address}</button>
                   </div>
                </div>
                <div className="p-8 space-y-4">
                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                   <button onClick={triggerUpload} className="w-full py-4 bg-[#f01a64] text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Upload & Verify</button>
                   {auditMessage && <p className="text-[8px] text-center text-gray-500 uppercase">{auditMessage}</p>}
                </div>
             </div>
             <div className="bg-[#1e222d] border border-[#2a2e39] p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-lg font-black text-white uppercase mb-6 text-center">Withdraw Funds</h3>
                <input type="text" value={withdrawAddress} onChange={e => setWithdrawAddress(e.target.value)} placeholder="Recipient Address" className="w-full bg-[#131722] p-4 rounded-xl text-xs text-white mb-4" />
                <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="Amount" className="w-full bg-[#131722] p-4 rounded-xl text-xs text-white mb-6" />
                <button onClick={handleWithdraw} className="w-full py-4 bg-[#f01a64] text-white rounded-2xl font-black uppercase text-[10px]">Initiate Payout</button>
                {withdrawLogs.length > 0 && (
                  <div className="mt-4 p-4 bg-black/40 rounded-xl font-mono text-[9px] h-32 overflow-y-auto space-y-1">
                     {withdrawLogs.map((log, i) => <div key={i} className="text-gray-400">{log}</div>)}
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
