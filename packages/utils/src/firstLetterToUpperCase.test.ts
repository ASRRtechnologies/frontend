// @vitest-environment node
import { describe, expect, it } from "vitest";
import { firstLetterToUpperCase } from "./firstLetterToUpperCase";

describe("firstLetterToUpperCase", () => {
	it("should capitalize the first letter of a lowercase string", () => {
		expect(firstLetterToUpperCase("hello")).toBe("Hello");
		expect(firstLetterToUpperCase("world")).toBe("World");
	});

	it("should keep already capitalized strings unchanged", () => {
		expect(firstLetterToUpperCase("Hello")).toBe("Hello");
		expect(firstLetterToUpperCase("HELLO")).toBe("HELLO");
	});

	it("should handle single character strings", () => {
		expect(firstLetterToUpperCase("a")).toBe("A");
		expect(firstLetterToUpperCase("A")).toBe("A");
	});

	it("should return empty string for empty input", () => {
		expect(firstLetterToUpperCase("")).toBe("");
	});

	it("should return empty string for undefined", () => {
		expect(firstLetterToUpperCase(undefined)).toBe("");
	});

	it("should handle strings starting with numbers", () => {
		expect(firstLetterToUpperCase("123abc")).toBe("123abc");
	});

	it("should handle strings with spaces", () => {
		expect(firstLetterToUpperCase("hello world")).toBe("Hello world");
	});

	it("should handle strings starting with special characters", () => {
		expect(firstLetterToUpperCase("@hello")).toBe("@hello");
	});
});
