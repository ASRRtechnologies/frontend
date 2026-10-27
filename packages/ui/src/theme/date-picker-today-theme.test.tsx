import { MantineProvider } from "@mantine/core";
import {
	DateInput,
	DatePicker,
	DatePickerInput,
	DateTimePicker,
} from "@mantine/dates";
import { fireEvent, render, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { createAppTheme } from "./theme";

/**
 * Reported from the field (Milan, FIVE TWENTY, 14-okt-2026): picking a date
 * meant hunting for today in the calendar every time — Mantine leaves
 * `highlightToday` off, so today looks like every other day. The theme turns
 * it on for every picker that shows a month grid.
 */

function todayCell() {
	const today = new Date();
	return Array.from(
		document.querySelectorAll<HTMLElement>("[data-today]"),
	).find(
		(el) =>
			el.hasAttribute("data-today") &&
			Number(el.textContent) === today.getDate(),
	);
}

async function openAndFindToday(picker: ReactNode, inputSelector?: string) {
	render(<MantineProvider theme={createAppTheme()}>{picker}</MantineProvider>);
	if (inputSelector) {
		const input = document.querySelector(inputSelector);
		if (!input) throw new Error(`${inputSelector} not rendered`);
		fireEvent.click(input);
	}
	await waitFor(() => expect(todayCell()).toBeTruthy());
	return todayCell() as HTMLElement;
}

describe("date picker theme highlights today", () => {
	it.each([
		[
			"DatePickerInput",
			<DatePickerInput key="a" label="Datum" />,
			".mantine-DatePickerInput-input",
		],
		[
			"DateInput",
			<DateInput key="b" label="Datum" />,
			".mantine-DateInput-input",
		],
		[
			"DateTimePicker",
			<DateTimePicker key="c" label="Datum" />,
			".mantine-DateTimePicker-input",
		],
		["DatePicker", <DatePicker key="d" />, undefined],
	])("%s marks today", async (_name, picker, selector) => {
		const cell = await openAndFindToday(picker, selector);
		expect(cell).toHaveAttribute("data-highlight-today");
	});
});
