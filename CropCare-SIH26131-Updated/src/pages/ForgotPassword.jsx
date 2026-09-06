import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Phone, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function ForgotPassword() {
  const { t } = useLanguage(); const [sent, setSent] = useState(false);
  return <div className="auth-page"><div className="auth-card">
    <div className="auth-logo"><Leaf size={35}/><h1>Kisaan Mitra</h1></div>
    {!sent ? <><h2>{t("forgotTitle")}</h2><p className="auth-subtitle">{t("forgotText")}</p><form onSubmit={(e)=>{e.preventDefault();setSent(true)}}><label>{t("mobile")}</label><div className="input-box"><Phone size={19}/><input type="tel" placeholder={t("enterMobile")} required /></div><button className="full-btn" type="submit">{t("sendReset")}</button></form></> : <div className="forgot-success"><CheckCircle2 size={48}/><h2>{t("forgotSent")}</h2><p>{t("checkMobile")}</p></div>}
    <Link to="/login" className="back-home">{t("backLogin")}</Link>
  </div></div>;
}
export default ForgotPassword;
