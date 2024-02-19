import axios from "axios";

const ApiKey = "643e21a8fea6b5a3f8b98164e12c3823";
const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

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

export { fetchCurrentWeather, fetchWeatherByCity };
