import { Socket } from 'socket.io';
import { Message } from '../types';
import {v4} from 'uuid';

const rooms: Record<string, string[]> = {};

type RoomParams = {roomId: string, peerId: string};


export const roomHandler = (socket: Socket, io: any) => {
    
    const createRoom = () => {
        const roomId = v4();
        rooms[roomId] = [];
        socket.emit('room-created', { roomId });        
    }

    const joinRoom = ({roomId, peerId}: RoomParams ) => {                
        if(!rooms[roomId]) rooms[roomId] = [];
        rooms[roomId].push(peerId);
        socket.join(roomId);
        console.log('entrou na sala');
        socket.to(roomId).emit('user-joined',{peerId});                        
        socket.emit('get-users', {
            roomId,
            participants: rooms[roomId]
        });

        socket.on('disconnect', () => {
            console.log("user left the room", peerId);
            leaveRoom({roomId, peerId});
        })
    }

    const leaveRoom = ({roomId, peerId} : RoomParams) => {
        rooms[roomId] = rooms[roomId].filter(id => id !== peerId);
        socket.to(roomId).emit("user-disconnected", peerId);
    }

    const addMessage = ({roomId, message} : { roomId: string, message: Message}) => {          
        io.to(roomId).emit("add-message", message);
    }

    socket.on("send-message", addMessage);
    socket.on('create-room', createRoom);
    socket.on('join-room', joinRoom);
}