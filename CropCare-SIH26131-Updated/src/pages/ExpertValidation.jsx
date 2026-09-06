import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserCheck, Send, CheckCircle2 } from "lucide-react";
import VoiceInputButton from "../components/VoiceInputButton";
import { getExperts, getFarmerReports, saveReport, createReferral } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

function ExpertValidation() {
  const { t } = useLanguage();
  const location = useLocation();
  const prefillDisease = location.state?.disease || "";

  const farmerId = localStorage.getItem("cropcare-farmer-id");
  const savedCrop = localStorage.getItem("cropcare-crop") || "";

  const [experts, setExperts] = useState([]);
  const [crop, setCrop] = useState(savedCrop);
  const [expertId, setExpertId] = useState("");
  const [description, setDescription] = useState(
    prefillDisease ? `Possible ${prefillDisease} detected on my crop.` : ""
  );

  const [sent, setSent] = useState(false);
  const [referralId, setReferralId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getExperts()
      .then(setExperts)
      .catch(() => setExperts([]));
  }, []);

  const submitRequest = async (e) => {
    e.preventDefault();

    if (!farmerId) {
      setError("Please login first so an expert can reach you back.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      let diseaseReportId = null;

      const reports = await getFarmerReports(farmerId).catch(() => []);
      if (reports?.length) {
        diseaseReportId = reports[0].id;
      } else {
        const created = await saveReport({
          farmer_id: farmerId,
          image_name: "manual-request",
          disease: prefillDisease || crop || "General query",
          confidence: 0,
          severity: "Unknown",
          recommendation: description,
        });
        diseaseReportId = created.report_id;
      }

      const referral = await createReferral({
        farmer_id: farmerId,
        disease_report_id: diseaseReportId,
        expert_id: expertId,
        referral_reason: description,
        referral_date: new Date().toISOString().slice(0, 10),
      });

      setReferralId(referral.referral_id);
      setSent(true);
    } catch {
      setError("Could not submit your request. Please check your connection and try again.");
    }

    setSubmitting(false);
  };

  return (
    <div className="app-page">
      <div className="page-heading">
        <p className="small-label">{t("expertSupport")}</p>
        <h1>{t("expertValidation")}</h1>
        <p>{t("requestAgriculture")}</p>
      </div>

      {!sent ? (
        <form className="expert-form" onSubmit={submitRequest}>
          <div className="expert-icon">
            <UserCheck size={45} />
          </div>

          <h2>{t("requestExpert")}</h2>

          <label>{t("yourCrop")}</label>
          <select value={crop} onChange={(e) => setCrop(e.target.value)} required>
            <option value="">{t("selectCropOption")}</option>
            <option value="Tomato">{t("cropTomato")}</option>
            <option value="Cotton">{t("cropCotton")}</option>
            <option value="Soybean">{t("cropSoybean")}</option>
            <option value="Rice">{t("cropRice")}</option>
            <option value="Wheat">{t("cropWheat")}</option>
          </select>

          <label>{t("expertLab")}</label>
          <select value={expertId} onChange={(e) => setExpertId(e.target.value)} required>
            <option value="">{t("selectExpert")}</option>
            {experts.map((expert) => (
              <option key={expert.id} value={expert.id}>
                {expert.name} {expert.organization ? `— ${expert.organization}` : ""}
              </option>
            ))}
          </select>
          {experts.length === 0 && (
            <p className="angle-helper-text">{t("noExperts")}</p>
          )}

          <label>{t("describeProblem")}</label>
          <div className="input-box textarea-box">
            <textarea
              placeholder={t("describePlaceholder")}
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <VoiceInputButton onResult={(text) => setDescription((prev) => (prev ? `${prev} ${text}` : text))} />
          </div>

          {error && <p className="form-error-note">{error}</p>}

          <button className="full-btn" disabled={submitting}>
            <Send size={19} />
            {submitting ? t("sending") : t("sendValidation")}
          </button>
        </form>
      ) : (
        <div className="success-card">
          <CheckCircle2 size={60} />
          <h2>{t("requestSubmitted")}</h2>
          <p>{t("requestSubmittedText")}</p>
          <span>{t("requestId")}: REF-{referralId}</span>
        </div>
      )}
    </div>
  );
}

export default ExpertValidation;
