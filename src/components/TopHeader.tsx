import React from 'react';
import { Sun, Calendar, Plus, Menu } from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenQuickAdd: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu, onOpenQuickAdd }) => {
  // Format current local date in style: "Tue, 22 Apr 2026"
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Calculate current week of year
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((today.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);

  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/70 px-4 sm:px-8 py-4 flex items-center justify-between transition-all">
      {/* Left: Greeting matching reference */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-200/70 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-sm mt-0.5">
            <Sun className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Good morning, Jeeva!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Your health, finances, AI/ML, and goals — all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5">
        {/* Date Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-sm font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{dateFormatted}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-normal">Week {weekNumber}</span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-2 pl-1">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
              J
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
        </div>
      </div>
    </header>
  );
};
