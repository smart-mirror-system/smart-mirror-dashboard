// ════════════════════════════════════════
// GLOBAL STATE & VARIABLES
// ════════════════════════════════════════
let token = localStorage.getItem("token") || null;
let currentStep = 0;
let currentLang = 'en';
let isRegisterMode = true; 
const TOTAL = 5;

// Global variable to hold the profile image base64 data string
let base64Avatar = "";

// ════════════════════════════════════════
// AUTHENTICATION LOGIC (Login / Register)
// ════════════════════════════════════════
async function handleAuth() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passInput").value;
  const name = document.getElementById("fullName")?.value;

  const url = isRegisterMode
    ? "http://localhost:3000/api/auth/register"
    : "http://localhost:3000/api/auth/login";

  const body = isRegisterMode
      ? { 
          email, 
          password, 
          profile: { 
            name: name,
            firstName: name,
            lastName: ""
          } 
        }
      : { email, password };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!data.ok) {
      toast.error(data.error || "Registration failed.", "Error");
      return false;
    }

    // if login
    if (data.token) {
      token = data.token;
      localStorage.setItem("token", token);
    }

    // if register, auto-login after successful registration
    if (isRegisterMode) {
      return await autoLogin(email, password);
    }

    return true;

  } catch (err) {
    console.error(err);
    toast.error("Server connection error.", "Connection Error");
    return false;
  }
}
async function autoLogin(email, password) {
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.ok && data.token) {
      token = data.token;
      localStorage.setItem("token", token);
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
/* ════════════════════════════════════════
   TRANSLATIONS (EN, AR, ES, FR, DE)
════════════════════════════════════════ */
const translations = {
  en:{
    headerTitle:"Smart Mirror Setup",headerSubtitle:"Configure your personalized fitness experience",
    tabAccount:"Account",tabLanguage:"Language",tabTraining:"Training",tabPreferences:"Preferences",tabProfile:"Profile",
    authTitleRegister:"Create Your Account",authTitleLogin:"Welcome Back",
    authDesc:"Get started with your personalized fitness journey",
    authNameLabel:"Full Name",authNamePlaceholder:"John Doe",
    authEmailLabel:"Email Address",authEmailPlaceholder:"john@example.com",
    authPasswordLabel:"Password",authPasswordPlaceholder:"••••••••",
    authConfirmLabel:"Confirm Password",
    authToggleRegister:"Already have an account?",authToggleLogin:"Don't have an account?",
    authLinkRegister:"Sign In",authLinkLogin:"Sign Up",
    successMsg:"Account created successfully!",
    langTitle:"Language Preferences",langDesc:"Choose your preferred language and region settings",
    langDisplayLabel:"Display Language",langVoiceLabel:"Voice Feedback Language",
    langUnitsLabel:"Units",langUnitsMetric:"Metric (kg, cm)",langUnitsImperial:"Imperial (lb, in)",
    langTimeLabel:"Time Format",langTime12:"12-hour",langTime24:"24-hour",
    trainingTitle:"Training Type",trainingDesc:"Select your primary workout focus",
    trainingStrength:"Strength Training",trainingStrengthDesc:"Build muscle and power",
    trainingCardio:"Cardio",trainingCardioDesc:"Improve endurance",
    trainingYoga:"Yoga & Flexibility",trainingYogaDesc:"Enhance mobility",
    trainingHiit:"HIIT",trainingHiitDesc:"High-intensity intervals",
    trainingSports:"Sports Training",trainingSportsDesc:"Sport-specific drills",
    trainingMixed:"Mixed Training",trainingMixedDesc:"Balanced approach",
    levelTitle:"Fitness Level",levelDesc:"Help us tailor your workouts",
    levelBeginner:"Beginner",levelBeginnerDesc:"Starting my journey",
    levelIntermediate:"Intermediate",levelIntermediateDesc:"Regular workouts",
    levelAdvanced:"Advanced",levelAdvancedDesc:"Experienced athlete",
    weeklyGoalsLabel:"Weekly Training Goals",
    weeklyGoals23:"2-3 sessions per week",weeklyGoals45:"4-5 sessions per week",
    weeklyGoals67:"6-7 sessions per week",weeklyGoalsCustom:"Custom schedule",
    prefDisplayTitle:"Display Settings",prefDisplayDesc:"Customize your mirror interface",
    prefHeartRate:"Show Heart Rate Monitor",prefHeartRateDesc:"Display real-time heart rate data",
    prefCalories:"Show Calorie Counter",prefCaloriesDesc:"Track calories burned during workout",
    prefSkeleton:"Show Skeleton Tracking",prefSkeletonDesc:"Real-time form analysis overlay",
    prefReps:"Show Rep Counter",prefRepsDesc:"Automatic repetition counting",
    prefAudioTitle:"Audio & Voice",prefAudioDesc:"Configure audio feedback settings",
    prefVoice:"Voice Coaching",prefVoiceDesc:"Get audio guidance during workouts",
    prefAlerts:"Form Correction Alerts",prefAlertsDesc:"Audio alerts for improper form",
    prefMotivation:"Motivational Prompts",prefMotivationDesc:"Encouragement during tough sets",
    prefMusic:"Background Music",prefMusicDesc:"Play music during workouts",
    profileTitle:"Your Profile",profileDesc:"Personal information and fitness data",
    profileFirstName:"First Name",profileLastName:"Last Name",
    profileAge:"Age",profileGender:"Gender",
    profileGenderMale:"Male",profileGenderFemale:"Female",
    profileGenderOther:"Other",profileGenderPrefer:"Prefer not to say",
    profileHeight:"Height (cm)",profileWeight:"Weight (kg)",
    profileGoalsLabel:"Fitness Goals",
    profileGoalLoseWeight:"Lose Weight",profileGoalBuildMuscle:"Build Muscle",
    profileGoalEndurance:"Improve Endurance",profileGoalFlexibility:"Increase Flexibility",
    profileGoalGeneral:"General Fitness",profileGoalAthletic:"Athletic Performance",
    finalTitle:"Setup Complete!",finalDesc:"Your Smart Mirror is configured and ready. Your personalized fitness experience awaits.",
    btnNext:"Next →",btnBack:"← Back",btnSubmit:"✓ Complete Setup",btnReset:"Start Fresh ↺",
    stepOf:"Step {n} of 5",savedMessage:"✓ Saved!"
  },
  ar:{
    headerTitle:"إعداد المرآة الذكية",headerSubtitle:"قم بتكوين تجربة اللياقة البدنية الشخصية",
    tabAccount:"الحساب",tabLanguage:"اللغة",tabTraining:"التدريب",tabPreferences:"التفضيلات",tabProfile:"الملف الشخصي",
    authTitleRegister:"أنشئ حسابك",authTitleLogin:"مرحباً بعودتك",
    authDesc:"ابدأ رحلة اللياقة البدنية الشخصية الخاصة بك",
    authNameLabel:"الاسم الكامل",authNamePlaceholder:"أحمد محمد",
    authEmailLabel:"البريد الإلكتروني",authEmailPlaceholder:"ahmed@example.com",
    authPasswordLabel:"كلمة المرور",authPasswordPlaceholder:"••••••••",
    authConfirmLabel:"تأكيد كلمة المرور",
    authToggleRegister:"هل لديك حساب بالفعل؟",authToggleLogin:"ليس لديك حساب؟",
    authLinkRegister:"تسجيل الدخول",authLinkLogin:"التسجيل",
    successMsg:"تم إنشاء الحساب بنجاح!",
    langTitle:"تفضيلات اللغة",langDesc:"اختر لغتك وإعدادات المنطقة المفضلة",
    langDisplayLabel:"لغة العرض",langVoiceLabel:"لغة الملاحظات الصوتية",
    langUnitsLabel:"الوحدات",langUnitsMetric:"متري (كجم، سم)",langUnitsImperial:"إمبراطوري (رطل، بوصة)",
    langTimeLabel:"تنسيق الوقت",langTime12:"12 ساعة",langTime24:"24 ساعة",
    trainingTitle:"نوع التدريب",trainingDesc:"اختر تركيز التمرين الأساسي",
    trainingStrength:"تدريب القوة",trainingStrengthDesc:"بناء العضلات والقوة",
    trainingCardio:"كارديو",trainingCardioDesc:"تحسين التحمل",
    trainingYoga:"يوجا ومرونة",trainingYogaDesc:"تعزيز الحركة",
    trainingHiit:"هيت",trainingHiitDesc:"فواصل عالية الكثافة",
    trainingSports:"تدريب رياضي",trainingSportsDesc:"تمارين خاصة بالرياضة",
    trainingMixed:"تدريب مختلط",trainingMixedDesc:"نهج متوازن",
    levelTitle:"مستوى اللياقة",levelDesc:"ساعدنا في تخصيص تمارينك",
    levelBeginner:"مبتدئ",levelBeginnerDesc:"بدء رحلتي",
    levelIntermediate:"متوسط",levelIntermediateDesc:"تمارين منتظمة",
    levelAdvanced:"متقدم",levelAdvancedDesc:"رياضي ذو خبرة",
    weeklyGoalsLabel:"أهداف التدريب الأسبوعية",
    weeklyGoals23:"2-3 جلسات في الأسبوع",weeklyGoals45:"4-5 جلسات في الأسبوع",
    weeklyGoals67:"6-7 جلسات في الأسبوع",weeklyGoalsCustom:"جدول مخصص",
    prefDisplayTitle:"إعدادات العرض",prefDisplayDesc:"تخصيص واجهة المرآة الخاصة بك",
    prefHeartRate:"إظهار مراقب ضربات القلب",prefHeartRateDesc:"عرض بيانات معدل ضربات القلب",
    prefCalories:"إظهار عداد السعرات",prefCaloriesDesc:"تتبع السعرات المحروقة",
    prefSkeleton:"إظهار تتبع الهيكل العظمي",prefSkeletonDesc:"تراكب تحليل الشكل",
    prefReps:"إظهار عداد التكرارات",prefRepsDesc:"عد التكرارات التلقائي",
    prefAudioTitle:"الصوت والكلام",prefAudioDesc:"تكوين إعدادات التغذية الراجعة الصوتية",
    prefVoice:"التدريب الصوتي",prefVoiceDesc:"إرشادات صوتية أثناء التمارين",
    prefAlerts:"تنبيهات تصحيح الشكل",prefAlertsDesc:"تنبيهات صوتية للشكل غير الصحيح",
    prefMotivation:"رسائل تحفيزية",prefMotivationDesc:"التشجيع خلال المجموعات الصعبة",
    prefMusic:"موسيقى الخلفية",prefMusicDesc:"تشغيل الموسيقى أثناء التمارين",
    profileTitle:"ملفك الشخصي",profileDesc:"المعلومات الشخصية وبيانات اللياقة",
    profileFirstName:"الاسم الأول",profileLastName:"اسم العائلة",
    profileAge:"العمر",profileGender:"الجنس",
    profileGenderMale:"ذكر",profileGenderFemale:"أنثى",
    profileGenderOther:"آخر",profileGenderPrefer:"أفضل عدم القول",
    profileHeight:"الطول (سم)",profileWeight:"الوزن (كجم)",
    profileGoalsLabel:"أهداف اللياقة",
    profileGoalLoseWeight:"فقدان الوزن",profileGoalBuildMuscle:"بناء العضلات",
    profileGoalEndurance:"تحسين التحمل",profileGoalFlexibility:"زيادة المرونة",
    profileGoalGeneral:"لياقة عامة",profileGoalAthletic:"الأداء الرياضي",
    finalTitle:"اكتمل الإعداد!",finalDesc:"مرآتك الذكية جاهزة. تجربتك المخصصة في اللياقة تنتظرك.",
    btnNext:"التالي ←",btnBack:"→ رجوع",btnSubmit:"✓ إتمام الإعداد",btnReset:"إعادة البدء ↺",
    stepOf:"الخطوة {n} من 5",savedMessage:"✓ تم الحفظ!"
  },
  es:{
    headerTitle:"Configuración del Espejo Inteligente",headerSubtitle:"Configura tu experiencia de fitness personalizada",
    tabAccount:"Cuenta",tabLanguage:"Idioma",tabTraining:"Entrenamiento",tabPreferences:"Preferencias",tabProfile:"Perfil",
    authTitleRegister:"Crea Tu Cuenta",authTitleLogin:"Bienvenido de Nuevo",
    authDesc:"Comienza tu viaje de fitness personalizado",
    authNameLabel:"Nombre Completo",authNamePlaceholder:"Juan Pérez",
    authEmailLabel:"Correo Electrónico",authEmailPlaceholder:"juan@ejemplo.com",
    authPasswordLabel:"Contraseña",authPasswordPlaceholder:"••••••••",
    authConfirmLabel:"Confirmar Contraseña",
    authToggleRegister:"¿Ya tienes una cuenta?",authToggleLogin:"¿No tienes cuenta?",
    authLinkRegister:"Iniciar Sesión",authLinkLogin:"Registrarse",
    successMsg:"¡Cuenta creada exitosamente!",
    langTitle:"Preferencias de Idioma",langDesc:"Elige tu idioma y configuración regional",
    langDisplayLabel:"Idioma de Pantalla",langVoiceLabel:"Idioma de Voz",
    langUnitsLabel:"Unidades",langUnitsMetric:"Métrico (kg, cm)",langUnitsImperial:"Imperial (lb, in)",
    langTimeLabel:"Formato de Hora",langTime12:"12 horas",langTime24:"24 horas",
    trainingTitle:"Tipo de Entrenamiento",trainingDesc:"Selecciona tu enfoque principal",
    trainingStrength:"Entrenamiento de Fuerza",trainingStrengthDesc:"Desarrolla músculo y potencia",
    trainingCardio:"Cardio",trainingCardioDesc:"Mejora la resistencia",
    trainingYoga:"Yoga y Flexibilidad",trainingYogaDesc:"Aumenta la movilidad",
    trainingHiit:"HIIT",trainingHiitDesc:"Intervalos de alta intensidad",
    trainingSports:"Entrenamiento Deportivo",trainingSportsDesc:"Ejercicios específicos del deporte",
    trainingMixed:"Entrenamiento Mixto",trainingMixedDesc:"Enfoque equilibrado",
    levelTitle:"Nivel de Fitness",levelDesc:"Ayúdanos a personalizar tus entrenamientos",
    levelBeginner:"Principiante",levelBeginnerDesc:"Comenzando mi viaje",
    levelIntermediate:"Intermedio",levelIntermediateDesc:"Entrenamientos regulares",
    levelAdvanced:"Avanzado",levelAdvancedDesc:"Atleta experimentado",
    weeklyGoalsLabel:"Objetivos Semanales",
    weeklyGoals23:"2-3 sesiones por semana",weeklyGoals45:"4-5 sesiones por semana",
    weeklyGoals67:"6-7 sesiones por semana",weeklyGoalsCustom:"Horario personalizado",
    prefDisplayTitle:"Configuración de Pantalla",prefDisplayDesc:"Personaliza tu interfaz",
    prefHeartRate:"Monitor Cardíaco",prefHeartRateDesc:"Datos de frecuencia cardíaca",
    prefCalories:"Contador de Calorías",prefCaloriesDesc:"Calorías quemadas",
    prefSkeleton:"Seguimiento Esquelético",prefSkeletonDesc:"Análisis de forma",
    prefReps:"Contador de Repeticiones",prefRepsDesc:"Conteo automático",
    prefAudioTitle:"Audio y Voz",prefAudioDesc:"Configura el audio",
    prefVoice:"Entrenamiento por Voz",prefVoiceDesc:"Orientación de audio",
    prefAlerts:"Alertas de Forma",prefAlertsDesc:"Alertas de audio",
    prefMotivation:"Mensajes Motivacionales",prefMotivationDesc:"Ánimo durante series difíciles",
    prefMusic:"Música de Fondo",prefMusicDesc:"Música durante los entrenamientos",
    profileTitle:"Tu Perfil",profileDesc:"Información personal y datos fitness",
    profileFirstName:"Nombre",profileLastName:"Apellido",
    profileAge:"Edad",profileGender:"Género",
    profileGenderMale:"Masculino",profileGenderFemale:"Femenino",
    profileGenderOther:"Otro",profileGenderPrefer:"Prefiero no decir",
    profileHeight:"Altura (cm)",profileWeight:"Peso (kg)",
    profileGoalsLabel:"Objetivos de Fitness",
    profileGoalLoseWeight:"Perder Peso",profileGoalBuildMuscle:"Desarrollar Músculo",
    profileGoalEndurance:"Mejorar Resistencia",profileGoalFlexibility:"Aumentar Flexibilidad",
    profileGoalGeneral:"Fitness General",profileGoalAthletic:"Rendimiento Atlético",
    finalTitle:"¡Configuración Completa!",finalDesc:"Tu espejo inteligente está listo.",
    btnNext:"Siguiente →",btnBack:"← Atrás",btnSubmit:"✓ Completar",btnReset:"Empezar de Nuevo ↺",
    stepOf:"Paso {n} de 5",savedMessage:"✓ ¡Guardado!"
  },
  fr:{
    headerTitle:"Configuration du Miroir Intelligent",headerSubtitle:"Configurez votre expérience fitness personnalisée",
    tabAccount:"Compte",tabLanguage:"Langue",tabTraining:"Entraînement",tabPreferences:"Préférences",tabProfile:"Profil",
    authTitleRegister:"Créez Votre Compte",authTitleLogin:"Bon Retour",
    authDesc:"Commencez votre parcours fitness personnalisé",
    authNameLabel:"Nom Complet",authNamePlaceholder:"Jean Dupont",
    authEmailLabel:"Adresse Email",authEmailPlaceholder:"jean@exemple.com",
    authPasswordLabel:"Mot de Passe",authPasswordPlaceholder:"••••••••",
    authConfirmLabel:"Confirmer le Mot de Passe",
    authToggleRegister:"Vous avez déjà un compte?",authToggleLogin:"Vous n'avez pas de compte?",
    authLinkRegister:"Se Connecter",authLinkLogin:"S'inscrire",
    successMsg:"Compte créé avec succès!",
    langTitle:"Préférences de Langue",langDesc:"Choisissez votre langue et paramètres régionaux",
    langDisplayLabel:"Langue d'Affichage",langVoiceLabel:"Langue Vocal",
    langUnitsLabel:"Unités",langUnitsMetric:"Métrique (kg, cm)",langUnitsImperial:"Impérial (lb, in)",
    langTimeLabel:"Format d'Heure",langTime12:"12 heures",langTime24:"24 heures",
    trainingTitle:"Type d'Entraînement",trainingDesc:"Sélectionnez votre objectif principal",
    trainingStrength:"Musculation",trainingStrengthDesc:"Développer muscles et puissance",
    trainingCardio:"Cardio",trainingCardioDesc:"Améliorer l'endurance",
    trainingYoga:"Yoga et Flexibilité",trainingYogaDesc:"Améliorer la mobilité",
    trainingHiit:"HIIT",trainingHiitDesc:"Intervalles haute intensité",
    trainingSports:"Entraînement Sportif",trainingSportsDesc:"Exercices spécifiques",
    trainingMixed:"Entraînement Mixte",trainingMixedDesc:"Approche équilibrée",
    levelTitle:"Niveau de Fitness",levelDesc:"Aidez-nous à personnaliser vos entraînements",
    levelBeginner:"Débutant",levelBeginnerDesc:"Débuter mon parcours",
    levelIntermediate:"Intermédiaire",levelIntermediateDesc:"Entraînements réguliers",
    levelAdvanced:"Avancé",levelAdvancedDesc:"Athlète expérimenté",
    weeklyGoalsLabel:"Objectifs Hebdomadaires",
    weeklyGoals23:"2-3 séances par semaine",weeklyGoals45:"4-5 séances par semaine",
    weeklyGoals67:"6-7 séances par semaine",weeklyGoalsCustom:"Horaire personnalisé",
    prefDisplayTitle:"Paramètres d'Affichage",prefDisplayDesc:"Personnalisez votre interface",
    prefHeartRate:"Moniteur Cardiaque",prefHeartRateDesc:"Données cardiaques en temps réel",
    prefCalories:"Compteur de Calories",prefCaloriesDesc:"Calories brûlées",
    prefSkeleton:"Suivi Squelettique",prefSkeletonDesc:"Analyse de forme",
    prefReps:"Compteur de Répétitions",prefRepsDesc:"Comptage automatique",
    prefAudioTitle:"Audio et Voix",prefAudioDesc:"Configurer le retour audio",
    prefVoice:"Coaching Vocal",prefVoiceDesc:"Conseils audio",
    prefAlerts:"Alertes de Forme",prefAlertsDesc:"Alertes pour mauvaise forme",
    prefMotivation:"Messages Motivants",prefMotivationDesc:"Encouragement",
    prefMusic:"Musique de Fond",prefMusicDesc:"Musique pendant les entraînements",
    profileTitle:"Votre Profil",profileDesc:"Informations personnelles et données fitness",
    profileFirstName:"Prénom",profileLastName:"Nom",
    profileAge:"Âge",profileGender:"Genre",
    profileGenderMale:"Masculin",profileGenderFemale:"Féminin",
    profileGenderOther:"Autre",profileGenderPrefer:"Préfère ne pas dire",
    profileHeight:"Taille (cm)",profileWeight:"Poids (kg)",
    profileGoalsLabel:"Objectifs Fitness",
    profileGoalLoseWeight:"Perdre du Poids",profileGoalBuildMuscle:"Développer les Muscles",
    profileGoalEndurance:"Améliorer l'Endurance",profileGoalFlexibility:"Augmenter la Flexibilité",
    profileGoalGeneral:"Fitness Général",profileGoalAthletic:"Performance Athlétique",
    finalTitle:"Configuration Terminée!",finalDesc:"Votre miroir intelligent est prêt.",
    btnNext:"Suivant →",btnBack:"← Retour",btnSubmit:"✓ Terminer",btnReset:"Recommencer ↺",
    stepOf:"Étape {n} sur 5",savedMessage:"✓ Enregistré!"
  },
  de:{
    headerTitle:"Smart Mirror Einrichtung",headerSubtitle:"Konfigurieren Sie Ihr Fitness-Erlebnis",
    tabAccount:"Konto",tabLanguage:"Sprache",tabTraining:"Training",tabPreferences:"Einstellungen",tabProfile:"Profil",
    authTitleRegister:"Erstellen Sie Ihr Konto",authTitleLogin:"Willkommen zurück",
    authDesc:"Beginnen Sie Ihre personalisierte Fitness-Reise",
    authNameLabel:"Vollständiger Name",authNamePlaceholder:"Max Mustermann",
    authEmailLabel:"E-Mail-Adresse",authEmailPlaceholder:"max@beispiel.de",
    authPasswordLabel:"Passwort",authPasswordPlaceholder:"••••••••",
    authConfirmLabel:"Passwort bestätigen",
    authToggleRegister:"Haben Sie bereits ein Konto?",authToggleLogin:"Noch kein Konto?",
    authLinkRegister:"Anmelden",authLinkLogin:"Registrieren",
    successMsg:"Konto erfolgreich erstellt!",
    langTitle:"Spracheinstellungen",langDesc:"Wählen Sie Ihre Sprache und Region",
    langDisplayLabel:"Anzeigesprache",langVoiceLabel:"Sprach-Feedback",
    langUnitsLabel:"Einheiten",langUnitsMetric:"Metrisch (kg, cm)",langUnitsImperial:"Imperial (lb, in)",
    langTimeLabel:"Zeitformat",langTime12:"12 Stunden",langTime24:"24 Stunden",
    trainingTitle:"Trainingsart",trainingDesc:"Wählen Sie Ihren Trainingsfokus",
    trainingStrength:"Krafttraining",trainingStrengthDesc:"Muskeln und Kraft aufbauen",
    trainingCardio:"Ausdauer",trainingCardioDesc:"Ausdauer verbessern",
    trainingYoga:"Yoga & Flexibilität",trainingYogaDesc:"Beweglichkeit erhöhen",
    trainingHiit:"HIIT",trainingHiitDesc:"Hochintensive Intervalle",
    trainingSports:"Sporttraining",trainingSportsDesc:"Sportspezifische Übungen",
    trainingMixed:"Gemischtes Training",trainingMixedDesc:"Ausgewogener Ansatz",
    levelTitle:"Fitnesslevel",levelDesc:"Helfen Sie uns, Ihre Workouts anzupassen",
    levelBeginner:"Anfänger",levelBeginnerDesc:"Starte meine Reise",
    levelIntermediate:"Fortgeschritten",levelIntermediateDesc:"Regelmäßige Workouts",
    levelAdvanced:"Experte",levelAdvancedDesc:"Erfahrener Athlet",
    weeklyGoalsLabel:"Wöchentliche Ziele",
    weeklyGoals23:"2-3 Einheiten pro Woche",weeklyGoals45:"4-5 Einheiten pro Woche",
    weeklyGoals67:"6-7 Einheiten pro Woche",weeklyGoalsCustom:"Individueller Zeitplan",
    prefDisplayTitle:"Anzeigeeinstellungen",prefDisplayDesc:"Passen Sie Ihre Oberfläche an",
    prefHeartRate:"Herzfrequenzmonitor",prefHeartRateDesc:"Echtzeit-Herzfrequenz",
    prefCalories:"Kalorienzähler",prefCaloriesDesc:"Kalorien während des Trainings",
    prefSkeleton:"Skelett-Tracking",prefSkeletonDesc:"Echtzeit-Formanalyse",
    prefReps:"Wiederholungszähler",prefRepsDesc:"Automatisches Zählen",
    prefAudioTitle:"Audio & Sprache",prefAudioDesc:"Audio-Feedback konfigurieren",
    prefVoice:"Sprach-Coaching",prefVoiceDesc:"Audio-Anleitung",
    prefAlerts:"Formkorrektur-Warnungen",prefAlertsDesc:"Warnungen bei falscher Form",
    prefMotivation:"Motivations-Ansagen",prefMotivationDesc:"Ermutigung",
    prefMusic:"Hintergrundmusik",prefMusicDesc:"Musik abspielen",
    profileTitle:"Ihr Profil",profileDesc:"Persönliche Informationen und Fitnessdaten",
    profileFirstName:"Vorname",profileLastName:"Nachname",
    profileAge:"Alter",profileGender:"Geschlecht",
    profileGenderMale:"Männlich",profileGenderFemale:"Weiblich",
    profileGenderOther:"Andere",profileGenderPrefer:"Keine Angabe",
    profileHeight:"Größe (cm)",profileWeight:"Gewicht (kg)",
    profileGoalsLabel:"Fitnessziele",
    profileGoalLoseWeight:"Gewicht verlieren",profileGoalBuildMuscle:"Muskeln aufbauen",
    profileGoalEndurance:"Ausdauer verbessern",profileGoalFlexibility:"Flexibilität erhöhen",
    profileGoalGeneral:"Allgemeine Fitness",profileGoalAthletic:"Sportliche Leistung",
    finalTitle:"Einrichtung abgeschlossen!",finalDesc:"Ihr Smart Mirror ist konfiguriert und bereit.",
    btnNext:"Weiter →",btnBack:"← Zurück",btnSubmit:"✓ Abschließen",btnReset:"Neu starten ↺",
    stepOf:"Schritt {n} von 5",savedMessage:"✓ Gespeichert!"
  }
};


/* ════════════════════════════════════════
   TRANSLATION ENGINE
════════════════════════════════════════ */
function t(key){
  const d = translations[currentLang];
  return (d && d[key] != null) ? d[key] : (translations.en[key] || key);
}

function applyTranslations(){
  const isRTL = currentLang === 'ar';
  document.documentElement.setAttribute('lang', currentLang);
  document.documentElement.setAttribute('dir',  isRTL ? 'rtl' : 'ltr');

  // data-t elements
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    const val = t(key);
    if(el.tagName === 'OPTION' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
      if(el.tagName === 'OPTION') el.textContent = val;
      else el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });

  // data-ph: only placeholder
  document.querySelectorAll('[data-ph]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-ph'));
  });

  // step counters  [data-step="N"]
  document.querySelectorAll('[data-step]').forEach(el => {
    const n = el.getAttribute('data-step');
    el.textContent = t('stepOf').replace('{n}', n);
  });

  // auth mode labels
  refreshAuthMode();
}

