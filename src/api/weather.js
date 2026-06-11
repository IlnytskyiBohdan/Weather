import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_KEY
const BASE = 'https://api.openweathermap.org'

export const searchCities = async (query) => {
  const { data } = await axios.get(`${BASE}/geo/1.0/direct`, {
    params: { q: query, limit: 5, appid: API_KEY }
  })
  return data
}

export const getCurrentWeather = async (lat, lon, lang = 'en') => {
  const { data } = await axios.get(`${BASE}/data/2.5/weather`, {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang }
  })
  return data
}

export const getForecast = async (lat, lon, lang = 'en') => {
  const { data } = await axios.get(`${BASE}/data/2.5/forecast`, {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang }
  })
  return data
}

export const getCityByIp = async () => {
  try {
    const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json')
    return { name: data.city, lat: Number(data.latitude), lon: Number(data.longitude) }
  } catch {
    return null
  }
}
