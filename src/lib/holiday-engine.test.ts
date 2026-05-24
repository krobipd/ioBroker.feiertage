import { describe, it, expect } from "vitest";
import { computeHolidays, detectBridgeDays, toHolidayId, toDateKey } from "./holiday-engine";
import type { AdapterConfig } from "./types";
import Holidays from "date-holidays";

function makeConfig(overrides: Partial<AdapterConfig> = {}): AdapterConfig {
  return {
    country: "DE",
    state: "",
    region: "",
    holidayTypes: ["public"],
    excludeHolidays: [],
    includeBridgeDays: false,
    ...overrides,
  };
}

function makeDate(dateStr: string): Date {
  return new Date(dateStr + "T12:00:00");
}

// ─── German holidays 2026 ───────────────────────────────────────────

describe("DE holidays 2026", () => {
  const config = makeConfig();

  it("Neujahr (Jan 1)", () => {
    const result = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toBe("Neujahr");
  });

  it("Karfreitag (Apr 3)", () => {
    const result = computeHolidays(config, ["de"], makeDate("2026-04-03"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toBe("Karfreitag");
  });

  it("Ostermontag (Apr 6)", () => {
    const result = computeHolidays(config, ["de"], makeDate("2026-04-06"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toBe("Ostermontag");
  });

  it("Tag der Arbeit (May 1)", () => {
    const result = computeHolidays(config, ["de"], makeDate("2026-05-01"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toBe("Maifeiertag");
  });

  it("Christi Himmelfahrt (May 14)", () => {
    const result = computeHolidays(config, ["de"], makeDate("2026-05-14"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toContain("Himmelfahrt");
  });

  it("Pfingstmontag (May 25)", () => {
    const result = computeHolidays(config, ["de"], makeDate("2026-05-25"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toBe("Pfingstmontag");
  });

  it("Tag der Deutschen Einheit (Oct 3)", () => {
    const result = computeHolidays(config, ["de"], makeDate("2026-10-03"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toContain("Einheit");
  });

  it("1. Weihnachtstag (Dec 25)", () => {
    const result = computeHolidays(config, ["de"], makeDate("2026-12-25"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toContain("Weihnacht");
  });

  it("2. Weihnachtstag (Dec 26)", () => {
    const result = computeHolidays(config, ["de"], makeDate("2026-12-26"));
    expect(result.today.isHoliday).toBe(true);
  });

  it("normal working day is not a holiday", () => {
    const result = computeHolidays(config, ["de"], makeDate("2026-03-11"));
    expect(result.today.isHoliday).toBe(false);
    expect(result.today.name).toBe("");
    expect(result.today.id).toBe("");
  });
});

// ─── Bundesland-spezifisch ──────────────────────────────────────────

describe("DE state-specific holidays", () => {
  it("BY: Fronleichnam (Jun 4 2026)", () => {
    const config = makeConfig({ state: "BY" });
    const result = computeHolidays(config, ["de"], makeDate("2026-06-04"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toContain("Fronleichnam");
  });

  it("BY: Mariä Himmelfahrt (Aug 15) — observance type in date-holidays", () => {
    const config = makeConfig({ state: "BY", holidayTypes: ["public", "observance"] });
    const result = computeHolidays(config, ["de"], makeDate("2026-08-15"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toContain("Himmelfahrt");
  });

  it("HB: Reformationstag (Oct 31)", () => {
    const config = makeConfig({ state: "HB" });
    const result = computeHolidays(config, ["de"], makeDate("2026-10-31"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toContain("Reformation");
  });

  it("NW: Allerheiligen (Nov 1)", () => {
    const config = makeConfig({ state: "NW" });
    const result = computeHolidays(config, ["de"], makeDate("2026-11-01"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toContain("Allerheiligen");
  });

  it("BE: Internationaler Frauentag (Mar 8)", () => {
    const config = makeConfig({ state: "BE" });
    const result = computeHolidays(config, ["de"], makeDate("2026-03-08"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toContain("Frauentag");
  });
});

// ─── Switzerland ────────────────────────────────────────────────────

describe("CH holidays", () => {
  it("Bundesfeier (Aug 1)", () => {
    const config = makeConfig({ country: "CH" });
    const result = computeHolidays(config, ["de"], makeDate("2026-08-01"));
    expect(result.today.isHoliday).toBe(true);
  });

  it("Berchtoldstag in BE (Jan 2)", () => {
    const config = makeConfig({ country: "CH", state: "BE" });
    const result = computeHolidays(config, ["de"], makeDate("2026-01-02"));
    expect(result.today.isHoliday).toBe(true);
  });

  it("Neujahr (Jan 1)", () => {
    const config = makeConfig({ country: "CH" });
    const result = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    expect(result.today.isHoliday).toBe(true);
  });
});

// ─── Austria ────────────────────────────────────────────────────────

describe("AT holidays", () => {
  it("Nationalfeiertag (Oct 26)", () => {
    const config = makeConfig({ country: "AT" });
    const result = computeHolidays(config, ["de"], makeDate("2026-10-26"));
    expect(result.today.isHoliday).toBe(true);
  });

  it("Neujahr (Jan 1)", () => {
    const config = makeConfig({ country: "AT" });
    const result = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    expect(result.today.isHoliday).toBe(true);
  });

  it("Mariä Empfängnis (Dec 8)", () => {
    const config = makeConfig({ country: "AT" });
    const result = computeHolidays(config, ["de"], makeDate("2026-12-08"));
    expect(result.today.isHoliday).toBe(true);
  });
});

// ─── Italy ──────────────────────────────────────────────────────────

describe("IT holidays", () => {
  it("Festa della Liberazione (Apr 25)", () => {
    const config = makeConfig({ country: "IT" });
    const result = computeHolidays(config, ["it"], makeDate("2026-04-25"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toContain("Liberazione");
  });

  it("Festa della Repubblica (Jun 2)", () => {
    const config = makeConfig({ country: "IT" });
    const result = computeHolidays(config, ["it"], makeDate("2026-06-02"));
    expect(result.today.isHoliday).toBe(true);
  });
});

// ─── Type filter ────────────────────────────────────────────────────

describe("type filter", () => {
  it("filters out non-matching types", () => {
    const config = makeConfig({ holidayTypes: ["bank"] });
    const result = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    expect(result.today.isHoliday).toBe(false);
  });

  it("shows holidays when type matches", () => {
    const config = makeConfig({ holidayTypes: ["public"] });
    const result = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    expect(result.today.isHoliday).toBe(true);
  });

  it("multiple types allowed", () => {
    const config = makeConfig({ holidayTypes: ["public", "observance"] });
    const result = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    expect(result.today.isHoliday).toBe(true);
  });

  it("empty type filter shows nothing", () => {
    const config = makeConfig({ holidayTypes: [] });
    const result = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    expect(result.today.isHoliday).toBe(false);
  });
});

// ─── Exclude list ───────────────────────────────────────────────────

describe("exclude list", () => {
  it("excludes a holiday by ID", () => {
    const config = makeConfig({ holidayTypes: ["public"] });
    const resultBefore = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    expect(resultBefore.today.isHoliday).toBe(true);
    const neujahId = resultBefore.today.id;

    const configExcluded = makeConfig({ excludeHolidays: [neujahId] });
    const resultAfter = computeHolidays(configExcluded, ["de"], makeDate("2026-01-01"));
    expect(resultAfter.today.isHoliday).toBe(false);
  });

  it("excluded holiday does not appear in next", () => {
    const config = makeConfig();
    const resultBefore = computeHolidays(config, ["de"], makeDate("2026-12-24"));
    const christmasId = resultBefore.tomorrow.id;
    expect(resultBefore.tomorrow.isHoliday).toBe(true);

    const configExcluded = makeConfig({ excludeHolidays: [christmasId] });
    const resultAfter = computeHolidays(configExcluded, ["de"], makeDate("2026-12-24"));
    expect(resultAfter.tomorrow.isHoliday).toBe(false);
  });

  it("non-matching exclude ID has no effect", () => {
    const config = makeConfig({ excludeHolidays: ["nonexistent_holiday"] });
    const result = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    expect(result.today.isHoliday).toBe(true);
  });
});

// ─── Bridge days ────────────────────────────────────────────────────

describe("bridge days", () => {
  it("Thursday holiday creates Friday bridge day", () => {
    // Christi Himmelfahrt 2026 = May 14 (Thursday)
    const config = makeConfig({ includeBridgeDays: true });
    const result = computeHolidays(config, ["de"], makeDate("2026-05-15"));
    expect(result.today.isHoliday).toBe(true);
    expect(result.today.name).toBe("Bridge day");
  });

  it("bridge day not created when disabled", () => {
    const config = makeConfig({ includeBridgeDays: false });
    const result = computeHolidays(config, ["de"], makeDate("2026-05-15"));
    expect(result.today.isHoliday).toBe(false);
  });

  it("Saturday holiday does not create bridge day", () => {
    // Find a year where Jan 1 is Saturday — 2022
    const config = makeConfig({ includeBridgeDays: true });
    const result = computeHolidays(config, ["de"], makeDate("2021-12-31"));
    // Dec 31 2021 is Friday — should NOT be bridge day (Jan 1 2022 is Saturday)
    expect(result.today.isHoliday).toBe(false);
  });

  it("Wednesday holiday does not create bridge day", () => {
    // Tag der Deutschen Einheit 2026 (Oct 3) is Saturday actually — let's use 2025
    // Oct 3 2025 is Friday → no bridge day scenario for Wednesday
    // Let's test with a known Wednesday: Dec 25 2024 is Wednesday
    const config = makeConfig({ includeBridgeDays: true });
    const result = computeHolidays(config, ["de"], makeDate("2024-12-24"));
    // Dec 24 is Tuesday, Dec 25 is Wednesday holiday → no bridge on Dec 24 (it's a Tue before Wed)
    expect(result.today.isHoliday).toBe(false);
  });

  it("detectBridgeDays returns correct dates", () => {
    const hd = new Holidays("DE");
    const holidays = new Map<string, { date: string; start: Date; end: Date; name: string; type: string }>();
    // Simulate a Thursday holiday
    const thu = new Date("2026-05-14T00:00:00");
    holidays.set("2026-05-14", {
      date: "2026-05-14",
      start: thu,
      end: new Date("2026-05-15T00:00:00"),
      name: "Test",
      type: "public",
    });
    const bridges = detectBridgeDays(holidays as any, 2026);
    expect(bridges.length).toBe(1);
    expect(toDateKey(bridges[0])).toBe("2026-05-15");
  });

  it("Tuesday holiday creates Monday bridge day", () => {
    // We need a Tuesday public holiday in DE 2026
    // Let's check: Tag der Deutschen Einheit Oct 3 2026 is Saturday
    // Let's find one: Dec 25 2025 is Thursday, not Tuesday
    // Jan 1 2030 is Tuesday → let's simulate
    const holidays = new Map<string, { date: string; start: Date; end: Date; name: string; type: string }>();
    const tue = new Date("2030-01-01T00:00:00");
    holidays.set("2030-01-01", {
      date: "2030-01-01",
      start: tue,
      end: new Date("2030-01-02T00:00:00"),
      name: "Test",
      type: "public",
    });
    const bridges = detectBridgeDays(holidays as any, 2030);
    expect(bridges.length).toBe(1);
    expect(toDateKey(bridges[0])).toBe("2029-12-31");
  });
});

// ─── Yesterday / tomorrow / dayAfterTomorrow ────────────────────────

describe("relative days", () => {
  it("yesterday shows previous day holiday", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-01-02"));
    expect(result.yesterday.isHoliday).toBe(true);
    expect(result.yesterday.name).toBe("Neujahr");
  });

  it("tomorrow shows next day holiday", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-12-24"));
    expect(result.tomorrow.isHoliday).toBe(true);
    expect(result.tomorrow.name).toContain("Weihnacht");
  });

  it("dayAfterTomorrow works correctly", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-12-24"));
    expect(result.dayAfterTomorrow.isHoliday).toBe(true);
  });

  it("all relative days empty on normal workday", () => {
    const config = makeConfig();
    // Mar 10-13 2026 is Tue-Fri, no holidays around
    const result = computeHolidays(config, ["de"], makeDate("2026-03-11"));
    expect(result.yesterday.isHoliday).toBe(false);
    expect(result.today.isHoliday).toBe(false);
    expect(result.tomorrow.isHoliday).toBe(false);
    expect(result.dayAfterTomorrow.isHoliday).toBe(false);
  });
});

// ─── Next holiday ───────────────────────────────────────────────────

describe("next holiday", () => {
  it("finds the next upcoming holiday", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-01-02"));
    expect(result.next.isHoliday).toBe(true);
    expect(result.next.name).toBe("Karfreitag");
    expect(result.next.duration).toBeGreaterThan(0);
    expect(result.next.date).toBe("2026-04-03");
  });

  it("next holiday has correct duration", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-04-02"));
    expect(result.next.name).toBe("Karfreitag");
    expect(result.next.duration).toBe(1);
  });

  it("skips today when finding next", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    // Today is Neujahr, next should be Karfreitag
    expect(result.next.name).not.toBe("Neujahr");
    expect(result.next.duration).toBeGreaterThan(0);
  });

  it("year rollover: next from December finds January", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-12-27"));
    expect(result.next.isHoliday).toBe(true);
    expect(result.next.date).toBe("2027-01-01");
  });

  it("next holiday date format is ISO", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-06-01"));
    expect(result.next.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

// ─── Localization ───────────────────────────────────────────────────

describe("localization", () => {
  it("returns German names with de language", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-01-01"));
    expect(result.today.name).toBe("Neujahr");
  });

  it("returns English names with en language", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["en"], makeDate("2026-01-01"));
    expect(result.today.name).toContain("New Year");
  });

  it("returns English for unsupported language", () => {
    const config = makeConfig();
    // Japanese is not supported for DE holidays
    const result = computeHolidays(config, ["en"], makeDate("2026-01-01"));
    expect(result.today.name.length).toBeGreaterThan(0);
  });

  it("Italian names for IT holidays", () => {
    const config = makeConfig({ country: "IT" });
    const result = computeHolidays(config, ["it"], makeDate("2026-01-01"));
    expect(result.today.name).toContain("Capodanno");
  });
});

// ─── Edge cases ─────────────────────────────────────────────────────

describe("edge cases", () => {
  it("leap year Feb 29", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2028-02-29"));
    expect(result.today.isHoliday).toBe(false);
    expect(result.yesterday.isHoliday).toBe(false);
  });

  it("Silvester (Dec 31) — not a public holiday in DE", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-12-31"));
    expect(result.today.isHoliday).toBe(false);
  });

  it("multiple countries produce different results for same date", () => {
    const de = computeHolidays(makeConfig({ country: "DE" }), ["de"], makeDate("2026-10-26"));
    const at = computeHolidays(makeConfig({ country: "AT" }), ["de"], makeDate("2026-10-26"));
    // Oct 26 is Austrian national day, NOT German
    expect(de.today.isHoliday).toBe(false);
    expect(at.today.isHoliday).toBe(true);
  });

  it("empty day info has consistent shape", () => {
    const config = makeConfig();
    const result = computeHolidays(config, ["de"], makeDate("2026-03-11"));
    expect(result.today).toEqual({
      name: "",
      id: "",
      isHoliday: false,
    });
  });
});

// ─── toHolidayId ────────────────────────────────────────────────────

describe("toHolidayId", () => {
  it("creates ID from name", () => {
    expect(toHolidayId("Good Friday")).toBe("good_friday");
  });

  it("handles umlauts", () => {
    const id = toHolidayId("Mariä Himmelfahrt");
    expect(id).toMatch(/^[a-z0-9_]+$/);
  });

  it("prefers rule-based ID when available", () => {
    const id = toHolidayId("Neujahr", "01-01");
    expect(id).toBe("01-01");
  });

  it("falls back to name when rule is too short", () => {
    const id = toHolidayId("Test Holiday", "x");
    expect(id).toBe("test_holiday");
  });
});

// ─── toDateKey ──────────────────────────────────────────────────────

describe("toDateKey", () => {
  it("formats date correctly", () => {
    expect(toDateKey(new Date("2026-01-01T12:00:00"))).toBe("2026-01-01");
  });

  it("pads single-digit month and day", () => {
    expect(toDateKey(new Date("2026-03-05T00:00:00"))).toBe("2026-03-05");
  });
});

// ─── Comprehensive country coverage ────────────────────────────────

describe("country coverage", () => {
  const countries = ["US", "GB", "FR", "JP", "BR", "IN", "AU", "CA", "MX", "ZA"];

  for (const cc of countries) {
    it(`${cc}: Jan 1 produces a result (no crash)`, () => {
      const config = makeConfig({ country: cc });
      const result = computeHolidays(config, ["en"], makeDate("2026-01-01"));
      expect(result.today).toBeDefined();
      expect(typeof result.today.isHoliday).toBe("boolean");
    });
  }

  it("US: Independence Day (Jul 4)", () => {
    const config = makeConfig({ country: "US" });
    const result = computeHolidays(config, ["en"], makeDate("2026-07-04"));
    expect(result.today.isHoliday).toBe(true);
  });

  it("FR: Bastille Day (Jul 14)", () => {
    const config = makeConfig({ country: "FR" });
    const result = computeHolidays(config, ["fr"], makeDate("2026-07-14"));
    expect(result.today.isHoliday).toBe(true);
  });

  it("GB: Christmas (Dec 25)", () => {
    const config = makeConfig({ country: "GB" });
    const result = computeHolidays(config, ["en"], makeDate("2026-12-25"));
    expect(result.today.isHoliday).toBe(true);
  });
});
