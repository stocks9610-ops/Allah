import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, authService } from '../services/authService';
import { verifyPaymentProof } from '../services/geminiService';
import TacticalGuide from './TacticalGuide';

interface DashboardProps {
  user: UserProfile;
  onUserUpdate: (u: UserProfile) => void;
  onSwitchTrader: () => void;
}

const PROFIT_STRATEGIES = [
  { id: 1, name: 'Instant Copy Plan', tag: 'Limited Slots', hook: 'Copy winning traders instantly', duration: '30 Seconds', durationMs: 30000, minRet: 20, maxRet: 25, risk: 'Secure', minInvest: 500, vip: false },
  { id: 2, name: 'Auto-Profit Stream', tag: 'High Demand', hook: 'No experience needed — just copy profits', duration: '1 Minute', durationMs: 60000, minRet: 30, maxRet: 40, risk: 'Secure', minInvest: 1000, vip: false },
  { id: 3, name: 'VIP Alpha Bridge', tag: 'Elite Access', hook: 'Follow top traders and earn automatically', duration: '5 Minutes', durationMs: 300000, minRet: 60, maxRet: 80, risk: 'Sovereign', minInvest: 2500, vip: true },
  { id: 4, name: 'Pro-Market Core', tag: 'Global Flow', hook: 'Mirror expert trades in real time', duration: '1 Hour', durationMs: 3600000, minRet: 120, maxRet: 150, risk: 'Sovereign', minInvest: 5000, vip: true },
  { id: 5, name: 'Whale Wealth Path', tag: 'Whale Only', hook: 'Let professionals trade for you', duration: '4 Hours', durationMs: 14400000, minRet: 300, maxRet: 400, risk: 'Whale Tier', minInvest: 10000, vip: true },
];

const NETWORKS = [
  { id: 'trc20', name: 'USDT (TRC-20)', address: 'TLY2M8F7p27z97E98979F25302979F25302' },
  { id: 'erc20', name: 'USDT (ERC-20)', address: '0x91F25302Ae72D97e989797592766391918c7d3E7' },
  { id: 'bep20', name: 'BNB (BEP-20)', address: '0x6991Bd59A34D0B2819653888f6aaAEf004b780ca' } 
];

