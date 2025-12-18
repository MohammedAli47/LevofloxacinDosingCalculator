import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle, AlertTriangle, Info, Calculator, Pill, 
  Activity, Check, ChevronRight, ChevronLeft, Printer, RotateCcw,
  Globe, Save, History, Trash2, X, Baby, Ban, Stethoscope, MessageSquare, Send,
  Droplets, Sun, Footprints, HeartPulse, Gauge, BookOpen
} from 'lucide-react';
import { FormData, CalculationResult, Language, ValidationErrors, SavedPatient, SideEffectReport } from './types';
import { INITIAL_FORM_DATA, TRANSLATIONS, DOSE_OPTIONS } from './constants';
import { calculateResults } from './logic';
import { PatientService, EffectService } from './db';
import StepIndicator from './components/StepIndicator';

const InputField = React.memo(({ 
  label, 
  field, 
  value, 
  error, 
  onChange, 
  lang, 
  type = "text", 
  placeholder, 
  options 
}: { 
  label: string;
  field: keyof FormData;
  value: string;
  error?: string;
  onChange: (field: keyof FormData, value: any) => void;
  lang: Language;
  type?: string; 
  placeholder?: string;
  options?: { value: string, label: string }[];
}) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label}
      {error && <span className="text-red-500 mx-1">*</span>}
    </label>
    {options ? (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className={`w-full px-4 py-3 bg-slate-50 border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all ${
            error 
              ? 'border-red-300 focus:ring-red-200' 
              : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'
          }`}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 ${lang === 'ar' ? 'left-4' : 'right-4'}`}>
          <ChevronRight className="rotate-90" size={16} />
        </div>
      </div>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
          error 
            ? 'border-red-300 focus:ring-red-200' 
            : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'
        }`}
        placeholder={placeholder}
        dir="ltr" 
        autoComplete="off"
      />
    )}
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
));

