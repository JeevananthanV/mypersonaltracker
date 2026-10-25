import React, { useState, useEffect } from 'react';
import { X, PlusCircle, IndianRupee, Activity, CheckSquare, BrainCircuit, Lightbulb, Calendar, Wallet, Coins } from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { ExpenseCategory, ExerciseType, PriorityLevel, TaskArea, BasicNeedCategory, PayCyclePhase, InvestmentCategory } from '../types';
import { getLiveDateString } from '../utils/date-utils';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'expense' | 'loan' | 'basic_need' | 'investment' | 'task' | 'fitness' | 'learning' | 'idea';
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, defaultType = 'expense' }) => {
  const {
    addTransaction,
    addLoanPayment,
    loanAccounts,
    addTask,
    addFitnessLog,
    logPracticeHours,
    skills,
    addIdea,
    outstandingPrincipal,
    addBasicNeed,
    addInvestment
  } = useLifeOS();

  const [entryType, setEntryType] = useState(defaultType);

  // Expense / Salary form state
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'expense' | 'salary'>('expense');
  const [txCategory, setTxCategory] = useState<ExpenseCategory>('Food & Groceries');
  const [txDate, setTxDate] = useState(getLiveDateString());
  const [txNotes, setTxNotes] = useState('');

  // Loan payment state
  const [selectedLoanId, setSelectedLoanId] = useState(loanAccounts[0]?.id || 'loan-1');
  const [loanPrincipal, setLoanPrincipal] = useState('8000');
  const [loanInterest, setLoanInterest] = useState('0');
  const [loanDate, setLoanDate] = useState(getLiveDateString());
  const [loanNotes, setLoanNotes] = useState('');

  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskArea, setTaskArea] = useState<TaskArea>('Work');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('medium');
  const [taskDue, setTaskDue] = useState(getLiveDateString());
  const [taskMinutes, setTaskMinutes] = useState('30');
  const [taskIsTopThree, setTaskIsTopThree] = useState(false);

  // Keep dates synchronized with current live date whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const liveToday = getLiveDateString();
      setTxDate(liveToday);
      setLoanDate(liveToday);
      setTaskDue(liveToday);
    }
  }, [isOpen]);

  // Fitness state
  const [fitTitle, setFitTitle] = useState('Evening Walk & Posture Stretching');
  const [fitType, setFitType] = useState<ExerciseType>('Walking + Mobility');
  const [fitDuration, setFitDuration] = useState('20');
  const [fitWalking, setFitWalking] = useState(true);
  const [fitSkipping, setFitSkipping] = useState(false);
  const [fitStretching, setFitStretching] = useState(true);
  const [fitWater, setFitWater] = useState('2.5');
  const [fitSleep, setFitSleep] = useState('7.5');
  const [fitWeight, setFitWeight] = useState('57.0');
  const [fitEnergy, setFitEnergy] = useState<'low' | 'medium' | 'high'>('high');

  // Learning practice state
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.id || '');
  const [practiceHours, setPracticeHours] = useState('1.5');

  // Idea state
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaCategory, setIdeaCategory] = useState<'AI Prompt' | 'App Idea' | 'Automation' | 'Life Note'>('AI Prompt');
  const [ideaContent, setIdeaContent] = useState('');
  const [ideaTags, setIdeaTags] = useState('ML, Career');

  // Basic Need state
  const [needName, setNeedName] = useState('');
  const [needCategory, setNeedCategory] = useState<BasicNeedCategory>('Housing');
  const [needAmount, setNeedAmount] = useState('4000');
  const [needDueDay, setNeedDueDay] = useState('5');
  const [needPhase, setNeedPhase] = useState<PayCyclePhase>('Phase 1 (Day 1-5)');
  const [needPriority, setNeedPriority] = useState<'essential' | 'flexible'>('essential');
  const [needNotes, setNeedNotes] = useState('');

  // Investment state
  const [invName, setInvName] = useState('');
  const [invCategory, setInvCategory] = useState<InvestmentCategory>('digi_gold');
  const [invPlatform, setInvPlatform] = useState('Groww');
  const [invAmount, setInvAmount] = useState('5000');
  const [invCurrentVal, setInvCurrentVal] = useState('5500');
  const [invQuantity, setInvQuantity] = useState('0.75');
  const [invUnit, setInvUnit] = useState<'grams' | 'shares' | 'units' | 'chit_tokens'>('grams');
  const [invMonthlyOutflow, setInvMonthlyOutflow] = useState('1000');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entryType === 'expense') {
      if (!txTitle || !txAmount) return;
      addTransaction({
        title: txTitle,
        amount: parseFloat(txAmount),
        type: txType,
        category: txType === 'salary' ? 'Salary' : txCategory,
        date: txDate,
        notes: txNotes
      });
    } else if (entryType === 'loan') {
      const p = parseFloat(loanPrincipal) || 0;
      const i = parseFloat(loanInterest) || 0;
      if (p <= 0 && i <= 0) return;
      const targetLoan = loanAccounts.find(l => l.id === selectedLoanId) || loanAccounts[0];
      addLoanPayment({
        loanId: targetLoan?.id || 'loan-1',
        loanName: targetLoan?.name || 'Loan',
        date: loanDate,
        openingBalance: targetLoan ? targetLoan.currentPrincipal : outstandingPrincipal,
        principalPaid: p,
        interestPaid: i,
        notes: loanNotes || `EMI payment for ${targetLoan?.name || 'Loan'}`
      });
    } else if (entryType === 'task') {
      if (!taskTitle) return;
      addTask({
        title: taskTitle,
        area: taskArea,
        priority: taskPriority,
        dueDate: taskDue,
        estimatedMinutes: parseInt(taskMinutes) || 30,
        status: 'todo',
        isTopThree: taskIsTopThree
      });
    } else if (entryType === 'fitness') {
      addFitnessLog({
        date: getLiveDateString(),
        workoutTitle: fitTitle,
        exerciseType: fitType,
        durationMin: parseInt(fitDuration) || 20,
        walking: fitWalking,
        skipping: fitSkipping,
        stretching: fitStretching,
        waterLiters: parseFloat(fitWater) || 2.5,
        sleepHours: parseFloat(fitSleep) || 7.5,
        weightKg: parseFloat(fitWeight) || 57.0,
        energy: fitEnergy
      });
    } else if (entryType === 'learning') {
      if (!selectedSkillId) return;
      logPracticeHours(selectedSkillId, parseFloat(practiceHours) || 1);
    } else if (entryType === 'idea') {
      if (!ideaTitle || !ideaContent) return;
      addIdea({
        title: ideaTitle,
        category: ideaCategory,
        content: ideaContent,
        tags: ideaTags.split(',').map(t => t.trim()).filter(Boolean)
      });
    } else if (entryType === 'basic_need') {
      if (!needName || !needAmount) return;
      addBasicNeed({
        name: needName.trim(),
        category: needCategory,
        amount: parseFloat(needAmount) || 0,
        dueDayOfMonth: parseInt(needDueDay) || 5,
        payCyclePhase: needPhase,
        priority: needPriority,
        isPaid: false,
        notes: needNotes.trim() || undefined
      });
    } else if (entryType === 'investment') {
      if (!invName || !invAmount) return;
      const amt = parseFloat(invAmount) || 0;
      const cur = parseFloat(invCurrentVal) || amt;
      const gain = cur - amt;
      const gainPct = amt > 0 ? (gain / amt) * 100 : 0;
      addInvestment({
        name: invName.trim(),
        category: invCategory,
        platform: invPlatform,
        investedAmount: amt,
        currentValue: cur,
        quantity: parseFloat(invQuantity) || 1,
        unitType: invUnit,
        buyPriceAverage: amt,
        currentPrice: cur,
        isMonthlySip: parseFloat(invMonthlyOutflow) > 0,
        monthlySipAmount: parseFloat(invMonthlyOutflow) || 0,
        chitMonthlyAmount: invCategory === 'gold_chit' || invCategory === 'silver_chit' ? parseFloat(invMonthlyOutflow) : undefined,
        chitTenureMonths: invCategory === 'gold_chit' || invCategory === 'silver_chit' ? 11 : undefined,
        chitMonthsPaid: invCategory === 'gold_chit' || invCategory === 'silver_chit' ? 1 : undefined,
        unrealizedGain: gain,
        unrealizedGainPct: Number(gainPct.toFixed(2)),
        status: 'active'
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="modal-light w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 bg-white text-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Quick Log Entry</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type selector pills */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 my-4 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setEntryType('expense')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg flex flex-col items-center justify-center space-y-1 transition-all ${
              entryType === 'expense' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Money</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryType('loan')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg flex flex-col items-center justify-center space-y-1 transition-all ${
              entryType === 'loan' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Loan</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryType('basic_need')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg flex flex-col items-center justify-center space-y-1 transition-all ${
              entryType === 'basic_need' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Needs</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryType('investment')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg flex flex-col items-center justify-center space-y-1 transition-all ${
              entryType === 'investment' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Invest</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryType('task')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg flex flex-col items-center justify-center space-y-1 transition-all ${
              entryType === 'task' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryType('fitness')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg flex flex-col items-center justify-center space-y-1 transition-all ${
              entryType === 'fitness' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Fitness</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryType('learning')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg flex flex-col items-center justify-center space-y-1 transition-all ${
              entryType === 'learning' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Learn</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryType('idea')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg flex flex-col items-center justify-center space-y-1 transition-all ${
              entryType === 'idea' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EXPENSE / SALARY */}
          {entryType === 'expense' && (
            <>
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md ${
                    txType === 'expense' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('salary')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md ${
                    txType === 'salary' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
                  }`}
                >
                  Salary / Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Groceries, Metro reload, Server bill"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="₹ Amount"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {txType === 'expense' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Food & Groceries">Food & Groceries</option>
                    <option value="Rent & Utilities">Rent & Utilities</option>
                    <option value="Learning & Courses">Learning & Courses</option>
                    <option value="Transit & Fuel">Transit & Fuel</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Personal & Leisure">Personal & Leisure</option>
                    <option value="Family & Commitments">Family & Commitments</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Additional context"
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* LOAN PAYMENT */}
          {entryType === 'loan' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Loan Account to Pay</label>
                <select
                  value={selectedLoanId}
                  onChange={(e) => setSelectedLoanId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-rose-500 font-semibold"
                >
                  {loanAccounts.map(loan => (
                    <option key={loan.id} value={loan.id}>
                      {loan.name} — Balance Due: ₹{loan.currentPrincipal.toLocaleString('en-IN')} {loan.status === 'closed' ? '(CLEARED)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const currentTarget = loanAccounts.find(l => l.id === selectedLoanId) || loanAccounts[0];
                const p = parseFloat(loanPrincipal) || 0;
                const nextBal = Math.max(0, (currentTarget?.currentPrincipal || 0) - p);
                return (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between font-semibold text-rose-300">
                      <span>{currentTarget?.name || 'Selected Loan'} Balance:</span>
                      <span>₹{(currentTarget?.currentPrincipal || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Balance After This EMI:</span>
                      <span className="font-bold text-emerald-400">₹{nextBal.toLocaleString('en-IN')}</span>
                    </div>
                    {currentTarget?.lenderNotes && (
                      <p className="text-[10px] text-amber-300/80 pt-0.5">
                        ℹ️ {currentTarget.lenderNotes}
                      </p>
                    )}
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Principal Paid (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={loanPrincipal}
                    onChange={(e) => setLoanPrincipal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-bold text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Interest Paid (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={loanInterest}
                    onChange={(e) => setLoanInterest(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-rose-400 font-bold text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-400">Total Payment:</span>
                <span className="text-base font-bold text-white">
                  ₹{((parseFloat(loanPrincipal) || 0) + (parseFloat(loanInterest) || 0)).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Payment Date</label>
                <input
                  type="date"
                  required
                  value={loanDate}
                  onChange={(e) => setLoanDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. October EMI paid via UPI"
                  value={loanNotes}
                  onChange={(e) => setLoanNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* TASK */}
          {entryType === 'task' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="What needs to be done?"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Area</label>
                  <select
                    value={taskArea}
                    onChange={(e) => setTaskArea(e.target.value as TaskArea)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Work">Work</option>
                    <option value="Learning">Learning</option>
                    <option value="Finance">Finance</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Estimated Mins</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={taskMinutes}
                    onChange={(e) => setTaskMinutes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2.5 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/25 cursor-pointer">
                <input
                  type="checkbox"
                  checked={taskIsTopThree}
                  onChange={(e) => setTaskIsTopThree(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0 w-4 h-4 bg-slate-950 border-slate-700"
                />
                <span className="text-xs font-semibold text-indigo-300">Mark as one of Today's Top 3 Priorities</span>
              </label>
            </>
          )}

          {/* FITNESS LOG */}
          {entryType === 'fitness' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={fitTitle}
                  onChange={(e) => setFitTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Movement Type</label>
                  <select
                    value={fitType}
                    onChange={(e) => setFitType(e.target.value as ExerciseType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Walking + Mobility">Walking + Mobility</option>
                    <option value="Light Skipping">Light Skipping</option>
                    <option value="Full Body Movement">Full Body Movement</option>
                    <option value="Bodyweight">Bodyweight</option>
                    <option value="Stretching">Stretching</option>
                    <option value="Rest Day">Rest Day</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    min="0"
                    value={fitDuration}
                    onChange={(e) => setFitDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={fitWalking} onChange={(e) => setFitWalking(e.target.checked)} className="rounded" />
                  <span className="text-slate-300">Walking</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={fitSkipping} onChange={(e) => setFitSkipping(e.target.checked)} className="rounded" />
                  <span className="text-slate-300">Skipping</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={fitStretching} onChange={(e) => setFitStretching(e.target.checked)} className="rounded" />
                  <span className="text-slate-300">Stretching</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Water (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fitWater}
                    onChange={(e) => setFitWater(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Sleep (Hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={fitSleep}
                    onChange={(e) => setFitSleep(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fitWeight}
                    onChange={(e) => setFitWeight(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Energy Level</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFitEnergy(lvl)}
                      className={`flex-1 py-1.5 text-xs capitalize rounded-lg border ${
                        fitEnergy === lvl ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* AI/ML PRACTICE HOURS */}
          {entryType === 'learning' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Skill / Module</label>
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {skills.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.practiceHours}/{s.targetHours}h)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Hours Practiced Today</label>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  required
                  value={practiceHours}
                  onChange={(e) => setPracticeHours(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* IDEA / NOTE */}
          {entryType === 'idea' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fine-tuning prompt for resume analysis"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select
                  value={ideaCategory}
                  onChange={(e) => setIdeaCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="AI Prompt">AI Prompt</option>
                  <option value="App Idea">App Idea</option>
                  <option value="Automation">Automation</option>
                  <option value="Life Note">Life Note</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Content / Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write prompt, ideas, notes..."
                  value={ideaContent}
                  onChange={(e) => setIdeaContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={ideaTags}
                  onChange={(e) => setIdeaTags(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* BASIC NEED REQUIREMENT */}
          {entryType === 'basic_need' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Requirement Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Room Rent, Groceries, Electricity..."
                  value={needName}
                  onChange={(e) => setNeedName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={needCategory}
                    onChange={(e) => setNeedCategory(e.target.value as BasicNeedCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Housing">Housing</option>
                    <option value="Food & Sustenance">Food & Sustenance</option>
                    <option value="Connectivity & Utilities">Connectivity & Utilities</option>
                    <option value="Transit & Fuel">Transit & Fuel</option>
                    <option value="Health & Buffer">Health & Buffer</option>
                    <option value="Family & Essential Support">Family & Essential Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="4000"
                    value={needAmount}
                    onChange={(e) => setNeedAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Day of Month</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={needDueDay}
                    onChange={(e) => setNeedDueDay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pay Cycle Phase</label>
                  <select
                    value={needPhase}
                    onChange={(e) => setNeedPhase(e.target.value as PayCyclePhase)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Phase 1 (Day 1-5)">Phase 1 (Day 1-5)</option>
                    <option value="Phase 2 (Day 6-10)">Phase 2 (Day 6-10)</option>
                    <option value="Phase 3 (Day 11-20)">Phase 3 (Day 11-20)</option>
                    <option value="Phase 4 (Day 21-30)">Phase 4 (Day 21-30)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Reminders (Optional)</label>
                <input
                  type="text"
                  placeholder="UPI auto-debit, owner name, etc."
                  value={needNotes}
                  onChange={(e) => setNeedNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </>
          )}

          {/* INVESTMENT ASSET */}
          {entryType === 'investment' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., MMTC Digital Gold, GRT 11-Mo Gold Chit, Tata Motors (Groww)..."
                  value={invName}
                  onChange={(e) => setInvName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={invCategory}
                    onChange={(e) => setInvCategory(e.target.value as InvestmentCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="digi_gold">Digital Gold (24K)</option>
                    <option value="gold_chit">Gold Chit (Shett Scheme)</option>
                    <option value="silver_chit">Silver Chit (Shett Scheme)</option>
                    <option value="groww_stocks">Groww Stocks</option>
                    <option value="mutual_funds">Mutual Funds (SIP)</option>
                    <option value="etf">Gold ETF / Index ETF</option>
                    <option value="other">Other Asset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Platform / Broker</label>
                  <input
                    type="text"
                    placeholder="Groww, GRT, Tanishq..."
                    value={invPlatform}
                    onChange={(e) => setInvPlatform(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Invested Capital (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="5000"
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Valuation (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="5500"
                    value={invCurrentVal}
                    onChange={(e) => setInvCurrentVal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="0.75"
                    value={invQuantity}
                    onChange={(e) => setInvQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Type</label>
                  <select
                    value={invUnit}
                    onChange={(e) => setInvUnit(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="grams">Grams (Gold/Silver)</option>
                    <option value="shares">Shares</option>
                    <option value="units">Units</option>
                    <option value="chit_tokens">Chit Tokens</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly SIP/Chit (₹)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={invMonthlyOutflow}
                    onChange={(e) => setInvMonthlyOutflow(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all hover:scale-[1.02]"
            >
              Save to Life OS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
