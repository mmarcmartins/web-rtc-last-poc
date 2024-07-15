"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
const uuid_1 = require("uuid");
const rooms = {};
const roomHandler = (socket) => {
    const createRoom = () => {
        const roomId = (0, uuid_1.v4)();
        rooms[roomId] = [];
        socket.emit('room-created', { roomId });
        console.log('join room');
    };
    const joinRoom = ({ roomId, peerId }) => {
        if (!rooms[roomId])
            return;
        rooms[roomId].push(peerId);
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', { peerId });
        socket.emit('get-users', {
            roomId,
            participants: rooms[roomId]
        });
        socket.on('disconnect', () => {
            console.log("user left the room", peerId);
            leaveRoom({ roomId, peerId });
        });
    };
    const leaveRoom = ({ roomId, peerId }) => {
        rooms[roomId] = rooms[roomId].filter(id => id !== peerId);
        socket.to(roomId).emit("user-disconnected", peerId);
    };
    socket.on('create-room', createRoom);
    socket.on('join-room', joinRoom);
};
exports.roomHandler = roomHandler;
