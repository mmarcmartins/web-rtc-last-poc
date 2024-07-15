import { BsChatLeftDots } from "react-icons/bs";

export const ChatButton = () => {    

    return(<button 
        className='
        bg-rose-400 
        py-2 
        px-8 
        rounded-lg 
        hover:bg-rose-600
        text-white'>
            <BsChatLeftDots />
        </button>)
};