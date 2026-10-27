// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
	buildPdokAddress,
	cityFromWeergavenaam,
	isRealAddressValue,
} from "./pdok-address";

describe("cityFromWeergavenaam", () => {
	it("takes the city from an address weergavenaam, stripping the postal code", () => {
		expect(cityFromWeergavenaam("Zuidkade 11, 2678AB Den Hoorn")).toBe(
			"Den Hoorn",
		);
	});

	it("handles a postal code with a space", () => {
		expect(cityFromWeergavenaam("Zuidkade 11, 2678 AB Den Hoorn")).toBe(
			"Den Hoorn",
		);
	});

	it("takes the last segment for a street weergavenaam", () => {
		expect(cityFromWeergavenaam("Zuidkade, Den Hoorn")).toBe("Den Hoorn");
	});

	it("takes the first segment for woonplaats/gemeente suggestions", () => {
		expect(
			cityFromWeergavenaam(
				"Den Hoorn, Midden-Delfland, Zuid-Holland",
				"woonplaats",
			),
		).toBe("Den Hoorn");
		expect(
			cityFromWeergavenaam("Midden-Delfland, Zuid-Holland", "gemeente"),
		).toBe("Midden-Delfland");
	});

	it("returns undefined for empty input", () => {
		expect(cityFromWeergavenaam("")).toBeUndefined();
		expect(cityFromWeergavenaam("2678AB")).toBeUndefined();
	});
});

describe("buildPdokAddress", () => {
	it("prefers explicit lookup fields", () => {
		expect(
			buildPdokAddress(
				{
					straatnaam: "Zuidkade",
					huisnummer: "11",
					postcode: "2678AB",
					woonplaatsnaam: "Den Hoorn",
				},
				{ weergavenaam: "Zuidkade 11, 2678AB Den Hoorn", type: "adres" },
			),
		).toEqual({
			street: "Zuidkade",
			houseNumber: "11",
			postalCode: "2678AB",
			city: "Den Hoorn",
		});
	});

	it("falls back to parsing the weergavenaam when lookup fields are missing", () => {
		expect(
			buildPdokAddress(
				{},
				{ weergavenaam: "Zuidkade 11, 2678AB Den Hoorn", type: "adres" },
			),
		).toEqual({
			street: "Zuidkade 11",
			houseNumber: undefined,
			postalCode: "",
			city: "Den Hoorn",
		});
	});

	it("never invents an 'Unknown' placeholder", () => {
		const address = buildPdokAddress({}, { weergavenaam: "", type: "adres" });
		expect(address.city).toBe("");
		expect(address.street).toBe("");
		expect(address.postalCode).toBe("");
	});
});

describe("isRealAddressValue", () => {
	it("accepts real values", () => {
		expect(isRealAddressValue("Den Hoorn")).toBe(true);
		expect(isRealAddressValue("Netherlands")).toBe(true);
	});

	it("rejects empty and placeholder values", () => {
		expect(isRealAddressValue(undefined)).toBe(false);
		expect(isRealAddressValue(null)).toBe(false);
		expect(isRealAddressValue("")).toBe(false);
		expect(isRealAddressValue("Unknown")).toBe(false);
		expect(isRealAddressValue("unknown")).toBe(false);
		expect(isRealAddressValue("0000AA")).toBe(false);
	});
});
