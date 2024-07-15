import { useParams } from 'react-router-dom';
import { useRoom } from '../../hooks/use-room';
import { useEffect } from 'react';
import { VideoPlayer } from '../../components/VideoPlayer';

export const Room = () => {
    const { id } = useParams();
    const  { ws, me, stream }  = useRoom();
    
    useEffect(() => {
        if(me && stream){
            ws.emit('join-room', {roomId: id, peerId: me.id});
            ws.emit('connection-request',id, me.id);
        }
    }, [id, me, stream])

    return <><VideoPlayer stream={stream}/></>
};