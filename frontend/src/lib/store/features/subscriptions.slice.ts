import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
type SubscriptionsState = {
    value: any[] | null;
};

// Define the initial state using that type
const initialState: SubscriptionsState = {
    value: null
};

export const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setSubscriptions: (state, action: PayloadAction<any[]>) => {
            state.value = action.payload;
        }
    },
});

export const { setSubscriptions } = subscriptionsSlice.actions;

export const subscriptionsReducer = subscriptionsSlice.reducer;