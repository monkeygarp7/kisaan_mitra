import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { isSpeechSupported, speak, stopSpeaking } from "../utils/speech";

/**
 * A small "Listen" pill button. Pass the text that should be read out
 * loud. Optionally auto-plays once when it first appears (used on the
 * Result page so a farmer hears the outcome without extra taps).
 */
function SpeakButton({ text, autoPlay = false, className = "" }) {
  const { language, t } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const supported = isSpeechSupported();

  const handleSpeak = () => {
    if (!text) return;
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak(text, language);
  };

  useEffect(() => {
    if (!supported || !autoPlay || !text) return;
    const timer = setTimeout(() => {
      setSpeaking(true);
      speak(text, language);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, text]);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const onEnd = () => setSpeaking(false);
    const interval = setInterval(() => {
      if (!synth.speaking) setSpeaking(false);
    }, 400);
    return () => clearInterval(interval);
  }, [supported]);

  useEffect(() => () => stopSpeaking(), []);

  if (!supported) return null;

  return (
    <button type="button" className={`speak-btn ${className}`} onClick={handleSpeak}>
      {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
      {speaking ? t("stopListening") : t("listenResult")}
    </button>
  );
}

export default SpeakButton;
