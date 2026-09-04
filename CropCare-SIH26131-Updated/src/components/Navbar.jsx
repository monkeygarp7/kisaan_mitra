import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
function Navbar(){ const {t,language,setLanguage}=useLanguage(); return <nav className="navbar"><Link to="/" className="logo"><Leaf size={28}/><span>CropCare</span></Link><div className="nav-links"><Link to="/dashboard">{t("dashboard")}</Link><Link to="/detect">{t("detect")}</Link><Link to="/risk">{t("risk")}</Link><Link to="/map">{t("map")}</Link><label className="language-select"><span>🌐</span><select value={language} onChange={e=>setLanguage(e.target.value)} aria-label={t("language")}><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option></select></label><Link to="/login" className="login-btn">{t("login")}</Link></div></nav>; }
export default Navbar;
