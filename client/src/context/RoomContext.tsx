import { PropsWithChildren, createContext, useEffect, useReducer, useState } from 'react';
import Peer from 'peerjs';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import { PeersReducer } from '../reducers/peerReducer';
import { addPeerAction, removePeerAction } from '../actions/peerActions';
import { Message } from '../types/chat';
import { chatReducer } from '../reducers/chatReducer';


const BASEURL = 'http://localhost:3001';

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(BASEURL);

export const RoomProvider = ({children} : PropsWithChildren) => {
    const navigate = useNavigate();
    const [myPeer, setMyPeer] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(PeersReducer, {}); 
    const [chat, chatDispatch] = useReducer(chatReducer, {
        messages: []
    });    
    const [roomId, setRoomId] = useState();
    const enterRoom = ({ roomId }: {roomId: string}) => {
        navigate(`/room/${roomId}`);
    }
    console.log(myPeer, stream);
    const getUsers = ({participants}: {roomId: string, participants : string[]}) => {
        console.log({participants});        
    }

    const removePeer = (peerId: string) => {
        dispatch(removePeerAction({peerId}));
    };

    const sendMessage = (message: string) => {        
        const messageData: Message = {
            id: `${roomId}-${chat.messages.length}`,
            content: message,
            timestamp: Date.now(),
            author: myPeer?.id ?? ''
        }
        ws.emit("send-message", {roomId, message: messageData});        
    };

    const addMessage = (message: Message) => {            
        chatDispatch({ type: "ADD_MESSAGE", payload: {message}});
    }

    useEffect(() => {
        const meId = v4();
        const peer = new Peer(meId, {
            host: "localhost",
            port: 9001,
            path: "/"
        });       
        setMyPeer(peer);
        try{
            navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
                setStream(stream);                                
            });
        } catch(err){
            console.log(err);
        }        
        ws.on('room-created', enterRoom);
        ws.on('get-users', getUsers);   
        ws.on('user-disconnected', removePeer);     
        ws.on('add-message', addMessage);
        return () => {
            ws.off('room-created');
            ws.off('get-users');
            ws.off('user-disconnected');
            ws.off('add-message');
        }
    },[]);

    useEffect(() => {
        if(!myPeer || !stream) return;       
        ws.on('user-joined', ({peerId}) => {                
            if(peerId != myPeer.id){                                             
                const call = myPeer.call(peerId, stream);
                call.on("stream", (remoteStream) => {                
                    dispatch(addPeerAction({peerId, stream: remoteStream}))
                })
            }
        });

        myPeer.on('call', (call) => {            
            call.answer(stream);
            call.on("stream", (remoteStream) => {
                dispatch(addPeerAction({peerId: call.peer, stream: remoteStream}))
            })
        })
        return () => {
            ws.off('user-joined');
            myPeer.off('call');
        }
    }, [myPeer, stream]);

    console.log({peers});

    return (
        <RoomContext.Provider value={{ws, me: myPeer, stream, peers, setRoomId, sendMessage, chat: chat.messages}}>
            {children}
        </RoomContext.Provider>
    )
};