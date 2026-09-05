import { useState } from "react";
import { Camera, CheckCircle2, Leaf, ShieldAlert } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const ONBOARD_KEY = "cropcare-onboarded";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

/**
 * Shown once, the very first time the site is opened on a device.
 * Step 1 - pick a language (also changeable later from the navbar).
 * Step 2 - ask for camera permission up front, so the scan page opens
 *          instantly later instead of prompting mid-task.
 *
 * This never blocks the app permanently - the farmer can skip camera
 * access and still use image upload later, and can re-pick a language
 * any time from the existing navbar selector.
 */
function OnboardingGate({ children }) {
  const { language, setLanguage, t } = useLanguage();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(ONBOARD_KEY) === "1");
  const [step, setStep] = useState(1);
  const [cameraState, setCameraState] = useState("idle"); // idle | asking | granted | denied

  const finish = () => {
    localStorage.setItem(ONBOARD_KEY, "1");
    setDismissed(true);
  };

  const requestCamera = async () => {
    setCameraState("asking");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.getTracks().forEach((track) => track.stop());
      setCameraState("granted");
    } catch {
      setCameraState("denied");
    }
  };

  if (dismissed) return children;

  return (
    <>
      {children}
      <div className="onboard-overlay" role="dialog" aria-modal="true">
        <div className="onboard-card">
          <div className="onboard-logo">
            <Leaf size={30} />
            <span>Kisaan Mitra</span>
          </div>

          {step === 1 && (
            <>
              <h2>{t("chooseLanguage")}</h2>
              <p>{t("chooseLanguageText")}</p>
              <div className="onboard-lang-grid">
                {LANGUAGES.map((lng) => (
                  <button
                    key={lng.code}
                    type="button"
                    className={language === lng.code ? "onboard-lang-btn active" : "onboard-lang-btn"}
                    onClick={() => setLanguage(lng.code)}
                  >
                    {lng.label}
                  </button>
                ))}
              </div>
              <button type="button" className="full-btn" onClick={() => setStep(2)}>
                {t("continue")}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="onboard-icon">
                <Camera size={40} />
              </div>
              <h2>{t("allowCameraTitle")}</h2>
              <p>{t("allowCameraOnboardText")}</p>

              {cameraState === "granted" && (
                <div className="onboard-status onboard-status-ok">
                  <CheckCircle2 size={18} /> {t("cameraGranted")}
                </div>
              )}
              {cameraState === "denied" && (
                <div className="onboard-status onboard-status-warn">
                  <ShieldAlert size={18} /> {t("cameraDeniedNote")}
                </div>
              )}

              {cameraState === "granted" ? (
                <button type="button" className="full-btn" onClick={finish}>
                  {t("startUsingApp")}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="full-btn"
                    onClick={requestCamera}
                    disabled={cameraState === "asking"}
                  >
                    {cameraState === "asking" ? t("requestingCamera") : t("allowCamera")}
                  </button>
                  <button type="button" className="onboard-skip" onClick={finish}>
                    {t("skipForNow")}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OnboardingGate;
