import { getAllReports, getFarmer, getFarmerReports } from "./api";
import { distanceKm } from "./geo";

const PREF_WEEKLY = "cropcare-notif-weekly";
const PREF_HOTSPOT = "cropcare-notif-hotspot";
const LAST_WEEKLY_NOTIF = "cropcare-last-weekly-notif";
const LAST_HOTSPOT_NOTIF = "cropcare-last-hotspot-notif";
const LAST_SCAN_AT = "cropcare-last-scan-at";
const HOTSPOT_RADIUS_KM = 15;
const HOTSPOT_WINDOW_DAYS = 14;

export function isNotificationSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission() {
  return isNotificationSupported() ? Notification.permission : "unsupported";
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function getPreferences() {
  return {
    weekly: localStorage.getItem(PREF_WEEKLY) !== "0", // default ON once enabled
    hotspot: localStorage.getItem(PREF_HOTSPOT) !== "0",
  };
}

export function setPreference(key, enabled) {
  const storeKey = key === "weekly" ? PREF_WEEKLY : PREF_HOTSPOT;
  localStorage.setItem(storeKey, enabled ? "1" : "0");
}

export function markScanCompleted() {
  localStorage.setItem(LAST_SCAN_AT, new Date().toISOString());
}

function notifiedRecently(key, hours) {
  const last = localStorage.getItem(key);
  if (!last) return false;
  const diffHours = (Date.now() - new Date(last).getTime()) / 36e5;
  return diffHours < hours;
}

function fireNotification(title, body) {
  try {
    // eslint-disable-next-line no-new
    new Notification(title, { body, icon: "/favicon.svg" });
  } catch {
    // Some browsers require a service worker for Notification(); fail silently.
  }
}

/**
 * Checks whether it has been 7+ days since the farmer's last crop
 * scan and fires a local notification reminding them to check again.
 * Runs client-side (e.g. on Dashboard mount) - this is a best-effort
 * reminder while the app/tab is open, not a background push service
 * (that would need a push server on the backend, which we are not
 * touching).
 */
export async function checkWeeklyScanReminder(farmerId, t) {
  if (!farmerId) return;
  if (getNotificationPermission() !== "granted") return;
  if (!getPreferences().weekly) return;
  if (notifiedRecently(LAST_WEEKLY_NOTIF, 20)) return;

  let lastScan = localStorage.getItem(LAST_SCAN_AT);

  if (!lastScan) {
    try {
      const reports = await getFarmerReports(farmerId);
      if (reports?.length) lastScan = reports[0].created_at;
    } catch {
      // offline or backend unreachable - skip silently
      return;
    }
  }

  const registeredAt = localStorage.getItem("cropcare-registered-at");
  const reference = lastScan || registeredAt;
  if (!reference) return;

  const days = (Date.now() - new Date(reference).getTime()) / 86400000;
  if (days >= 7) {
    fireNotification(
      t ? t("weeklyReminderTitle") : "Time to scan your crop 🌱",
      t ? t("weeklyReminderBody") : "It has been a week since your last scan. Check your crop for early signs of disease."
    );
    localStorage.setItem(LAST_WEEKLY_NOTIF, new Date().toISOString());
  }
}

/**
 * Looks at recently submitted disease reports from other farmers and
 * alerts the current farmer if one was reported near their saved
 * location. Uses only existing GET /reports + GET /farmers/{id}
 * endpoints (no backend change).
 */
export async function checkHotspotAlerts(farmerId, coords, t) {
  if (!coords?.latitude || !coords?.longitude) return;
  if (getNotificationPermission() !== "granted") return;
  if (!getPreferences().hotspot) return;
  if (notifiedRecently(LAST_HOTSPOT_NOTIF, 20)) return;

  try {
    const reports = await getAllReports();
    const recent = reports
      .filter((r) => r.disease && r.disease.toLowerCase() !== "healthy")
      .filter((r) => {
        const days = (Date.now() - new Date(r.created_at).getTime()) / 86400000;
        return days <= HOTSPOT_WINDOW_DAYS;
      })
      .slice(0, 30);

    const farmerIds = [...new Set(recent.map((r) => r.farmer_id))].filter(
      (id) => id && id !== farmerId
    );

    const farmerCache = {};
    for (const id of farmerIds) {
      try {
        farmerCache[id] = await getFarmer(id);
      } catch {
        // that farmer might not exist any more - ignore
      }
    }

    let nearest = null;
    for (const report of recent) {
      const f = farmerCache[report.farmer_id];
      if (!f?.latitude || !f?.longitude) continue;
      const dist = distanceKm(coords.latitude, coords.longitude, f.latitude, f.longitude);
      if (dist <= HOTSPOT_RADIUS_KM && (!nearest || dist < nearest.dist)) {
        nearest = { dist, report };
      }
    }

    if (nearest) {
      const distLabel = nearest.dist < 1 ? "under 1 km" : `${nearest.dist.toFixed(1)} km`;
      fireNotification(
        t ? t("hotspotAlertTitle") : "⚠️ Disease reported nearby",
        t
          ? `${t("hotspotAlertBody")} ${nearest.report.disease} (${distLabel})`
          : `${nearest.report.disease} reported ${distLabel} from you. Consider checking your crop.`
      );
      localStorage.setItem(LAST_HOTSPOT_NOTIF, new Date().toISOString());
    }
  } catch {
    // offline or backend unreachable - skip silently, this is a
    // best-effort convenience feature, not a critical path.
  }
}
