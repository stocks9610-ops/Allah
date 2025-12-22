
import React, { useState } from 'react';
import { authService, UserProfile, BUILD_ID } from '../services/authService';

interface SignupModalProps {
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (isLogin) {
      if (!email || !password) {
        alert("Please enter email and password to login.");
        setIsSubmitting(false);
        return;
      }
      const user = await authService.login(email, password);
      if (user) {
        onSuccess(user);
      } else { 
        alert("Invalid login credentials."); 
        setIsSubmitting(false); 
      }
    } else {
      // ACCOUNT CREATION LOGIC
      const timestamp = Date.now().toString().slice(-6);
      const finalEmail = email.trim() || `trader_${timestamp}@copytrade.com`;
      const finalPassword = password.trim() || 'secure_access';
      const finalName = username.trim() || `Trader ${timestamp}`;

      const newUser: UserProfile = {
        username: finalName,
        email: finalEmail,
        password: finalPassword,
        phone: 'N/A',
        joinDate: new Date().toISOString(),
        balance: 1000, 
        hasDeposited: false, 
        wins: 0, 
        losses: 0, 
        totalInvested: 0,
        activeTraders: [],
        schemaVersion: BUILD_ID
      };

      const success = await authService.register(newUser);
      if (success) {
        onSuccess(newUser);
      } else { 
        alert("Account creation failed. Please try again."); 
        setIsSubmitting(false); 
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="bg-[#1e222d] w-full h-full sm:h-auto sm:max-w-md sm:rounded-[2.5rem] flex flex-col overflow-hidden animate-in zoom-in-95">
        <div className="p-6 md:p-10 overflow-y-auto no-scrollbar flex-1 pb-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
              {isLogin ? 'Member Access' : 'Create Account'}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-500 active:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Username</label>
                <input 
                  type="text" 
                  placeholder="e.g. CryptoKing" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-5 py-4 text-white focus:border-[#f01a64] font-bold text-sm outline-none placeholder:text-gray-600 transition-colors"
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">
                Email {isLogin ? '' : '(Optional)'}
              </label>
              <input 
                type="email" 
                placeholder={isLogin ? "Enter registered email" : "Auto-generated if empty"} 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-5 py-4 text-white focus:border-[#f01a64] font-bold text-sm outline-none placeholder:text-gray-600 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">
                Password {isLogin ? '' : '(Optional)'}
              </label>
              <input 
                type="password" 
                placeholder={isLogin ? "Enter password" : "Auto-generated if empty"} 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-5 py-4 text-white focus:border-[#f01a64] font-bold text-sm outline-none placeholder:text-gray-600 transition-colors"
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-[#f01a64] py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 hover:bg-pink-600 transition-all"
              >
                {isSubmitting ? 'Processing...' : isLogin ? 'Secure Login' : 'Start Trading'}
              </button>
            </div>

            <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-[10px] text-gray-500 font-black uppercase tracking-widest text-center py-4 hover:text-white transition-colors">
              {isLogin ? "New here? Create Account" : "Already have a profile? Login"}
            </button>
          </form>
          
          {!isLogin && (
            <p className="text-[9px] text-gray-600 text-center mt-4 leading-relaxed px-2">
              A secure trading session is created on this device. Your data is protected. <span className="text-gray-500 font-bold">Please do not clear your cache until you have completed your first withdrawal.</span> Recommended: Google Chrome.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
