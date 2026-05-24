# ioBroker.public-holidays

[![npm version](https://img.shields.io/npm/v/iobroker.public-holidays)](https://www.npmjs.com/package/iobroker.public-holidays)
![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/iobroker.public-holidays)](https://www.npmjs.com/package/iobroker.public-holidays)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?logo=ko-fi)](https://ko-fi.com/krobipd)
[![PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/krobipd)

<img src="admin/public-holidays.svg" width="100" />

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

| Setting          | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| Country          | Select from 206 countries                                         |
| State / Province | Dropdown — only shown for countries with states (e.g. DE, CH, US) |
| Region           | Dropdown — only shown when the selected state has regions         |

### Tab 2 — Holidays

| Setting            | Description                                     |
| ------------------ | ----------------------------------------------- |
| Public holidays    | Official public/national holidays (default: on) |
| Bank holidays      | Bank holidays                                   |
| School holidays    | School holidays                                 |
| Optional holidays  | Optional/discretionary holidays                 |
| Observance days    | Observance/memorial days                        |
| Detect bridge days | Adds bridge days between holidays and weekends  |
| Excluded holidays  | Select holidays to exclude from detection       |

## State Tree

```
public-holidays.0.
├── today.
│   ├── name         string    "Karfreitag" / "Good Friday"
│   ├── id           string    "goodFriday" (language-independent)
│   └── boolean      boolean   true / false
├── yesterday.
│   ├── name         string
│   ├── id           string
│   └── boolean      boolean
├── tomorrow.
│   ├── name         string
│   ├── id           string
│   └── boolean      boolean
├── dayAfterTomorrow.
│   ├── name         string
│   ├── id           string
│   └── boolean      boolean
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

**Wrong holidays / missing regional holidays** — Check that the correct state/province is selected. The adapter logs all detected holidays at startup (info level).

**Holiday not detected** — Some holidays are classified as `observance` rather than `public`. Enable the observance type in the holiday settings if needed.

## Changelog

### 0.1.5 (2026-05-23)

- Changelog rewritten in user-centric style.

### 0.1.4 (2026-05-23)

- Fixed admin checkbox layout on small screens

### 0.1.3 (2026-05-23)

- Internal cleanup. No user-facing changes.

### 0.1.2 (2026-05-22)

- User-modified state names are no longer overwritten on adapter restart

### 0.1.1 (2026-05-21)

- Improved error handling and stability.

Older entries are in [CHANGELOG_OLD.md](CHANGELOG_OLD.md).

## Support

- [GitHub Issues](https://github.com/krobipd/ioBroker.public-holidays/issues) — bug reports, feature requests
- [ioBroker Forum](https://forum.iobroker.net/) — general questions

### Support Development

This adapter is free and open source. If you find it useful, consider buying me a coffee:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/krobipd)
[![PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=for-the-badge)](https://paypal.me/krobipd)

---

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

_Developed with assistance from Claude.ai_
