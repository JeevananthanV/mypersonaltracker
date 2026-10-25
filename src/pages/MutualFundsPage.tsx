import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { MutualFundsDashboard } from '../components/investments/MutualFundsDashboard';
import { InvestmentAsset, InvestmentCategory } from '../types';
import { getLiveDateString } from '../utils/date-utils';
import { Sparkles, X } from 'lucide-react';

export const MutualFundsPage: React.FC = () => {
  const {
    investments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    navigateToTab,
    triggerConfetti
  } = useLifeOS();

  const mutualFundInvestments = investments.filter(
    i => i.category === 'mutual_funds' || i.category === 'etf'
  );

  // Add / Edit Fund Modal
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [editingFund, setEditingFund] = useState<InvestmentAsset | null>(null);
  const [fundName, setFundName] = useState('');
  const [fundPlatform, setFundPlatform] = useState('Groww App');
  const [fundMonthlySip, setFundMonthlySip] = useState(1000);
  const [fundInvested, setFundInvested] = useState(5000);
  const [fundCurrent, setFundCurrent] = useState(5500);

  const handleOpenAddModal = () => {
    setEditingFund(null);
    setFundName('');
    setFundPlatform('Groww App');
    setFundMonthlySip(1000);
    setFundInvested(5000);
    setFundCurrent(5500);
    setIsFundModalOpen(true);
  };

  const handleOpenEditModal = (asset: InvestmentAsset) => {
    setEditingFund(asset);
    setFundName(asset.name);
    setFundPlatform(asset.platform);
    setFundMonthlySip(asset.monthlySipAmount || 1000);
    setFundInvested(asset.investedAmount);
    setFundCurrent(asset.currentValue);
    setIsFundModalOpen(true);
  };

  const handleSaveFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundName.trim()) return;

    const gain = Number(fundCurrent) - Number(fundInvested);
    const gainPct = fundInvested > 0 ? (gain / fundInvested) * 100 : 0;

    const fundData = {
      name: fundName.trim(),
      category: 'mutual_funds' as InvestmentCategory,
      platform: fundPlatform.trim() || 'Groww App',
      investedAmount: Number(fundInvested),
      currentValue: Number(fundCurrent),
      isMonthlySip: true,
      monthlySipAmount: Number(fundMonthlySip),
      unrealizedGain: gain,
      unrealizedGainPct: Number(gainPct.toFixed(2)),
      status: 'active' as const,
      colorTag: 'indigo',
      updatedAt: getLiveDateString()
    };

    if (editingFund) {
      updateInvestment(editingFund.id, fundData);
    } else {
      addInvestment(fundData);
    }

    setIsFundModalOpen(false);
    triggerConfetti();
  };

  return (
    <div className="space-y-6">
      <MutualFundsDashboard
        mutualFundInvestments={mutualFundInvestments}
        onOpenAddModal={handleOpenAddModal}
        onOpenEditModal={handleOpenEditModal}
        onDeleteInvestment={deleteInvestment}
        onBackToOverview={() => navigateToTab('investments', 'overview')}
      />

      {/* Add / Edit Mutual Fund Modal */}
      {isFundModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0E1526] border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingFund ? 'Edit Mutual Fund SIP' : 'Add Mutual Fund / ETF SIP'}
                </h3>
              </div>
              <button
                onClick={() => setIsFundModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFund} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Fund Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parag Parikh Flexi Cap Fund Direct-Growth"
                  value={fundName}
                  onChange={(e) => setFundName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Platform / Broker</label>
                  <input
                    type="text"
                    value={fundPlatform}
                    onChange={(e) => setFundPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Monthly SIP (₹) *</label>
                  <input
                    type="number"
                    required
                    step="500"
                    value={fundMonthlySip}
                    onChange={(e) => setFundMonthlySip(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Total Invested (₹) *</label>
                  <input
                    type="number"
                    required
                    step="100"
                    value={fundInvested}
                    onChange={(e) => setFundInvested(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Current Valuation (₹) *</label>
                  <input
                    type="number"
                    required
                    step="100"
                    value={fundCurrent}
                    onChange={(e) => setFundCurrent(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFundModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white shadow-md"
                >
                  Save Fund SIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
