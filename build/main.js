"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod,
  )
);
var utils = __toESM(require("@iobroker/adapter-core"));
var import_adapter_core = require("@iobroker/adapter-core");
var import_node_path = require("node:path");
var import_coerce = require("./lib/coerce");
var import_holiday_engine = require("./lib/holiday-engine");
var import_i18n = require("./lib/i18n");
var import_state_publisher = require("./lib/state-publisher");
class PublicHolidaysAdapter extends utils.Adapter {
  constructor(options = {}) {
    super({ ...options, name: "public-holidays" });
    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    var _a, _b;
    try {
      await import_adapter_core.I18n.init((0, import_node_path.join)(this.adapterDir, "admin"), this);
      const config = this.validateConfig();
      if (!config) {
        this.log.warn("No country configured \u2014 open adapter settings");
        (_a = this.terminate) == null ? void 0 : _a.call(this, "No country configured", 0);
        return;
      }
      const systemLang = await (0, import_i18n.getSystemLanguage)(this);
      const languages = (0, import_i18n.resolveLanguages)(systemLang, config.country);
      this.log.debug(`System language: ${systemLang}, holiday languages: [${languages.join(", ")}]`);
      if (!config.state && !config.region) {
        const sysCountry = await (0, import_i18n.getSystemCountry)(this);
        if (sysCountry && !config.country) {
          config.country = sysCountry.toUpperCase();
          this.log.info(`Using system country: ${config.country}`);
        }
      }
      const computed = (0, import_holiday_engine.computeHolidays)(config, languages);
      (0, import_holiday_engine.logAvailableHolidays)(config, languages, msg => this.log.info(msg));
      this.log.info(
        `Today: ${computed.today.isHoliday ? computed.today.name : "no holiday"}, next: ${computed.next.name} in ${computed.next.duration} days`,
      );
      await (0, import_state_publisher.ensureObjects)(this);
      await (0, import_state_publisher.publishStates)(this, computed);
      this.log.debug("All holidays computed and published");
      (_b = this.terminate) == null ? void 0 : _b.call(this, "All holidays computed and published", 0);
    } catch (err) {
      this.log.error(`onReady failed: ${(0, import_coerce.errText)(err)}`);
    }
  }
  validateConfig() {
    const raw = this.config;
    const country = typeof raw.country === "string" ? raw.country.trim() : "";
    if (!country) {
      return null;
    }
    const holidayTypes = [];
    if (raw.typePublic !== false) {
      holidayTypes.push("public");
    }
    if (raw.typeBank === true) {
      holidayTypes.push("bank");
    }
    if (raw.typeSchool === true) {
      holidayTypes.push("school");
    }
    if (raw.typeOptional === true) {
      holidayTypes.push("optional");
    }
    if (raw.typeObservance === true) {
      holidayTypes.push("observance");
    }
    return {
      country,
      state: typeof raw.state === "string" ? raw.state.trim() : "",
      region: typeof raw.region === "string" ? raw.region.trim() : "",
      holidayTypes,
      excludeHolidays: Array.isArray(raw.excludeHolidays) ? raw.excludeHolidays : [],
      includeBridgeDays: raw.includeBridgeDays === true,
    };
  }
  onUnload(callback) {
    callback();
  }
}
if (require.main !== module) {
  module.exports = options => new PublicHolidaysAdapter(options);
} else {
  new PublicHolidaysAdapter();
}
//# sourceMappingURL=main.js.map
