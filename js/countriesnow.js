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
  console.log(apiResponseJSON);
  return apiResponseJSON.data;
}
export { getAllCountries, getAllCitiesOfCountry };
