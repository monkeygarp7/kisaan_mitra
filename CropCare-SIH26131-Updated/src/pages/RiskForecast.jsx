import {
  ShieldAlert,
  CloudRain,
  Thermometer,
  Droplets,
  TrendingUp
} from "lucide-react";

function RiskForecast() {
  return (
    <div className="app-page">

      <div className="page-heading">
        <p className="small-label">SMART FORECAST</p>
        <h1>Crop Disease Risk</h1>
        <p>
          Understand possible disease and pest risk in your area.
        </p>
      </div>

      <div className="risk-main-card">

        <div>
          <span>Overall Risk</span>

          <h2>Moderate</h2>

          <p>
            Weather conditions may support fungal disease
            development.
          </p>
        </div>

        <ShieldAlert size={70} />

      </div>

      <h2 className="dashboard-heading">
        Current Conditions
      </h2>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <Thermometer size={32} />
          <h3>Temperature</h3>
          <p>28°C</p>
        </div>

        <div className="dashboard-card">
          <Droplets size={32} />
          <h3>Humidity</h3>
          <p>76%</p>
        </div>

        <div className="dashboard-card">
          <CloudRain size={32} />
          <h3>Rain Probability</h3>
          <p>60%</p>
        </div>

        <div className="dashboard-card">
          <TrendingUp size={32} />
          <h3>Disease Trend</h3>
          <p>Increasing</p>
        </div>

      </div>

      <div className="forecast-table">

        <h2>7-Day Risk Forecast</h2>

        <div className="forecast-row header">
          <span>Day</span>
          <span>Weather</span>
          <span>Risk</span>
        </div>

        <div className="forecast-row">
          <span>Today</span>
          <span>Cloudy</span>
          <strong>Moderate</strong>
        </div>

        <div className="forecast-row">
          <span>Tomorrow</span>
          <span>Rain</span>
          <strong>High</strong>
        </div>

        <div className="forecast-row">
          <span>Day 3</span>
          <span>Sunny</span>
          <strong>Low</strong>
        </div>

        <div className="forecast-row">
          <span>Day 4</span>
          <span>Cloudy</span>
          <strong>Moderate</strong>
        </div>

      </div>

    </div>
  );
}

export default RiskForecast;