import { getCurrencySymbol } from "./getCurrencySymbol";

export interface LocaleFormatInfo {
	locale: string;
	decimalSeparator: string;
	thousandSeparator: string;
	currency: string;
	currencySymbol: string;
}

export const DEFAULT_LOCALE_FORMAT: LocaleFormatInfo = {
	locale: "nl-NL",
	decimalSeparator: ",",
	thousandSeparator: ".",
	currency: "EUR",
	currencySymbol: "€",
};

export function buildLocale(language: string, country: string): string {
	if (!language || !country) return "nl-NL";
	return `${language}-${country}`;
}

export function getLocaleFormatInfo(
	locale: string,
	currency: string,
): LocaleFormatInfo {
	const parts = new Intl.NumberFormat(locale, {
		style: "decimal",
		minimumFractionDigits: 2,
		useGrouping: true,
	}).formatToParts(12345.6);

	const decimal = parts.find((p) => p.type === "decimal")?.value ?? ",";
	const group = parts.find((p) => p.type === "group")?.value ?? ".";

	return {
		locale,
		decimalSeparator: decimal,
		thousandSeparator: group,
		currency,
		currencySymbol: getCurrencySymbol(currency) || currency,
	};
}
