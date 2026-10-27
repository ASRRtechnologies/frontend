// @vitest-environment node
import { describe, expect, it } from "vitest";
import { formatPercentage } from "./formatPercentage";

describe("formatPercentage", () => {
	it("should format decimal to percentage", () => {
		expect(formatPercentage(0.5)).toBe("50%");
		expect(formatPercentage(0.25)).toBe("25%");
		expect(formatPercentage(1)).toBe("100%");
	});

	it("should format zero", () => {
		expect(formatPercentage(0)).toBe("0%");
	});

	it("should round to nearest integer", () => {
		expect(formatPercentage(0.333)).toBe("33%");
		expect(formatPercentage(0.666)).toBe("67%");
		expect(formatPercentage(0.999)).toBe("100%");
	});

	it("should handle values greater than 1", () => {
		expect(formatPercentage(1.5)).toBe("150%");
		expect(formatPercentage(2)).toBe("200%");
	});

	it("should handle small decimals", () => {
		expect(formatPercentage(0.001)).toBe("0%");
		expect(formatPercentage(0.005)).toBe("1%");
	});

	it("should handle negative values", () => {
		expect(formatPercentage(-0.25)).toBe("-25%");
	});
});
