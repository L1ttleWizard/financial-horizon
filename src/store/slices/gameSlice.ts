// src/store/slices/gameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { gameEventsPool, GameEvent, Choice } from '@/data/gameEvents';
import { Achievement, getAchievementById } from '@/data/achievementsData';
import { getTreeStageForNetWorth } from '@/data/treeData';
import { bankOffersPool, BankOffer } from '@/data/bankOffers';
import { glossaryData, Term } from '@/data/glossaryData';

// --- ИГРОВЫЕ КОНСТАНТЫ ---
export const PAYDAY_CYCLE = 4; // Экспортируем, чтобы использовать в UI
export const WEEKLY_SPENDS = 100; // Еженедельные расходы
export const MONTHLY_BILLS = 600; // Ежемесячные счета
const MONTHLY_SALARY = 1600;
const DEBT_INTEREST_RATE = 0.20;
const MOOD_BOOST_ON_PAYDAY = 5;
const MOOD_PENALTY_FOR_DEBT = -30; // Штраф за неуплату счетов

// --- УСЛОВИЯ ПРОИГРЫША ---
const DEBT_SPIRAL_THRESHOLD = MONTHLY_SALARY / 2;
const BANKRUPTCY_NET_WORTH_THRESHOLD = -1000;
const BANKRUPTCY_MOOD_THRESHOLD = 10;


// --- ТИПЫ ДЛЯ ЛОГОВ И ГРАФИКА ---
type LogType = 'income' | 'expense' | 'savings' | 'debt' | 'mood';
type GameOverReason = 'DEBT_SPIRAL' | 'EMOTIONAL_BURNOUT' | 'BANKRUPTCY';


export interface LogEntry {
    id: string;
    week: number;
    type: LogType;
    description: string;
    amount: number;
}
export interface ActiveDeposit {
    id: string; // Уникальный ID вклада
    bankId: string;
    bankName: string;
    amount: number;
    annualRate: number;
    term: number; // Срок в неделях (ходах)
    startTurn: number;
    endTurn: number;
}
interface GameOverState {
    isGameOver: true;
    reason: GameOverReason;
    message: string;
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
    savings: number,
    debt: number;
    treeStage: number;
    turn: number;
    activeDeposits: ActiveDeposit[];
    availableOffers: BankOffer[];
    moodAtZeroTurns: number; // Игровой ход, представляющий неделю
    gameOverState: { isGameOver: false } | GameOverState;
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
    isGlossaryForced: boolean;
    forcedGlossaryTerm: Term | null;
}

// --- НАЧАЛЬНОЕ СОСТОЯНИЕ ИГРЫ ---
const initialState: GameState = {
    balance: 500,
    mood: 70,
    savings: 0,
    debt: 0,
    treeStage: 1,
    turn: 0,
    activeDeposits: [],
    availableOffers: [],
    moodAtZeroTurns: 0,
    gameOverState: { isGameOver: false },
    currentEvent: null,
    log: [],
    netWorthHistory: [{ week: 0, netWorth: 500 }],
    lastChoiceResult: null,
    isEventModalOpen: false,
    isResultModalOpen: false,
    unlockedAchievements: [],
    newlyUnlockedAchievement: null,
    isGlossaryForced: false,
    forcedGlossaryTerm: null,
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
    // Пересчитываем savings каждый раз для точности
    state.savings = state.activeDeposits.reduce((sum, dep) => sum + dep.amount, 0);
    const netWorth = state.balance + state.savings - state.debt;
    state.netWorthHistory.push({ week: state.turn + 1, netWorth });
    const newStage = getTreeStageForNetWorth(netWorth);
    state.treeStage = newStage.stage;
};

const checkGameOverConditions = (state: GameState) => {
    // 1. Спираль долга
    const monthlyInterest = state.debt * (DEBT_INTEREST_RATE);
    if (monthlyInterest > DEBT_SPIRAL_THRESHOLD) {
        state.gameOverState = {
            isGameOver: true,
            reason: 'DEBT_SPIRAL',
            message: 'Ваши долги вышли из-под контроля. Теперь проценты по ним съедают большую часть вашей зарплаты. Вы попали в долговую спираль.'
        };
        return;
    }

    // 2. Эмоциональное выгорание
    if (state.mood <= 0) {
        state.moodAtZeroTurns += 1;
    } else {
        state.moodAtZeroTurns = 0; // Сбрасываем счетчик, если настроение поднялось
    }
    if (state.moodAtZeroTurns >= PAYDAY_CYCLE) { // 4 недели подряд на нуле
        state.gameOverState = {
            isGameOver: true,
            reason: 'EMOTIONAL_BURNOUT',
            message: 'В погоне за деньгами вы забыли о себе. Ваше настроение на нуле слишком долго. Без радости и отдыха деньги теряют смысл.'
        };
        return;
    }

    // 3. Банкротство
    const netWorth = state.balance + state.savings - state.debt;
    if (netWorth < BANKRUPTCY_NET_WORTH_THRESHOLD && state.mood < BANKRUPTCY_MOOD_THRESHOLD) {
        state.gameOverState = {
            isGameOver: true,
            reason: 'BANKRUPTCY',
            message: 'Вы достигли финансового дна. Ваши долги значительно превышают активы, а моральные силы на исходе. Это банкротство.'
        };
    }
}


