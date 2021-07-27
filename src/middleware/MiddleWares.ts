import dotenv from 'dotenv';
import { NextFunction } from 'express';
import { ElementAccessExpression } from 'typescript';
import {IHandlerProps} from "../../server"

dotenv.config();

const notFound = (req: Express.Request |any, res: Express.Response | any, next : NextFunction ) => {
	const error = new Error(`Not found ${req.originalUrl}`);
	res.status(404);
	next(error);
};

const errorHandler  = (error:any, req: Express.Request |any, res: Express.Response | any, next: NextFunction) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		statusCode: statusCode,
		message: error.message,
		stacktrace: process.env.ENVIROMENT === 'PRODUCTION' ? 'READ API ROUTS...' : error.stack
	});
};

export const objectFilter = (obj: Object, preventedValue: string | any) => {
	return Object.fromEntries(
		Object.entries(obj)
			.filter(([key, value]) => !preventedValue.includes(value))
			.map(([key, value]) => {
				try {
					return [key, value.trim()];
				} catch (error) {
					return [key, value];
				}
			})
	);
};

export default { notFound, errorHandler };
