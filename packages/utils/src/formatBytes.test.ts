// @vitest-environment node
import { describe, expect, it } from "vitest";
import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
	it("should format 0 bytes", () => {
		expect(formatBytes(0)).toBe("0 B");
	});

	it("should format bytes (< 1000)", () => {
		expect(formatBytes(500)).toBe("500 B");
		expect(formatBytes(999)).toBe("999 B");
	});

	it("should format kilobytes", () => {
		expect(formatBytes(1000)).toBe("1 KB");
		expect(formatBytes(1500)).toBe("1 KB");
		expect(formatBytes(10000)).toBe("10 KB");
	});

	it("should format megabytes", () => {
		expect(formatBytes(1000000)).toBe("1 MB");
		expect(formatBytes(1500000)).toBe("1 MB");
		expect(formatBytes(10000000)).toBe("10 MB");
	});

	it("should format gigabytes", () => {
		expect(formatBytes(1000000000)).toBe("1 GB");
		expect(formatBytes(2500000000)).toBe("2 GB");
	});

	it("should format terabytes", () => {
		expect(formatBytes(1000000000000)).toBe("1 TB");
	});

	it("should handle undefined/null gracefully", () => {
		// @ts-expect-error testing edge case
		expect(formatBytes(undefined)).toBe("0 B");
		// @ts-expect-error testing edge case
		expect(formatBytes(null)).toBe("0 B");
	});
});
