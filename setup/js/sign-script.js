let token = localStorage.getItem("token") || null;

async function handleLogin() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passInput").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return false;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.error || "Login failed");
      return false;
    }

    if (data.token) {
      token = data.token;
      localStorage.setItem("token", token);
      window.location.href = "../dashboard/index.html";
      return true;
    }

    return false;

  } catch (err) {
    console.error(err);
    alert("Server error");
    return false;
  }
}

/* ════════════════════════════════════════
   TRANSLATIONS
════════════════════════════════════════ */
const translations = {
  en: {
    authTitleLogin: "Welcome Back",
    authEmailLabel: "Email Address",
    authEmailPlaceholder: "john@example.com",
    authPasswordLabel: "Password",
    authPasswordPlaceholder: "••••••••",
    authDesc: "Get started with your personalized fitness journey",
    authToggleLogin: "Don't have an account?",
    authLinkLogin: "Create one",
    btnSubmit: "Sign In →"
  },
  ar: {
    authTitleLogin: "مرحباً بعودتك",
    authEmailLabel: "البريد الإلكتروني",
    authEmailPlaceholder: "ahmed@example.com",
    authPasswordLabel: "كلمة المرور",
    authPasswordPlaceholder: "••••••••",
    authDesc: "ابدأ رحلة اللياقة البدنية الشخصية الخاصة بك",
    authToggleLogin: "ليس لديك حساب؟",
    authLinkLogin: "أنشئ واحد",
    btnSubmit: "تسجيل الدخول ←"
  },
  es: {
    authTitleLogin: "Bienvenido de Nuevo",
    authEmailLabel: "Correo Electrónico",
    authEmailPlaceholder: "juan@ejemplo.com",
    authPasswordLabel: "Contraseña",
    authPasswordPlaceholder: "••••••••",
    authDesc: "Comienza tu viaje de fitness personalizado",
    authToggleLogin: "¿No tienes cuenta?",
    authLinkLogin: "Crear una",
    btnSubmit: "Iniciar Sesión →"
  },
  fr: {
    authTitleLogin: "Bon Retour",
    authEmailLabel: "Adresse Email",
    authEmailPlaceholder: "jean@exemple.com",
    authPasswordLabel: "Mot de Passe",
    authPasswordPlaceholder: "••••••••",
    authDesc: "Commencez votre parcours fitness personnalisé",
    authToggleLogin: "Vous n'avez pas de compte?",
    authLinkLogin: "En créer un",
    btnSubmit: "Se Connecter →"
  },
  de: {
    authTitleLogin: "Willkommen zurück",
    authEmailLabel: "E-Mail-Adresse",
    authEmailPlaceholder: "max@beispiel.de",
    authPasswordLabel: "Passwort",
    authPasswordPlaceholder: "••••••••",
    authDesc: "Beginnen Sie Ihre personalisierte Fitness-Reise",
    authToggleLogin: "Noch kein Konto?",
    authLinkLogin: "Erstellen Sie eines",
    btnSubmit: "Anmelden →"
  }
};

let currentLang = 'en';

function t(key) {
  const d = translations[currentLang];
  return (d && d[key] != null) ? d[key] : (translations.en[key] || key);
}

function applyTranslations() {
  const isRTL = currentLang === 'ar';
  document.documentElement.setAttribute('lang', currentLang);
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

  // data-t elements
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    const val = t(key);
    if (el.tagName === 'OPTION' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.tagName === 'OPTION') el.textContent = val;
      else el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });

  // data-ph: only placeholder
  document.querySelectorAll('[data-ph]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-ph'));
  });
}

function onLangChange(val) {
  currentLang = val;
  applyTranslations();
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const label = document.getElementById('themeLabel');
  const icon = document.getElementById('themeIcon');
  if (isDark) {
    label.textContent = 'Dark Mode';
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" stroke="none"/>';
  } else {
    label.textContent = 'Light Mode';
    icon.innerHTML = `<circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
  }
}

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
applyTranslations();
