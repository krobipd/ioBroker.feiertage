# ioBroker.feiertage

[![npm version](https://img.shields.io/npm/v/iobroker.feiertage)](https://www.npmjs.com/package/iobroker.feiertage)
![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/iobroker.feiertage)](https://www.npmjs.com/package/iobroker.feiertage)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?logo=ko-fi)](https://ko-fi.com/krobipd)
[![PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/krobipd)

<img src="admin/feiertage.svg" width="100" />

Detects public holidays for 206 countries. Runs completely offline — no cloud, no API calls. Updates daily at midnight via ioBroker schedule mode.

Holiday data provided by [date-holidays](https://github.com/commenthol/date-holidays) (ISC + CC-BY-SA-3.0).

---

## Features

- **206 countries** with state/province and region support
- **Fully offline** — all holiday data is bundled, no internet required
- **5 holiday types** — public, bank, school, optional, observance (configurable)
- **Bridge day detection** — detects working days between holidays and weekends
- **Exclude individual holidays** — remove specific holidays by ID
- **Localized holiday names** — follows system language with English fallback
- **Schedule mode** — runs once daily at midnight, no daemon

## Requirements

- ioBroker js-controller >= 7.0.7
- Admin >= 7.8.23
- Node.js >= 22

## Configuration

### Tab 1 — Region

| Setting          | Description                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Country          | Select from 206 countries                                                                 |
| State / Province | State code (e.g. `BY` for Bayern, `ZH` for Zürich) — only shown for countries with states |
| Region           | Region code — only shown when a state is selected                                         |

Start the adapter once and check the log to see available state/region codes for your country.

### Tab 2 — Holidays

| Setting              | Description                                     |
| -------------------- | ----------------------------------------------- |
| Public holidays      | Official public/national holidays (default: on) |
| Bank holidays        | Bank holidays                                   |
| School holidays      | School holidays                                 |
| Optional holidays    | Optional/discretionary holidays                 |
| Observance days      | Observance/memorial days                        |
| Detect bridge days   | Adds bridge days between holidays and weekends  |
| Excluded holiday IDs | Holiday IDs to exclude from detection           |

The adapter logs all available holiday IDs at startup. Use these IDs for the exclude list.

## State Tree

```
feiertage.0.
├── today.
│   ├── name         string    "Karfreitag" / "Good Friday"
│   ├── id           string    "goodFriday" (language-independent)
│   ├── boolean      boolean   true / false
│   ├── region       string    "DE-BY" (empty if national)
│   └── type         string    "public" / "bank" / ...
├── yesterday.
│   ├── name         string
│   ├── id           string
│   ├── boolean      boolean
│   ├── region       string
│   └── type         string
├── tomorrow.
│   ├── name         string
│   ├── id           string
│   ├── boolean      boolean
│   ├── region       string
│   └── type         string
├── dayAfterTomorrow.
│   ├── name         string
│   ├── id           string
│   ├── boolean      boolean
│   ├── region       string
│   └── type         string
└── next.
    ├── name         string    next holiday name (localized)
    ├── id           string    next holiday ID
    ├── boolean      boolean   always true (it's a holiday)
    ├── region       string    region code
    ├── type         string    holiday type
    ├── date         string    "2026-12-25" (ISO date)
    └── duration     number    days until holiday
```

When no holiday applies (e.g. today is not a holiday), the channel states are empty strings / false / 0.

## Bridge Day Algorithm

A bridge day is a working day (Monday–Friday) between a holiday and a weekend:

- Holiday on **Thursday** → Friday is a bridge day
- Holiday on **Tuesday** → Monday is a bridge day
- Holiday on **Wednesday** → no bridge day (two days missing)

Bridge days appear in the state tree with `type: "bridge"` and `name: "Bridge day"`.

## Troubleshooting

**No states after first start** — Open adapter settings and select a country. The adapter terminates with error code 11 if no country is configured.

**Wrong holidays / missing regional holidays** — Check that state/province code matches your location. The adapter logs all detected holidays and their IDs at startup (info level).

**Holiday not detected** — Some holidays are classified as `observance` rather than `public`. Enable the observance type in the holiday settings if needed.

## Changelog

### 0.1.0 (2026-05-21)

- Initial release — offline holiday detection for 206 countries with bridge day support

Older entries are in [CHANGELOG_OLD.md](CHANGELOG_OLD.md).

## Support Development

If you find this adapter useful:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?logo=ko-fi)](https://ko-fi.com/krobipd)
[![PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/krobipd)

## License

MIT License

Copyright (c) 2026 krobi <krobi@power-dreams.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*Developed with assistance from Claude.ai*
