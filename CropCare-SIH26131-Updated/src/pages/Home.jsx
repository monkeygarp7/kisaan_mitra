import {
  Link,
  } from "react-router-dom";

import {
  Leaf,
  Camera,
  ShieldCheck,
  Map,
  ArrowRight,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";


function Home() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="home-page">

    


      {/* ==================== HERO SECTION ==================== */}

      <section className="hero">

        <div className="hero-content">

          <div className="badge">
            {t("heroBadge")}
          </div>

          <div className="national-farming-slogan">JAI JAWAN JAI KISAN</div>

          <h1>
            {t("heroTitle")}
            <span>
              {t("heroTitle2")}
            </span>
          </h1>

          <p>
            {t("heroText")}
          </p>


          {/* ==================== MAIN ACTIONS ==================== */}

          <div className="hero-buttons home-action-stack">

            {/* BIG SCAN CROP BUTTON */}

            <Link
              to="/detect"
              className="scan-crop-main"
            >
              <div className="scan-crop-icon">
                <Camera size={42} />
              </div>

              <span className="scan-crop-title">
                {t("scanCrop")}
              </span>

              <span className="scan-crop-subtitle">
                {t("scanCropSub")}
              </span>

              <span className="scan-crop-arrow">
                {t("startScanning")}
                <ArrowRight size={18} />
              </span>
            </Link>


            {/* ONLY ONE LOGIN BUTTON */}

            <Link
              to="/login"
              className="login-center-btn"
            >
              Login
            </Link>

          </div>


          <p className="guest-note">
            {t("guestNote")}
          </p>

        </div>


        {/* ==================== AI DETECTION CARD ==================== */}

        <div className="hero-card">

          <div className="scan-icon">
            <Camera size={55} />
          </div>

          <h3>
            {t("aiDetection")}
          </h3>

          <p>
            {t("liveCameraAnalysis")}
          </p>

          <div className="scan-status">
            <ShieldCheck size={20} />
            {t("earlyDetection")}
          </div>

        </div>

      </section>


      {/* ==================== FEATURES ==================== */}

      <section
        id="features"
        className="features-section"
      >

        <div className="section-heading">

          <p>
            {t("powerfulFeatures")}
          </p>

          <h2>
            {t("everythingFarmerNeeds")}
          </h2>

        </div>


        <div className="feature-grid">

          {/* {t("cameraDetection")} */}

          <div className="feature-card">

            <Camera size={35} />

            <h3>
              {t("cameraDetection")}
            </h3>

            <p>
              {t("cameraDetectionText")}
            </p>

          </div>


          {/* {t("smartAdvisory")} */}

          <div className="feature-card">

            <ShieldCheck size={35} />

            <h3>
              {t("smartAdvisory")}
            </h3>

            <p>
              {t("smartAdvisoryText")}
            </p>

          </div>


          {/* {t("diseaseHotspots")} */}

          <div className="feature-card">

            <Map size={35} />

            <h3>
              {t("diseaseHotspots")}
            </h3>

            <p>
              {t("diseaseHotspotsText")}
            </p>

          </div>

        </div>

      </section>


      {/* ==================== ABOUT ==================== */}

      <section
        id="about"
        className="about-section"
      >

        <h2>
         Made for Farmers
        </h2>

        <p>
         Detect early. Understand better. Act smarter. Kisaan Mitra brings AI-powered crop health intelligence to farmers everywhere
        </p>

      </section>


      {/* ==================== FOOTER ==================== */}

      <footer>

        <div className="logo">
          <Leaf size={24} />
          <span>KisaanMitra</span>
        </div>

        <p>
          SIH26131 • Early Crop Disease & Pest Detection
        </p>

      </footer>

    </div>
  );
}


export default Home;
