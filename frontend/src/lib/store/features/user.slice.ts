import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
type UserState = {
    authorized: boolean;
    email: string;
};

// Define the initial state using that type
const initialState: UserState = {
    authorized: true,
    email: ''
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthorized: (state, action: PayloadAction<boolean>) => {
            state.authorized = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
    },
});

export const { setAuthorized, setEmail } = userSlice.actions;

export const userReducer = userSlice.reducer;