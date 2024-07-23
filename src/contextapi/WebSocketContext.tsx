import React, {createContext, useContext, useEffect} from 'react';

const WebSocketContext = createContext<any>({
    socket:null,
    setSocket: ()=>{}
});

export default WebSocketContext;