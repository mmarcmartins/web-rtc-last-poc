import { PropsWithChildren, createContext, useEffect, useReducer, useState } from 'react';
import Peer from 'peerjs';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import { PeersReducer } from './peerReducer';
import { addPeerAction } from './peerActions';


const BASEURL = 'http://localhost:3001';

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(BASEURL);

export const RoomProvider = ({children} : PropsWithChildren) => {
    const navigate = useNavigate();
    const [myPeer, setMyPeer] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(PeersReducer, {});    
    const [roomId, setRoomId] = useState("");
    const enterRoom = ({ roomId }: {roomId: string}) => {
        navigate(`/room/${roomId}`);
    }
    console.log(myPeer, stream);
    const getUsers = ({participants}: {roomId: string, participants : string[]}) => {
        console.log({participants});        
    }

    useEffect(() => {
        const meId = v4();
        const peer = new Peer(meId, {
            host: "localhost",
            port: 9001,
            path: "/"
        });        
        try{
            navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
                setStream(stream);                                
                setMyPeer(peer);
            });
        } catch(err){
            console.log(err);
        }        
        ws.on('room-created', enterRoom);
        ws.on('get-users', getUsers);     
    },[])

    useEffect(() => {
        if(!myPeer || !stream) return;       
        
        ws.on('user-joined', ({peerId}) => {    
            console.log('user-joined');                    
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
    }, [myPeer, stream]);

    console.log({peers});

    return (
        <RoomContext.Provider value={{ws, me: myPeer, stream, setRoomId}}>
            {children}
        </RoomContext.Provider>
    )
};