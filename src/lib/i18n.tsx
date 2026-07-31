import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type LangCode = string;

export type Language = { code: LangCode; label: string; native: string; locale: string; rtl?: boolean };

export const languages: Language[] = [
  { code: "en", label: "English", native: "English", locale: "en-IN" },
  { code: "hi", label: "Hindi", native: "हिन्दी", locale: "hi-IN" },
  { code: "mr", label: "Marathi", native: "मराठी", locale: "mr-IN" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", locale: "gu-IN" },
  { code: "ta", label: "Tamil", native: "தமிழ்", locale: "ta-IN" },
  { code: "te", label: "Telugu", native: "తెలుగు", locale: "te-IN" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", locale: "kn-IN" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", locale: "ml-IN" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", locale: "pa-IN" },
  { code: "bn", label: "Bengali", native: "বাংলা", locale: "bn-IN" },
  { code: "ur", label: "Urdu", native: "اردو", locale: "ur-IN", rtl: true },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", locale: "or-IN" },
  { code: "as", label: "Assamese", native: "অসমীয়া", locale: "as-IN" },
  { code: "ne", label: "Nepali", native: "नेपाली", locale: "ne-NP" },
  { code: "si", label: "Sinhala", native: "සිංහල", locale: "si-LK" },
  { code: "ar", label: "Arabic", native: "العربية", locale: "ar-AE", rtl: true },
  { code: "fa", label: "Persian", native: "فارسی", locale: "fa-IR", rtl: true },
  { code: "he", label: "Hebrew", native: "עברית", locale: "he-IL", rtl: true },
  { code: "es", label: "Spanish", native: "Español", locale: "es-ES" },
  { code: "fr", label: "French", native: "Français", locale: "fr-FR" },
  { code: "de", label: "German", native: "Deutsch", locale: "de-DE" },
  { code: "it", label: "Italian", native: "Italiano", locale: "it-IT" },
  { code: "pt", label: "Portuguese", native: "Português", locale: "pt-BR" },
  { code: "nl", label: "Dutch", native: "Nederlands", locale: "nl-NL" },
  { code: "el", label: "Greek", native: "Ελληνικά", locale: "el-GR" },
  { code: "ru", label: "Russian", native: "Русский", locale: "ru-RU" },
  { code: "pl", label: "Polish", native: "Polski", locale: "pl-PL" },
  { code: "ro", label: "Romanian", native: "Română", locale: "ro-RO" },
  { code: "hu", label: "Hungarian", native: "Magyar", locale: "hu-HU" },
  { code: "sv", label: "Swedish", native: "Svenska", locale: "sv-SE" },
  { code: "no", label: "Norwegian", native: "Norsk", locale: "nb-NO" },
  { code: "fi", label: "Finnish", native: "Suomi", locale: "fi-FI" },
  { code: "tr", label: "Turkish", native: "Türkçe", locale: "tr-TR" },
  { code: "zh", label: "Chinese", native: "中文", locale: "zh-CN" },
  { code: "ja", label: "Japanese", native: "日本語", locale: "ja-JP" },
  { code: "ko", label: "Korean", native: "한국어", locale: "ko-KR" },
  { code: "th", label: "Thai", native: "ไทย", locale: "th-TH" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt", locale: "vi-VN" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia", locale: "id-ID" },
  { code: "ms", label: "Malay", native: "Bahasa Melayu", locale: "ms-MY" },
];

/**
 * Base dictionary. `en` holds every key; other languages may be partial and
 * fall back to English, which keeps the architecture open for new locales.
 */
export const dictionary: Record<string, Partial<Record<LangCode, string>>> = {
  "brand.name": { en: "Transit India", hi: "ट्रांज़िट इंडिया", ar: "ترانزيت إنديا", es: "Transit India" },
  "brand.tagline": { en: "Rail · Bus · Metro", hi: "रेल · बस · मेट्रो", ar: "قطار · حافلة · مترو", es: "Tren · Bus · Metro" },

  "nav.home": { en: "Home", hi: "होम", ar: "الرئيسية", es: "Inicio", fr: "Accueil", de: "Start" },
  "nav.book": { en: "Book", hi: "बुक करें", ar: "احجز", es: "Reservar", fr: "Réserver", de: "Buchen" },
  "nav.pnr": { en: "PNR", hi: "पीएनआर", ar: "PNR", es: "PNR" },
  "nav.cabber": { en: "Cabber", hi: "कैबर", ar: "كابر", es: "Cabber" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड", ar: "لوحة التحكم", es: "Panel" },
  "nav.about": { en: "About", hi: "परिचय", ar: "حول", es: "Acerca de" },

  "auth.welcome": { en: "Welcome back", hi: "वापसी पर स्वागत है", ar: "مرحبًا بعودتك", es: "Bienvenido de nuevo" },
  "auth.createAccount": { en: "Create your account", hi: "अपना खाता बनाएँ", ar: "أنشئ حسابك", es: "Crea tu cuenta" },
  "auth.signIn": { en: "Sign in", hi: "साइन इन", ar: "تسجيل الدخول", es: "Iniciar sesión" },
  "auth.signUp": { en: "Sign up", hi: "साइन अप", ar: "إنشاء حساب", es: "Registrarse" },
  "auth.email": { en: "Email address", hi: "ईमेल पता", ar: "البريد الإلكتروني", es: "Correo electrónico" },
  "auth.username": { en: "Username", hi: "उपयोगकर्ता नाम", ar: "اسم المستخدم", es: "Nombre de usuario" },
  "auth.password": { en: "Password", hi: "पासवर्ड", ar: "كلمة المرور", es: "Contraseña" },
  "auth.photo": { en: "Profile photo (optional)", hi: "प्रोफ़ाइल फ़ोटो (वैकल्पिक)", ar: "صورة الملف الشخصي (اختياري)", es: "Foto de perfil (opcional)" },
  "auth.logout": { en: "Logout", hi: "लॉग आउट", ar: "تسجيل الخروج", es: "Cerrar sesión" },

  "dash.profile": { en: "My Profile", hi: "मेरी प्रोफ़ाइल", ar: "ملفي", es: "Mi perfil" },
  "dash.bookings": { en: "My Bookings", hi: "मेरी बुकिंग", ar: "حجوزاتي", es: "Mis reservas" },
  "dash.passengers": { en: "Saved Passengers", hi: "सहेजे गए यात्री", ar: "الركاب المحفوظون", es: "Pasajeros guardados" },
  "dash.settings": { en: "Settings", hi: "सेटिंग्स", ar: "الإعدادات", es: "Ajustes" },

  "common.from": { en: "From", hi: "से", ar: "من", es: "Desde" },
  "common.to": { en: "To", hi: "तक", ar: "إلى", es: "Hasta" },
  "common.date": { en: "Date", hi: "तारीख", ar: "التاريخ", es: "Fecha" },
  "common.search": { en: "Search", hi: "खोजें", ar: "بحث", es: "Buscar" },
  "common.save": { en: "Save", hi: "सहेजें", ar: "حفظ", es: "Guardar" },
  "common.cancel": { en: "Cancel", hi: "रद्द करें", ar: "إلغاء", es: "Cancelar" },
  "common.edit": { en: "Edit", hi: "संपादित करें", ar: "تعديل", es: "Editar" },
  "common.delete": { en: "Delete", hi: "हटाएँ", ar: "حذف", es: "Eliminar" },
  "common.add": { en: "Add", hi: "जोड़ें", ar: "إضافة", es: "Añadir" },
  "common.continue": { en: "Continue", hi: "जारी रखें", ar: "متابعة", es: "Continuar" },
  "common.language": { en: "Language", hi: "भाषा", ar: "اللغة", es: "Idioma" },
  "common.location": { en: "Location", hi: "स्थान", ar: "الموقع", es: "Ubicación" },
  "common.search.lang": { en: "Search languages", hi: "भाषाएँ खोजें" },

  "greet.morning": { en: "Good morning", hi: "सुप्रभात", ar: "صباح الخير", es: "Buenos días", fr: "Bonjour" },
  "greet.afternoon": { en: "Good afternoon", hi: "नमस्कार", ar: "مساء الخير", es: "Buenas tardes", fr: "Bon après-midi" },
  "greet.evening": { en: "Good evening", hi: "शुभ संध्या", ar: "مساء الخير", es: "Buenas noches", fr: "Bonsoir" },

  "auth.fullName": { en: "Full name", hi: "पूरा नाम", ar: "الاسم الكامل", es: "Nombre completo" },
  "auth.confirmPassword": { en: "Confirm password", hi: "पासवर्ड की पुष्टि करें", ar: "تأكيد كلمة المرور", es: "Confirmar contraseña" },
  "auth.rememberMe": { en: "Remember me on this device", hi: "इस डिवाइस पर मुझे याद रखें", ar: "تذكرني على هذا الجهاز", es: "Recordarme en este dispositivo" },
  "auth.forgot": { en: "Forgot password?", hi: "पासवर्ड भूल गए?", ar: "نسيت كلمة المرور؟", es: "¿Olvidaste tu contraseña?" },
  "auth.reset": { en: "Reset password", hi: "पासवर्ड रीसेट करें", ar: "إعادة تعيين كلمة المرور", es: "Restablecer contraseña" },
  "auth.locationPermission": { en: "Use my location for nearby suggestions", hi: "आस-पास के सुझावों के लिए मेरा स्थान उपयोग करें", ar: "استخدم موقعي للاقتراحات القريبة", es: "Usar mi ubicación para sugerencias cercanas" },
  "auth.logoutConfirm": { en: "Are you sure you want to log out?", hi: "क्या आप वाकई लॉग आउट करना चाहते हैं?", ar: "هل تريد تسجيل الخروج؟", es: "¿Seguro que quieres cerrar sesión?" },


  "error.sameStation": {
    en: "Source and destination cannot be the same.",
    hi: "स्रोत और गंतव्य एक समान नहीं हो सकते।",
    ar: "لا يمكن أن يكون المصدر والوجهة متطابقين.",
    es: "El origen y el destino no pueden ser iguales.",
    fr: "L'origine et la destination ne peuvent pas être identiques.",
  },
  "tatkal.live": {
    en: "Tatkal booking is now live.",
    hi: "तत्काल बुकिंग अब शुरू है।",
    ar: "حجز تاتكال متاح الآن.",
    es: "La reserva Tatkal ya está activa.",
  },
  "pay.noDeduction": { en: "No payment deducted.", hi: "कोई भुगतान नहीं काटा गया।", ar: "لم يتم خصم أي مبلغ.", es: "No se ha cobrado ningún pago." },
  "pay.refund": { en: "Instant refund initiated.", hi: "तत्काल रिफंड शुरू किया गया।", ar: "تم بدء استرداد فوري.", es: "Reembolso instantáneo iniciado." },
  "pay.quickRefund": { en: "Quick Refund Processing.", hi: "त्वरित रिफंड प्रक्रिया।", ar: "جارٍ الاسترداد السريع.", es: "Procesando reembolso rápido." },

  "disclaimer.text": {
    en: "This website is a conceptual frontend prototype created exclusively for hackathon and educational purposes. It is not a real booking platform and is not affiliated with, endorsed by, or connected to any government organization, railway operator, airline, hotel company, transport provider, or commercial travel service. All names, logos, routes, schedules, fares, vehicles, operators, QR codes, and booking information are fictional placeholders created solely for demonstration.",
    hi: "यह वेबसाइट पूरी तरह से हैकाथॉन और शैक्षिक उद्देश्यों के लिए बनाया गया एक वैचारिक फ्रंटएंड प्रोटोटाइप है। यह कोई वास्तविक बुकिंग प्लेटफ़ॉर्म नहीं है और किसी भी सरकारी संस्था, रेलवे संचालक, एयरलाइन, होटल कंपनी, परिवहन प्रदाता या वाणिज्यिक यात्रा सेवा से संबद्ध, समर्थित या जुड़ा हुआ नहीं है। सभी नाम, लोगो, मार्ग, समय-सारणी, किराए, वाहन, संचालक, क्यूआर कोड और बुकिंग जानकारी केवल प्रदर्शन के लिए बनाए गए काल्पनिक प्लेसहोल्डर हैं।",
    ar: "هذا الموقع نموذج أولي واجهي مفاهيمي أُنشئ حصريًا لأغراض الهاكاثون والتعليم. إنه ليس منصة حجز حقيقية وليس تابعًا لأي جهة حكومية أو مشغل سكك حديدية أو شركة طيران أو فندق أو مزود نقل أو خدمة سفر تجارية. جميع الأسماء والشعارات والمسارات والجداول والأسعار والمركبات والمشغلين ورموز QR ومعلومات الحجز هي عناصر خيالية لأغراض العرض فقط.",
  },
  "about.summary": {
    en: "This project is an AI-powered travel platform prototype built exclusively for a hackathon. It demonstrates how modern technology can simplify transportation booking through conversational AI, pre-booking, intelligent travel planning, passenger management, multilingual accessibility, and integrated last-mile connectivity.",
  },
};

type I18nValue = {
  lang: LangCode;
  language: Language;
  setLang: (l: LangCode) => void;
  t: (key: string, fallback?: string) => string;
  dir: "ltr" | "rtl";
  formatDate: (d: Date | string | number, opts?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (n: number, opts?: Intl.NumberFormatOptions) => string;
  formatCurrency: (n: number) => string;
};

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "transit-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (window.localStorage.getItem(STORAGE_KEY) as LangCode | null) : null;
    if (saved && languages.some((l) => l.code === saved)) setLangState(saved);
  }, []);

  const language = useMemo(() => languages.find((l) => l.code === lang) ?? languages[0], [lang]);
  const dir: "ltr" | "rtl" = language.rtl ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => dictionary[key]?.[lang] ?? dictionary[key]?.en ?? fallback ?? key,
    [lang],
  );

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      language,
      setLang,
      t,
      dir,
      formatDate: (d, opts) =>
        new Intl.DateTimeFormat(language.locale, opts ?? { weekday: "short", day: "2-digit", month: "short" }).format(new Date(d)),
      formatNumber: (n, opts) => new Intl.NumberFormat(language.locale, opts).format(n),
      formatCurrency: (n) =>
        new Intl.NumberFormat(language.locale, { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n),
    }),
    [lang, language, setLang, t, dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
