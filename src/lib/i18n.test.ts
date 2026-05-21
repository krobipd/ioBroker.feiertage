import { describe, it, expect } from "vitest";
import { resolveLanguages } from "./i18n";

describe("resolveLanguages", () => {
  it("returns [de, en] for German system with DE country", () => {
    const langs = resolveLanguages("de", "DE");
    expect(langs).toEqual(["de", "en"]);
  });

  it("returns [en] for English system", () => {
    const langs = resolveLanguages("en", "DE");
    expect(langs).toEqual(["en"]);
  });

  it("returns [en] for unsupported language", () => {
    const langs = resolveLanguages("ja", "JP");
    expect(langs).toEqual(["en"]);
  });

  it("handles language with region code (de-AT)", () => {
    const langs = resolveLanguages("de-AT", "AT");
    expect(langs).toEqual(["de", "en"]);
  });

  it("returns [fr, en] for French system with FR country", () => {
    const langs = resolveLanguages("fr", "FR");
    expect(langs).toEqual(["fr", "en"]);
  });

  it("returns [it, en] for Italian system with IT country", () => {
    const langs = resolveLanguages("it", "IT");
    expect(langs).toEqual(["it", "en"]);
  });

  it("returns [es, en] for Spanish system with ES country", () => {
    const langs = resolveLanguages("es", "ES");
    expect(langs).toEqual(["es", "en"]);
  });

  it("handles empty language string", () => {
    const langs = resolveLanguages("", "DE");
    expect(langs).toEqual(["en"]);
  });

  it("handles uppercase language", () => {
    const langs = resolveLanguages("DE", "DE");
    expect(langs).toEqual(["de", "en"]);
  });

  it("returns [en] when country doesn't support requested language", () => {
    // Chinese for a country that might not have zh translations
    const langs = resolveLanguages("zh", "DE");
    // date-holidays for DE only has de+en
    expect(langs).toEqual(["en"]);
  });

  it("returns [en] as fallback for unknown language code", () => {
    const langs = resolveLanguages("xx", "DE");
    expect(langs).toEqual(["en"]);
  });

  it("pt supported for PT country", () => {
    const langs = resolveLanguages("pt", "PT");
    expect(langs[0]).toBe("pt");
  });

  it("nl supported for NL country", () => {
    const langs = resolveLanguages("nl", "NL");
    expect(langs[0]).toBe("nl");
  });

  it("pl supported for PL country", () => {
    const langs = resolveLanguages("pl", "PL");
    expect(langs[0]).toBe("pl");
  });

  it("ru supported for RU country", () => {
    const langs = resolveLanguages("ru", "RU");
    expect(langs[0]).toBe("ru");
  });
});
