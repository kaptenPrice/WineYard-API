import express, { Application, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DBConfiguration from './config/DBConfiguration';
import staticRouter from 'express-static-router';
import { RequestType } from './src/lib/PasswordUtils';
/* import middleWares from './src/middleware/MiddleWares';
 */
export type IHandlerProps = (req: RequestType, res: Response) => Promise<any | undefined> | void;

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(
	morgan('common', {
		stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
			flags: 'a'
		})
	})
);

DBConfiguration.connectToDB();
DBConfiguration.connectToPort(app);

//TODO: Move comments to the new router folder files
//TODO: Delete routes & controller folder.
//TODO: Rename router to controller.
staticRouter('./src/router', app /* , { printDetectedRoutes: false } */);

/* app.use(middleWares.notFound);
app.use(middleWares.errorHandler); */

export default app;
