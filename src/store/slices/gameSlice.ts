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
  day: number;
  type: LogType;
  description: string;
  amount: number;
  metrics: {
    balance: number;
    mood: number;
    savings: number;
    debt: number;
    netWorth: number;
  };
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
  type: "apartment" | "commercial" | "crypto" | "stocks";
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
  day: number;
  netWorth: number;
}
type ChoiceEffects = Choice["effects"];

type SerializableGameEvent = Omit<GameEvent, "triggerCondition">;

// --- СТРУКТУРА СОСТОЯНИЯ ---
export interface GameState {
  status: "idle" | "loading" | "succeeded" | "failed";
  balance: number;
  mood: number;
  savings: number;
  debt: number;
  treeStage: number;
  day: number; // RENAMED from turn
  activeDeposits: ActiveDeposit[];
  propertyInvestments: PropertyInvestment[];
  availableOffers: BankOffer[];
  moodAtZeroTurns: number;
  gameOverState: { isGameOver: false } | GameOverState;
  currentEvent: SerializableGameEvent | null;
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
  negativeEventCounter: number;
  lastEventId: string | null;
  areOffersInitialized: boolean;
  mascot: string;
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
  day: 0, // RENAMED from turn
  activeDeposits: [],
  propertyInvestments: [],
  availableOffers: [],
  moodAtZeroTurns: 0,
  gameOverState: { isGameOver: false },
  currentEvent: null,
  log: [],
  netWorthHistory: [{ day: 0, netWorth: 41000 }], // RENAMED from week
  lastChoiceResult: null,
  isEventModalOpen: false,
  isResultModalOpen: false,
  unlockedAchievements: [],
  newlyUnlockedAchievement: null,
  isGlossaryForced: false,
  forcedGlossaryTerm: null,
  negativeEventCounter: 0,
  lastEventId: null,
  areOffersInitialized: false,
  mascot: "fox",
  monthlyBills: 49200,
  weeklySpends: 10000,
  monthlySalary: 131200,
};

const getNetWorth = (state: GameState) => {
  const bankSavings = (state.activeDeposits || []).reduce(
    (sum, dep) => sum + dep.amount,
    0
  );
  const propertyValue = (state.propertyInvestments || []).reduce(
    (sum, prop) => sum + prop.amount,
    0
  );
  const savings = bankSavings + propertyValue;
  return state.balance + savings - state.debt;
};

const addLogEntry = (
  state: GameState,
  type: LogType,
  description: string,
  amount: number
) => {
  if (amount === 0 && type !== "income" && type !== "expense") return;
  const netWorth = getNetWorth(state);
  state.log.push({
    id: `${Date.now()}-${Math.random()}`,
    day: state.day,
    type,
    description,
    amount,
    metrics: {
      balance: state.balance,
      mood: state.mood,
      savings: state.savings,
      debt: state.debt,
      netWorth: netWorth,
    },
  });
};

const applyBalanceChange = (
  state: GameState,
  amount: number,
  description: string
) => {
  if (amount === 0) return;

  if (amount > 0) {
    state.balance += amount;
    addLogEntry(state, "income", description, amount);
  } else {
    const expense = Math.abs(amount);
    if (state.balance >= expense) {
      state.balance -= expense;
      addLogEntry(state, "expense", description, -expense);
    } else {
      const shortfall = expense - state.balance;
      if (state.balance > 0) {
        addLogEntry(
          state,
          "expense",
          `Частичная оплата: ${description}`,
          -state.balance
        );
        state.balance = 0;
      }
      state.debt += shortfall;
      state.mood += MOOD_PENALTY_FOR_DEBT;
      addLogEntry(
        state,
        "debt",
        `Экстренный кредит: ${description}`,
        shortfall
      );
      addLogEntry(
        state,
        "mood",
        "Стресс из-за нового долга",
        MOOD_PENALTY_FOR_DEBT
      );
    }
  }
};

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

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
  state.netWorthHistory.push({ day: state.day, netWorth });
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

