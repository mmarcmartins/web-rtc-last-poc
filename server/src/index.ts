import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import { roomHandler } from './room';

const PORT = 3001;

const app = express();
app.use(cors);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('user is c onnected');
    socket.on('disconnected', () => {
        console.log('user is disconnected');
    })
    roomHandler(socket, io);
});

server.listen(PORT,() => { 
    console.log(`Server is running on port ${PORT} 🔥`)
});