import React, { useState, useEffect } from 'react';
import { Sun, Sunset, Moon, Calendar, Clock, Plus, Menu } from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenQuickAdd: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu, onOpenQuickAdd }) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    // Tick every second for real-time live clock precision
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format current local date: "Thu, 15 Oct 2026"
  const dateFormatted = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Format live ticking time with seconds: "11:15:47 AM"
  const timeFormatted = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Calculate current week of year
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((now.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);

  // Time-aware greeting, subtitle & icon styling
  const hour = now.getHours();
  let greeting = 'Good morning, Jeeva!';
  let subGreeting = 'Your health, finances, AI/ML, and goals — all in one place.';
  let GreetingIcon = Sun;
  let iconContainerClass = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
  let iconClass = 'w-5 h-5 fill-amber-400 text-amber-400';

  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon, Jeeva!';
    subGreeting = 'Keep the momentum going strong on your goals.';
    GreetingIcon = Sun;
    iconContainerClass = 'bg-orange-500/10 border-orange-500/30 text-orange-400';
    iconClass = 'w-5 h-5 fill-orange-400 text-orange-400';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good evening, Jeeva!';
    subGreeting = 'Review today’s wins, log daily tasks, and recharge.';
    GreetingIcon = Sunset;
    iconContainerClass = 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
    iconClass = 'w-5 h-5 text-indigo-400';
  } else if (hour >= 22 || hour < 5) {
    greeting = 'Good night, Jeeva!';
    subGreeting = 'Late night focus. Rest well and prepare for tomorrow.';
    GreetingIcon = Moon;
    iconContainerClass = 'bg-slate-900 border-slate-800 text-indigo-300';
    iconClass = 'w-5 h-5 fill-indigo-400 text-indigo-400';
  }

  return (
    <header className="sticky top-0 z-30 bg-[#080C15]/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Dynamic Time-Aware Greeting */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-3">
          <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 shadow-md mt-0.5 transition-colors ${iconContainerClass}`}>
            <GreetingIcon className={iconClass} />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
              {greeting}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium hidden sm:block">
              {subGreeting}
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls: Live Date & Time + Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile Compact Live Clock */}
        <div
          className="flex md:hidden items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm"
          title={`Live Time: ${timeFormatted} • ${dateFormatted}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono font-bold text-slate-200 tracking-tight">
            {timeFormatted}
          </span>
        </div>

        {/* Desktop / Tablet Live Date & Time Pill with 3D Depth */}
        <div
          className="hidden md:flex items-center space-x-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg text-xs text-slate-300 font-medium hover:border-indigo-500/50 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          title={`Live System Clock • Week ${weekNumber}`}
        >
          {/* Live pulsing dot indicator */}
          <div className="flex items-center space-x-1.5 pr-2.5 border-r border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">LIVE</span>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-200">{dateFormatted}</span>
          </div>

          <span className="text-slate-600">•</span>

          {/* Real-time Ticking Clock */}
          <div className="flex items-center space-x-1.5 font-mono font-bold text-cyan-300 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
            <span>{timeFormatted}</span>
          </div>

          <span className="hidden xl:inline text-slate-600">•</span>
          <span className="hidden xl:inline text-slate-400 font-normal">W{weekNumber}</span>
        </div>

        {/* Quick Add Button with Glowing Gradient */}
        <button
          onClick={onOpenQuickAdd}
          className="relative group overflow-hidden flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-900/40 hover:shadow-indigo-500/30 hover:scale-[1.03] active:scale-[0.97] transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
          <Plus className="w-4 h-4 text-indigo-200 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* User Profile Avatar with 3D Depth */}
        <div className="flex items-center space-x-2 pl-1">
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 text-white flex items-center justify-center font-black text-sm shadow-lg ring-2 ring-indigo-500/40 group-hover:ring-indigo-400 group-hover:scale-105 transition-all">
              J
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
        </div>
      </div>
    </header>
  );
};
