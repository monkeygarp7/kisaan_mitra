import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Leaf,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  X,
  Flashlight,
  ZoomIn,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getCurrentPosition } from "../utils/geo";
import {
  predictDisease,
  uploadImage,
  saveReport,
  getOrCreateCrop,
  getWeather,
  saveWeather,
} from "../utils/api";
import { markScanCompleted } from "../utils/notifications";

const TOTAL_ANGLES = 3;

function DetectDisease() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [photos, setPhotos] = useState([]);
  const [reviewing, setReviewing] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment");
  const [torchOn, setTorchOn] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomRange, setZoomRange] = useState({ min: 1, max: 1, step: 0.1 });
  const [locationStatus, setLocationStatus] = useState("idle");
  const [coords, setCoords] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [switchingCamera, setSwitchingCamera] = useState(false);

  const getVideoTrack = () => streamRef.current?.getVideoTracks?.()[0] || null;

  const readCameraCapabilities = (track) => {
    if (!track?.getCapabilities) return;
    const capabilities = track.getCapabilities();
    const min = Number(capabilities.zoom?.min ?? 1);
    const max = Number(capabilities.zoom?.max ?? 1);
    const step = Number(capabilities.zoom?.step ?? 0.1);
    setZoomRange({ min, max, step });
    setZoom((current) => Math.min(max, Math.max(min, current)));
  };

  const startCamera = async (facing = cameraFacing) => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      setCameraReady(false);
      setCameraError("");
      const previous = streamRef.current;
      previous?.getTracks().forEach((track) => track.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      readCameraCapabilities(track);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setTorchOn(false);
      setCameraReady(true);
    } catch {
      setCameraReady(false);
      setCameraError(t("cameraError"));
    }
  };

  useEffect(() => {
    startCamera("environment");
    setLocationStatus("asking");
    getCurrentPosition().then((pos) => {
      if (pos.ok) {
        setCoords({ latitude: pos.latitude, longitude: pos.longitude });
        setLocationStatus("granted");
      } else {
        setLocationStatus("denied");
      }
    });
    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyZoom = async (value) => {
    const track = getVideoTrack();
    const next = Number(value);
    setZoom(next);
    if (!track?.applyConstraints || !track?.getCapabilities) return;
    try {
      const capabilities = track.getCapabilities();
      if (capabilities.zoom) await track.applyConstraints({ advanced: [{ zoom: next }] });
    } catch {
      // Zoom is device/browser dependent; leave the camera usable if unsupported.
    }
  };

  const toggleTorch = async () => {
    const track = getVideoTrack();
    if (!track?.applyConstraints || !track?.getCapabilities) return;
    const capabilities = track.getCapabilities();
    if (!capabilities.torch) {
      setCameraError(`${t("flashlight")} is not supported by this camera/browser.`);
      return;
    }
    try {
      const next = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: next }] });
      setTorchOn(next);
      setCameraError("");
    } catch {
      setCameraError(`${t("flashlight")} could not be enabled on this device.`);
    }
  };

  const switchLens = async () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setSwitchingCamera(true);
    await startCamera(nextFacing);
    setCameraFacing(nextFacing);
    setSwitchingCamera(false);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !cameraReady) return;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhotos((prev) => [...prev, dataUrl]);
    setReviewing(true);
  };

  const upload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => [...prev, reader.result]);
      setReviewing(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const retakeLast = () => {
    setPhotos((prev) => prev.slice(0, -1));
    setReviewing(false);
  };

  const keepAndContinue = () => setReviewing(false);
  const removePhoto = (index) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const analyze = async () => {
    if (!photos.length) {
      alert("Please capture at least one crop photo before analysis.");
      return;
    }

    setAnalyzing(true);
    setAnalyzeError("");

    let predictionResult;
    try {
      predictionResult = await predictDisease(photos[0]);
    } catch {
      setAnalyzing(false);
      setAnalyzeError(t("analyzeError"));
      return;
    }

    const prediction = predictionResult.prediction;
    const angleResults = [prediction];

    for (const extraPhoto of photos.slice(1)) {
      try {
        const extra = await predictDisease(extraPhoto);
        angleResults.push(extra.prediction);
      } catch {
        // Best effort for extra angles.
      }
      try {
        await uploadImage(extraPhoto);
      } catch {
        // Best effort storage.
      }
    }

    const farmerId = localStorage.getItem("cropcare-farmer-id");
    const detectedCrop =
      prediction.crop || prediction.crop_name || prediction.detected_crop || localStorage.getItem("cropcare-crop") || "";
    let reportId = null;

    if (farmerId) {
      try {
        const saved = await saveReport({
          farmer_id: farmerId,
          image_name: predictionResult.image,
          disease: prediction.disease,
          confidence: prediction.confidence,
          severity: prediction.severity,
          recommendation: prediction.recommendation,
        });
        reportId = saved.report_id;
      } catch {
        // Keep the result usable when the backend is unavailable.
      }

      if (coords && detectedCrop) {
        try {
          const cropId = await getOrCreateCrop({
            farmer_id: farmerId,
            crop_name: detectedCrop,
            location: localStorage.getItem("cropcare-village") || "",
          });
          const weather = await getWeather(coords.latitude, coords.longitude);
          await saveWeather({
            farmer_id: farmerId,
            crop_id: cropId,
            latitude: coords.latitude,
            longitude: coords.longitude,
            temperature: weather.temperature,
            humidity: weather.humidity,
            weather_condition: weather.weather,
            wind_speed: weather.wind_speed,
          });
        } catch {
          // Weather/hotspot enrichment is optional.
        }
      }
    }

    markScanCompleted();
    setAnalyzing(false);

    navigate("/result", {
      state: {
        image: photos[0],
        allPhotos: photos,
        crop: detectedCrop,
        coords,
        prediction,
        angleResults,
        reportId,
      },
    });
  };

  const liveView = !reviewing && photos.length < TOTAL_ANGLES;
  const currentAngleIndex = Math.min(photos.length, TOTAL_ANGLES - 1);
  const zoomSupported = zoomRange.max > zoomRange.min;

  return (
    <div className="app-page scan-page">
      <div className="page-heading scan-heading">
        <p className="small-label">AI CROP DETECTION</p>
        <h1>{t("scan")}</h1>
        <p>{t("allowCamera")}</p>
      </div>

      <div className="scan-camera-layout">
        <section className="camera-card">
          <div className="camera-frame">
            {liveView ? (
              <>
                <video ref={videoRef} className="live-camera" autoPlay playsInline muted />
                <div className="camera-corners"><i></i><i></i><i></i><i></i></div>
                <div className="camera-top-status">
                  <span className={cameraReady ? "camera-dot ready" : "camera-dot"}></span>
                  {cameraReady ? t("cameraReady") : t("startingCamera")}
                </div>
                <div className="camera-tool-row">
                  <button type="button" className={torchOn ? "camera-tool active" : "camera-tool"} onClick={toggleTorch} title={t("flashlight")} aria-label={t("flashlight")}>
                    <Flashlight size={18} />
                  </button>
                  <button type="button" className="camera-tool" onClick={switchLens} disabled={switchingCamera} title={t("switchLens")} aria-label={t("switchLens")}>
                    {switchingCamera ? <Loader2 size={18} className="spin-icon" /> : <RefreshCw size={18} />}
                  </button>
                </div>
                {zoomSupported && (
                  <div className="camera-zoom-control">
                    <ZoomIn size={15} />
                    <input
                      type="range"
                      min={zoomRange.min}
                      max={zoomRange.max}
                      step={zoomRange.step}
                      value={zoom}
                      onChange={(e) => applyZoom(e.target.value)}
                      aria-label={t("cameraZoom")}
                    />
                    <span>{zoom.toFixed(1)}×</span>
                  </div>
                )}
                <div className="camera-hint">
                  {t("anglePhoto")} {photos.length + 1}/{TOTAL_ANGLES} — {t(["angleLabel1", "angleLabel2", "angleLabel3"][currentAngleIndex])}
                </div>
              </>
            ) : (
              <img src={photos[photos.length - 1]} className="captured-image" alt={t("capturedCrop")} />
            )}
          </div>

          {cameraError && <div className="camera-error">{cameraError}</div>}

          <div className="camera-controls">
            {liveView && (
              <button className="capture-btn leaf-action" onClick={capture} disabled={!cameraReady}>
                <Camera size={27} />
                {photos.length === 0 ? t("capturePhoto1") : t("capture")}
              </button>
            )}
            {reviewing && (
              <>
                <button className="secondary-btn leaf-action" onClick={retakeLast}><RotateCcw size={18} /> {t("retake")}</button>
                <button className="capture-btn leaf-action" onClick={keepAndContinue}><CheckCircle2 size={18} /> {t("useThisPhoto")}</button>
              </>
            )}
          </div>

          {!reviewing && photos.length > 0 && photos.length < TOTAL_ANGLES && <p className="angle-helper-text">{t("addAnotherAngle")}</p>}

          <label className="upload-fallback">
            <Upload size={16} />
            {t("uploadFallback")}
            <input type="file" accept="image/*" onChange={upload} hidden />
          </label>

          {photos.length > 0 && (
            <div className="photo-thumb-row">
              {photos.map((photo, index) => (
                <div className="photo-thumb" key={index}>
                  <img src={photo} alt={`Angle ${index + 1}`} />
                  <button type="button" onClick={() => removePhoto(index)} aria-label={t("removePhoto")}><X size={13} /></button>
                </div>
              ))}
            </div>
          )}
          <canvas ref={canvasRef} hidden />
        </section>

        <section className="details-card scan-details">
          <div className="scan-secure"><ShieldCheck size={19} /> {t("secureCamera")}</div>
          <h2>{t("analyseCrop")}</h2>
          <p>{t("analyseCropText")}</p>

          <div className="ai-analysis-card">
            <div className="ai-analysis-icon"><Leaf size={22} /></div>
            <div>
              <strong>{t("aiRecognition")}</strong>
              <span>{t("noCropSelection")}</span>
            </div>
          </div>

          <div className={`location-status location-status-${locationStatus}`}>
            <span className="permission-dot" />
            {locationStatus === "asking" && t("requestingLocation")}
            {locationStatus === "granted" && t("locationAuto")}
            {locationStatus === "denied" && t("locationSkipped")}
          </div>

          {analyzeError && <p className="form-error-note">{analyzeError}</p>}

          <button className="full-btn leaf-action" onClick={analyze} disabled={!photos.length || analyzing}>
            {analyzing ? <Loader2 size={20} className="spin-icon" /> : <ImageIcon size={20} />}
            {analyzing ? t("analyzing") : t("analyze")}
          </button>
        </section>
      </div>
    </div>
  );
}

export default DetectDisease;
