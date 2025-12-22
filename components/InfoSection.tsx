
import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <section className="bg-[#131722] text-gray-300 py-16 border-t border-[#2a2e39]">
      <div className="max-w-6xl mx-auto px-4 space-y-20">

        {/* --- SECTION 1: HEADER & RATING --- */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-4 bg-[#1e222d] px-6 py-3 rounded-full border border-[#2a2e39] shadow-lg">
             <span className="text-white font-bold text-sm uppercase tracking-wide">Powered by ZuluTrade Tech</span>
             <span className="text-[#f01a64] text-xs">|</span>
             <div className="text-yellow-400 text-xs tracking-widest">⭐ ⭐ ⭐ ⭐ ☆</div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Social Trading <span className="text-[#00b36b]">Evolved</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base font-medium leading-relaxed">
            The gap between manual trading and automated wealth creation is closed. Experience the ZuluTrade ecosystem.
          </p>
        </div>

        {/* --- SECTION 2: HOW TO START (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-[#f01a64]/0 via-[#f01a64]/20 to-[#f01a64]/0 z-0"></div>
          
          {[
            { step: "01", title: "Register", desc: "Create your secure identity profile." },
            { step: "02", title: "Select Broker", desc: "Link an existing account or start fresh." },
            { step: "03", title: "Filter Leaders", desc: "Use 40+ metrics to find your match." },
            { step: "04", title: "Automate", desc: "Deploy capital and start copying." }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 bg-[#1e222d] p-6 rounded-2xl border border-[#2a2e39] text-center group hover:border-[#f01a64]/50 transition-colors">
              <div className="w-10 h-10 bg-[#131722] rounded-full border border-[#2a2e39] flex items-center justify-center text-[#f01a64] font-black text-xs mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                {item.step}
              </div>
              <h4 className="text-white font-bold uppercase text-sm mb-2">{item.title}</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* --- SECTION 3: BENEFITS & COMPARISON --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Copy vs Manual */}
          <div className="bg-[#1e222d] p-8 md:p-10 rounded-[2rem] border border-[#2a2e39] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#00b36b]/10 rounded-full blur-3xl"></div>
             <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Manual vs. Copy Trading</h3>
             <div className="space-y-6">
               <div className="flex gap-4">
                 <div className="w-1 bg-gray-700 rounded-full h-full min-h-[40px]"></div>
                 <div>
                   <h5 className="text-gray-500 font-bold text-xs uppercase mb-1">Manual Trading</h5>
                   <p className="text-xs text-gray-600">Requires hours of analysis, emotional discipline, and constant chart monitoring.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-1 bg-[#f01a64] rounded-full shadow-[0_0_10px_#f01a64] h-full min-h-[40px]"></div>
                 <div>
                   <h5 className="text-white font-bold text-xs uppercase mb-1">Zulu Copy Trading</h5>
                   <p className="text-xs text-gray-400">Leverage the expertise of verified leaders. Save time, reduce emotion, and automate execution.</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Right: Key Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {[
               { title: "Flexibility", desc: "Adjust investment size and risk per strategy." },
               { title: "Transparency", desc: "Real verified data. No hidden metrics." },
               { title: "Learning", desc: "Analyze pro moves to sharpen your skills." },
               { title: "Global Access", desc: "Connect with leaders across forex, crypto, and stocks." }
             ].map((feat, i) => (
               <div key={i} className="bg-[#1e222d]/50 p-5 rounded-2xl border border-white/5 hover:bg-[#1e222d] transition-colors">
                 <h4 className="text-white font-bold text-sm mb-2">{feat.title}</h4>
                 <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
               </div>
             ))}
          </div>
        </div>

        {/* --- SECTION 4: FOOTER NAVIGATION & CTA --- */}
        <div className="border-t border-[#2a2e39] pt-12 text-center space-y-8">
           <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              {['Dashboard', 'Leaders', 'Markets', 'Community', 'Analytics'].map((link) => (
                <span key={link} className="cursor-pointer hover:text-white transition-colors">{link}</span>
              ))}
           </div>
           
           <button 
             onClick={() => window.open('https://t.me/MentorwithZuluTrade_bot', '_blank')}
             className="bg-[#00b36b] hover:bg-green-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95"
           >
             Initialize Account
           </button>
        </div>

      </div>
    </section>
  );
};

export default InfoSection;
