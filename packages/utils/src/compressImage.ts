/**
 * Compress an image file using canvas.
 * @param file - The original image file
 * @param maxWidth - Maximum width (default 1920)
 * @param maxHeight - Maximum height (default 1080)
 * @param quality - JPEG quality 0-1 (default 0.8)
 * @param outputType - Output MIME type (default "image/jpeg"). Use "image/png" to preserve transparency.
 * @returns Compressed image as a Blob
 */
export async function compressImage(
	file: File,
	maxWidth = 1920,
	maxHeight = 1080,
	quality = 0.8,
	outputType: "image/jpeg" | "image/png" = "image/jpeg",
): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			// Calculate new dimensions maintaining aspect ratio
			let { width, height } = img;

			if (width > maxWidth) {
				height = (height * maxWidth) / width;
				width = maxWidth;
			}
			if (height > maxHeight) {
				width = (width * maxHeight) / height;
				height = maxHeight;
			}

			// Create canvas and draw resized image
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Could not get canvas context"));
				return;
			}

			ctx.drawImage(img, 0, 0, width, height);

			// Convert to blob
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error("Could not compress image"));
					}
				},
				outputType,
				quality,
			);
		};

		img.onerror = () => reject(new Error("Could not load image"));
		img.src = URL.createObjectURL(file);
	});
}
