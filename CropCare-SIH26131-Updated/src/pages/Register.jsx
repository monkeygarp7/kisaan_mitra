import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, User, Mail, Lock, Phone, MapPin } from "lucide-react";
import VoiceInputButton from "../components/VoiceInputButton";
import { useLanguage } from "../context/LanguageContext";
import { createFarmer } from "../utils/api";
import { getCurrentPosition } from "../utils/geo";

function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [village, setVillage] = useState("");
  const [crop, setCrop] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const finalName = name || "Farmer";
    const finalMobile = mobile;

    setSubmitting(true);
    setError("");

    // Best-effort location, used later for hotspot mapping. Never
    // blocks registration if the farmer says no or is offline.
    const position = await getCurrentPosition();

    try {
      const result = await createFarmer({
        name: finalName,
        phone: finalMobile,
        village,
        crop,
        latitude: position.ok ? position.latitude : undefined,
        longitude: position.ok ? position.longitude : undefined,
      });

      localStorage.setItem("cropcare-farmer-id", String(result.farmer_id));
      localStorage.setItem(`cropcare-farmer-by-phone-${finalMobile}`, String(result.farmer_id));
      localStorage.setItem("cropcare-registered-at", new Date().toISOString());
    } catch {
      // Backend unreachable (e.g. weak network) - still let the farmer
      // in with a local session so the app remains usable; reports and
      // hotspot features will simply stay unavailable until the
      // connection is back.
      setError(t("analyzeError"));
    }

    localStorage.setItem("cropcare-username", finalName);
    localStorage.setItem("cropcare-mobile", finalMobile);
    localStorage.setItem("cropcare-village", village);
    localStorage.setItem("cropcare-crop", crop);

    setSubmitting(false);
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <Leaf size={35} />
          <h1>Kisaan Mitra</h1>
        </div>

        <h2>{t("createAccount")}</h2>

        <p className="auth-subtitle">{t("registerSubtitle")}</p>

        <form onSubmit={handleRegister}>

          <label>{t("fullName")}</label>

          <div className="input-box">
            <User size={19} />
            <input
              type="text"
              placeholder={t("enterName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <VoiceInputButton onResult={setName} />
          </div>

          <label>{t("mobile")}</label>

          <div className="input-box">
            <Phone size={19} />
            <input
              type="tel"
              placeholder={t("enterMobile")}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              required
            />
            <VoiceInputButton onResult={setMobile} transform={(text) => text.replace(/\D/g, "").slice(0, 10)} />
          </div>

          <label>{t("village")}</label>

          <div className="input-box">
            <MapPin size={19} />
            <input
              type="text"
              placeholder={t("enterVillage")}
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              required
            />
            <VoiceInputButton onResult={setVillage} />
          </div>

          <label>{t("cropType")}</label>

          <div className="select-box">
            <Leaf size={19} />
            <select value={crop} onChange={(e) => setCrop(e.target.value)} required>
              <option value="">{t("selectCrop")}</option>
              <option value="Tomato">{t("cropTomato")}</option>
              <option value="Cotton">{t("cropCotton")}</option>
              <option value="Soybean">{t("cropSoybean")}</option>
              <option value="Sugarcane">{t("cropSugarcane")}</option>
              <option value="Rice">{t("cropRice")}</option>
              <option value="Wheat">{t("cropWheat")}</option>
              <option value="Other">{t("other")}</option>
            </select>
          </div>

          <label>{t("email")}</label>

          <div className="input-box">
            <Mail size={19} />
            <input
              type="email"
              placeholder={t("enterEmail")}
              required
            />
          </div>

          <label>{t("password")}</label>

          <div className="input-box">
            <Lock size={19} />
            <input
              type="password"
              placeholder={t("createPassword")}
              required
            />
          </div>

          {error && <p className="form-error-note">{error}</p>}

          <button className="full-btn" disabled={submitting}>
            {submitting ? t("creating") : t("createAccount")}
          </button>

        </form>

        <p className="auth-bottom">
          {t("alreadyAccount")}{" "}
          <Link to="/login">{t("login")}</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;
