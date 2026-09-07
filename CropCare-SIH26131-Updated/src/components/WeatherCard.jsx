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

/* ========================================
   GET ACTUAL LOCATION NAME
======================================== */

async function getLocationName(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error("Location lookup failed");
    }

    const data = await response.json();

    const locality =
      data.locality ||
      data.localityInfo?.administrative?.find(
        (item) => item.order === 6
      )?.name ||
      "";

    const city =
      data.city ||
      data.principalSubdivision ||
      "";

    const state =
      data.principalSubdivision ||
      "";

    /* Remove duplicates */

    const parts = [];

    [locality, city, state].forEach((part) => {
      if (
        part &&
        !parts.some(
          (existing) =>
            existing.toLowerCase() ===
            part.toLowerCase()
        )
      ) {
        parts.push(part);
      }
    });

    if (parts.length > 0) {
      return parts.join(", ");
    }

    return "Current Location";
  } catch (error) {
    console.error("Location error:", error);

    return "Current Location";
  }
}

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] =
    useState("Detecting location...");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(
        "Location is not supported by your browser."
      );

      setLoading(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const {
          latitude,
          longitude,
        } = position.coords;

        try {
          /* ========================================
             WEATHER + LOCATION
          ======================================== */

          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`
          );

          if (!weatherResponse.ok) {
            throw new Error(
              "Weather request failed"
            );
          }

          const weatherData =
            await weatherResponse.json();

          /* ========================================
             REVERSE GEOCODE
          ======================================== */

          const actualLocation =
            await getLocationName(
              latitude,
              longitude
            );

          setLocationName(actualLocation);

          /* ========================================
             7 DAY FORECAST
          ======================================== */

          const forecast = (
            weatherData.daily?.time || []
          )
            .slice(0, 7)
            .map((date, index) => ({
              date,

              day: getDayName(
                date,
                index
              ),

              max: Math.round(
                weatherData.daily
                  .temperature_2m_max[index]
              ),

              min: Math.round(
                weatherData.daily
                  .temperature_2m_min[index]
              ),

              rain:
                weatherData.daily
                  .precipitation_probability_max[
                  index
                ] ?? 0,

              code:
                weatherData.daily
                  .weather_code[index],
            }));

          /* ========================================
             SET WEATHER
          ======================================== */

          setWeather({
            temperature: Math.round(
              weatherData.current
                .temperature_2m
            ),

            humidity:
              weatherData.current
                .relative_humidity_2m,

            precipitation:
              weatherData.current
                .precipitation,

            rainProbability:
              weatherData.daily
                ?.precipitation_probability_max?.[0] ??
              0,

            wind: Math.round(
              weatherData.current
                .wind_speed_10m
            ),

            weatherCode:
              weatherData.current
                .weather_code,

            forecast,
          });

        } catch (err) {
          console.error(err);

          setError(
            "Unable to fetch weather data."
          );
        } finally {
          setLoading(false);
        }
      },

      () => {
        setError(
          "Please allow location access to get weather."
        );

        setLocationName(
          "Location unavailable"
        );

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  /* ========================================
     LOADING
  ======================================== */

  if (loading) {
    return (
      <section className="weather-card weather-card--state">

        <CloudSun size={36} />

        <div>
          <strong>
            Loading weather...
          </strong>

          <span>
            Detecting your location and weather
          </span>
        </div>

      </section>
    );
  }

  /* ========================================
     ERROR
  ======================================== */

  if (error) {
    return (
      <section className="weather-card weather-card--state">

        <CloudSun size={36} />

        <div>
          <strong>
            Weather unavailable
          </strong>

          <span>
            {error}
          </span>
        </div>

      </section>
    );
  }

  /* ========================================
     CURRENT WEATHER
  ======================================== */

  const currentWeather =
    getWeatherMeta(
      weather.weatherCode
    );

  const CurrentWeatherIcon =
    currentWeather.icon;

  return (
    <section
      className="weather-card"
      aria-label="Local weather"
    >

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="weather-headline">

        <div>

          <div className="weather-kicker">
            LOCAL WEATHER
          </div>

          <h2>
            Today's Weather
          </h2>

          <div className="weather-location">

            <MapPin size={15} />

            <span>
              {locationName}
            </span>

          </div>

        </div>


        {/* CURRENT TEMPERATURE */}

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


      {/* ========================================
          WEATHER STATS
      ======================================== */}

      <div className="weather-stats">

        <div className="weather-stat">

          <Droplets size={21} />

          <div>

            <span>
              Humidity
            </span>

            <strong>
              {weather.humidity}%
            </strong>

          </div>

        </div>


        <div className="weather-stat">

          <CloudRain size={21} />

          <div>

            <span>
              Rain Chance
            </span>

            <strong>
              {weather.rainProbability}%
            </strong>

          </div>

        </div>


        <div className="weather-stat">

          <Wind size={21} />

          <div>

            <span>
              Wind
            </span>

            <strong>
              {weather.wind} km/h
            </strong>

          </div>

        </div>


        <div className="weather-stat">

          <CloudRain size={21} />

          <div>

            <span>
              Rainfall
            </span>

            <strong>
              {weather.precipitation} mm
            </strong>

          </div>

        </div>

      </div>


      {/* ========================================
          7 DAY FORECAST
      ======================================== */}

      <div className="forecast-section">

        <div className="forecast-heading">
          7-Day Forecast
        </div>

        <div className="forecast-list">

          {weather.forecast.map((day) => {

            const dayWeather =
              getWeatherMeta(
                day.code
              );

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


      {/* ========================================
          CROP ADVICE
      ======================================== */}

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

            : "Weather conditions look suitable. Continue regular crop monitoring."

          }

        </p>

      </div>

    </section>
  );
}

export default WeatherCard;
