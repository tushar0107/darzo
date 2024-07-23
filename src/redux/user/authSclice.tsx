import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState{
    isAuthenticated: Boolean;
    user: any;
};

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<any>){
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout(state){
            state.isAuthenticated = false;
            state.user = null;
        },
        //define other actions
    },
});

export const { login, logout} = authSlice.actions;
export default authSlice.reducer;