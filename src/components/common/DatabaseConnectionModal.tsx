import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  X,
  Server,
  Cloud,
  HardDrive,
  Copy,
  Check
} from 'lucide-react';
import {
  checkBackendHealth,
  HealthResponse,
  getApiBaseUrl,
  getCustomApiUrl,
  setCustomApiUrl
} from '../../services/api';

interface DatabaseConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshHealth: () => void;
}

export const DatabaseConnectionModal: React.FC<DatabaseConnectionModalProps> = ({
  isOpen,
  onClose,
  onRefreshHealth
}) => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [testing, setTesting] = useState(false);
  const [customUrl, setCustomUrlState] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomUrlState(getCustomApiUrl());
      runCheck();
    }
  }, [isOpen]);

  const runCheck = async (overrideUrl?: string) => {
    setTesting(true);
    setTestResult(null);
    const start = performance.now();
    const res = await checkBackendHealth(overrideUrl);
    const elapsed = Math.round(performance.now() - start);
    setHealth(res);
    setTesting(false);

    if (res?.database?.connected) {
      setTestResult({
        success: true,
        message: `Connected to MongoDB Atlas (${res.database.dbName}) in ${elapsed}ms!`
      });
    } else if (res) {
      setTestResult({
        success: false,
        message: `Express API reached on ${elapsed}ms, but MongoDB Atlas is still connecting...`
      });
    } else {
      setTestResult({
        success: false,
        message: 'Could not reach backend API endpoint. Check URL or verify server is running.'
      });
    }
  };

  const handleSaveCustomUrl = async () => {
    const trimmed = customUrl.trim();
    setTesting(true);
    const res = await checkBackendHealth(trimmed || undefined);
    setTesting(false);

    if (res?.database?.connected) {
      setCustomApiUrl(trimmed);
      setHealth(res);
      setTestResult({
        success: true,
        message: `Saved & Connected! Atlas database (${res.database.dbName}) is now live.`
      });
      onRefreshHealth();
    } else if (res) {
      setCustomApiUrl(trimmed);
      setHealth(res);
      setTestResult({
        success: false,
        message: 'Saved URL! Express server is online, awaiting MongoDB handshake.'
      });
      onRefreshHealth();
    } else {
      setTestResult({
        success: false,
        message: `Cannot reach ${trimmed || 'default URL'}/api/health. Please verify the URL.`
      });
    }
  };

  const handleResetToDefault = () => {
    setCustomApiUrl('');
    setCustomUrlState('');
    runCheck();
    onRefreshHealth();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const currentApiUrl = getApiBaseUrl();
  const isAtlasConnected = Boolean(health?.database?.connected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-xl ${
                isAtlasConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Database & Backend Status</h3>
              <p className="text-xs text-slate-400">Jeeva's Life OS Data Synchronization Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Current Status Pill Card */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isAtlasConnected
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  isAtlasConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <div>
                <div className="text-sm font-semibold">
                  {isAtlasConnected ? 'MongoDB Atlas Connected' : 'Local Storage Mode (Cache Active)'}
                </div>
                <div className="text-xs opacity-80">
                  {isAtlasConnected
                    ? `Database: ${health?.database.dbName || 'jeeva_life_os'} • Cloud sync enabled`
                    : 'Running offline-first. All data is securely stored in your local browser storage.'}
                </div>
              </div>
            </div>
            <button
              onClick={() => runCheck()}
              disabled={testing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>Ping</span>
            </button>
          </div>

          {/* Active Backend Endpoint */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                <span>Active Target API Endpoint:</span>
              </span>
              <span className="font-mono text-slate-300">{currentApiUrl}</span>
            </div>

            {/* Test result banner */}
            {testResult && (
              <div
                className={`text-xs p-2.5 rounded-lg flex items-center space-x-2 ${
                  testResult.success
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Cloud API URL Configuration for Netlify */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>Custom Cloud Backend URL (e.g. Render / Railway):</span>
              </label>
              {customUrl && (
                <button
                  onClick={handleResetToDefault}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Reset to Default
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrlState(e.target.value)}
                placeholder="https://jeeva-life-os-api.onrender.com"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSaveCustomUrl}
                disabled={testing}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs transition-colors shrink-0 flex items-center space-x-1.5"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Save & Connect</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If you have deployed your Express backend on <strong>Render.com</strong> or <strong>Railway.app</strong>, paste the public URL above to connect your Netlify frontend directly!
            </p>
          </div>

          {/* Quick Guide for Netlify Deployment */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span>How Netlify Connects to MongoDB Atlas:</span>
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    'mongodb+srv://jeevananthanjeeva170902_db_user:GoMr3MKte7XKQ1CF@cluster0.pfth5pc.mongodb.net'
                  )
                }
                className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300"
                title="Copy MongoDB Atlas URI"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied URI' : 'Copy Mongo URI'}</span>
              </button>
            </div>
            <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>
                Netlify serves only the static frontend (HTML/JS). It cannot run Node.js backend processes directly.
              </li>
              <li>
                Deploy the <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">server</code> folder to <a href="https://render.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center">Render <ExternalLink className="w-2.5 h-2.5 ml-0.5 inline" /></a> or Railway.
              </li>
              <li>
                Add the backend URL to Netlify environment variable <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">VITE_API_URL</code> or paste it in the box above.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Offline Mode is always active to prevent any data loss.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
