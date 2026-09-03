import { createContext, useContext, useMemo, useState } from "react";

const translations = {
  en: {
    language: "Language", home: "Home", dashboard: "Dashboard", detect: "Detect Disease", risk: "Risk", map: "Map", login: "Login",
    heroBadge: "🌱 Smart Agriculture for Farmers", heroTitle: "Detect Crop Diseases", heroTitle2: "Before They Spread", heroText: "Take a photo of your crop and get quick disease detection, pest identification and practical treatment advice.",
    detectDisease: "Detect Disease", getStarted: "Get Started", aiDetection: "AI Crop Detection", earlyDetection: "Early detection", guestScan: "Scan your crop as a guest", loginCenter: "Farmer Login",
    welcome: "Namaste", dashboardSub: "Monitor your crops and detect problems early.", checkCrop: "Check My Crop", quickActions: "Quick Actions", myReports: "My Reports", riskForecast: "Risk Forecast", diseaseMap: "Disease Map", expert: "Expert Validation", farmerDetails: "Farmer Details",
    scan: "Scan Crop", cameraReady: "Camera is ready", allowCamera: "Allow camera access to scan your crop", capture: "Capture Photo", retake: "Retake", analyze: "Analyze Crop", cropType: "Crop Type", location: "Location", selectCrop: "Select crop", uploadFallback: "Use image upload instead", cameraError: "Camera access is unavailable. Please allow permission or use image upload.",
    otpLogin: "OTP Login", passwordLogin: "Password Login", mobile: "Mobile Number", password: "Password", enterMobile: "Enter mobile number", enterPassword: "Enter password", sendOtp: "Send OTP", verifyOtp: "Verify OTP", enterOtp: "Enter OTP", resend: "Resend OTP", forgot: "Forgot password?", remember: "Save login on this device", create: "Create account",
    forgotTitle: "Reset Password", forgotText: "Enter your registered mobile number and we will send an OTP.", sendReset: "Send Reset OTP", backLogin: "Back to Login",
    profileTitle: "Farmer Details", profileText: "Your farm profile, crop history and previous activity.", personal: "Personal Information", farm: "Farm Information", history: "Crop History", historyText: "Your previous scans and disease reports will appear here.", village: "Village", district: "District", land: "Land / Farm Size", crops: "Main Crops",
  },
  hi: {
    language: "भाषा", home: "होम", dashboard: "डैशबोर्ड", detect: "रोग पहचान", risk: "जोखिम", map: "मानचित्र", login: "लॉगिन",
    heroBadge: "🌱 किसानों के लिए स्मार्ट कृषि", heroTitle: "फसल रोगों की पहचान करें", heroTitle2: "फैलने से पहले", heroText: "फसल की फोटो लें और रोग पहचान, कीट की जानकारी और उपयोगी उपचार सलाह पाएं।",
    detectDisease: "रोग पहचानें", getStarted: "शुरू करें", aiDetection: "AI फसल पहचान", earlyDetection: "जल्दी पहचान", guestScan: "अतिथि के रूप में फसल स्कैन करें", loginCenter: "किसान लॉगिन",
    welcome: "नमस्ते", dashboardSub: "अपनी फसलों पर नज़र रखें और समस्याओं की जल्दी पहचान करें।", checkCrop: "मेरी फसल जांचें", quickActions: "त्वरित विकल्प", myReports: "मेरी रिपोर्ट", riskForecast: "जोखिम पूर्वानुमान", diseaseMap: "रोग मानचित्र", expert: "विशेषज्ञ सत्यापन", farmerDetails: "किसान विवरण",
    scan: "फसल स्कैन", cameraReady: "कैमरा तैयार है", allowCamera: "फसल स्कैन करने के लिए कैमरा अनुमति दें", capture: "फोटो लें", retake: "फिर से लें", analyze: "फसल का विश्लेषण करें", cropType: "फसल का प्रकार", location: "स्थान", selectCrop: "फसल चुनें", uploadFallback: "इसके बजाय फोटो अपलोड करें", cameraError: "कैमरा उपलब्ध नहीं है। अनुमति दें या फोटो अपलोड करें।",
    otpLogin: "OTP लॉगिन", passwordLogin: "पासवर्ड लॉगिन", mobile: "मोबाइल नंबर", password: "पासवर्ड", enterMobile: "मोबाइल नंबर दर्ज करें", enterPassword: "पासवर्ड दर्ज करें", sendOtp: "OTP भेजें", verifyOtp: "OTP सत्यापित करें", enterOtp: "OTP दर्ज करें", resend: "OTP फिर भेजें", forgot: "पासवर्ड भूल गए?", remember: "इस डिवाइस पर लॉगिन सेव करें", create: "खाता बनाएं",
    forgotTitle: "पासवर्ड रीसेट", forgotText: "अपना पंजीकृत मोबाइल नंबर दर्ज करें, हम OTP भेजेंगे।", sendReset: "रीसेट OTP भेजें", backLogin: "लॉगिन पर वापस",
    profileTitle: "किसान विवरण", profileText: "आपकी खेती की प्रोफाइल, फसल इतिहास और पिछली गतिविधियां।", personal: "व्यक्तिगत जानकारी", farm: "खेत की जानकारी", history: "फसल इतिहास", historyText: "आपकी पिछली स्कैन और रोग रिपोर्ट यहां दिखाई देंगी।", village: "गांव", district: "जिला", land: "भूमि / खेत का आकार", crops: "मुख्य फसलें",
  },
  mr: {
    language: "भाषा", home: "मुख्यपृष्ठ", dashboard: "डॅशबोर्ड", detect: "रोग ओळख", risk: "जोखीम", map: "नकाशा", login: "लॉगिन",
    heroBadge: "🌱 शेतकऱ्यांसाठी स्मार्ट शेती", heroTitle: "पिकांचे रोग ओळखा", heroTitle2: "पसरायच्या आधी", heroText: "पिकाचा फोटो घ्या आणि रोग ओळख, किडीची माहिती व उपयुक्त उपचार सल्ला मिळवा.",
    detectDisease: "रोग ओळखा", getStarted: "सुरुवात करा", aiDetection: "AI पीक ओळख", earlyDetection: "लवकर ओळख", guestScan: "अतिथी म्हणून पीक स्कॅन करा", loginCenter: "शेतकरी लॉगिन",
    welcome: "नमस्कार", dashboardSub: "तुमच्या पिकांवर लक्ष ठेवा आणि समस्या लवकर ओळखा.", checkCrop: "माझे पीक तपासा", quickActions: "जलद पर्याय", myReports: "माझे अहवाल", riskForecast: "जोखीम अंदाज", diseaseMap: "रोग नकाशा", expert: "तज्ज्ञ पडताळणी", farmerDetails: "शेतकरी माहिती",
    scan: "पीक स्कॅन", cameraReady: "कॅमेरा तयार आहे", allowCamera: "पीक स्कॅन करण्यासाठी कॅमेऱ्याला परवानगी द्या", capture: "फोटो घ्या", retake: "पुन्हा घ्या", analyze: "पिकाचे विश्लेषण करा", cropType: "पिकाचा प्रकार", location: "स्थान", selectCrop: "पीक निवडा", uploadFallback: "त्याऐवजी फोटो अपलोड करा", cameraError: "कॅमेरा उपलब्ध नाही. परवानगी द्या किंवा फोटो अपलोड करा.",
    otpLogin: "OTP लॉगिन", passwordLogin: "पासवर्ड लॉगिन", mobile: "मोबाईल नंबर", password: "पासवर्ड", enterMobile: "मोबाईल नंबर टाका", enterPassword: "पासवर्ड टाका", sendOtp: "OTP पाठवा", verifyOtp: "OTP तपासा", enterOtp: "OTP टाका", resend: "OTP पुन्हा पाठवा", forgot: "पासवर्ड विसरलात?", remember: "या डिव्हाइसवर लॉगिन सेव्ह करा", create: "खाते तयार करा",
    forgotTitle: "पासवर्ड रीसेट", forgotText: "तुमचा नोंदणीकृत मोबाईल नंबर टाका, आम्ही OTP पाठवू.", sendReset: "रीसेट OTP पाठवा", backLogin: "लॉगिनवर परत",
    profileTitle: "शेतकरी माहिती", profileText: "तुमची शेती प्रोफाइल, पीक इतिहास आणि मागील गतिविधी.", personal: "वैयक्तिक माहिती", farm: "शेताची माहिती", history: "पीक इतिहास", historyText: "तुमचे मागील स्कॅन आणि रोग अहवाल येथे दिसतील.", village: "गाव", district: "जिल्हा", land: "जमीन / शेताचा आकार", crops: "मुख्य पिके",
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("cropcare-language") || "en");
  const changeLanguage = (value) => { setLanguage(value); localStorage.setItem("cropcare-language", value); };
  const value = useMemo(() => ({ language, setLanguage: changeLanguage, t: (key) => translations[language]?.[key] || translations.en[key] || key }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
