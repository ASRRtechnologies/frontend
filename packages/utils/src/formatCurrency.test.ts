// @vitest-environment node
import { describe, expect, it } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
	it("should format positive numbers with EUR by default", () => {
		const result = formatCurrency(1234.56);
		expect(result).toContain("1.234,56");
		expect(result).toContain("€");
	});

	it("should format zero", () => {
		const result = formatCurrency(0);
		expect(result).toContain("0,00");
		expect(result).toContain("€");
	});

	it("should format negative numbers with minus prefix", () => {
		const result = formatCurrency(-1234.56);
		expect(result).toMatch(/^-/);
		expect(result).toContain("1.234,56");
	});

	it("should handle -0 as negative", () => {
		const result = formatCurrency(-0);
		expect(result).toMatch(/^-/);
	});

	it("should format with custom currency (USD)", () => {
		const result = formatCurrency(1234.56, "USD", "en-US");
		expect(result).toContain("$");
		expect(result).toContain("1,234.56");
	});

	it("should handle undefined input", () => {
		const result = formatCurrency(undefined);
		expect(result).toContain("0,00");
	});

	it("should respect maximumFractionDigits", () => {
		const result = formatCurrency(1234.5678, "EUR", "nl-NL", 0);
		expect(result).not.toContain(",56");
	});

	it("should format large numbers correctly", () => {
		const result = formatCurrency(1000000);
		expect(result).toContain("1.000.000");
	});

	it("should format with en-US locale and USD currency", () => {
		const result = formatCurrency(1234.56, "USD", "en-US");
		expect(result).toContain("$");
		expect(result).toContain("1,234.56");
	});

	it("should format with en-US locale and EUR currency", () => {
		const result = formatCurrency(1234.56, "EUR", "en-US");
		expect(result).toContain("€");
		expect(result).toContain("1,234.56");
	});

	it("should format with GBP and en-GB locale", () => {
		const result = formatCurrency(1234.56, "GBP", "en-GB");
		expect(result).toContain("£");
		expect(result).toContain("1,234.56");
	});

	// nl-SR writes the Surinamese dollar as a bare "$". A tenant that also buys in
	// USD cannot tell the two apart, and the inputs next to it already say "SRD".
	it("should write SRD as its code under a Surinamese locale, not as a bare $", () => {
		const result = formatCurrency(41, "SRD", "nl-SR");
		expect(result).not.toContain("$");
		expect(result).toContain("SRD");
		expect(result).toContain("41,00");
	});

	it("should keep the minus prefix when the symbol is replaced by the code", () => {
		const result = formatCurrency(-41, "SRD", "nl-SR");
		expect(result).toMatch(/^-/);
		expect(result).not.toContain("$");
		expect(result).toContain("SRD");
	});

	it("should leave USD as $ under a Surinamese locale", () => {
		expect(formatCurrency(41, "USD", "nl-SR")).toContain("$");
	});

	it("should format negative number with en-US locale", () => {
		const result = formatCurrency(-5000, "USD", "en-US");
		expect(result).toMatch(/^-/);
		expect(result).toContain("$");
		expect(result).toContain("5,000.00");
	});
});
