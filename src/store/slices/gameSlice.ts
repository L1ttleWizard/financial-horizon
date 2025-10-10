// src/store/slices/gameSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { gameEventsPool, GameEvent, Choice } from "@/data/gameEvents";
import { Achievement, getAchievementById } from "@/data/achievementsData";
import { getTreeStageForNetWorth } from "@/data/treeData";
import { bankOffersPool, BankOffer } from "@/data/bankOffers";
import { glossaryData, Term } from "@/data/glossaryData";

// --- ИГРОВЫЕ КОНСТАНТЫ ---
export const PAYDAY_CYCLE = 4;
export const WEEKLY_SPENDS = 10000;
export const MONTHLY_BILLS = 49200;
const MONTHLY_SALARY = 131200;
const DEBT_INTEREST_RATE = 0.2;
const MOOD_BOOST_ON_PAYDAY = 5;
const MOOD_PENALTY_FOR_DEBT = -10;

// --- СИСТЕМНЫЕ ПЕРЕМЕННЫЕ (МОГУТ ИЗМЕНЯТЬСЯ) ---
export const getSystemVariables = () => ({
  monthlyBills: 49200,
  weeklySpends: 10000,
  monthlySalary: 131200,
});

// --- УСЛОВИЯ ПРОИГРЫША ---
const DEBT_SPIRAL_THRESHOLD = MONTHLY_SALARY / 2;
const BANKRUPTCY_NET_WORTH_THRESHOLD = -82000;
const BANKRUPTCY_MOOD_THRESHOLD = 10;

// --- ТИПЫ ---
type LogType = "income" | "expense" | "savings" | "debt" | "mood";
type GameOverReason = "DEBT_SPIRAL" | "EMOTIONAL_BURNOUT" | "BANKRUPTCY";

export interface LogEntry {
  id: string;
  week: number;
  type: LogType;
  description: string;
  amount: number;
}
export interface ActiveDeposit {
  id: string;
  bankId: string;
  bankName: string;
  amount: number;
  annualRate: number;
  term: number;
  startTurn: number;
  endTurn: number;
}

