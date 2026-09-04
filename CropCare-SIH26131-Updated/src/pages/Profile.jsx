import { Link } from "react-router-dom";
import { ArrowLeft, User, MapPin, Sprout, FileText, Leaf } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function Profile() {
  const { t } = useLanguage();
  const name = localStorage.getItem("cropcare-username") || "Farmer";
  const mobile = localStorage.getItem("cropcare-mobile") || "Not added";
  return (
    <div className="app-page">
      <Link to="/dashboard" className="back-link"><ArrowLeft size={18} /> Back to Dashboard</Link>
      <div className="page-heading"><p className="small-label">FARMER PROFILE</p><h1>{t("profileTitle")}</h1><p>{t("profileText")}</p></div>
      <div className="profile-grid">
        <section className="profile-card profile-identity">
          <div className="profile-avatar"><User size={38} /></div>
          <h2>{name}</h2><p>{mobile}</p><span className="profile-status">● Active Farmer</span>
        </section>
        <section className="profile-card"><h2>{t("personal")}</h2><div className="profile-row"><User size={19}/><div><span>Name</span><strong>{name}</strong></div></div><div className="profile-row"><MapPin size={19}/><div><span>{t("village")}</span><strong>Not added</strong></div></div><div className="profile-row"><MapPin size={19}/><div><span>{t("district")}</span><strong>Maharashtra</strong></div></div></section>
        <section className="profile-card"><h2>{t("farm")}</h2><div className="profile-row"><Sprout size={19}/><div><span>{t("crops")}</span><strong>Tomato, Soybean, Cotton</strong></div></div><div className="profile-row"><Leaf size={19}/><div><span>{t("land")}</span><strong>Not added</strong></div></div></section>
        <section className="profile-card"><h2>{t("history")}</h2><div className="history-empty"><FileText size={35}/><p>{t("historyText")}</p><Link to="/reports" className="secondary-btn">View Reports</Link></div></section>
      </div>
    </div>
  );
}
export default Profile;
