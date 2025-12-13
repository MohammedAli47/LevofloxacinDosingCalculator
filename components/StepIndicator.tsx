import React from 'react';
import { User, Activity, FlaskConical } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface StepIndicatorProps {
  currentStep: number;
  lang: Language;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, lang }) => {
  const t = TRANSLATIONS[lang];
  
  const steps = [
    { id: 1, label: t.step1, icon: User },
    { id: 2, label: t.step2, icon: Activity },
    { id: 3, label: t.step3, icon: FlaskConical },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex items-center justify-between relative">
        {/* Connection Lines Background */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 -z-0 rounded-full" />
        
        {/* Steps */}
        {steps.map((step, index) => {
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center bg-white px-2">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                <Icon size={20} />
              </div>
              <span 
                className={`mt-2 text-xs md:text-sm font-medium transition-colors duration-300 ${
                  isCurrent ? 'text-teal-700' : isActive ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
