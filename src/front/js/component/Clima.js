import React, { useEffect, useState } from 'react';
import { getWeatherByCountryCode } from '../services/weather/weather.services';
import { getCountryName } from '../adapters/countries';
import { FaCloud, FaWind, FaSun } from 'react-icons/fa'; // Importing icons
import "../../styles/clima.css";


const Clima = () => {
  const [weatherData, setWeatherData] = useState({
    country: 'CL', // Default country set to 'CL' (Chile)
    temps: [],
  });
  const [selectedCountry, setSelectedCountry] = useState('CL'); // State for selected country

  // List of country codes
  const countryList = [
    { code: 'CL', name: 'Chile' },
    { code: 'US', name: 'United States' },
    { code: 'AR', name: 'Argentina' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
  ];

  // Fetch weather data based on selected country
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getWeatherByCountryCode(selectedCountry);
        if (response.error) {
          console.error("Error al obtener datos:", response.error);
          setWeatherData({ country: selectedCountry, temps: [] });
        } else {
          setWeatherData({
            country: response.country || selectedCountry,
            temps: response.temps,
          });
        }
      } catch (error) {
        console.error("Error general al obtener datos del clima:", error);
        setWeatherData({ country: selectedCountry, temps: [] });
      }
    }

    fetchData();
  }, [selectedCountry]);

  // Handle country selection change
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div className="clima-container">
      <h2 className="clima-title">Weather in {getCountryName(weatherData.country)}</h2>

      {/* Dropdown to select a country */}
      <select className="country-dropdown" value={selectedCountry} onChange={handleCountryChange}>
        {countryList.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>

      {/* Display weather data */}
      <div className="weather-days">
        {weatherData.temps.map((item, index) => (
          <div key={index} className="weather-day">
            <h3>{item.day}</h3>
            <p className="temp">{item.temp}°C</p>
            <p className="description">{item.description}</p>
            <div className="icons">
              {item.isCloudy ? <FaCloud className="icon cloudy" /> : <FaSun className="icon sunny" />}
              {item.isWindy && <FaWind className="icon windy" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clima;
