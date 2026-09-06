import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getFarmerReports } from "../utils/api";

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function Reports() {
  const { t } = useLanguage();
  const farmerId = localStorage.getItem("cropcare-farmer-id");

  const [reports, setReports] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!farmerId) return;
    getFarmerReports(farmerId)
      .then(setReports)
      .catch(() => setLoadError(true));
  }, [farmerId]);

  return (
    <div className="app-page">
      <div className="page-heading">
        <p className="small-label">{t("myReports")}</p>
        <h1>{t("cropHealthReport")}</h1>
        <p>{t("viewReports")}</p>
      </div>

      {!farmerId && (
        <div className="report-list">
          <p className="form-error-note">{t("guestReportsNote")}</p>
        </div>
      )}

      {farmerId && reports === null && !loadError && (
        <p className="loading-note">{t("loadingReports")}</p>
      )}

      {farmerId && loadError && (
        <p className="form-error-note">{t("analyzeError")}</p>
      )}

      {farmerId && reports?.length === 0 && (
        <div className="history-empty">
          <FileText size={35} />
          <p>{t("noReportsYet")}</p>
          <Link to="/detect" className="secondary-btn">
            {t("scan")}
          </Link>
        </div>
      )}

      {farmerId && reports?.length > 0 && (
        <div className="report-list">
          {reports.map((report) => {
            const healthy = report.disease?.toLowerCase() === "healthy";
            return (
              <div className="report-item" key={report.id}>
                <div className={healthy ? "report-icon healthy" : "report-icon"}>
                  {healthy ? <CheckCircle2 size={25} /> : <AlertTriangle size={25} />}
                </div>

                <div className="report-main">
                  <h3>
                    {report.crop || "Crop"} — {report.disease}
                  </h3>
                  <p>
                    {healthy ? "Analyzed" : "Detected"} • {formatDate(report.created_at)}
                  </p>
                </div>

                <strong className={healthy ? "healthy-text" : "warning-text"}>
                  {Math.round(report.confidence)}%
                </strong>

                <Link
                  to="/result"
                  state={{ prediction: report, crop: report.crop, image: null }}
                  className="view-btn"
                >
                  View
                  <ArrowRight size={17} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Reports;
