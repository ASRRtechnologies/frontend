export type CurrencyCode =
	| "USD"
	| "EUR"
	| "GBP"
	| "JPY"
	| "CAD"
	| "AUD"
	| "CHF"
	| "CNY"
	| "INR"
	| "SRD";

export const getCurrencySymbol = (
	currencyCode: CurrencyCode | null | string,
): string => {
	if (!currencyCode) {
		return "";
	}

	const symbols: { [key: string]: string } = {
		USD: "$",
		EUR: "€",
		GBP: "£",
		JPY: "¥",
		CAD: "$",
		AUD: "$",
		CHF: "CHF",
		CNY: "¥",
		INR: "₹",
		SRD: "SRD",
	};

	return symbols[currencyCode.toUpperCase()] || "";
};
