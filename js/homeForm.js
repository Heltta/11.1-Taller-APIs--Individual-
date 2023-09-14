import { getAllCountries } from './countriesnow.js';

document.addEventListener('DOMContentLoaded', async () => {
  const countriesData = await getAllCountries();
  const dataListCountries = document.getElementById('dataListCountries');
  countriesData.forEach((countryData) => {
    const optionCountry = document.createElement('option');
    optionCountry.value = countryData.country;
    dataListCountries.appendChild(optionCountry);
  });
});
