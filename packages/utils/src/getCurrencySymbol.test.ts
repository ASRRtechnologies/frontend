// @vitest-environment node
import { describe, expect, it } from "vitest";
import { getCurrencySymbol } from "./getCurrencySymbol";

describe("getCurrencySymbol", () => {
	it("should return $ for USD", () => {
		expect(getCurrencySymbol("USD")).toBe("$");
	});

	it("should return € for EUR", () => {
		expect(getCurrencySymbol("EUR")).toBe("€");
	});

	it("should return £ for GBP", () => {
		expect(getCurrencySymbol("GBP")).toBe("£");
	});

	it("should return ¥ for JPY", () => {
		expect(getCurrencySymbol("JPY")).toBe("¥");
	});

	it("should return $ for CAD", () => {
		expect(getCurrencySymbol("CAD")).toBe("$");
	});

	it("should return $ for AUD", () => {
		expect(getCurrencySymbol("AUD")).toBe("$");
	});

	it("should return CHF for CHF", () => {
		expect(getCurrencySymbol("CHF")).toBe("CHF");
	});

	it("should return ¥ for CNY", () => {
		expect(getCurrencySymbol("CNY")).toBe("¥");
	});

	it("should return ₹ for INR", () => {
		expect(getCurrencySymbol("INR")).toBe("₹");
	});

	it("should return SRD for SRD", () => {
		expect(getCurrencySymbol("SRD")).toBe("SRD");
	});

	it("should return empty string for null", () => {
		expect(getCurrencySymbol(null)).toBe("");
	});

	it("should return empty string for undefined", () => {
		expect(getCurrencySymbol(undefined as unknown as string)).toBe("");
	});

	it("should return empty string for empty string", () => {
		expect(getCurrencySymbol("")).toBe("");
	});

	it("should return empty string for unknown currency code", () => {
		expect(getCurrencySymbol("XYZ")).toBe("");
	});

	it("should handle lowercase currency codes", () => {
		expect(getCurrencySymbol("eur")).toBe("€");
	});

	it("should handle mixed case currency codes", () => {
		expect(getCurrencySymbol("gBp")).toBe("£");
	});
});
