import type { ComputedHolidays, DayInfo, NextHoliday } from "./types";
import { tName, type I18nKey } from "./i18n";

const DAY_CHANNELS = ["today", "yesterday", "tomorrow", "dayAfterTomorrow"] as const;
const DAY_FIELDS = ["name", "id", "boolean", "region", "type"] as const;
const NEXT_FIELDS = ["name", "id", "boolean", "region", "type", "date", "duration"] as const;

interface StateSpec {
  type: ioBroker.CommonType;
  role: string;
  read: boolean;
  write: boolean;
}

const FIELD_SPECS: Record<string, StateSpec> = {
  name: { type: "string", role: "text", read: true, write: false },
  id: { type: "string", role: "text", read: true, write: false },
  boolean: { type: "boolean", role: "indicator", read: true, write: false },
  region: { type: "string", role: "text", read: true, write: false },
  type: { type: "string", role: "text", read: true, write: false },
  date: { type: "string", role: "value.date", read: true, write: false },
  duration: { type: "number", role: "value", read: true, write: false },
};

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
    await adapter.setStateAsync(`${ch}.name`, info.name, true);
    await adapter.setStateAsync(`${ch}.id`, info.id, true);
    await adapter.setStateAsync(`${ch}.boolean`, info.isHoliday, true);
    await adapter.setStateAsync(`${ch}.region`, info.region, true);
    await adapter.setStateAsync(`${ch}.type`, info.type, true);
  }

  await publishNextHoliday(adapter, computed.next);
}

async function publishNextHoliday(adapter: ioBroker.Adapter, next: NextHoliday): Promise<void> {
  await adapter.setStateAsync("next.name", next.name, true);
  await adapter.setStateAsync("next.id", next.id, true);
  await adapter.setStateAsync("next.boolean", next.isHoliday, true);
  await adapter.setStateAsync("next.region", next.region, true);
  await adapter.setStateAsync("next.type", next.type, true);
  await adapter.setStateAsync("next.date", next.date, true);
  await adapter.setStateAsync("next.duration", next.duration, true);
}
