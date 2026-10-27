// @vitest-environment node
import { describe, expect, it } from "vitest";
import { mailtoUrl, safeEmail, telUrl, whatsappUrl } from "./contact-links";

describe("mailtoUrl", () => {
	it("builds a mailto for an ordinary address", () => {
		expect(mailtoUrl("jan@example.com")).toBe("mailto:jan%40example.com");
	});

	it("refuses an address carrying extra mail headers", () => {
		// The whole point: a lead submitted through a public widget must not be able to
		// pre-fill the team member's own mail client with recipients they did not choose.
		expect(mailtoUrl("jan@example.com?bcc=exfil@evil.com")).toBeNull();
		expect(mailtoUrl("jan@example.com&cc=exfil@evil.com")).toBeNull();
		expect(
			mailtoUrl("jan@example.com?subject=Factuur&body=Maak%20over"),
		).toBeNull();
	});

	it("refuses an address with a newline folded into it", () => {
		expect(mailtoUrl("jan@example.com\nbcc:exfil@evil.com")).toBeNull();
		expect(mailtoUrl("jan@example.com%0Abcc:exfil@evil.com")).toBeNull();
	});

	it("refuses anything that is not an address at all", () => {
		expect(mailtoUrl("javascript:alert(1)")).toBeNull();
		expect(mailtoUrl("not an email")).toBeNull();
		expect(mailtoUrl("")).toBeNull();
		expect(mailtoUrl(null)).toBeNull();
		expect(mailtoUrl(undefined)).toBeNull();
	});

	it("accepts the shapes real addresses come in", () => {
		expect(safeEmail("  jan.de.vries+crm@sub.example.co.uk  ")).toBe(
			"jan.de.vries+crm@sub.example.co.uk",
		);
	});
});

describe("telUrl", () => {
	it("builds a tel for a number people actually type", () => {
		expect(telUrl("+31 6 12345678")).toBe("tel:%2B31%206%2012345678");
		expect(telUrl("(020) 123-4567")).toBe("tel:(020)%20123-4567");
	});

	it("refuses anything with URL syntax in it", () => {
		expect(telUrl("+31612345678?foo=bar")).toBeNull();
		expect(telUrl("javascript:alert(1)")).toBeNull();
		expect(telUrl("12")).toBeNull();
		expect(telUrl(null)).toBeNull();
	});
});

describe("whatsappUrl", () => {
	it("strips a number down to the digits wa.me wants", () => {
		expect(whatsappUrl("+31 6 12345678")).toBe("https://wa.me/31612345678");
	});

	it("refuses a number it could not validate", () => {
		expect(whatsappUrl("+31612345678&text=pay%20me")).toBeNull();
		expect(whatsappUrl(null)).toBeNull();
	});
});
