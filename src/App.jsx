import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Oval } from "react-loader-spinner";

function App() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const toDate = () => {
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    const currentDate = new Date();
    return `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  const fetchWeather = (city) => {
    setWeather((prev) => ({ ...prev, loading: true, error: false }));

    axios
      .get("https://api.openweathermap.org/data/2.5/forecast", {
        params: {
          q: city,
          units: "metric",
          appid: "f4a3851387ee5f0277426752bb8c1d6d",
        },
      })
      .then((res) => {
        localStorage.setItem("lastCity", city);
        setWeather({ data: res.data, loading: false, error: false });
      })
      .catch((err) => {
        console.log(err);
        setWeather({ loading: false, data: {}, error: true });
      });
  };

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      fetchWeather(savedCity);
    }
  }, []);

  const search = (event) => {
    if (event.key === "Enter") {
      const city = input.trim();
      if (!city) return;

      fetchWeather(city);
      setInput("");
    }
  };

  return (
    <div className="App">
      <div className="weather-app">
        <div className="weather-heading">
          <h2>Weather Today</h2>
        </div>
        <div className="city-search">
          <input
            type="text"
            className="city"
            placeholder="Enter City Name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={search}
          />
        </div>

        {weather.loading && <Oval height={30} width={30} />}

        {weather.error && (
          <div className="error-message">
            <span className="error-m">City Not Found</span>
          </div>
        )}

        {weather.data?.list?.length > 0 && (
          <div>
            <div className="city-name">
              <h2>
                {weather.data.city.name}, <span>{weather.data.city.country}</span>
              </h2>
            </div>

            <div className="date">
              <span>{toDate()}</span>
            </div>

            <div className="icon-temp">
              <img
                src={`https://openweathermap.org/img/wn/${weather.data.list[0].weather[0].icon}@2x.png`}
                alt="weather"
              />
              {Math.round(weather.data.list[0].main.temp)}
              <sup className="deg">°C</sup>
            </div>

            <div className="des-wind">
              <p>{weather.data.list[0].weather[0].description.toUpperCase()}</p>
              <p className="des-wind-p">
                Wind Speed: {weather.data.list[0].wind.speed}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;