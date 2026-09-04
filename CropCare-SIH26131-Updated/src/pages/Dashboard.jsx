import { Link } from "react-router-dom";
import { Camera, FileText, ShieldAlert, Map, UserCheck, Leaf, CloudSun, ArrowRight, User, History } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
function Dashboard(){ const {t}=useLanguage(); const name=localStorage.getItem("cropcare-username")||"Farmer"; return <div className="app-page">
  <div className="dashboard-top"><div><p className="small-label">FARMER DASHBOARD</p><h1>{t("welcome")}, {name} 👋</h1><p>{t("dashboardSub")}</p></div><div className="weather-mini"><CloudSun size={30}/><div><strong>28°C</strong><span>Partly Cloudy</span></div></div></div>
  <section className="detect-banner"><div><span className="banner-label">AI CROP HEALTH CHECK</span><h2>{t("checkCrop")}</h2><p>Open the live camera, capture your crop and check for possible diseases or pests.</p><Link to="/detect" className="primary-btn"><Camera size={20}/>{t("scan")}<ArrowRight size={18}/></Link></div><div className="banner-icon"><Leaf size={80}/></div></section>
  <div className="dashboard-menu-row"><Link to="/profile" className="dashboard-menu-card"><span className="menu-icon"><User size={23}/></span><div><strong>{t("farmerDetails")}</strong><p>Profile, farm details, crop history and activity</p></div><ArrowRight size={18}/></Link><Link to="/reports" className="dashboard-menu-card"><span className="menu-icon"><History size={23}/></span><div><strong>Farmer History</strong><p>Previous scans, reports and advisories</p></div><ArrowRight size={18}/></Link></div>
  <h2 className="dashboard-heading">{t("quickActions")}</h2><div className="dashboard-grid">
    <Link to="/detect" className="dashboard-card"><Camera size={34}/><h3>{t("detect")}</h3><p>Analyze a crop using the live camera.</p></Link>
    <Link to="/reports" className="dashboard-card"><FileText size={34}/><h3>{t("myReports")}</h3><p>View previous crop health reports.</p></Link>
    <Link to="/risk" className="dashboard-card"><ShieldAlert size={34}/><h3>{t("riskForecast")}</h3><p>Check disease and pest risk for your area.</p></Link>
    <Link to="/map" className="dashboard-card"><Map size={34}/><h3>{t("diseaseMap")}</h3><p>View disease hotspots around your region.</p></Link>
    <Link to="/expert" className="dashboard-card"><UserCheck size={34}/><h3>{t("expert")}</h3><p>Get crop reports reviewed by experts.</p></Link>
  </div></div>; }
export default Dashboard;
