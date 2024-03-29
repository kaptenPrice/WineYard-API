import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs, { readFileSync } from 'fs';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './src/middleware/MiddleWares';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import DBConfiguration from './config/DBConfiguration';
import UserRoutes from './src/routes/User.routes';
import WineRoutes from './src/routes/Wine.routes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

i18next
	.use(Backend)
	.use(middleware.LanguageDetector)
	.init({
		fallbackLng: 'en',
		backend: {
			loadPath: './locales/{{lng}}/translation.json'
		}
	});

const app: Application = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
	transports: ['websocket', 'polling'],
	cors: { origin: 'http://localhost:3000', credentials: true }
});
io.on('connect', (socket) => {
	console.log('A user is connected');
	socket.on('message', () => {
		console.log(`message from ${socket.id}`);
	});
	socket.on('disconnect', () => {
		console.log(`socket ${socket.id} disconnected`);
	});
});
export { io };

app.use(middleware.handle(i18next));

app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(
	cors({ origin: ['https://miwine.netlify.app', 'http://localhost:3000'], credentials: true })
);
app.use(express.json({ limit: '25mb' }));

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

DBConfiguration.connectToPort(httpServer);

app.use('/uploads/:id', (req, res) => {
	res.setHeader('Content-Type', 'image/*');
	const file = readFileSync(path.join(__dirname, 'uploads', req.params.id));
	res.send(file);
});

//src={dn/avatar}
UserRoutes.userRoutes(app);
WineRoutes.wineRoutes(app);

// app.use(notFound);
// app.use(errorHandler);

export default app;
export type IHandlerProps = (req: Request, res: Response) => Promise<any | undefined>;

type RequestType = Request & { file: any; files: any[] };
