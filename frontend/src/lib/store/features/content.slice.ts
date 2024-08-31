import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface ContentState {
    all: any[] | null;
    my: any[] | null;
}

// Define the initial state using that type
const initialState: ContentState = {
    all: null,
    my: null
};

export const contentSlice = createSlice({
    name: 'content',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setAll: (state, action: PayloadAction<any[]>) => {
            state.all = action.payload;
        },
        setMy: (state, action: PayloadAction<any[]>) => {
            state.my = action.payload;
        }
    },
});

export const { setAll, setMy } = contentSlice.actions;

export const contentReducer = contentSlice.reducer;