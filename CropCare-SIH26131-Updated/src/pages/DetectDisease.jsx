import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, Image as ImageIcon, Leaf, MapPin, RotateCcw, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function DetectDisease(){
 const navigate=useNavigate(); const {t}=useLanguage(); const videoRef=useRef(null); const canvasRef=useRef(null); const streamRef=useRef(null);
 const [preview,setPreview]=useState(null); const [crop,setCrop]=useState(""); const [location,setLocation]=useState(""); const [cameraError,setCameraError]=useState(""); const [cameraReady,setCameraReady]=useState(false);
 const startCamera=async()=>{ try{ if(!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported"); const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:false}); streamRef.current=stream; if(videoRef.current){videoRef.current.srcObject=stream; await videoRef.current.play();} setCameraReady(true); setCameraError(""); }catch(e){setCameraReady(false);setCameraError(t("cameraError"));} };
 useEffect(()=>{startCamera(); return()=>{streamRef.current?.getTracks().forEach(track=>track.stop());};},[]);
 const capture=()=>{ const video=videoRef.current,canvas=canvasRef.current; if(!video||!canvas||!cameraReady)return; canvas.width=video.videoWidth||1280; canvas.height=video.videoHeight||720; canvas.getContext("2d").drawImage(video,0,0,canvas.width,canvas.height); setPreview(canvas.toDataURL("image/jpeg",0.9)); };
 const upload=(e)=>{const file=e.target.files?.[0];if(file)setPreview(URL.createObjectURL(file));};
 const retake=()=>{setPreview(null); if(!streamRef.current)startCamera();};
const analyze = async () => {
  if (!preview) {
    alert("Please capture a crop image.");
    return;
  }

  try {
    const response = await fetch(preview);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("file", blob, "crop.jpg");

    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    navigate("/result", { state: { image: preview, crop, location, ...data.prediction } });
  } catch (err) {
    alert("Could not reach the AI server. Make sure the backend is running.");
  }
};
 return <div className="app-page scan-page">
  <div className="page-heading scan-heading"><p className="small-label">AI CROP DETECTION</p><h1>{t("scan")}</h1><p>{t("allowCamera")}</p></div>
  <div className="scan-camera-layout">
   <section className="camera-card">
    <div className="camera-frame">
      {!preview ? <><video ref={videoRef} className="live-camera" autoPlay playsInline muted/><div className="camera-corners"><i></i><i></i><i></i><i></i></div><div className="camera-top-status"><span className={cameraReady?"camera-dot ready":"camera-dot"}></span>{cameraReady?t("cameraReady"):"Starting camera..."}</div><div className="camera-hint">Keep the affected leaf inside the frame</div></> : <img src={preview} className="captured-image" alt="Captured crop"/>}
    </div>
    {cameraError && <div className="camera-error">{cameraError}</div>}
    <div className="camera-controls">{!preview?<button className="capture-btn leaf-action" onClick={capture} disabled={!cameraReady}><Camera size={27}/>{t("capture")}</button>:<button className="secondary-btn leaf-action" onClick={retake}><RotateCcw size={18}/>{t("retake")}</button>}</div>
    <label className="upload-fallback"><Upload size={16}/>{t("uploadFallback")}<input type="file" accept="image/*" onChange={upload} hidden/></label>
    <canvas ref={canvasRef} hidden/>
   </section>
  <section className="details-card scan-details">
  <div className="scan-secure"><ShieldCheck size={19}/> Camera stays active while this page is open</div>
  <h2>Ready to Scan</h2>
  <p>Capture or upload a photo of the affected leaf to get started.</p>
  <button className="full-btn leaf-action" onClick={analyze} disabled={!preview}><ImageIcon size={20}/>{t("analyze")}</button>
</section>
  </div>
 </div>;
}
export default DetectDisease;
