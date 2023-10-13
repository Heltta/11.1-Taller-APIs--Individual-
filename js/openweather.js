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

export { getCityCoordinates, get5dayWeatherForecast };
