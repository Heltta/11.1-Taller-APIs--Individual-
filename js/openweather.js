import { getJSON, postJSON } from './petitionManager.js';

const openWeatherKey = 'a15aba680fa2b59a88d856636e3fc2cc';
const geoCodingURL = 'http://api.openweathermap.org/geo/1.0/direct';

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
export { getCityCoordinates };
