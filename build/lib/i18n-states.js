"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var i18n_states_exports = {};
__export(i18n_states_exports, {
  CHANNEL_I18N: () => CHANNEL_I18N,
  STATE_NAMES: () => STATE_NAMES
});
module.exports = __toCommonJS(i18n_states_exports);
const STATE_NAMES = {
  today: {
    en: "Today",
    de: "Heute",
    ru: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F",
    pt: "Hoje",
    nl: "Vandaag",
    fr: "Aujourd'hui",
    it: "Oggi",
    es: "Hoy",
    pl: "Dzisiaj",
    uk: "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456",
    "zh-cn": "\u4ECA\u5929"
  },
  yesterday: {
    en: "Yesterday",
    de: "Gestern",
    ru: "\u0412\u0447\u0435\u0440\u0430",
    pt: "Ontem",
    nl: "Gisteren",
    fr: "Hier",
    it: "Ieri",
    es: "Ayer",
    pl: "Wczoraj",
    uk: "\u0412\u0447\u043E\u0440\u0430",
    "zh-cn": "\u6628\u5929"
  },
  tomorrow: {
    en: "Tomorrow",
    de: "Morgen",
    ru: "\u0417\u0430\u0432\u0442\u0440\u0430",
    pt: "Amanh\xE3",
    nl: "Morgen",
    fr: "Demain",
    it: "Domani",
    es: "Ma\xF1ana",
    pl: "Jutro",
    uk: "\u0417\u0430\u0432\u0442\u0440\u0430",
    "zh-cn": "\u660E\u5929"
  },
  dayAfterTomorrow: {
    en: "Day after tomorrow",
    de: "\xDCbermorgen",
    ru: "\u041F\u043E\u0441\u043B\u0435\u0437\u0430\u0432\u0442\u0440\u0430",
    pt: "Depois de amanh\xE3",
    nl: "Overmorgen",
    fr: "Apr\xE8s-demain",
    it: "Dopodomani",
    es: "Pasado ma\xF1ana",
    pl: "Pojutrze",
    uk: "\u041F\u0456\u0441\u043B\u044F\u0437\u0430\u0432\u0442\u0440\u0430",
    "zh-cn": "\u540E\u5929"
  },
  next: {
    en: "Next holiday",
    de: "N\xE4chster Feiertag",
    ru: "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A",
    pt: "Pr\xF3ximo feriado",
    nl: "Volgende feestdag",
    fr: "Prochain jour f\xE9ri\xE9",
    it: "Prossimo giorno festivo",
    es: "Pr\xF3ximo festivo",
    pl: "Nast\u0119pne \u015Bwi\u0119to",
    uk: "\u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0435 \u0441\u0432\u044F\u0442\u043E",
    "zh-cn": "\u4E0B\u4E00\u4E2A\u5047\u65E5"
  },
  name: {
    en: "Holiday name",
    de: "Feiertagsname",
    ru: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A\u0430",
    pt: "Nome do feriado",
    nl: "Naam feestdag",
    fr: "Nom du jour f\xE9ri\xE9",
    it: "Nome del giorno festivo",
    es: "Nombre del festivo",
    pl: "Nazwa \u015Bwi\u0119ta",
    uk: "\u041D\u0430\u0437\u0432\u0430 \u0441\u0432\u044F\u0442\u0430",
    "zh-cn": "\u5047\u65E5\u540D\u79F0"
  },
  id: {
    en: "Holiday ID",
    de: "Feiertags-ID",
    ru: "\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A\u0430",
    pt: "ID do feriado",
    nl: "Feestdag-ID",
    fr: "ID du jour f\xE9ri\xE9",
    it: "ID del giorno festivo",
    es: "ID del festivo",
    pl: "ID \u015Bwi\u0119ta",
    uk: "\u0406\u0434\u0435\u043D\u0442\u0438\u0444\u0456\u043A\u0430\u0442\u043E\u0440 \u0441\u0432\u044F\u0442\u0430",
    "zh-cn": "\u5047\u65E5ID"
  },
  boolean: {
    en: "Is a holiday",
    de: "Ist ein Feiertag",
    ru: "\u042F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A\u043E\u043C",
    pt: "\xC9 feriado",
    nl: "Is een feestdag",
    fr: "Est un jour f\xE9ri\xE9",
    it: "\xC8 un giorno festivo",
    es: "Es festivo",
    pl: "Jest \u015Bwi\u0119tem",
    uk: "\u0404 \u0441\u0432\u044F\u0442\u043E\u043C",
    "zh-cn": "\u662F\u5047\u65E5"
  },
  region: {
    en: "Region code",
    de: "Regionscode",
    ru: "\u041A\u043E\u0434 \u0440\u0435\u0433\u0438\u043E\u043D\u0430",
    pt: "C\xF3digo da regi\xE3o",
    nl: "Regiocode",
    fr: "Code r\xE9gion",
    it: "Codice regione",
    es: "C\xF3digo de regi\xF3n",
    pl: "Kod regionu",
    uk: "\u041A\u043E\u0434 \u0440\u0435\u0433\u0456\u043E\u043D\u0443",
    "zh-cn": "\u533A\u57DF\u4EE3\u7801"
  },
  type: {
    en: "Holiday type",
    de: "Feiertagstyp",
    ru: "\u0422\u0438\u043F \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A\u0430",
    pt: "Tipo de feriado",
    nl: "Type feestdag",
    fr: "Type de jour f\xE9ri\xE9",
    it: "Tipo di giorno festivo",
    es: "Tipo de festivo",
    pl: "Typ \u015Bwi\u0119ta",
    uk: "\u0422\u0438\u043F \u0441\u0432\u044F\u0442\u0430",
    "zh-cn": "\u5047\u65E5\u7C7B\u578B"
  },
  date: {
    en: "Date",
    de: "Datum",
    ru: "\u0414\u0430\u0442\u0430",
    pt: "Data",
    nl: "Datum",
    fr: "Date",
    it: "Data",
    es: "Fecha",
    pl: "Data",
    uk: "\u0414\u0430\u0442\u0430",
    "zh-cn": "\u65E5\u671F"
  },
  duration: {
    en: "Days until holiday",
    de: "Tage bis zum Feiertag",
    ru: "\u0414\u043D\u0435\u0439 \u0434\u043E \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A\u0430",
    pt: "Dias at\xE9 ao feriado",
    nl: "Dagen tot feestdag",
    fr: "Jours jusqu'au jour f\xE9ri\xE9",
    it: "Giorni fino al giorno festivo",
    es: "D\xEDas hasta el festivo",
    pl: "Dni do \u015Bwi\u0119ta",
    uk: "\u0414\u043D\u0456\u0432 \u0434\u043E \u0441\u0432\u044F\u0442\u0430",
    "zh-cn": "\u8DDD\u5047\u65E5\u5929\u6570"
  }
};
const CHANNEL_I18N = {
  today: STATE_NAMES.today,
  yesterday: STATE_NAMES.yesterday,
  tomorrow: STATE_NAMES.tomorrow,
  dayAfterTomorrow: STATE_NAMES.dayAfterTomorrow,
  next: STATE_NAMES.next
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CHANNEL_I18N,
  STATE_NAMES
});
//# sourceMappingURL=i18n-states.js.map
