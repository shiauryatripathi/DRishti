import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Camera, 
  Stethoscope,
  Activity,
  Bot,
  PlayCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { DrishtiLogo } from './DrishtiLogo';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  onReplayIntro?: () => void;
  activeDevices?: number;
}

export function Sidebar({ currentView, onChangeView, onReplayIntro, activeDevices = 1 }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Diagnostic Desk', icon: LayoutDashboard },
    { id: 'patients', label: 'Patient Database', icon: Users },
    { id: 'new_scan', label: 'New AI Scan', icon: Camera },
    { id: 'advisor', label: 'AI Care & Advisor', icon: Bot, highlight: true },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 shadow-2xs">
      <div className="h-18 px-5 flex items-center space-x-3 border-b border-slate-100 shrink-0">
        <div className="w-11 h-11 flex items-center justify-center shrink-0">
          <DrishtiLogo size="sm" variant="mark" />
        </div>
        <div className="overflow-hidden">
          <h1 className="font-black text-xl leading-none tracking-tight flex items-baseline">
            <span className="text-[#152047]">DR</span>
            <span className="text-[#0284c7]">ishti</span>
          </h1>
          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-1 truncate">
            SIH 2026 • Problem #26038
          </p>
        </div>
      </div>
      
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-medium relative",
              currentView === item.id 
                ? "bg-sky-50 text-sky-700 border border-sky-100 shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4",
              currentView === item.id ? "text-sky-600" : "text-slate-400"
            )} />
            <span>{item.label}</span>
            {item.highlight && (
              <span className="ml-auto text-[9px] font-bold uppercase bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded">
                Edge AI
              </span>
            )}
          </button>
        ))}

        {onReplayIntro && (
          <button
            onClick={onReplayIntro}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors mt-4"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Replay 3D Intro</span>
          </button>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-200 shrink-0 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2.5 py-1.5 rounded-md">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            P2P Realtime
          </span>
          <span>{activeDevices} screen{activeDevices > 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center space-x-3 text-slate-600 bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
          <Stethoscope className="w-4 h-4 text-sky-600" />
          <div className="text-left">
             <p className="text-xs font-bold text-slate-700">Dr. Ananya Sharma</p>
             <p className="text-[10px] text-emerald-600 font-medium">Active • Rural Unit #4</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

