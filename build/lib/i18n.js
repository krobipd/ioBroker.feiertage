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
var i18n_exports = {};
__export(i18n_exports, {
  getSystemCountry: () => getSystemCountry,
  getSystemLanguage: () => getSystemLanguage,
  resolveLanguages: () => resolveLanguages,
  tName: () => tName
});
module.exports = __toCommonJS(i18n_exports);
var import_adapter_core = require("@iobroker/adapter-core");
var import_date_holidays = __toESM(require("date-holidays"));
const SUPPORTED_LANGS = ["de", "en", "es", "fr", "it", "nl", "pl", "pt", "ru", "uk", "zh"];
function tName(key) {
  return import_adapter_core.I18n.getTranslatedObject(key);
}
function resolveLanguages(systemLang, country) {
  const lang = systemLang.toLowerCase().split("-")[0];
  if (!SUPPORTED_LANGS.includes(lang)) {
    return ["en"];
  }
  const h = new import_date_holidays.default(country);
  const available = h.getLanguages();
  if (available.includes(lang)) {
    return lang === "en" ? ["en"] : [lang, "en"];
  }
  return ["en"];
}
async function getSystemLanguage(adapter) {
  try {
    const obj = await adapter.getForeignObjectAsync("system.config");
    const common = obj == null ? void 0 : obj.common;
    return (typeof (common == null ? void 0 : common.language) === "string" ? common.language : "") || "en";
  } catch {
    return "en";
  }
}
async function getSystemCountry(adapter) {
  try {
    const obj = await adapter.getForeignObjectAsync("system.config");
    const common = obj == null ? void 0 : obj.common;
    return typeof (common == null ? void 0 : common.country) === "string" ? common.country : "";
  } catch {
    return "";
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSystemCountry,
  getSystemLanguage,
  resolveLanguages,
  tName
});
//# sourceMappingURL=i18n.js.map