export interface PropertyInvestment {
  id: string;
  name: string;
  type: 'apartment' | 'commercial' | 'crypto' | 'stocks';
  amount: number;
  monthlyIncome: number;
  purchaseTurn: number;
  description: string;
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
type ChoiceEffects = Choice["effects"];

// --- СТРУКТУРА СОСТОЯНИЯ ---
interface GameState {
  status: "idle" | "loading" | "succeeded" | "failed";
  balance: number;
  mood: number;
  savings: number;
  debt: number;
  treeStage: number;
  turn: number;
  activeDeposits: ActiveDeposit[];
  propertyInvestments: PropertyInvestment[];
  availableOffers: BankOffer[];
  moodAtZeroTurns: number;
  gameOverState: { isGameOver: false } | GameOverState;
  currentEvent: GameEvent | null;
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
  // Системные переменные
  monthlyBills: number;
  weeklySpends: number;
  monthlySalary: number;
}

// --- НАЧАЛЬНОЕ СОСТОЯНИЕ ---
const initialState: GameState = {
  status: "idle",
  balance: 41000,
  mood: 70,
  savings: 0,
  debt: 0,
  treeStage: 1,
  turn: 0,
  activeDeposits: [],
  propertyInvestments: [],
  availableOffers: [...bankOffersPool]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3),
  moodAtZeroTurns: 0,
  gameOverState: { isGameOver: false },
  currentEvent: null,
  log: [],
  netWorthHistory: [{ week: 0, netWorth: 41000 }],
  lastChoiceResult: null,
  isEventModalOpen: false,
  isResultModalOpen: false,
  unlockedAchievements: [],
  newlyUnlockedAchievement: null,
  isGlossaryForced: false,
  forcedGlossaryTerm: null,
  monthlyBills: 49200,
  weeklySpends: 10000,
  monthlySalary: 131200,
};

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
const addLogEntry = (
  state: GameState,
  type: LogType,
  description: string,
  amount: number
) => {
  if (amount === 0) return;
  state.log.push({
    id: `${Date.now()}-${Math.random()}`,
    week: state.turn,
    type,
    description,
    amount,
  });
};
const updateNetWorthAndTree = (state: GameState) => {
  // Считаем сбережения как сумму банковских вкладов + инвестиций в недвижимость
  const bankSavings = (state.activeDeposits || []).reduce(
    (sum, dep) => sum + dep.amount,
    0
  );
  const propertyValue = (state.propertyInvestments || []).reduce(
    (sum, prop) => sum + prop.amount,
    0
  );
  state.savings = bankSavings + propertyValue;
  
  const netWorth = state.balance + state.savings - state.debt;
  state.netWorthHistory.push({ week: state.turn, netWorth });
  const newStage = getTreeStageForNetWorth(netWorth);
  state.treeStage = newStage.stage;
};
const checkGameOverConditions = (state: GameState) => {
  const monthlyInterest = state.debt * DEBT_INTEREST_RATE;
  if (monthlyInterest > DEBT_SPIRAL_THRESHOLD) {
    state.gameOverState = {
      isGameOver: true,
      reason: "DEBT_SPIRAL",
      message:
        "Ваши долги вышли из-под контроля. Теперь проценты по ним съедают большую часть вашей зарплаты. Вы попали в долговую спираль.",
    };
    return;
  }
  if (state.mood <= 0) {
    state.moodAtZeroTurns += 1;
  } else {
    state.moodAtZeroTurns = 0;
  }
  if (state.moodAtZeroTurns >= PAYDAY_CYCLE) {
    state.gameOverState = {
      isGameOver: true,
      reason: "EMOTIONAL_BURNOUT",
      message:
        "В погоне за деньгами вы забыли о себе. Ваше настроение на нуле слишком долго. Без радости и отдыха деньги теряют смысл.",
    };
    return;
  }
  const netWorth = state.balance + state.savings - state.debt;
  if (
    netWorth < BANKRUPTCY_NET_WORTH_THRESHOLD &&
    state.mood < BANKRUPTCY_MOOD_THRESHOLD
  ) {
    state.gameOverState = {
      isGameOver: true,
      reason: "BANKRUPTCY",
      message:
        "Вы достигли финансового дна. Ваши долги значительно превышают активы, а моральные силы на исходе. Это банкротство.",
    };
  }
};

