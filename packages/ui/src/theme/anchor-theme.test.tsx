import { Anchor, MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createAppTheme } from "./theme";

/**
 * Mantine's Anchor is a Text, so without a `size` it renders at
 * `--mantine-font-size-md` even in the middle of a smaller sentence: a link in
 * an Alert or a `size="sm"` Typography came out visibly bigger than the words
 * around it. Without a size it now takes the font size of its surroundings.
 */

function renderAnchor(props: { size?: string; fz?: string } = {}) {
	render(
		<MantineProvider theme={createAppTheme()}>
			<Anchor href="#" {...props}>
				link
			</Anchor>
		</MantineProvider>,
	);
	return screen.getByText("link");
}

describe("Anchor theme", () => {
	it("inherits the surrounding font size when no size is given", () => {
		expect(renderAnchor().style.getPropertyValue("--text-fz")).toBe("1em");
	});

	it("keeps an explicit size", () => {
		expect(
			renderAnchor({ size: "xs" }).style.getPropertyValue("--text-fz"),
		).toBe("var(--mantine-font-size-xs)");
	});

	it("keeps an explicit fz, which sets font-size inline over the var", () => {
		expect(renderAnchor({ fz: "lg" }).style.fontSize).toBe(
			"var(--mantine-font-size-lg)",
		);
	});
});
