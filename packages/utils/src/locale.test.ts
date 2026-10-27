// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
	buildLocale,
	DEFAULT_LOCALE_FORMAT,
	getLocaleFormatInfo,
} from "./locale";

describe("buildLocale", () => {
	it("should combine language and country", () => {
		expect(buildLocale("en", "US")).toBe("en-US");
	});

	it("should return nl-NL when language is empty", () => {
		expect(buildLocale("", "US")).toBe("nl-NL");
	});

	it("should return nl-NL when country is empty", () => {
		expect(buildLocale("en", "")).toBe("nl-NL");
	});

	it("should return nl-NL when both are empty", () => {
		expect(buildLocale("", "")).toBe("nl-NL");
	});
});

describe("getLocaleFormatInfo", () => {
	it("should return correct info for nl-NL / EUR", () => {
		const info = getLocaleFormatInfo("nl-NL", "EUR");
		expect(info.locale).toBe("nl-NL");
		expect(info.currency).toBe("EUR");
		expect(info.decimalSeparator).toBe(",");
		expect(info.thousandSeparator).toBe(".");
		expect(info.currencySymbol).toBe("€");
	});

	it("should return correct info for en-US / USD", () => {
		const info = getLocaleFormatInfo("en-US", "USD");
		expect(info.locale).toBe("en-US");
		expect(info.currency).toBe("USD");
		expect(info.decimalSeparator).toBe(".");
		expect(info.thousandSeparator).toBe(",");
		expect(info.currencySymbol).toBe("$");
	});

	it("should return correct info for en-GB / GBP", () => {
		const info = getLocaleFormatInfo("en-GB", "GBP");
		expect(info.locale).toBe("en-GB");
		expect(info.currency).toBe("GBP");
		expect(info.currencySymbol).toBe("£");
	});
});

describe("DEFAULT_LOCALE_FORMAT", () => {
	it("should have nl-NL defaults", () => {
		expect(DEFAULT_LOCALE_FORMAT.locale).toBe("nl-NL");
		expect(DEFAULT_LOCALE_FORMAT.currency).toBe("EUR");
		expect(DEFAULT_LOCALE_FORMAT.decimalSeparator).toBe(",");
		expect(DEFAULT_LOCALE_FORMAT.thousandSeparator).toBe(".");
		expect(DEFAULT_LOCALE_FORMAT.currencySymbol).toBe("€");
	});
});
