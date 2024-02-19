import { AiOutlineSearch } from "react-icons/ai";
import { SiWindicss } from "react-icons/si";
import { WiHumidity } from "react-icons/wi";
import {
  BsFillSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsCloudFog2Fill,
} from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";

//Seconda Api Key se la prima non funziona
//   const api_key = "0cc86d16bf572f78cdc96c096c7627e5";

interface WeatherDataProps {
  name: string;

  main: {
    temp: number;
    humidity: number;
  };

  weather: {
    main: string;
    description: string;
  }[];

  sys: {
    country: string;
  };

  wind: {
    speed: number;
  };
}

const DisplayWeather = () => {
  const ApiKey = "643e21a8fea6b5a3f8b98164e12c3823";
  const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchCity, setSearchCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>();

  const [reset, setReset] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

  const fetchWeatherByCity = async (city: string) => {
    try {
      const url = `${api_Endpoint}weather?q=${city}&appid=${ApiKey}&units=metric`;
      const searchResponse = await axios.get(url);
      const data: WeatherDataProps = searchResponse.data;

      return data;
    } catch (error) {
      setError("City not found");
    }
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCity(e.target.value);
  };

  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      setReset(!reset);
      return;
    }
    const data = await fetchWeatherByCity(searchCity);
    setWeatherData(data);
  };

  const iconChanger = (weather: string) => {
    let icon: React.ReactNode;

    switch (weather) {
      case "Clouds":
        icon = <BsCloudyFill className="w-52 h-52" />;
        break;
      case "Clear":
        icon = <BsFillSunFill className="w-52 h-52" />;
        break;
      case "Rain":
        icon = <BsFillCloudRainFill className="w-52 h-52" />;
        break;
      case "Mist":
        icon = <BsCloudFog2Fill className="w-52 h-52" />;
        break;
      case "Fog":
        icon = <BsCloudFog2Fill className="w-52 h-52" />;
        break;
      //   case "Haze":
      //     return <BsCloudFog2Fill />;
      default:
        icon = <TiWeatherPartlySunny />;
    }

    return <span>{icon}</span>;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      Promise.all([fetchCurrentWeather(latitude, longitude)]).then(
        ([currentWeather]) => {
          setWeatherData(currentWeather);
          setIsLoading(false);
          setError("");
        }
      );
    });
  }, [reset]);

  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <div className="flex flex-col justify-center items-center p-10 border rounded-3xl shadow-2xl backdrop-blur-xl bg-white/10">
        <div className="relative flex justify-center">
          <input
            className="relative rounded-full p-2 w-60 bg-gray-100/10 text-white/90 border-none focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 placeholder:pl-4"
            type="text"
            onChange={handleChangeSearch}
            placeholder="Enter a city"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <div>
            <AiOutlineSearch
              className="relative rounded-full bg-gray-100/10 w-10 h-10 p-2 cursor-pointer hover:bg-gray-100/20 transition-all ease-in-out duration-300 ml-3"
              onClick={handleSearch}
            />
          </div>
        </div>
        {(weatherData && !isLoading && (
          <>
            <div className="flex flex-col gap-1 justify-center items-center mb-4">
              <h1 className="font-bold text-5xl mb-3 mt-3">
                {weatherData.name}
              </h1>
              <span className="text-xl font-medium">
                {weatherData.sys.country}
              </span>
              <div className="">{iconChanger(weatherData.weather[0].main)}</div>
              <h1 className="font-bold text-4xl mb-4">
                {weatherData.main.temp.toFixed(0)}°C
              </h1>
            </div>

            <div className="flex gap-14 justify-center items-center border rounded-3xl px-5 py-2 backdrop-blur-xl bg-white/13">
              <div className="flex justify-center items-center">
                <WiHumidity className="h-14 w-14" />
                <div>
                  <h1 className="font-bold text-4xl">
                    {weatherData.main.humidity}%
                  </h1>
                  <p>Humidity</p>
                </div>
              </div>

              <div className="flex justify-center items-center mr-3">
                <SiWindicss className="h-14 w-14 mr-3" />
                <div>
                  <h1>{weatherData.wind.speed}km/h</h1>
                  <p>Wind speed</p>
                </div>
              </div>
            </div>
          </>
        )) ||
          (error === "" && (
            <div>
              <RiLoaderFill />
            </div>
          )) || <div>{error}</div>}
      </div>
    </div>
  );
};

export default DisplayWeather;
