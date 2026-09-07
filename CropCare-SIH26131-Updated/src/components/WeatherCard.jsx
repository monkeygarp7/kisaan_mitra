import { useEffect, useState } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  MapPin,
  Cloud,
  Sun,
  CloudFog,
  CloudLightning,
} from "lucide-react";

function getWeatherMeta(code) {
  if (code === 0) {
    return {
      label: "Clear Sky",
      icon: Sun,
    };
  }

  if ([1, 2, 3].includes(code)) {
    return {
      label: "Partly Cloudy",
      icon: CloudSun,
    };
  }

  if ([45, 48].includes(code)) {
    return {
      label: "Foggy",
      icon: CloudFog,
    };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      label: "Drizzle",
      icon: CloudRain,
    };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {
      label: "Rain",
      icon: CloudRain,
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      label: "Snow",
      icon: Cloud,
    };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      label: "Thunderstorm",
      icon: CloudLightning,
    };
  }

  return {
    label: "Weather",
    icon: CloudSun,
  };
}

function getDayName(dateString, index) {
  if (index === 0) {
    return "Today";
  }

  return new Date(`${dateString}T12:00:00`).toLocaleDateString(
    undefined,
    {
      weekday: "short",
    }
  );
}

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
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`
          );

          if (!response.ok) {
            throw new Error("Weather request failed");
          }

          const data = await response.json();

          const forecast = (data.daily?.time || [])
            .slice(0, 7)
            .map((date, index) => ({
              date,
              day: getDayName(date, index),
              max: Math.round(
                data.daily.temperature_2m_max[index]
              ),
              min: Math.round(
                data.daily.temperature_2m_min[index]
              ),
              rain:
                data.daily.precipitation_probability_max[
                  index
                ] ?? 0,
              code: data.daily.weather_code[index],
            }));

          setWeather({
            temperature: Math.round(
              data.current.temperature_2m
            ),

            humidity:
              data.current.relative_humidity_2m,

            precipitation:
              data.current.precipitation,

            rainProbability:
              data.daily
                ?.precipitation_probability_max?.[0] ?? 0,

            wind: Math.round(
              data.current.wind_speed_10m
            ),

            weatherCode:
              data.current.weather_code,

            forecast,
          });
        } catch (err) {
          console.error(err);
          setError("Unable to fetch weather data.");
        } finally {
          setLoading(false);
        }
      },

      () => {
        setError(
          "Please allow location access to get weather."
        );

        setLoading(false);
      }
    );
  }, []);

  /* -----------------------------
     LOADING
  ----------------------------- */

  if (loading) {
    return (
      <section className="weather-card weather-card--state">
        <CloudSun size={36} />

        <div>
          <strong>Loading weather...</strong>
          <span>
            Getting your local weather forecast
          </span>
        </div>
      </section>
    );
  }

  /* -----------------------------
     ERROR
  ----------------------------- */

  if (error) {
    return (
      <section className="weather-card weather-card--state">
        <CloudSun size={36} />

        <div>
          <strong>Weather unavailable</strong>

          <span>{error}</span>
        </div>
      </section>
    );
  }

  /* -----------------------------
     CURRENT WEATHER
  ----------------------------- */

  const currentWeather = getWeatherMeta(
    weather.weatherCode
  );

  const CurrentWeatherIcon =
    currentWeather.icon;

  return (
    <section
      className="weather-card"
      aria-label="Local weather"
    >
      {/* HEADER */}

      <div className="weather-headline">
        <div>
          <div className="weather-kicker">
            LOCAL WEATHER
          </div>

          <h2>Today's Weather</h2>

          <div className="weather-location">
            <MapPin size={15} />

            <span>Your Location</span>
          </div>
        </div>

        <div className="weather-current-condition">
          <CurrentWeatherIcon
            size={58}
            strokeWidth={1.8}
          />

          <div>
            <strong>
              {weather.temperature}°C
            </strong>

            <span>
              {currentWeather.label}
            </span>
          </div>
        </div>
      </div>

      <div className="weather-divider" />

      {/* WEATHER STATS */}

      <div className="weather-stats">

        <div className="weather-stat">
          <Droplets size={21} />

          <div>
            <span>Humidity</span>

            <strong>
              {weather.humidity}%
            </strong>
          </div>
        </div>

        <div className="weather-stat">
          <CloudRain size={21} />

          <div>
            <span>Rain Chance</span>

            <strong>
              {weather.rainProbability}%
            </strong>
          </div>
        </div>

        <div className="weather-stat">
          <Wind size={21} />

          <div>
            <span>Wind</span>

            <strong>
              {weather.wind} km/h
            </strong>
          </div>
        </div>

        <div className="weather-stat">
          <CloudRain size={21} />

          <div>
            <span>Rainfall</span>

            <strong>
              {weather.precipitation} mm
            </strong>
          </div>
        </div>

      </div>

      {/* 7 DAY FORECAST */}

      <div className="forecast-section">

        <div className="forecast-heading">
          7-Day Forecast
        </div>

        <div className="forecast-list">

          {weather.forecast.map((day) => {
            const dayWeather =
              getWeatherMeta(day.code);

            const DayIcon =
              dayWeather.icon;

            return (
              <div
                className="forecast-day"
                key={day.date}
              >
                <span className="forecast-day-label">
                  {day.day}
                </span>

                <DayIcon
                  size={28}
                  strokeWidth={1.8}
                />

                <strong>
                  {day.max}°
                </strong>

                <span className="forecast-low">
                  {day.min}°
                </span>

                <span className="forecast-rain">
                  {day.rain}% rain
                </span>
              </div>
            );
          })}

        </div>
      </div>

      {/* CROP ADVICE */}

      <div className="weather-advice">

        <div className="weather-advice-title">
          🌱 Crop Advice
        </div>

        <p>
          {weather.rainProbability >= 60
            ? "Rain is likely. Avoid unnecessary irrigation today."
            : weather.humidity >= 80
            ? "High humidity detected. Monitor crops for fungal diseases."
            : weather.temperature >= 35
            ? "High temperature detected. Prefer irrigation during cooler hours."
            : "Weather conditions look suitable. Continue regular crop monitoring."}
        </p>

      </div>

    </section>
  );
}

export default WeatherCard;
