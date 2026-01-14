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
		    localStorage.setItem("user", JSON.stringify(null));
        },
        storeUserData(state, action: PayloadAction<any>) {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload.mobile;
		    localStorage.setItem("user", JSON.stringify(action.payload));
        },
        clearUserData(state) {
            state.user = null;
            state.isAuthenticated = false;
		    localStorage.setItem("user", JSON.stringify(null));
            window.location.href = "/"
            window.location.reload();
        },
        //define other actions
    },
});

export const { login, logout, storeUserData, clearUserData} = authSlice.actions;
export default authSlice.reducer;