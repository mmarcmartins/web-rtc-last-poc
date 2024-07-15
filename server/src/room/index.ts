import { Socket } from 'socket.io';
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
        if(!rooms[roomId]) return;
        rooms[roomId].push(peerId);
        socket.join(roomId);
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

    socket.on('connection-request',(roomId,peerId)=> {
        console.log('emitido user-joined');                             
        socket.to(roomId).emit('user-joined',{peerId});        
    })

    socket.on('create-room', createRoom);
    socket.on('join-room', joinRoom);
}