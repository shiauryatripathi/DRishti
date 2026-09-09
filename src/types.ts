export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone?: string;
  village?: string;
  diabetes_years?: number;
  blood_sugar?: number; // mg/dL
  hba1c?: number; // %
  systolic_bp?: number;
  diastolic_bp?: number;
  medical_history?: string;
  created_at: string;
  updated_at?: string;
}

export interface Scan {
  id: number;
  patient_id: number;
  patient_name?: string;
  scan_type: 'UPLOAD' | 'ADAPTIVE_LENS';
  image_path?: string;
  preprocessed_path?: string;
  gradcam_path?: string;
  grade: number;
  confidence?: number;
  diagnosis: string;
  explainability?: string;
  clinical_action?: string;
  risk_tier?: 'Low' | 'Moderate' | 'High' | 'Critical';
  engine?: 'MATLAB-DeepLearning-ResNet50' | 'Ollama-LLaVA' | 'Edge-Simulation';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recommendations?: {
    diet: string[];
    home_remedies: string[];
    exercises: string[];
    deficiencies: string[];
    urgent_referral: boolean;
  };
}

export interface RealtimeEvent {
  type: 'PATIENT_ADDED' | 'PATIENT_UPDATED' | 'SCAN_COMPLETED' | 'PING';
  data?: any;
  timestamp: string;
}
