import {
  getAllCountries,
  getAllCitiesOfCountry,
  getCountryISO,
} from './countriesnow.js';
import {
  getCityCoordinates,
  get5dayWeatherForecast,
  calculateLaundrySafety,
} from './openweather.js';
import { createAlert } from './domElementCreator.js';

/**
 * @type {Element}
 */

const reportContainer = document.getElementById('reportContainer');

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

  const inputCountryListener = async (countryName) => {
    countryName = countryName.toLowerCase();
    if (
      !countriesData.some(
        (countryData) => countryData.country.toLowerCase() === countryName
      )
    )
      return;
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
  };

  // Insert country's cities data list
  document
    .getElementById('inputCountry')
    .addEventListener('input', async (e) => {
      inputCountryListener(e.data);
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

      // Async get country ISO if promise is not made
      if (!countryCodesPromise)
        inputCountryListener(document.getElementById('inputCountry').value);

      // Await for country's name to be converted to ISO
      const countryCodes = await countryCodesPromise;
      const countryCoordinates = await getCityCoordinates({
        cityName: cityName,
        countryCode: countryCodes.Iso2,
      });
      console.log(countryCoordinates);

      const forecast = await get5dayWeatherForecast(
        countryCoordinates.latitude,
        countryCoordinates.longitude
      );
      console.log(forecast);
      /**
       * @typedef LaundrySafetyReport
       * @property {'green'|'yellow'|'orange'|'red'} safetyColor
       * @property {Number} safetyScore
       * @property {String} message
       * @property {Number} dt - Time of data forecasted, unix, UTC
       */

      /**
       * @type {Array<LaundrySafetyReport>}
       */
      const laundryReportList = [];
      forecast.list.forEach((timePeriod) =>
        laundryReportList.push(calculateLaundrySafety(timePeriod))
      );
      console.log(laundryReportList);

      laundryReportList.forEach((report) => {
        reportContainer.append(
          createAlert(
            'primary',
            report.message,
            report.safetyColor,
            new Date(report.dt * 1000)
          )
        );
      });
    });
});
