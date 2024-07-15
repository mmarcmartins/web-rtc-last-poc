import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export const useRoom = () => {
    const room = useContext(RoomContext);

    if(!room){
        throw new Error('Room context not found ');
    }

    return room;
}