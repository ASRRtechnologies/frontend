// @vitest-environment node
import { describe, expect, it } from "vitest";
import { getFileExtension } from "./getFileExtension";

describe("getFileExtension", () => {
	it("should extract extension from simple filename", () => {
		expect(getFileExtension("document.pdf")).toBe("pdf");
		expect(getFileExtension("image.png")).toBe("png");
		expect(getFileExtension("script.js")).toBe("js");
	});

	it("should return lowercase extension", () => {
		expect(getFileExtension("document.PDF")).toBe("pdf");
		expect(getFileExtension("image.PNG")).toBe("png");
		expect(getFileExtension("file.TXT")).toBe("txt");
	});

	it("should handle multiple dots in filename", () => {
		expect(getFileExtension("my.file.name.txt")).toBe("txt");
		expect(getFileExtension("archive.tar.gz")).toBe("gz");
	});

	it("should handle filenames with spaces", () => {
		expect(getFileExtension("my document.pdf")).toBe("pdf");
	});

	it("should return the filename lowercased when there is no extension", () => {
		expect(getFileExtension("README")).toBe("readme");
	});

	it("should handle empty string", () => {
		expect(getFileExtension("")).toBe(null);
	});

	it("should handle hidden files (starting with dot)", () => {
		expect(getFileExtension(".gitignore")).toBe("gitignore");
		expect(getFileExtension(".env.local")).toBe("local");
	});
});
