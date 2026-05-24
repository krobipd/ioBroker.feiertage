"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var holiday_engine_exports = {};
__export(holiday_engine_exports, {
  computeHolidays: () => computeHolidays,
  detectBridgeDays: () => detectBridgeDays,
  logAvailableHolidays: () => logAvailableHolidays,
  toDateKey: () => toDateKey,
  toHolidayId: () => toHolidayId
});
module.exports = __toCommonJS(holiday_engine_exports);
var import_date_holidays = __toESM(require("date-holidays"));
const EMPTY_DAY = { name: "", isHoliday: false };
function computeHolidays(config, languages, referenceDate) {
  const now = referenceDate != null ? referenceDate : /* @__PURE__ */ new Date();
  const hd = createHolidaysInstance(config, languages);
  const filtered = getFilteredHolidays(hd, now, config);
  const yesterday = getDayInfo(filtered, addDays(now, -1));
  const today = getDayInfo(filtered, now);
  const tomorrow = getDayInfo(filtered, addDays(now, 1));
  const dayAfterTomorrow = getDayInfo(filtered, addDays(now, 2));
  const next = getNextHoliday(filtered, now);
  return { yesterday, today, tomorrow, dayAfterTomorrow, next };
}
function logAvailableHolidays(config, languages, log) {
  const hd = createHolidaysInstance(config, languages);
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const holidays = hd.getHolidays(year);
  const matching = holidays.filter((h) => config.holidayTypes.includes(h.type)).map((h) => `${toHolidayId(h.name, h.rule)} (${h.name}, ${h.type})`);
  log(
    `${config.country}${config.state ? `/${config.state}` : ""}${config.region ? `/${config.region}` : ""}: ${matching.length} holidays for ${year} \u2014 IDs: ${matching.join(", ")}`
  );
}
function createHolidaysInstance(config, languages) {
  let hd;
  if (config.state && config.region) {
    hd = new import_date_holidays.default(config.country, config.state, config.region);
  } else if (config.state) {
    hd = new import_date_holidays.default(config.country, config.state);
  } else {
    hd = new import_date_holidays.default(config.country);
  }
  hd.setLanguages(languages);
  return hd;
}
function getFilteredHolidays(hd, referenceDate, config) {
  const year = referenceDate.getFullYear();
  const years = [year - 1, year, year + 1];
  const result = /* @__PURE__ */ new Map();
  for (const y of years) {
    const holidays = hd.getHolidays(y);
    for (const h of holidays) {
      if (!config.holidayTypes.includes(h.type)) {
        continue;
      }
      const id = toHolidayId(h.name, h.rule);
      if (config.excludeHolidays.includes(id)) {
        continue;
      }
      const dateKey = toDateKey(h.start);
      if (!result.has(dateKey)) {
        result.set(dateKey, h);
      }
    }
  }
  if (config.includeBridgeDays) {
    addBridgeDays(result, year, hd, config);
  }
  return result;
}
function getDayInfo(holidays, date) {
  const key = toDateKey(date);
  const h = holidays.get(key);
  if (!h) {
    return { ...EMPTY_DAY };
  }
  return {
    name: h.name,
    isHoliday: true
  };
}
function getNextHoliday(holidays, referenceDate) {
  const refKey = toDateKey(referenceDate);
  let nearest = null;
  let nearestDate = null;
  for (const [dateKey, h] of holidays) {
    if (dateKey <= refKey) {
      continue;
    }
    const d = /* @__PURE__ */ new Date(`${dateKey}T00:00:00`);
    if (!nearest || d < nearestDate) {
      nearest = h;
      nearestDate = d;
    }
  }
  if (!nearest || !nearestDate) {
    return { ...EMPTY_DAY, date: "", duration: 0 };
  }
  const refMidnight = new Date(referenceDate);
  refMidnight.setHours(0, 0, 0, 0);
  const duration = Math.round((nearestDate.getTime() - refMidnight.getTime()) / 864e5);
  return {
    name: nearest.name,
    isHoliday: true,
    date: toDateKey(nearestDate),
    duration
  };
}
function detectBridgeDays(holidays, year) {
  const bridgeDays = [];
  for (const [dateKey] of holidays) {
    if (!dateKey.startsWith(String(year))) {
      continue;
    }
    const holidayDate = /* @__PURE__ */ new Date(`${dateKey}T00:00:00`);
    const dow = holidayDate.getDay();
    if (dow === 4) {
      const friday = addDays(holidayDate, 1);
      const fridayKey = toDateKey(friday);
      if (!holidays.has(fridayKey) && friday.getDay() === 5) {
        bridgeDays.push(friday);
      }
    }
    if (dow === 2) {
      const monday = addDays(holidayDate, -1);
      const mondayKey = toDateKey(monday);
      if (!holidays.has(mondayKey) && monday.getDay() === 1) {
        bridgeDays.push(monday);
      }
    }
  }
  return bridgeDays;
}
function addBridgeDays(holidays, year, _hd, _config) {
  const bridgeDays = detectBridgeDays(holidays, year);
  for (const bd of bridgeDays) {
    const key = toDateKey(bd);
    if (!holidays.has(key)) {
      holidays.set(key, {
        date: key,
        start: bd,
        end: addDays(bd, 1),
        name: "Bridge day",
        type: "bridge",
        rule: ""
      });
    }
  }
}
function toHolidayId(name, rule) {
  if (rule) {
    const clean = rule.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase();
    if (clean.length > 3) {
      return clean;
    }
  }
  return name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_").toLowerCase();
}
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  computeHolidays,
  detectBridgeDays,
  logAvailableHolidays,
  toDateKey,
  toHolidayId
});
//# sourceMappingURL=holiday-engine.js.map
