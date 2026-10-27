// @vitest-environment node
import { describe, expect, it } from "vitest";
import { wgs84ToRD } from "./coordinates";

describe("wgs84ToRD", () => {
	it("should return exact RD origin for the Amersfoort reference point", () => {
		const result = wgs84ToRD(52.155174405, 5.38720621);
		expect(result.x).toBe(155000);
		expect(result.y).toBe(463000);
	});

	it("should convert Amsterdam (Westertoren) coordinates", () => {
		const result = wgs84ToRD(52.374, 4.8897);
		expect(result.x).toBeCloseTo(120700, -3);
		expect(result.y).toBeCloseTo(487525, -3);
	});

	it("should convert Maastricht coordinates", () => {
		const result = wgs84ToRD(50.8514, 5.691);
		expect(result.x).toBeCloseTo(176500, -4);
		expect(result.y).toBeCloseTo(318000, -4);
	});

	it("should return an object with x and y properties", () => {
		const result = wgs84ToRD(52.0, 5.0);
		expect(result).toHaveProperty("x");
		expect(result).toHaveProperty("y");
		expect(typeof result.x).toBe("number");
		expect(typeof result.y).toBe("number");
	});
});
