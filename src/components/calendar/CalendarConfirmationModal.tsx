import React from 'react';
import { AlertTriangle, Check, X, Calendar, Trash2 } from 'lucide-react';

interface CalendarConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  itemCount?: number;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const CalendarConfirmationModal: React.FC<CalendarConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  itemCount,
  confirmLabel = 'Confirm Action',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30';
      case 'primary':
      default:
        return 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-[#0E1526] border border-slate-700/80 p-6 shadow-2xl text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${
            confirmVariant === 'danger' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
            confirmVariant === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            confirmVariant === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
          }`}>
            {confirmVariant === 'danger' ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">{description}</p>

            {itemCount !== undefined && itemCount > 0 && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Affects {itemCount} Google Calendar event{itemCount > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center gap-2 ${getButtonStyles()} ${
              isProcessing ? 'opacity-60 cursor-not-allowed' : 'active:scale-95'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
