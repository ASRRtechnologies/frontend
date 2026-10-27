import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { downloadLink } from "./downloadLink";

describe("downloadLink", () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let appendChildSpy: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let removeChildSpy: any;
	let clickSpy: ReturnType<typeof vi.fn>;
	const createObjectURLMock = vi.fn(() => "blob:mock-url");
	const revokeObjectURLMock = vi.fn();

	beforeEach(() => {
		clickSpy = vi.fn();
		appendChildSpy = vi
			.spyOn(document.body, "appendChild")
			.mockImplementation((node) => node);
		removeChildSpy = vi
			.spyOn(document.body, "removeChild")
			.mockImplementation((node) => node);
		globalThis.URL.createObjectURL = createObjectURLMock;
		globalThis.URL.revokeObjectURL = revokeObjectURLMock;

		vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
			if (tag === "a") {
				const el = {
					style: {},
					href: "",
					download: "",
					click: clickSpy,
				} as any;
				return el;
			}
			return document.createElement(tag);
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should create an anchor element and click it for string URLs", async () => {
		await downloadLink("https://example.com/file.pdf", "file.pdf");
		expect(appendChildSpy).toHaveBeenCalled();
		expect(clickSpy).toHaveBeenCalled();
		expect(removeChildSpy).toHaveBeenCalled();
	});

	it("should create object URL for Blobs and revoke after delay", async () => {
		vi.useFakeTimers();
		const blob = new Blob(["test"], { type: "text/plain" });
		await downloadLink(blob, "test.txt", { revokeDelayMs: 100 });

		expect(createObjectURLMock).toHaveBeenCalledWith(blob);
		expect(clickSpy).toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:mock-url");
		vi.useRealTimers();
	});

	it("should handle URL objects", async () => {
		const url = new URL("https://example.com/file.pdf");
		await downloadLink(url, "file.pdf");
		expect(clickSpy).toHaveBeenCalled();
	});
});
