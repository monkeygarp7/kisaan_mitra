import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, MapPin, Sprout, FileText, Leaf, Bell } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getFarmer, getFarmerCrops } from "../utils/api";
import {
  getPreferences,
  setPreference,
  requestNotificationPermission,
  getNotificationPermission,
} from "../utils/notifications";

function Profile() {
  const { t } = useLanguage();
  const farmerId = localStorage.getItem("cropcare-farmer-id");

  const [name, setName] = useState(localStorage.getItem("cropcare-username") || "Farmer");
  const [mobile, setMobile] = useState(localStorage.getItem("cropcare-mobile") || "Not added");
  const [village, setVillage] = useState(localStorage.getItem("cropcare-village") || "Not added");
  const [mainCrop, setMainCrop] = useState(localStorage.getItem("cropcare-crop") || "Not added");
  const [cropHistory, setCropHistory] = useState([]);

  const [prefs, setPrefs] = useState(getPreferences());
  const [permission, setPermission] = useState(getNotificationPermission());

  useEffect(() => {
    if (!farmerId) return;
    getFarmer(farmerId)
      .then((farmer) => {
        setName(farmer.name);
        setMobile(farmer.phone);
        setVillage(farmer.village || "Not added");
        setMainCrop(farmer.crop || "Not added");
      })
      .catch(() => {
        // offline - keep whatever was cached in localStorage
      });

    getFarmerCrops(farmerId)
      .then(setCropHistory)
      .catch(() => setCropHistory([]));
  }, [farmerId]);

  const toggleNotification = async (key) => {
    const nextValue = !prefs[key];

    if (nextValue) {
      const granted = await requestNotificationPermission();
      setPermission(getNotificationPermission());
      if (!granted) return;
    }

    setPreference(key, nextValue);
    setPrefs(getPreferences());
  };

  return (
    <div className="app-page">
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="page-heading">
        <p className="small-label">{t("farmProfile")}</p>
        <h1>{t("profileTitle")}</h1>
        <p>{t("profileText")}</p>
      </div>

      <div className="profile-grid">
        <section className="profile-card profile-identity">
          <div className="profile-avatar">
            <User size={38} />
          </div>
          <h2>{name}</h2>
          <p>{mobile}</p>
          <span className="profile-status">● {t("activeFarmer")}</span>
        </section>

        <section className="profile-card">
          <h2>{t("personal")}</h2>
          <div className="profile-row">
            <User size={19} />
            <div>
              <span>{t("name")}</span>
              <strong>{name}</strong>
            </div>
          </div>
          <div className="profile-row">
            <MapPin size={19} />
            <div>
              <span>{t("village")}</span>
              <strong>{village}</strong>
            </div>
          </div>
          <div className="profile-row">
            <MapPin size={19} />
            <div>
              <span>{t("district")}</span>
              <strong>Maharashtra</strong>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <h2>{t("farm")}</h2>
          <div className="profile-row">
            <Sprout size={19} />
            <div>
              <span>{t("crops")}</span>
              <strong>
                {cropHistory.length
                  ? cropHistory.map((c) => c.crop_name).join(", ")
                  : mainCrop}
              </strong>
            </div>
          </div>
          <div className="profile-row">
            <Leaf size={19} />
            <div>
              <span>{t("land")}</span>
              <strong>{t("notAdded")}</strong>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <h2>{t("history")}</h2>
          <div className="history-empty">
            <FileText size={35} />
            <p>{t("historyText")}</p>
            <Link to="/reports" className="secondary-btn">
              View Reports
            </Link>
          </div>
        </section>

        <section className="profile-card">
          <h2>
            <Bell size={19} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
            {t("notificationsTitle")}
          </h2>

          {!farmerId && <p className="angle-helper-text">{t("guestReportsNote")}</p>}

          {farmerId && (
            <>
              <div className="notif-row">
                <span>{t("weeklyReminderToggle")}</span>
                <button
                  type="button"
                  className={prefs.weekly ? "notif-toggle notif-on" : "notif-toggle"}
                  onClick={() => toggleNotification("weekly")}
                >
                  {prefs.weekly ? t("notifOn") : t("notifOff")}
                </button>
              </div>

              <div className="notif-row">
                <span>{t("hotspotAlertToggle")}</span>
                <button
                  type="button"
                  className={prefs.hotspot ? "notif-toggle notif-on" : "notif-toggle"}
                  onClick={() => toggleNotification("hotspot")}
                >
                  {prefs.hotspot ? t("notifOn") : t("notifOff")}
                </button>
              </div>

              {permission === "denied" && (
                <p className="form-error-note">
                  Notifications are blocked in your browser settings. Enable them there to use this feature.
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
