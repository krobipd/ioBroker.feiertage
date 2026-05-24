#!/usr/bin/env npx tsx
import Holidays from "date-holidays";
import * as fs from "node:fs";
import * as path from "node:path";
import { toHolidayId } from "../src/lib/holiday-engine";

interface SelectOption {
  label: string | Record<string, string>;
  value: string;
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type Items = Record<string, JsonValue>;

const hd = new Holidays();
const countries = hd.getCountries();

const countryOptions: SelectOption[] = [{ label: { en: "— Select country —", de: "— Land wählen —" }, value: "" }];
for (const [code, name] of Object.entries(countries).sort((a, b) => a[1].localeCompare(b[1]))) {
  countryOptions.push({ label: `${name} (${code})`, value: code });
}

const statePanels: Items = {};
const regionPanels: Items = {};

for (const cc of Object.keys(countries)) {
  const states = hd.getStates(cc);
  if (!states || Object.keys(states).length === 0) continue;

  const stateOptions: SelectOption[] = [{ label: { en: "— (none) —", de: "— (keines) —" }, value: "" }];

  for (const [code, name] of Object.entries(states).sort((a, b) => (a[1] as string).localeCompare(b[1] as string))) {
    stateOptions.push({ label: `${name} (${code})`, value: code });

    const regions = hd.getRegions(cc, code);
    if (regions && Object.keys(regions).length > 0) {
      const regionOptions: SelectOption[] = [{ label: { en: "— (none) —", de: "— (keine) —" }, value: "" }];
      for (const [rc, rn] of Object.entries(regions).sort((a, b) => (a[1] as string).localeCompare(b[1] as string))) {
        regionOptions.push({ label: `${rn} (${rc})`, value: rc });
      }
      regionPanels[`_regionPanel_${cc}_${code}`] = {
        type: "panel",
        hidden: `data.country !== '${cc}' || data.state !== '${code}'`,
        items: {
          region: {
            type: "select",
            label: "label_region",
            options: regionOptions,
            xs: 12,
            sm: 12,
            md: 4,
            lg: 4,
            xl: 4,
          },
        },
      };
    }
  }

  statePanels[`_statePanel_${cc}`] = {
    type: "panel",
    hidden: `data.country !== '${cc}'`,
    items: {
      state: {
        type: "select",
        label: "label_state",
        options: stateOptions,
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },
  };
}

const excludePanels: Items = {};
const year = new Date().getFullYear();

for (const cc of Object.keys(countries)) {
  const allHolidays = new Map<string, string>();

  const hdNational = new Holidays(cc);
  for (const h of hdNational.getHolidays(year)) {
    allHolidays.set(toHolidayId(h.name, h.rule), h.name);
  }

  const states = hd.getStates(cc);
  if (states) {
    for (const st of Object.keys(states)) {
      const hdState = new Holidays(cc, st);
      for (const h of hdState.getHolidays(year)) {
        const id = toHolidayId(h.name, h.rule);
        if (!allHolidays.has(id)) allHolidays.set(id, h.name);
      }

      const regions = hd.getRegions(cc, st);
      if (regions) {
        for (const rg of Object.keys(regions)) {
          const hdRegion = new Holidays(cc, st, rg);
          for (const h of hdRegion.getHolidays(year)) {
            const id = toHolidayId(h.name, h.rule);
            if (!allHolidays.has(id)) allHolidays.set(id, h.name);
          }
        }
      }
    }
  }

  if (allHolidays.size === 0) continue;

  const options = Array.from(allHolidays.entries())
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([id, name]) => ({ label: `${name} (${id})`, value: id }));

  excludePanels[`_excludePanel_${cc}`] = {
    type: "panel",
    hidden: `data.country !== '${cc}'`,
    items: {
      excludeHolidays: {
        type: "select",
        multiple: true,
        label: "label_excludeHolidays",
        options,
        xs: 12,
        sm: 12,
        md: 8,
        lg: 8,
        xl: 8,
      },
    },
  };
}

const jsonConfig = {
  i18n: true,
  type: "tabs",
  items: {
    tab_region: {
      type: "panel",
      label: "tab_region",
      items: {
        country: {
          type: "select",
          label: "label_country",
          help: "help_country",
          options: countryOptions,
          xs: 12,
          sm: 12,
          md: 6,
          lg: 4,
          xl: 4,
        },
        ...statePanels,
        ...regionPanels,
      },
    },
    tab_holidays: {
      type: "panel",
      label: "tab_holidays",
      items: {
        _headerTypes: {
          type: "header",
          size: 5,
          text: "header_types",
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
        },
        typePublic: {
          type: "checkbox",
          label: "label_typePublic",
          xs: 12,
          sm: 6,
          md: 4,
          lg: 2,
          xl: 2,
        },
        typeBank: {
          type: "checkbox",
          label: "label_typeBank",
          xs: 12,
          sm: 6,
          md: 4,
          lg: 2,
          xl: 2,
        },
        typeSchool: {
          type: "checkbox",
          label: "label_typeSchool",
          xs: 12,
          sm: 6,
          md: 4,
          lg: 2,
          xl: 2,
        },
        typeOptional: {
          type: "checkbox",
          label: "label_typeOptional",
          xs: 12,
          sm: 6,
          md: 4,
          lg: 2,
          xl: 2,
        },
        typeObservance: {
          type: "checkbox",
          label: "label_typeObservance",
          xs: 12,
          sm: 6,
          md: 4,
          lg: 2,
          xl: 2,
        },
        _headerBridge: {
          type: "header",
          size: 5,
          text: "header_bridge",
          newLine: true,
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
        },
        includeBridgeDays: {
          type: "checkbox",
          label: "label_includeBridgeDays",
          help: "help_includeBridgeDays",
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6,
          xl: 6,
        },
        _headerExclude: {
          type: "header",
          size: 5,
          text: "header_exclude",
          newLine: true,
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
        },
        _helpExclude: {
          type: "staticText",
          text: "help_exclude",
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
        },
        ...excludePanels,
      },
    },
  },
};

const jsonConfigPath = path.join(__dirname, "..", "admin", "jsonConfig.json");
fs.writeFileSync(jsonConfigPath, JSON.stringify(jsonConfig, null, 2) + "\n");

const stats = {
  countries: countryOptions.length - 1,
  statePanels: Object.keys(statePanels).length,
  regionPanels: Object.keys(regionPanels).length,
  excludePanels: Object.keys(excludePanels).length,
};
console.log(
  `Updated jsonConfig.json: ${stats.countries} countries, ` +
    `${stats.statePanels} state panels, ${stats.regionPanels} region panels, ` +
    `${stats.excludePanels} exclude panels`,
);
