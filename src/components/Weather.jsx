import React, { useState } from 'react'
import './Weather.css'
import { FaSearch } from 'react-icons/fa'
import { WiDaySunny, WiCloud, WiRain, WiSnow } from 'react-icons/wi'
import { WiHumidity, WiStrongWind } from 'react-icons/wi'

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // API key should be stored in .env.local file
  const API_KEY = import.meta.env.VITE_APP_ID || process.env.REACT_APP_WEATHER_API_KEY;

  const getWeatherIcon = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 600) return <WiRain className="weather-icon" />;
    if (weatherCode >= 600 && weatherCode < 700) return <WiSnow className="weather-icon" />;
    if (weatherCode >= 801 && weatherCode < 805) return <WiCloud className="weather-icon" />;
    return <WiDaySunny className="weather-icon" />;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        }
        throw new Error('Failed to fetch weather data. Please try again later.');
      }

      const data = await response.json();
      setWeather({
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        city: data.name,
        weatherCode: data.weather[0].id
      });
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='Weather'>
        <h1 className="app-title">Weather Forecast</h1>
        <form className='search-bar' onSubmit={handleSearch}>
          <input 
            type='text' 
            placeholder='Enter city name...'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
            className="search-input"
          />
          <button type="submit" disabled={loading} className="search-button">
            <FaSearch className={`search-icon ${loading ? 'loading' : ''}`} />
          </button>
        </form>

        {error && (
          <div className="error-message" role="alert">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <div className="loader"></div>
            <p>Fetching weather data...</p>
          </div>
        )}

        {weather && !error && (
          <div className="weather-info">
            <div className="weather-header">
              <div className="weather-image">
                {getWeatherIcon(weather.weatherCode)}
              </div>
              <div className="main-info">
                <div className="temperature">{weather.temp}°C</div>
                <div className="location">{weather.city}</div>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-card humidity">
                <WiHumidity className="detail-icon" />
                <div className="detail-info">
                  <p className="percentage">{weather.humidity}%</p>
                  <p className="detail-label">Humidity</p>
                </div>
              </div>
              <div className="detail-card wind">
                <WiStrongWind className="detail-icon" />
                <div className="detail-info">
                  <p className="speed">{weather.windSpeed} km/h</p>
                  <p className="detail-label">Wind Speed</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <footer className="app-footer">
          <p> WEATHER APP </p>
        </footer>
      </div>
    </div>
  )
}

export default Weather
