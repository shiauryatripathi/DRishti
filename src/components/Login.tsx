import React, { useState } from 'react';
import { Lock, Sparkles, KeyRound, CheckCircle } from 'lucide-react';
import { DrishtiLogo } from './DrishtiLogo';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('dr.sharma');
  const [password, setPassword] = useState('sih2026');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Supports official demo doctor credentials or admin
    if (
      (cleanUser === 'dr.sharma' && cleanPass === 'sih2026') ||
      (cleanUser === 'admin' && (cleanPass === 'admin' || cleanPass === 'sih2026'))
    ) {
      setError(false);
      onLogin();
    } else {
      setError(true);
    }
  };

  const handleQuickFill = () => {
    setUsername('dr.sharma');
    setPassword('sih2026');
    setError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 flex flex-col justify-center items-center p-4 font-sans select-none">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 relative overflow-hidden">
        
        {/* Subtle decorative top bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600" />

        {/* 3D Brand Logo */}
        <div className="flex flex-col items-center mb-6 pt-2">
          <div className="w-64 h-36 flex items-center justify-center -my-2 cursor-pointer transition-transform hover:scale-102">
            <DrishtiLogo size="lg" variant="full" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase tracking-widest text-sky-700 bg-sky-50 border border-sky-200/70 font-mono font-bold px-2.5 py-0.5 rounded-full">
              SIH 2026 • Problem #26038
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Doctor ID / Clinical Staff
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800"
              placeholder="dr.sharma"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[10px] text-sky-600 hover:text-sky-800 font-semibold cursor-pointer flex items-center gap-1 hover:underline"
              >
                <KeyRound className="w-3 h-3" />
                Fill Demo Credentials
              </button>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="text-[11px] text-red-600 font-medium bg-red-50 py-2 px-3 rounded-lg border border-red-200 flex items-center justify-between">
              <span>Invalid credentials. Use demo login below:</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="font-bold underline cursor-pointer hover:text-red-800"
              >
                Auto-fill
              </button>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 active:scale-99 text-white text-xs uppercase tracking-widest font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            Enter Diagnostic Desk
          </button>
        </form>

        {/* Footer Actions */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-2">
          <p className="text-[10px] text-slate-400 font-medium">
            MathWorks ResNet-50 • Real-time Multi-Screen Triage
          </p>
        </div>
      </div>
    </div>
  );
}