const checkAllAchievements = (state: GameState) => {
  const checkAndUnlock = (id: string) => {
    if (!state.unlockedAchievements.includes(id)) {
      state.unlockedAchievements.push(id);
      state.newlyUnlockedAchievement = getAchievementById(id) || null;
    }
  };

  // Tier 1
  if (state.day >= PAYDAY_CYCLE) checkAndUnlock("FIRST_STEPS");
  if (state.savings > 0) checkAndUnlock("FIRST_SAVINGS");
  if (state.debt > 0) checkAndUnlock("CREDIT_BAPTISM");
  if (state.debt === 0 && state.log.some((e) => e.type === "debt"))
    checkAndUnlock("DEBT_FREE");
  if (
    state.log.filter(
      (e) =>
        e.description.includes("Экономный") ||
        e.description.includes("недорогой")
    ).length >= 3
  )
    checkAndUnlock("WISE_SHOPPER");
  if (state.log.filter((e) => e.description.includes("Подработка")).length >= 3)
    checkAndUnlock("SIDE_HUSTLER");

  // Tier 2
  const totalExpenses = state.monthlyBills + state.weeklySpends * 4;
  if (state.savings >= totalExpenses * 3) checkAndUnlock("RAINY_DAY_FUND");
  if (state.activeDeposits.length > 0 && state.propertyInvestments.length > 0)
    checkAndUnlock("DIVERSIFIER");
  if (state.propertyInvestments.length > 0) checkAndUnlock("REAL_ESTATE_MOGUL");
  if (state.log.some((e) => e.description.includes("Завершение вклада")))
    checkAndUnlock("COMPOUND_MAGIC");
  if (state.debt === 0 && state.day > 12) checkAndUnlock("DEBT_AVOIDER");
  if (state.log.some((e) => e.description.includes("Благотворительность")))
    checkAndUnlock("PHILANTHROPIST");

  // Tier 3
  const netWorth = state.balance + state.savings - state.debt;
  if (netWorth >= 1000000) checkAndUnlock("MILLIONAIRE");
  // More complex logic for passive income would be needed here
  if (state.log.some((e) => e.description.includes("Глобальная рецессия")))
    checkAndUnlock("CRISIS_MANAGER");
  if (state.log.some((e) => e.description.includes("Написать книгу")))
    checkAndUnlock("BOOK_AUTHOR");
  const totalDebtPaid = state.log
    .filter((e) => e.description === "Погашение долга")
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
  if (totalDebtPaid > 200000) checkAndUnlock("ZERO_DEBT_MASTER");
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

      state.day += 1;

      // --- PAYDAY LOGIC ---
      if (state.day > 0 && state.day % PAYDAY_CYCLE === 0) {
        const randomIndex = Math.floor(Math.random() * glossaryData.length);
        state.forcedGlossaryTerm = glossaryData[randomIndex];
        state.isGlossaryForced = true;
        return; // Skip event selection on payday
      }

      // --- DEPOSIT COMPLETION ---
      const completedDeposits = state.activeDeposits.filter(
        (dep) => state.day >= dep.endTurn
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
          (dep) => state.day < dep.endTurn
        );
        updateNetWorthAndTree(state);
      }

      // --- WEEKLY SPENDS ---
      applyBalanceChange(state, -state.weeklySpends, "Еда и транспорт");

      // --- EVENT DIRECTOR LOGIC ---

      // 1. Determine eligible difficulty tiers
      const netWorth = state.balance + state.savings - state.debt;
      let maxDifficulty = 1;
      if (state.day > 8 || netWorth > 100000) maxDifficulty = 2;
      if (state.day > 24 || netWorth > 300000) maxDifficulty = 3;

      // 2. Filter events by difficulty and cooldown
      let eligibleEvents = gameEventsPool.filter(
        (event) =>
          event.difficulty <= maxDifficulty && event.id !== state.lastEventId
      );

      // 3. Prevent "death spiral" of negative events
      if (state.negativeEventCounter >= 2) {
        eligibleEvents = eligibleEvents.filter((event) => !event.isNegative);
      }

      console.log(
        "Eligible events:",
        JSON.stringify(
          eligibleEvents.map((e) => e.id),
          null,
          2
        )
      );

      let chosenEvent: GameEvent | null = null;
      // 4. Select a random event from the eligible pool
      if (eligibleEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * eligibleEvents.length);
        chosenEvent = eligibleEvents[randomIndex];
      }

      // If no event is found (e.g., all are on cooldown or filtered out), pick a default one
      if (!chosenEvent) {
        chosenEvent =
          gameEventsPool.find((event) => event.id === "celebrate_payday") ||
          gameEventsPool[0];
      }

      console.log("Chosen event:", JSON.stringify(chosenEvent, null, 2));

      // 6. Update state based on chosen event
      const {
        id,
        title,
        description,
        illustration,
        choices,
        difficulty,
        isNegative,
      } = chosenEvent;
      const serializableEvent: SerializableGameEvent = {
        id,
        title,
        description,
        illustration,
        choices,
        difficulty,
        isNegative,
      };
      state.currentEvent = serializableEvent;
      state.lastEventId = chosenEvent.id;
      if (chosenEvent.isNegative) {
        state.negativeEventCounter += 1;
      } else {
        state.negativeEventCounter = 0;
      }

      state.isEventModalOpen = true;
    },
    confirmGlossaryRead(state) {
      state.isGlossaryForced = false;
      state.forcedGlossaryTerm = null;

      const shuffled = [...bankOffersPool].sort(() => 0.5 - Math.random());
      state.availableOffers = shuffled.slice(0, 6);

      const completedDeposits = state.activeDeposits.filter(
        (dep) => state.day >= dep.endTurn
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
          (dep) => state.day < dep.endTurn
        );
      }

      // Сначала начисляем проценты по существующему долгу (если есть)
      if (state.debt > 0) {
        const interest = Math.ceil(state.debt * DEBT_INTEREST_RATE);
        state.debt += interest;
        addLogEntry(state, "debt", "Проценты по долгу", interest);
      }

      // Затем обрабатываем оплату счетов
      applyBalanceChange(state, -state.monthlyBills, "Аренда и коммуналка");
      state.balance += state.monthlySalary;
      addLogEntry(state, "income", "Месячная зарплата", state.monthlySalary);
      state.mood += MOOD_BOOST_ON_PAYDAY;
      addLogEntry(state, "mood", "Бонус к настроению", MOOD_BOOST_ON_PAYDAY);

      // Повышение зарплаты после обучения (через 8 недель после обучения)
      if (state.day === PAYDAY_CYCLE * 2) {
        // Проверяем, было ли обучение в логе
        const hasEducation = state.log.some((entry) =>
          entry.description.includes("Инвестиция в образование")
        );
        if (hasEducation) {
          state.monthlySalary = Math.round(state.monthlySalary * 1.15); // +15% к зарплате
          addLogEntry(state, "income", "Повышение зарплаты после обучения", 0);
        }
      }

      updateNetWorthAndTree(state);
      checkGameOverConditions(state);
      checkAllAchievements(state);
    },
    makeChoice(state, action: PayloadAction<Choice>) {
      const choice = action.payload;
      const effects = choice.effects;
      if (effects.balance) {
        applyBalanceChange(state, effects.balance, choice.text);
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
        if (
          choice.text.includes("квартиру") ||
          choice.text.includes("недвижимость")
        ) {
          const propertyInvestment: PropertyInvestment = {
            id: `${Date.now()}-${Math.random()}`,
            name: "Квартира для сдачи в аренду",
            type: "apartment",
            amount: Math.abs(effects.savings),
            monthlyIncome: Math.abs(effects.savings) * 0.01, // 1% в месяц
            purchaseTurn: state.day,
            description:
              "Инвестиционная недвижимость, приносящая пассивный доход",
          };
          state.propertyInvestments.push(propertyInvestment);
          addLogEntry(state, "savings", choice.text, effects.savings);
        }
        // Если это криптовалютная инвестиция
        else if (
          choice.text.includes("криптовалют") ||
          choice.text.includes("крипту")
        ) {
          const cryptoInvestment: PropertyInvestment = {
            id: `${Date.now()}-${Math.random()}`,
            name: "Криптовалютная инвестиция",
            type: "crypto",
            amount: Math.abs(effects.savings),
            monthlyIncome: 0, // Криптовалюта не приносит регулярный доход
            purchaseTurn: state.day,
            description: "Высокорисковая инвестиция в криптовалюту",
          };
          state.propertyInvestments.push(cryptoInvestment);
          addLogEntry(state, "savings", choice.text, effects.savings);
        }
        // Если это инвестиция в акции
        else if (
          choice.text.includes("акци") ||
          choice.text.includes("фондовый рынок")
        ) {
          const stockInvestment: PropertyInvestment = {
            id: `${Date.now()}-${Math.random()}`,
            name: "Инвестиция в акции",
            type: "stocks",
            amount: Math.abs(effects.savings),
            monthlyIncome: Math.abs(effects.savings) * 0.005, // 0.5% в месяц
            purchaseTurn: state.day,
            description: "Инвестиция в фондовый рынок",
          };
          state.propertyInvestments.push(stockInvestment);
          addLogEntry(state, "savings", choice.text, effects.savings);
        } else {
          // Create a generic, instant deposit for unhandled savings effects
          const savingsAmount = effects.savings;
          if (savingsAmount > 0) {
            const newDeposit: ActiveDeposit = {
              id: `${Date.now()}-${Math.random()}`,
              bankId: "generic_savings",
              bankName: "Накопительный счет",
              amount: savingsAmount,
              annualRate: 0.05, // Default low rate
              term: 4, // Default short term
              startTurn: state.day,
              endTurn: state.day + 4,
            };
            state.activeDeposits.push(newDeposit);
            addLogEntry(state, "savings", choice.text, savingsAmount);
          }
        }
      }
      if (effects.debt) {
        state.debt += effects.debt;
        addLogEntry(state, "debt", choice.text, effects.debt);
      }

      if (effects.system_variables) {
        if (effects.system_variables.weeklySpends) {
          state.weeklySpends += effects.system_variables.weeklySpends;
          addLogEntry(
            state,
            "expense",
            "Изменение еженедельных трат",
            effects.system_variables.weeklySpends
          );
        }
        if (effects.system_variables.monthlyBills) {
          state.monthlyBills += effects.system_variables.monthlyBills;
          addLogEntry(
            state,
            "expense",
            "Изменение ежемесячных счетов",
            effects.system_variables.monthlyBills
          );
        }
        if (effects.system_variables.weeklySpends_multiplier) {
          state.weeklySpends = Math.round(
            state.weeklySpends *
              effects.system_variables.weeklySpends_multiplier
          );
          addLogEntry(state, "expense", "Изменение еженедельных трат", 0);
        }
        if (effects.system_variables.monthlyBills_multiplier) {
          state.monthlyBills = Math.round(
            state.monthlyBills *
              effects.system_variables.monthlyBills_multiplier
          );
          addLogEntry(state, "expense", "Изменение ежемесячных счетов", 0);
        }
      }

      // Обработка изменений системных переменных
      if (choice.text.includes("Согласиться на обучение")) {
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
      checkAllAchievements(state);
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
      if (state.mood <= 95) {
        state.mood += 5;
      }
      addLogEntry(state, "expense", "Погашение долга", -amountToPay);
      addLogEntry(state, "mood", "Погашение долга", 5);
      updateNetWorthAndTree(state);
      checkAllAchievements(state);
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
        startTurn: state.day,
        endTurn: state.day + term,
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
      checkAllAchievements(state);
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
    updateSystemVariables(
      state,
      action: PayloadAction<{
        monthlyBills?: number;
        weeklySpends?: number;
        monthlySalary?: number;
      }>
    ) {
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
      state.day = initialState.day;
      state.activeDeposits = [];
      state.propertyInvestments = [];
      state.availableOffers = [...bankOffersPool]
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
      state.moodAtZeroTurns = initialState.moodAtZeroTurns;
      state.gameOverState = { isGameOver: false };
      state.currentEvent = null;
      state.log = [];
      state.netWorthHistory = [{ day: 0, netWorth: initialState.balance }];
      state.lastChoiceResult = null;
      state.isEventModalOpen = false;
      state.isResultModalOpen = false;
      state.unlockedAchievements = [];
      state.newlyUnlockedAchievement = null;
      state.isGlossaryForced = false;
      state.forcedGlossaryTerm = null;
      state.negativeEventCounter = 0;
      state.lastEventId = null;
      state.areOffersInitialized = true;
      state.monthlyBills = initialState.monthlyBills;
      state.weeklySpends = initialState.weeklySpends;
      state.monthlySalary = initialState.monthlySalary;

      // Set the status to 'succeeded' to indicate a ready, playable state
      state.status = "succeeded";
    },
    setGameState(state, action: PayloadAction<GameState>) {
      const loadedState = action.payload;
      Object.assign(state, loadedState, { status: "succeeded" });
      if (!state.availableOffers || state.availableOffers.length === 0) {
        const shuffled = [...bankOffersPool].sort(() => 0.5 - Math.random());
        state.availableOffers = shuffled.slice(0, 6);
      }
      state.areOffersInitialized = true;
    },
    setGameLoadingStatus(
      state,
      action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">
    ) {
      state.status = action.payload;
    },
    startDemoEvent(state, action: PayloadAction<GameEvent>) {
      const {
        id,
        title,
        description,
        illustration,
        choices,
        difficulty,
        isNegative,
      } = action.payload;
      const serializableEvent: SerializableGameEvent = {
        id,
        title,
        description,
        illustration,
        choices,
        difficulty,
        isNegative,
      };
      state.currentEvent = serializableEvent;
      state.isEventModalOpen = true;
    },
    initializeOffers(state) {
      const shuffled = [...bankOffersPool].sort(() => 0.5 - Math.random());
      state.availableOffers = shuffled.slice(0, 6);
      state.areOffersInitialized = true;
    },
    setMascot(state, action: PayloadAction<string>) {
      state.mascot = action.payload;
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
  startDemoEvent, // Export the new action
  initializeOffers,
  setMascot,
} = gameSlice.actions;
export default gameSlice.reducer;
