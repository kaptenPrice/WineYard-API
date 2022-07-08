import { Server } from 'socket.io';
import { createServer } from 'http';
import app from '../../server';

const httpServer = createServer(app);

export const io = new Server(httpServer, {
	transports: ['websocket', 'polling'],
	cors: { origin: 'http://localhost:3000', credentials: true }
});
