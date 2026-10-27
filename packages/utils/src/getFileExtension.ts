export const getFileExtension = (fileName: string) => {
	const extension = fileName.split(".").pop();
	return extension ? extension.toLowerCase() : null;
};
