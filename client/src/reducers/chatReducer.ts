import { ADD_MESSAGE } from "../actions/chatActions";
import { Message } from "../types/chat";


export type ChatState = {
    messages: Message[];
};
type ChatAction = |
    { type: typeof ADD_MESSAGE,
      payload: { message: Message }
    };

export const chatReducer = (state: ChatState, action: ChatAction) => {
    switch (action.type) {
        case ADD_MESSAGE:            
            return {
                ...state,
                messages: [...state.messages, action.payload.message],
            };
        default:
            return { ...state };
    }
};