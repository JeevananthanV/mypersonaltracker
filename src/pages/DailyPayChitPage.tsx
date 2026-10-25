import React from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { DailyPayChitDashboard } from '../components/investments/DailyPayChitDashboard';

export const DailyPayChitPage: React.FC = () => {
  const {
    investments,
    recordDailyChitPayment,
    recordDualChitPayment,
    batchPayChitDays,
    navigateToTab
  } = useLifeOS();

  const goldAsset = investments.find(
    i => i.id === 'pothys-digi-gold' || i.category === 'digi_gold' || i.name.toLowerCase().includes('gold')
  );

  const silverAsset = investments.find(
    i => i.id === 'pothys-digi-silver' || i.category === 'silver_chit' || i.name.toLowerCase().includes('silver')
  );

  const goldSpotRate = goldAsset?.currentPrice || 7380;
  const silverSpotRate = silverAsset?.currentPrice || 97.5;

  const handleRecordDailyPay = (
    assetId: string,
    amount: number,
    date?: string,
    notes?: string,
    customRate?: number,
    docNo?: string
  ) => {
    recordDailyChitPayment(assetId, amount, date, notes, customRate, docNo);
  };

  const handleRecordDualPay = (
    goldAmount: number,
    silverAmount: number,
    date?: string,
    notes?: string,
    goldRate?: number,
    silverRate?: number
  ) => {
    recordDualChitPayment(goldAmount, silverAmount, date, notes, goldRate || goldSpotRate, silverRate || silverSpotRate);
  };

  const handleBatchPay = (
    payments: { assetId: string; amount: number; date: string; customRate?: number; notes?: string }[]
  ) => {
    batchPayChitDays(payments);
  };

  return (
    <DailyPayChitDashboard
      goldAsset={goldAsset}
      silverAsset={silverAsset}
      goldSpotRate={goldSpotRate}
      silverSpotRate={silverSpotRate}
      onRecordDailyPay={handleRecordDailyPay}
      onRecordDualPay={handleRecordDualPay}
      onBatchPay={handleBatchPay}
      onBackToOverview={() => navigateToTab('investments', 'overview')}
    />
  );
};
