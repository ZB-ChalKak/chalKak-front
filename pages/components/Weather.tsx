import { useEffect, useState } from 'react';
import axios from 'axios';

interface WeatherData {
  success: boolean;
  message: string;
  curTemperature: number;
  weatherCode: number;
}

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Latitude: ", latitude);
      console.log("Longitude: ", longitude);
      try {
        const response = await axios.post<WeatherData>('http://localhost:3000/weather', { lat: latitude, lon: longitude });
        setWeatherData(response.data);
        console.log(response);
      } catch (error) {
        console.error('날씨 정보를 불러오는데 실패했습니다.', error);
      }
    }, 
    (error) => console.error('위치 정보를 가져오는데 실패했습니다.', error));
  }, []);
  console.log(weatherData);

  
  if (!weatherData) return <div>Loading...</div>; // weather data가 없을 때 처리

  // Weather Code를 기반으로 아이콘 출력
  let weatherIcon;

  if ([0,1,2].includes(weatherData.weatherCode)) {
    weatherIcon = '☀️';
  } else if (weatherData.weatherCode === 3) {
    weatherIcon = '🌤️';
  } else if ([45,48].includes(weatherData.weatherCode)) {
    weatherIcon = '☁️';
  } else if ([51,53,55,56,57,61,63,65,66,67,71,73,75,80,81,82].includes(weatherData.weatherCode)) {
    weatherIcon = '☔️';
  } else if ([95,96,99].includes(weatherData.weatherCode)) {
    weatherIcon = '⛈️'
  } else if ([77,85,86].includes(weatherData.weatherCode)) {
    weatherIcon = '☃️';
  } 


  return (
    <div>{`현재 날씨 ${weatherIcon} ${Math.floor(weatherData.curTemperature)}`}℃</div>
  );
};

export default Weather;