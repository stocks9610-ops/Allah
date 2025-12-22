
import React, { useState, useEffect } from 'react';

const NAMES = ['Alex M.', 'Sarah K.', 'David R.', 'Wei L.', 'James B.', 'Maria G.', 'Ahmed H.', 'Elena P.', 'Chris T.', 'Sophie L.'];
const ACTIONS = [
  { type: 'withdraw', text: 'withdrew', asset: 'USDT (TRC-20)' },
  { type: 'trade', text: 'just won', asset: 'on BTC/USDT' },
  { type: 'deposit', text: 'deposited', asset: 'via TrustWallet' }
];

const LiveActivityFeed: React.FC = () => {
  const [notification, setNotification] = useState<{name: string, action: string, amount: string, asset: string} | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Initial delay
    const initialTimer = setTimeout(() => triggerNotification(), 3000);

    const loop = setInterval(() => {
      triggerNotification();
    }, Math.random() * 5000 + 6000); // Random interval between 6-11 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(loop);
    };
  }, []);

  const triggerNotification = () => {
    setVisible(false);
    
    setTimeout(() => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const actionObj = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      
      let amount = 0;
      if (actionObj.type === 'withdraw') amount = Math.floor(Math.random() * 8000) + 1500;
      if (actionObj.type === 'trade') amount = Math.floor(Math.random() * 2000) + 400;
      if (actionObj.type === 'deposit') amount = Math.floor(Math.random() * 5000) + 500;

      setNotification({
        name,
        action: actionObj.text,
        amount: `$${amount.toLocaleString()}`,
        asset: actionObj.asset
      });
      setVisible(true);

      // Hide after 4 seconds
      setTimeout(() => setVisible(false), 4000);
    }, 500);
  };

  if (!notification) return null;

  return (
    <div 
      className={`fixed bottom-24 left-4 z-[90] max-w-[280px] bg-[#1e222d]/90 backdrop-blur-md border border-[#2a2e39] rounded-2xl p-4 shadow-2xl transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg ${
          notification.action.includes('withdraw') ? 'bg-[#f01a64]' : 
          notification.action.includes('deposited') ? 'bg-blue-500' : 'bg-[#00b36b]'
        }`}>
          {notification.action.includes('withdraw') ? 'OUT' : notification.action.includes('deposited') ? 'IN' : 'WIN'}
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">
            {notification.name} {notification.action}
          </p>
          <p className="text-white font-black text-sm leading-none">
            <span className={notification.action.includes('withdraw') ? 'text-[#f01a64]' : 'text-[#00b36b]'}>
              {notification.amount}
            </span> 
            <span className="text-[10px] text-gray-500 ml-1 font-medium">{notification.asset}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityFeed;
