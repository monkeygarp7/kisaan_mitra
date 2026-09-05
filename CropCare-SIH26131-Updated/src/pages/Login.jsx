import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Phone } from "lucide-react";
import VoiceInputButton from "../components/VoiceInputButton";
import { getFarmer } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (mobile.length !== 10) {
      alert(t("invalidMobile"));
      return;
    }

    if (!password) {
      alert(t("emptyPassword"));
      return;
    }

    setLoading(true);
    setNotice("");

    // The backend has no login/password table yet - it only exposes
    // farmer records by id. We remember which farmer_id this mobile
    // number created on THIS device at registration, and use that to
    // restore the session and refresh live data from the backend.
    const knownFarmerId = localStorage.getItem(`cropcare-farmer-by-phone-${mobile}`);

    if (knownFarmerId) {
      try {
        const farmer = await getFarmer(knownFarmerId);
        localStorage.setItem("cropcare-farmer-id", String(farmer.id));
        localStorage.setItem("cropcare-username", farmer.name);
        localStorage.setItem("cropcare-mobile", farmer.phone);
        localStorage.setItem("cropcare-village", farmer.village || "");
        localStorage.setItem("cropcare-crop", farmer.crop || "");
      } catch {
        setNotice("Could not reach the server, continuing with saved local details.");
      }
    } else {
      localStorage.setItem("cropcare-mobile", mobile);
      if (!localStorage.getItem("cropcare-username")) {
        localStorage.setItem("cropcare-username", "Farmer");
      }
      setNotice("No account found for this number on this device. You can still continue, or create a new account.");
    }

    if (rememberMe) {
      localStorage.setItem("cropcare-login-saved", "true");
    } else {
      localStorage.removeItem("cropcare-login-saved");
    }

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 400);
  };

  return (
    <div className="auth-page">

      <div className="auth-card auth-card-enhanced">

        {/* Logo */}
        <div className="auth-logo">
          <Phone size={28} />
          <span>Kisaan Mitra</span>
        </div>

        {/* Heading */}
        <h2>
          {t("farmerLogin")}
        </h2>

        <p className="auth-subtitle">
          {t("loginSubtitle")}
        </p>


        <form onSubmit={handleLogin}>

          {/* {t("mobileNumber")} */}
          <label>
            {t("mobileNumber")}
          </label>

          <div className="input-box">

            <Phone size={19} />

            <input
              type="tel"
              placeholder={t("enterMobile")}
              value={mobile}
              onChange={(e) =>
                setMobile(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
            />

            <VoiceInputButton onResult={setMobile} transform={(text) => text.replace(/\D/g, "").slice(0, 10)} />

          </div>


          {/* {t("passwordLabel")} */}
          <label>
            {t("passwordLabel")}
          </label>

          <div className="input-box">

            <Lock size={19} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("enterPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={t("showPassword")}
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>

          </div>


          {/* Remember + Forgot {t("passwordLabel")} */}
          <div className="login-options">

            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />

              {t("rememberMe")}
            </label>

            <Link to="/forgot-password">
              {t("forgotPassword")}
            </Link>

          </div>

          {notice && <p className="form-error-note">{notice}</p>}

          {/* Login Button */}
          <button
            type="submit"
            className="full-btn"
            disabled={loading}
          >
            {loading ? t("loggingIn") : t("login")}
          </button>

        </form>


        {/* Register */}
        <p className="auth-bottom">
          {t("newFarmer")}{" "}
          <Link to="/register">
            {t("createAnAccount")}
          </Link>
        </p>


        {/* Back to Home */}
        <Link
          to="/"
          className="back-home"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Login;
