// src/weather.js
// Contains API logic for geocoding and fetching current weather from
// Open-Meteo. No API key required.

/**
 * Map Open-Meteo weather codes to a human-readable description.
 */
function mapWeatherCode(code) {
  const map = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  return map[code] || `Unknown (${code})`;
}

/**
 * Given a city name, geocode it then fetch current weather.
 * Returns { city, temperature, condition }.
 * Throws an Error if anything goes wrong.
 */
async function fetchWeather(city) {
  if (!city || typeof city !== 'string' || city.trim() === '') {
    throw new Error('city name is required');
  }
  const nameInput = city.trim();
  const encoded = encodeURIComponent(nameInput);

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=1`;
  const geoResp = await fetch(geoUrl);
  if (!geoResp.ok) {
    throw new Error(`geocoding request failed (${geoResp.status})`);
  }
  const geoData = await geoResp.json();
  if (!geoData || !Array.isArray(geoData.results) || geoData.results.length === 0) {
    throw new Error(`could not find city "${nameInput}"`);
  }
  const { latitude, longitude, name: resolvedName } = geoData.results[0];

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${latitude}&longitude=${longitude}` +
    `&current_weather=true&temperature_unit=celsius`;
  const weatherResp = await fetch(weatherUrl);
  if (!weatherResp.ok) {
    throw new Error(`weather request failed (${weatherResp.status})`);
  }
  const weatherData = await weatherResp.json();
  if (!weatherData || !weatherData.current_weather) {
    throw new Error('invalid weather response');
  }

  const temp = weatherData.current_weather.temperature;
  const code = weatherData.current_weather.weathercode;

  return {
    city: resolvedName || nameInput,
    temperature: temp,
    condition: mapWeatherCode(code)
  };
}

export { fetchWeather };
