import { getJSON, postJSON } from './petitionManager.js';

async function getAllCountries() {
  const apiResponseJSON = await getJSON(
    'https://countriesnow.space/api/v0.1/countries'
  );
  return apiResponseJSON.data;
}

async function getAllCitiesOfCountry(countryName) {
  const apiResponseJSON = await postJSON(
    'https://countriesnow.space/api/v0.1/countries/cities',
    {
      country: countryName,
    }
  );
  return apiResponseJSON.data;
}

async function getCountryISO(countryName) {
  const apiResponseJSON = await postJSON(
    'https://countriesnow.space/api/v0.1/countries/iso',
    {
      country: countryName,
    }
  );
  return apiResponseJSON.data;
}

export { getAllCountries, getAllCitiesOfCountry, getCountryISO };
