import React, { useState } from 'react';
import { LifeOSProvider, useLifeOS } from './context/LifeOSContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { QuickAddModal } from './components/QuickAddModal';
import { DashboardPage } from './pages/DashboardPage';
import { LoansDashboardPage } from './pages/LoansDashboardPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { FinancePage } from './pages/FinancePage';
import { CareerPage } from './pages/CareerPage';
import { TasksPage } from './pages/TasksPage';
import { FitnessPage } from './pages/FitnessPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { WeeklyReviewPage } from './pages/WeeklyReviewPage';
import { IdeasPage } from './pages/IdeasPage';
import { DigiGoldPage } from './pages/DigiGoldPage';
import { SalemGoldSheetPage } from './pages/SalemGoldSheetPage';
import { GrowwStocksPage } from './pages/GrowwStocksPage';
import { ChitSchemesPage } from './pages/ChitSchemesPage';
import { DailyExpensePage } from './pages/DailyExpensePage';
import { WeightTrackerPage } from './pages/WeightTrackerPage';
import { DailyPayChitPage } from './pages/DailyPayChitPage';
import { IncomeMonitorPage } from './pages/IncomeMonitorPage';
import { GoogleCalendarPage } from './pages/GoogleCalendarPage';

const AppContent: React.FC = () => {
  const {
    activeTab,
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddDefaultType,
    openQuickAdd
  } = useLifeOS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'salem_gold_sheet':
        return <SalemGoldSheetPage />;
      case 'loans':
      case 'loan_waterfall':
      case 'loan_amortization':
      case 'loan_ledger':
      case 'loan_simulator':
        return <LoansDashboardPage />;
      case 'investments':
        return <SalemGoldSheetPage />;
      case 'groww_stocks':
        return <GrowwStocksPage />;
      case 'chits':
        return <ChitSchemesPage />;
      case 'daily_chit':
        return <DailyPayChitPage />;
      case 'digi_gold':
      case 'digi_silver':
      case 'mutual_funds':
        return <SalemGoldSheetPage />;
      case 'finance':
      case 'basic_needs':
        return <FinancePage />;
      case 'income':
        return <IncomeMonitorPage />;
      case 'daily_expense':
        return <DailyExpensePage />;
      case 'fitness':
      case 'workout_log':
        return <FitnessPage />;
      case 'weight_tracker':
        return <WeightTrackerPage />;
      case 'career':
      case 'skills':
        return <CareerPage />;
      case 'tasks':
      case 'habits':
        return <TasksPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'review':
        return <WeeklyReviewPage />;
      case 'ideas':
        return <IdeasPage />;
      case 'calendar':
        return <GoogleCalendarPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080C15] text-slate-100 flex font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* 3D Cyber Grid & Floating Ambient Glows */}
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none -z-20" />
      <div className="fixed top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-float-slow" />
      <div className="fixed bottom-[-10%] right-[15%] w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed top-[40%] right-[30%] w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[140px] pointer-events-none -z-10 animate-float-gentle" />

      {/* 1. Left Dark Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* 2. Main Scrollable Canvas Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0 min-h-screen">
        {/* Top Header */}
        <TopHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenQuickAdd={() => openQuickAdd('expense')}
        />

        {/* Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
          {renderActivePage()}
        </main>

        {/* Dark Minimalist Footer */}
        <footer className="border-t border-slate-800/80 bg-[#0B101D]/70 backdrop-blur-md py-4 px-4 sm:px-8 text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-200">Jeeva's Life OS · 2026</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">AI/ML Career · Financial Freedom · Health & Fitness</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="text-slate-300">Salary: ₹34,000/mo</span>
              <span className="text-slate-600">•</span>
              <span className="text-rose-400 font-semibold">3 Loans: ₹2.40L</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">3 Chits & 2 Stocks</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">Weight: 57 kg</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Quick Add Modal */}
      {isQuickAddOpen && (
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          defaultType={quickAddDefaultType}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <LifeOSProvider>
      <AppContent />
    </LifeOSProvider>
  );
}

export default App;
