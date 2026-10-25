import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { DigiGoldDashboard } from '../components/investments/DigiGoldDashboard';
import { InvestmentAsset } from '../types';
import { getLiveDateString } from '../utils/date-utils';
import { Coins, X, HelpCircle, ShieldCheck } from 'lucide-react';

export const DigiGoldPage: React.FC = () => {
  const {
    investments,
    deleteBullionTransaction,
    addBullionTransaction,
    updateInvestment,
    navigateToTab,
    triggerConfetti
  } = useLifeOS();

  const [goldSpotRate, setGoldSpotRate] = useState<number>(7380);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [depositRate, setDepositRate] = useState<number>(13515);
  const [depositBonusPct, setDepositBonusPct] = useState<number>(7);
  const [depositDocNo, setDepositDocNo] = useState<string>(`APP27SCTM/${Math.floor(1900000 + Math.random() * 99999)}`);
  const [depositPromoCode, setDepositPromoCode] = useState<string>('');
  const [depositNotes, setDepositNotes] = useState<string>('Gold Saving Plan - 22K gold instant bonus');

  // Edit asset modal state
  const [editingAsset, setEditingAsset] = useState<InvestmentAsset | null>(null);
  const [editName, setEditName] = useState('');
  const [editInvested, setEditInvested] = useState(500);
  const [editValue, setEditValue] = useState(292);

  const calcBaseWeight = depositRate > 0 ? Number((depositAmount / depositRate).toFixed(5)) : 0;
  const calcBonusWeight = Number(((calcBaseWeight * depositBonusPct) / 100).toFixed(5));

  const handleSaveDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0 || depositRate <= 0) return;

    addBullionTransaction('pothys-digi-gold', {
      date: getLiveDateString(),
      amount: Number(depositAmount),
      rate: Number(depositRate),
      weightGrams: calcBaseWeight,
      bonusWeightGrams: calcBonusWeight,
      bonusPercentage: Number(depositBonusPct),
      docNo: depositDocNo.trim() || undefined,
      promoCode: depositPromoCode.trim() || undefined,
      notes: depositNotes.trim() || undefined
    });

    setIsDepositModalOpen(false);
    triggerConfetti();
  };

  const handleOpenEditModal = (asset: InvestmentAsset) => {
    setEditingAsset(asset);
    setEditName(asset.name);
    setEditInvested(asset.investedAmount);
    setEditValue(asset.currentValue);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    updateInvestment(editingAsset.id, {
      name: editName,
      investedAmount: Number(editInvested),
      currentValue: Number(editValue),
      updatedAt: getLiveDateString()
    });

    setEditingAsset(null);
    triggerConfetti();
  };

  return (
    <div className="space-y-6">
      <DigiGoldDashboard
        investments={investments}
        goldSpotRate={goldSpotRate}
        onOpenDepositModal={() => setIsDepositModalOpen(true)}
        onOpenRulesModal={() => setIsRulesModalOpen(true)}
        onBackToOverview={() => navigateToTab('investments', 'overview')}
        onDeleteTransaction={(assetId, txId) => deleteBullionTransaction(assetId, txId)}
        onOpenEditModal={handleOpenEditModal}
      />

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E1526] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D]">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  Add / Record 22K Digi Gold Deposit
                </h3>
              </div>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeposit} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                Pothys Swarna Mahal — 22K Hallmarked Gold Advance Scheme (+7% Bonus Weight credited immediately).
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Deposit Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Purchase Rate (₹ / g) *</label>
                  <input
                    type="number"
                    required
                    step="1"
                    value={depositRate}
                    onChange={(e) => setDepositRate(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Base Weight</span>
                  <strong className="text-xs text-slate-200 font-mono">{calcBaseWeight}g</strong>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 block">+7% Bonus</span>
                  <strong className="text-xs text-amber-400 font-mono">+{calcBonusWeight}g</strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 block">Total Credit</span>
                  <strong className="text-xs text-emerald-300 font-mono">{(calcBaseWeight + calcBonusWeight).toFixed(5)}g</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Document / Receipt No.</label>
                  <input
                    type="text"
                    value={depositDocNo}
                    onChange={(e) => setDepositDocNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Promo Code</label>
                  <input
                    type="text"
                    placeholder="e.g. FESTIVE2026"
                    value={depositPromoCode}
                    onChange={(e) => setDepositPromoCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
                >
                  Confirm & Credit Gold Weight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0E1526] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Pothys Swarna Mahal Scheme Rules
              </h3>
              <button onClick={() => setIsRulesModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p>• <strong>Tenure:</strong> 330 days (11 months) from the first deposit.</p>
              <p>• <strong>Bonus Structure:</strong> Days 1–75: +7% weight; Days 76–150: +5%; Days 151–225: +3%; Days 226–300: +1%.</p>
              <p>• <strong>Redemption:</strong> 100% redeemable against 22K BIS Hallmarked jewellery at any showroom or online video shopping.</p>
            </div>
            <button
              onClick={() => setIsRulesModalOpen(false)}
              className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
