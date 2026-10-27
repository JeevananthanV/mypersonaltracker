import React from 'react';
import { Calendar, CheckCircle2, ShieldCheck, RefreshCw, LogOut, Bell, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleSignInBannerProps {
  user: User | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  totalSyncedEvents?: number;
}

export const GoogleSignInBanner: React.FC<GoogleSignInBannerProps> = ({
  user,
  isAuthenticated,
  isAuthenticating,
  onSignIn,
  onSignOut,
  onRefresh,
  isRefreshing = false,
  totalSyncedEvents = 0,
}) => {
  if (isAuthenticated && user) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E1526] via-[#131D31] to-[#0E1526] border border-emerald-500/30 p-5 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Google Account'}
                className="w-13 h-13 rounded-2xl border-2 border-emerald-500/40 object-cover shadow-lg"
              />
            ) : (
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {(user.displayName || user.email || 'J')[0].toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-white text-base sm:text-lg">
                  {user.displayName || 'Google Calendar Connected'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Synced
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <strong className="text-white font-mono">{totalSyncedEvents}</strong> events active
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  Reminders enabled
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
              title="Refresh calendar events"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/60 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 text-xs font-semibold border border-slate-700/60 hover:border-rose-500/30 transition-all active:scale-95"
              title="Disconnect Google Calendar"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Signed out state: Official Google Sign In button styling
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B101D] via-[#10182C] to-[#0B101D] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Google Workspace Calendar Integration</span>
          </div>
          <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
            Sync Jeeva's Chits, AI Modules & Workouts to Google Calendar
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Connect your Google account to automatically schedule chit payment deadlines (GRT 11-M, Saravana 20-M, Offline Chit), AI/ML study milestones, daily tasks, and fitness workout loads. Get automated popup reminders and mark items completed directly.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>In-memory secure token (Never stored on disk)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>15m & 24h Due Date Alerts</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Live Completion Status Sync</span>
            </div>
          </div>
        </div>

        {/* Official Google Sign-in Button */}
        <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
          <button
            onClick={onSignIn}
            disabled={isAuthenticating}
            className="group relative inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm shadow-xl shadow-indigo-950/50 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {/* Official Google 'G' Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <span>{isAuthenticating ? 'Connecting...' : 'Sign in with Google'}</span>
          </button>
          <span className="text-[11px] text-slate-400">
            Requires Google Calendar permissions
          </span>
        </div>
      </div>
    </div>
  );
};
