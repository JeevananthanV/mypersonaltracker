import React, { useState } from 'react';
import { LifeOSProvider, useLifeOS } from './context/LifeOSContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { QuickAddModal } from './components/QuickAddModal';
import { DashboardPage } from './pages/DashboardPage';
import { FinancePage } from './pages/FinancePage';
import { CareerPage } from './pages/CareerPage';
import { TasksPage } from './pages/TasksPage';
import { FitnessPage } from './pages/FitnessPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { WeeklyReviewPage } from './pages/WeeklyReviewPage';
import { IdeasPage } from './pages/IdeasPage';

const AppContent: React.FC = () => {
  const { activeTab } = useLifeOS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'finance':
        return <FinancePage />;
      case 'career':
        return <CareerPage />;
      case 'tasks':
        return <TasksPage />;
      case 'fitness':
        return <FitnessPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'review':
        return <WeeklyReviewPage />;
      case 'ideas':
        return <IdeasPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Left Dark Sidebar (Matching Reference Image) */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* 2. Main Scrollable Canvas Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 min-h-screen">
        {/* Top Header */}
        <TopHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
          {renderActivePage()}
        </main>

        {/* Light Minimalist Footer */}
        <footer className="border-t border-slate-200/80 bg-white/60 py-4 px-4 sm:px-8 text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-700">Jeeva's Life OS · 2026</span>
              <span>•</span>
              <span>AI/ML Career · Financial Freedom · Health & Fitness</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-500">
              <span>Salary: ₹34,000/mo</span>
              <span>•</span>
              <span>3 Loans: ₹2.40L</span>
              <span>•</span>
              <span>Weight: 57 kg</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Quick Add Modal */}
      {quickAddOpen && (
        <QuickAddModal
          isOpen={quickAddOpen}
          onClose={() => setQuickAddOpen(false)}
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