const SelectionCard = React.memo(({ 
  label, 
  field, 
  checked, 
  onChange 
}: { 
  label: string; 
  field: keyof FormData; 
  checked: boolean;
  onChange: (field: keyof FormData, value: boolean) => void;
}) => (
  <label className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
    checked 
      ? 'bg-teal-50 border-teal-500 shadow-sm' 
      : 'bg-white border-slate-100 hover:border-slate-200'
  }`}>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
      checked ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-300'
    }`}>
      {checked && <Check size={14} className="text-white" />}
    </div>
    <span className={`mx-3 text-sm font-semibold leading-tight ${checked ? 'text-teal-900' : 'text-slate-600'}`}>
      {label}
    </span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(field, e.target.checked)}
      className="hidden"
    />
  </label>
));

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<Language>('en');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [savedPatients, setSavedPatients] = useState<SavedPatient[]>([]);
  const [sideEffects, setSideEffects] = useState<SideEffectReport[]>([]);
  const [newEffectText, setNewEffectText] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'duplicate'>('idle');

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    loadPatients();
    loadEffects();
  }, []);

  const loadPatients = async () => {
    try {
      const patients = await PatientService.getAll();
      setSavedPatients(patients);
    } catch (e) {
      console.error("Failed to load patients", e);
    }
  };

  const loadEffects = async () => {
    try {
      const effects = await EffectService.getAll();
      setSideEffects(effects);
    } catch (e) {
      console.error("Failed to load effects", e);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.age || parseFloat(formData.age) <= 0) newErrors.age = t.required;
      if (!formData.weight || parseFloat(formData.weight) <= 0) newErrors.weight = t.required;
      if (!formData.height || parseFloat(formData.height) <= 0) newErrors.height = t.required;
    }

    if (currentStep === 3) {
      if (!formData.scr || parseFloat(formData.scr) <= 0) newErrors.scr = t.required;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleCalculate = () => {
    if (validateStep(step)) {
      const res = calculateResults(formData, lang);
      setResults(res);
      setStep(4);
      setSaveStatus('idle');
      window.scrollTo(0, 0);
    }
  };

  const resetForm = () => {
    setStep(1);
    setResults(null);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSaveStatus('idle');
    setNewEffectText('');
    window.scrollTo(0, 0);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const savePatient = async () => {
    if (!results) return;

    const isDuplicate = savedPatients.some(p => 
      p.data.age === formData.age &&
      p.data.weight === formData.weight &&
      p.result.pkParams?.crcl === results.pkParams?.crcl &&
      p.result.timestamp > Date.now() - 60000 // Duplicate if same params within a minute
    );

    if (isDuplicate) {
      setSaveStatus('duplicate');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }
    
    const newRecord: SavedPatient = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      data: formData,
      result: results
    };

    try {
      await PatientService.add(newRecord);
      await loadPatients();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      console.error("Failed to save patient", e);
    }
  };

  const submitSideEffect = async () => {
    if (!newEffectText.trim()) return;
    try {
      await EffectService.add(newEffectText.trim());
      await loadEffects();
      setNewEffectText('');
    } catch (e) {
      console.error("Failed to submit effect", e);
    }
  };

  const deletePatient = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await PatientService.delete(id);
      await loadPatients();
    } catch (e) {
      console.error("Failed to delete patient", e);
    }
  };

  const loadPatient = (record: SavedPatient) => {
    setFormData(record.data);
    setResults(record.result);
    setStep(4);
    setSaveStatus('idle');
    setShowHistory(false);
    setShowLanding(false);
    window.scrollTo(0, 0);
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      {showLanding ? (
        <div className="flex-1 flex flex-col">
          <nav className="p-6 max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">LevoCalc</span>
            </div>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-600 transition-all shadow-sm"
            >
              <Globe size={16} />
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </nav>

          <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-3xl flex items-center justify-center mb-8 animate-bounce-slow">
              <Stethoscope size={40} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
              LevoCalc
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
              {t.landingTagline}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button 
                onClick={() => setShowLanding(false)}
                className="flex-1 px-8 py-5 bg-teal-600 text-white rounded-2xl font-bold text-lg hover:bg-teal-700 shadow-xl shadow-teal-600/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                {t.startAssessment}
                {lang === 'ar' ? <ChevronLeft /> : <ChevronRight />}
              </button>
              <button 
                onClick={() => setShowHistory(true)}
                className="px-8 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
              >
                <History size={20} />
                {t.history}
              </button>
            </div>
          </main>
          <footer className="p-8 text-center text-slate-400 text-xs">
            <p>{t.disclaimer}</p>
          </footer>
        </div>
      ) : (
        <div className="py-8 px-4 flex-1">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6 relative overflow-hidden">
              <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex items-start gap-5 cursor-pointer" onClick={() => setShowLanding(true)}>
                  <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/20 shrink-0">
                    <Pill className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight">LevoCalc</h1>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
                      {t.appSubtitle}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 self-end md:self-start shrink-0">
                  <button onClick={() => setShowHistory(true)} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-xs font-medium text-indigo-700 transition-colors">
                    <History size={14} /><span className="hidden sm:inline">{t.history}</span>
                  </button>
                  <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-600 transition-colors">
                    <Globe size={14} />{lang === 'en' ? 'العربية' : 'English'}
                  </button>
                </div>
              </div>
            </div>

            {step < 4 && <StepIndicator currentStep={step} lang={lang} />}

            {step < 4 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 relative">
                {step === 1 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-6 text-teal-700 font-medium">
                      <span className="w-1 h-6 bg-teal-500 rounded-full"></span>{t.step1}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-x-6">
                      <InputField label={t.gender} field="gender" value={formData.gender} onChange={handleInputChange} lang={lang} options={[{ value: 'male', label: t.male }, { value: 'female', label: t.female }]} />
                      <InputField label={t.age} field="age" value={formData.age} error={errors.age} onChange={handleInputChange} lang={lang} type="number" placeholder={t.placeholderAge} />
                      <InputField label={t.weight} field="weight" value={formData.weight} error={errors.weight} onChange={handleInputChange} lang={lang} type="number" placeholder={t.placeholderWeight} />
                      <InputField label={t.height} field="height" value={formData.height} error={errors.height} onChange={handleInputChange} lang={lang} type="number" placeholder={t.placeholderHeight} />
                      <InputField label={t.route} field="route" value={formData.route} onChange={handleInputChange} lang={lang} options={[{ value: 'oral', label: t.oral }, { value: 'iv', label: t.iv }]} />
                      <InputField label={t.dose} field="dose" value={formData.dose} onChange={handleInputChange} lang={lang} options={DOSE_OPTIONS.map(opt => ({ value: opt.id, label: opt.label }))} />
                    </div>

                    {formData.gender === 'female' && (
                      <div className="mt-6 p-6 bg-pink-50 rounded-2xl border border-pink-100 animate-fade-in">
                        <label className="block text-sm font-bold text-pink-900 mb-4">{t.pregnancyStatus}</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => handleInputChange('pregnant', 'no')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.pregnant === 'no' ? 'bg-white border-pink-500 shadow-md text-pink-700' : 'bg-white/50 border-transparent hover:bg-white text-slate-500'}`}><Ban size={24} /><span className="font-semibold">{t.notPregnant}</span></button>
                          <button onClick={() => handleInputChange('pregnant', 'yes')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.pregnant === 'yes' ? 'bg-white border-pink-500 shadow-md text-pink-700' : 'bg-white/50 border-transparent hover:bg-white text-slate-500'}`}><Baby size={24} /><span className="font-semibold">{t.pregnant}</span></button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-fade-in space-y-8">
                    <div className="flex items-center gap-2 mb-6 text-teal-700 font-medium"><span className="w-1 h-6 bg-teal-500 rounded-full"></span>{t.step2}</div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-3"><div className="h-px bg-slate-200 flex-1"></div><h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.medicalHistory}</h3><div className="h-px bg-slate-200 flex-1"></div></div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <SelectionCard label={t.myastheniaGravis} field="myastheniaGravis" checked={formData.myastheniaGravis} onChange={handleInputChange} />
                        <SelectionCard label={t.epilepsy} field="epilepsy" checked={formData.epilepsy} onChange={handleInputChange} />
                        <SelectionCard label={t.allergy} field="fluoroquinoloneAllergy" checked={formData.fluoroquinoloneAllergy} onChange={handleInputChange} />
                        <SelectionCard label={t.histQt} field="qtProlongation" checked={formData.qtProlongation} onChange={handleInputChange} />
                        <SelectionCard label={t.heartDisease} field="heartDisease" checked={formData.heartDisease} onChange={handleInputChange} />
                        <SelectionCard label={t.kidneyDisease} field="kidneyDisease" checked={formData.kidneyDisease} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-3"><div className="h-px bg-slate-200 flex-1"></div><h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.currentMedications}</h3><div className="h-px bg-slate-200 flex-1"></div></div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <SelectionCard label={t.antiarrhythmics} field="antiarrhythmics" checked={formData.antiarrhythmics} onChange={handleInputChange} /><SelectionCard label={t.antipsychotics} field="antipsychotics" checked={formData.antipsychotics} onChange={handleInputChange} /><SelectionCard label={t.antidepressants} field="antidepressants" checked={formData.antidepressants} onChange={handleInputChange} /><SelectionCard label={t.macrolides} field="macrolides" checked={formData.macrolides} onChange={handleInputChange} /><SelectionCard label={t.antifungals} field="antifungals" checked={formData.antifungals} onChange={handleInputChange} /><SelectionCard label={t.otherQt} field="otherQtDrugs" checked={formData.otherQtDrugs} onChange={handleInputChange} /><SelectionCard label={t.corticosteroids} field="corticosteroids" checked={formData.corticosteroids} onChange={handleInputChange} /><SelectionCard label={t.diabetesMeds} field="diabetesMeds" checked={formData.diabetesMeds} onChange={handleInputChange} /><SelectionCard label={t.nsaids} field="nsaids" checked={formData.nsaids} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-6 text-teal-700 font-medium"><span className="w-1 h-6 bg-teal-500 rounded-full"></span>{t.step3}</div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField label={t.scr} field="scr" value={formData.scr} error={errors.scr} onChange={handleInputChange} lang={lang} type="number" placeholder={t.placeholderScr} /><InputField label={`${t.qtc} ${t.optional}`} field="qtc" value={formData.qtc} error={errors.qtc} onChange={handleInputChange} lang={lang} type="number" placeholder={t.placeholderQtc} /><InputField label={t.potassium} field="potassium" value={formData.potassium} onChange={handleInputChange} lang={lang} type="number" placeholder={t.placeholderPotassium} /><InputField label={t.magnesium} field="magnesium" value={formData.magnesium} onChange={handleInputChange} lang={lang} type="number" placeholder={t.placeholderMagnesium} /><InputField label={t.calcium} field="calcium" value={formData.calcium} onChange={handleInputChange} lang={lang} type="number" placeholder={t.placeholderCalcium} /><InputField label={t.heartRate} field="heartRate" value={formData.heartRate} onChange={handleInputChange} lang={lang} type="number" placeholder={t.placeholderHeartRate} /><InputField label={t.respRate} field="respiratoryRate" value={formData.respiratoryRate} onChange={handleInputChange} lang={lang} type="number" placeholder={t.placeholderRespRate} />
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                  {step > 1 ? (
                    <button onClick={handleBack} className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">{lang === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}{t.back}</button>
                  ) : (
                    <button onClick={() => setShowLanding(true)} className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">{lang === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}{t.home}</button>
                  )}
                  <button onClick={step === 3 ? handleCalculate : handleNext} className="px-8 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 shadow-lg shadow-teal-600/30 transition-all flex items-center gap-2">{step === 3 ? <><Calculator size={18} />{t.calculate}</> : <>{t.next}{lang === 'ar' ? <ChevronLeft size={18} /> : <ChevronRight size={18} /></>}</button>
                </div>
              </div>
            )}

            {step === 4 && results && (
              <div className="space-y-6 animate-fade-in relative pb-12">
                {results.blocked ? (
                  <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle className="w-10 h-10 text-red-500" /></div>
                    <h2 className="text-2xl font-bold text-red-600 mb-6">{t.contraindicationsDetected}</h2>
                    <div className="space-y-4 text-left">
                      {results.contraindications.map((contra, idx) => (<div key={idx} className="bg-red-50 border border-red-200 rounded-xl p-4"><h3 className="font-bold text-red-800 mb-1">{contra.title}</h3><p className="text-red-700 text-sm">{contra.message}</p></div>))}
                    </div>
                    <button onClick={resetForm} className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-medium inline-flex items-center gap-2"><RotateCcw size={18} />{t.startNew}</button>
                  </div>
                ) : (
                  <>
                    <div className="bg-teal-600 rounded-2xl shadow-lg shadow-teal-600/20 p-6 text-white">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/20 p-3 rounded-full shrink-0"><CheckCircle className="w-8 h-8" /></div>
                          <div>
                            <h2 className="text-xl font-bold">{t.assessmentComplete}</h2>
                            <p className="text-teal-100 opacity-90">{t.patient}: <span className="font-semibold">{DOSE_OPTIONS.find(o => o.id === formData.dose)?.label || 'N/A'}</span></p>
                          </div>
                        </div>
                        <button onClick={savePatient} disabled={saveStatus === 'success' || saveStatus === 'duplicate'} className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 shrink-0 ${saveStatus === 'success' ? 'bg-green-100 text-green-700' : saveStatus === 'duplicate' ? 'bg-amber-100 text-amber-700' : 'bg-white text-teal-700 hover:bg-teal-50'}`}>{saveStatus === 'success' ? <Check size={18} /> : saveStatus === 'duplicate' ? <AlertCircle size={18} /> : <Save size={18} />}{saveStatus === 'success' ? t.savedSuccess : saveStatus === 'duplicate' ? 'Duplicate' : t.save}</button>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex items-center gap-3"><div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Pill size={20} /></div><h3 className="text-lg font-bold text-slate-800">{t.dosingRec}</h3></div>
                      <div className="p-6">
                        <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 mb-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div><p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">{t.renalFunction}</p><p className="text-lg font-bold text-indigo-900 leading-tight">{results.doseRec?.status}</p><p className="text-sm text-indigo-700 mt-2">CrCl: {results.pkParams?.crcl} mL/min</p></div>
                            <div className={`pt-4 md:pt-0 ${lang === 'ar' ? 'md:border-r' : 'md:border-l'} border-indigo-200 md:px-6`}><p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">{t.recRegimen}</p><p className="text-2xl font-bold text-indigo-600">{results.doseRec?.regimen}</p></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t.initialDose}</p><p className="font-bold text-slate-800 text-lg">{results.doseRec?.initial}</p></div>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t.maintenance}</p><p className="font-bold text-slate-800 text-lg">{results.doseRec?.maintenance}</p></div>
                        </div>
                      </div>
                    </div>

                    {/* Pharmacokinetic Parameters Block */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex items-center gap-3"><div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Calculator size={20} /></div><h3 className="text-lg font-bold text-slate-800">{t.pkParams}</h3></div>
                      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                         {[
                           { label: t.pkCl, val: `${results.pkParams?.cl} L/h` }, 
                           { label: t.pkVd, val: `${results.pkParams?.vd} L` }, 
                           { label: t.pkHl, val: `${results.pkParams?.halfLife} h` }, 
                           { label: t.pkCmax, val: `${results.pkParams?.cmax} mg/L` }, 
                           { label: t.pkBmi, val: results.pkParams?.bmi }, 
                           { label: t.pkAuc, val: `${results.pkParams?.auc} mg·h/L` }
                         ].map((item, i) => (
                          <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{item.label}</p>
                            <p className="font-bold text-slate-900" dir="ltr">{item.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* QT Prolongation Risk Assessment Block */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                       <div className="p-6 border-b border-slate-100 flex items-center gap-3"><div className="p-2 bg-red-50 rounded-lg text-red-600"><Activity size={20} /></div><h3 className="text-lg font-bold text-slate-800">{t.qtAssessment}</h3></div>
                       <div className="p-6">
                         <div className={`p-5 rounded-xl border-l-4 mb-6 ${results.qtRisk?.color === 'red' ? 'bg-red-50 border-red-500 text-red-900' : results.qtRisk?.color === 'orange' ? 'bg-orange-50 border-orange-500 text-orange-900' : 'bg-emerald-50 border-emerald-500 text-emerald-900'}`}><div className="flex justify-between items-center mb-2"><span className="text-xl font-bold">{results.qtRisk?.level}</span><span className="text-sm font-semibold px-3 py-1 bg-white/50 rounded-full">{t.riskScore}: {results.qtRisk?.score}/7</span></div><p className="font-medium opacity-90">{results.qtRisk?.recommendation}</p></div>
                         {results.qtRisk?.factors && results.qtRisk.factors.length > 0 && (<div className="bg-slate-50 p-4 rounded-xl"><p className="text-sm font-semibold text-slate-700 mb-3">{t.factorsPresent}:</p><div className="flex flex-wrap gap-2">{results.qtRisk.factors.map((factor, idx) => (<span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">{factor}</span>))}</div></div>)}
                       </div>
                    </div>

                    {/* NEW: Clinical Guidance & Counseling Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><BookOpen size={20} /></div>
                        <h3 className="text-lg font-bold text-slate-800">{t.clinicalGuidance}</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        {/* Always visible: Sunlight & Tendon Tips */}
                        <div className="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                          <Sun className="text-emerald-600 shrink-0" size={24} />
                          <p className="text-sm text-emerald-900 leading-relaxed font-medium">{t.tipSunlight}</p>
                        </div>
                        <div className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                          <Footprints className="text-amber-600 shrink-0" size={24} />
                          <p className="text-sm text-amber-900 leading-relaxed font-medium">{t.tipTendons}</p>
                        </div>
                        
                        {/* Contextual: Hydration for Renal Impairment */}
                        {(parseFloat(results.pkParams?.crcl || "0") < 50) && (
                          <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
                            <Droplets className="text-blue-600 shrink-0" size={24} />
                            <p className="text-sm text-blue-900 leading-relaxed font-medium">{t.tipHydration}</p>
                          </div>
                        )}

                        {/* Contextual: QT Symptoms reporting for High/Moderate risk */}
                        {(results.qtRisk?.score || 0) >= 3 && (
                          <div className="flex gap-4 p-4 bg-rose-50 rounded-xl border border-rose-100 animate-fade-in">
                            <HeartPulse className="text-rose-600 shrink-0" size={24} />
                            <p className="text-sm text-rose-900 leading-relaxed font-medium">{t.tipQtSymptoms}</p>
                          </div>
                        )}

                        {/* Contextual: Blood Glucose for Diabetes patients */}
                        {formData.diabetesMeds && (
                          <div className="flex gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-fade-in">
                            <Gauge className="text-indigo-600 shrink-0" size={24} />
                            <p className="text-sm text-indigo-900 leading-relaxed font-medium">{t.tipGlucose}</p>
                          </div>
                        )}

                        {/* Always visible: Completion advice */}
                        <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <CheckCircle className="text-slate-500 shrink-0" size={24} />
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{t.tipCompletion}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><MessageSquare size={20} /></div>
                        <h3 className="text-lg font-bold text-slate-800">{t.extraEffects}</h3>
                      </div>
                      <div className="p-6 space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <p className="text-sm font-medium text-slate-700 mb-3">{t.extraEffectsDesc}</p>
                          <div className="flex gap-2">
                            <textarea 
                              value={newEffectText}
                              onChange={(e) => setNewEffectText(e.target.value)}
                              placeholder={t.reportPlaceholder}
                              className="flex-1 p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm h-24"
                            />
                          </div>
                          <button 
                            onClick={submitSideEffect}
                            disabled={!newEffectText.trim()}
                            className="mt-3 w-full py-2 bg-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors disabled:opacity-50"
                          >
                            <Send size={16} /> {t.submitReport}
                          </button>
                        </div>

                        {sideEffects.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <CheckCircle size={14} className="text-teal-500" /> {t.otherReports}
                            </h4>
                            <div className="grid gap-3">
                              {sideEffects.slice(0, 5).map(effect => (
                                <div key={effect.id} className="p-3 bg-white border border-slate-100 rounded-xl text-sm text-slate-600 shadow-sm flex items-start gap-3">
                                  <span className="mt-1 w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0"></span>
                                  <div className="flex-1">
                                    <p>{effect.text}</p>
                                    <span className="text-[10px] text-slate-400 mt-1 block">
                                      {new Date(effect.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 print:hidden"><button onClick={resetForm} className="flex-1 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 hover:-translate-y-0.5">{t.startNew}</button><button onClick={() => window.print()} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium flex items-center justify-center gap-2 transition-colors"><Printer size={18} />{t.print}</button></div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      )}

      {/* Unified History Modal - accessible from everywhere */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <History className="text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">{t.history}</h2>
              </div>
              <button 
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {savedPatients.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <History size={48} className="mx-auto mb-4 opacity-30" />
                  <p>{t.noHistory}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPatients.map((p) => (
                    <div 
                      key={p.id} 
                      className="p-4 border border-slate-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer group flex justify-between items-center" 
                      onClick={() => loadPatient(p)}
                    >
                      <div>
                        <p className="font-bold text-slate-800 text-lg">
                          {DOSE_OPTIONS.find(o => o.id === p.data.dose)?.label || 'Indication'}
                        </p>
                        <div className="text-sm text-slate-500 flex gap-3 mt-1">
                          <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{t.age}: {p.data.age}</span>
                          <span>•</span>
                          <span className="font-medium text-indigo-600">CrCl: {p.result.pkParams?.crcl}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => deletePatient(p.id, e)} 
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" 
                          title={t.delete}
                        >
                          <Trash2 size={18} />
                        </button>
                        <ChevronRight size={18} className="text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button 
                onClick={() => setShowHistory(false)} 
                className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
