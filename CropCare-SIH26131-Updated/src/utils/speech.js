import { useCallback, useEffect, useRef, useState } from "react";

// Map our app language codes to speech locale tags
const LOCALE = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

export function speechLocale(language) {
  return LOCALE[language] || "en-IN";
}

function getRecognitionCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * Voice typing hook - press mic, speak, text lands in the field.
 * Works fully on-device via the browser's Web Speech API (no extra
 * dependency, no extra network usage beyond what the browser needs).
 */
export function useVoiceInput({ language = "en", onResult } = {}) {
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => !!getRecognitionCtor());
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = speechLocale(language);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) onResult?.(transcript.trim());
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
    }
  }, [language, onResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop?.();
    setListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { listening, supported, start, stop, toggle };
}

/**
 * Text-to-speech - reads a result out loud so a farmer who can't read
 * the screen text easily can still hear the outcome.
 */
export function speak(text, language = "en") {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechLocale(language);
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
