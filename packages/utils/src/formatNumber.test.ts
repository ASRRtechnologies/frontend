// @vitest-environment node
import { describe, expect, it } from "vitest";
import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
	it("should format integers with Dutch locale (periods as thousands separator)", () => {
		expect(formatNumber(1000)).toBe("1.000");
		expect(formatNumber(1000000)).toBe("1.000.000");
	});

	it("should format decimals with comma separator", () => {
		const result = formatNumber(1234.56);
		expect(result).toContain("1.234");
		expect(result).toContain(",");
	});

	it("should respect minDigits parameter", () => {
		const result = formatNumber(100, 2);
		expect(result).toBe("100,00");
	});

	it("should respect maxDigits parameter", () => {
		const result = formatNumber(100.12345, undefined, 2);
		expect(result).toBe("100,12");
	});

	it("should respect both minDigits and maxDigits", () => {
		const result = formatNumber(100.1, 2, 4);
		expect(result).toBe("100,10");
	});

	it("should format zero", () => {
		expect(formatNumber(0)).toBe("0");
	});

	it("should format negative numbers", () => {
		const result = formatNumber(-1234);
		expect(result).toBe("-1.234");
	});

	it("should handle small decimals", () => {
		const result = formatNumber(0.001, 3);
		expect(result).toBe("0,001");
	});

	it("should format with en-US locale", () => {
		expect(formatNumber(1000, undefined, undefined, "en-US")).toBe("1,000");
	});

	it("should format decimals with en-US locale", () => {
		expect(formatNumber(1234.56, 2, 2, "en-US")).toBe("1,234.56");
	});

	it("should format with en-US locale and minDigits", () => {
		expect(formatNumber(100, 2, undefined, "en-US")).toBe("100.00");
	});

	it("should default to nl-NL when no locale is specified", () => {
		expect(formatNumber(1000)).toBe("1.000");
		expect(formatNumber(1234.56, 2, 2)).toBe("1.234,56");
	});
});
