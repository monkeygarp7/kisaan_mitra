import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

function Reports() {
  return (
    <div className="app-page">

      <div className="page-heading">
        <p className="small-label">MY REPORTS</p>
        <h1>Crop Health Reports</h1>
        <p>
          Keep track of your previous crop analyses.
        </p>
      </div>

      <div className="report-list">

        <div className="report-item">

          <div className="report-icon">
            <AlertTriangle size={25} />
          </div>

          <div className="report-main">
            <h3>Tomato — Early Blight</h3>
            <p>Detected • 03 September 2026</p>
          </div>

          <strong className="warning-text">
            94%
          </strong>

          <Link to="/result" className="view-btn">
            View
            <ArrowRight size={17} />
          </Link>

        </div>

        <div className="report-item">

          <div className="report-icon healthy">
            <CheckCircle2 size={25} />
          </div>

          <div className="report-main">
            <h3>Soybean — Healthy</h3>
            <p>Analyzed • 28 August 2026</p>
          </div>

          <strong className="healthy-text">
            97%
          </strong>

          <Link to="/result" className="view-btn">
            View
            <ArrowRight size={17} />
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Reports;