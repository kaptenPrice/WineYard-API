import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs, { readFileSync } from 'fs';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import MongoDBConfiguration from './config/MongoDBConfiguration';
// import UserRoutes from './src/routes/User.routes';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { json, urlencoded } from 'body-parser';
import PsqlDBConfig from './config/PsqlDBConfig';
import userRoutes from './src/routes/User.routes';
import organizationsRoutes from './src/routes/Organizations.routes';
import { domainsRoutes } from './src/routes/Domains.routes';
import { cardRoutes } from './src/routes/Cards.routes';

dotenv.config();

const app: Application = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(helmet());
app.use(
	morgan('common', {
		stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
			flags: 'a'
		})
	})
);

PsqlDBConfig.connectToPort(app);

/**App routes */
userRoutes(app);
organizationsRoutes(app);
domainsRoutes(app);
cardRoutes(app);

export default app;

export type HandlerProps = (req: Request, res: Response) => Promise<any | undefined>;

type RequestType = Request & { file: any; files: any[] };



// export const io = new Server(httpServer, {
// 	transports: ['websocket', 'polling'],
// 	cors: { origin: 'http://localhost:3000', credentials: true }
// });
// io.on('connect', (socket) => {
// 	console.log('A user is connected');
// 	socket.on('message', () => {
// 		console.log(`message from ${socket.id}`);
// 	});
// 	socket.on('disconnect', () => {
// 		console.log(`socket ${socket.id} disconnected`);
// 	});
// });
// export { io };

// app.use('/uploads/:id', (req, res) => {
// 	res.setHeader('Content-Type', 'image/*');
// 	const file = readFileSync(path.join(__dirname, 'uploads', req.params.id));
// 	res.send(file);
// });

//src={dn/avatar}
// UserRoutes.userRoutes(app);
// WineRoutes.wineRoutes(app);

//  app.use(notFound);
//  app.use(errorHandler);
