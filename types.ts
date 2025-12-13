export type Gender = 'male' | 'female';
export type Route = 'oral' | 'iv';
export type Language = 'en' | 'ar';

export interface FormData {
  // Patient Info
  name: string;
  age: string;
  weight: string;
  gender: Gender;
  pregnant: 'yes' | 'no';
  route: Route;
  dose: '250' | '500' | '750';

  // Lab Values
  scr: string;
  qtc: string;
  heartRate: string;
  respiratoryRate: string;
  potassium: string;
  magnesium: string;
  calcium: string;

  // Medical History
  myastheniaGravis: boolean;
  epilepsy: boolean;
  fluoroquinoloneAllergy: boolean;
  qtProlongation: boolean;
  heartDisease: boolean;
  kidneyDisease: boolean;

  // Medications
  antiarrhythmics: boolean;
  antipsychotics: boolean;
  antidepressants: boolean;
  macrolides: boolean;
  antifungals: boolean;
  otherQtDrugs: boolean;
  corticosteroids: boolean;
  diabetesMeds: boolean;
  nsaids: boolean;

  // Lifestyle
  caffeine: boolean;
  alcohol: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface CalculationResult {
  contraindications: { title: string; message: string }[];
  blocked: boolean;
  timestamp: number;
  pkParams?: {
    crcl: string;
    cl: string;
    vd: string;
    k: string;
    halfLife: string;
    auc: string;
    cmax: string;
    tmax: string;
  };
  doseRec?: {
    status: string;
    regimen: string;
    initial: string;
    maintenance: string;
  };
  qtRisk?: {
    score: number;
    factors: string[];
    level: string;
    recommendation: string;
    color: 'green' | 'orange' | 'red';
  };
  warnings?: {
    type: 'danger' | 'warning' | 'info';
    text: string;
  }[];
}

export interface SavedPatient {
  id: string;
  timestamp: number;
  data: FormData;
  result: CalculationResult;
}
