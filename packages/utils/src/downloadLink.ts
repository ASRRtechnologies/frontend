type DownloadLinkInput = Blob | string | URL;

type DownloadLinkOptions = {
	revokeDelayMs?: number;
};

export async function downloadLink(
	input: DownloadLinkInput,
	fileName: string,
	opts?: DownloadLinkOptions,
) {
	const revokeDelay = opts?.revokeDelayMs ?? 1_500;

	const isBlob = typeof input !== "string" && !(input instanceof URL);
	const href = isBlob
		? URL.createObjectURL(input)
		: input instanceof URL
			? input.href
			: input;

	const anchor = document.createElement("a");
	anchor.style.display = "none";
	anchor.href = href;
	anchor.download = fileName;

	document.body.appendChild(anchor);

	try {
		const supportsDownload = "download" in HTMLAnchorElement.prototype;

		if (!supportsDownload && !isBlob) {
			window.open(href, "_blank", "noopener,noreferrer");
		} else {
			anchor.click();
		}
	} finally {
		document.body.removeChild(anchor);

		if (isBlob) {
			setTimeout(() => URL.revokeObjectURL(href), revokeDelay);
		}
	}
}
