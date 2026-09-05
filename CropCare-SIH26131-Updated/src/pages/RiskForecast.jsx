import { useEffect, useState } from "react";
import {
  ShieldAlert,
  CloudRain,
  Thermometer,
  Droplets,
  TrendingUp,
} from "lucide-react";
import { getCurrentPosition } from "../utils/geo";
import { getWeather, getRiskAssessment, getFarmerReports } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

function RiskForecast() {
  const { t } = useLanguage();
  const farmerId = localStorage.getItem("cropcare-farmer-id");
  const savedCrop = localStorage.getItem("cropcare-crop") || "Tomato";

  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [weather, setWeather] = useState(null);
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const pos = await getCurrentPosition();
      if (!pos.ok) {
        if (!cancelled) setStatus("error");
        return;
      }

      let disease = "Healthy";
      if (farmerId) {
        try {
          const reports = await getFarmerReports(farmerId);
          if (reports?.length) disease = reports[0].disease;
        } catch {
          // keep default baseline
        }
      }

      try {
        const weatherData = await getWeather(pos.latitude, pos.longitude);
        const riskData = await getRiskAssessment({
          crop: savedCrop,
          disease,
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
        });
        if (!cancelled) {
          setWeather(weatherData);
          setRisk(riskData);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const riskLevel = risk?.risk_level || "Moderate";
  const riskText = riskLevel === "HIGH" ? t("high") : riskLevel === "LOW" ? t("low") : t("moderate");

  return (
    <div className="app-page">
      <div className="page-heading">
        <p className="small-label">{t("smartForecast")}</p>
        <h1>{t("cropDiseaseRisk")}</h1>
        <p>{t("riskText")}</p>
      </div>

      {status === "error" && (
        <p className="form-error-note">
          {t("weatherFallback")}
        </p>
      )}

      <div className="risk-main-card">
        <div>
          <span>{t("overallRisk")} {status === "ready" && <em className="live-tag">{t("live")}</em>}</span>
          <h2>{riskText}</h2>
          <p>
            {status === "ready"
              ? `${t("basedOnConditions")} ${savedCrop} (${weather?.location || t("yourArea")}).`
              : t("weatherRiskText")}
          </p>
        </div>
        <ShieldAlert size={70} />
      </div>

      <h2 className="dashboard-heading">{t("currentConditions")}</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <Thermometer size={32} />
          <h3>{t("temperature")}</h3>
          <p>{status === "ready" ? `${Math.round(weather.temperature)}°C` : "28°C"}</p>
        </div>

        <div className="dashboard-card">
          <Droplets size={32} />
          <h3>{t("humidity")}</h3>
          <p>{status === "ready" ? `${Math.round(weather.humidity)}%` : "76%"}</p>
        </div>

        <div className="dashboard-card">
          <CloudRain size={32} />
          <h3>{t("weather")}</h3>
          <p>{status === "ready" ? weather.weather : t("cloudySample")}</p>
        </div>

        <div className="dashboard-card">
          <TrendingUp size={32} />
          <h3>{t("diseaseTrend")}</h3>
          <p>{status === "ready" && riskLevel === "HIGH" ? t("increasing") : t("stable")}</p>
        </div>
      </div>

      <div className="forecast-table">
        <h2>{t("riskSnapshot")}</h2>

        <div className="forecast-row header">
          <span>{t("day")}</span>
          <span>{t("weather")}</span>
          <span>{t("risk")}</span>
        </div>

        <div className="forecast-row">
          <span>{t("today")}</span>
          <span>{status === "ready" ? weather.weather : t("cloudy")}</span>
          <strong>{riskText}</strong>
        </div>

        <div className="forecast-row">
          <span>{t("tomorrowSample")}</span>
          <span>{t("rain")}</span>
          <strong>{t("high")}</strong>
        </div>

        <div className="forecast-row">
          <span>{t("day3Sample")}</span>
          <span>{t("sunny")}</span>
          <strong>{t("low")}</strong>
        </div>
      </div>
    </div>
  );
}

export default RiskForecast;
