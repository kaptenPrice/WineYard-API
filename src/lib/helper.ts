export const errorParser = (errorsObj: ErrorParserPropsType) => {
	return Object.fromEntries(
		Object.entries(errorsObj).map(([key, errorObj]) => {
			return [key, errorObj?.message];
		})
	);
};

type ErrorParserPropsType = {
	[key: string]: { message: string };
};
