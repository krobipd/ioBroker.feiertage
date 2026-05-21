import Holidays from "date-holidays";

const SUPPORTED_LANGS = ["de", "en", "es", "fr", "it", "nl", "pl", "pt", "ru", "uk", "zh"];

export function resolveLanguages(systemLang: string, country: string): string[] {
  const lang = systemLang.toLowerCase().split("-")[0];
  if (!SUPPORTED_LANGS.includes(lang)) {
    return ["en"];
  }

  const h = new Holidays(country);
  const available = h.getLanguages();
  if (available.includes(lang)) {
    return lang === "en" ? ["en"] : [lang, "en"];
  }
  return ["en"];
}

export async function getSystemLanguage(adapter: ioBroker.Adapter): Promise<string> {
  try {
    const obj = await adapter.getForeignObjectAsync("system.config");
    const common = obj?.common as unknown as Record<string, unknown> | undefined;
    return (typeof common?.language === "string" ? common.language : "") || "en";
  } catch {
    return "en";
  }
}

export async function getSystemCountry(adapter: ioBroker.Adapter): Promise<string> {
  try {
    const obj = await adapter.getForeignObjectAsync("system.config");
    const common = obj?.common as unknown as Record<string, unknown> | undefined;
    return typeof common?.country === "string" ? common.country : "";
  } catch {
    return "";
  }
}
