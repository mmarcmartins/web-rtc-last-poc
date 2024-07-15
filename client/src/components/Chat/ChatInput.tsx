import { useState } from "react";
import { useRoom } from "../../hooks/use-room";

export const ChatInput = () => {
    const [message, setMessage] = useState('');
    const { sendMessage } = useRoom();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage(message);
        setMessage("");        
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <textarea className="border" value={message} onChange={(e) => setMessage(e.target.value)}/>
                <button type="submit">send</button>
            </form>
        </div>
    )
}