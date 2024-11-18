/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  fetchWeather,
  fetchDailyWeather,
} from "../../fetchApi/fetchWeatherApi";

interface WeatherSmartCardProps {
  lat: number;
  lng: number;
  selectedDate: Date; // Ngày người dùng đã chọn
}

const weatherTranslations: { [key: string]: string } = {
  "clear sky": "Trời quang",
  "few clouds": "Ít mây",
  "scattered clouds": "Mây rải rác",
  "overcast clouds": "Mây u ám",
  "broken clouds": "Mây đứt đoạn",
  "shower rain": "Mưa rào",
  "light rain": "Mưa nhẹ",
  "light intensity shower rain": "Mưa rào",
  "moderate rain": "Mưa vừa",
  rain: "Mưa",
  thunderstorm: "Bão",
  snow: "Tuyết",
  mist: "Sương mù",
  "heavy intensity rain": "Mưa lớn",
};

const WeatherSmartCard: React.FC<WeatherSmartCardProps> = ({
  lat,
  lng,
  selectedDate,
}) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);

  const isAfterSelectedDate = (forecastDate: Date, selectedDate: Date) => {
    return (
      forecastDate.getFullYear() > selectedDate.getFullYear() ||
      (forecastDate.getFullYear() === selectedDate.getFullYear() &&
        forecastDate.getMonth() > selectedDate.getMonth()) ||
      (forecastDate.getFullYear() === selectedDate.getFullYear() &&
        forecastDate.getMonth() === selectedDate.getMonth() &&
        forecastDate.getDate() > selectedDate.getDate())
    );
  };

  useEffect(() => {
    const getWeatherData = async () => {
      const weather = await fetchWeather(lat, lng);
      const forecast = await fetchDailyWeather(lat, lng);
      setWeatherData(weather);

      const filteredForecast = forecast.list.filter(
        (entry: any, index: number, self: any) => {
          const forecastDate = new Date(entry.dt * 1000);

          // Lấy dự báo sau ngày đã chọn và loại bỏ các mục có cùng ngày
          return (
            isAfterSelectedDate(forecastDate, selectedDate) &&
            new Date(entry.dt * 1000).getDate() !==
              new Date(self[index - 1]?.dt * 1000).getDate()
          );
        }
      );

      setForecastData(filteredForecast);
    };

    getWeatherData();
  }, [lat, lng, selectedDate]);

  const translateWeatherDescription = (description: string) => {
    return weatherTranslations[description] || description;
  };

  return weatherData ? (
    <div className="p-2 shadow-lg max-w-md mx-auto rounded-lg">
      {/* Current Weather Section */}
      <div className="flex items-center bg-gradient-to-r from-orange-300 to-yellow-300 rounded-lg">
        <img
          src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt={weatherData.weather[0].description}
          className="w-12 h-12"
        />
        <div className="ml-4">
          <p className="font-bold text-md">
            Hiện tại:{" "}
            <span className="capitalize">
              {translateWeatherDescription(weatherData.weather[0].description)}
            </span>
          </p>
          <p className="text-sm font-bold">
            Nhiệt độ: {Math.round(weatherData.main.temp)}°C
          </p>
        </div>
      </div>

      {/* Forecast Section */}
      <div className="mt-2 bg-gradient-to-r from-blue-100 to-blue-300 p-2 rounded-lg">
        <h3 className="text-md font-bold mb-2">Thời tiết các ngày tiếp theo</h3>
        <ul className="space-y-1">
          {forecastData.length > 0 ? (
            forecastData.map((entry, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm"
              >
                <span className="font-medium">
                  {new Date(entry.dt * 1000).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "numeric",
                  })}
                </span>
                <span className="font-semibold">
                  {Math.round(entry.main.temp)}°C
                </span>
                <span className="capitalize">
                  {translateWeatherDescription(entry.weather[0].description)}
                </span>
              </li>
            ))
          ) : (
            <li>Không có dữ liệu dự báo sau ngày đã chọn.</li>
          )}
        </ul>
      </div>
    </div>
  ) : (
    <p>Đang tải dữ liệu...</p>
  );
};

export default WeatherSmartCard;
