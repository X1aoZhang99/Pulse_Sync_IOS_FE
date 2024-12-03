import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BPMHistoryState {
  sessions: Array<{date: string, pulseRate: number}>;
}

const initialState: BPMHistoryState = {
  sessions: []
};

const bpmHistorySlice = createSlice({
  name: 'bpmHistory',
  initialState,
  reducers: {
    addBPMSession: (state, action: PayloadAction<number>) => {
      state.sessions.push({
        date: new Date().toISOString().split('T')[0],
        pulseRate: action.payload
      });
    }
  }
});

export const { addBPMSession } = bpmHistorySlice.actions;
export default bpmHistorySlice.reducer;