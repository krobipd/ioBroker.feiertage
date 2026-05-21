import { describe, it, expect, vi, beforeEach } from "vitest";
import { ensureObjects, publishStates } from "./state-publisher";
import type { ComputedHolidays } from "./types";

function makeMockAdapter() {
  const states: Record<string, { val: unknown; ack: boolean }> = {};
  const objects: Record<string, unknown> = {};
  return {
    extendObjectAsync: vi.fn(async (id: string, obj: unknown) => {
      objects[id] = obj;
    }),
    setStateAsync: vi.fn(async (id: string, val: unknown, ack: boolean) => {
      states[id] = { val, ack };
    }),
    states,
    objects,
  };
}

function makeComputed(): ComputedHolidays {
  return {
    yesterday: { name: "", id: "", isHoliday: false, region: "", type: "" },
    today: { name: "Neujahr", id: "01-01", isHoliday: true, region: "", type: "public" },
    tomorrow: { name: "", id: "", isHoliday: false, region: "", type: "" },
    dayAfterTomorrow: { name: "", id: "", isHoliday: false, region: "", type: "" },
    next: { name: "Karfreitag", id: "easter_-2", isHoliday: true, region: "", type: "public", date: "2026-04-03", duration: 92 },
  };
}

describe("ensureObjects", () => {
  let adapter: ReturnType<typeof makeMockAdapter>;

  beforeEach(() => {
    adapter = makeMockAdapter();
  });

  it("creates all 5 channels", async () => {
    await ensureObjects(adapter as any);
    const channelIds = Object.keys(adapter.objects).filter(
      (id) => !id.includes("."),
    );
    expect(channelIds).toContain("today");
    expect(channelIds).toContain("yesterday");
    expect(channelIds).toContain("tomorrow");
    expect(channelIds).toContain("dayAfterTomorrow");
    expect(channelIds).toContain("next");
    expect(channelIds.length).toBe(5);
  });

  it("creates today states (name, id, boolean, region, type)", async () => {
    await ensureObjects(adapter as any);
    expect(adapter.objects["today.name"]).toBeDefined();
    expect(adapter.objects["today.id"]).toBeDefined();
    expect(adapter.objects["today.boolean"]).toBeDefined();
    expect(adapter.objects["today.region"]).toBeDefined();
    expect(adapter.objects["today.type"]).toBeDefined();
  });

  it("creates next states including date and duration", async () => {
    await ensureObjects(adapter as any);
    expect(adapter.objects["next.name"]).toBeDefined();
    expect(adapter.objects["next.date"]).toBeDefined();
    expect(adapter.objects["next.duration"]).toBeDefined();
  });

  it("total object count is 5 channels + 27 states = 32", async () => {
    await ensureObjects(adapter as any);
    expect(adapter.extendObjectAsync).toHaveBeenCalledTimes(32);
  });

  it("state objects have correct common.type", async () => {
    await ensureObjects(adapter as any);
    const nameObj = adapter.objects["today.name"] as any;
    expect(nameObj.common.type).toBe("string");
    const boolObj = adapter.objects["today.boolean"] as any;
    expect(boolObj.common.type).toBe("boolean");
    const durObj = adapter.objects["next.duration"] as any;
    expect(durObj.common.type).toBe("number");
  });

  it("state objects have correct roles", async () => {
    await ensureObjects(adapter as any);
    const dateObj = adapter.objects["next.date"] as any;
    expect(dateObj.common.role).toBe("value.date");
    const boolObj = adapter.objects["today.boolean"] as any;
    expect(boolObj.common.role).toBe("indicator");
  });

  it("state objects have read=true, write=false", async () => {
    await ensureObjects(adapter as any);
    const nameObj = adapter.objects["today.name"] as any;
    expect(nameObj.common.read).toBe(true);
    expect(nameObj.common.write).toBe(false);
  });

  it("channel objects have 11-language name", async () => {
    await ensureObjects(adapter as any);
    const ch = adapter.objects["today"] as any;
    expect(ch.common.name).toHaveProperty("en");
    expect(ch.common.name).toHaveProperty("de");
    expect(ch.common.name.en).toBe("Today");
    expect(ch.common.name.de).toBe("Heute");
  });

  it("state objects have 11-language name", async () => {
    await ensureObjects(adapter as any);
    const st = adapter.objects["today.name"] as any;
    expect(st.common.name).toHaveProperty("en");
    expect(st.common.name).toHaveProperty("de");
  });
});

describe("publishStates", () => {
  let adapter: ReturnType<typeof makeMockAdapter>;

  beforeEach(() => {
    adapter = makeMockAdapter();
  });

  it("publishes today holiday name", async () => {
    await publishStates(adapter as any, makeComputed());
    expect(adapter.states["today.name"]).toEqual({ val: "Neujahr", ack: true });
  });

  it("publishes today boolean", async () => {
    await publishStates(adapter as any, makeComputed());
    expect(adapter.states["today.boolean"]).toEqual({ val: true, ack: true });
  });

  it("publishes today id", async () => {
    await publishStates(adapter as any, makeComputed());
    expect(adapter.states["today.id"]).toEqual({ val: "01-01", ack: true });
  });

  it("publishes today type", async () => {
    await publishStates(adapter as any, makeComputed());
    expect(adapter.states["today.type"]).toEqual({ val: "public", ack: true });
  });

  it("publishes empty yesterday", async () => {
    await publishStates(adapter as any, makeComputed());
    expect(adapter.states["yesterday.name"]).toEqual({ val: "", ack: true });
    expect(adapter.states["yesterday.boolean"]).toEqual({ val: false, ack: true });
  });

  it("publishes next holiday date", async () => {
    await publishStates(adapter as any, makeComputed());
    expect(adapter.states["next.date"]).toEqual({ val: "2026-04-03", ack: true });
  });

  it("publishes next holiday duration", async () => {
    await publishStates(adapter as any, makeComputed());
    expect(adapter.states["next.duration"]).toEqual({ val: 92, ack: true });
  });

  it("publishes next holiday name", async () => {
    await publishStates(adapter as any, makeComputed());
    expect(adapter.states["next.name"]).toEqual({ val: "Karfreitag", ack: true });
  });

  it("all states have ack=true", async () => {
    await publishStates(adapter as any, makeComputed());
    for (const [, s] of Object.entries(adapter.states)) {
      expect(s.ack).toBe(true);
    }
  });

  it("total state count is 27", async () => {
    await publishStates(adapter as any, makeComputed());
    expect(adapter.setStateAsync).toHaveBeenCalledTimes(27);
  });

  it("region is empty string for national holidays", async () => {
    await publishStates(adapter as any, makeComputed());
    expect(adapter.states["today.region"]).toEqual({ val: "", ack: true });
  });
});
