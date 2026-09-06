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
          <div className="result-warning">
            {data.is_healthy ? <CheckCircle2 size={25} /> : <AlertTriangle size={25} />}
            <div>
              <span>{data.is_healthy ? "Plant is Healthy" : "Possible Disease Detected"}</span>
              <h2>{data.disease || "Analyzing..."}</h2>
            </div>
          </div>
          <div className="confidence">
            <div className="confidence-top">
              <span>Detection Confidence</span>
              <strong>{data.confidence ? `${data.confidence}%` : "N/A"}</strong>
            </div>
            <div className="progress">
              <div className="progress-fill" style={{ width: `${data.confidence || 0}%` }}></div>
            </div>
          </div>
         
          <div className="symptoms">
            <h3>Common Symptoms</h3>
            <ul>
              {(data.symptoms && data.symptoms.length > 0
                ? data.symptoms
                : ["No specific symptoms data available"]
              ).map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>
          <Link to="/advisory" className="primary-btn">
            View Treatment Advice
            <ArrowRight size={18} />
          </Link>
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
