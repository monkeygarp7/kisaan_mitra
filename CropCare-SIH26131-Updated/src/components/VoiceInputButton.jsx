import { Mic, MicOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useVoiceInput } from "../utils/speech";

/**
 * Drop this next to any <input>/<textarea> inside an existing
 * `.input-box` (or similar) wrapper. It reuses the same `.icon-btn`
 * style already used for the password show/hide toggle, so it does
 * not introduce any new visual language.
 *
 * Usage:
 *   <div className="input-box">
 *     <User size={19} />
 *     <input value={name} onChange={e=>setName(e.target.value)} />
 *     <VoiceInputButton onResult={setName} />
 *   </div>
 */
function VoiceInputButton({ onResult, transform }) {
  const { language, t } = useLanguage();

  const { listening, supported, toggle } = useVoiceInput({
    language,
    onResult: (text) => onResult?.(transform ? transform(text) : text),
  });

  if (!supported) return null;

  return (
    <button
      type="button"
      className={listening ? "icon-btn voice-btn voice-btn-active" : "icon-btn voice-btn"}
      onClick={toggle}
      aria-label={t("voiceType")}
      title={t("voiceType")}
    >
      {listening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}

export default VoiceInputButton;
