import React, { useEffect, useState } from 'react';
import { Scan } from '../types';
import { Activity, Clock, FileText, Cpu, CheckCircle2, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useRealtimeSync } from '../lib/useRealtimeSync';

interface DashboardProps {
  onNavigateToScan?: () => void;
  onNavigateToAdvisor?: () => void;
}

export function Dashboard({ onNavigateToScan, onNavigateToAdvisor }: DashboardProps) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [newScanAlert, setNewScanAlert] = useState<string | null>(null);

  const fetchScans = () => {
    fetch('/api/dashboard/scans')
      .then(res => res.json())
      .then(data => {
        setScans(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  // Real-time synchronization
  const { isConnected, activeDevices } = useRealtimeSync({
    onScanCompleted: (newScan) => {
      setScans(prev => [newScan, ...prev.filter(s => s.id !== newScan.id)]);
      setNewScanAlert(`⚡ Real-time Scan: New diagnosis for ${newScan.patient_name || 'Patient'} received!`);
      setTimeout(() => setNewScanAlert(null), 4000);
    }
  });

  useEffect(() => {
    fetchScans();

    const handleRealtimeScan = () => fetchScans();
    window.addEventListener('drishti:scan_completed', handleRealtimeScan);
    return () => window.removeEventListener('drishti:scan_completed', handleRealtimeScan);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center text-slate-500 text-sm font-medium">
        Loading clinical dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col space-y-5">
      
      {/* Real-time Alert */}
      {newScanAlert && (
        <div className="bg-sky-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-200" />
            <span>{newScanAlert}</span>
          </div>
          <span className="text-[10px] font-mono uppercase opacity-80">Synced Live</span>
        </div>
      )}

      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Diagnostic Desk
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              MathWorks ResNet-50
            </span>
          </h2>
          <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">
            SIH 2026 #26038 • Real-time Multi-Device Triage Stream
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-700">
            P2P Sync: <strong className="text-emerald-700">{activeDevices} Screen{activeDevices > 1 ? 's' : ''}</strong> Online
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5 tracking-wider">
            <Activity className="w-3.5 h-3.5 text-sky-600" />
            Total Screenings
          </p>
          <p className="text-3xl font-black text-slate-800">{scans.length}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5 tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            AI Diagnostic Engine
          </p>
          <p className="text-xs font-bold text-slate-800 mt-1">MATLAB Deep Learning</p>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">CLAHE + ResNet-50 + Grad-CAM</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5 tracking-wider">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Cohort Avg Severity
          </p>
          <p className="text-3xl font-black text-emerald-600">
            {scans.length > 0 ? (scans.reduce((acc, s) => acc + s.grade, 0) / scans.length).toFixed(1) : '0.0'}
            <span className="text-xs font-semibold text-slate-400 ml-1">/ 4.0</span>
          </p>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Recent Retinal Diagnostic Records
          </h3>
          <span className="text-[10px] font-mono text-sky-600 font-bold">
            Live Stream
          </span>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-200">
                <th className="px-5 py-3 font-bold bg-slate-50">Patient</th>
                <th className="px-5 py-3 font-bold bg-slate-50">Method</th>
                <th className="px-5 py-3 font-bold bg-slate-50">Date</th>
                <th className="px-5 py-3 font-bold bg-slate-50">Severity Grade</th>
                <th className="px-5 py-3 font-bold bg-slate-50">Diagnostic Evaluation</th>
                <th className="px-5 py-3 font-bold bg-slate-50 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {scans.map((scan) => (
                <tr 
                  key={scan.id} 
                  className="hover:bg-sky-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedScan(scan)}
                >
                  <td className="px-5 py-3 font-bold text-sky-900 whitespace-nowrap">
                    {scan.patient_name || `Patient #${scan.patient_id}`}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-0.5 rounded border text-[10px] font-bold uppercase",
                      scan.scan_type === 'UPLOAD' ? "bg-white border-slate-200 text-slate-600" : "bg-sky-50 border-sky-200 text-sky-700 shadow-2xs"
                    )}>
                      {scan.scan_type === 'UPLOAD' ? 'Standard Fundus' : 'Adaptive Lens'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 font-medium whitespace-nowrap">
                    {new Date(scan.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-black text-sm",
                        scan.grade < 1 ? "text-emerald-500" : scan.grade < 3 ? "text-amber-500" : "text-red-500"
                      )}>
                        {scan.grade.toFixed(1)}
                      </span>
                      <span className={cn(
                        "text-[9px] font-bold uppercase px-1.5 py-0.2 rounded",
                        scan.grade < 1 ? "bg-emerald-50 text-emerald-700" :
                        scan.grade < 3 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                      )}>
                        {scan.grade < 1 ? 'No DR' : scan.grade < 2 ? 'Mild' : scan.grade < 3 ? 'Moderate' : 'Severe'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-700 truncate max-w-sm">
                    {scan.diagnosis}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScan(scan);
                      }}
                      className="text-sky-600 hover:text-sky-800 font-bold text-[11px] inline-flex items-center gap-1"
                    >
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {scans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500 text-sm">
                    No scans found. Start by conducting a new AI scan on your mobile or desktop.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Scan Detail Modal / Popover */}
      {selectedScan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedScan.patient_name || `Patient #${selectedScan.patient_id}`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Scan ID: #{selectedScan.id} • {new Date(selectedScan.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Severity Grade</span>
                <span className={cn(
                  "text-2xl font-black",
                  selectedScan.grade < 1 ? "text-emerald-500" : selectedScan.grade < 3 ? "text-amber-500" : "text-red-500"
                )}>
                  {selectedScan.grade.toFixed(1)} / 4.0
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">AI Engine</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">
                  {selectedScan.engine || 'MATLAB ResNet-50'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Clinical Diagnosis</h4>
              <p className="text-xs text-slate-700 bg-white border border-slate-200 p-3 rounded-lg leading-relaxed">
                {selectedScan.diagnosis}
              </p>
            </div>

            {selectedScan.explainability && (
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-700">MATLAB Grad-CAM Explainability</h4>
                <p className="text-xs text-purple-900 bg-purple-50/70 border border-purple-100 p-3 rounded-lg leading-relaxed">
                  {selectedScan.explainability}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {onNavigateToAdvisor && (
                <button
                  onClick={() => {
                    setSelectedScan(null);
                    onNavigateToAdvisor();
                  }}
                  className="flex-1 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Get Diet & Remedies in Advisor</span>
                </button>
              )}
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
