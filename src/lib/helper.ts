import {upload} from "../middleware/MiddleWares"

export const errorParser = (errorsObj: ErrorParserPropsType) => {
	return Object.fromEntries(
		Object.entries(errorsObj).map(([key, value]) => {
			return [key, value?.message];
		})
	);
};
export const uploadEngine=(name: string)=>{
	upload.single(name)
}

type ErrorParserPropsType = {
	[key: string]: { message: string };
};
