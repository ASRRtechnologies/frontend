// @vitest-environment node
import { describe, expect, it } from "vitest";
import { prettyPrintCamelCase, prettyPrintName } from "./prettyPrintName";

describe("prettyPrintName", () => {
	it("should convert underscore-separated strings to title case", () => {
		expect(prettyPrintName("hello_world")).toBe("Hello World");
		expect(prettyPrintName("user_first_name")).toBe("User First Name");
	});

	it("should handle single words", () => {
		expect(prettyPrintName("hello")).toBe("Hello");
		expect(prettyPrintName("HELLO")).toBe("Hello");
	});

	it("should handle uppercase input", () => {
		expect(prettyPrintName("HELLO_WORLD")).toBe("Hello World");
	});

	it("should handle mixed case input", () => {
		expect(prettyPrintName("HeLLo_WoRLD")).toBe("Hello World");
	});

	it("should handle multiple underscores", () => {
		expect(prettyPrintName("one_two_three_four")).toBe("One Two Three Four");
	});
});

describe("prettyPrintCamelCase", () => {
	it("should convert camelCase to title case with spaces", () => {
		expect(prettyPrintCamelCase("helloWorld")).toBe("Hello World");
		expect(prettyPrintCamelCase("userFirstName")).toBe("User First Name");
	});

	it("should handle single words", () => {
		expect(prettyPrintCamelCase("hello")).toBe("Hello");
	});

	it("should handle PascalCase", () => {
		expect(prettyPrintCamelCase("HelloWorld")).toBe("Hello World");
	});

	it("should handle multiple capital letters", () => {
		expect(prettyPrintCamelCase("myHTTPServer")).toBe("My Httpserver");
	});

	it("should handle already spaced strings", () => {
		expect(prettyPrintCamelCase("Hello World")).toBe("Hello World");
	});
});
