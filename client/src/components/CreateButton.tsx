import { useRoom } from "../hooks/use-room";


export const CreateButton = () => {    
    const { ws } = useRoom();
    
    const joinRoom = () => {
        ws.emit('create-room');
    }

    return(<button 
        className='
        bg-rose-400 
        py-2 
        px-8 
        rounded-lg 
        hover:bg-rose-600
        text-white'
        onClick={joinRoom}>Start new meeting</button>)
};