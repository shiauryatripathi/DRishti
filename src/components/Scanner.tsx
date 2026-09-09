import React, { useState, useEffect } from 'react';
import { Camera, FileUp, Loader2, Search, CheckCircle, Activity, Sparkles, Cpu, ShieldCheck, AlertCircle } from 'lucide-react';
import { Patient, Scan } from '../types';
import { cn } from '../lib/utils';

export function Scanner() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | ''>('');
  
  const [mode, setMode] = useState<'upload' | 'lens'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Scan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = () => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        if (data.length > 0 && selectedPatientId === '') {
          setSelectedPatientId(data[0].id);
        }
      });
  };

  useEffect(() => {
    fetchPatients();
    
    // Auto-refresh patients if added on phone via real-time event
    const handlePatientAdded = () => fetchPatients();
    window.addEventListener('drishti:patient_added', handlePatientAdded);
    return () => window.removeEventListener('drishti:patient_added', handlePatientAdded);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError(null);
      setResult(null);
    }
  };

  const handleUploadScan = async () => {
    if (!selectedPatientId || !file) return;
    
    setIsProcessing(true);
    setError(null);
    const formData = new FormData();
    formData.append('patientId', selectedPatientId.toString());
    formData.append('fundusImage', file);

    try {
      const res = await fetch('/api/scans/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to analyze image.");
        return;
      }
      
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("A network error occurred while communicating with the local AI server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLensScan = async () => {
    if (!selectedPatientId) return;
    
    setIsProcessing(true);
    setPreviewUrl(null); // Clear previous
    setResult(null);
    
    try {
      const res = await fetch('/api/scans/simulate-lens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: selectedPatientId })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">AI Diagnostics</h2>
        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest mt-1">Upload fundus images or capture live via Adaptive Lens</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        
        {/* Patient Selection */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Select Patient Profile</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 font-medium transition-shadow"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">-- Choose a patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>PAT-{p.id.toString().padStart(4, '0')}: {p.name} (Age: {p.age})</option>
            ))}
          </select>
          {patients.length === 0 && (
            <p className="text-[10px] font-semibold text-amber-600">No patients found. Please add a patient first in the Patients tab.</p>
          )}
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200/50">
          <button 
            onClick={() => setMode('upload')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-[11px] font-bold transition-all flex items-center justify-center space-x-2 tracking-wide uppercase",
              mode === 'upload' ? "bg-white shadow-sm text-sky-700 border border-slate-200/50" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Standard Fundus</span>
          </button>
          <button 
            onClick={() => setMode('lens')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-[11px] font-bold transition-all flex items-center justify-center space-x-2 tracking-wide uppercase",
              mode === 'lens' ? "bg-sky-600 shadow-sm text-white border border-sky-600" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Adaptive Lens (Smartphone)</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="pt-2">
          {mode === 'upload' ? (
            <div className="space-y-4">
              <div className="border border-dashed border-slate-300 bg-slate-50 rounded-xl p-8 text-center hover:bg-slate-100 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="file-upload" 
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-3">
                  <div className="p-3 bg-white shadow-sm text-sky-600 rounded-lg border border-slate-200">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 mt-1">Click to upload fundus image</span>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">JPEG, PNG, max 10MB</span>
                </label>
              </div>
              
              {previewUrl && (
                <div className="rounded-lg overflow-hidden border border-slate-200 w-full max-w-sm mx-auto shadow-sm">
                  <img src={previewUrl} alt="Preview" className="w-full h-auto" />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-xs font-bold text-center">
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleUploadScan}
                disabled={!selectedPatientId || !file || isProcessing}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
              >
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> <span>Analyzing via AI...</span></>
                ) : (
                  <><Search className="w-4 h-4" /> <span>Analyze Scan</span></>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
               <div className="bg-slate-900 rounded-xl aspect-video flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group border border-slate-800">
                 {isProcessing ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 space-y-4 z-20">
                     <div className="w-[120px] h-[120px] border-2 border-dashed border-sky-400 rounded-full animate-pulse flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                     </div>
                     <p className="text-[10px] text-sky-400 font-mono font-bold tracking-widest uppercase mt-4">Capturing 30 frames...</p>
                   </div>
                 ) : (
                   <>
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <div className="w-[180px] h-[180px] border-2 border-dashed border-sky-400/50 rounded-full"></div>
                    </div>
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-white font-mono uppercase tracking-widest border border-white/10">
                      FRAME: READY
                    </div>
                    <div className="text-white/40 text-center relative z-10 flex flex-col items-center">
                      <Camera className="w-10 h-10 mb-3 opacity-60" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Position Adaptive Lens</p>
                      <p className="text-[9px] text-slate-500 mt-1.5 font-medium">Ready for 3-second high-resolution capture</p>
                    </div>
                   </>
                 )}
               </div>

               <button
                onClick={handleLensScan}
                disabled={!selectedPatientId || isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
              >
                {isProcessing ? (
                  <span>Recording...</span>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Record 3S Scan</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Analysis Complete</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded flex items-center gap-1">
                <Cpu className="w-3 h-3 text-sky-600" />
                {result.engine || 'MATLAB ResNet-50'}
              </span>
              {result.confidence && (
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                  {result.confidence}% Confidence
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Severity Grade (0.0 - 4.0)</p>
              <p className={cn(
                "text-4xl font-black",
                result.grade < 1 ? "text-emerald-500" : result.grade < 3 ? "text-amber-500" : "text-red-500"
              )}>
                {result.grade.toFixed(1)}
              </p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    result.grade < 1 ? "bg-emerald-500" : result.grade < 3 ? "bg-amber-500" : "bg-red-500"
                  )}
                  style={{ width: `${Math.min(100, (result.grade / 4) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] font-semibold text-slate-500">
                Risk Tier: <span className={cn(
                  "font-bold uppercase",
                  result.risk_tier === 'Critical' ? "text-red-600" :
                  result.risk_tier === 'High' ? "text-amber-600" : "text-emerald-600"
                )}>{result.risk_tier || (result.grade >= 3 ? 'High' : 'Moderate')}</span>
              </p>
            </div>

            <div className="col-span-2 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Clinical Diagnostic Evaluation</p>
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-slate-800 text-xs font-medium leading-relaxed">
                  {result.diagnosis}
                </div>
              </div>

              {result.clinical_action && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Rural Triage Action</p>
                  <div className="bg-sky-50/70 p-3 rounded-lg border border-sky-100 text-sky-900 text-xs font-medium">
                    {result.clinical_action}
                  </div>
                </div>
              )}
            </div>
          </div>

          {result.explainability && (
            <div className="mt-4 border-t border-slate-100 pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-800">
                  Explainability Module (MATLAB Grad-CAM on 'res5c_relu')
                </p>
              </div>
              <div className="bg-purple-50 p-3.5 rounded-lg border border-purple-100 text-purple-900 text-xs font-medium leading-relaxed">
                {result.explainability}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
