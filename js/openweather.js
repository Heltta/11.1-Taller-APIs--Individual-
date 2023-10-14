import { getJSON, postJSON } from './petitionManager.js';

const openWeatherKey = 'a15aba680fa2b59a88d856636e3fc2cc';
const geoCodingURL = 'http://api.openweathermap.org/geo/1.0/direct';
const weatherForecastOpenApi3URL =
  'https://api.openweathermap.org/data/3.0/onecall';
const weatherForecastOpenApi2URL =
  'https://api.openweathermap.org/data/2.5/forecast';

async function getCityCoordinates({ cityName, stateCode, countryCode }, limit) {
  // countryCode must be ISO3
  const apiResponseJSON = await getJSON(geoCodingURL, {
    q: `${cityName}${stateCode ? ',' + stateCode : ''}${',' + countryCode}`,
    appid: openWeatherKey,
  });
  console.log(apiResponseJSON);
  // Only the first city of the list is of interest
  const coordinates = {
    latitude: apiResponseJSON[0].lat,
    longitude: apiResponseJSON[0].lon,
  };
  return coordinates;
}

/**
 * Call to openweather app
 * Note: need premium subscription
 *
 * @param {Number} latitude - Location latitude
 * @param {Number} longitude - Location longitude
 * @param {Array<('current'|'minutely'|'hourly'|'daily'|'alerts')>|'all'} includedPeriods -
 * The forecast periods to include in the report takes all as included if param equals to 'all'
 * @returns A weather forecast report from the open weather api
 */
async function getWeatherForecast(latitude, longitude, includedPeriods = []) {
  let excludedForecastPeriods = [];

  // Filters included periods based on includedPeriods argument
  if (includedPeriods != 'all') {
    excludedForecastPeriods = [
      'current',
      'minutely',
      'hourly',
      'daily',
      'alerts',
    ];
    excludedForecastPeriods = excludedForecastPeriods.filter(
      (period) => !includedPeriods.includes(period)
    );
  }

  const requestData = {
    lat: latitude.toString(),
    lon: longitude.toString(),
    appid: openWeatherKey,
  };

  if (excludedForecastPeriods.length > 0)
    requestData.exclude = forecastPeriods.join(',');

  requestData.exclude = excludedForecastPeriods.join(',');
  const apiResponseJSON = await getJSON(
    weatherForecastOpenApi3URL,
    requestData
  );

  return apiResponseJSON;
}

/**
 * Call to openweather app
 * Note: need premium subscription
 *
 * @param {Number} latitude - Location latitude
 * @param {Number} longitude - Location longitude
 * @param {Array<('current'|'minutely'|'hourly'|'daily'|'alerts')>|'all'} includedPeriods -
 * The forecast periods to include in the report takes all as included if param equals to 'all'
 * @returns A weather forecast report from the open weather api
 */
async function get5dayWeatherForecast(latitude, longitude) {
  const requestData = {
    lat: latitude.toString(),
    lon: longitude.toString(),
    appid: openWeatherKey,
    units: 'metric',
  };

  const apiResponseJSON = await getJSON(
    weatherForecastOpenApi2URL,
    requestData
  );

  return apiResponseJSON;
}

/**
 * @typedef ForecastDataPeriod
 * @property {Number} dt - Time of data forecasted, unix, UTC
 * @property {Object} main
 * @property {Object} weather
 * @property {Object} clouds
 * @property {Object} wind
 * @property {Number} visibility - Average visibility, metres. The maximum value of the visibility is 10km
 * @property {String} pop - Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
 * @property {Object} rain
 * @property {Object} snow
 * @property {Object} sys - Part of the day (n - night, d - day)
 * @property {String} dt_txt
 *
 */

/**
 *
 * @param {ForecastDataPeriod} forecastDataPeriod
 * @returns
 */
function calculateLaundrySafety(forecastDataPeriod) {
  /**
   * @typedef LaundrySafetyReport
   * @property {'green'|'yellow'|'orange'|'red'} safetyColor
   * @property {Number} safetyScore
   * @property {String} message
   * @property {Number} dt - Time of data forecasted, unix, UTC
   */

  let safetyScore = 100;

  // Adjust score based on humidity
  safetyScore -= (25 * forecastDataPeriod.main.humidity) / 100;
  // Adjust score based on cloudiness
  safetyScore -= (25 * forecastDataPeriod.clouds.all) / 100;
  // Adjust score based on temperature (Celsius)
  safetyScore += (forecastDataPeriod.main.temp - 5) ** 3 / 500;
  // Adjust score based on wind speed (m/s)
  if (forecastDataPeriod.wind.speed > 25) {
    safetyScore = 0; // Wind speed is to fast to go out safely
  } else if (forecastDataPeriod.wind.speed > 3) {
    safetyScore += (forecastDataPeriod.wind.speed - 3) / 25;
  }
  // Adjust score based on probability of precipitation
  safetyScore -= safetyScore * forecastDataPeriod.pop;

  /**
   * @type {LaundrySafetyReport}
   */
  const safetyLevel = { safetyScore: safetyScore, dt: forecastDataPeriod.dt };

  // Assign color and message
  if (safetyScore <= 0) {
    safetyLevel.safetyColor = 'red';
    safetyLevel.message = "Don't... just don't";
  } else if (safetyScore < 50) {
    safetyLevel.safetyColor = 'orange';
    safetyLevel.message = 'Only if you are ready to get wet';
  } else if (safetyScore < 100) {
    safetyLevel.safetyColor = 'yellow';
    safetyLevel.message = 'Could be worse';
  } else if (safetyScore >= 90) {
    safetyLevel.safetyColor = 'green';
    safetyLevel.message = 'Do the laundry like a champ';
  }

  return safetyLevel;
}

export { getCityCoordinates, get5dayWeatherForecast, calculateLaundrySafety };
