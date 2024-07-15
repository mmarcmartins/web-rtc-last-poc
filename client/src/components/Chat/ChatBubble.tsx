import { useRoom } from "../../hooks/use-room";
import { Message } from "../../types/chat"
import clns from "classnames";

type ChatBubbleProps = {
    message: Message;
}

export const ChatBubble = ({message}: ChatBubbleProps) => {
    const { me } = useRoom();
    const isSelf = message.author === me?.id;
    return (
    <div className={clns("m2-2 flex", {
        "pl-10 justify-end": isSelf,
        "pr-10 justify-start": !isSelf
    })}>
        <div className={clns("inline-block py-2 px-4 rounded", {
            "bg-red-200": isSelf,
            "bg-red-300": !isSelf
        })}>{message.content}</div>
    </div>
    )
}