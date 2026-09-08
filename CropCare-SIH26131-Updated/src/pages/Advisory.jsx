import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Droplets,
  Scissors,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import SpeakButton from "../components/SpeakButton";
import { useLanguage } from "../context/LanguageContext";

function Advisory() {
  const { t } = useLanguage();
  const location = useLocation();

  const data = location.state || {};

  const disease = data.disease || "Unknown Disease";

  const recommendation =
    data.recommendation ||
    "Monitor the affected crop and consult an agriculture expert for appropriate treatment.";

  const symptoms =
    data.symptoms && data.symptoms.length > 0
      ? data.symptoms
      : [
          "Unusual discoloration on leaves",
          "Spots or lesions visible on plant",
          "Affected areas may spread if untreated",
        ];

  const info = data.diseaseInfo;

  return (
    <div className="app-page">
      <Link to="/result" className="back-link">
        <ArrowLeft size={18} />
        {t("backToResult")}
      </Link>

      <div className="page-heading">
        <p className="small-label">{t("cropAdvisory")}</p>

        <h1>{t("recommendedAction")}</h1>

        <p>{t("advisoryText")}</p>
      </div>

      {/* DETECTED DISEASE */}
      <div className="advisory-alert">
        <AlertTriangle size={25} />

        <div>
          <strong>
            {disease} {t("detected")}
          </strong>

          <p>{recommendation}</p>
        </div>
      </div>

      {/* VOICE ADVISORY */}
      <SpeakButton
        text={`${disease} ${t("detected")}. ${recommendation} ${
          info?.treatment || ""
        } ${info?.prevention || ""}`}
        className="advisory-speak-btn"
      />

      <div className="advisory-grid">

        {/* CARD 1 */}
        <div className="advice-card">
          <Scissors size={32} />

          <h3>1. {t("removeLeaves")}</h3>

          <p>
            {symptoms[0] ||
              "Inspect the affected parts of the plant and remove visibly damaged material where appropriate."}
          </p>
        </div>

        {/* CARD 2 */}
        <div className="advice-card">
          <Droplets size={32} />

          <h3>2. {t("manageWatering")}</h3>

          <p>
            {symptoms[1] ||
              "Avoid conditions that keep plant foliage unnecessarily wet and monitor the crop regularly."}
          </p>
        </div>

        {/* CARD 3 */}
        <div className="advice-card">
          <ShieldCheck size={32} />

          <h3>3. {t("monitorCrop")}</h3>

          <p>
            {recommendation ||
              info?.treatment ||
              t("monitorCropText")}
          </p>
        </div>

      </div>

      {/* IMPORTANT NOTE */}
      <div className="expert-note">
        <h3>⚠️ {t("important")}</h3>

        <p>
          {t("importantText")}
        </p>

        <Link
          to="/expert"
          state={{ disease }}
          className="secondary-btn"
        >
          {t("askExpert")}
        </Link>
      </div>
    </div>
  );
}

export default Advisory;
