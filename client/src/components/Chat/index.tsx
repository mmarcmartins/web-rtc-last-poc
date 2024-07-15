import { useRoom } from "../../hooks/use-room";
import { Message } from "../../types/chat";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

export const Chat = () => {
    const {chat} = useRoom();    
    return(
        <div className="flex flex-col h-full justify-between">
            <div>
                {chat.map((currMessage: Message) => (
                    <ChatBubble key={currMessage.id} message={currMessage}/>
                ))}
            </div>
            <ChatInput/>
        </div>
    )
};