/**
 * Helpers for turning PDOK Locatieserver results into address fields.
 * https://api.pdok.nl/bzk/locatieserver/search/v3_1
 */

export interface PdokAddressSuggestion {
	weergavenaam: string;
	type?: string;
}

export interface PdokAddressLookup {
	straatnaam?: string;
	huisnummer?: string;
	postcode?: string;
	woonplaatsnaam?: string;
	gemeentenaam?: string;
}

const POSTAL_CODE = /^\d{4}\s?[A-Z]{2}$/i;
const POSTAL_CODE_DIGITS = /^\d{4}$/;
const POSTAL_CODE_LETTERS = /^[A-Z]{2}$/i;

/**
 * Extract the place name from a PDOK weergavenaam.
 * Address/street names end with the place ("Zuidkade 11, 2678AB Den Hoorn"),
 * while woonplaats/gemeente suggestions start with it
 * ("Den Hoorn, Midden-Delfland, Zuid-Holland").
 */
export function cityFromWeergavenaam(
	weergavenaam: string,
	type?: string,
): string | undefined {
	const segments = weergavenaam
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	if (segments.length === 0) return undefined;

	if (type === "woonplaats" || type === "gemeente") {
		return segments[0];
	}

	const words = segments[segments.length - 1].split(/\s+/);
	if (POSTAL_CODE.test(words[0])) {
		words.shift();
	} else if (
		words.length >= 2 &&
		POSTAL_CODE_DIGITS.test(words[0]) &&
		POSTAL_CODE_LETTERS.test(words[1])
	) {
		words.splice(0, 2);
	}
	const city = words.join(" ").trim();
	return city || undefined;
}

/**
 * Build address fields from a PDOK lookup result, falling back to the
 * suggestion's weergavenaam. Missing fields stay empty — never store
 * placeholder values like "Unknown".
 */
export function buildPdokAddress(
	result: PdokAddressLookup,
	suggestion: PdokAddressSuggestion,
) {
	return {
		street:
			result.straatnaam ?? suggestion.weergavenaam.split(",")[0]?.trim() ?? "",
		houseNumber: result.huisnummer || undefined,
		postalCode: result.postcode ?? "",
		city:
			result.woonplaatsnaam ??
			result.gemeentenaam ??
			cityFromWeergavenaam(suggestion.weergavenaam, suggestion.type) ??
			"",
	};
}

const ADDRESS_PLACEHOLDERS = new Set(["unknown", "0000aa"]);

/**
 * True when an address field holds an actual value — filters out empties and
 * the "Unknown"/"0000AA" placeholders that older code stored, so they never
 * end up in user-facing text such as AI prompts.
 */
export function isRealAddressValue(
	value: string | null | undefined,
): value is string {
	return !!value && !ADDRESS_PLACEHOLDERS.has(value.trim().toLowerCase());
}
