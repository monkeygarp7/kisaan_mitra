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

  // Support both:
  // { disease, recommendation, ... }
  // and
  // { prediction: { disease, recommendation, ... } }
  const prediction = data.prediction || data;

  const disease = prediction.disease || "Unknown disease";
  const recommendation =
    prediction.recommendation ||
    "Consult an agriculture expert for appropriate treatment.";

  const symptoms = Array.isArray(prediction.symptoms)
    ? prediction.symptoms
    : [];

  const prevention =
    prediction.prevention ||
    "Maintain good crop hygiene, proper airflow and regular crop monitoring.";

  const treatment =
    prediction.treatment ||
    recommendation;

  const isHealthy =
    prediction.is_healthy === true ||
    disease.toLowerCase() === "healthy";

  return (
    <div className="app-page">

      {/* Back */}
      <Link to="/result" className="back-link">
        <ArrowLeft size={18} />
        Back to Result
      </Link>

      {/* Heading */}
      <div className="page-heading">
        <span className="eyebrow">CROP ADVISORY</span>

        <h1>Recommended Action</h1>

        <p>
          Practical steps based on the detected crop condition.
        </p>
      </div>

      {/* Alert */}
      <div className="advisory-alert">
        <AlertTriangle size={25} />

        <div>
          <strong>
            {isHealthy
              ? "Healthy crop detected"
              : `${disease} detected`}
          </strong>

          <p>
            {isHealthy
              ? "No disease treatment is required. Continue normal crop care."
              : recommendation}
          </p>
        </div>
      </div>

      {/* Voice */}
      <SpeakButton
        text={`${disease} detected. ${recommendation} Treatment: ${treatment}. Prevention: ${prevention}.`}
        label="Listen"
      />

      {/* Advice cards */}
      <div className="advisory-grid">

        {/* Symptoms */}
        <div className="advice-card">
          <Scissors size={32} />

          <h3>1. Symptoms</h3>

          {symptoms.length > 0 ? (
            <ul>
              {symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          ) : (
            <p>
              Monitor the plant for unusual discoloration,
              spots or lesions.
            </p>
          )}
        </div>

        {/* Prevention */}
        <div className="advice-card">
          <Droplets size={32} />

          <h3>2. Prevention</h3>

          <p>{prevention}</p>
        </div>

        {/* Treatment */}
        <div className="advice-card">
          <ShieldCheck size={32} />

          <h3>3. Treatment</h3>

          <p>{treatment}</p>
        </div>

      </div>

      {/* Important note */}
      {!isHealthy && (
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
      )}

    </div>
  );
}

export default Advisory;