/* ════════════════════════════════════════
   LANGUAGE CHANGE
════════════════════════════════════════ */
function onLangChange(val){
  currentLang = val;
  applyTranslations();
  // card pulse
  const card = document.querySelector('#step-1 .card');
  if(card){ card.style.transform='scale(0.985)'; setTimeout(()=>{ card.style.transform=''; },280); }
}

/* ════════════════════════════════════════
   AUTH TOGGLE
════════════════════════════════════════ */
function refreshAuthMode(){
  const title    = document.getElementById('authTitle');
  const togText  = document.getElementById('authToggleText');
  const togLink  = document.getElementById('authToggleLink');
  const nameFld  = document.getElementById('nameField');
  const confFld  = document.getElementById('confirmField');
  if(!title) return;
  title.textContent   = isRegisterMode ? t('authTitleRegister') : t('authTitleLogin');
  togText.textContent = isRegisterMode ? t('authToggleRegister') : t('authToggleLogin');
  togLink.textContent = ' ' + (isRegisterMode ? t('authLinkRegister') : t('authLinkLogin'));
  nameFld.style.display  = isRegisterMode ? '' : 'none';
  confFld.style.display  = isRegisterMode ? '' : 'none';
}

document.getElementById('authToggleLink')?.addEventListener('click', e => {
  e.preventDefault();
  isRegisterMode = !isRegisterMode;
  refreshAuthMode();
});

