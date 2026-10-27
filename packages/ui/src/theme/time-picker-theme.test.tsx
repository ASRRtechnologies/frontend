import { MantineProvider } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createAppTheme } from "./theme";

/**
 * Reported from the field (Lars, 26-aug-2026): on a phone you can change an
 * appointment's date but not its time — the time field is two numeric text
 * inputs, so a phone offers a keyboard and no way to scroll to a time.
 */

const originalMatchMedia = window.matchMedia;

function setPointer(kind: "coarse" | "fine") {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		configurable: true,
		value: (query: string) => ({
			matches: query.includes("pointer: coarse") && kind === "coarse",
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}),
	});
}

/** The two `TimePicker` spin inputs (hours, minutes) inside the dropdown. */
function timeFields() {
	return Array.from(
		document.querySelectorAll<HTMLInputElement>(".mantine-TimePicker-field"),
	);
}

async function renderOpenedPicker() {
	render(
		<MantineProvider theme={createAppTheme()}>
			<DateTimePicker label="Start" defaultValue="2026-08-26 13:00:00" />
		</MantineProvider>,
	);
	const input = document.querySelector(".mantine-DateTimePicker-input");
	if (!input) throw new Error("date-time picker input not rendered");
	fireEvent.click(input);
	await waitFor(() => expect(timeFields()).toHaveLength(2));
	return timeFields();
}

afterEach(() => {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		configurable: true,
		value: originalMatchMedia,
	});
});

describe("time picker theme defaults", () => {
	it("offers a scrollable list of times when the time field is focused", async () => {
		setPointer("fine");
		const [hours] = await renderOpenedPicker();

		fireEvent.focus(hours);

		// Mantine renders each selectable time as a control carrying data-value.
		await waitFor(() =>
			expect(
				document.querySelectorAll(".mantine-TimePicker-control[data-value]")
					.length,
			).toBeGreaterThan(0),
		);
	});

	it("suppresses the on-screen keyboard on touch devices so the list stays visible", async () => {
		setPointer("coarse");
		for (const field of await renderOpenedPicker()) {
			expect(field).toHaveAttribute("inputmode", "none");
		}
	});

	it("keeps the time fields typable with a mouse and keyboard", async () => {
		setPointer("fine");
		for (const field of await renderOpenedPicker()) {
			expect(field).toHaveAttribute("inputmode", "numeric");
		}
	});

	it("opens as a centred modal on touch, so the time row is never off-screen", async () => {
		setPointer("coarse");
		await renderOpenedPicker();

		const pickerModal = document.querySelector("[data-dates-modal]");
		expect(pickerModal).not.toBeNull();

		// Pickers are opened from inside a form modal; both would otherwise share
		// Mantine's default modal z-index (200) and the picker would render behind.
		const zIndex = (pickerModal as HTMLElement).style.getPropertyValue(
			"--mb-z-index",
		);
		expect(Number(zIndex)).toBeGreaterThan(200);
	});

	it("keeps the anchored popover on pointer devices", async () => {
		setPointer("fine");
		await renderOpenedPicker();

		expect(document.querySelector("[data-dates-modal]")).toBeNull();
	});
});
