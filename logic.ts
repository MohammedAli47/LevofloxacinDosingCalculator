import { FormData, CalculationResult } from './types';
import { TRANSLATIONS, DOSE_OPTIONS } from './constants';

export const calculateResults = (formData: FormData, lang: 'en' | 'ar'): CalculationResult => {
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
  const height = parseFloat(formData.height);
  const scr = parseFloat(formData.scr);
  
  // Find selected dose numeric value
  const selectedDoseObj = DOSE_OPTIONS.find(opt => opt.id === formData.dose);
  const doseValue = selectedDoseObj ? selectedDoseObj.dose : 500;
  
  // Cockcroft-Gault Equation (CrCl)
  let crcl = (weight * (140 - age)) / (72 * scr);
  if (formData.gender === 'female') {
    crcl = crcl * 0.85;
  }
  
  /**
   * UPDATED CLEARANCE (Cl) CALCULATION based on handwritten note:
   * If Cr Serum > 1.2 => Cl = (CrCl * 0.06) + 0.8
   * If Cr Serum <= 1.2 => Cl = (CrCl * 0.06) + 0.9
   */
  let cl = (crcl * 0.06);
  if (scr > 1.2) {
    cl = cl + 0.8;
  } else {
    cl = cl + 0.9;
  }

  const vd = 1.1 * weight;
  const k = cl / vd;
  const halfLife = k > 0 ? 0.693 / k : 0;
  const auc = cl > 0 ? doseValue / cl : 0;
  const cmax = vd > 0 ? doseValue / vd : 0;
  
  // BMI
  let bmi = "0";
  if (height > 0) {
    bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
  }

  // 3. Dose Recommendation
  let doseRec;

  if (crcl >= 50) {
    doseRec = {
      status: t.normalRenal,
      regimen: `${doseValue}mg ${t.h24}`,
      initial: `${doseValue}mg`,
      maintenance: `${doseValue}mg ${t.h24}`
    };
  } else if (crcl >= 20 && crcl < 50) {
    let regimen = "";
    let maintenance = "";

    if (doseValue === 750) {
      regimen = t.regimenMild750;
      maintenance = t.regimenMild750;
    } else if (doseValue === 500) {
      regimen = t.regimenMild500;
      maintenance = `250mg ${t.h24}`;
    } else {
      regimen = t.regimenMild250;
      maintenance = `250mg ${t.h24}`;
    }

    doseRec = {
      status: t.mildModRenal,
      regimen,
      initial: `${doseValue}mg`,
      maintenance
    };
  } else if (crcl >= 10 && crcl < 20) {
    let regimen = "";
    let maintenance = "";

    if (doseValue === 750) {
      regimen = t.regimenSevere750;
      maintenance = `500mg ${t.h48}`;
    } else if (doseValue === 500) {
      regimen = t.regimenSevere500;
      maintenance = `250mg ${t.h48}`;
    } else {
      regimen = t.regimenSevere250;
      maintenance = `250mg ${t.h48}`;
    }

    doseRec = {
      status: t.severeRenal,
      regimen,
      initial: `${doseValue}mg`,
      maintenance
    };
  } else {
    let regimen = "";
    let maintenance = "";

    if (doseValue === 750) {
      regimen = t.regimenESRD750;
      maintenance = `500mg ${t.h48} ${t.afterDialysis}`;
    } else if (doseValue === 500) {
      regimen = t.regimenESRD500;
      maintenance = `250mg ${t.h48} ${t.afterDialysis}`;
    } else {
      regimen = t.regimenESRD250;
      maintenance = `250mg ${t.h48} ${t.afterDialysis}`;
    }

    doseRec = {
      status: t.esrdRenal,
      regimen,
      initial: `${doseValue}mg`,
      maintenance
    };
  }

  // 4. QT Risk
  let score = 0;
  const factors = [];
  
  if (age > 65) {
    score++;
    factors.push(t.ageFactor);
  }
  if (formData.gender === 'female') {
    score++;
    factors.push(t.femaleFactor);
  }
  if (formData.heartDisease) {
    score++;
    factors.push(t.heartFactor);
  }
  const kPot = parseFloat(formData.potassium);
  if (kPot && kPot < 3.5) {
    score++;
    factors.push(t.kFactor);
  }
  const mg = parseFloat(formData.magnesium);
  if (mg && mg < 1.7) {
    score++;
    factors.push(t.mgFactor);
  }
  const ca = parseFloat(formData.calcium);
  if (ca && ca < 8.5) {
    score++;
    factors.push(t.caFactor);
  }
  if (formData.antiarrhythmics || formData.antipsychotics || formData.antidepressants || 
      formData.macrolides || formData.antifungals || formData.otherQtDrugs) {
    score++;
    factors.push(t.drugFactor);
  }

  let level = t.lowRisk;
  let recommendation = t.routineMonitor;
  let color: 'green' | 'orange' | 'red' = "green";
  
  if (score >= 5) {
    level = t.highRisk;
    recommendation = t.highRiskMonitor;
    color = "red";
  } else if (score >= 3) {
    level = t.modRisk;
    recommendation = t.modRiskMonitor;
    color = "orange";
  }

  // 5. Warnings
  const warnings: { type: 'danger' | 'warning' | 'info'; text: string }[] = [];
  
  if (formData.corticosteroids) {
    warnings.push({ type: "danger", text: t.tendonWarning });
  }
  if (formData.diabetesMeds) {
    warnings.push({ type: "warning", text: t.hypoglycemiaWarning });
  }
  if (formData.nsaids) {
    warnings.push({ type: "warning", text: t.seizureWarning });
  }
  if (formData.caffeine || formData.alcohol) {
    warnings.push({ type: "info", text: t.cnsWarning });
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
      tmax: '1-2',
      bmi
    },
    doseRec,
    qtRisk: { score, factors, level, recommendation, color },
    warnings
  };
};