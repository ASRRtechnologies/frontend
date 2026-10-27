/** Replaces underscores with spaces in a string */
const removeUnderscore = (string: string) => string.replace(/_/g, " ");

/**
 * Capitalizes the first letter and lowercases the rest.
 * Returns empty string for non-string or empty inputs.
 */
const capitalizeFirstLetter = (value: unknown) => {
	if (typeof value !== "string") {
		return "";
	}

	if (value.length === 0) {
		return "";
	}

	return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

/**
 * Transforms a TypeScript enum into select/dropdown options.
 * Converts enum values like "SOME_VALUE" to readable labels like "Some value".
 *
 * @param enumObject - The enum or string record to transform
 * @param upperCase - Whether to uppercase the final label (default: false)
 * @returns Array of { value, label, labelSearchValue } option objects
 *
 * @example
 * enum Status { PENDING = "PENDING", IN_PROGRESS = "IN_PROGRESS" }
 * transformEnumToSelectOptions(Status);
 * // Returns: [{ value: "PENDING", label: "Pending", ... }, ...]
 */
export const transformEnumToSelectOptions = (
	enumObject: Record<string, string>,
	upperCase: boolean = false,
) => {
	if (!enumObject) {
		return [];
	}

	return Object?.values(enumObject).map((value) => {
		const label = removeUnderscore(capitalizeFirstLetter(value));
		const transformedLabel = upperCase ? label.toUpperCase() : label;
		return {
			value,
			label: transformedLabel,
			labelSearchValue: transformedLabel,
		};
	});
};
