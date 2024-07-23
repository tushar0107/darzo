import { configureStore } from '@reduxjs/toolkit';
import authReducer from './user/authSclice';
import userReducer from './user/userSlice';
import messageReducer from './user/messageSlice';
import websocketReducer from './user/websocketSlice';
import contactsReducer from './user/contactSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        message: messageReducer,
        websocket: websocketReducer,
        contacts: contactsReducer
        //add other reducers
    },
});

export default store;