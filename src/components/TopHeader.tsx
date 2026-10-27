import React, { useState, useEffect } from 'react';
import { Menu, Plus, RefreshCw, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenQuickAdd: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu, onOpenQuickAdd }) => {
  const { salemRate, isFetchingSalemRate, refreshSalemGoldRate, navigateToTab, activeTab } = useLifeOS();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <header className="sticky top-0 z-30 bg-[#080C15]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between transition-all">
      {/* Zone 1: Clean Brand Wordmark & Mobile Menu Trigger */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button 
          onClick={() => navigateToTab('dashboard')} 
          className="flex items-center gap-2.5 group text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            J
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-base sm:text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors whitespace-nowrap">
              JEEVA OS
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Breadcrumb / Active Context with Live Clock */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap shrink-0">
        <span className="capitalize font-semibold text-slate-300">
          {activeTab === 'dashboard' ? 'Executive Command' : activeTab.replace(/_/g, ' ')}
        </span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span className="text-slate-400">{dateStr}</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span className="font-mono text-cyan-300 tabular-nums">{timeStr}</span>
      </div>

      {/* Zone 3: Live Salem Gold Ticker & Primary Action Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Salem Gold Live Ticker Button */}
        <button
          onClick={() => {
            if (activeTab === 'salem_gold_sheet') {
              refreshSalemGoldRate();
            } else {
              navigateToTab('salem_gold_sheet');
            }
          }}
          title="Salem Bullion Association: 22K Hallmarked Gold Rate. Click to refresh."
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all group"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:animate-ping" />
            <span className="hidden sm:inline text-amber-400/90 font-semibold">Salem 22K:</span>
            <span className="font-mono font-bold text-amber-200 tabular-nums">
              ₹{salemRate.gold22kPerGram.toLocaleString('en-IN')}/g
            </span>
          </div>
          <RefreshCw 
            onClick={(e) => {
              e.stopPropagation();
              refreshSalemGoldRate();
            }}
            className={`w-3.5 h-3.5 text-amber-400 hover:text-amber-200 transition-colors ${
              isFetchingSalemRate ? 'animate-spin' : ''
            }`}
          />
        </button>

        {/* Google Calendar Quick Button */}
        <button
          onClick={() => navigateToTab('calendar')}
          title="Open Google Calendar & Life OS Schedule"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95"
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Calendar</span>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>
      </div>
    </header>
  );
};
