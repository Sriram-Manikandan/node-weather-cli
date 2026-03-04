#!/usr/bin/env node

// Single-file CLI: fetches current weather for a given city using Open-Meteo
// Usage: node src/index.js "New York"

// Uses native global `fetch` available in Node 18+

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// Exit codes used by this CLI:
// 0 - success
// 2 - missing/invalid input
// 3 - city not found
// 4 - network / API error
// 5 - invalid API response

/** Basic mapping of Open-Meteo weather codes to human-friendly text. */
function weatherCodeToText(code) {
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
    99: 'Thunderstorm with heavy hail',
  };
  return map[code] || `Code ${code}`;
}

/** Very small input sanitizer for city name */
function parseCityArg(argv) {
  if (!Array.isArray(argv) || argv.length < 3) {
    console.error('Usage: node src/index.js "City Name"');
    process.exit(2);
  }
  const city = String(argv[2]).trim();
  if (!city) {
    console.error('City name must be a non-empty string.');
    process.exit(2);
  }
  return city;
}

/** Geocode a city name → { name, latitude, longitude, country } */
async function geocodeCity(city) {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set('name', city);
  url.searchParams.set('count', '1');

  let res;
  try {
    res = await fetch(url.toString());
  } catch (err) {
    throw new Error(`Network error while geocoding: ${err.message}`);
  }

  if (!res.ok) {
    throw new Error(`Geocoding API returned ${res.status} ${res.statusText}`);
  }

  const body = await res.json().catch(() => null);
  if (!body || !Array.isArray(body.results) || body.results.length === 0) {
    return null; // city not found
  }

  const top = body.results[0];
  return {
    name: top.name,
    latitude: top.latitude,
    longitude: top.longitude,
    country: top.country,
  };
}

/** Fetch current weather for given latitude/longitude */
async function fetchCurrentWeather(lat, lon) {
  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('timezone', 'auto');

  let res;
  try {
    res = await fetch(url.toString());
  } catch (err) {
    throw new Error(`Network error while fetching weather: ${err.message}`);
  }

  if (!res.ok) {
    throw new Error(`Weather API returned ${res.status} ${res.statusText}`);
  }

  const body = await res.json().catch(() => null);
  if (!body || !body.current_weather) {
    throw new Error('Invalid weather response from API');
  }

  return body.current_weather;
}

/** Nicely prints the weather to stdout */
function printWeather(location, weather) {
  const locLine = location.country
    ? `${location.name}, ${location.country}`
    : location.name;

  console.log(`Weather in ${locLine}:`);
  console.log(`  Temperature : ${weather.temperature}°C`);
  console.log(`  Wind speed  : ${weather.windspeed} m/s`);
  console.log(`  Wind dir    : ${weather.winddirection}°`);
  console.log(`  Condition   : ${weatherCodeToText(weather.weathercode)}`);
}

/** Main entrypoint */
async function main() {
  const city = parseCityArg(process.argv);

  try {
    const location = await geocodeCity(city);
    if (!location) {
      console.error(`City not found: ${city}`);
      process.exit(3);
    }

    const weather = await fetchCurrentWeather(location.latitude, location.longitude);
    printWeather(location, weather);
    process.exit(0);
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    if (msg.toLowerCase().includes('network')) {
      console.error('Network or API error:', msg);
      process.exit(4);
    }
    if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('response')) {
      console.error('Received invalid response from API:', msg);
      process.exit(5);
    }

    console.error('Error:', msg);
    process.exit(4);
  }
}

// Run CLI
if (require.main === module) {
  main();
}
