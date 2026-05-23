#!/usr/bin/env npx ts-node
/**
 * Generates the country select options for admin/jsonConfig.json from date-holidays.
 * Run when updating the date-holidays dependency to refresh country/state/region lists.
 *
 * Usage: npx ts-node scripts/generate-country-data.ts
 */
import Holidays from "date-holidays";
import * as fs from "node:fs";
import * as path from "node:path";

interface SelectOption {
  label: string | Record<string, string>;
  value: string;
}

const hd = new Holidays();
const countries = hd.getCountries();

const countryOptions: SelectOption[] = [{ label: { en: "— Select country —", de: "— Land wählen —" }, value: "" }];

const sorted = Object.entries(countries).sort((a, b) => a[1].localeCompare(b[1]));
for (const [code, name] of sorted) {
  countryOptions.push({ label: `${name} (${code})`, value: code });
}

const countriesWithStates: string[] = [];
for (const cc of Object.keys(countries)) {
  const states = hd.getStates(cc);
  if (states && Object.keys(states).length > 0) {
    countriesWithStates.push(cc);
  }
}

const jsonConfigPath = path.join(__dirname, "..", "admin", "jsonConfig.json");
const jsonConfig = JSON.parse(fs.readFileSync(jsonConfigPath, "utf-8"));

jsonConfig.items.tab_region.items.country.options = countryOptions;

const stateHidden = `![${countriesWithStates.map(c => JSON.stringify(c)).join(",")}].includes(data.country)`;
jsonConfig.items.tab_region.items.state.hidden = stateHidden;
jsonConfig.items.tab_region.items.region.hidden = `${stateHidden} || !data.state`;

fs.writeFileSync(jsonConfigPath, JSON.stringify(jsonConfig, null, 2) + "\n");

console.log(`Updated jsonConfig.json: ${countryOptions.length} countries, ${countriesWithStates.length} with states`);
