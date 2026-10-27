/**
 * Formats a number as a currency string using Intl.NumberFormat.
 * Handles negative zero (-0) edge case by displaying as negative.
 *
 * @param input - The number to format (undefined treated as 0)
 * @param currency - ISO 4217 currency code (default: "EUR")
 * @param locale - BCP 47 locale string for formatting (default: "nl-NL")
 * @param maximumFractionDigits - Max decimal places to show (default: 2)
 * @returns Formatted currency string (e.g., "€ 1.234,56" or "-€ 100,00")
 */
export function formatCurrency(
	input: number | undefined,
	currency = "EUR",
	locale = "nl-NL",
	maximumFractionDigits = 2,
): string {
	const n = input ?? 0;
	const isNegative = n < 0 || Object.is(n, -0); // handle -0 edge case
	const abs = Math.abs(n);

	// A locale writes its own dollar as a bare "$" (nl-SR does for SRD). Next to
	// USD amounts that reads as US dollars, so only USD keeps the bare sign and
	// every other currency falls back to its code there.
	const formatted = new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		maximumFractionDigits,
		signDisplay: "never", // keep the formatter from adding its own minus
	})
		.formatToParts(abs)
		.map((part) =>
			part.type === "currency" &&
			part.value === "$" &&
			currency.toUpperCase() !== "USD"
				? currency.toUpperCase()
				: part.value,
		)
		.join("");

	return isNegative ? `-${formatted}` : formatted;
}
