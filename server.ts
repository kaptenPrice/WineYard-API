import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import MiddleWares from './src/middleware/MiddleWares';
import i18next from 'i18next';
import Backend from "i18next-fs-backend"
import middleware  from "i18next-http-middleware";
import DBConfiguration from './config/DBConfiguration';
import UserRoutes from './src/routes/User.routes';
import WineRoutes from './src/routes/Wine.routes';

i18next.use(Backend).use(middleware.LanguageDetector).init({
	fallbackLng:"en",
	backend:{
		loadPath:"./locales/{{lng}}/translation.json"
	}
})

const app: Application = express();
app.use(middleware.handle(i18next))

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['https://miwine.netlify.app'], credentials: true}));
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
app.options('*', cors())

DBConfiguration.connectToDB();
DBConfiguration.connectToPort(app);

UserRoutes.userRoutes(app);
WineRoutes.wineRoutes(app);

app.use(MiddleWares.notFound);
app.use(MiddleWares.errorHandler);

export default app;
export type IHandlerProps = (req: Request, res: Response) => Promise<any | undefined>;
