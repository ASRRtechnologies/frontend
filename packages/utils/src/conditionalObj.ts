export const conditionalObj = <T>(v: T | false | null | undefined) =>
	v ? [v] : [];
