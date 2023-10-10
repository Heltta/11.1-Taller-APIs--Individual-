import { getAllCountries, getAllCitiesOfCountry } from './countriesnow.js';

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
  // Insert country's cities data list
  document
    .getElementById('inputCountry')
    .addEventListener('input', async (e) => {
      if (!countriesData.some((countryData) => countryData.country === e.data))
        return;
      const citiesData = await getAllCitiesOfCountry(e.data.toLowerCase());
      const dataListCities = document.getElementById('dataListCities');
      dataListCities.innerHTML = '';
      citiesData &&
        citiesData?.forEach((cityName) => {
          const optionCity = document.createElement('option');
          optionCity.value = cityName;
          dataListCities.appendChild(optionCity);
        });
    });
});
