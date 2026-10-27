export function formatBytes(input: number): string {
	const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	let l = 0;
	let n = input || 0;
	while (n >= 1000 && ++l) {
		n /= 1000;
	}
	const floored = Math.floor(Number(n.toFixed(n >= 10 || l < 1 ? 0 : 1)));

	return `${floored} ${units[l]}`;
}
