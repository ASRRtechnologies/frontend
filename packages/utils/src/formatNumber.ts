export function formatNumber(
	input: number,
	minDigits?: number,
	maxDigits?: number,
	locale = "nl-NL",
): string {
	const options: Intl.NumberFormatOptions = {};
	if (minDigits !== undefined) options.minimumFractionDigits = minDigits;
	if (maxDigits !== undefined) options.maximumFractionDigits = maxDigits;
	return new Intl.NumberFormat(locale, options).format(input);
}
