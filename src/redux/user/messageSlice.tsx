import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Message = {
    sender: number | any, 
    recipient: number | any, 
    message: string,
}
interface MessageState {
    messages: Message[];
};

const initialState: MessageState = {
    messages: [],
}

const messageSlice = createSlice({
    name : 'message',
    initialState,
    reducers: {
        sendMessage(state, action: PayloadAction<any>){
            state.messages.push(action.payload);
            console.log('at sent',action.payload);
        },
        receiveMessage(state, action:PayloadAction<any>){
            console.log('at receiving', state.messages);
        },
    }
});


export const {sendMessage, receiveMessage} = messageSlice.actions;
export default messageSlice.reducer;
