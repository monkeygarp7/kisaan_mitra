import { useEffect, useState } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  MapPin,
} from "lucide-react";

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Location is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&daily=precipitation_probability_max&timezone=auto`
          );

          if (!response.ok) {
            throw new Error("Weather request failed");
          }

          const data = await response.json();

          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            precipitation: data.current.precipitation,
            rainProbability:
              data.daily?.precipitation_probability_max?.[0] ?? 0,
            wind: Math.round(data.current.wind_speed_10m),
            weatherCode: data.current.weather_code,
          });
        } catch (err) {
          console.error(err);
          setError("Unable to fetch weather data.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Please allow location access to get weather.");
        setLoading(false);
      }
    );
  }, []);

  const getWeatherText = (code) => {
    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55].includes(code)) return "Drizzle";
    if ([61, 63, 65].includes(code)) return "Rain";
    if ([71, 73, 75].includes(code)) return "Snow";
    if ([80, 81, 82].includes(code)) return "Rain Showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";

    return "Unknown";
  };

  if (loading) {
    return (
      <div className="weather-card">
        <CloudSun size={30} />
        <div>
          <strong>Loading weather...</strong>
          <span>Getting your location</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card">
        <CloudSun size={30} />
        <div>
          <strong>Weather unavailable</strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div className="weather-title">
          <CloudSun size={30} />
          <div>
            <strong>{weather.temperature}°C</strong>
            <span>{getWeatherText(weather.weatherCode)}</span>
          </div>
        </div>

        <div className="weather-location">
          <MapPin size={16} />
          <span>Your Location</span>
        </div>
      </div>

      <div className="weather-details">
        <div>
          <Droplets size={20} />
          <span>Humidity</span>
          <strong>{weather.humidity}%</strong>
        </div>

        <div>
          <CloudRain size={20} />
          <span>Rain Chance</span>
          <strong>{weather.rainProbability}%</strong>
        </div>

        <div>
          <Wind size={20} />
          <span>Wind</span>
          <strong>{weather.wind} km/h</strong>
        </div>
      </div>

      <div className="weather-advice">
        <strong>🌱 Crop Advice</strong>

        <p>
          {weather.rainProbability >= 60
            ? "Rain is likely. Avoid unnecessary irrigation today."
            : weather.humidity >= 80
            ? "High humidity detected. Monitor crops for fungal diseases."
            : weather.temperature >= 35
            ? "High temperature detected. Consider irrigation during cooler hours."
            : "Weather conditions look suitable. Continue regular crop monitoring."}
        </p>
      </div>
    </div>
  );
}

export default WeatherCard;
