import * as utils from "@iobroker/adapter-core";
import { I18n } from "@iobroker/adapter-core";
import { join } from "node:path";
import { errText } from "./lib/coerce";
import { computeHolidays, logAvailableHolidays } from "./lib/holiday-engine";
import { getSystemCountry, getSystemLanguage, resolveLanguages } from "./lib/i18n";
import { ensureObjects, publishStates } from "./lib/state-publisher";
import type { AdapterConfig } from "./lib/types";

class PublicHolidaysAdapter extends utils.Adapter {
  constructor(options: Partial<utils.AdapterOptions> = {}) {
    super({ ...options, name: "public-holidays" });
    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }

  private async onReady(): Promise<void> {
    try {
      await I18n.init(join(this.adapterDir, "admin"), this);

      const raw = this.config as Record<string, unknown>;
      if (!raw.country) {
        const sysCountry = await getSystemCountry(this);
        if (sysCountry) {
          const upper = sysCountry.toUpperCase();
          raw.country = upper;
          this.log.info(`Using system country: ${upper}`);
        }
      }

      const config = this.validateConfig();
      if (!config) {
        this.log.warn("No country configured — open adapter settings");
        this.terminate?.("No country configured", 0);
        return;
      }

      const systemLang = await getSystemLanguage(this);
      const languages = resolveLanguages(systemLang, config.country);
      this.log.debug(`System language: ${systemLang}, holiday languages: [${languages.join(", ")}]`);

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
    } catch (err: unknown) {
      this.log.error(`onReady failed: ${errText(err)}`);
    }
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
      excludeHolidays: [
        ...PublicHolidaysAdapter.toStringArray(raw.excludePublic),
        ...PublicHolidaysAdapter.toStringArray(raw.excludeBank),
        ...PublicHolidaysAdapter.toStringArray(raw.excludeSchool),
        ...PublicHolidaysAdapter.toStringArray(raw.excludeOptional),
        ...PublicHolidaysAdapter.toStringArray(raw.excludeObservance),
        ...PublicHolidaysAdapter.toStringArray(raw.excludeHolidays),
      ],
      includeBridgeDays: raw.includeBridgeDays === true,
    };
  }

  private static toStringArray(val: unknown): string[] {
    return Array.isArray(val) ? (val as string[]) : [];
  }

  private onUnload(callback: () => void): void {
    callback();
  }
}

if (require.main !== module) {
  module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new PublicHolidaysAdapter(options);
} else {
  new PublicHolidaysAdapter();
}
