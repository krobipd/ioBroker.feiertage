# CLAUDE.md — ioBroker.feiertage

> Gemeinsame ioBroker-Wissensbasis: `../CLAUDE.md` (lokal, nicht im Git). Standards dort, Projekt-Spezifisches hier.

## Projekt

**ioBroker Feiertage** — Offline-Feiertagserkennung für 206 Länder mit Brückentag-Support. Schedule-Mode: startet täglich um Mitternacht, berechnet, schreibt States, terminiert.

- **Version:** 0.1.4 (2026-05-23, Fixed admin checkbox responsiveness E5507, state role W1132, node: imports S5043). Vorgänger **0.1.3** (2026-05-23, State names use adapter-core I18n framework — replaces private `i18n-states.ts` with `I18n.getTranslatedObject()`, admin/i18n migrated from subdirectories to flat `<lang>.json` files). Vorgänger **0.1.2** (2026-05-22) — Preserve user-modified state names on restart.
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
├── state-publisher.test.ts        → 22 Tests
├── i18n.ts                        → tName(key) Wrapper über I18n.getTranslatedObject() + system.config.language Lookup + EN-Fallback
├── i18n.test.ts                   → 19 Tests (tName delegation + i18n completeness + resolveLanguages)
├── types.ts                       → AdapterConfig, DayInfo, NextHoliday, ComputedHolidays
└── coerce.ts                      → errText
admin/
├── jsonConfig.json                → 2 Tabs (Region + Holidays), 206 Country-Dropdown
├── i18n/<lang>.json               → Single-Source-of-Truth für UI- + State-Translations (32 Keys × 11 Sprachen)
├── feiertage.svg                  → Icon (SVG 256×256, transparent)
scripts/
├── generate-country-data.ts       → Regeneriert Country-Optionen in jsonConfig aus date-holidays
../scripts/sync-iopackage-from-i18n.py → regeneriert io-package.json:instanceObjects.common.name aus admin/i18n/ (zentral, source: admin-i18n)
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

## Tests (113 unit + 57 package = 170)

```
src/lib/holiday-engine.test.ts    → 72: DE/CH/AT/IT holidays, type filter, exclude, bridge days, localization
src/lib/state-publisher.test.ts   → 22: ensureObjects, publishStates, preserve option (mock adapter)
src/lib/i18n.test.ts              → 19: tName delegation + i18n completeness (11 languages, identical keysets) + resolveLanguages
test/package.js                   → 57: @iobroker/testing packageFiles
test/integration.js               → @iobroker/testing integration (CI only)
```

## Versionshistorie

| Version | Highlights |
|---------|------------|
| 0.1.4 | Repochecker compliance: admin checkbox responsive sizes (E5507), next.date role (W1132), node: imports (S5043). |
| 0.1.3 | **i18n-Migration auf adapter-core.** Private `i18n-states.ts` durch `I18n.getTranslatedObject()` ersetzt, admin/i18n von Unterordner-Pattern auf flat `<lang>.json` migriert (32 Keys = 20 UI + 12 State-Names). Tests 109→113. |
| 0.1.2 | Preserve user-modified state names on restart (mcm1957 feedback). |
| 0.1.1 | Community-standard event handler pattern (.bind + try/catch). |
| 0.1.0 | Initial release: 206 countries, bridge days, exclude by ID, 11-language admin. |

## Befehle

```bash
npm run build         # Production (esbuild)
npm test              # vitest + @iobroker/testing packageFiles
npm run coverage      # vitest run --coverage
npm run lint          # ESLint
npm run format:check  # Prettier --check
npm run check         # tsc --noEmit
```
