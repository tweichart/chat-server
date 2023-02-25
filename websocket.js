import * as dotenv from 'dotenv';
import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import SocketEvents from '#Events/SocketEvents.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    path: `/${process.env.WEBSOCKET_PATH}`,
});

// bind main socket event
const socketEvents = new SocketEvents(io);
io.on('connection', (socket) => socketEvents.connection(socket));

server.listen(process.env.WEBSOCKET_LOCAL_PORT || 8080, () => {
    console.log('Websocket listening');
});
