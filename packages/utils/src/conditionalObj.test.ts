// @vitest-environment node
import { describe, expect, it } from "vitest";
import { conditionalObj } from "./conditionalObj";

describe("conditionalObj", () => {
	it("should wrap truthy value in array", () => {
		expect(conditionalObj("hello")).toEqual(["hello"]);
		expect(conditionalObj(42)).toEqual([42]);
		expect(conditionalObj({ key: "value" })).toEqual([{ key: "value" }]);
	});

	it("should return empty array for false", () => {
		expect(conditionalObj(false)).toEqual([]);
	});

	it("should return empty array for null", () => {
		expect(conditionalObj(null)).toEqual([]);
	});

	it("should return empty array for undefined", () => {
		expect(conditionalObj(undefined)).toEqual([]);
	});

	it("should wrap zero in array (truthy check)", () => {
		// 0 is falsy, so it should NOT be wrapped
		expect(conditionalObj(0 as number | false)).toEqual([]);
	});

	it("should wrap objects in array", () => {
		const obj = { id: "1", name: "test" };
		expect(conditionalObj(obj)).toEqual([obj]);
	});

	it("should wrap arrays in array", () => {
		const arr = [1, 2, 3];
		expect(conditionalObj(arr)).toEqual([[1, 2, 3]]);
	});

	it("should be useful for conditional spreads", () => {
		const condition = true;
		const result = ["always", ...conditionalObj(condition && "conditional")];
		expect(result).toEqual(["always", "conditional"]);
	});

	it("should exclude from conditional spreads when false", () => {
		const condition = false;
		const result = ["always", ...conditionalObj(condition && "conditional")];
		expect(result).toEqual(["always"]);
	});
});