/* ════════════════════════════════════════
   STEP WIZARD
════════════════════════════════════════ */
function updateProgress(){
  for(let i=0;i<TOTAL;i++){
    const dot  = document.getElementById('sd-'+i);
    const item = document.getElementById('si-'+i);
    const line = document.getElementById('sl-'+i);
    if(!dot||!item) continue;
    dot.classList.remove('active','done');
    item.classList.remove('active','done');
    if(i<currentStep){
      dot.classList.add('done'); item.classList.add('done');
      dot.textContent='✓';
    } else if(i===currentStep){
      dot.classList.add('active'); item.classList.add('active');
      dot.textContent=String(i+1);
    } else {
      dot.textContent=String(i+1);
    }
    if(line) line.classList.toggle('done', i<currentStep);
  }
}

// ════════════════════════════════════════
// MULTI-STEP WIZARD NAVIGATION LOGIC
// ════════════════════════════════════════
function showStep(n) {
  const steps = document.querySelectorAll('.step-panel');
  steps.forEach(p => p.classList.remove('active'));
  steps[n].classList.add('active');
  updateProgress();
  window.scrollTo({top:0,behavior:'smooth'});

  const indicator = document.getElementById('stepIndicator');
  if (indicator) {
    indicator.textContent = `Step ${n + 1} of ${TOTAL}`;
  }

  const btnPrev = document.getElementById('btnPrev');
  if (btnPrev) {
    btnPrev.style.display = n === 0 ? 'none' : 'inline-block';
  }

  const btnNext = document.getElementById('btnNext');
  if (btnNext) {
    btnNext.textContent = n === TOTAL - 1 ? 'Complete Setup' : 'Next';
  }

  // Inject user's registration name initials dynamically inside Step 5 (Profile)
  if (n === TOTAL - 1) { 
    const registrationName = document.getElementById("fullName")?.value || "";
    const avatarContent = document.getElementById("avatarContent");
    
    // Only trigger if no custom uploaded or captured image is currently active
    if (avatarContent && !base64Avatar) {
      if (registrationName.trim()) {
        const firstLetter = registrationName.trim().charAt(0).toUpperCase();
        avatarContent.textContent = firstLetter;
      } else {
        avatarContent.textContent = "U"; 
      }
    }
  }
}

