import { countries } from "./countries.js";
import { state } from "./state.js";

export function applyCountry(countryKey){

  const country = countries[countryKey];

  state.settings.country = countryKey;
  state.settings.currency = country.currency;
  state.settings.locale = country.locale;
  state.settings.language = country.language;

}