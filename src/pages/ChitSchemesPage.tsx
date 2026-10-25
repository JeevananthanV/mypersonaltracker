import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { ChitSchemesDashboard } from '../components/investments/ChitSchemesDashboard';
import { InvestmentAsset, InvestmentCategory } from '../types';
import { getLiveDateString } from '../utils/date-utils';
import { Award, X } from 'lucide-react';

export const ChitSchemesPage: React.FC = () => {
  const {
    investments,
    payChitInstallment,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    navigateToTab,
    triggerConfetti
  } = useLifeOS();

  const chitSchemes = investments.filter(
    i => i.category === 'gold_chit' || i.category === 'silver_chit' || i.chitTenureMonths
  );

  // Add / Edit Chit Modal
  const [isChitModalOpen, setIsChitModalOpen] = useState(false);
  const [editingChit, setEditingChit] = useState<InvestmentAsset | null>(null);
  const [chitName, setChitName] = useState('');
  const [chitMerchant, setChitMerchant] = useState('GRT Jewellers');
  const [chitCategory, setChitCategory] = useState<'gold_chit' | 'silver_chit'>('gold_chit');
  const [chitMonthlyAmount, setChitMonthlyAmount] = useState(2000);
  const [chitTenureMonths, setChitTenureMonths] = useState(11);
  const [chitMonthsPaid, setChitMonthsPaid] = useState(1);
  const [chitMaturityBonus, setChitMaturityBonus] = useState(2000);

  const handlePayChitQuick = (asset: InvestmentAsset) => {
    payChitInstallment(asset.id);
  };

  const handleOpenAddModal = () => {
    setEditingChit(null);
    setChitName('');
    setChitMerchant('GRT Jewellers');
    setChitCategory('gold_chit');
    setChitMonthlyAmount(2000);
    setChitTenureMonths(11);
    setChitMonthsPaid(1);
    setChitMaturityBonus(2000);
    setIsChitModalOpen(true);
  };

  const handleOpenEditModal = (asset: InvestmentAsset) => {
    setEditingChit(asset);
    setChitName(asset.name);
    setChitMerchant(asset.platform);
    setChitCategory(asset.category as any);
    setChitMonthlyAmount(asset.chitMonthlyAmount || asset.monthlySipAmount || 2000);
    setChitTenureMonths(asset.chitTenureMonths || 11);
    setChitMonthsPaid(asset.chitMonthsPaid || 1);
    setChitMaturityBonus(asset.maturityBonus || 0);
    setIsChitModalOpen(true);
  };

  const handleSaveChit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chitName.trim()) return;

    const invested = Number(chitMonthlyAmount) * Number(chitMonthsPaid);

    const chitData = {
      name: chitName.trim(),
      category: chitCategory,
      platform: chitMerchant.trim(),
      investedAmount: invested,
      currentValue: invested,
      isMonthlySip: true,
      monthlySipAmount: Number(chitMonthlyAmount),
      chitMonthlyAmount: Number(chitMonthlyAmount),
      chitTenureMonths: Number(chitTenureMonths),
      chitMonthsPaid: Number(chitMonthsPaid),
      maturityBonus: Number(chitMaturityBonus),
      status: 'active' as const,
      colorTag: chitCategory === 'gold_chit' ? 'yellow' : 'cyan',
      updatedAt: getLiveDateString()
    };

    if (editingChit) {
      updateInvestment(editingChit.id, chitData);
    } else {
      addInvestment(chitData);
    }

    setIsChitModalOpen(false);
    triggerConfetti();
  };

  return (
    <div className="space-y-6">
      <ChitSchemesDashboard
        chitSchemes={chitSchemes}
        onPayChitQuick={handlePayChitQuick}
        onOpenAddModal={handleOpenAddModal}
        onOpenEditModal={handleOpenEditModal}
        onDeleteInvestment={deleteInvestment}
        onBackToOverview={() => navigateToTab('investments', 'overview')}
      />

      {/* Enroll / Edit Chit Modal */}
      {isChitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0E1526] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D]">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingChit ? 'Edit Jeweller Scheme' : 'Enroll New 11-Month Jeweller Scheme'}
                </h3>
              </div>
              <button
                onClick={() => setIsChitModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Scheme Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GRT Golden Eleven, Lalitha Jewel Savings"
                  value={chitName}
                  onChange={(e) => setChitName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Jeweller / Merchant</label>
                  <input
                    type="text"
                    value={chitMerchant}
                    onChange={(e) => setChitMerchant(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Type</label>
                  <select
                    value={chitCategory}
                    onChange={(e) => setChitCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="gold_chit">Gold Chit Scheme</option>
                    <option value="silver_chit">Silver Chit Scheme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Monthly Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    step="500"
                    value={chitMonthlyAmount}
                    onChange={(e) => setChitMonthlyAmount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Months Paid</label>
                  <input
                    type="number"
                    min="0"
                    max={chitTenureMonths}
                    value={chitMonthsPaid}
                    onChange={(e) => setChitMonthsPaid(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Total Tenure (Months)</label>
                  <input
                    type="number"
                    value={chitTenureMonths}
                    onChange={(e) => setChitTenureMonths(Number(e.target.value) || 11)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">12th Month Bonus (₹)</label>
                  <input
                    type="number"
                    value={chitMaturityBonus}
                    onChange={(e) => setChitMaturityBonus(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
                >
                  Save Scheme Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
