import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  ShieldCheck,
  Loader2,
  Leaf,
  SwitchCamera,
  Flashlight,
  ZoomIn,
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

function DetectDisease() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Camera controls
  const [facingMode, setFacingMode] = useState("environment");
  const [flashOn, setFlashOn] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomRange, setZoomRange] = useState({ min: 1, max: 1, step: 0.1 });
  const [zoomSupported, setZoomSupported] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startCamera = async (selectedFacingMode = facingMode) => {
    try {
      setCameraReady(false);
      setCameraError("");

      stopCamera();

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("unsupported");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: selectedFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      const track = stream.getVideoTracks()[0];
      const capabilities =
        typeof track.getCapabilities === "function"
          ? track.getCapabilities()
          : {};

      const hasTorch = Boolean(capabilities.torch);
      const hasZoom =
        typeof capabilities.zoom === "number" ||
        (typeof capabilities.zoom?.min === "number" &&
          typeof capabilities.zoom?.max === "number");

      setFlashSupported(hasTorch);

      if (hasZoom && typeof capabilities.zoom === "object") {
        const min = Number(capabilities.zoom.min ?? 1);
        const max = Number(capabilities.zoom.max ?? min);
        const step = Number(capabilities.zoom.step ?? 0.1);

        setZoomRange({ min, max, step });
        setZoom((current) => Math.min(Math.max(current, min), max));
        setZoomSupported(max > min);
      } else {
        setZoomRange({ min: 1, max: 1, step: 0.1 });
        setZoom(1);
        setZoomSupported(false);
      }

      // Apply the current zoom if the camera supports it.
      if (
        hasZoom &&
        typeof capabilities.zoom === "object" &&
        capabilities.zoom.max > capabilities.zoom.min
      ) {
        try {
          await track.applyConstraints({
            advanced: [{ zoom }],
          });
        } catch {
          // Some browsers expose zoom but don't allow it to be applied.
        }
      }

      // Re-apply flash state after switching cameras.
      if (hasTorch && flashOn) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: true }],
          });
        } catch {
          setFlashOn(false);
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraReady(true);
    } catch (e) {
      setCameraReady(false);
      setFlashSupported(false);
      setZoomSupported(false);
      setCameraError(t("cameraError"));
    }
  };

  useEffect(() => {
    startCamera("environment");

    return () => {
      stopCamera();
    };
    // Camera starts once when the scan page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchCamera = async () => {
    const nextFacingMode =
      facingMode === "environment" ? "user" : "environment";

    setFacingMode(nextFacingMode);
    setFlashOn(false);
    await startCamera(nextFacingMode);
  };

  const toggleFlash = async () => {
    const track = streamRef.current?.getVideoTracks?.()[0];

    if (!track || !flashSupported) return;

    const nextFlashState = !flashOn;

    try {
      await track.applyConstraints({
        advanced: [{ torch: nextFlashState }],
      });
      setFlashOn(nextFlashState);
    } catch {
      setFlashOn(false);
    }
  };

  const changeZoom = async (value) => {
    const nextZoom = Number(value);
    setZoom(nextZoom);

    const track = streamRef.current?.getVideoTracks?.()[0];

    if (!track || !zoomSupported) return;

    try {
      await track.applyConstraints({
        advanced: [{ zoom: nextZoom }],
      });
    } catch {
      // Keep the slider usable even if the browser rejects hardware zoom.
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !cameraReady) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    canvas
      .getContext("2d")
      .drawImage(video, 0, 0, canvas.width, canvas.height);

    setPreview(canvas.toDataURL("image/jpeg", 0.9));
  };

  const upload = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const retake = () => {
    setPreview(null);

    if (!streamRef.current) {
      startCamera(facingMode);
    }
  };

  const analyze = async () => {
    if (!preview) {
      alert("Please capture a crop image.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch(preview);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "crop.jpg");

      const res = await fetch(
        "https://kisaan-mitra-backend.onrender.com/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      navigate("/result", {
        state: {
          image: preview,
          ...data.prediction,
        },
      });
    } catch (err) {
      alert("Could not reach the AI server. Make sure the backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

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
            {!preview ? (
              <>
                <video
                  ref={videoRef}
                  className="live-camera"
                  autoPlay
                  playsInline
                  muted
                />

                {!cameraReady && (
                  <div className="adorable-loading-overlay">
                    <div className="floating-leaf-container">
                      <Leaf
                        className="leaf-icon"
                        size={44}
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="cute-loading-text">
                      Waking up camera...
                    </span>
                  </div>
                )}

                <div className="camera-corners">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <div className="camera-top-status">
                  <span
                    className={
                      cameraReady ? "camera-dot ready" : "camera-dot"
                    }
                  ></span>
                  {cameraReady ? t("cameraReady") : "Starting camera..."}
                </div>

                <div className="camera-hint">
                  Keep the affected leaf inside the frame
                </div>

                {/* Camera controls */}
                <div className="camera-controls">
                  <button
                    type="button"
                    className="camera-control-btn"
                    onClick={switchCamera}
                    disabled={!cameraReady}
                    title="Switch camera"
                    aria-label="Switch camera"
                  >
                    <SwitchCamera size={21} />
                  </button>

                  <button
                    type="button"
                    className={`camera-control-btn ${
                      flashOn ? "active" : ""
                    }`}
                    onClick={toggleFlash}
                    disabled={!cameraReady || !flashSupported}
                    title={
                      flashSupported
                        ? flashOn
                          ? "Turn flashlight off"
                          : "Turn flashlight on"
                        : "Flashlight unavailable on this camera"
                    }
                    aria-label={
                      flashSupported
                        ? flashOn
                          ? "Turn flashlight off"
                          : "Turn flashlight on"
                        : "Flashlight unavailable on this camera"
                    }
                  >
                    <Flashlight size={21} />
                  </button>
                </div>

                {/* Zoom controls */}
                {zoomSupported && (
                  <div className="camera-zoom-control">
                    <ZoomIn size={18} />
                    <input
                      type="range"
                      min={zoomRange.min}
                      max={zoomRange.max}
                      step={zoomRange.step}
                      value={zoom}
                      onChange={(e) => changeZoom(e.target.value)}
                      aria-label="Camera zoom"
                    />
                    <span>{zoom.toFixed(1)}×</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <img
                  src={preview}
                  className="captured-image"
                  alt="Captured crop"
                />

                <div className="hud-grid" />
                <div className="scan-line" />
                <div className="scan-glow" />

                <div className="target-badge">
                  <span className="ping-dot" /> TARGET ACQUIRED
                </div>
              </>
            )}
          </div>

          {cameraError && (
            <div className="camera-error">{cameraError}</div>
          )}

          <div className="camera-action-bar">
            {!preview ? (
              <button
                className="smooth-btn capture-mode"
                onClick={capture}
                disabled={!cameraReady}
              >
                <Camera size={22} />
                <span>Capture Photo</span>
              </button>
            ) : (
              <button
                className="smooth-btn retake-mode"
                onClick={retake}
                disabled={isAnalyzing}
              >
                <RotateCcw size={22} />
                <span>Retake Photo</span>
              </button>
            )}

            <div className="divider"></div>

            <label className="smooth-btn upload-mode">
              <Upload size={20} />
              <span>Upload File</span>
              <input
                type="file"
                accept="image/*"
                onChange={upload}
                hidden
                disabled={isAnalyzing}
              />
            </label>
          </div>

          <canvas ref={canvasRef} hidden />
        </section>

        <section className="details-card scan-details">
          <div className="scan-secure">
            <ShieldCheck size={19} />
            Camera stays active while this page is open
          </div>

          <h2>Ready to Scan</h2>
          <p>
            Capture or upload a photo of the affected leaf to get started.
          </p>

          <button
            className={`full-btn leaf-action ${
              isAnalyzing ? "btn-analyzing" : ""
            }`}
            onClick={analyze}
            disabled={!preview || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={20} className="lucide-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <ImageIcon size={20} />
                {t("analyze")}
              </>
            )}
          </button>
        </section>
      </div>
    </div>
  );
}

export default DetectDisease;