// --- СОЗДАНИЕ REDUX-СЛАЙСА ---
const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        startNextTurn(state) {
            // --- ЛОГИКА ОБЯЗАТЕЛЬНОГО ОБУЧЕНИЯ ---
            // Срабатывает каждый 4-й ход, но не на нулевом
            if (state.turn > 0 && state.turn % PAYDAY_CYCLE === 0) {
                // Выбираем случайный термин из глоссария
                const randomIndex = Math.floor(Math.random() * glossaryData.length);
                state.forcedGlossaryTerm = glossaryData[randomIndex];
                state.isGlossaryForced = true;

                // ВАЖНО: Мы не запускаем обычное событие, выходим из редьюсера
                return;
            }
            // --- ПРОВЕРКА ЗАВЕРШЕННЫХ ВКЛАДОВ (в самом начале хода) ---
            const completedDeposits = state.activeDeposits.filter(dep => state.turn >= dep.endTurn);
            completedDeposits.forEach(dep => {
                const weeksInYear = 52;
                const interest = Math.ceil(dep.amount * dep.annualRate * (dep.term / weeksInYear));
                const totalReturn = dep.amount + interest;
                state.balance += totalReturn;
                addLogEntry(state, 'income', `Завершение вклада в ${dep.bankName}`, totalReturn);
            });
            // Удаляем завершенные вклады из активных
            state.activeDeposits = state.activeDeposits.filter(dep => state.turn < dep.endTurn);
            updateNetWorthAndTree(state);
            // --- ОБНОВЛЕНИЕ БАНКОВСКИХ ПРЕДЛОЖЕНИЙ (раз в 4 недели) ---
            if (state.turn % 4 === 0) {
                const shuffled = [...bankOffersPool].sort(() => 0.5 - Math.random());
                state.availableOffers = shuffled.slice(0, 3);
            }

            if (state.turn > 0) {
                state.balance -= WEEKLY_SPENDS;
                addLogEntry(state, 'expense', 'Еда и транспорт', -WEEKLY_SPENDS);
            }

            // 2. Ежемесячные расходы (каждый 4-й ход)
            if (state.turn > 0 && state.turn % PAYDAY_CYCLE === 0) {
                // Списываем счета ДО зарплаты
                if (state.balance >= MONTHLY_BILLS) {
                    state.balance -= MONTHLY_BILLS;
                    addLogEntry(state, 'expense', 'Аренда и коммуналка', -MONTHLY_BILLS);
                } else {
                    // Механика "Кредита отчаяния"
                    const shortfall = MONTHLY_BILLS - state.balance;
                    const paidFromBalance = state.balance;

                    state.balance = 0; // Списываем все, что было
                    state.debt += shortfall; // Увеличиваем долг на недостающую сумму
                    state.mood += MOOD_PENALTY_FOR_DEBT; // Штраф к настроению

                    if (paidFromBalance > 0) {
                        addLogEntry(state, 'expense', 'Частичная оплата счетов', -paidFromBalance);
                    }
                    addLogEntry(state, 'debt', 'Экстренный кредит на оплату счетов', shortfall);
                    addLogEntry(state, 'mood', 'Стресс из-за неуплаты счетов', MOOD_PENALTY_FOR_DEBT);
                }

                // 3. Зарплата и проценты по долгу (после оплаты счетов)
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
            checkGameOverConditions(state);
        },
        clearNewAchievement(state) {
            state.newlyUnlockedAchievement = null;
        },
        resetGame: (state) => {
            // Явно присваиваем initialState текущему state
            Object.assign(state, initialState);
            // Отдельно сбрасываем историю, чтобы гарантировать правильную начальную точку
            state.netWorthHistory = [{ week: 0, netWorth: initialState.balance }];
        },
        openDeposit(state, action: PayloadAction<{ offer: BankOffer; amount: number; term: number }>) {
            const { offer, amount, term } = action.payload;

            if (amount > 0 && state.balance >= amount) {
                state.balance -= amount;

                const newDeposit: ActiveDeposit = {
                    id: `${Date.now()}`,
                    bankId: offer.id,
                    bankName: offer.bankName,
                    amount,
                    annualRate: offer.annualRate,
                    term,
                    startTurn: state.turn,
                    endTurn: state.turn + term,
                };
                state.activeDeposits.push(newDeposit);

                addLogEntry(state, 'savings', `Открытие вклада в ${offer.bankName}`, amount);
                updateNetWorthAndTree(state);
            }
        },
        confirmGlossaryRead(state) {
            state.isGlossaryForced = false;
            state.forcedGlossaryTerm = null;
            // После прочтения мы НЕ начинаем новый ход, а просто возвращаемся на главный экран,
            // позволяя игроку сделать следующий ход уже с новыми знаниями.
        },
    },
});

export const { startNextTurn, makeChoice, payDebt, closeResultModal, clearNewAchievement, resetGame, openDeposit,confirmGlossaryRead } = gameSlice.actions;
export default gameSlice.reducer;