import * as utils from "@iobroker/adapter-core";
import { errText } from "./lib/coerce";
import { computeHolidays, logAvailableHolidays } from "./lib/holiday-engine";
import { getSystemCountry, getSystemLanguage, resolveLanguages } from "./lib/i18n";
import { ensureObjects, publishStates } from "./lib/state-publisher";
import type { AdapterConfig } from "./lib/types";

class FeiertageAdapter extends utils.Adapter {
  constructor(options: Partial<utils.AdapterOptions> = {}) {
    super({ ...options, name: "feiertage" });
    this.on("ready", () => {
      this.onReady().catch((err: unknown) => this.log.error(`onReady failed: ${errText(err)}`));
    });
    this.on("unload", this.onUnload.bind(this));
  }

  private async onReady(): Promise<void> {
    const config = this.validateConfig();
    if (!config) {
      this.terminate?.("No country configured — open adapter settings", 11);
      return;
    }

    const systemLang = await getSystemLanguage(this);
    const languages = resolveLanguages(systemLang, config.country);
    this.log.debug(`System language: ${systemLang}, holiday languages: [${languages.join(", ")}]`);

    if (!config.state && !config.region) {
      const sysCountry = await getSystemCountry(this);
      if (sysCountry && !config.country) {
        config.country = sysCountry.toUpperCase();
        this.log.info(`Using system country: ${config.country}`);
      }
    }

    const computed = computeHolidays(config, languages);

    logAvailableHolidays(config, languages, msg => this.log.info(msg));

    this.log.info(
      `Today: ${computed.today.isHoliday ? computed.today.name : "no holiday"}, ` +
        `next: ${computed.next.name} in ${computed.next.duration} days`,
    );

    await ensureObjects(this);
    await publishStates(this, computed);

    this.log.debug("All holidays computed and published");
    this.terminate?.("All holidays computed and published", 0);
  }

  private validateConfig(): AdapterConfig | null {
    const raw = this.config as Record<string, unknown>;
    const country = typeof raw.country === "string" ? raw.country.trim() : "";
    if (!country) {
      return null;
    }

    const holidayTypes: string[] = [];
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
      excludeHolidays: Array.isArray(raw.excludeHolidays) ? (raw.excludeHolidays as string[]) : [],
      includeBridgeDays: raw.includeBridgeDays === true,
    };
  }

  private onUnload(callback: () => void): void {
    callback();
  }
}

if (require.main !== module) {
  module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new FeiertageAdapter(options);
} else {
  new FeiertageAdapter();
}
