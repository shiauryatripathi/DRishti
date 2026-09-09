/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { Patients } from './components/Patients';
import { Advisor } from './components/Advisor';
import { Login } from './components/Login';
import { Preloader } from './components/Preloader';
import { Patient, Scan } from './types';
import { useRealtimeSync } from './lib/useRealtimeSync';

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [currentView, setCurrentView] = useState('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);

  // Hook for real-time synchronization tracking
  const { activeDevices } = useRealtimeSync({
    onPatientAdded: (newPatient) => {
      setPatients(prev => [newPatient, ...prev.filter(p => p.id !== newPatient.id)]);
    },
    onScanCompleted: (newScan) => {
      setScans(prev => [newScan, ...prev.filter(s => s.id !== newScan.id)]);
    }
  });

  const loadData = () => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(setPatients)
      .catch(() => {});

    fetch('/api/dashboard/scans')
      .then(res => res.json())
      .then(setScans)
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  return (
    <>
      {/* 3D DRishti Logo Reveal Preloader Screen (matching uploaded video) */}
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} durationMs={2600} />
      )}

      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
          <Sidebar 
            currentView={currentView} 
            onChangeView={setCurrentView} 
            onReplayIntro={() => setShowPreloader(true)}
            activeDevices={activeDevices}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {currentView === 'dashboard' && (
              <Dashboard 
                onNavigateToScan={() => setCurrentView('new_scan')} 
                onNavigateToAdvisor={() => setCurrentView('advisor')}
              />
            )}
            {currentView === 'patients' && <Patients />}
            {currentView === 'new_scan' && <Scanner />}
            {currentView === 'advisor' && (
              <Advisor patients={patients} scans={scans} />
            )}
          </main>
        </div>
      )}
    </>
  );
}
