// src/store/slices/gameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { gameEventsPool, GameEvent, Choice } from '@/data/gameEvents';
import { Achievement, getAchievementById } from '@/data/achievementsData';
import { getTreeStageForNetWorth } from '@/data/treeData';

// --- ИГРОВЫЕ КОНСТАНТЫ ---
const PAYDAY_CYCLE = 4; // Зарплата каждые 4 хода (недели)
const MONTHLY_SALARY = 1600;
const DEBT_INTEREST_RATE = 0.10; // 10% в месяц
const MOOD_BOOST_ON_PAYDAY = 5;

// --- ТИПЫ ДЛЯ ЛОГОВ И ГРАФИКА ---
type LogType = 'income' | 'expense' | 'savings' | 'debt' | 'mood';

export interface LogEntry {
  id: string;
  week: number;
  type: LogType;
  description: string;
  amount: number;
}

export interface NetWorthHistoryPoint {
    week: number;
    netWorth: number;
}

type ChoiceEffects = Choice['effects'];

// --- ОПРЕДЕЛЕНИЕ ПОЛНОГО СОСТОЯНИЯ ИГРЫ ---
interface GameState {
  balance: number;
  mood: number;
  savings: number;
  debt: number;
  treeStage: number;
  turn: number; // Игровой ход, представляющий неделю
  currentEvent: GameEvent | null; // Текущее активное событие
  log: LogEntry[];
  netWorthHistory: NetWorthHistoryPoint[];
  lastChoiceResult: {
    outcomeText: string;
    learningPoint: string;
    effects: ChoiceEffects;
  } | null;
  isEventModalOpen: boolean;
  isResultModalOpen: boolean;
  unlockedAchievements: string[];
  newlyUnlockedAchievement: Achievement | null;
}

// --- НАЧАЛЬНОЕ СОСТОЯНИЕ ИГРЫ ---
const initialState: GameState = {
  balance: 500,
  mood: 70,
  savings: 0,
  debt: 0,
  treeStage: 1,
  turn: 0,
  currentEvent: null,
  log: [],
  netWorthHistory: [{ week: 0, netWorth: 500 }],
  lastChoiceResult: null,
  isEventModalOpen: false,
  isResultModalOpen: false,
  unlockedAchievements: [],
  newlyUnlockedAchievement: null,
};

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
const addLogEntry = (state: GameState, type: LogType, description: string, amount: number) => {
    if (amount === 0) return;
    state.log.push({
        id: `${Date.now()}-${Math.random()}`,
        week: state.turn + 1,
        type,
        description,
        amount,
    });
};

const updateNetWorthAndTree = (state: GameState) => {
    const netWorth = state.balance + state.savings - state.debt;
    state.netWorthHistory.push({ week: state.turn + 1, netWorth });
    const newStage = getTreeStageForNetWorth(netWorth);
    state.treeStage = newStage.stage;
};

// --- СОЗДАНИЕ REDUX-СЛАЙСА ---
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startNextTurn(state) {
      if (state.turn > 0 && state.turn % PAYDAY_CYCLE === 0) {
        const salary = MONTHLY_SALARY;
        state.balance += salary;
        addLogEntry(state, 'income', 'Месячная зарплата', salary);

        const moodBoost = MOOD_BOOST_ON_PAYDAY;
        state.mood += moodBoost;
        addLogEntry(state, 'mood', 'Бонус к настроению', moodBoost);
        
        if (state.debt > 0) {
          const interest = Math.ceil(state.debt * DEBT_INTEREST_RATE);
          state.debt += interest;
          addLogEntry(state, 'debt', 'Проценты по долгу', interest);
        }
      }
      
      const shuffled = [...gameEventsPool].sort(() => 0.5 - Math.random());
      state.currentEvent = shuffled[0];
      state.isEventModalOpen = true;
      state.isResultModalOpen = false;
    },
    makeChoice(state, action: PayloadAction<Choice>) {
      const choice = action.payload;
      const effects = choice.effects;
      
      if (effects.balance) {
        state.balance += effects.balance;
        addLogEntry(state, effects.balance > 0 ? 'income' : 'expense', choice.text, effects.balance);
      }
      if (effects.mood) { state.mood += effects.mood; addLogEntry(state, 'mood', choice.text, effects.mood); }
      if (effects.savings) { state.savings += effects.savings; addLogEntry(state, 'savings', choice.text, effects.savings); }
      if (effects.debt) { state.debt += effects.debt; addLogEntry(state, 'debt', choice.text, effects.debt); }
      
      if (state.mood > 100) state.mood = 100;
      if (state.mood < 0) state.mood = 0;
      
      state.lastChoiceResult = {
          outcomeText: choice.outcomeText,
          learningPoint: choice.learningPoint,
          effects: choice.effects,
      };
      
      state.isEventModalOpen = false;
      state.isResultModalOpen = true;

      updateNetWorthAndTree(state);

      const checkAndUnlock = (id: string) => {
        if (!state.unlockedAchievements.includes(id)) {
            state.unlockedAchievements.push(id);
            state.newlyUnlockedAchievement = getAchievementById(id) || null;
        }
      };
      if ((effects.savings || 0) > 0 && state.savings > 0) { checkAndUnlock('FIRST_SAVINGS'); }
      if ((effects.debt || 0) > 0 && state.debt > 0) { checkAndUnlock('CREDIT_BAPTISM'); }
      if (state.balance + state.savings > 1000) { checkAndUnlock('MONEY_BOX'); }
      if (choice.text === 'Вежливо отказаться') { checkAndUnlock('FINANCIAL_WISDOM'); }
      if (choice.text === 'Починить старый в мастерской' || choice.text === 'Купить новый, но недорогой') {
        checkAndUnlock('ANTIFRAGILITY');
      }
    },
    payDebt(state, action: PayloadAction<number>) {
        let amountToPay = action.payload;
        if (amountToPay <= 0) return;
        if (amountToPay > state.balance) { amountToPay = state.balance; }
        if (amountToPay > state.debt) { amountToPay = state.debt; }
        state.balance -= amountToPay;
        state.debt -= amountToPay;
        addLogEntry(state, 'expense', 'Погашение долга', -amountToPay);
        updateNetWorthAndTree(state);
    },
    closeResultModal(state) {
        state.isResultModalOpen = false;
        state.turn += 1;
    },
    clearNewAchievement(state) {
        state.newlyUnlockedAchievement = null;
    },
    resetGame: (state) => {
        const freshState = initialState;
        Object.assign(state, freshState);
        state.netWorthHistory = [{ week: 0, netWorth: freshState.balance }];
    },
  },
});

export const { startNextTurn, makeChoice, payDebt, closeResultModal, clearNewAchievement, resetGame } = gameSlice.actions;
export default gameSlice.reducer;