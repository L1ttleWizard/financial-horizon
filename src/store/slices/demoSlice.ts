
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from './gameSlice';

interface DemoState {
  isActive: boolean;
  originalGameState: GameState | null;
  currentStep: number;
}

const initialState: DemoState = {
  isActive: false,
  originalGameState: null,
  currentStep: 0,
};

const demoSlice = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    startDemo: (state, action: PayloadAction<GameState>) => {
      state.isActive = true;
      state.originalGameState = action.payload;
      state.currentStep = 0;
    },
    stopDemo: (state) => {
      state.isActive = false;
      state.originalGameState = null;
      state.currentStep = 0;
    },
    playNextDemoEvent: (state) => {
      state.currentStep += 1;
    },
    setDemoEventIndex: (state, action: PayloadAction<number>) => {
        state.currentStep = action.payload;
    }
  },
});

export const { startDemo, stopDemo, playNextDemoEvent, setDemoEventIndex } = demoSlice.actions;
export default demoSlice.reducer;
