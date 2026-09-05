// Lightweight geolocation helpers. No external libraries -
// keeps the bundle small for low-network areas.

export function getCurrentPosition(options = {}) {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ ok: false, error: "unsupported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          ok: true,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        resolve({ ok: false, error: err.message || "denied" });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000, ...options }
    );
  });
}

// Distance between two lat/lon points in kilometers (haversine formula)
export function distanceKm(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some((v) => v === null || v === undefined || Number.isNaN(v))) {
    return Infinity;
  }
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
