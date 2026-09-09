import React, { useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { DrishtiLogo } from './DrishtiLogo';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication for hackathon MVP demo
    if (username.toLowerCase() === 'dr.sharma' && password === 'sih2026') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
        
        {/* 3D Brand Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-64 h-36 flex items-center justify-center -my-2">
            <DrishtiLogo size="lg" variant="full" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-sky-700 bg-sky-50 border border-sky-200/70 font-mono font-bold px-2.5 py-0.5 rounded-full mt-1">
            Smart India Hackathon 2026 • #26038
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Doctor ID</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
              placeholder="e.g., dr.sharma"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-[11px] text-red-500 font-bold tracking-wide text-center bg-red-50 py-1.5 rounded-md border border-red-100">
              Invalid credentials. Demo account: <code>dr.sharma</code> / <code>sih2026</code>
            </p>
          )}

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs uppercase tracking-widest font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-3 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            Enter Diagnostic Desk
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 pt-5">
          <p className="text-[11px] text-slate-400 font-medium">
            MathWorks ResNet-50 • Real-time Triage Network
          </p>
        </div>
      </div>
    </div>
  );
}
