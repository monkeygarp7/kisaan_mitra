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

      {/* ==================== NAVBAR ==================== */}

      <nav className="navbar">

        <Link to="/" className="logo">
          <Leaf size={30} />
          <span>CropCare</span>
        </Link>

        <div className="nav-links">

          <a href="#features">
            Features
          </a>

          <a href="#about">
            About
          </a>

          <label className="language-select">
            <span>🌐</span>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label={t("language")}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </label>

        </div>
      </nav>


      {/* ==================== HERO SECTION ==================== */}

      <section className="hero">

        <div className="hero-content">

          <div className="badge">
            {t("heroBadge")}
          </div>

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
                Scan Crop
              </span>

              <span className="scan-crop-subtitle">
                Detect disease using your camera
              </span>

              <span className="scan-crop-arrow">
                Start Scanning
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
            No account required for crop detection.
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
            Live camera scanning and AI-assisted
            crop health analysis.
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
            POWERFUL FEATURES
          </p>

          <h2>
            Everything a farmer needs
          </h2>

        </div>


        <div className="feature-grid">

          {/* Camera Detection */}

          <div className="feature-card">

            <Camera size={35} />

            <h3>
              Camera Detection
            </h3>

            <p>
              Open the live camera and capture a
              crop image directly without browsing
              files first.
            </p>

          </div>


          {/* Smart Advisory */}

          <div className="feature-card">

            <ShieldCheck size={35} />

            <h3>
              Smart Advisory
            </h3>

            <p>
              Get clear recommendations about
              what action should be taken.
            </p>

          </div>


          {/* Disease Hotspots */}

          <div className="feature-card">

            <Map size={35} />

            <h3>
              Disease Hotspots
            </h3>

            <p>
              View reported disease locations and
              understand local crop risks.
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
          Built for Maharashtra's Farmers
        </h2>

        <p>
          CropCare aims to help farmers identify
          crop diseases and pest infestations at
          an early stage, reducing crop losses and
          improving agricultural decision-making.
        </p>

      </section>


      {/* ==================== FOOTER ==================== */}

      <footer>

        <div className="logo">
          <Leaf size={24} />
          <span>CropCare</span>
        </div>

        <p>
          SIH26131 • Early Crop Disease & Pest Detection
        </p>

      </footer>

    </div>
  );
}


export default Home;