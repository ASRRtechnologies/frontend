export function prettyPrintName(name: string) {
	return name
		?.split("_")
		.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

export function prettyPrintCamelCase(name: string) {
	return name
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}
