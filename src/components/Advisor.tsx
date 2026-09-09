import React, { useState, useEffect, useRef } from 'react';
import { Patient, Scan, ChatMessage } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Apple, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Heart, 
  FileDown, 
  RefreshCw,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AdvisorProps {
  patients: Patient[];
  scans: Scan[];
}

export function Advisor({ patients, scans }: AdvisorProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<number | ''>('');
  const [currentGrade, setCurrentGrade] = useState<number>(1.5);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{
    ollamaConnected: boolean;
    recommendedModel: string;
  }>({
    ollamaConnected: false,
    recommendedModel: 'llama3.2:3b'
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch system status (check if local Ollama is active)
  useEffect(() => {
    fetch('/api/system/status')
      .then(r => r.json())
      .then(data => {
        setSystemStatus({
          ollamaConnected: data.ollamaConnected,
          recommendedModel: data.recommendedModel || 'llama3.2:3b'
        });
      })
      .catch(() => {});
  }, []);

  // When selected patient changes, automatically find their most recent scan grade
  useEffect(() => {
    if (selectedPatientId !== '') {
      const patientScans = scans.filter(s => s.patient_id === Number(selectedPatientId));
      if (patientScans.length > 0) {
        const latest = patientScans.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        setCurrentGrade(latest.grade);
      }
    }
  }, [selectedPatientId, scans]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `Namaste! I am the **DRishti Clinical Care & Glycemic Advisor**.

I provide **evidence-based Indian dietary guidance, safe glycemic remedies, and lifestyle routines** tailored to your Diabetic Retinopathy severity grade.

Select a patient profile above or ask any question about nutrition, home remedies, exercise, or micronutrient deficiencies!`
        }
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          patientId: selectedPatientId || undefined,
          drGrade: currentGrade
        })
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I experienced a connection interruption. Please ensure the local server is running.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPatient = patients.find(p => p.id === Number(selectedPatientId));

  const quickPrompts = [
    {
      title: '🥗 Indian Diet for Retinopathy',
      prompt: 'What specific low-glycemic Indian foods (millets, greens, pulses) will protect my retinal microvasculature?'
    },
    {
      title: '🌿 Safe Home Remedies & Spices',
      prompt: 'Which spices and home remedies (methi, amla, dalchini) are scientifically proven to help blood sugar regulation?'
    },
    {
      title: '🏃 Eye Hygiene & Safe Exercise',
      prompt: 'What are safe exercises for my severity grade? Which high-strain workouts must I avoid to prevent retinal bleeding?'
    },
    {
      title: '💊 Deficiencies (Lutein & Vit A)',
      prompt: 'What nutritional deficiencies should diabetic patients check for, and which natural foods provide Lutein and Zeaxanthin?'
    }
  ];

  const handlePrintAdvice = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-6rem)] space-y-4">
      
      {/* Top Header & Patient Context Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                AI Care & Lifestyle Advisor
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Offline Edge AI
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">
                Personalized Indian Diet, Glycemic Management & Eye Exercise Prescriptions
              </p>
            </div>
          </div>
        </div>

        {/* Ollama Terminal Status */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
            <span className={cn(
              "w-2 h-2 rounded-full",
              systemStatus.ollamaConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
            )} />
            <span className="text-[11px] font-mono text-slate-700">
              {systemStatus.ollamaConnected ? (
                <>Ollama: <span className="font-bold text-emerald-700">{systemStatus.recommendedModel}</span></>
              ) : (
                <>Offline Clinical Engine (<span className="text-slate-500 font-semibold">ollama run {systemStatus.recommendedModel}</span>)</>
              )}
            </span>
          </div>

          <button
            onClick={handlePrintAdvice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
            title="Print or Save as PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Advice</span>
          </button>
        </div>
      </div>

      {/* Patient Severity Selector Ribbon */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50/40 to-slate-50 border border-sky-100 rounded-xl p-3 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-3 items-center text-xs">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Linked Patient Profile
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="">-- General Consultation (No Patient Selected) --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                PAT-{p.id.toString().padStart(4, '0')}: {p.name} ({p.age}y, {p.gender})
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Severity Context (Grade 0.0 - 4.0)
            </span>
            <span className={cn(
              "font-black text-xs px-2 py-0.5 rounded",
              currentGrade < 1 ? "bg-emerald-100 text-emerald-800" :
              currentGrade < 3 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
            )}>
              Grade {currentGrade.toFixed(1)}: {
                currentGrade < 1 ? 'No DR' :
                currentGrade < 2 ? 'Mild NPDR' :
                currentGrade < 3 ? 'Moderate NPDR' : 'Severe / PDR'
              }
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="4"
            step="0.1"
            value={currentGrade}
            onChange={(e) => setCurrentGrade(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
        </div>

        <div className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200/60 leading-relaxed">
          {selectedPatient ? (
            <div>
              <span className="font-bold text-slate-800">{selectedPatient.name}</span> • Glucose: <span className="font-semibold text-indigo-700">{selectedPatient.blood_sugar || '180'} mg/dL</span> • HbA1c: <span className="font-semibold text-indigo-700">{selectedPatient.hba1c || '7.8'}%</span>
            </div>
          ) : (
            <span className="text-slate-500">Adjust the grade or link a patient to automatically personalize the dietary and clinical advice.</span>
          )}
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col min-h-0 overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 max-w-3xl",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm",
                msg.role === 'user' 
                  ? "bg-sky-600 text-white" 
                  : "bg-gradient-to-tr from-indigo-700 to-sky-600 text-white"
              )}>
                {msg.role === 'user' ? 'U' : <Bot className="w-4 h-4" />}
              </div>

              <div className={cn(
                "rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm",
                msg.role === 'user'
                  ? "bg-sky-600 text-white rounded-tr-none font-medium"
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none prose-sm"
              )}>
                {/* Render formatted message content */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={idx} className="font-bold text-slate-900 text-sm mt-3 mb-1">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('⚠️') || line.startsWith('🚨')) {
                      return <div key={idx} className="p-2 rounded bg-red-50 text-red-800 border border-red-200 font-semibold my-2">{line}</div>;
                    }
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return <li key={idx} className="ml-4 list-disc text-slate-700 my-0.5">{line.substring(2)}</li>;
                    }
                    return <p key={idx} className="my-1">{line}</p>;
                  })}
                </div>
                <div className={cn(
                  "text-[9px] mt-2 font-mono text-right",
                  msg.role === 'user' ? "text-sky-100" : "text-slate-400"
                )}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-xl items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium text-slate-600 ml-1">Analyzing glycemic and retinal parameters...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-slate-100/70 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Prompts:
          </span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              disabled={isLoading}
              className="text-[11px] font-medium whitespace-nowrap bg-white hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about diet, fenugreek, ragi, safe eye exercises, or diabetic care..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Clinical Disclaimer */}
          <p className="text-[9px] text-slate-400 text-center mt-2 font-medium">
            Clinical Disclaimer: AI recommendations provide dietary & glycemic stabilization support. Severe or Proliferative DR requires specialist laser or anti-VEGF intervention.
          </p>
        </div>
      </div>

    </div>
  );
}
