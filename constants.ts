
import { FormData } from './types';

export const INITIAL_FORM_DATA: FormData = {
  name: '',
  age: '',
  weight: '',
  height: '',
  gender: 'male',
  pregnant: 'no',
  scr: '',
  qtc: '',
  heartRate: '',
  respiratoryRate: '',
  potassium: '',
  magnesium: '',
  calcium: '',
  route: 'oral',
  dose: 'cap_500',
  myastheniaGravis: false,
  epilepsy: false,
  fluoroquinoloneAllergy: false,
  qtProlongation: false,
  heartDisease: false,
  kidneyDisease: false,
  antiarrhythmics: false,
  antipsychotics: false,
  antidepressants: false,
  macrolides: false,
  antifungals: false,
  otherQtDrugs: false,
  corticosteroids: false,
  diabetesMeds: false,
  nsaids: false,
  caffeine: false,
  alcohol: false,
};

export const DOSE_OPTIONS = [
  { id: 'cap_500', dose: 500, label: 'CAP 500 mg' },
  { id: 'cap_750', dose: 750, label: 'CAP 750 mg' },
  { id: 'hap_vap_750', dose: 750, label: 'HAP/VAP 750 mg' },
  { id: 'abecb_500', dose: 500, label: 'ABECB 500 mg' },
  { id: 'sin_500', dose: 500, label: 'Sinusitis 500 mg' },
  { id: 'sin_750', dose: 750, label: 'Sinusitis 750 mg' },
  { id: 'cuti_750', dose: 750, label: 'cUTI 750 mg' },
  { id: 'cuti_250', dose: 250, label: 'cUTI 250 mg' },
  { id: 'pyelo_750', dose: 750, label: 'Pyelonephritis 750 mg' },
  { id: 'pyelo_250', dose: 250, label: 'Pyelonephritis 250 mg' },
  { id: 'unc_uti_250', dose: 250, label: 'Uncomplicated UTI 250 mg' },
  { id: 'pros_500', dose: 500, label: 'Prostatitis 500 mg' },
  { id: 'csssi_750', dose: 750, label: 'cSSSI 750 mg' },
];

