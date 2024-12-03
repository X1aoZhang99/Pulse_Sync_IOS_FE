import { configureStore } from '@reduxjs/toolkit';
import bpmHistoryReducer from './reducers/bpmHistoryReducer';

export const store = configureStore({
  reducer: {
    bpmHistory: bpmHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;