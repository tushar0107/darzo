import {createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WebSocketState {
    websocket: WebSocket | null;
}

const initialState: WebSocketState = {
    websocket: null,
};

const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
      setWebSocket: (state, action: PayloadAction<any>) => {
        state.websocket = action.payload;
      },
      receiveMessage: (state, action: PayloadAction<string>) => {
        // Handle incoming messages
        console.log('Received:', action.payload);
        // You can update the state or trigger other actions based on the received message
      },
    },
  });
  
  export const { setWebSocket, receiveMessage } = websocketSlice.actions;
  export default websocketSlice.reducer;