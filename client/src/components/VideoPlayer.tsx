import { useEffect, useRef } from "react";

type VideoPlayerProps = {
    stream: MediaStream;
};
export const VideoPlayer = ({stream}: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if(videoRef.current) videoRef.current.srcObject = stream;
    },[stream]);

    return(
        <video ref={videoRef} autoPlay muted/>
    );
}