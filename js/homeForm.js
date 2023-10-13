import {
  getAllCountries,
  getAllCitiesOfCountry,
  getCountryISO,
} from './countriesnow.js';
import { getCityCoordinates, get5dayWeatherForecast } from './openweather.js';


document.addEventListener('DOMContentLoaded', async () => {
  // Insert countries data list
  /**
   * @type {Array[Object]}
   */
  const countriesData = await getAllCountries();
  const dataListCountries = document.getElementById('dataListCountries');
  countriesData.forEach((countryData) => {
    const optionCountry = document.createElement('option');
    optionCountry.value = countryData.country;
    dataListCountries.appendChild(optionCountry);
  });

  // Define country ISO variable
  /**
   * @type {Promise}
   */
  let countryCodesPromise;

  // Insert country's cities data list
  document
    .getElementById('inputCountry')
    .addEventListener('input', async (e) => {
      if (!countriesData.some((countryData) => countryData.country === e.data))
        return;
      const countryName = e.data.toLowerCase();
      countryCodesPromise = getCountryISO(countryName);
      const citiesData = await getAllCitiesOfCountry(countryName);
      const dataListCities = document.getElementById('dataListCities');
      dataListCities.innerHTML = '';
      citiesData &&
        citiesData?.forEach((cityName) => {
          const optionCity = document.createElement('option');
          optionCity.value = cityName;
          dataListCities.appendChild(optionCity);
        });
    });

  // Insert openWeather API petition
  document
    .getElementById('askLaundryBuddyForm')
    .addEventListener('submit', async (e) => {
      e.preventDefault();

      // Read city's name
      const cityName = e.target
        .querySelector('input[name=cityName]')
        .value.toLowerCase();

      // Await for country's name to be converted to ISO
      const countryCodes = await countryCodesPromise;
      const countryCoordinates = await getCityCoordinates({
        cityName: cityName,
        countryCode: countryCodes.Iso2,
      });
      console.log(countryCoordinates);

      const forecast = get5dayWeatherForecast(
        countryCoordinates.latitude,
        countryCoordinates.longitude
      );
      console.log(await forecast);
    });
});
