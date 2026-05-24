# CLAUDE.md — ioBroker.public-holidays

> Gemeinsame ioBroker-Wissensbasis: `../CLAUDE.md` (lokal, nicht im Git). Standards dort, Projekt-Spezifisches hier.

## Projekt

**ioBroker Public Holidays** — Offline-Feiertagserkennung für 206 Länder mit Brückentag-Support. Schedule-Mode: startet täglich um Mitternacht, berechnet, schreibt States, terminiert.

- **Version:** 0.2.0 (released 2026-05-24, UX overhaul: dropdown selects for state/region/exclude, slim state tree, country auto-detect). Vorgänger **0.1.5** changelog user-centric rewrite. **0.1.4** Repochecker compliance. **0.1.3** i18n migration. **0.1.2** Preserve user-modified state names. npm-Zugang erhalten 2026-05-24.
- **GitHub:** https://github.com/krobipd/ioBroker.public-holidays
- **npm:** `iobroker.public-holidays` — Zugang erhalten 2026-05-24
- **Runtime-Deps:** `@iobroker/adapter-core`, `date-holidays` (^3.30.1, ISC + CC-BY-SA-3.0)
- **Test-Setup:** Tests unter `src/**/*.test.ts` via **vitest**. `test/package.js` + `test/integration.js` bleiben mocha.
- **`@types/node` an `engines.node`-Min gekoppelt:** `^22` weil `engines.node: ">=22"`

## Architektur

```
src/main.ts                        → Adapter (onReady → compute → publish → terminate)
src/lib/
├── holiday-engine.ts              → date-holidays Wrapper, Type-Filter, Brückentag-Algo
├── holiday-engine.test.ts         → 72 Tests
├── state-publisher.ts             → ComputedHolidays → ioBroker States
├── state-publisher.test.ts        → 22 Tests
├── i18n.ts                        → tName(key) Wrapper über I18n.getTranslatedObject() + system.config.language Lookup + EN-Fallback
├── i18n.test.ts                   → 19 Tests (tName delegation + i18n completeness + resolveLanguages)
├── types.ts                       → AdapterConfig, DayInfo, NextHoliday, ComputedHolidays
└── coerce.ts                      → errText
admin/
├── jsonConfig.json                → 2 Tabs (Region + Holidays), generiert durch generate-country-data.ts
├── i18n/<lang>.json               → Single-Source-of-Truth für UI- + State-Translations (32 Keys × 11 Sprachen)
├── public-holidays.svg            → Icon (SVG 256×256, transparent)
scripts/
├── generate-country-data.ts       → Regeneriert jsonConfig: 206 Countries, 35 State-Panels, 29 Region-Panels, 206 Exclude-Panels
../scripts/sync-iopackage-from-i18n.py → regeneriert io-package.json:instanceObjects.common.name aus admin/i18n/ (zentral, source: admin-i18n)
```

## Design-Entscheidungen

1. **Schedule-Mode statt Daemon** — Feiertage ändern sich nicht untertags. `0 0 * * *` reicht.
2. **date-holidays als einzige Engine** — 206 Länder, offline, stabile API seit 5+ Jahren, ISC-Lizenz
3. **Panel-per-Country Dropdowns** — Schedule-Adapter läuft nicht wenn Admin offen → Country/State/Region/Exclude als statische Selects, per-Country Panels mit hidden-Condition
4. **Individuelle Type-Booleans in native** statt `holidayTypes: string[]` — sauberes jsonConfig-Mapping (5 Checkboxen)
5. **referenceDate-Parameter** in computeHolidays — deterministische Tests ohne Mocking
6. **Brückentag nur Do→Fr und Di→Mo** — Mi→Wochenende braucht 2 Fehltage, kein Brückentag

## State Tree

4 Day-Channels × 3 Fields + next × 5 Fields = 17 States total. Day-Channels (today, yesterday, tomorrow, dayAfterTomorrow): name, id, boolean. Next: name, id, boolean, date, duration.

## Tests (111 unit + 57 package = 168)

Test-Breakdown: holiday-engine 72, state-publisher 20, i18n 19.

```
src/lib/holiday-engine.test.ts    → 72: DE/CH/AT/IT holidays, type filter, exclude, bridge days, localization
src/lib/state-publisher.test.ts   → 20: ensureObjects, publishStates, preserve option (mock adapter)
src/lib/i18n.test.ts              → 19: tName delegation + i18n completeness (11 languages, identical keysets) + resolveLanguages
test/package.js                   → 57: @iobroker/testing packageFiles
test/integration.js               → @iobroker/testing integration (CI only)
```

## Versionshistorie

| Version | Highlights                                                                                                                                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.2.0   | **UX Overhaul.** Dropdown-Selects für State/Region/Exclude (per-type), Country auto-detect, State Tree 27→17 States. Panel-per-Country Pattern. 32 i18n Keys.                                                                  |
| 0.1.5   | Changelog user-centric rewrite (README + io-package.json news audited against Hard-Negativ-Liste).                                                                                                                              |
| 0.1.4   | Repochecker compliance: admin checkbox responsive sizes (E5507), next.date role (W1132), node: imports (S5043).                                                                                                                 |
| 0.1.3   | **i18n-Migration auf adapter-core.** Private `i18n-states.ts` durch `I18n.getTranslatedObject()` ersetzt, admin/i18n von Unterordner-Pattern auf flat `<lang>.json` migriert (32 Keys = 20 UI + 12 State-Names). Tests 109→113. |
| 0.1.2   | Preserve user-modified state names on restart (mcm1957 feedback).                                                                                                                                                               |
| 0.1.1   | Community-standard event handler pattern (.bind + try/catch).                                                                                                                                                                   |
| 0.1.0   | Initial release: 206 countries, bridge days, exclude by ID, 11-language admin.                                                                                                                                                  |

## Befehle

```bash
npm run build         # Production (esbuild)
npm test              # vitest + @iobroker/testing packageFiles
npm run coverage      # vitest run --coverage
npm run lint          # ESLint
npm run format:check  # Prettier --check
npm run check         # tsc --noEmit
```
