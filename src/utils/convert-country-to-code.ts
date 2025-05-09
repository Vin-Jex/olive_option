import Country from "iso-3166-1";

export function convertTo3LetterCountryCode(input: string): string | null {
  let info = Country.whereAlpha3(input);
  if (!info) {
    info = Country.whereAlpha2(input);
  }
  if (!info) {
    info = Country.whereCountry(input);
  }
  return info ? info.alpha3 : null;
}
