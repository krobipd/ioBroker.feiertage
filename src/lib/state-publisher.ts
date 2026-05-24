import type { ComputedHolidays, DayInfo, NextHoliday } from "./types";
import { tName, type I18nKey } from "./i18n";

const DAY_CHANNELS = ["today", "yesterday", "tomorrow", "dayAfterTomorrow"] as const;
const DAY_FIELDS = ["name", "boolean"] as const;
const NEXT_FIELDS = ["name", "boolean", "date", "duration"] as const;

interface StateSpec {
  type: ioBroker.CommonType;
  role: string;
  read: boolean;
  write: boolean;
}

const FIELD_SPECS: Record<string, StateSpec> = {
  name: { type: "string", role: "text", read: true, write: false },
  boolean: { type: "boolean", role: "indicator", read: true, write: false },
  date: { type: "string", role: "text", read: true, write: false },
  duration: { type: "number", role: "value", read: true, write: false },
};

const DEPRECATED_STATES = [
  "today.region",
  "today.type",
  "today.id",
  "yesterday.region",
  "yesterday.type",
  "yesterday.id",
  "tomorrow.region",
  "tomorrow.type",
  "tomorrow.id",
  "dayAfterTomorrow.region",
  "dayAfterTomorrow.type",
  "dayAfterTomorrow.id",
  "next.region",
  "next.type",
  "next.id",
];

export async function cleanupDeprecatedStates(adapter: ioBroker.Adapter): Promise<void> {
  for (const id of DEPRECATED_STATES) {
    try {
      const obj = await adapter.getObjectAsync(id);
      if (obj) {
        await adapter.delObjectAsync(id);
        adapter.log.debug(`Removed deprecated state: ${id}`);
      }
    } catch {
      // already gone
    }
  }
}

export async function ensureObjects(adapter: ioBroker.Adapter): Promise<void> {
  for (const ch of DAY_CHANNELS) {
    await ensureChannel(adapter, ch);
    for (const field of DAY_FIELDS) {
      await ensureState(adapter, ch, field);
    }
  }

  await ensureChannel(adapter, "next");
  for (const field of NEXT_FIELDS) {
    await ensureState(adapter, "next", field);
  }
}

async function ensureChannel(adapter: ioBroker.Adapter, channel: string): Promise<void> {
  await adapter.extendObjectAsync(
    channel,
    {
      type: "channel",
      common: { name: tName(channel as I18nKey) },
      native: {},
    },
    { preserve: { common: ["name"] } },
  );
}

async function ensureState(adapter: ioBroker.Adapter, channel: string, field: string): Promise<void> {
  const spec = FIELD_SPECS[field];
  if (!spec) {
    return;
  }
  await adapter.extendObjectAsync(
    `${channel}.${field}`,
    {
      type: "state",
      common: {
        name: tName(field as I18nKey),
        type: spec.type,
        role: spec.role,
        read: spec.read,
        write: spec.write,
      },
      native: {},
    },
    { preserve: { common: ["name"] } },
  );
}

export async function publishStates(adapter: ioBroker.Adapter, computed: ComputedHolidays): Promise<void> {
  const dayMap: Record<string, DayInfo> = {
    today: computed.today,
    yesterday: computed.yesterday,
    tomorrow: computed.tomorrow,
    dayAfterTomorrow: computed.dayAfterTomorrow,
  };

  for (const ch of DAY_CHANNELS) {
    const info = dayMap[ch];
    await adapter.setStateChangedAsync(`${ch}.name`, info.name, true);
    await adapter.setStateChangedAsync(`${ch}.boolean`, info.isHoliday, true);
  }

  await publishNextHoliday(adapter, computed.next);
}

async function publishNextHoliday(adapter: ioBroker.Adapter, next: NextHoliday): Promise<void> {
  await adapter.setStateChangedAsync("next.name", next.name, true);
  await adapter.setStateChangedAsync("next.boolean", next.isHoliday, true);
  await adapter.setStateChangedAsync("next.date", next.date, true);
  await adapter.setStateChangedAsync("next.duration", next.duration, true);
}
