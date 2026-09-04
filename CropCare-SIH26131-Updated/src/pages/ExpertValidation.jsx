import { useState } from "react";
import {
  UserCheck,
  Send,
  CheckCircle2
} from "lucide-react";

function ExpertValidation() {

  const [sent, setSent] = useState(false);

  const submitRequest = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="app-page">

      <div className="page-heading">
        <p className="small-label">EXPERT SUPPORT</p>
        <h1>Expert Validation</h1>
        <p>
          Request agricultural expert review of a crop report.
        </p>
      </div>

      {!sent ? (

        <form
          className="expert-form"
          onSubmit={submitRequest}
        >

          <div className="expert-icon">
            <UserCheck size={45} />
          </div>

          <h2>Request Expert Review</h2>

          <label>Your Crop</label>

          <select required>
            <option value="">Select crop</option>
            <option>Tomato</option>
            <option>Cotton</option>
            <option>Soybean</option>
            <option>Rice</option>
            <option>Wheat</option>
          </select>

          <label>Describe the problem</label>

          <textarea
            placeholder="Describe what you are observing in the crop..."
            rows="5"
            required
          ></textarea>

          <button className="full-btn">
            <Send size={19} />
            Send for Validation
          </button>

        </form>

      ) : (

        <div className="success-card">

          <CheckCircle2 size={60} />

          <h2>Request Submitted</h2>

          <p>
            Your crop report has been submitted for expert
            validation.
          </p>

          <span>
            Request ID: CR-2026-001
          </span>

        </div>

      )}

    </div>
  );
}

export default ExpertValidation;