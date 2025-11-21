// src/store/slices/onboardingSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { onboardingSteps } from '@/data/onboardingData';

interface OnboardingState {
    isActive: boolean;
    currentStep: number;
    hasCompleted: boolean; // Флаг, что обучение пройдено
}

const initialState: OnboardingState = {
    isActive: false,
    currentStep: 0,
    hasCompleted: false,
};

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        startOnboarding(state) {
            if (!state.hasCompleted) {
                state.isActive = true;
                state.currentStep = 0;
            }
        },
        nextStep(state) {
            if (state.isActive && state.currentStep < onboardingSteps.length - 1) {
                state.currentStep += 1;
            }
        },
        goToStep(state, action: { payload: number }) {
            if (state.isActive) {
                state.currentStep = action.payload;
            }
        },
        finishOnboarding(state) {
            state.isActive = false;
            state.hasCompleted = true;
        },
        // Редьюсер для загрузки статуса из LocalStorage
        setOnboardingCompleted(state, action: { payload: boolean }) {
            state.hasCompleted = action.payload;
        },
        setOnboardingState(state, action: { payload: OnboardingState }) {
            return action.payload;
        },
        resetOnboarding(state) {
            state.isActive = false;
            state.currentStep = 0;
            state.hasCompleted = false;
        }
    }
});

export const { startOnboarding, nextStep, goToStep, finishOnboarding, setOnboardingCompleted, setOnboardingState, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;