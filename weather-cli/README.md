# Weather CLI

A lightweight command-line interface (CLI) that fetches and displays the current
weather for a given city using the free Open‑Meteo API.  No API key is required.

## Requirements

- Node.js 18 or later (to provide built-in `fetch` and ES module support)

## Installation

```bash
git clone <repository-url>
cd weather-cli
npm install    # no runtime deps, creates a lockfile
```

Optionally you can link the CLI globally:

```bash
npm link
# now you can run `weather-cli` from anywhere
```

## Usage

Provide the city name as a single argument (quotes required if it contains spaces).

```bash
node src/index.js "New York"
# or via package script
npm start -- "New York"
# or if linked globally:
weather-cli "New York"
```

### Example output

```
Weather in New York:
Temperature: 15°C
Condition: Clear sky
```

### Error handling

- No argument: prints usage and exits with code 1.
- City not found: prints an error and exits with code 2.
- Network/API failure: error message and exit code 2.

All source logic lives in two modules (`src/index.js` and `src/weather.js`).

## License

MIT

