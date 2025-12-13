import { FormData, CalculationResult } from './types';
import { TRANSLATIONS } from './constants';

type Lang = 'en' | 'ar';

export const calculateResults = (formData: FormData, lang: Lang): CalculationResult => {
  const t = TRANSLATIONS[lang];

  // 1. Contraindications
  const contraindications = [];
  
  if (parseFloat(formData.age) < 18) {
    contraindications.push({
      title: t.pediatricContra,
      message: t.pediatricMsg
    });
  }
  
  if (formData.gender === 'female' && formData.pregnant === 'yes') {
    contraindications.push({
      title: t.pregContra,
      message: t.pregMsg
    });
  }
  
  if (formData.myastheniaGravis) {
    contraindications.push({
      title: t.myastheniaGravis,
      message: t.mgMsg
    });
  }
  
  if (formData.epilepsy) {
    contraindications.push({
      title: t.epilepsy,
      message: t.epilepsyMsg
    });
  }
  
  if (formData.fluoroquinoloneAllergy) {
    contraindications.push({
      title: t.hypersens,
      message: t.allergyMsg
    });
  }

  if (contraindications.length > 0) {
    return { contraindications, blocked: true, timestamp: Date.now() };
  }

  // 2. PK Parameters
  const age = parseFloat(formData.age);
  const weight = parseFloat(formData.weight);
  const scr = parseFloat(formData.scr);
  const dose = parseFloat(formData.dose);
  
  // Cockcroft-Gault Equation
  let crcl = (weight * (140 - age)) / (72 * scr);
  if (formData.gender === 'female') {
    crcl = crcl * 0.85;
  }
  
  const cl = 0.7 * crcl;
  const vd = 1.1 * weight;
  const k = cl / vd;
  const halfLife = k > 0 ? 0.693 / k : 0;
  const auc = cl > 0 ? dose / cl : 0;
  const cmax = vd > 0 ? dose / vd : 0;

  // 3. Dose Recommendation
  // Logic based on FDA Label / Sanford Guide
  let doseRec;
  const h24 = lang === 'ar' ? 'كل 24 ساعة' : 'every 24 hours';
  const h48 = lang === 'ar' ? 'كل 48 ساعة' : 'every 48 hours';
  const afterDialysis = lang === 'ar' ? '(أو بعد غسيل الكلى)' : '(or after dialysis)';

  if (crcl >= 50) {
    // Normal Renal Function
    doseRec = {
      status: lang === 'ar' ? 'وظائف كلى طبيعية' : "Normal Renal Function",
      regimen: `${dose}mg ${h24}`,
      initial: `${dose}mg`,
      maintenance: `${dose}mg ${h24}`
    };
  } else if (crcl >= 20 && crcl < 50) {
    // Mild to Moderate
    // 750mg -> 750mg q48h
    // 500mg -> 500mg then 250mg q24h
    // 250mg -> 250mg q24h (no adjustment)
    
    let regimen = "";
    let initial = `${dose}mg`;
    let maintenance = "";

    if (dose === 750) {
      regimen = lang === 'ar' ? "750mg كل 48 ساعة" : "750mg every 48 hours";
      maintenance = lang === 'ar' ? "750mg كل 48 ساعة" : "750mg every 48 hours";
    } else if (dose === 500) {
      regimen = lang === 'ar' ? "أولية 500mg، ثم 250mg كل 24 ساعة" : "Initial 500mg, then 250mg every 24h";
      maintenance = `250mg ${h24}`;
    } else { // 250
      regimen = lang === 'ar' ? "250mg كل 24 ساعة (لا تغيير)" : "250mg every 24 hours (No adjustment)";
      maintenance = `250mg ${h24}`;
    }

    doseRec = {
      status: lang === 'ar' ? 'قصور كلوي خفيف إلى متوسط' : "Mild to Moderate Renal Impairment",
      regimen,
      initial,
      maintenance
    };

  } else if (crcl >= 10 && crcl < 20) {
    // Severe
    // 750mg -> 750mg then 500mg q48h
    // 500mg -> 500mg then 250mg q48h
    // 250mg -> 250mg q48h (except uncomplicated UTI)
    
    let regimen = "";
    let initial = `${dose}mg`;
    let maintenance = "";

    if (dose === 750) {
      regimen = lang === 'ar' ? "أولية 750mg، ثم 500mg كل 48 ساعة" : "Initial 750mg, then 500mg every 48h";
      maintenance = `500mg ${h48}`;
    } else if (dose === 500) {
      regimen = lang === 'ar' ? "أولية 500mg، ثم 250mg كل 48 ساعة" : "Initial 500mg, then 250mg every 48h";
      maintenance = `250mg ${h48}`;
    } else { // 250
      regimen = lang === 'ar' ? "250mg كل 48 ساعة" : "250mg every 48 hours";
      maintenance = `250mg ${h48}`;
    }

    doseRec = {
      status: lang === 'ar' ? 'قصور كلوي شديد' : "Severe Renal Impairment",
      regimen,
      initial,
      maintenance
    };

  } else {
    // ESRD / Dialysis
    // 750mg -> 750mg then 500mg q48h
    // 500mg -> 500mg then 250mg q48h
    // 250mg -> 250mg q48h
    
    let regimen = "";
    let initial = `${dose}mg`;
    let maintenance = "";

    if (dose === 750) {
      regimen = lang === 'ar' ? "أولية 750mg، ثم 500mg كل 48 ساعة أو بعد الغسيل" : "Initial 750mg, then 500mg every 48h or after dialysis";
      maintenance = `500mg ${h48} ${afterDialysis}`;
    } else if (dose === 500) {
      regimen = lang === 'ar' ? "أولية 500mg، ثم 250mg كل 48 ساعة أو بعد الغسيل" : "Initial 500mg, then 250mg every 48h or after dialysis";
      maintenance = `250mg ${h48} ${afterDialysis}`;
    } else { // 250
      regimen = lang === 'ar' ? "250mg كل 48 ساعة أو بعد الغسيل" : "250mg every 48h or after dialysis";
      maintenance = `250mg ${h48} ${afterDialysis}`;
    }

    doseRec = {
      status: lang === 'ar' ? 'فشل كلوي نهائي/غسيل كلى' : "ESRD/Hemodialysis",
      regimen,
      initial,
      maintenance
    };
  }

  // 4. QT Risk
  let score = 0;
  const factors = [];
  
  if (parseFloat(formData.age) > 65) {
    score++;
    factors.push(lang === 'ar' ? 'العمر > 65' : "Age > 65");
  }
  if (formData.gender === 'female') {
    score++;
    factors.push(lang === 'ar' ? 'أنثى' : "Female sex");
  }
  if (formData.heartDisease) {
    score++;
    factors.push(lang === 'ar' ? 'أمراض القلب' : "Heart disease");
  }
  const kPot = parseFloat(formData.potassium);
  if (kPot && kPot < 3.5) {
    score++;
    factors.push(lang === 'ar' ? 'انخفاض البوتاسيوم' : "Low potassium");
  }
  const mg = parseFloat(formData.magnesium);
  if (mg && mg < 1.7) {
    score++;
    factors.push(lang === 'ar' ? 'انخفاض المغنيسيوم' : "Low magnesium");
  }
  const ca = parseFloat(formData.calcium);
  if (ca && ca < 8.5) {
    score++;
    factors.push(lang === 'ar' ? 'انخفاض الكالسيوم' : "Low calcium");
  }
  if (formData.antiarrhythmics || formData.antipsychotics || formData.antidepressants || 
      formData.macrolides || formData.antifungals || formData.otherQtDrugs) {
    score++;
    factors.push(lang === 'ar' ? 'أدوية تطيل QT' : "QT-prolonging medication");
  }

  let level = t.lowRisk;
  let recommendation = lang === 'ar' ? "يوصى بالمراقبة الروتينية" : "Routine monitoring recommended";
  let color: 'green' | 'orange' | 'red' = "green";
  
  if (score >= 5) {
    level = t.highRisk;
    recommendation = lang === 'ar' ? "⚠️ خطر مرتفع - استشر الطبيب فوراً قبل الإعطاء" : "⚠️ HIGH RISK - Consult doctor immediately before administration";
    color = "red";
  } else if (score >= 3) {
    level = t.modRisk;
    recommendation = lang === 'ar' ? "مراقبة عن كثب، النظر في تخطيط قلب أساسي ومتابعة" : "Monitor closely, consider baseline and follow-up ECG";
    color = "orange";
  }

  // 5. Warnings
  const warnings: { type: 'danger' | 'warning' | 'info'; text: string }[] = [];
  
  if (formData.corticosteroids) {
    warnings.push({ 
      type: "danger", 
      text: lang === 'ar' ? "خطر تمزق الأوتار مع استخدام الكورتيكوستيرويدات المتزامن" : "Risk of tendon rupture with concurrent corticosteroid use" 
    });
  }
  if (formData.diabetesMeds) {
    warnings.push({ 
      type: "warning", 
      text: lang === 'ar' ? "خطر نقص سكر الدم الشديد - راقب سكر الدم عن كثب" : "Risk of severe hypoglycemia - monitor blood glucose closely" 
    });
  }
  if (formData.nsaids) {
    warnings.push({ 
      type: "warning", 
      text: lang === 'ar' ? "زيادة خطر النوبات مع مضادات الالتهاب غير الستيرويدية" : "Increased seizure risk with NSAIDs" 
    });
  }
  if (formData.caffeine || formData.alcohol) {
    warnings.push({ 
      type: "info", 
      text: lang === 'ar' ? "قد يزيد من الدوخة والغثيان وتأثيرات الجهاز العصبي المركزي" : "May increase dizziness, nausea, and CNS effects" 
    });
  }

  return {
    contraindications: [],
    blocked: false,
    timestamp: Date.now(),
    pkParams: {
      crcl: crcl.toFixed(2),
      cl: cl.toFixed(2),
      vd: vd.toFixed(2),
      k: k.toFixed(4),
      halfLife: halfLife.toFixed(2),
      auc: auc.toFixed(2),
      cmax: cmax.toFixed(2),
      tmax: '1-2'
    },
    doseRec,
    qtRisk: { score, factors, level, recommendation, color },
    warnings
  };
};
