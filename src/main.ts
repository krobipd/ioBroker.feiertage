import * as utils from "@iobroker/adapter-core";
import { I18n } from "@iobroker/adapter-core";
import { join } from "node:path";
import { errText } from "./lib/coerce";
import { computeHolidays, logAvailableHolidays } from "./lib/holiday-engine";
import { getSystemCountry, getSystemLanguage, resolveLanguages } from "./lib/i18n";
import { cleanupDeprecatedStates, ensureObjects, publishStates } from "./lib/state-publisher";
import type { AdapterConfig } from "./lib/types";

let processHandlersInstalled = false;
let installedUnhandledHandler: ((reason: unknown) => void) | null = null;
let installedUncaughtHandler: ((err: Error) => void) | null = null;

class PublicHolidaysAdapter extends utils.Adapter {
  private midnightTimer: ioBroker.Timeout | undefined;
  private unloaded = false;

  constructor(options: Partial<utils.AdapterOptions> = {}) {
    super({ ...options, name: "public-holidays" });
    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
    if (!processHandlersInstalled) {
      installedUnhandledHandler = (reason: unknown): void => {
        console.error(
          `[public-holidays] Unhandled rejection: ${reason instanceof Error ? reason.message : String(reason)}`,
        );
      };
      installedUncaughtHandler = (err: Error): void => {
        console.error(`[public-holidays] Uncaught exception: ${err.message}`);
      };
      process.on("unhandledRejection", installedUnhandledHandler);
      process.on("uncaughtException", installedUncaughtHandler);
      processHandlersInstalled = true;
    }
  }

  private async onReady(): Promise<void> {
    try {
      await I18n.init(join(this.adapterDir, "admin"), this);

      await this.computeAndPublish();
      this.scheduleMidnight();
    } catch (err: unknown) {
      this.log.error(`onReady failed: ${errText(err)}`);
    }
  }

  private async computeAndPublish(): Promise<void> {
    this.log.debug("Computing holidays...");
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
      return;
    }

    const systemLang = await getSystemLanguage(this);
    const languages = resolveLanguages(systemLang, config.country);
    this.log.debug(`System language: ${systemLang}, holiday languages: [${languages.join(", ")}]`);

    const computed = computeHolidays(config, languages);

    logAvailableHolidays(config, languages, msg => this.log.debug(msg));

    this.log.info(
      `Today: ${computed.today.isHoliday ? computed.today.name : "no holiday"}, ` +
        `next: ${computed.next.name} in ${computed.next.duration} days`,
    );

    await cleanupDeprecatedStates(this);
    await ensureObjects(this);
    await publishStates(this, computed);

    this.log.debug("All holidays computed and published");
  }

  private scheduleMidnight(): void {
    if (this.unloaded) {
      return;
    }
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 0);
    const ms = next.getTime() - now.getTime();

    this.log.debug(`Next computation scheduled in ${Math.round(ms / 60000)} minutes`);

    this.midnightTimer = this.setTimeout(() => {
      void this.computeAndPublish()
        .catch((err: unknown) => this.log.error(`Midnight computation failed: ${errText(err)}`))
        .finally(() => this.scheduleMidnight());
    }, ms);
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
    this.unloaded = true;
    try {
      if (this.midnightTimer) {
        this.clearTimeout(this.midnightTimer);
      }
    } catch {
      // ignore
    }
    callback();
  }
}

if (require.main !== module) {
  module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new PublicHolidaysAdapter(options);
} else {
  new PublicHolidaysAdapter();
}
