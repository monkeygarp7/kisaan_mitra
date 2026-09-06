import { useState } from "react";
import { Camera, CheckCircle2, Leaf, ShieldAlert } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const ONBOARD_KEY = "cropcare-onboarded";

/**
 * Shown once, the very first time the site is opened on a device.
 * Language selection is intentionally NOT shown here because the
 * existing navbar language selector remains available at all times.
 *
 * The onboarding now goes directly to camera permission.
 */
function OnboardingGate({ children }) {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(ONBOARD_KEY) === "1"
  );
  const [cameraState, setCameraState] = useState("idle");
  // idle | asking | granted | denied

  const finish = () => {
    localStorage.setItem(ONBOARD_KEY, "1");
    setDismissed(true);
  };

  const requestCamera = async () => {
    setCameraState("asking");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera is not supported");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

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

          <div className="onboard-icon">
            <Camera size={40} />
          </div>

          <h2>{t("allowCameraTitle")}</h2>
          <p>{t("allowCameraOnboardText")}</p>

          {cameraState === "granted" && (
            <div className="onboard-status onboard-status-ok">
              <CheckCircle2 size={18} />
              {t("cameraGranted")}
            </div>
          )}

          {cameraState === "denied" && (
            <div className="onboard-status onboard-status-warn">
              <ShieldAlert size={18} />
              {t("cameraDeniedNote")}
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
                {cameraState === "asking"
                  ? t("requestingCamera")
                  : t("allowCamera")}
              </button>

              <button
                type="button"
                className="onboard-skip"
                onClick={finish}
              >
                {t("skipForNow")}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OnboardingGate;
