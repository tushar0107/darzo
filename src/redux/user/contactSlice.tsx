import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Contacts{
	contacts: Array<Object>
}

const initialState: Contacts = {
	contacts : [],
}

const contactSlice = createSlice({
	name: 'contacts',
	initialState,
	reducers:{
		storeContacts(state,action:PayloadAction<any>){
			state.contacts = action.payload
		},
		clearContacts(state){
			state.contacts = [];
		},
		getContact(state,action:PayloadAction<any>){
			//get contact 
		}
	}
});

export const { storeContacts, clearContacts } = contactSlice.actions;
export default contactSlice.reducer;
