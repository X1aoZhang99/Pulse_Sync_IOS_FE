import { Dispatch } from 'redux';
import { MeditationHistory } from '../types';

export const ADD_MEDITATION_HISTORY = 'ADD_MEDITATION_HISTORY';

export const addMeditationHistory = (history: MeditationHistory) => ({
  type: ADD_MEDITATION_HISTORY,
  payload: history
});

export const saveMeditationSession = (
  bpmData: number[]
) => {
  return (dispatch: Dispatch) => {
    const avgBPM = bpmData.reduce((a, b) => a + b, 0) / bpmData.length;
    
    const historyEntry: MeditationHistory = {
      avgBPM: Number(avgBPM.toFixed(2)),
      date: new Date().toISOString()
    };
    dispatch(addMeditationHistory(historyEntry));
  };
};
export const fetchMeditationHistory = () => {
    return (dispatch: Dispatch) => {
        const history = localStorage.getItem('meditationHistory');
        if (history) {
        dispatch(addMeditationHistory(JSON.parse(history)));
        }
    };
    };
    