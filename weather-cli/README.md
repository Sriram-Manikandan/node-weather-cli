# Weather CLI

A simple command-line interface (CLI) application that fetches and displays the current weather for a specified city using the Open-Meteo free API (no API key required).

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd weather-cli
   ```
3. Install dependencies (none needed but run to initialize a lockfile):
   ```bash
   npm install
   ```

## Usage

Provide a city name as a single argument. If you don't, the CLI will print a usage message and exit with code 2.

```bash
# run directly
node src/index.js "City Name"

# or via npm script
npm start -- "City Name"
```

### Examples

```bash
$ node src/index.js "New York"
Weather in New York, United States:
  Temperature : 15°C
  Wind speed  : 3.5 m/s
  Wind dir    : 220°
  Condition   : Clear sky
```

```bash
$ node src/index.js
Usage: node src/index.js "City Name"
```

Error codes:

- `2`: missing/invalid input
- - - - - - - - - - - - - - - - - - -or- - - - - -  `5- - - - - - - - - - - - - - - - - - -or- - - - - -  `5- - - - - - - - - - - - - - - - - - -or- - - - - -  `5- - - - - - - - - - - - - - - - - - -or- - - - - -  `5- -by a c- - - - - - -  qu- - - - - - - - - -tput for readability.

## License

This project is licensed under the MIT License.

