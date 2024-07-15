import { Message } from "../types/chat";

export const ADD_MESSAGE = "ADD_MESSAGE" as const;

type addMessageAction = {
    message: Message;    
};

export const addMessageAction = ({message}: addMessageAction) => ({
    type: ADD_MESSAGE,
    payload: {message}
})