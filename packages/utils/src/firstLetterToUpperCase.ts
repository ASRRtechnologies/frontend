export const firstLetterToUpperCase = (str: string | undefined): string => {
	if (!str || str.length === 0) return "";

	return str.charAt(0).toUpperCase() + str.slice(1);
};
