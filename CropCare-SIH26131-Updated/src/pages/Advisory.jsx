import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Droplets,
  Scissors,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";

function Advisory() {
  return (
    <div className="app-page">

      <Link to="/result" className="back-link">
        <ArrowLeft size={18} />
        Back to Result
      </Link>

      <div className="page-heading">
        <p className="small-label">CROP ADVISORY</p>
        <h1>Recommended Action</h1>
        <p>
          Practical steps based on the detected crop condition.
        </p>
      </div>

      <div className="advisory-alert">
        <AlertTriangle size={25} />

        <div>
          <strong>Early Blight detected</strong>
          <p>
            Take action early and monitor nearby plants.
          </p>
        </div>
      </div>

      <div className="advisory-grid">

        <div className="advice-card">
          <Scissors size={32} />
          <h3>1. Remove affected leaves</h3>
          <p>
            Remove severely affected plant material carefully
            and dispose of it appropriately.
          </p>
        </div>

        <div className="advice-card">
          <Droplets size={32} />
          <h3>2. Manage watering</h3>
          <p>
            Avoid unnecessary wetting of leaves and maintain
            good field drainage.
          </p>
        </div>

        <div className="advice-card">
          <ShieldCheck size={32} />
          <h3>3. Monitor the crop</h3>
          <p>
            Check nearby plants regularly for new symptoms.
          </p>
        </div>

      </div>

      <div className="expert-note">
        <h3>⚠ Important</h3>

        <p>
          Treatment recommendations should be verified with
          local agricultural experts and current government
          agricultural guidance before applying any chemical
          treatment.
        </p>

        <Link to="/expert" className="secondary-btn">
          Ask for Expert Validation
        </Link>
      </div>

    </div>
  );
}

export default Advisory;