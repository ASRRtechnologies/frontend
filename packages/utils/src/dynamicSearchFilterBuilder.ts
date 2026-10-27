/**
 * Builds an array of "key:value" filter strings for API queries.
 * Filters out undefined, null, and empty string values.
 * Returns undefined (not empty array) when no valid filters remain.
 *
 * @template T - The entity type for type-safe filter keys
 * @param filters - Optional partial record of filter key-value pairs
 * @returns Array of "key:value" strings, or undefined if no valid filters
 *
 * @example
 * dynamicSearchFilterBuilder<User>({ status: "active", name: "" });
 * // Returns: ["status:active"] (empty name is filtered out)
 */
export function dynamicSearchFilterBuilder<T>(
	filters?: Partial<Record<keyof T, string>>,
): string[] | undefined {
	if (!filters) return undefined;

	//Filter out undefined, null, and empty string values
	const result = Object.entries(filters)
		.filter(
			([, value]) => value !== undefined && value !== null && value !== "",
		)
		.map(([key, value]) => `${key}:${value}`);

	// Return undefined instead of empty array to avoid empty query params
	return result.length > 0 ? result : undefined;
}
