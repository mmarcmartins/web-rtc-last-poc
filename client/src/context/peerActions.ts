export const ADD_PEER = "ADD_PEER" as const;
export const REMOVE_PEER = "REMOVE_PEER" as const;

type addPeerConnectionParams = {
    peerId: string;
    stream: MediaStream;
};

export const addPeerAction = ({peerId,stream}: addPeerConnectionParams) => ({
    type: ADD_PEER,
    payload: {peerId, stream}
})

export const removePeerAction = ({peerId}: addPeerConnectionParams) => ({
    type: REMOVE_PEER,
    payload: {peerId}
})