async function goNext() {
  if (currentStep === 0) {
    const ok = await handleAuth();
    if (!ok) return; 
  }

  if (currentStep < TOTAL - 1) {
    currentStep++;
    showStep(currentStep);
  } else {
    await submitForm();
  }
}

function goPrev() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// ════════════════════════════════════════
// FORM DATA AGGREGATION & SUBMISSION
// ════════════════════════════════════════
function collectFormData() {
  const registrationName = document.getElementById("fullName")?.value || "";
  const nameParts = registrationName.trim().split(" ");
  const fallbackFirst = nameParts[0] || "";
  const fallbackLast = nameParts.slice(1).join(" ") || "";

  return {
    language: (document.getElementById('p_lang')||{}).value || 'en',
    training: {
      experience: (document.getElementById('p_exp')||{}).value || '',
      level:      (document.getElementById('p_lvl')||{}).value || ''
    },
    preferences: {
      theme:      (document.getElementById('p_theme')||{}).value || 'dark'
    },
    profile: {
      firstName:   fallbackFirst,
      lastName:    fallbackLast,
      name:        registrationName,
      avatar:      base64Avatar, 
      age:         (document.getElementById('p_age')||{}).value ? Number(document.getElementById('p_age').value) : 28,
      height:      (document.getElementById('p_height')||{}).value ? Number(document.getElementById('p_height').value) : 175,
      weight:      (document.getElementById('p_weight')||{}).value ? Number(document.getElementById('p_weight').value) : 70,
      gender:      (document.getElementById('p_gender')||{}).value || 'male',
      fitnessGoal: (document.getElementById('p_goal')||{}).value || 'general-fitness'
    }
  };
}