export const TRANSLATIONS = {
  en: {
    appTitle: 'LevoCalc',
    appSubtitle: 'Clinical decision support tool for levofloxacin dosing and safety assessment',
    landingTagline: 'Professional Dosing & Safety Assessment for Levofloxacin',
    startAssessment: 'Start Assessment',
    step1: 'Patient Info',
    step2: 'Medical History',
    step3: 'Lab Values',
    next: 'Next',
    back: 'Back',
    home: 'Home',
    calculate: 'Calculate Results',
    patientName: 'Patient Name',
    enterName: 'Enter name',
    placeholderName: 'Enter name',
    age: 'Age (years)',
    placeholderAge: 'e.g., 45',
    weight: 'Weight (kg)',
    placeholderWeight: 'e.g., 70',
    height: 'Height (cm)',
    placeholderHeight: 'e.g., 170',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    pregnancyStatus: 'Pregnancy Status',
    notPregnant: 'Not Pregnant',
    pregnant: 'Pregnant',
    route: 'Route',
    oral: 'Oral',
    iv: 'IV',
    dose: 'Indication & Dose',
    medicalHistory: 'Medical History',
    currentMedications: 'Current Medications',
    lifestyle: 'Lifestyle Factors',
    myastheniaGravis: 'Myasthenia Gravis',
    epilepsy: 'Epilepsy',
    allergy: 'Fluoroquinolone Allergy',
    histQt: 'History of QT Prolongation',
    heartDisease: 'Heart Disease',
    kidneyDisease: 'Kidney Disease',
    antiarrhythmics: 'Antiarrhythmics',
    antipsychotics: 'Antipsychotics',
    antidepressants: 'Antidepressants',
    macrolides: 'Macrolide Antibiotics',
    antifungals: 'Antifungals',
    otherQt: 'Other QT-prolonging Drugs',
    corticosteroids: 'Systemic Corticosteroids',
    diabetesMeds: 'Insulin/Sulfonylureas',
    nsaids: 'NSAIDs',
    caffeine: 'Regular Caffeine Use',
    alcohol: 'Regular Alcohol Use',
    scr: 'Serum Creatinine (mg/dL)',
    placeholderScr: 'e.g., 1.2',
    qtc: 'QTc Interval (ms)',
    placeholderQtc: 'e.g., 420',
    optional: '(optional)',
    potassium: 'Potassium (mEq/L)',
    placeholderPotassium: '3.5 - 5.0',
    magnesium: 'Magnesium (mg/dL)',
    placeholderMagnesium: '1.7 - 2.2',
    calcium: 'Calcium (mg/dL)',
    placeholderCalcium: '8.5 - 10.5',
    heartRate: 'Heart Rate (bpm)',
    placeholderHeartRate: '60 - 100',
    respRate: 'Respiratory Rate (breaths/min)',
    placeholderRespRate: '12 - 20',
    contraindicationsDetected: 'CONTRAINDICATIONS DETECTED',
    assessmentComplete: 'Assessment Complete',
    patient: 'Patient',
    dosingRec: 'Dosing Recommendation',
    renalFunction: 'Renal Function',
    recRegimen: 'Recommended Regimen',
    initialDose: 'Initial Dose',
    maintenance: 'Maintenance',
    qtAssessment: 'QT Prolongation Risk Assessment',
    warnings: 'Warnings & Precautions',
    pkParams: 'Pharmacokinetic Parameters',
    adminInfo: 'Important Administration Information',
    timing: 'Timing with Food & Supplements',
    timingText: 'Take Levofloxacin 2 hours BEFORE or 6 hours AFTER:',
    sideEffects: 'Common Side Effects',
    contactDoctor: 'Contact doctor immediately if:',
    startNew: 'Start New Assessment',
    print: 'Print Results',
    disclaimer: 'For educational and clinical decision support purposes only. Always consult with a qualified healthcare provider.',
    required: 'Required',
    riskScore: 'Score',
    factorsPresent: 'Risk Factors Present',
    noteF: 'Note: Oral and IV dosing are equivalent (F ≈ 1)',
    lowRisk: 'Low Risk',
    modRisk: 'Moderate Risk',
    highRisk: 'High Risk',
    pediatricContra: 'Pediatric Contraindication',
    pregContra: 'Pregnancy Contraindication',
    hypersens: 'Hypersensitivity',
    pediatricMsg: 'Levofloxacin is contraindicated in patients under 18 years due to risk of cartilage damage.',
    pregMsg: 'Risk of fetal cartilage and bone damage - contraindicated in pregnancy.',
    mgMsg: 'Risk of severe muscle weakness and possible respiratory failure.',
    epilepsyMsg: 'Increased risk of seizures - contraindicated.',
    allergyMsg: 'Known allergy to fluoroquinolones - absolute contraindication.',
    save: 'Save Patient',
    savedSuccess: 'Patient Saved',
    history: 'Patient History',
    noHistory: 'No saved patients found.',
    load: 'Load',
    delete: 'Delete',
    date: 'Date',
    close: 'Close',
    h24: 'every 24 hours',
    h48: 'every 48 hours',
    afterDialysis: '(or after dialysis)',
    normalRenal: 'Normal Renal Function',
    mildModRenal: 'Mild to Moderate Renal Impairment',
    severeRenal: 'Severe Renal Impairment',
    esrdRenal: 'ESRD/Hemodialysis',
    routineMonitor: 'Routine monitoring recommended',
    highRiskMonitor: '⚠️ HIGH RISK - Consult doctor immediately before administration',
    modRiskMonitor: 'Monitor closely, consider baseline and follow-up ECG',
    tendonWarning: 'Risk of tendon rupture with concurrent corticosteroid use',
    hypoglycemiaWarning: 'Risk of severe hypoglycemia - monitor blood glucose closely',
    seizureWarning: 'Increased seizure risk with NSAIDs',
    cnsWarning: 'May increase dizziness, nausea, and CNS effects',
    regimenMild750: '750mg every 48 hours',
    regimenMild500: 'Initial 500mg, then 250mg every 24h',
    regimenMild250: '250mg every 24 hours (No adjustment)',
    regimenSevere750: 'Initial 750mg, then 500mg every 48h',
    regimenSevere500: 'Initial 500mg, then 250mg every 48h',
    regimenSevere250: '250mg every 48 hours',
    regimenESRD750: 'Initial 750mg, then 500mg every 48h or after dialysis',
    regimenESRD500: 'Initial 500mg, then 250mg every 48h or after dialysis',
    regimenESRD250: '250mg every 48h or after dialysis',
    ageFactor: 'Age > 65',
    femaleFactor: 'Female sex',
    heartFactor: 'Heart disease',
    kFactor: 'Low potassium',
    mgFactor: 'Low magnesium',
    caFactor: 'Low calcium',
    drugFactor: 'QT-prolonging medication',
    extraEffects: 'Unexpected Side Effects Report',
    extraEffectsDesc: 'Have you observed any unexpected reactions in this patient?',
    submitReport: 'Submit Observation',
    otherReports: 'Reports from other professionals',
    reportPlaceholder: 'Describe any unusual symptoms observed...',
    reportSuccess: 'Observation shared successfully.',
    pkCl: 'Clearance (CL)',
    pkVd: 'Volume (Vd)',
    pkHl: 'Half-life (t½)',
    pkCmax: 'Cmax',
    pkBmi: 'BMI',
    pkAuc: 'AUC',
    pkTmax: 'Tmax',
    clinicalGuidance: 'Clinical Guidance & Patient Counseling',
    tipHydration: 'Maintain adequate hydration to prevent crystalluria, particularly in patients with renal impairment.',
    tipSunlight: 'Avoid excessive sunlight or UV exposure; Levofloxacin may cause significant photosensitivity.',
    tipTendons: 'Discontinue and seek immediate medical attention if any joint or tendon pain/swelling occurs.',
    tipQtSymptoms: 'Report any sudden dizziness, racing heart, or fainting episodes immediately.',
    tipGlucose: 'Monitor blood glucose closely; fluctuations may occur with concurrent diabetes therapy.',
    tipCompletion: 'Emphasize the importance of finishing the full course to prevent bacterial resistance.',
    chelationIntro: 'These bind levofloxacin in the gut and make it much less effective:',
    chelationItems: [
      '🥛 Milk & dairy products (milk, yogurt, cheese)',
      '🧃 Calcium-fortified juices',
      '💊 Antacids (magnesium, aluminum)',
      '💊 Iron supplements',
      '💊 Zinc supplements',
      '💊 Sucralfate',
      '💊 Multivitamins with minerals'
    ],
    timingRuleTitle: '⏱ Proper Timing Rule:',
    timingRuleText: 'Take Levofloxacin at least 2 hours BEFORE these products OR 6 hours AFTER these products.',
  },
  ar: {
    appTitle: 'LevoCalc',
    appSubtitle: 'أداة طبية لحساب جرعات الليفوفلوكساسين وتقييم الأمان لضمان سلامة المريض',
    landingTagline: 'الحساب الدقيق لجرعات الليفوفلوكساسين وتقييم مخاطر الـ QT للمرضى',
    startAssessment: 'ابدأ التقييم الآن',
    step1: 'بيانات المريض',
    step2: 'التاريخ المرضي',
    step3: 'التحاليل والأرقام',
    next: 'التالي',
    back: 'رجوع',
    home: 'الرئيسية',
    calculate: 'احسب النتائج',
    patientName: 'اسم المريض',
    enterName: 'اكتب اسم المريض',
    placeholderName: 'اكتب اسم المريض',
    age: 'السن (بالسنين)',
    placeholderAge: 'مثلاً: ٤٥',
    weight: 'الوزن (كجم)',
    placeholderWeight: 'مثلاً: ٧٠',
    height: 'الطول (سم)',
    placeholderHeight: 'مثلاً: ١٧٠',
    gender: 'النوع',
    male: 'ذكر',
    female: 'أنثى',
    pregnancyStatus: 'حالة الحمل',
    notPregnant: 'ليست حامل',
    pregnant: 'حامل',
    route: 'طريقة الإعطاء',
    oral: 'أقراص (فموي)',
    iv: 'حقن (وريدي)',
    dose: 'دواعي الاستعمال والجرعة',
    medicalHistory: 'التاريخ المرضي',
    currentMedications: 'الأدوية الحالية',
    lifestyle: 'عادات يومية',
    myastheniaGravis: 'وهن عضلي (Myasthenia Gravis)',
    epilepsy: 'صرع (Epilepsy)',
    allergy: 'حساسية من الفلوروكينولون',
    histQt: 'تاريخ استطالة الـ QT',
    heartDisease: 'أمراض في القلب',
    kidneyDisease: 'أمراض في الكلى',
    antiarrhythmics: 'أدوية تنظيم ضربات القلب',
    antipsychotics: 'مضادات الذهان',
    antidepressants: 'مضادات الاكتئاب',
    macrolides: 'مضادات حيوية ماكرولايد',
    antifungals: 'مضادات فطريات',
    otherQt: 'أدوية تانية بتطول الـ QT',
    corticosteroids: 'كورتيزون (Corticosteroids)',
    diabetesMeds: 'أدوية سكر (إنسولين/سلفونيل يوريا)',
    nsaids: 'مسكنات (NSAIDs)',
    caffeine: 'كافيين بانتظام',
    alcohol: 'كحوليات بانتظام',
    scr: 'الكرياتينين (Serum Creatinine)',
    placeholderScr: 'مثلاً: ١.٢',
    qtc: 'فاصل الـ QTc',
    placeholderQtc: 'مثلاً: ٤٢٠',
    optional: '(اختياري)',
    potassium: 'البوتاسيوم (Potassium)',
    placeholderPotassium: '٣.٥ - ٥.٠',
    magnesium: 'المغنيسيوم (Magnesium)',
    placeholderMagnesium: '١.٧ - ٢.٢',
    calcium: 'الكالسيوم (Calcium)',
    placeholderCalcium: '٨.٥ - ١٠.٥',
    heartRate: 'نبض القلب (HR)',
    placeholderHeartRate: '٦٠ - ١٠٠',
    respRate: 'معدل التنفس (RR)',
    placeholderRespRate: '١٢ - ٢٠',
    contraindicationsDetected: 'يوجد موانع استخدام!',
    assessmentComplete: 'تم الانتهاء من التقييم',
    patient: 'المريض',
    dosingRec: 'الجرعة الموصى بها',
    renalFunction: 'وظائف الكلى',
    recRegimen: 'نظام الجرعات المقترح',
    initialDose: 'الجرعة الأولى (Loading)',
    maintenance: 'جرعة الاستمرارية',
    qtAssessment: 'تقييم مخاطر الـ QT',
    warnings: 'تحذيرات واحتياطات',
    pkParams: 'المعاملات الحركية (PK)',
    adminInfo: 'تعليمات هامة للإعطاء',
    timing: 'التوقيت مع الأكل والمكملات',
    timingText: 'يؤخذ الليفوفلوكساسين قبل الأكل بساعتين أو بعده بـ 6 ساعات من:',
    sideEffects: 'الآثار الجانبية الشائعة',
    contactDoctor: 'يجب مراجعة الطبيب فوراً في حالة:',
    startNew: 'بدء تقييم جديد',
    print: 'طباعة النتائج',
    disclaimer: 'للأغراض التعليمية ودعم القرار الطبي فقط. يجب استشارة مقدم رعاية صحية مختص.',
    required: 'مطلوب',
    riskScore: 'السكور',
    factorsPresent: 'عوامل الخطر الموجودة',
    noteF: 'ملحوظة: كفاءة الأقراص والحقن متساوية (F ≈ 1)',
    lowRisk: 'خطر منخفض',
    modRisk: 'خطر متوسط',
    highRisk: 'خطر مرتفع',
    pediatricContra: 'ممنوع للأطفال',
    pregContra: 'ممنوع للحوامل',
    hypersens: 'حساسية مفرطة',
    pediatricMsg: 'الليفوفلوكساسين ممنوع لمن هم دون 18 عاماً لتجنب مخاطر إصابة الغضاريف.',
    pregMsg: 'خطر إصابة عظام وغضاريف الجنين - ممنوع أثناء الحمل.',
    mgMsg: 'خطر حدوث ضعف عضلي شديد واحتمالية فشل تنفسي.',
    epilepsyMsg: 'زيادة خطر حدوث تشنجات - ممنوع استخدامه.',
    allergyMsg: 'حساسية معروفة للفلوروكينولونات - مانع استخدام مطلق.',
    save: 'حفظ بيانات المريض',
    savedSuccess: 'تم حفظ البيانات',
    history: 'سجل المرضى',
    noHistory: 'لا يوجد مرضى محفوظون.',
    load: 'تحميل',
    delete: 'مسح',
    date: 'التاريخ',
    close: 'إغلاق',
    h24: 'كل 24 ساعة',
    h48: 'كل 48 ساعة',
    afterDialysis: '(أو بعد غسيل الكلى)',
    normalRenal: 'وظائف كلى طبيعية',
    mildModRenal: 'قصور كلوي بسيط إلى متوسط',
    severeRenal: 'قصور كلوي شديد',
    esrdRenal: 'فشل كلوي نهائي/غسيل كلى',
    routineMonitor: 'يوصى بالمراقبة الروتينية',
    highRiskMonitor: '⚠️ خطر مرتفع - استشر الطبيب قبل الإعطاء',
    modRiskMonitor: 'مراقبة دقيقة، ينصح بعمل رسم قلب قبل وأثناء العلاج',
    tendonWarning: 'خطر تمزق الأوتار مع استخدام الكورتيزون المتزامن',
    hypoglycemiaWarning: 'خطر نقص سكر الدم الشديد - راقب السكر بدقة',
    seizureWarning: 'زيادة خطر النوبات مع المسكنات (NSAIDs)',
    cnsWarning: 'قد يزيد من الدوخة والغثيان وأعراض الجهاز العصبي المركزي',
    regimenMild750: '750mg كل 48 ساعة',
    regimenMild500: 'جرعة أولية 500mg، ثم 250mg كل 24 ساعة',
    regimenMild250: '250mg كل 24 ساعة (لا تغيير)',
    regimenSevere750: 'جرعة أولية 750mg، ثم 500mg كل 48 ساعة',
    regimenSevere500: 'جرعة أولية 500mg، ثم 250mg كل 48 ساعة',
    regimenSevere250: '250mg كل 48 ساعة',
    regimenESRD750: 'جرعة أولية 750mg، ثم 500mg كل 48 ساعة أو بعد الغسيل',
    regimenESRD500: 'جرعة أولية 500mg، ثم 250mg كل 48 ساعة أو بعد الغسيل',
    regimenESRD250: '250mg كل 48 ساعة أو بعد الغسيل',
    ageFactor: 'العمر أكبر من 65',
    femaleFactor: 'أنثى',
    heartFactor: 'أمراض القلب',
    kFactor: 'انخفاض البوتاسيوم',
    mgFactor: 'انخفاض المغنيسيوم',
    caFactor: 'انخفاض الكالسيوم',
    drugFactor: 'أدوية تطيل الـ QT',
    extraEffects: 'تقرير آثار جانبية غير متوقعة',
    extraEffectsDesc: 'هل لاحظت أي أعراض غير معتادة على هذا المريض؟',
    submitReport: 'إرسال الملاحظة',
    otherReports: 'ملاحظات من متخصصين آخرين',
    reportPlaceholder: 'اكتب الأعراض غير المعتادة هنا...',
    reportSuccess: 'تمت مشاركة الملاحظة بنجاح.',
    pkCl: 'معدل التخليص (CL)',
    pkVd: 'حجم التوزيع (Vd)',
    pkHl: 'عمر النصف (t½)',
    pkCmax: 'التركيز الأقصى (Cmax)',
    pkBmi: 'كتلة الجسم (BMI)',
    pkAuc: 'المساحة (AUC)',
    pkTmax: 'Tmax',
    clinicalGuidance: 'التوجيهات الإكلينيكية ونصائح المريض',
    tipHydration: 'الحرص على شرب كميات كافية من السوائل لمنع ترسب البلورات في الكلى، خاصة في حالات القصور الكلوي.',
    tipSunlight: 'تجنب التعرض المفرط لأشعة الشمس أو الأشعة فوق البنفسجية؛ حيث يمكن أن يسبب الدواء حساسية ضوئية شديدة.',
    tipTendons: 'التوقف عن تناول الدواء ومراجعة الطبيب فوراً عند الشعور بأي ألم أو تورم في المفاصل أو الأوتار.',
    tipQtSymptoms: 'إبلاغ الفريق الطبي فوراً عن أي شعور بدوار مفاجئ، خفقان في القلب، أو نوبات إغماء.',
    tipGlucose: 'مراقبة مستوى السكر في الدم بدقة؛ قد تحدث تقلبات لمرضى السكري الذين يتناولون أدوية السكر.',
    tipCompletion: 'التأكيد على أهمية إكمال الدورة العلاجية بالكامل لضمان القضاء على البكتيريا ومنع مقاومة المضادات الحيوية.',
    chelationIntro: 'هذه المواد ترتبط بالليفوفلوكساسين في الأمعاء وتجعله أقل فاعلية بكثير:',
    chelationItems: [
      '🥛 الحليب ومنتجات الألبان (حليب، زبادي، جبن)',
      '🧃 العصائر المدعمة بالسكالسيوم',
      '💊 مضادات الحموضة (المغنيسيوم، الألومنيوم)',
      '💊 مكملات الحديد',
      '💊 مكملات الزنك',
      '💊 سوكرالفات',
      '💊 الفيتامينات المتعددة مع المعادن'
    ],
    timingRuleTitle: '⏱ قاعدة التوقيت الصحيح:',
    timingRuleText: 'يؤخذ ليفوفلوكساسين قبل ساعتين على الأقل من هذه المنتجات أو بعد 6 ساعات منها.',
  }
};
