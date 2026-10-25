import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { GrowwStocksDashboard } from '../components/investments/GrowwStocksDashboard';
import { InvestmentAsset, InvestmentCategory } from '../types';
import { getLiveDateString } from '../utils/date-utils';
import { TrendingUp, X } from 'lucide-react';

export const GrowwStocksPage: React.FC = () => {
  const {
    investments,
    growwSummary,
    updateStockPrice,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    navigateToTab,
    triggerConfetti
  } = useLifeOS();

  const itcAsset = investments.find(i => i.id === 'groww-itc');
  const tatagoldAsset = investments.find(i => i.id === 'groww-tatagold');

  const [itcLiveCmp, setItcLiveCmp] = useState<number>(itcAsset?.currentPrice || 257.90);
  const [tatagoldLiveCmp, setTatagoldLiveCmp] = useState<number>(tatagoldAsset?.currentPrice || 13.63);
  const [isGrowwUpdating, setIsGrowwUpdating] = useState(false);

  // Add / Edit stock modal
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<InvestmentAsset | null>(null);
  const [stockName, setStockName] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockBuyPrice, setStockBuyPrice] = useState(100);
  const [stockCurrentPrice, setStockCurrentPrice] = useState(100);

  const handleUpdateStockCMP = (assetId: string, newPrice: number) => {
    updateStockPrice(assetId, Number(newPrice));
  };

  const handleSyncGrowwLive = () => {
    setIsGrowwUpdating(true);
    updateStockPrice('groww-itc', itcLiveCmp);
    updateStockPrice('groww-tatagold', tatagoldLiveCmp);
    setTimeout(() => {
      setIsGrowwUpdating(false);
      triggerConfetti();
    }, 300);
  };

  const handleResetGrowwOfficial = () => {
    setItcLiveCmp(257.90);
    setTatagoldLiveCmp(13.63);
    updateStockPrice('groww-itc', 257.90);
    updateStockPrice('groww-tatagold', 13.63);
    triggerConfetti();
  };

  const handleOpenAddModal = (presetCategory?: InvestmentCategory) => {
    setEditingStock(null);
    setStockName('');
    setStockSymbol('');
    setStockQuantity(10);
    setStockBuyPrice(100);
    setStockCurrentPrice(100);
    setIsStockModalOpen(true);
  };

  const handleOpenEditModal = (asset: InvestmentAsset) => {
    setEditingStock(asset);
    setStockName(asset.name);
    setStockSymbol(asset.symbolOrCode || '');
    setStockQuantity(asset.quantity || 1);
    setStockBuyPrice(asset.buyPriceAverage || asset.investedAmount);
    setStockCurrentPrice(asset.currentPrice || asset.currentValue);
    setIsStockModalOpen(true);
  };

  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockName.trim()) return;

    const invested = Number(stockQuantity) * Number(stockBuyPrice);
    const current = Number(stockQuantity) * Number(stockCurrentPrice);
    const gain = current - invested;
    const gainPct = invested > 0 ? (gain / invested) * 100 : 0;

    const stockData = {
      name: stockName.trim(),
      category: 'groww_stocks' as InvestmentCategory,
      platform: 'Groww App',
      symbolOrCode: stockSymbol.trim().toUpperCase() || undefined,
      quantity: Number(stockQuantity),
      unitType: 'shares' as const,
      buyPriceAverage: Number(stockBuyPrice),
      currentPrice: Number(stockCurrentPrice),
      investedAmount: invested,
      currentValue: current,
      unrealizedGain: gain,
      unrealizedGainPct: Number(gainPct.toFixed(2)),
      isMonthlySip: false,
      status: 'active' as const,
      colorTag: 'emerald',
      updatedAt: getLiveDateString()
    };

    if (editingStock) {
      updateInvestment(editingStock.id, stockData);
    } else {
      addInvestment(stockData);
    }

    setIsStockModalOpen(false);
    triggerConfetti();
  };

  return (
    <div className="space-y-6">
      <GrowwStocksDashboard
        investments={investments}
        growwSummary={growwSummary}
        itcLiveCmp={itcLiveCmp}
        tatagoldLiveCmp={tatagoldLiveCmp}
        setItcLiveCmp={setItcLiveCmp}
        setTatagoldLiveCmp={setTatagoldLiveCmp}
        onUpdateStockCMP={handleUpdateStockCMP}
        onResetGrowwOfficial={handleResetGrowwOfficial}
        onSyncGrowwLive={handleSyncGrowwLive}
        isGrowwUpdating={isGrowwUpdating}
        onOpenAddModal={handleOpenAddModal}
        onOpenEditModal={handleOpenEditModal}
        onDeleteInvestment={deleteInvestment}
        onBackToOverview={() => navigateToTab('investments', 'overview')}
      />

      {/* Add / Edit Stock Modal */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0E1526] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D]">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingStock ? 'Edit Groww Stock' : 'Add Stock / ETF to Groww'}
                </h3>
              </div>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Stock Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reliance Industries, HDFC Bank"
                  value={stockName}
                  onChange={(e) => setStockName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">NSE Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g. RELIANCE"
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Number of Shares *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Average Buy Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.05"
                    value={stockBuyPrice}
                    onChange={(e) => setStockBuyPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Current Market Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.05"
                    value={stockCurrentPrice}
                    onChange={(e) => setStockCurrentPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md"
                >
                  Save Stock Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
