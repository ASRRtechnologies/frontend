// @vitest-environment node
import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
	it("should join multiple class names with a space", () => {
		expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
	});

	it("should filter out undefined values", () => {
		expect(cn("foo", undefined, "bar")).toBe("foo bar");
	});

	it("should filter out null values", () => {
		expect(cn("foo", null, "bar")).toBe("foo bar");
	});

	it("should filter out false values", () => {
		expect(cn("foo", false, "bar")).toBe("foo bar");
	});

	it("should filter out empty strings", () => {
		expect(cn("foo", "", "bar")).toBe("foo bar");
	});

	it("should return an empty string when called with no arguments", () => {
		expect(cn()).toBe("");
	});

	it("should return the class itself when given a single class", () => {
		expect(cn("foo")).toBe("foo");
	});

	it("should handle mixed truthy and falsy values", () => {
		expect(cn("foo", null, "bar", undefined, false, "baz", "")).toBe(
			"foo bar baz",
		);
	});

	it("should return an empty string when all values are falsy", () => {
		expect(cn(undefined, null, false, "")).toBe("");
	});
});