async function submitForm() {
  const data = collectFormData();

  try {
    const res = await fetch("http://localhost:3000/api/user/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!result.ok) {
      toast.error(result.error || "Error saving data", "Save Failed");
      return;
    }
    toast.success("Setup completed successfully!", "Welcome");
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('finalSuccess').classList.add('show');

    setTimeout(() => {
      window.location.href = "../dashboard/index.html";
    }, 1500);

  } catch (err) {
    console.error(err);
    toast.error("Server connection error.", "Connection Error");
  }
}

function resetForm() {
  currentStep = 0; 
  isRegisterMode = true;
  base64Avatar = "";
  const avatarContent = document.getElementById("avatarContent");
  if (avatarContent) avatarContent.innerHTML = "";
  document.getElementById('finalSuccess').classList.remove('show');
  document.getElementById('stepProgress').style.opacity = '1';
  applyTranslations();
  showStep(0);
}

// ════════════════════════════════════════
// AVATAR INTERACTIONS (File Upload & Live Webcam Capture)
// ════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  // Click listener for the profile avatar zone to trigger standard file picker
  document.getElementById("avatarClickZone")?.addEventListener("click", function() {
    document.getElementById("p_avatar")?.click();
  });

  // Handle local file uploads and read them into standard Base64 representation URL strings
  document.getElementById("p_avatar")?.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        base64Avatar = event.target.result;
        const avatarContent = document.getElementById("avatarContent");
        if (avatarContent) {
          avatarContent.innerHTML = `<img src="${base64Avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;" />`;
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // Live Webcam Capture Handler Initialization
  const video = document.getElementById("webcamVideo");
  const canvas = document.getElementById("webcamCanvas");
  const btnCapture = document.getElementById("btnCaptureCamera");
  let streamRef = null;

  btnCapture?.addEventListener("click", async () => {
    const avatarContent = document.getElementById("avatarContent");
    
    // Step A: If video stream is not running, request webcam access permissions
    if (!streamRef) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 300, height: 300 }, audio: false });
        streamRef = stream;
        if (video) {
          video.srcObject = stream;
          video.style.display = "block"; // Display stream container view window
        }
        if (avatarContent) avatarContent.style.display = "none"; // Temporarily hide initial text
        btnCapture.textContent = "📸 Snap Photo"; // Toggle contextual dynamic operational label text
        btnCapture.style.background = "var(--green)";
      } catch (err) {
        console.error("Camera access denied or unmapped:", err);
        alert("Could not access webcam device.");
      }
    } 
    // Step B: Stream is active, treat this second click as a hardware shutter snapshot event
    else {
      if (video && canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth || 300;
        canvas.height = video.videoHeight || 300;
        
        // Render current stream raster frames into memory canvas boundaries
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Export raw frame canvas memory blocks into persistent Base64 representation assets
        base64Avatar = canvas.toDataURL("image/jpeg");
        
        if (avatarContent) {
          avatarContent.innerHTML = `<img src="${base64Avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;" />`;
          avatarContent.style.display = "block";
        }
        
        // Tear down active media stream trackers to release hardware camera indicators safely
        streamRef.getTracks().forEach(track => track.stop());
        streamRef = null;
        video.style.display = "none";
        
        btnCapture.textContent = "📸 Retake Live Photo";
        btnCapture.style.background = "rgba(255,255,255,0.08)";
      }
    }
  });
});

/* ════════════════════════════════════════
   OPTION CARDS
════════════════════════════════════════ */
function selectOption(card){
  const group = card.getAttribute('data-group');
  document.querySelectorAll('[data-group="'+group+'"]').forEach(c=>c.classList.remove('selected'));
  card.classList.add('selected');
}

/* ════════════════════════════════════════
   THEME
════════════════════════════════════════ */
function toggleTheme(){
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme', isDark?'light':'dark');
  const label = document.getElementById('themeLabel');
  const icon  = document.getElementById('themeIcon');
  if(isDark){
    label.textContent='Dark Mode';
    icon.innerHTML='<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" stroke="none"/>';
  } else {
    label.textContent='Light Mode';
    icon.innerHTML=`<circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
  }
}
