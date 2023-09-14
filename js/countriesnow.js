import { getJSON } from './petitionManager.js';

async function getAllCountries() {
  const apiResponseJSON = await getJSON(
    'https://countriesnow.space/api/v0.1/countries'
  );
  return apiResponseJSON.data;
}

export { getAllCountries };
