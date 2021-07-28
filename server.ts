import express, {  Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import middleWares from './src/middleware/MiddleWares';
import DBConfiguration from './config/DBConfiguration';
import UserRoutes from './src/routes/User.routes';
import WineRoutes from './src/routes/Wine.routes';


export type IHandlerProps = (req: Request, res: Response) => Promise<any | undefined>;

const app:Application = express();

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

UserRoutes.userRoutes(app);
WineRoutes.wineRoutes(app);

app.use(middleWares.notFound);
app.use(middleWares.errorHandler);

export default app;
