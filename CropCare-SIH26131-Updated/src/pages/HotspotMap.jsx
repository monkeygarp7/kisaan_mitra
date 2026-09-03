import {
  MapPin,
  AlertTriangle,
  Search
} from "lucide-react";

function HotspotMap() {
  return (
    <div className="app-page">

      <div className="page-heading">
        <p className="small-label">DISEASE SURVEILLANCE</p>
        <h1>Crop Disease Hotspots</h1>
        <p>
          View reported disease activity in different areas.
        </p>
      </div>

      <div className="map-toolbar">

        <div className="input-box">
          <Search size={19} />
          <input
            placeholder="Search district or village"
          />
        </div>

        <select>
          <option>All Diseases</option>
          <option>Early Blight</option>
          <option>Leaf Spot</option>
          <option>Powdery Mildew</option>
          <option>Pest Infestation</option>
        </select>

      </div>

      <div className="fake-map">

        <div className="map-title">
          Maharashtra Disease Surveillance
        </div>

        <div className="map-pin pin-one">
          <MapPin size={35} />
        </div>

        <div className="map-pin pin-two">
          <MapPin size={35} />
        </div>

        <div className="map-pin pin-three">
          <MapPin size={35} />
        </div>

        <div className="map-legend">

          <div>
            <span className="legend-dot high"></span>
            High Risk
          </div>

          <div>
            <span className="legend-dot medium"></span>
            Moderate Risk
          </div>

          <div>
            <span className="legend-dot low"></span>
            Low Risk
          </div>

        </div>

      </div>

      <div className="hotspot-list">

        <div>
          <AlertTriangle size={22} />
          <div>
            <strong>Tomato Early Blight</strong>
            <span>High activity reported</span>
          </div>
        </div>

        <div>
          <AlertTriangle size={22} />
          <div>
            <strong>Soybean Leaf Spot</strong>
            <span>Moderate activity reported</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default HotspotMap;