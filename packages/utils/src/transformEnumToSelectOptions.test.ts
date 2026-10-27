// @vitest-environment node
import { describe, expect, it } from "vitest";
import { transformEnumToSelectOptions } from "./transformEnumToSelectOptions";

describe("transformEnumToSelectOptions", () => {
	const testEnum = {
		OPTION_ONE: "OPTION_ONE",
		OPTION_TWO: "OPTION_TWO",
		SIMPLE: "SIMPLE",
	};

	it("should transform enum to select options array", () => {
		const result = transformEnumToSelectOptions(testEnum);
		expect(result).toHaveLength(3);
		expect(result[0]).toHaveProperty("value");
		expect(result[0]).toHaveProperty("label");
		expect(result[0]).toHaveProperty("labelSearchValue");
	});

	it("should capitalize first letter and replace underscores", () => {
		const result = transformEnumToSelectOptions(testEnum);
		const optionOne = result.find((r) => r.value === "OPTION_ONE");
		expect(optionOne?.label).toBe("Option one");
	});

	it("should handle simple values", () => {
		const result = transformEnumToSelectOptions(testEnum);
		const simple = result.find((r) => r.value === "SIMPLE");
		expect(simple?.label).toBe("Simple");
	});

	it("should convert to uppercase when flag is true", () => {
		const result = transformEnumToSelectOptions(testEnum, true);
		const optionOne = result.find((r) => r.value === "OPTION_ONE");
		expect(optionOne?.label).toBe("OPTION ONE");
	});

	it("should return empty array for null/undefined input", () => {
		// @ts-expect-error testing edge case
		expect(transformEnumToSelectOptions(null)).toEqual([]);
		// @ts-expect-error testing edge case
		expect(transformEnumToSelectOptions(undefined)).toEqual([]);
	});

	it("should set labelSearchValue same as label", () => {
		const result = transformEnumToSelectOptions(testEnum);
		result.forEach((option) => {
			expect(option.label).toBe(option.labelSearchValue);
		});
	});

	it("should preserve original value in value field", () => {
		const result = transformEnumToSelectOptions(testEnum);
		expect(result.map((r) => r.value)).toEqual([
			"OPTION_ONE",
			"OPTION_TWO",
			"SIMPLE",
		]);
	});
});
