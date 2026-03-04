#!/usr/bin/env node

// CLI entry point. Parses arguments and displays weather.

import { fetchWeather } from './weather.js';

function showUsage() {
  console.log('Usage: node src/index.js "City name"');
  console.log('       weather-cli "City name"  (after npm link)');
}

async function main() {
  const [, , ...args] = process.argv;
  const city = args.join(' ').trim();
  if (!city) {
    showUsage();
    process.exit(1);
  }

  try {
    const { city: name, temperature, condition } = await fetchWeather(city);
    console.log(`\nWeather in ${name}:`);
    console.log(`Temperature: ${temperature}°C`);
    console.log(`Condition: ${condition}\n`);
    process.exit(0);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(2);
  }
}

main();
