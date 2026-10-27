// @vitest-environment node
import { describe, expect, it } from "vitest";
import { formatEnum } from "./formatEnum";

describe("formatEnum", () => {
	it("should capitalize first word and lowercase rest with underscore separation", () => {
		expect(formatEnum("HELLO_WORLD")).toBe("Hello world");
		expect(formatEnum("ORDER_STATUS_ACTIVE")).toBe("Order status active");
	});

	it("should handle single word", () => {
		expect(formatEnum("ACTIVE")).toBe("Active");
		expect(formatEnum("PENDING")).toBe("Pending");
	});

	it("should handle already lowercase input", () => {
		expect(formatEnum("hello_world")).toBe("Hello world");
	});

	it("should return empty string for undefined", () => {
		expect(formatEnum(undefined)).toBe("");
	});

	it("should return empty string for empty string", () => {
		expect(formatEnum("")).toBe("");
	});

	it("should handle mixed case input", () => {
		expect(formatEnum("HeLLo_WoRLD")).toBe("Hello world");
	});

	it("should handle multiple underscores", () => {
		expect(formatEnum("ONE_TWO_THREE_FOUR")).toBe("One two three four");
	});
});