const Dashboard: React.FC<DashboardProps> = ({ user, onUserUpdate, onSwitchTrader }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(500);
  const [isInvesting, setIsInvesting] = useState(false);
  
  const [tradeStage, setTradeStage] = useState<'idle' | 'syncing' | 'live' | 'completed'>('idle');
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [livePnL, setLivePnL] = useState(0);

  // Withdrawal States
  const [withdrawStep, setWithdrawStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawNetwork, setWithdrawNetwork] = useState('USDT TRC20');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  
  const depositSectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const [depositNetwork, setDepositNetwork] = useState(NETWORKS[0]);
  const [isVerifyingReceipt, setIsVerifyingReceipt] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Profit calculation logic: Total Balance - Signup Bonus (1000)
  const tradeProfit = Math.max(0, user.balance - 1000);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifyingReceipt(true);
    setVerificationStatus('Connecting to Exchange...');
    setVerificationError('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setVerificationStatus('Verifying Transaction...');
      await new Promise(r => setTimeout(r, 2000));
      setVerificationStatus('Confirming Receipt Legitimacy...');
      const result = await verifyPaymentProof(base64, file.type);
      
      if (result.is_valid && result.detected_amount > 0) {
        setVerificationStatus(`Success: $${result.detected_amount} Received.`);
        setTimeout(() => {
          onUserUpdate(authService.updateUser({ 
            balance: user.balance + result.detected_amount,
            hasDeposited: true 
          })!);
          setIsVerifyingReceipt(false);
          alert(`SUCCESS: $${result.detected_amount} added to your real-money balance.`);
        }, 1500);
      } else {
        setVerificationStatus('REJECTED');
        setVerificationError(result.summary || 'Receipt Analysis Failed.');
        setTimeout(() => {
           setIsVerifyingReceipt(false);
           setVerificationStatus('');
           setVerificationError('');
        }, 5000);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateWithdrawal = () => {
    setWithdrawError('');
    if (!withdrawAmount || Number(withdrawAmount) < 100) {
      setWithdrawError("Minimum withdrawal is $100");
      return;
    }
    if (!withdrawAddress || withdrawAddress.length < 20) {
      setWithdrawError("Please enter a valid wallet address");
      return;
    }
    if (!user.hasDeposited) {
      setWithdrawError("Pending security review: Please confirm your first deposit to activate payout channels.");
      return;
    }
    setWithdrawStep('confirm');
  };

  const confirmWithdrawal = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawStep('success');
    }, 2500);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert("SUCCESS: Your proof of receipt has been uploaded and shared with the Success Gallery!");
    }
  };

  const startDeployment = () => {
    const plan = PROFIT_STRATEGIES.find(p => p.id === selectedPlanId);
    if (!plan) return;
    
    if (user.balance < investAmount) {
      depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      alert("INSUFFICIENT_FUNDS: Please deposit to initialize this trading strategy.");
      return;
    }

    onUserUpdate(authService.updateUser({ 
      balance: user.balance - investAmount,
      totalInvested: user.totalInvested + investAmount
    })!);

    setIsInvesting(true);
    setTradeStage('syncing');
    setSyncLogs([
      "Connecting to market leader...",
      "Setting risk parameters...",
      "Trade synchronization in progress...",
      "Capital allocation confirmed."
    ]);
    
    let logIdx = 0;
    const interval = setInterval(() => {
      if (logIdx < 4) {
        logIdx++;
      } else {
        clearInterval(interval);
        setTradeStage('live');
        runLiveTrade(plan);
      }
    }, 850);
  };

  const runLiveTrade = (plan: typeof PROFIT_STRATEGIES[0]) => {
    const startTime = Date.now();
    const duration = plan.durationMs;
    
    const tick = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = (elapsed / duration) * 100;
      
      if (rawProgress >= 100) {
        setProgress(100);
        clearInterval(tick);
        finishTrade(plan);
      } else {
        setProgress(rawProgress);
        const roi = (plan.minRet + Math.random() * (plan.maxRet - plan.minRet)) / 100;
        setLivePnL(investAmount * roi * (rawProgress / 100));
      }
    }, 100);
  };

  const finishTrade = (plan: typeof PROFIT_STRATEGIES[0]) => {
    const profit = investAmount * ((plan.minRet + Math.random() * (plan.maxRet - plan.minRet)) / 100);
    onUserUpdate(authService.updateUser({
      balance: user.balance + investAmount + profit,
      totalInvested: Math.max(0, user.totalInvested - investAmount),
      wins: user.wins + 1
    })!);
    
    setTradeStage('completed');
    setTimeout(() => {
      setIsInvesting(false);
      setTradeStage('idle');
      setProgress(0);
      setLivePnL(0);
      setSelectedPlanId(null);
    }, 4000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositNetwork.address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1000);
  };

  const maskedAddress = (addr: string) => {
    if (addr.length < 10) return addr;
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 3)}`;
  };

  return (
    <div className="bg-[#131722] min-h-screen pt-4 pb-32 px-4 sm:px-6 lg:px-8 relative selection:bg-[#f01a64]/10">
      <TacticalGuide step={isInvesting ? 'investing' : tradeStage === 'completed' ? 'profit' : 'ready'} />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* REAL-WORLD TRADING STATUS HUD - Mobile Adaptive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-[#1e222d] border border-white/5 p-4 md:p-6 rounded-3xl shadow-xl hover:border-white/10 transition-all flex flex-col justify-center">
            <span className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1">Real Balance</span>
            <div className="flex flex-col">
              <span className={`text-lg md:text-2xl font-black tabular-nums ${user.hasDeposited ? 'text-[#00b36b]' : 'text-amber-500'}`}>
                ${user.balance.toLocaleString()}
              </span>
              {!user.hasDeposited && (
                <span className="text-[7px] md:text-[8px] font-black text-amber-600 uppercase tracking-widest mt-0.5 italic animate-pulse truncate">
                  Unverified
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#1e222d] border border-white/5 p-4 md:p-6 rounded-3xl shadow-xl hover:border-white/10 transition-all flex flex-col justify-center">
            <span className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1">In-Trade</span>
            <span className="text-lg md:text-2xl font-black text-white tabular-nums">${user.totalInvested.toLocaleString()}</span>
          </div>
          <div className="bg-[#1e222d] border border-white/5 p-4 md:p-6 rounded-3xl shadow-xl hover:border-white/10 transition-all flex flex-col justify-center">
            <span className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1">Total Profits</span>
            <span className="text-lg md:text-2xl font-black text-[#00b36b] tabular-nums">+${tradeProfit.toLocaleString()}</span>
          </div>
          <div className="bg-[#f01a64] p-4 md:p-6 rounded-3xl flex items-center justify-between cursor-pointer group hover:bg-pink-700 transition-all shadow-[0_10px_30px_rgba(240,26,100,0.3)] active:scale-95" onClick={() => depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="text-left">
              <span className="text-[7px] md:text-[8px] text-white/50 font-black uppercase tracking-widest block italic">Secure Funding</span>
              <span className="text-xs md:text-sm font-black text-white uppercase tracking-tight">Deposit</span>
            </div>
            <svg className="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </div>

        {/* PROFIT STRATEGIES SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <div className="flex justify-between items-end px-2">
                <div>
                   <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">Trading Strategies</h3>
                   <p className="text-[#f01a64] text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mt-1">Select a strategy to begin auto-trading</p>
                </div>
                <span className="hidden md:block text-[10px] text-[#00b36b] font-black uppercase tracking-widest">Active Channels: High</span>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROFIT_STRATEGIES.map(plan => (
                   <div 
                     key={plan.id} 
                     onClick={() => {
                        if (isInvesting) return;
                        if (plan.vip && !user.hasDeposited) {
                           depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                           alert("🔒 DEPOSIT REQUIRED: Please confirm your first deposit to activate this elite strategy.");
                           return;
                        }
                        setSelectedPlanId(plan.id);
                     }}
                     className={`relative bg-[#1e222d] border-2 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] cursor-pointer transition-all group overflow-hidden active:scale-[0.98] ${selectedPlanId === plan.id ? 'border-[#f01a64] bg-[#1a1d26]' : 'border-white/5 hover:border-white/10'}`}
                   >
                      <div className="absolute top-4 right-6 text-[7px] md:text-[8px] bg-[#f01a64] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-lg">
                        {plan.tag}
                      </div>
                      
                      <div className="mb-4 md:mb-6">
                         <h4 className="text-white font-black text-base md:text-lg uppercase tracking-tight mb-1">{plan.name}</h4>
                         <p className="text-[9px] md:text-[10px] text-gray-500 font-bold leading-tight uppercase tracking-widest">{plan.hook}</p>
                      </div>

                      <div className="flex justify-between items-end">
                         <div>
                            <span className="text-[9px] md:text-[10px] text-[#00b36b] font-black tracking-tighter text-lg md:text-xl">ROI: {plan.minRet}-{plan.maxRet}%</span>
                            <span className="text-[8px] md:text-[9px] text-gray-600 font-black uppercase tracking-widest block mt-1">{plan.duration} Window</span>
                         </div>
                         <div className="text-right">
                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlanId === plan.id ? 'border-[#f01a64] bg-[#f01a64]' : 'border-white/10'}`}>
                               {selectedPlanId === plan.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                         </div>
                      </div>

                      {selectedPlanId === plan.id && !isInvesting && (
                        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/5 space-y-4 md:space-y-6 animate-in fade-in duration-300">
                           <div className="flex flex-col gap-2">
                              <span className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest">Trade Amount (USDT)</span>
                              <div className="flex gap-2 md:gap-3">
                                 <input 
                                   type="number" 
                                   value={investAmount} 
                                   onChange={e => setInvestAmount(Number(e.target.value))} 
                                   className="flex-1 bg-black border border-white/10 text-white text-sm p-3 md:p-4 rounded-xl md:rounded-2xl focus:border-[#f01a64] outline-none font-black" 
                                 />
                                 <button onClick={startDeployment} className="bg-[#f01a64] hover:bg-pink-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Start</button>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                ))}
             </div>
          </div>

          {/* DEPOSIT & WITHDRAWAL COLUMN */}
          <div className="space-y-6">
             {/* DEPOSIT SECTION */}
             <div ref={depositSectionRef} className="bg-[#1e222d] border border-white/5 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="p-8 md:p-10 bg-black/20">
                   <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tighter mb-4">Deposit (Funding)</h3>
                   <div className="space-y-2 mb-6 md:mb-8">
                      <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-relaxed">
                         1. Copy address below.<br/>
                         2. Send USDT via your wallet.<br/>
                         3. Upload receipt to verify.
                      </p>
                   </div>
                   <div className="flex gap-2 mb-6 md:mb-8">
                      {NETWORKS.map(net => (
                        <button key={net.id} onClick={() => setDepositNetwork(net)} className={`flex-1 py-2.5 md:py-3 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border transition-all ${depositNetwork.id === net.id ? 'bg-[#f01a64] text-white border-[#f01a64]' : 'bg-transparent text-gray-500 border-white/5 hover:border-white/10'}`}>{net.id}</button>
                      ))}
                   </div>
                   <div className="bg-black/60 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 flex flex-col items-center gap-4 md:gap-6">
                      <div className="text-center space-y-3 w-full">
                        <span className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase tracking-widest italic">Direct Funding Address</span>
                        <div className="bg-[#0f1116] border border-[#f01a64]/20 p-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-mono text-white break-all leading-tight font-black select-all shadow-inner">
                          {depositNetwork.address}
                        </div>
                        <button 
                          onClick={handleCopyAddress}
                          className={`w-full py-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${copySuccess ? 'bg-[#00b36b] text-white border-[#00b36b]' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95'}`}
                        >
                          {copySuccess ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                              COPIED!
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                              Copy Address
                            </>
                          )}
                        </button>
                      </div>
                   </div>
                </div>
                <div className="p-8 md:p-10 pt-0">
                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                   {isVerifyingReceipt ? (
                      <div className={`p-5 md:p-6 rounded-2xl border transition-all space-y-4 ${verificationError ? 'bg-red-500/10 border-red-500/40' : 'bg-[#00b36b]/10 border-[#00b36b]/40'}`}>
                         <div className="flex items-center gap-3">
                            {!verificationError && <div className="w-2 h-2 bg-[#00b36b] rounded-full animate-ping"></div>}
                            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${verificationError ? 'text-red-500' : 'text-white'}`}>
                              {verificationStatus}
                            </span>
                         </div>
                         {verificationError ? (
                            <p className="text-[8px] md:text-[9px] text-red-400 font-bold uppercase italic leading-tight">{verificationError}</p>
                         ) : (
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-[#00b36b] animate-[progress_2s_ease-in-out_infinite] w-1/3"></div>
                            </div>
                         )}
                      </div>
                   ) : (
                      <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 md:py-5 bg-[#f01a64] text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-[11px] shadow-2xl hover:bg-pink-700 active:scale-95 transition-all">Upload Receipt</button>
                   )}
                </div>
             </div>

             {/* WITHDRAW MONEY SECTION */}
             <div className="bg-[#1e222d] border border-white/5 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl space-y-6 md:space-y-8">
                <div className="text-center">
                   <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tighter">Withdraw Money</h3>
                   <div className="flex justify-center items-center gap-4 mt-2">
                     <span className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase tracking-widest">Balance: <span className="text-white">${user.balance.toLocaleString()}</span></span>
                     <span className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase tracking-widest">Min: <span className="text-white">$100</span></span>
                   </div>
                </div>

                {withdrawStep === 'input' && (
                  <div className="space-y-3 md:space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-1">
                      <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest ml-1">Network</label>
                      <select 
                        value={withdrawNetwork} 
                        onChange={e => setWithdrawNetwork(e.target.value)}
                        className="w-full bg-black border border-white/5 p-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs text-white outline-none focus:border-[#f01a64] font-black appearance-none"
                      >
                        <option>USDT TRC20</option>
                        <option>USDT BEP20</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest ml-1">Wallet Address</label>
                      <input 
                        type="text" 
                        placeholder="Recipient address" 
                        value={withdrawAddress} 
                        onChange={e => setWithdrawAddress(e.target.value)} 
                        className="w-full bg-black border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl text-[10px] md:text-xs text-white outline-none focus:border-[#f01a64] font-black" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest ml-1">Amount (USDT)</label>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={withdrawAmount} 
                        onChange={e => setWithdrawAmount(e.target.value)} 
                        className="w-full bg-black border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl text-[10px] md:text-xs text-white outline-none focus:border-[#f01a64] font-black" 
                      />
                      <p className="text-[7px] text-gray-600 font-bold uppercase mt-1 text-right">Fee: $1.00</p>
                    </div>

                    {withdrawError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-[8px] md:text-[9px] text-red-500 font-black uppercase tracking-tight text-center leading-relaxed italic">{withdrawError}</p>
                      </div>
                    )}

                    <button 
                      onClick={validateWithdrawal}
                      className="w-full py-4 md:py-5 bg-[#00b36b] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest shadow-2xl active:scale-95 transition-all"
                    >
                      Withdraw Funds
                    </button>
                  </div>
                )}

                {withdrawStep === 'confirm' && (
                  <div className="space-y-4 md:space-y-6 animate-in zoom-in-95">
                    <div className="bg-black/40 border border-white/10 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] space-y-3 md:space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase">Amount</span>
                          <span className="text-xs md:text-sm font-black text-white">${withdrawAmount}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase">Network</span>
                          <span className="text-[9px] md:text-[10px] font-black text-[#00b36b]">{withdrawNetwork}</span>
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase">Address</span>
                          <span className="text-[9px] md:text-[10px] font-black text-white font-mono break-all">{withdrawAddress}</span>
                       </div>
                    </div>

                    <div className="flex gap-2 md:gap-3">
                      <button onClick={() => setWithdrawStep('input')} className="flex-1 py-3 md:py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[8px] md:text-[9px] font-black uppercase">Edit</button>
                      <button 
                        onClick={confirmWithdrawal} 
                        disabled={isWithdrawing}
                        className="flex-[2] py-3 md:py-4 bg-[#f01a64] text-white rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl disabled:opacity-50 active:scale-95"
                      >
                        {isWithdrawing ? 'Processing...' : 'Confirm'}
                      </button>
                    </div>
                  </div>
                )}

                {withdrawStep === 'success' && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="bg-[#00b36b]/10 border border-[#00b36b]/30 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-center space-y-4">
                       <div className="w-12 h-12 md:w-16 md:h-16 bg-[#00b36b] rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_30px_rgba(0,179,107,0.4)]">
                          <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                       </div>
                       <div className="space-y-1">
                         <h4 className="text-white font-black text-sm uppercase">Submitted</h4>
                         <p className="text-[#00b36b] text-[8px] md:text-[9px] font-black uppercase tracking-widest">Processing on exchange network</p>
                       </div>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-black/20 rounded-2xl border border-white/5">
                      <p className="text-[10px] md:text-[11px] text-gray-400 font-medium text-center leading-relaxed mb-6 italic">
                        "Your payment will take ~59 min to arrive. Once received, upload your screenshot to confirm successful payout."
                      </p>
                      
                      <input type="file" ref={proofInputRef} onChange={handleProofUpload} className="hidden" accept="image/*" />
                      <button 
                        onClick={() => proofInputRef.current?.click()}
                        className="w-full py-3.5 md:py-4 bg-[#0088cc] text-white rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95"
                      >
                         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" /></svg>
                         Upload Payout Proof
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-2 opacity-30 mt-4">
                   <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#00b36b]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                   <span className="text-[7px] md:text-[8px] text-gray-400 font-black uppercase tracking-[0.2em]">Real-World Exchange Hub</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;