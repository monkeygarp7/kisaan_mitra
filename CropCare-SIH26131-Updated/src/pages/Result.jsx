import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  Leaf,
  ArrowRight,
  Camera,
  RotateCcw,
} from "lucide-react";
import SpeakButton from "../components/SpeakButton";
import { findDiseaseInfo } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

function Result() {
  const { t } = useLanguage();
  const location = useLocation();
  const data = location.state || {};

  const prediction = data.prediction || {
    disease: "Early Blight",
    confidence: 94,
    severity: "Medium",
    recommendation:
      "Monitor the affected crop and consult an agriculture expert for appropriate treatment.",
  };

  const isDemo = !data.prediction;
  const isHealthy = prediction.disease?.toLowerCase() === "healthy";

  const [diseaseInfo, setDiseaseInfo] = useState(null);

  useEffect(() => {
    let active = true;
    findDiseaseInfo(prediction.disease).then((info) => {
      if (active) setDiseaseInfo(info);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prediction.disease]);

  const confidenceValue = Math.round(prediction.confidence ?? 0);
  const confidenceLabel =
    confidenceValue >= 85 ? "High" : confidenceValue >= 60 ? "Moderate" : "Low";

  const speakText = `${prediction.disease}. ${isHealthy ? "" : `${prediction.severity} severity. `}Detection confidence ${confidenceValue} percent. ${prediction.recommendation || ""}`;

  return (
    <div className="app-page">
      <div className="page-heading">
        <p className="small-label">{t("analysisResult")}</p>
        <h1>{t("cropHealthReport")}</h1>
      </div>

      {isDemo && (
        <p className="form-error-note">
          {t("sampleData")}
        </p>
      )}

      <div className="result-layout">
        {/* Image */}
        <div className="result-image-card">
          {data.image ? (
            <img src={data.image} alt={t("analyzedCrop")} />
          ) : (
            <div className="demo-image">
              <Leaf size={70} />
              <p>{isDemo ? t("demoAnalysis") : t("photoNotStored")}</p>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="result-card">
          {isHealthy ? (
            <div className="result-warning result-healthy">
              <CheckCircle2 size={25} />
              <div>
                <span>{t("cropHealthy")}</span>
                <h2>{prediction.disease}</h2>
              </div>
            </div>
          ) : (
            <div className="result-warning">
              <AlertTriangle size={25} />
              <div>
                <span>{t("possibleDisease")}</span>
                <h2>{prediction.disease}</h2>
              </div>
            </div>
          )}

          <SpeakButton text={speakText} autoPlay className="result-speak-btn" />

          <div className="confidence">
            <div className="confidence-top">
              <span>{t("detectionConfidence")}</span>
              <strong>
                {confidenceLabel} ({confidenceValue}%)
              </strong>
            </div>
            <div className="progress">
              <div className="progress-fill" style={{ width: `${confidenceValue}%` }}></div>
            </div>
          </div>

          {data.angleResults?.length > 1 && (
            <p className="angle-confirm-note">
              <Camera size={14} /> {t("confirmedUsing")} {data.angleResults.length} {t("photos")}
            </p>
          )}

          <div className="result-info">
            <div>
              <span>{t("cropType")}</span>
              <strong>{data.crop || "Tomato"}</strong>
            </div>
            <div>
              <span>{t("location")}</span>
              <strong>{data.location || "Maharashtra"}</strong>
            </div>
          </div>

          <div className="symptoms">
            <h3>{isHealthy ? t("advice") : t("recommendation")}</h3>
            {diseaseInfo?.symptoms ? (
              <p>{diseaseInfo.symptoms}</p>
            ) : (
              <p>{prediction.recommendation}</p>
            )}
          </div>

          <Link to="/detect" className="secondary-btn result-rescan-btn">
            <RotateCcw size={18} />
            {t("scanAgain")}
          </Link>

          {!isHealthy && (
            <Link
              to="/advisory"
              state={{ disease: prediction.disease, recommendation: prediction.recommendation, diseaseInfo }}
              className="primary-btn"
            >
              {t("treatmentAdvice")}
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>

      <div className="success-note">
        <CheckCircle2 size={20} />
        {t("earlyDetectionNote")}
      </div>
    </div>
  );
}

export default Result;
