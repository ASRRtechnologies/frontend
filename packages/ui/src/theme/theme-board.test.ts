// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createAppTheme, theme } from "./theme";

/**
 * The component board ("Alpha Component Board", Sidebar and dashboard
 * redesign) is the contract the Mantine theme implements. These pin the
 * numbers a designer would notice first, so a well-meaning "let's make
 * buttons pills again" cannot land unnoticed.
 */
describe("theme follows the component board", () => {
	it("uses Poppins for text and headings", () => {
		expect(theme.fontFamily).toMatch(/^Poppins/);
		expect(theme.headings.fontFamily).toMatch(/^Poppins/);
		expect(theme.headings.fontWeight).toBe("600");
	});

	it("carries the board's radius scale — 6 / 10 / 14, default 10", () => {
		expect(theme.radius.sm).toBe("6px");
		expect(theme.radius.md).toBe("10px");
		expect(theme.radius.lg).toBe("14px");
		expect(theme.defaultRadius).toBe("10px");
	});

	it("buttons are rounded rectangles, not pills, by default", () => {
		const defaults = theme.components.Button?.defaultProps as
			| { radius?: string }
			| undefined;
		expect(defaults?.radius).toBeUndefined();
	});

	it("cards sit on the default 10px radius", () => {
		const radiusOf = (component?: { defaultProps?: object }) =>
			(component?.defaultProps as { radius?: string } | undefined)?.radius;
		expect(radiusOf(theme.components.Paper)).toBeUndefined();
		expect(radiusOf(theme.components.Card)).toBeUndefined();
	});

	it("primary hover is the board's #0353d6 when no tenant accent is set", () => {
		expect(theme.colors.primary[6]).toBe("#0969ff");
		expect(theme.colors.primary[7]).toBe("#0353d6");
		// A tenant accent still generates its own ramp untouched.
		expect(createAppTheme(undefined, "#ff0000").colors.primary[6]).toBe(
			"#ff0000",
		);
	});

	it("elevation is the board's xs / md / lg, from the token layer", () => {
		expect(theme.shadows.xs).toBe("var(--shadow-xs)");
		expect(theme.shadows.md).toBe("var(--shadow-md)");
		expect(theme.shadows.lg).toBe("var(--shadow-lg)");
	});

	it("modals open at radius 14 in 180ms on the board's curve", () => {
		const defaults = theme.components.Modal?.defaultProps as {
			radius?: string;
			transitionProps?: { duration?: number; timingFunction?: string };
		};
		expect(defaults.radius).toBe("14px");
		expect(defaults.transitionProps?.duration).toBe(180);
		expect(defaults.transitionProps?.timingFunction).toBe(
			"cubic-bezier(0.2, 0, 0, 1)",
		);
	});

	it("skeletons are the board's radius 6", () => {
		expect(theme.components.Skeleton?.defaultProps).toMatchObject({
			radius: "6px",
		});
	});
});
