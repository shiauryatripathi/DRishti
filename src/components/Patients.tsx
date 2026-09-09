import React, { useState, useEffect } from 'react';
import { Patient, Scan } from '../types';
import { 
  Users, 
  UserPlus, 
  Radio, 
  Phone, 
  MapPin, 
  Activity, 
  Droplet, 
  Heart, 
  Search, 
  Clock, 
  Eye, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useRealtimeSync } from '../lib/useRealtimeSync';

export function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientScans, setPatientScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [diabetesYears, setDiabetesYears] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [hba1c, setHba1c] = useState('');
  const [systolicBp, setSystolicBp] = useState('');
  const [diastolicBp, setDiastolicBp] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  // Hook for real-time multi-device sync
  const { isConnected, activeDevices } = useRealtimeSync({
    onPatientAdded: (newPatient) => {
      setPatients(prev => {
        if (prev.some(p => p.id === newPatient.id)) return prev;
        return [newPatient, ...prev];
      });
      setSuccessToast(`⚡ Real-time Sync: Profile for "${newPatient.name}" appeared from mobile device!`);
      setTimeout(() => setSuccessToast(null), 4000);
    },
    onPatientUpdated: (updatedPatient) => {
      setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    }
  });

  const fetchPatients = () => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
        if (data.length > 0 && !selectedPatient) {
          setSelectedPatient(data[0]);
        }
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // When selected patient changes, fetch their scans
  useEffect(() => {
    if (selectedPatient) {
      fetch(`/api/patients/${selectedPatient.id}/scans`)
        .then(res => res.json())
        .then(data => setPatientScans(data))
        .catch(() => setPatientScans([]));
    }
  }, [selectedPatient]);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          age: Number(age),
          gender,
          phone,
          village: village || 'Primary Health Sub-centre',
          diabetes_years: diabetesYears ? Number(diabetesYears) : undefined,
          blood_sugar: bloodSugar ? Number(bloodSugar) : undefined,
          hba1c: hba1c ? Number(hba1c) : undefined,
          systolic_bp: systolicBp ? Number(systolicBp) : undefined,
          diastolic_bp: diastolicBp ? Number(diastolicBp) : undefined,
          medical_history: medicalHistory
        })
      });

      const newPatient = await res.json();
      setName('');
      setAge('');
      setPhone('');
      setVillage('');
      setDiabetesYears('');
      setBloodSugar('');
      setHba1c('');
      setSystolicBp('');
      setDiastolicBp('');
      setMedicalHistory('');
      
      setSelectedPatient(newPatient);
      setSuccessToast(`Patient profile registered and broadcast across all connected devices.`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.village && p.village.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.phone && p.phone.includes(searchQuery))
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col space-y-5">
      
      {/* Real-time Notification Banner */}
      {successToast && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{successToast}</span>
          </div>
          <span className="text-[10px] uppercase font-mono opacity-80">Phone ↔ Laptop Sync</span>
        </div>
      )}

      {/* Top Header & Real-time Connectivity Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Patient Health Directory
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {patients.length} Registered
            </span>
          </h2>
          <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">
            Rural Epidemiological Registry & Retinal Triage Records
          </p>
        </div>

        {/* Live Multi-Device Sync Pill */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="absolute w-4 h-4 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>
          <div className="text-[11px] font-mono text-slate-700">
            <span className="font-bold text-emerald-700">Live P2P Sync:</span>{' '}
            <span>{activeDevices} screen{activeDevices > 1 ? 's' : ''} connected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Register New Patient Form */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-slate-800">
              <UserPlus className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Enroll Patient (Mobile / Web)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded font-bold">
              Instant Sync
            </span>
          </div>

          <form onSubmit={handleAddPatient} className="space-y-3.5">
            
            {/* Name & Age */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patel"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  placeholder="58"
                  min="1"
                  max="120"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Gender & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Phone / Mobile
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Village / Primary Health Center */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Village / Primary Health Centre (PHC)
              </label>
              <input
                type="text"
                placeholder="e.g. Rampur Sector 4, Sub-centre"
                value={village}
                onChange={e => setVillage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Clinical Parameters: Blood Sugar & HbA1c */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  placeholder="210"
                  value={bloodSugar}
                  onChange={e => setBloodSugar(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  HbA1c (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="8.2"
                  value={hba1c}
                  onChange={e => setHba1c(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Diabetes (Yrs)
                </label>
                <input
                  type="number"
                  placeholder="10"
                  value={diabetesYears}
                  onChange={e => setDiabetesYears(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Systolic BP (mmHg)
                </label>
                <input
                  type="number"
                  placeholder="135"
                  value={systolicBp}
                  onChange={e => setSystolicBp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Diastolic BP (mmHg)
                </label>
                <input
                  type="number"
                  placeholder="85"
                  value={diastolicBp}
                  onChange={e => setDiastolicBp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Clinical Notes / Visual Symptoms
              </label>
              <textarea
                rows={2}
                placeholder="Reports floating dark spots, blurred reading vision..."
                value={medicalHistory}
                onChange={e => setMedicalHistory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name || !age}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold py-2.5 rounded-md transition-colors uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Syncing...' : 'Enroll & Broadcast to Laptop'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Registered Patient Directory & Details */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search bar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 ml-1" />
            <input
              type="text"
              placeholder="Search by name, village, or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 text-xs outline-none text-slate-800 placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-slate-400 hover:text-slate-600 font-bold px-1.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Patient Cards List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Enrolled Cohort ({filteredPatients.length})
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Auto-Refreshed via SSE
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-400 text-xs">Loading patient registry...</div>
              ) : filteredPatients.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No matching patients found. Enroll a new patient on the left or from your smartphone.
                </div>
              ) : (
                filteredPatients.map(p => {
                  const isSelected = selectedPatient?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className={cn(
                        "p-3.5 hover:bg-sky-50/50 cursor-pointer transition-all flex items-center justify-between gap-3",
                        isSelected ? "bg-sky-50/70 border-l-4 border-sky-600" : ""
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm border",
                          isSelected 
                            ? "bg-sky-600 text-white border-sky-600" 
                            : "bg-sky-50 text-sky-700 border-sky-100"
                        )}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            {p.name}
                            <span className="text-[10px] font-mono font-medium text-slate-400">
                              (PAT-{p.id.toString().padStart(4, '0')})
                            </span>
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                            <span>{p.age} yrs • {p.gender}</span>
                            {p.village && <span>• {p.village}</span>}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {p.blood_sugar ? (
                          <div className="text-[11px] font-bold text-indigo-700">
                            {p.blood_sugar} mg/dL
                          </div>
                        ) : null}
                        <div className="text-[9px] text-slate-400 font-mono">
                          {new Date(p.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Patient Extended Clinical Sheet */}
          {selectedPatient && (
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Clinical Dossier: {selectedPatient.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Phone: {selectedPatient.phone || 'Not recorded'} • Village: {selectedPatient.village || 'Rural Clinic'}
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                  ID: PAT-{selectedPatient.id.toString().padStart(4, '0')}
                </span>
              </div>

              {/* Vitals Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Random Glucose</span>
                  <span className="font-bold text-indigo-700">{selectedPatient.blood_sugar ? `${selectedPatient.blood_sugar} mg/dL` : '—'}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Glycated HbA1c</span>
                  <span className="font-bold text-indigo-700">{selectedPatient.hba1c ? `${selectedPatient.hba1c}%` : '—'}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Blood Pressure</span>
                  <span className="font-bold text-slate-800">
                    {selectedPatient.systolic_bp && selectedPatient.diastolic_bp 
                      ? `${selectedPatient.systolic_bp}/${selectedPatient.diastolic_bp}` 
                      : '—'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Diabetes Years</span>
                  <span className="font-bold text-slate-800">{selectedPatient.diabetes_years ? `${selectedPatient.diabetes_years} yrs` : '—'}</span>
                </div>
              </div>

              {selectedPatient.medical_history && (
                <div className="text-[11px] bg-amber-50/60 border border-amber-200/60 rounded-lg p-2.5 text-amber-900 font-medium">
                  <span className="font-bold">Medical History: </span>
                  {selectedPatient.medical_history}
                </div>
              )}

              {/* Patient Scan History */}
              <div className="pt-1">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Retinal Scans for this Patient ({patientScans.length})
                </h5>
                {patientScans.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No retinal scans recorded yet. Use the Scanner tab to capture or upload a fundus photo.</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {patientScans.map(s => (
                      <div key={s.id} className="bg-white border border-slate-200 rounded-md p-2 flex items-center justify-between text-xs">
                        <div>
                          <span className={cn(
                            "font-black text-xs mr-2",
                            s.grade < 1 ? "text-emerald-600" : s.grade < 3 ? "text-amber-600" : "text-red-600"
                          )}>
                            Grade {s.grade.toFixed(1)}
                          </span>
                          <span className="text-slate-700 font-medium">{s.diagnosis.substring(0, 60)}...</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 shrink-0">
                          {new Date(s.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
