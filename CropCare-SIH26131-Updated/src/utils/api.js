import axios from "axios";

/**
 * Backend base URL.
 * - In dev, requests go to "/api/*" which Vite proxies to the FastAPI
 *   backend (see vite.config.js). This avoids CORS issues without ever
 *   touching the backend code.
 * - You can override the target backend with an env var, e.g.
 *   VITE_API_BASE_URL=https://your-deployed-backend.com
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

// Small helper: the backend takes plain query params on most routes
// (FastAPI turns simple typed function args into query params), so we
// send data as `params` for POST too, using URLSearchParams.
function asParams(data = {}) {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  return params;
}

/* ---------------------------------------
 * FARMERS
 * ------------------------------------- */
export async function createFarmer({ name, phone, village, crop, latitude, longitude }) {
  const { data } = await api.post(`/farmers?${asParams({ name, phone, village, crop, latitude, longitude })}`);
  return data;
}

export async function getFarmer(farmerId) {
  const { data } = await api.get(`/farmers/${farmerId}`);
  return data;
}

export async function getFarmerReports(farmerId) {
  const { data } = await api.get(`/farmers/${farmerId}/reports`);
  return data;
}

export async function getFarmerCrops(farmerId) {
  const { data } = await api.get(`/farmers/${farmerId}/crops`);
  return data;
}

export async function getFarmerWeather(farmerId) {
  const { data } = await api.get(`/weather/farmers/${farmerId}`);
  return data;
}

export async function getFarmerReferrals(farmerId) {
  const { data } = await api.get(`/farmers/${farmerId}/referrals`);
  return data;
}

/* ---------------------------------------
 * IMAGE UPLOAD + AI PREDICTION
 * ------------------------------------- */

// Convert a base64 dataURL (from the camera canvas) into a File/Blob
export async function dataUrlToFile(dataUrl, filename = "crop.jpg") {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export async function uploadImage(fileOrDataUrl) {
  const file = typeof fileOrDataUrl === "string" ? await dataUrlToFile(fileOrDataUrl) : fileOrDataUrl;
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/upload-image", form);
  return data;
}

export async function predictDisease(fileOrDataUrl) {
  const file = typeof fileOrDataUrl === "string" ? await dataUrlToFile(fileOrDataUrl) : fileOrDataUrl;
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/predict", form);
  return data;
}

/* ---------------------------------------
 * REPORTS
 * ------------------------------------- */
export async function saveReport({ farmer_id, image_name, disease, confidence, severity, recommendation }) {
  const { data } = await api.post(
    `/reports?${asParams({ farmer_id, image_name, disease, confidence, severity, recommendation })}`
  );
  return data;
}

export async function getAllReports() {
  const { data } = await api.get("/reports");
  return data;
}

/* ---------------------------------------
 * DISEASES (knowledge base)
 * ------------------------------------- */
export async function getDiseases() {
  const { data } = await api.get("/diseases");
  return data;
}

export async function findDiseaseInfo(diseaseName) {
  if (!diseaseName) return null;
  try {
    const list = await getDiseases();
    const match = list.find(
      (d) => d.disease_name?.toLowerCase().trim() === diseaseName.toLowerCase().trim()
    );
    return match || null;
  } catch {
    return null;
  }
}

/* ---------------------------------------
 * WEATHER
 * ------------------------------------- */
export async function getWeather(latitude, longitude) {
  const { data } = await api.get(`/weather?${asParams({ latitude, longitude })}`);
  return data;
}

export async function saveWeather({ farmer_id, crop_id, latitude, longitude, temperature, humidity, weather_condition, wind_speed }) {
  const { data } = await api.post(
    `/weather/save?${asParams({ farmer_id, crop_id, latitude, longitude, temperature, humidity, weather_condition, wind_speed })}`
  );
  return data;
}

/* ---------------------------------------
 * CROPS
 * ------------------------------------- */
export async function createCrop({ farmer_id, crop_name, variety, planting_date, location }) {
  const { data } = await api.post(
    `/crops?${asParams({ farmer_id, crop_name, variety, planting_date, location })}`
  );
  return data;
}

// There is no "get or create" route on the backend, so we emulate it:
// look through the farmer's existing crops first, and only create a
// new one if it isn't there yet.
export async function getOrCreateCrop({ farmer_id, crop_name, location }) {
  try {
    const crops = await getFarmerCrops(farmer_id);
    const match = crops.find(
      (c) => c.crop_name?.toLowerCase().trim() === crop_name?.toLowerCase().trim()
    );
    if (match) return match.id;
  } catch {
    // ignore and try to create
  }
  const created = await createCrop({ farmer_id, crop_name, location });
  return created.crop_id;
}

/* ---------------------------------------
 * RISK ASSESSMENT
 * ------------------------------------- */
export async function getRiskAssessment({ crop, disease, temperature, humidity }) {
  const { data } = await api.get(
    `/risk-assessment?${asParams({ crop, disease, temperature, humidity })}`
  );
  return data;
}

/* ---------------------------------------
 * EXPERTS + REFERRALS
 * ------------------------------------- */
export async function getExperts() {
  const { data } = await api.get("/experts");
  return data;
}

export async function createReferral({ farmer_id, disease_report_id, expert_id, referral_reason, referral_date }) {
  const { data } = await api.post(
    `/referrals?${asParams({ farmer_id, disease_report_id, expert_id, referral_reason, referral_date })}`
  );
  return data;
}

/* ---------------------------------------
 * FOLLOW-UPS / PEST OBSERVATIONS
 * ------------------------------------- */
export async function createFollowUp({ farmer_id, crop_id, health_status, disease_report_id, notes, follow_up_date }) {
  const { data } = await api.post(
    `/follow-ups?${asParams({ farmer_id, crop_id, health_status, disease_report_id, notes, follow_up_date })}`
  );
  return data;
}

export async function createPestObservation({ farmer_id, crop_id, pest_name, pest_count, detection_method, observation_date, notes }) {
  const { data } = await api.post(
    `/pest-observations?${asParams({ farmer_id, crop_id, pest_name, pest_count, detection_method, observation_date, notes })}`
  );
  return data;
}

export default api;
