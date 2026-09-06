import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function PageTransition({ children }) {
  const { t } = useLanguage();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && (
        <div className="leaf-loader" aria-label={t("loading")}>
          <div className="leaf-loader-particles">
            <span>🍃</span><span>🌿</span><span>🍃</span><span>🌱</span><span>🍃</span><span>🌿</span>
          </div>
          <div className="leaf-loader-icon"><Leaf size={42} /></div>
          <strong>Kisaan Mitra</strong>
          <p>{t("growingCrops")}</p>
        </div>
      )}
      <div className={loading ? "page-content page-content-loading" : "page-content page-content-visible"}>{children}</div>
    </>
  );
}

export default PageTransition;
