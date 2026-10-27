// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolver } from "./theme";

/**
 * Light-mode textbox contrast is an accessibility floor, not a taste call: on a
 * cheap or washed-out panel a 2:1 placeholder is simply not there, and a field
 * with no edge at all is not a field.
 *
 * The design gives a light field a *tint* of the surface under it rather than a
 * white box with a line round it, so the fill is the affordance and the border is
 * only a hairline. Two consequences this file pins:
 *   - the tint has to be perceptible over both surfaces a field lands on (the
 *     white card and the page ground) — the same fill sits on both;
 *   - the border must stay a hairline. It used to be #7e8694, a line dark enough
 *     to read as black against a white card, and that is the regression to catch.
 *
 * Thresholds: WCAG 2.2 AA — 1.4.3 (text) 4.5:1.
 */

const STYLES_DIR = join(import.meta.dirname, ".");

type Rgb = [number, number, number];

/** Custom properties declared under a color-scheme block of a stylesheet. */
function readLightBlock(file: string): Map<string, string> {
	const css = readFileSync(join(STYLES_DIR, file), "utf8");
	const block = css.match(
		/:root\[data-mantine-color-scheme="light"\]\s*\{([\s\S]*?)\n\}/,
	);
	if (!block) throw new Error(`light color-scheme block not found in ${file}`);
	const tokens = new Map<string, string>();
	for (const [, name, value] of block[1].matchAll(
		/(--[\w-]+)\s*:\s*([^;]+);/g,
	)) {
		tokens.set(name, value.trim());
	}
	return tokens;
}

/** Follows `var(--x)` chains to the literal a token finally resolves to. */
function literal(tokens: Map<string, string>, name: string): string {
	let value = tokens.get(name);
	for (let hops = 0; value && hops < 5; hops++) {
		const indirect = value.match(/^var\((--[\w-]+)\)$/);
		if (!indirect) break;
		value = tokens.get(indirect[1]);
	}
	if (!value) throw new Error(`${name} does not resolve to a literal`);
	return value;
}

/** `#rrggbb` or `rgba(r, g, b, a)` → channels plus alpha. */
function parse(color: string): { rgb: Rgb; alpha: number } {
	const hex = color.match(/^#([0-9a-f]{6})$/i);
	if (hex) {
		const n = Number.parseInt(hex[1], 16);
		return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], alpha: 1 };
	}
	const rgba = color.match(
		/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)$/,
	);
	if (!rgba) throw new Error(`cannot parse colour ${color}`);
	return {
		rgb: [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])],
		alpha: rgba[4] === undefined ? 1 : Number(rgba[4]),
	};
}

/** What a (possibly translucent) token actually looks like over a backdrop. */
function composite(color: string, backdrop: Rgb): Rgb {
	const { rgb, alpha } = parse(color);
	return rgb.map((c, i) =>
		Math.round(alpha * c + (1 - alpha) * backdrop[i]),
	) as Rgb;
}

function relativeLuminance([r, g, b]: Rgb): number {
	const channels = [r, g, b].map((value) => {
		const c = value / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: Rgb, b: Rgb): number {
	const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort(
		(x, y) => y - x,
	);
	return (light + 0.05) / (dark + 0.05);
}

describe("light-mode textbox contrast", () => {
	const palette = readLightBlock("globals.scss");
	const inputTokens = readLightBlock("input.module.scss");
	// The input tokens reference the palette, so resolve against both.
	const all = new Map([...palette, ...inputTokens]);

	// The two surfaces the same field lands on: the page ground and a white card.
	const page = composite(literal(palette, "--light-bg-primary"), [0, 0, 0]);
	const card = composite(literal(palette, "--surface-card"), [0, 0, 0]);

	// Resolved per assertion, not up front: a token that goes missing should fail
	// the one test that depends on it, not collection of the whole file.
	const fillOn = (backdrop: Rgb) =>
		composite(literal(all, "--input-background"), backdrop);
	const placeholder = () =>
		composite(literal(all, "--input-placeholder"), card);

	it("tints the field off both surfaces it can sit on", () => {
		// A translucent fill is what lets one token work on the page and in a card;
		// a flat hex would vanish against one of the two.
		expect(parse(literal(all, "--input-background")).alpha).toBeLessThan(1);
		for (const backdrop of [page, card]) {
			expect(fillOn(backdrop)).not.toEqual(backdrop);
		}
	});

	it("keeps the border a hairline rather than a drawn line", () => {
		// The regression: #7e8694 against a white fill was 3.67:1 — a hard outline
		// round every pill. The design's field edge is the --w07 hairline.
		const border = composite(literal(all, "--input-border"), card);
		expect(contrast(border, fillOn(card))).toBeLessThan(1.5);
	});

	it("placeholder text clears AA on the field, over either surface", () => {
		// Worst case is the page ground, not the card: the tint darkens with it.
		for (const backdrop of [page, card]) {
			expect(contrast(placeholder(), fillOn(backdrop))).toBeGreaterThanOrEqual(
				4.5,
			);
		}
	});

	it("entered and dimmed text clear AA on the field, over either surface", () => {
		for (const backdrop of [page, card]) {
			expect(
				contrast(composite(literal(palette, "--tx"), card), fillOn(backdrop)),
			).toBeGreaterThanOrEqual(4.5);
			expect(
				contrast(composite(literal(palette, "--tx2"), card), fillOn(backdrop)),
			).toBeGreaterThanOrEqual(4.5);
		}
	});

	it("wires the field placeholder into Mantine's global placeholder variable", () => {
		// Mantine defaults this to its own gray-5 (#adb5bd, 2.07:1) — every input
		// that does not carry the local `.input` class would silently keep that.
		const light = resolver({} as never).light as Record<string, string>;
		expect(light["--mantine-color-placeholder"]).toBe(
			"var(--input-placeholder)",
		);
	});
});
