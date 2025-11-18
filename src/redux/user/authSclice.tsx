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
    initialState:initialState,
    reducers: {
        login(state){
            state.isAuthenticated = true;
        },
        logout(state){
            state.isAuthenticated = false;
            state.user = null;
		    localStorage.setItem("user", JSON.stringify({}));
        },
        storeUserData(state, action: PayloadAction<any>) {
            state.user = action.payload;
		    localStorage.setItem("user", JSON.stringify(state.user));
            // if(state.user.mobile){
            //     state.isAuthenticated = true;
            // }
        },
        clearUserData(state) {
            window.location.reload();
        },
        //define other actions
    },
});

export const { login, logout, storeUserData, clearUserData} = authSlice.actions;
export default authSlice.reducer;