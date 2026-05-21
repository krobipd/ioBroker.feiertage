# CLAUDE.md — ioBroker.feiertage

> Gemeinsame ioBroker-Wissensbasis: `../CLAUDE.md` (lokal, nicht im Git). Standards dort, Projekt-Spezifisches hier.

## Projekt

**ioBroker Feiertage** — Offline-Feiertagserkennung für 206 Länder mit Brückentag-Support. Schedule-Mode: startet täglich um Mitternacht, berechnet, schreibt States, terminiert.

- **Version:** 0.1.1 (2026-05-21, community handler pattern, Tag + GitHub Release, kein npm)
- **GitHub:** https://github.com/krobipd/ioBroker.feiertage
- **npm:** blockiert bis mcm-Entscheidung — Release ohne npm wie NUT
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
├── state-publisher.test.ts        → 20 Tests
├── i18n.ts                        → system.config.language Lookup + EN-Fallback
├── i18n.test.ts                   → 15 Tests
├── i18n-states.ts                 → 11-Sprachen State-Name-Translations
├── types.ts                       → AdapterConfig, DayInfo, NextHoliday, ComputedHolidays
└── coerce.ts                      → errText
admin/
├── jsonConfig.json                → 2 Tabs (Region + Holidays), 206 Country-Dropdown
├── i18n/<11 langs>/translations.json
├── feiertage.svg                  → Icon (SVG 256×256, transparent)
scripts/
├── generate-country-data.ts       → Regeneriert Country-Optionen in jsonConfig aus date-holidays
```

## Design-Entscheidungen

1. **Schedule-Mode statt Daemon** — Feiertage ändern sich nicht untertags. `0 0 * * *` reicht.
2. **date-holidays als einzige Engine** — 206 Länder, offline, stabile API seit 5+ Jahren, ISC-Lizenz
3. **Keine sendTo-Dropdowns** — Schedule-Adapter läuft nicht wenn Admin offen → Country als statischer Select (206 Optionen), State/Region als Text mit Log-Hinweis
4. **Individuelle Type-Booleans in native** statt `holidayTypes: string[]` — sauberes jsonConfig-Mapping (5 Checkboxen)
5. **referenceDate-Parameter** in computeHolidays — deterministische Tests ohne Mocking
6. **Brückentag nur Do→Fr und Di→Mo** — Mi→Wochenende braucht 2 Fehltage, kein Brückentag

## State Tree

5 Channels × 5 States + next.date + next.duration = 27 States total. Channels: today, yesterday, tomorrow, dayAfterTomorrow, next. Fields: name (localized), id (stable), boolean, region, type.

## Tests (107 unit + 57 package = 164)

```
src/lib/holiday-engine.test.ts    → 72: DE/CH/AT/IT holidays, type filter, exclude, bridge days, localization
src/lib/state-publisher.test.ts   → 20: ensureObjects, publishStates (mock adapter)
src/lib/i18n.test.ts              → 15: resolveLanguages, EN-Fallback
test/package.js                   → 57: @iobroker/testing packageFiles
test/integration.js               → @iobroker/testing integration (CI only)
```

## Versionshistorie

- **0.1.1** (2026-05-21) — Community-standard event handler pattern (.bind + try/catch)
- **0.1.0** (2026-05-21) — Initial release: 206 countries, bridge days, exclude by ID, 11-language admin

## Befehle

```bash
npm run build         # Production (esbuild)
npm test              # vitest + @iobroker/testing packageFiles
npm run coverage      # vitest run --coverage
npm run lint          # ESLint
npm run format:check  # Prettier --check
npm run check         # tsc --noEmit
```
