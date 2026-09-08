import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  Leaf,
  ArrowRight,
  Camera,
} from "lucide-react";
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

  const isHealthy =
    data.is_healthy === true ||
    data.disease?.toLowerCase() === "healthy" ||
    prediction.disease?.toLowerCase() === "healthy";

  const [diseaseInfo, setDiseaseInfo] = useState(null);

  useEffect(() => {
    let active = true;

    if (isHealthy) {
      setDiseaseInfo(null);
      return undefined;
    }

    findDiseaseInfo(prediction.disease).then((info) => {
      if (active) {
        setDiseaseInfo(info);
      }
    });

    return () => {
      active = false;
    };
  }, [prediction.disease, isHealthy]);

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
            <img
              src={data.image}
              alt={t("analyzedCrop")}
            />
          ) : (
            <div className="demo-image">
              <Leaf size={70} />
              <p>
                {isDemo
                  ? t("demoAnalysis")
                  : t("photoNotStored")}
              </p>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="result-card">
          {/* Status */}
          <div className="result-warning">
            {isHealthy ? (
              <CheckCircle2 size={25} />
            ) : (
              <AlertTriangle size={25} />
            )}

            <div>
              <span>
                {isHealthy
                  ? "Plant is Healthy"
                  : "Possible Disease Detected"}
              </span>

              <h2>
                {data.disease || "Analyzing..."}
              </h2>
            </div>
          </div>

          {/* Confidence */}
          <div className="confidence">
            <div className="confidence-top">
              <span>Detection Confidence</span>

              <strong>
                {data.confidence
                  ? `${data.confidence}%`
                  : "N/A"}
              </strong>
            </div>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${data.confidence || 0}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Healthy / Diseased Content */}
          {isHealthy ? (
            <div
              className="healthy-result"
              style={{
                marginTop: "24px",
                padding: "20px",
                borderRadius: "14px",
                background: "#e8f6eb",
              }}
            >
              <h3>
                Leaf is totally good, no infection detected
              </h3>
            </div>
          ) : (
            <>
              <div className="symptoms">
                <h3>Common Symptoms</h3>

                <ul>
                  {(data.symptoms &&
                  data.symptoms.length > 0
                    ? data.symptoms
                    : ["No specific symptoms data available"]
                  ).map((symptom, index) => (
                    <li key={index}>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/advisory"
                className="primary-btn"
              >
                View Treatment Advice
                <ArrowRight size={18} />
              </Link>
            </>
          )}

          {/* ALWAYS SHOW SCAN AGAIN */}
          <Link
            to="/detect"
            className="primary-btn"
            style={{ marginTop: "12px" }}
          >
            <Camera size={18} />
            Scan Again
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