// --- СОЗДАНИЕ СЛАЙСА ---
const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startNextTurn(state) {
      if (
        state.gameOverState.isGameOver ||
        state.isEventModalOpen ||
        state.isResultModalOpen
      )
        return;
      state.turn += 1;

      if (state.turn > 0 && state.turn % PAYDAY_CYCLE === 0) {
        const randomIndex = Math.floor(Math.random() * glossaryData.length);
        state.forcedGlossaryTerm = glossaryData[randomIndex];
        state.isGlossaryForced = true;
        return;
      }

      const completedDeposits = state.activeDeposits.filter(
        (dep) => state.turn >= dep.endTurn
      );
      if (completedDeposits.length > 0) {
        completedDeposits.forEach((dep) => {
          const weeksInYear = 52;
          const interest = Math.ceil(
            dep.amount * dep.annualRate * (dep.term / weeksInYear)
          );
          const totalReturn = dep.amount + interest;
          state.balance += totalReturn;
          addLogEntry(
            state,
            "income",
            `Завершение вклада в ${dep.bankName}`,
            totalReturn
          );
        });
        state.activeDeposits = state.activeDeposits.filter(
          (dep) => state.turn < dep.endTurn
        );
        updateNetWorthAndTree(state);
      }

      state.balance -= state.weeklySpends;
      addLogEntry(state, "expense", "Еда и транспорт", -state.weeklySpends);

      const shuffled = [...gameEventsPool].sort(() => 0.5 - Math.random());
      state.currentEvent = shuffled[0];
      state.isEventModalOpen = true;
    },
    confirmGlossaryRead(state) {
      state.isGlossaryForced = false;
      state.forcedGlossaryTerm = null;

      const shuffled = [...bankOffersPool].sort(() => 0.5 - Math.random());
      state.availableOffers = shuffled.slice(0, 3);

      const completedDeposits = state.activeDeposits.filter(
        (dep) => state.turn >= dep.endTurn
      );
      if (completedDeposits.length > 0) {
        completedDeposits.forEach((dep) => {
          const weeksInYear = 52;
          const interest = Math.ceil(
            dep.amount * dep.annualRate * (dep.term / weeksInYear)
          );
          const totalReturn = dep.amount + interest;
          state.balance += totalReturn;
          addLogEntry(
            state,
            "income",
            `Завершение вклада в ${dep.bankName}`,
            totalReturn
          );
        });
        state.activeDeposits = state.activeDeposits.filter(
          (dep) => state.turn < dep.endTurn
        );
      }

      // Сначала начисляем проценты по существующему долгу (если есть)
      if (state.debt > 0) {
        const interest = Math.ceil(state.debt * DEBT_INTEREST_RATE);
        state.debt += interest;
        addLogEntry(state, "debt", "Проценты по долгу", interest);
      }

      // Затем обрабатываем оплату счетов
      if (state.balance >= state.monthlyBills) {
        state.balance -= state.monthlyBills;
        addLogEntry(state, "expense", "Аренда и коммуналка", -state.monthlyBills);
      } else {
        const shortfall = state.monthlyBills - state.balance;
        if (state.balance > 0) {
          addLogEntry(
            state,
            "expense",
            "Частичная оплата счетов",
            -state.balance
          );
          state.balance = 0;
        }
        state.debt += shortfall;
        state.mood += MOOD_PENALTY_FOR_DEBT;
        addLogEntry(
          state,
          "debt",
          "Экстренный кредит на оплату счетов",
          shortfall
        );
        addLogEntry(
          state,
          "mood",
          "Стресс из-за неуплаты счетов",
          MOOD_PENALTY_FOR_DEBT
        );
      }
      state.balance += state.monthlySalary;
      addLogEntry(state, "income", "Месячная зарплата", state.monthlySalary);
      state.mood += MOOD_BOOST_ON_PAYDAY;
      addLogEntry(state, "mood", "Бонус к настроению", MOOD_BOOST_ON_PAYDAY);
      
      // FIRST_STEPS - завершить первый игровой месяц (4 недели)
      if (state.turn === PAYDAY_CYCLE && !state.unlockedAchievements.includes("FIRST_STEPS")) {
        state.unlockedAchievements.push("FIRST_STEPS");
        state.newlyUnlockedAchievement = getAchievementById("FIRST_STEPS") || null;
      }
      
      // Повышение зарплаты после обучения (через 8 недель после обучения)
      if (state.turn === PAYDAY_CYCLE * 2) {
        // Проверяем, было ли обучение в логе
        const hasEducation = state.log.some(entry => 
          entry.description.includes("Инвестиция в образование")
        );
        if (hasEducation) {
          state.monthlySalary = Math.round(state.monthlySalary * 1.15); // +15% к зарплате
          addLogEntry(state, "income", "Повышение зарплаты после обучения", 0);
        }
      }
      
      updateNetWorthAndTree(state);
      checkGameOverConditions(state);
    },
    makeChoice(state, action: PayloadAction<Choice>) {
      const choice = action.payload;
      const effects = choice.effects;
      if (effects.balance) {
        state.balance += effects.balance;
        addLogEntry(
          state,
          effects.balance > 0 ? "income" : "expense",
          choice.text,
          effects.balance
        );
      }
      if (effects.mood) {
        state.mood += effects.mood;
        addLogEntry(state, "mood", choice.text, effects.mood);
      }
      if (effects.savings) {
        if (!state.propertyInvestments) {
          state.propertyInvestments = [];
        }
        
        // Если это инвестиция в недвижимость из события
        if (choice.text.includes("квартиру") || choice.text.includes("недвижимость")) {
          const propertyInvestment: PropertyInvestment = {
            id: `${Date.now()}-${Math.random()}`,
            name: "Квартира для сдачи в аренду",
            type: "apartment",
            amount: Math.abs(effects.savings),
            monthlyIncome: Math.abs(effects.savings) * 0.01, // 1% в месяц
            purchaseTurn: state.turn,
            description: "Инвестиционная недвижимость, приносящая пассивный доход"
          };
          state.propertyInvestments.push(propertyInvestment);
          addLogEntry(state, "savings", choice.text, effects.savings);
        } 
        // Если это криптовалютная инвестиция
        else if (choice.text.includes("криптовалют") || choice.text.includes("крипту")) {
          const cryptoInvestment: PropertyInvestment = {
            id: `${Date.now()}-${Math.random()}`,
            name: "Криптовалютная инвестиция",
            type: "crypto",
            amount: Math.abs(effects.savings),
            monthlyIncome: 0, // Криптовалюта не приносит регулярный доход
            purchaseTurn: state.turn,
            description: "Высокорисковая инвестиция в криптовалюту"
          };
          state.propertyInvestments.push(cryptoInvestment);
          addLogEntry(state, "savings", choice.text, effects.savings);
        }
        // Если это инвестиция в акции
        else if (choice.text.includes("акци") || choice.text.includes("фондовый рынок")) {
          const stockInvestment: PropertyInvestment = {
            id: `${Date.now()}-${Math.random()}`,
            name: "Инвестиция в акции",
            type: "stocks",
            amount: Math.abs(effects.savings),
            monthlyIncome: Math.abs(effects.savings) * 0.005, // 0.5% в месяц
            purchaseTurn: state.turn,
            description: "Инвестиция в фондовый рынок"
          };
          state.propertyInvestments.push(stockInvestment);
          addLogEntry(state, "savings", choice.text, effects.savings);
        }
        else {
          // Обычные сбережения (банковские вклады)
          state.savings += effects.savings;
          addLogEntry(state, "savings", choice.text, effects.savings);
        }
      }
      if (effects.debt) {
        state.debt += effects.debt;
        addLogEntry(state, "debt", choice.text, effects.debt);
      }
      
      // Обработка изменений системных переменных
      if (choice.text.includes("Согласиться на повышение")) {
        // Повышение арендной платы на 20%
        state.monthlyBills = Math.round(state.monthlyBills * 1.2);
        addLogEntry(state, "expense", "Повышение арендной платы", 0);
      } else if (choice.text.includes("Попытаться договориться")) {
        // Повышение арендной платы на 10% (компромисс)
        state.monthlyBills = Math.round(state.monthlyBills * 1.1);
        addLogEntry(state, "expense", "Компромиссное повышение аренды", 0);
      } else if (choice.text.includes("Согласиться на обучение")) {
        // Повышение зарплаты после обучения (через 8 недель)
        // Пока просто логируем, реальное повышение будет в confirmGlossaryRead
        addLogEntry(state, "income", "Инвестиция в образование", 0);
      } else if (choice.text.includes("Согласиться на сверхурочные")) {
        // Временное повышение еженедельных расходов из-за усталости
        state.weeklySpends = Math.round(state.weeklySpends * 1.1);
        addLogEntry(state, "expense", "Увеличение расходов из-за усталости", 0);
      }
      
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
      
      // FIRST_SAVINGS - открыть первый накопительный счет
      if ((effects.savings || 0) > 0 && state.savings > 0) {
        checkAndUnlock("FIRST_SAVINGS");
      }
      
      // CREDIT_BAPTISM - взять первый кредит (только через выборы, не экстренный)
      if ((effects.debt || 0) > 0 && state.debt > 0 && choice.text !== "Экстренный кредит на оплату счетов") {
        checkAndUnlock("CREDIT_BAPTISM");
      }
      
      // MONEY_BOX - накопить более 82000₽ на балансе и сбережениях
      if (state.balance + state.savings > 82000) {
        checkAndUnlock("MONEY_BOX");
      }
      
      // FINANCIAL_WISDOM - отказаться от дорогой покупки
      if (choice.text === "Вежливо отказаться") {
        checkAndUnlock("FINANCIAL_WISDOM");
      }
      
      // ANTIFRAGILITY - справиться с непредвиденными расходами без долгов
      if (
        (choice.text === "Починить старый в мастерской" ||
         choice.text === "Купить новый, но недорогой") &&
        state.debt === 0
      ) {
        checkAndUnlock("ANTIFRAGILITY");
      }
    },
    payDebt(state, action: PayloadAction<number>) {
      let amountToPay = action.payload;
      if (amountToPay <= 0) return;
      if (amountToPay > state.balance) {
        amountToPay = state.balance;
      }
      if (amountToPay > state.debt) {
        amountToPay = state.debt;
      }
      state.balance -= amountToPay;
      state.debt -= amountToPay;
      addLogEntry(state, "expense", "Погашение долга", -amountToPay);
      updateNetWorthAndTree(state);
    },
    openDeposit(
      state,
      action: PayloadAction<{ offer: BankOffer; amount: number; term: number }>
    ) {
      const { offer, amount, term } = action.payload;
      if (amount <= 0 || state.balance < amount) {
        return;
      }
      state.balance -= amount;
      const newDeposit: ActiveDeposit = {
        id: `${Date.now()}-${Math.random()}`,
        bankId: offer.id,
        bankName: offer.bankName,
        amount,
        annualRate: offer.annualRate,
        term,
        startTurn: state.turn,
        endTurn: state.turn + term,
      };
      state.activeDeposits.push(newDeposit);
      state.availableOffers = state.availableOffers.filter(
        (availableOffer) => availableOffer.id !== offer.id
      );
      addLogEntry(
        state,
        "savings",
        `Открытие вклада в ${offer.bankName}`,
        amount
      );
      updateNetWorthAndTree(state);
    },
    closeResultModal(state) {
      state.isResultModalOpen = false;
      checkGameOverConditions(state);
    },
    clearNewAchievement(state) {
      state.newlyUnlockedAchievement = null;
    },
    addPropertyInvestment(state, action: PayloadAction<PropertyInvestment>) {
      if (!state.propertyInvestments) {
        state.propertyInvestments = [];
      }
      state.propertyInvestments.push(action.payload);
      updateNetWorthAndTree(state);
    },
    updateSystemVariables(state, action: PayloadAction<{
      monthlyBills?: number;
      weeklySpends?: number;
      monthlySalary?: number;
    }>) {
      if (action.payload.monthlyBills !== undefined) {
        state.monthlyBills = action.payload.monthlyBills;
      }
      if (action.payload.weeklySpends !== undefined) {
        state.weeklySpends = action.payload.weeklySpends;
      }
      if (action.payload.monthlySalary !== undefined) {
        state.monthlySalary = action.payload.monthlySalary;
      }
    },
    resetGame: (state) => {
      // Reset all properties to their initial values explicitly
      state.balance = initialState.balance;
      state.mood = initialState.mood;
      state.savings = initialState.savings;
      state.debt = initialState.debt;
      state.treeStage = initialState.treeStage;
      state.turn = initialState.turn;
      state.activeDeposits = [];
      state.propertyInvestments = [];
      state.availableOffers = [...bankOffersPool]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      state.moodAtZeroTurns = initialState.moodAtZeroTurns;
      state.gameOverState = { isGameOver: false };
      state.currentEvent = null;
      state.log = [];
      state.netWorthHistory = [{ week: 0, netWorth: initialState.balance }];
      state.lastChoiceResult = null;
      state.isEventModalOpen = false;
      state.isResultModalOpen = false;
      state.unlockedAchievements = [];
      state.newlyUnlockedAchievement = null;
      state.isGlossaryForced = false;
      state.forcedGlossaryTerm = null;
      state.monthlyBills = initialState.monthlyBills;
      state.weeklySpends = initialState.weeklySpends;
      state.monthlySalary = initialState.monthlySalary;

      // Set the status to 'succeeded' to indicate a ready, playable state
      state.status = "succeeded";
    },
    setGameState(state, action: PayloadAction<GameState>) {
      const loadedState = action.payload;
      Object.assign(state, loadedState, { status: "succeeded" });
    },
    setGameLoadingStatus(
      state,
      action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">
    ) {
      state.status = action.payload;
    },
  },
});

export const {
  startNextTurn,
  confirmGlossaryRead,
  makeChoice,
  payDebt,
  openDeposit,
  closeResultModal,
  clearNewAchievement,
  addPropertyInvestment,
  updateSystemVariables,
  resetGame,
  setGameState,
  setGameLoadingStatus,
} = gameSlice.actions;
export default gameSlice.reducer;