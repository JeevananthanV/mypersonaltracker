import React from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { SalemGoldSchemeSheet } from '../components/investments/SalemGoldSchemeSheet';
import { ArrowLeft, Coins, Award, Sparkles } from 'lucide-react';

export const SalemGoldSheetPage: React.FC = () => {
  const {
    investments,
    recordDailyChitPayment,
    recordDualChitPayment,
    navigateToTab,
    openQuickAdd
  } = useLifeOS();

  const goldAsset = investments.find(
    i => i.id === 'pothys-digi-gold' || i.category === 'digi_gold' || i.name.toLowerCase().includes('gold')
  );

  const silverAsset = investments.find(
    i => i.id === 'pothys-digi-silver' || i.category === 'silver_chit' || i.name.toLowerCase().includes('silver')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateToTab('daily_chit')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Daily Chit Terminal</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" />
            Salem Gold Sheet & Scheme Rates
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
            Pothys Swarna Mahal (Salem) • APP27SCTM
          </span>
        </div>
      </div>

      {/* Main Salem Scheme Sheet Component */}
      <SalemGoldSchemeSheet
        goldAsset={goldAsset}
        silverAsset={silverAsset}
        onRecordDailyPay={(assetId, amount, date, notes, customRate, docNo) => {
          recordDailyChitPayment(assetId, amount, date, notes, customRate, docNo);
        }}
        onRecordDualPay={(goldAmt, silverAmt, date, notes, gRate, sRate) => {
          if (recordDualChitPayment) {
            recordDualChitPayment(goldAmt, silverAmt, date, notes, gRate, sRate);
          } else {
            recordDailyChitPayment('pothys-digi-gold', goldAmt, date, notes, gRate);
            recordDailyChitPayment('pothys-digi-silver', silverAmt, date, notes, sRate);
          }
        }}
        onOpenQuickDeposit={(dayNum, dateString, metal) => {
          // Open global or quick deposit with prefilled date
          navigateToTab('daily_chit');
        }}
      />
    </div>
  );
};
export default SalemGoldSheetPage;
