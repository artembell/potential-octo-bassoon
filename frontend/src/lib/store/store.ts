import { configureStore } from '@reduxjs/toolkit';
import { contentReducer } from './features/content.slice';
import { subscriptionsReducer } from './features/subscriptions.slice';
// ...

export const store = configureStore({
    reducer: {
        content: contentReducer,
        subscriptions: subscriptionsReducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;