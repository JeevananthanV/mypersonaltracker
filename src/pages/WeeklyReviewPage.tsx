import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Sparkles,
  Trophy,
  AlertCircle,
  TrendingUp,
  Star,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';

export const WeeklyReviewPage: React.FC = () => {
  const {
    weeklyReviews,
    addWeeklyReview,
    deleteWeeklyReview,
    triggerConfetti,
    transactions,
    loanPayments,
    weeklyWorkoutsCount
  } = useLifeOS();

  const [newReviewOpen, setNewReviewOpen] = useState(false);

  // Form state for Sunday review
  const [weekRange, setWeekRange] = useState('Oct 12 - Oct 18, 2026');
  const [completedSummary, setCompletedSummary] = useState('');
  const [skillsLearned, setSkillsLearned] = useState('');
  const [whatWentWrong, setWhatWentWrong] = useState('');
  const [priority1, setPriority1] = useState('');
  const [priority2, setPriority2] = useState('');
  const [priority3, setPriority3] = useState('');
  const [win1, setWin1] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedSummary || !priority1) return;

    addWeeklyReview({
      weekRange,
      completedSummary,
      skillsLearned,
      totalSpent: 12400,
      totalRepaid: 16000,
      exerciseSessions: weeklyWorkoutsCount,
      whatWentWrong,
      nextWeekPriorities: [priority1, priority2, priority3],
      wins: win1 ? [win1] : ['Maintained weekly tracking & loan consistency'],
      rating
    });

    setCompletedSummary('');
    setSkillsLearned('');
    setWhatWentWrong('');
    setPriority1('');
    setPriority2('');
    setPriority3('');
    setWin1('');
    setNewReviewOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <CalendarCheck className="w-7 h-7 text-amber-400" />
            <span>Sunday Weekly Review</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            20 minutes every Sunday to review spending, repayments, AI/ML practice hours, blockers, and next week's focus.
          </p>
        </div>

        <button
          onClick={() => setNewReviewOpen(!newReviewOpen)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{newReviewOpen ? 'Close Review Form' : 'New Sunday Review'}</span>
        </button>
      </div>

      {/* Wins Showcase Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/20">
        <div className="flex items-center space-x-2 text-amber-400 mb-3">
          <Trophy className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-100">🏆 Wins & Key Achievements Vault</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-2.5">
            <span className="text-lg">🎯</span>
            <div>
              <span className="font-bold text-white block">Loan Milestone Progress</span>
              <p className="text-slate-400 mt-0.5">Over ₹46,000 principal cleared towards the first ₹1L EMI discount!</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-2.5">
            <span className="text-lg">💪</span>
            <div>
              <span className="font-bold text-white block">Paced Movement Consistency</span>
              <p className="text-slate-400 mt-0.5">3 workouts completed with zero shaking by avoiding heavy strain.</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-2.5">
            <span className="text-lg">🚀</span>
            <div>
              <span className="font-bold text-white block">AI/ML Engineering</span>
              <p className="text-slate-400 mt-0.5">Built convolutional model & Scikit pipeline with cross-validation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Wizard Form */}
      {newReviewOpen && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Sunday Operating Reflection</span>
            </h2>
            <input
              type="text"
              value={weekRange}
              onChange={e => setWeekRange(e.target.value)}
              className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">1. What did I complete?</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Key tasks, client updates, features delivered..."
                  value={completedSummary}
                  onChange={e => setCompletedSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">2. What did I learn in AI/ML?</label>
                <textarea
                  rows={3}
                  required
                  placeholder="New libraries, algorithms, theory mastered..."
                  value={skillsLearned}
                  onChange={e => setSkillsLearned(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">3. What went wrong / biggest blocker?</label>
              <textarea
                rows={2}
                placeholder="Time management slip, fatigue, unexpected bugs..."
                value={whatWentWrong}
                onChange={e => setWhatWentWrong(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">4. Next Week's Top 3 Priorities</label>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Priority #1 (Most crucial work or career task)"
                  value={priority1}
                  onChange={e => setPriority1(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
                <input
                  type="text"
                  placeholder="Priority #2 (AI/ML learning or project deliverable)"
                  value={priority2}
                  onChange={e => setPriority2(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
                <input
                  type="text"
                  placeholder="Priority #3 (Fitness, personal, or financial task)"
                  value={priority3}
                  onChange={e => setPriority3(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">5. Win to Celebrate</label>
              <input
                type="text"
                placeholder="One accomplishment to celebrate this week"
                value={win1}
                onChange={e => setWin1(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setNewReviewOpen(false)}
                className="px-4 py-2 text-slate-400 hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg"
              >
                Save Weekly Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Past Reviews Archive */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100">Past Weekly Reviews</h2>
        {weeklyReviews.map(r => (
          <div key={r.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-white">{r.weekRange}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-semibold">
                  5/5 Rating
                </span>
              </div>
              <button
                onClick={() => deleteWeeklyReview(r.id)}
                className="p-1 rounded text-slate-500 hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-slate-300 block mb-1">What was completed:</span>
                <p className="text-slate-400 leading-relaxed">{r.completedSummary}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-cyan-300 block mb-1">AI/ML Learnings:</span>
                <p className="text-slate-400 leading-relaxed">{r.skillsLearned}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="font-bold text-indigo-300 block mb-2">Next Week Priorities:</span>
              <div className="space-y-1">
                {r.nextWeekPriorities.map((p, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
