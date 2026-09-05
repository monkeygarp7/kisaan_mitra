import { useEffect, useMemo, useState } from "react";
import { MapPin, AlertTriangle, Search } from "lucide-react";
import { getAllReports } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

function riskClass(count) {
  if (count >= 5) return "high";
  if (count >= 2) return "medium";
  return "low";
}

function riskLabel(count, t) {
  if (count >= 5) return t("highActivity");
  if (count >= 2) return t("moderateActivity");
  return t("reportedNearby");
}

function HotspotMap() {
  const { t } = useLanguage();
  const [reports, setReports] = useState(null);
  const [search, setSearch] = useState("");
  const [diseaseFilter, setDiseaseFilter] = useState("All Diseases");

  useEffect(() => {
    getAllReports()
      .then(setReports)
      .catch(() => setReports([]));
  }, []);

  const diseaseNames = useMemo(() => {
    if (!reports) return [];
    return [...new Set(reports.map((r) => r.disease).filter((d) => d && d.toLowerCase() !== "healthy"))];
  }, [reports]);

  const grouped = useMemo(() => {
    if (!reports) return [];
    const counts = {};
    reports
      .filter((r) => r.disease && r.disease.toLowerCase() !== "healthy")
      .forEach((r) => {
        counts[r.disease] = (counts[r.disease] || 0) + 1;
      });
    return Object.entries(counts)
      .map(([disease, count]) => ({ disease, count }))
      .sort((a, b) => b.count - a.count);
  }, [reports]);

  const filtered = grouped.filter((item) => {
    const matchesSearch = search
      ? item.disease.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesDisease =
      diseaseFilter === "All Diseases" ? true : item.disease === diseaseFilter;
    return matchesSearch && matchesDisease;
  });

  return (
    <div className="app-page">
      <div className="page-heading">
        <p className="small-label">{t("diseaseSurveillance")}</p>
        <h1>{t("cropHotspots")}</h1>
        <p>{t("hotspotText")}</p>
      </div>

      <div className="map-toolbar">
        <div className="input-box">
          <Search size={19} />
          <input
            placeholder={t("searchDistrict")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={diseaseFilter} onChange={(e) => setDiseaseFilter(e.target.value)}>
          <option>{t("allDiseases")}</option>
          {diseaseNames.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="fake-map">
        <div className="map-title">{t("maharashtraSurveillance")}</div>

        <div className="map-pin pin-one">
          <MapPin size={35} />
        </div>
        <div className="map-pin pin-two">
          <MapPin size={35} />
        </div>
        <div className="map-pin pin-three">
          <MapPin size={35} />
        </div>

        <div className="map-legend">
          <div>
            <span className="legend-dot high"></span>
            {t("highRisk")}
          </div>
          <div>
            <span className="legend-dot medium"></span>
            {t("moderateRisk")}
          </div>
          <div>
            <span className="legend-dot low"></span>
            {t("lowRisk")}
          </div>
        </div>
      </div>

      <div className="hotspot-list">
        {reports === null && <p className="loading-note">{t("loadingActivity")}</p>}

        {reports !== null && filtered.length === 0 && (
          <p className="loading-note">{t("noDiseaseActivity")}</p>
        )}

        {filtered.map((item) => (
          <div key={item.disease}>
            <AlertTriangle size={22} />
            <div>
              <strong>{item.disease}</strong>
              <span className={`hotspot-risk hotspot-risk-${riskClass(item.count)}`}>
                {riskLabel(item.count, t)} ({item.count})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotspotMap;
