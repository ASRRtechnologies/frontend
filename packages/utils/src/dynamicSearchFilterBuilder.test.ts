// @vitest-environment node
import { describe, expect, it } from "vitest";
import { dynamicSearchFilterBuilder } from "./dynamicSearchFilterBuilder";

interface TestEntity {
	name: string;
	status: string;
	role: string;
}

describe("dynamicSearchFilterBuilder", () => {
	it("should return undefined when input is undefined", () => {
		expect(dynamicSearchFilterBuilder<TestEntity>(undefined)).toBeUndefined();
	});

	it("should return undefined when input is an empty object", () => {
		expect(dynamicSearchFilterBuilder<TestEntity>({})).toBeUndefined();
	});

	it('should return array with one "key:value" string for a single valid filter', () => {
		const result = dynamicSearchFilterBuilder<TestEntity>({ status: "active" });
		expect(result).toEqual(["status:active"]);
	});

	it('should return array with multiple "key:value" strings for multiple valid filters', () => {
		const result = dynamicSearchFilterBuilder<TestEntity>({
			name: "John",
			status: "active",
		});
		expect(result).toEqual(
			expect.arrayContaining(["name:John", "status:active"]),
		);
		expect(result).toHaveLength(2);
	});

	it("should filter out undefined values", () => {
		const result = dynamicSearchFilterBuilder<TestEntity>({
			name: "John",
			status: undefined,
		});
		expect(result).toEqual(["name:John"]);
	});

	it("should filter out null values", () => {
		const result = dynamicSearchFilterBuilder<TestEntity>({
			name: "John",
			status: null as unknown as string,
		});
		expect(result).toEqual(["name:John"]);
	});

	it("should filter out empty string values", () => {
		const result = dynamicSearchFilterBuilder<TestEntity>({
			name: "John",
			status: "",
		});
		expect(result).toEqual(["name:John"]);
	});

	it("should keep valid values and filter out invalid values in a mixed input", () => {
		const result = dynamicSearchFilterBuilder<TestEntity>({
			name: "John",
			status: undefined,
			role: "admin",
		});
		expect(result).toEqual(expect.arrayContaining(["name:John", "role:admin"]));
		expect(result).toHaveLength(2);
	});

	it("should return undefined when all values are invalid", () => {
		const result = dynamicSearchFilterBuilder<TestEntity>({
			name: "",
			status: undefined,
			role: null as unknown as string,
		});
		expect(result).toBeUndefined();
	});
});
