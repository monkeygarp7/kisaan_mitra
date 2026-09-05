import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, FileText, ShieldAlert, Map, UserCheck, Leaf, CloudSun, ArrowRight, User, History } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getCurrentPosition } from "../utils/geo";
import { getWeather } from "../utils/api";
import { checkWeeklyScanReminder, checkHotspotAlerts } from "../utils/notifications";

function Dashboard() {
  const { t } = useLanguage();
  const name = localStorage.getItem("cropcare-username") || "Farmer";
  const farmerId = localStorage.getItem("cropcare-farmer-id");

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getCurrentPosition().then(async (pos) => {
      if (!pos.ok) return;

      try {
        const data = await getWeather(pos.latitude, pos.longitude);
        if (!cancelled) setWeather(data);
      } catch {
        // offline - keep the placeholder
      }

      // Best-effort, silent notification checks. Both are no-ops if the
      // farmer hasn't opted in from their Profile page, or if the
      // browser hasn't granted Notification permission yet.
      if (farmerId) {
        checkWeeklyScanReminder(farmerId, t);
        checkHotspotAlerts(farmerId, { latitude: pos.latitude, longitude: pos.longitude }, t);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId]);

  return (
    <div className="app-page">
      <div className="dashboard-top">
        <div>
          <p className="small-label">{t("farmerDashboard")}</p>
          <h1>{t("welcome")}, {name} 👋</h1>
          <p>{t("dashboardSub")}</p>
        </div>
        <div className="weather-mini">
          <CloudSun size={30} />
          <div>
            <strong>{weather ? `${Math.round(weather.temperature)}°C` : "28°C"}</strong>
            <span>{weather ? weather.weather : "Partly Cloudy"}</span>
          </div>
        </div>
      </div>

      <section className="detect-banner">
        <div>
          <span className="banner-label">{t("aiCropHealth")}</span>
          <h2>{t("checkCrop")}</h2>
          <p>{t("dashboardScanText")}</p>
          <Link to="/detect" className="primary-btn">
            <Camera size={20} />
            {t("scan")}
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="banner-icon">
          <Leaf size={80} />
        </div>
      </section>

      <div className="dashboard-menu-row">
        <Link to="/profile" className="dashboard-menu-card">
          <span className="menu-icon">
            <User size={23} />
          </span>
          <div>
            <strong>{t("farmerDetails")}</strong>
            <p>{t("profileActivity")}</p>
          </div>
          <ArrowRight size={18} />
        </Link>
        <Link to="/reports" className="dashboard-menu-card">
          <span className="menu-icon">
            <History size={23} />
          </span>
          <div>
            <strong>{t("farmerHistory")}</strong>
            <p>{t("previousReports")}</p>
          </div>
          <ArrowRight size={18} />
        </Link>
      </div>

      <h2 className="dashboard-heading">{t("quickActions")}</h2>
      <div className="dashboard-grid">
        <Link to="/detect" className="dashboard-card">
          <Camera size={34} />
          <h3>{t("detect")}</h3>
          <p>{t("analyzeLive")}</p>
        </Link>
        <Link to="/reports" className="dashboard-card">
          <FileText size={34} />
          <h3>{t("myReports")}</h3>
          <p>{t("viewReports")}</p>
        </Link>
        <Link to="/risk" className="dashboard-card">
          <ShieldAlert size={34} />
          <h3>{t("riskForecast")}</h3>
          <p>{t("checkRisk")}</p>
        </Link>
        <Link to="/map" className="dashboard-card">
          <Map size={34} />
          <h3>{t("diseaseMap")}</h3>
          <p>{t("viewHotspots")}</p>
        </Link>
        <Link to="/expert" className="dashboard-card">
          <UserCheck size={34} />
          <h3>{t("expert")}</h3>
          <p>{t("expertReports")}</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
