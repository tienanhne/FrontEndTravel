import axios from "axios";

const API_KEY = "677bb5e89a8c0e450ebca93fc6296070";
const BASE_URL = "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast";

export const fetchWeather = async (lat: number, lon: number) => {
  const response = await axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
    },
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
    },
    
  });
  return response.data;
};

export const fetchDailyWeather = async (lat: number, lon: number) => {
  const response = await axios.get(FORECAST_URL, {
    params: {
      lat,
      lon,
      exclude: "minutely,hourly",
      appid: API_KEY,
      units: "metric",
    },
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
    },
  });
  return response.data;
};
