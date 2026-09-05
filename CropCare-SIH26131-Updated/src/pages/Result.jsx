import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  Leaf,
  ArrowRight
} from "lucide-react";

function Result() {

  const location = useLocation();

  const data = location.state || {};

  return (
    <div className="app-page">

      <div className="page-heading">
        <p className="small-label">ANALYSIS RESULT</p>
        <h1>Crop Health Report</h1>
      </div>

      <div className="result-layout">

        {/* Image */}

        <div className="result-image-card">

          {data.image ? (
            <img
              src={data.image}
              alt="Analyzed crop"
            />
          ) : (
            <div className="demo-image">
              <Leaf size={70} />
              <p>Demo Analysis</p>
            </div>
          )}

        </div>

        {/* Result */}
        <div className="result-card">
          <div className="result-warning">
            {data.is_healthy ? <CheckCircle2 size={25} /> : <AlertTriangle size={25} />}
            <div>
              <span>{data.is_healthy ? "Plant is Healthy" : "Possible Disease Detected"}</span>
              <h2>{data.disease || "Analyzing..."}</h2>
            </div>
          </div>
          <div className="confidence">
            <div className="confidence-top">
              <span>Detection Confidence</span>
              <strong>{data.confidence ? `${data.confidence}%` : "N/A"}</strong>
            </div>
            <div className="progress">
              <div className="progress-fill" style={{ width: `${data.confidence || 0}%` }}></div>
            </div>
          </div>
          <div className="result-info">
            <div>
              <span>Crop</span>
              <strong>{data.crop || "Tomato"}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{data.location || "Maharashtra"}</strong>
            </div>
          </div>
          <div className="symptoms">
            <h3>Common Symptoms</h3>
            <ul>
              {(data.symptoms && data.symptoms.length > 0
                ? data.symptoms
                : ["No specific symptoms data available"]
              ).map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>
          <Link to="/advisory" className="primary-btn">
            View Treatment Advice
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>

      <div className="success-note">
        <CheckCircle2 size={20} />
        Early detection can help reduce crop damage.
      </div>

    </div>
  );
}

export default Result;
