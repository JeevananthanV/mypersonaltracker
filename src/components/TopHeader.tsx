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
  let iconContainerClass = 'bg-amber-100 border-amber-200 text-amber-600';
  let iconClass = 'w-5 h-5 fill-amber-400 text-amber-500';

  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon, Jeeva!';
    subGreeting = 'Keep the momentum going strong on your goals.';
    GreetingIcon = Sun;
    iconContainerClass = 'bg-orange-100 border-orange-200 text-orange-600';
    iconClass = 'w-5 h-5 fill-amber-400 text-orange-500';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good evening, Jeeva!';
    subGreeting = 'Review today’s wins, log daily tasks, and recharge.';
    GreetingIcon = Sunset;
    iconContainerClass = 'bg-indigo-100 border-indigo-200 text-indigo-600';
    iconClass = 'w-5 h-5 text-indigo-500';
  } else if (hour >= 22 || hour < 5) {
    greeting = 'Good night, Jeeva!';
    subGreeting = 'Late night focus. Rest well and prepare for tomorrow.';
    GreetingIcon = Moon;
    iconContainerClass = 'bg-slate-800 border-slate-700 text-indigo-300';
    iconClass = 'w-5 h-5 fill-indigo-400 text-indigo-400';
  }

  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/70 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Dynamic Time-Aware Greeting */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-200/70 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-3">
          <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs mt-0.5 transition-colors ${iconContainerClass}`}>
            <GreetingIcon className={iconClass} />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {greeting}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block">
              {subGreeting}
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls: Live Date & Time + Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile Compact Live Clock */}
        <div
          className="flex md:hidden items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs"
          title={`Live Time: ${timeFormatted} • ${dateFormatted}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono font-bold text-slate-800 tracking-tight">
            {timeFormatted}
          </span>
        </div>

        {/* Desktop / Tablet Live Date & Time Pill */}
        <div
          className="hidden md:flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-xs text-xs text-slate-700 font-medium hover:border-slate-300 transition-colors"
          title={`Live System Clock • Week ${weekNumber}`}
        >
          {/* Live pulsing dot indicator */}
          <div className="flex items-center space-x-1.5 pr-2 border-r border-slate-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">LIVE</span>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">{dateFormatted}</span>
          </div>

          <span className="text-slate-300">•</span>

          {/* Real-time Ticking Clock */}
          <div className="flex items-center space-x-1.5 font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{timeFormatted}</span>
          </div>

          <span className="hidden xl:inline text-slate-300">•</span>
          <span className="hidden xl:inline text-slate-500 font-normal">Week {weekNumber}</span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-2 pl-1">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-white">
              J
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
        </div>
      </div>
    </header>
  );
};
