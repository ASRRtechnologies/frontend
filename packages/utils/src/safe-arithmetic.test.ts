// @vitest-environment node
import { describe, expect, it } from "vitest";
import { evaluateArithmetic } from "./safe-arithmetic";

describe("evaluateArithmetic", () => {
	it("evaluates arithmetic with precedence, parentheses and unary minus", () => {
		expect(evaluateArithmetic("1 + 2 * 3")).toBe(7);
		expect(evaluateArithmetic("(1 + 2) * 3")).toBe(9);
		expect(evaluateArithmetic("-4 / 2 + 10 % 4")).toBe(0);
		expect(evaluateArithmetic("2.5 * 4")).toBe(10);
		expect(evaluateArithmetic("1e3 + .5")).toBe(1000.5);
		expect(evaluateArithmetic("  42  ")).toBe(42);
		expect(evaluateArithmetic("-(3 - 5)")).toBe(2);
	});

	it("is NaN for anything that is not arithmetic (never executes code)", () => {
		// These used to reach eval(): a stored view formula could run script in colleagues' browsers.
		expect(evaluateArithmetic("alert(1)")).toBeNaN();
		expect(evaluateArithmetic("window.location='x'")).toBeNaN();
		expect(evaluateArithmetic("1; fetch('/')")).toBeNaN();
		expect(evaluateArithmetic("Math.PI")).toBeNaN();
		expect(evaluateArithmetic("(1 + 2")).toBeNaN();
		expect(evaluateArithmetic("1 +")).toBeNaN();
		expect(evaluateArithmetic("")).toBeNaN();
		expect(evaluateArithmetic("@var + 1")).toBeNaN();
	});

	it("is NaN for non-finite results", () => {
		expect(evaluateArithmetic("1 / 0")).toBeNaN();
	});
});
