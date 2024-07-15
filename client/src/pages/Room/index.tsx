import { useParams } from 'react-router-dom';
import { useRoom } from '../../hooks/use-room';
import { useEffect } from 'react';
import { VideoPlayer } from '../../components/VideoPlayer';
import { PeerState } from '../../context/peerReducer';
import { Chat } from '../../components/Chat';

export const Room = () => {
    const { id } = useParams();
    const  { ws, me, stream, peers, setRoomId}  = useRoom();
    
    useEffect(() => {
        if(me && stream){
            ws.emit('join-room', {roomId: id, peerId: me.id});
        }
    }, [id, me, stream])

    useEffect(() => {
        setRoomId(id || '');
    }, [id])

    return (
    <div className='flex flex-col min-h-screen'>
        <div className="grid grid-cols-4 gap-4">
            <VideoPlayer stream={stream}/>
            {Object.values(peers as PeerState).map(peer => (
                <VideoPlayer stream={peer.stream}/>
            ))}
        </div>
        <div className="flex grow border-l-2">
            <Chat />
        </div>
    </div>)
};