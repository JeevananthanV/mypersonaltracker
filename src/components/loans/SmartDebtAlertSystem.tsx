import React, { useState, useMemo, useCallback } from 'react';
import {
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Settings,
  Volume2,
  VolumeX,
  X,
  Send
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { getLiveDateString, getLiveMonthString } from '../../utils/date-utils';

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'milestone';

export interface SmartDebtAlert {
  id: string;
  loanId?: string;
  loanName?: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  type: 'missed_payment' | 'due_soon' | 'milestone_approaching' | 'interest_drop';
  dueDate?: string;
  daysDiff?: number; // negative = days overdue, positive = days remaining
  amount?: number;
  actionText?: string;
  createdAt: string;
  snoozedUntil?: number; // timestamp
  isDismissed?: boolean;
}

interface SmartDebtAlertSystemProps {
  className?: string;
  onPayLoanClick?: (loanId?: string) => void;
}

export const SmartDebtAlertSystem: React.FC<SmartDebtAlertSystemProps> = ({
  className = '',
  onPayLoanClick
}) => {
  const {
    loanAccounts,
    loanPayments,
    addLoanPayment,
    firstLakhProgress,
    outstandingPrincipal,
    openQuickAdd,
    triggerConfetti
  } = useLifeOS();

  // Notification state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [leadDays, setLeadDays] = useState(5); // Alert 5 days before due date
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jeeva_dismissed_debt_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [toastAlert, setToastAlert] = useState<SmartDebtAlert | null>(null);

  // Play synthetic audio chime without external mp3 files
  const playAlertChime = useCallback((severity: AlertSeverity = 'warning') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (severity === 'critical') {
        // Urgent dual alert tone
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(330, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else if (severity === 'milestone') {
        // Uplifting major triad chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } else {
        // Soft notification ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      // AudioContext may be restricted by autoplay policy
    }
  }, [soundEnabled]);

  // Request browser Notification permission
  const requestPushPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Push Notifications are not supported by this browser environment.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        playAlertChime('milestone');
        triggerConfetti();
        dispatchPushNotification({
          id: 'test-perm-' + Date.now(),
          title: 'Smart Debt Alerts Activated! 🚀',
          message: 'You will receive immediate alerts for approaching milestones and overdue EMI payments.',
          severity: 'milestone',
          type: 'milestone_approaching',
          createdAt: getLiveDateString()
        });
      }
    } catch (e) {
      console.error('Failed to request notification permission', e);
    }
  };

  // Dispatch real browser push notification
  const dispatchPushNotification = useCallback((alertItem: SmartDebtAlert) => {
    // 1. In-App Toast
    setToastAlert(alertItem);
    setTimeout(() => {
      setToastAlert(prev => prev?.id === alertItem.id ? null : prev);
    }, 6000);

    // 2. Play Audio Cue
    playAlertChime(alertItem.severity);

    // 3. Browser Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const iconEmoji = alertItem.severity === 'critical' ? '⚠️' : alertItem.severity === 'milestone' ? '🎉' : '🔔';
        const notif = new Notification(`${iconEmoji} ${alertItem.title}`, {
          body: alertItem.message,
          tag: alertItem.id,
          requireInteraction: alertItem.severity === 'critical'
        });

        notif.onclick = () => {
          window.focus();
          setIsAlertDrawerOpen(true);
          notif.close();
        };
      } catch (err) {
        console.warn('Native push notification error', err);
      }
    }
  }, [playAlertChime]);

  // Generate real-time alerts based on active loans and current date (2026-10-27)
  const activeAlerts = useMemo<SmartDebtAlert[]>(() => {
    const today = new Date();
    const currentDay = today.getDate(); // e.g. 27
    const currentMonthStr = getLiveMonthString(today); // e.g. 2026-10
    const list: SmartDebtAlert[] = [];

    // Filter to the 3 active loans
    const loans = loanAccounts.slice(0, 3);

    loans.forEach((loan) => {
      if (loan.status === 'closed' || loan.currentPrincipal <= 0) return;

      const lenderName = loan.lender || loan.name || 'Personal Loan';
      const dueDay = loan.dueDayOfMonth || 5;
      const emiAmount = loan.monthlyEmi || 8000;

      // Check if a payment has been recorded for this loan in the current month (2026-10)
      const hasPaidCurrentMonth = loanPayments.some(p => {
        const isMatch = p.loanId === loan.id || 
          p.loanName?.toLowerCase() === loan.name.toLowerCase() || 
          (loan.lender && p.loanName?.toLowerCase().includes(loan.lender.toLowerCase()));
        const isThisMonth = p.date.startsWith(currentMonthStr);
        return isMatch && isThisMonth;
      });

      // 1. MISSED / OVERDUE PAYMENT ALERT
      // If today is past the due day and no payment was recorded this month
      if (currentDay > dueDay && !hasPaidCurrentMonth) {
        const daysOverdue = currentDay - dueDay;
        list.push({
          id: `missed-${loan.id}-${currentMonthStr}`,
          loanId: loan.id,
          loanName: lenderName,
          title: `Overdue EMI: ${lenderName} (${daysOverdue} Days Past Due)`,
          message: `Monthly EMI of ₹${emiAmount.toLocaleString('en-IN')} was due on the ${dueDay}th of ${today.toLocaleDateString('en-US', { month: 'short' })}. No payment logged for this cycle!`,
          severity: 'critical',
          type: 'missed_payment',
          dueDate: `${currentMonthStr}-${String(dueDay).padStart(2, '0')}`,
          daysDiff: -daysOverdue,
          amount: emiAmount,
          actionText: 'Log EMI Payment',
          createdAt: getLiveDateString(today)
        });
      }

      // 2. APPROACHING DUE DATE ALERT (For upcoming next month cycle)
      // E.g. Hand Loan (due 1st) is in 5 days (Nov 1)
      const daysUntilNextMonthDue = (31 - currentDay) + dueDay;
      if (daysUntilNextMonthDue > 0 && daysUntilNextMonthDue <= leadDays) {
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthName = nextMonth.toLocaleDateString('en-US', { month: 'short' });

        list.push({
          id: `due-soon-${loan.id}-${nextMonthName}`,
          loanId: loan.id,
          loanName: lenderName,
          title: `Upcoming EMI: ${lenderName} (Due in ${daysUntilNextMonthDue} Days)`,
          message: `Fixed installment of ₹${emiAmount.toLocaleString('en-IN')} due on ${nextMonthName} ${dueDay}. Prepare buffer from salary.`,
          severity: 'warning',
          type: 'due_soon',
          dueDate: `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-${String(dueDay).padStart(2, '0')}`,
          daysDiff: daysUntilNextMonthDue,
          amount: emiAmount,
          actionText: 'Prepare Payment',
          createdAt: getLiveDateString(today)
        });
      }
    });

    // 3. MILESTONE ALERTS
    // Hand Loan Freedom Milestone (Loan 3 has only ₹40k principal!)
    const handLoan = loans.find(l => l.id === 'loan-3' || l.loanType?.includes('Hand') || l.originalPrincipal <= 50000);
    if (handLoan && handLoan.currentPrincipal > 0) {
      const handLoanName = handLoan.lender || handLoan.name || 'Hand Loan';
      list.push({
        id: `milestone-handloan-freedom`,
        loanId: handLoan.id,
        loanName: handLoanName,
        title: `Milestone: ₹40k Away from Complete Hand Loan Freedom!`,
        message: `Clearing Loan 3 completely eliminates ₹2,000/month fixed interest permanently. Single fastest win!`,
        severity: 'milestone',
        type: 'milestone_approaching',
        amount: handLoan.currentPrincipal,
        actionText: 'Accelerate Paydown',
        createdAt: getLiveDateString(today)
      });
    }

    // First ₹1 Lakh Milestone Alert
    if (firstLakhProgress < 100) {
      list.push({
        id: `milestone-1-lakh-interest-drop`,
        title: `Agreement Milestone: First ₹1 Lakh Reduction (${firstLakhProgress.toFixed(0)}%)`,
        message: `Clearing the first ₹1,00,000 principal permanently drops monthly outflow by ₹2,000/mo!`,
        severity: 'info',
        type: 'interest_drop',
        amount: 100000,
        actionText: 'View Waterfall',
        createdAt: getLiveDateString(today)
      });
    }

    return list.filter(a => !dismissedAlertIds.includes(a.id));
  }, [loanAccounts, loanPayments, leadDays, firstLakhProgress, dismissedAlertIds]);

  // Critical alerts count (missed payments)
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = activeAlerts.filter(a => a.severity === 'warning').length;
  const milestoneCount = activeAlerts.filter(a => a.severity === 'milestone' || a.severity === 'info').length;

  const dismissAlert = (id: string) => {
    const updated = [...dismissedAlertIds, id];
    setDismissedAlertIds(updated);
    try {
      localStorage.setItem('jeeva_dismissed_debt_alerts', JSON.stringify(updated));
    } catch {}
  };

  const handleAction = (alert: SmartDebtAlert) => {
    if (alert.type === 'missed_payment' || alert.type === 'due_soon') {
      if (onPayLoanClick) {
        onPayLoanClick(alert.loanId);
      } else {
        openQuickAdd('loan');
      }
    } else {
      setIsAlertDrawerOpen(true);
    }
  };

  // Test push notification trigger
  const triggerTestAlert = () => {
    const testAlert: SmartDebtAlert = {
      id: 'test-debt-alert-' + Date.now(),
      title: 'Smart Debt Alert: Hand Loan Milestone Approaching! 🎯',
      message: 'You have only ₹40,000 remaining on Loan 3. Clearing it will eliminate ₹2,000/mo interest immediately!',
      severity: 'milestone',
      type: 'milestone_approaching',
      createdAt: getLiveDateString()
    };
    dispatchPushNotification(testAlert);
  };

  return (
    <div className={`relative ${className}`}>
      {/* 1. PERSISTENT SMART DEBT ALERT BANNER */}
      {activeAlerts.length > 0 && (
        <div className={`p-4 rounded-2xl border transition-all ${
          criticalCount > 0
            ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/30'
            : warningCount > 0
              ? 'bg-amber-950/30 border-amber-500/40'
              : 'bg-indigo-950/30 border-indigo-500/40'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Alert Message Info */}
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                criticalCount > 0
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : warningCount > 0
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {criticalCount > 0 ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : warningCount > 0 ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    criticalCount > 0
                      ? 'bg-rose-500 text-slate-950'
                      : warningCount > 0
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-500 text-slate-950'
                  }`}>
                    {criticalCount > 0 ? `⚠️ ${criticalCount} Payment Overdue` : warningCount > 0 ? `🔔 Due in ${leadDays} Days` : `🎯 Milestone Alert`}
                  </span>

                  <span className="text-xs font-bold text-white">
                    {activeAlerts[0]?.title}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {activeAlerts[0]?.message}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              {activeAlerts[0]?.actionText && (
                <button
                  onClick={() => handleAction(activeAlerts[0])}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ${
                    criticalCount > 0
                      ? 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                  }`}
                >
                  <span>{activeAlerts[0].actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* View All Alerts Button */}
              <button
                onClick={() => setIsAlertDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                <span>Alerts ({activeAlerts.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. FLOATING IN-APP TOAST ALERT POPUP */}
      {toastAlert && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm p-4 rounded-2xl bg-slate-900 border border-indigo-500 shadow-2xl animate-in slide-in-from-bottom duration-300 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{toastAlert.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toastAlert.message}</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  handleAction(toastAlert);
                  setToastAlert(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold"
              >
                View Action
              </button>
              <button
                onClick={() => setToastAlert(null)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            onClick={() => setToastAlert(null)}
            className="text-slate-500 hover:text-slate-300 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. EXPANDABLE ALERT CENTER DRAWER / MODAL */}
      {isAlertDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-[#0E1526] border border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Smart Debt Alert Center</h3>
                  <p className="text-xs text-slate-400">Active payoff monitors, milestone trackers & overdue EMI detectors</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                    isSettingsOpen ? 'bg-slate-800 text-white border-slate-600' : 'text-slate-400 hover:text-white border-slate-800'
                  }`}
                  title="Alert Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAlertDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification Permission Banner */}
            <div className="p-3.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Bell className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  Push Status:{' '}
                  <strong className={`capitalize ${
                    notificationPermission === 'granted' ? 'text-emerald-400' : notificationPermission === 'denied' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {notificationPermission === 'granted' ? 'Active & Delivering' : notificationPermission}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {notificationPermission !== 'granted' ? (
                  <button
                    onClick={requestPushPermission}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shadow-sm transition-all"
                  >
                    Enable Browser Push
                  </button>
                ) : (
                  <button
                    onClick={triggerTestAlert}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 flex items-center gap-1 transition-all"
                  >
                    <Send className="w-3 h-3 text-emerald-400" />
                    <span>Send Test Push</span>
                  </button>
                )}

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    soundEnabled ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-slate-500 border-slate-800'
                  }`}
                  title={soundEnabled ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Quick Settings Panel (Collapsible) */}
            {isSettingsOpen && (
              <div className="p-4 bg-slate-950/90 border-b border-slate-800 text-xs space-y-3">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-indigo-400" />
                  Alert Threshold Settings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Lead Time Warning for Due EMIs:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 3, 5, 7].map(days => (
                        <button
                          key={days}
                          onClick={() => setLeadDays(days)}
                          className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-colors ${
                            leadDays === days ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {days} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Audio Notification:
                    </label>
                    <button
                      onClick={() => {
                        setSoundEnabled(!soundEnabled);
                        playAlertChime('warning');
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                    >
                      {soundEnabled ? '🔊 Sound Enabled (Click to test)' : '🔇 Sound Disabled'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Alerts List Body */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {activeAlerts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-slate-300 font-semibold">Zero Overdue Payments & All Milestones On Track!</p>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Your loans are currently in good standing. New alerts will be delivered when an EMI date nears or milestone approaches.
                  </p>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : alert.severity === 'warning'
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : alert.severity === 'milestone'
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-indigo-950/20 border-indigo-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                        alert.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400'
                          : alert.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-400'
                            : alert.severity === 'milestone'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {alert.severity === 'critical' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : alert.severity === 'warning' ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-white">{alert.title}</span>
                          {alert.daysDiff !== undefined && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                              alert.daysDiff < 0 ? 'bg-rose-500 text-slate-950' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {alert.daysDiff < 0 ? `${Math.abs(alert.daysDiff)}d Overdue` : `In ${alert.daysDiff}d`}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{alert.message}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {alert.actionText && (
                        <button
                          onClick={() => {
                            handleAction(alert);
                            setIsAlertDrawerOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            alert.severity === 'critical'
                              ? 'bg-rose-500 hover:bg-rose-400 text-slate-950'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {alert.actionText}
                        </button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs border border-slate-800"
                        title="Dismiss alert"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                {activeAlerts.length} total monitored debt triggers
              </span>
              <button
                onClick={() => setIsAlertDrawerOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
              >
                Close Center
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
