// src/data/onboardingData.ts

export type OnboardingTrigger = {
  stateKey: "isEventModalOpen" | "isResultModalOpen" | "pathname";
  expectedValue: boolean | string;
};

export interface TutorialStep {
  step: number;
  highlightTarget: string | null;
  title: string;
  text: string;
  trigger?: OnboardingTrigger;
  position?: "top" | "bottom" | "left" | "right";
  buttonText: string;
  preStepAction?: {
    type: string;
    payload?: string | number | undefined;
  };
  nextStepAction: {
    type: string;
    payload?: string | number | undefined;
  };
}

export const onboardingSteps: TutorialStep[] = [
  {
    step: 0,
    highlightTarget: null,
    title: "Добро пожаловать!",
    text: "👋 Давайте вместе пройдем вашу первую финансовую неделю и разберемся, как все устроено.",
    buttonText: "Начать",
    nextStepAction: { type: "onboarding/nextStep" },
  },
  {
    step: 1,
    highlightTarget: "#balance-card",
    title: "Ваш Баланс",
    text: "Это деньги, которые у вас на руках. Мы выдали вам стартовый капитал.",
    position: "bottom",
    buttonText: "Понятно",
    nextStepAction: { type: "onboarding/nextStep" },
  },
  {
    step: 2,
    highlightTarget: "#mood-card",
    title: "Ваше Настроение",
    text: "Финансовые успехи его повышают, а стресс и долги — снижают. Следите за ним!",
    position: "bottom",
    buttonText: "Хорошо",
    nextStepAction: { type: "onboarding/nextStep" },
  },
  {
    step: 3,
    highlightTarget: "#start-turn-button",
    title: "Начинаем неделю",
    text: "Нажмите сюда, чтобы начать вашу первую неделю.",
    position: "bottom",
    buttonText: "Начать неделю",
    // Действие теперь просто начинает ход, а триггер ниже позаботится о переходе
    nextStepAction: { type: "game/startNextTurn" }, 
    // ТРИГГЕР: Как только откроется модалка события, онбординг перейдет на шаг 4
    trigger: { stateKey: "isEventModalOpen", expectedValue: true } 
  },
  
  {
    step: 4,
    highlightTarget: "#event-choices",
    title: "Примите решение",
    text: "Каждое событие требует вашего выбора. Внимательно читайте условия и выбирайте с умом!",
    position: "left",
    buttonText: "Понятно",
    nextStepAction: { type: "onboarding/nextStep" },
  },
  {
    step: 5,
    highlightTarget: "#recent-logs-widget",
    title: "Журнал операций",
    text: "Ваше действие уже появилось в логе. Здесь вы всегда можете увидеть последние операции.",
    position: "top",
    buttonText: "Отлично!",
    nextStepAction: { type: "onboarding/nextStep" },
  },
  {
    step: 6,
    highlightTarget: "#obligatory-spends-widget",
    title: "Обязательные расходы",
    text: "ВНИМАНИЕ! Этот виджет показывает ваши постоянные еженедельные и ежемесячные траты. Всегда учитывайте их!",
    position: "top",
    buttonText: "Понятно",
    nextStepAction: { type: "onboarding/nextStep" },
  },

  {
    step: 7,
    highlightTarget: "#glossary-button",
    title: "Глоссарий терминов",
    text: "Здесь собраны все важные финансовые термины. Изучайте их, чтобы лучше понимать игру и принимать правильные решения.",
    position: "bottom",
    buttonText: "Понятно",
    nextStepAction: { type: "onboarding/nextStep" },
  },
  // --- Ход 2: Обязательные расходы ---
  
  // --- Ход 3: Сбережения и долги ---
  {
    step: 8,
    highlightTarget: "#debt-card",
    title: "Ваш Долг",
    text: "Старайтесь, чтобы здесь всегда был ноль. Погасить долг можно, нажав на кнопку прямо на этой карточке.",
    position: "bottom",
    buttonText: "Хорошо",
    nextStepAction: { type: "onboarding/nextStep" },
  },
  {
    step: 9,
    highlightTarget: "#savings-card",
    title: "Ваши Сбережения",
    text: "Это ваш главный инструмент для роста. Деньги должны работать! Нажмите на эту карточку, чтобы узнать как.",
    position: "bottom",
    buttonText: "Понятно",
    nextStepAction: { type: "onboarding/nextStep" },
  },
  {
    step: 10,
    highlightTarget: "#savings-card",
    title: "Переходим к вкладам",
    text: "Теперь нажмите на карточку сбережений, чтобы открыть страницу управления вкладами.",
    position: "top",
    buttonText: "Перейти",
    nextStepAction: { type: "onboarding/goToSavingsPage" },
  },
  // Шаг 11 будет на странице /savings
  {
    step: 11,
    highlightTarget: null,
    title: "Центр управления вкладами",
    text: "Изучайте предложения от банков и открывайте депозиты, чтобы получать пассивный доход. Вернитесь сюда, когда накопите достаточно средств.",
    buttonText: "Вернуться к игре",
    nextStepAction: { type: "onboarding/returnToMainPage" },
  },
  // --- Финальный шаг ---
  {
    step: 12,
    highlightTarget: null,
    title: "Обучение завершено!",
    text: "🎉 Поздравляем! Теперь игра переходит в свободный режим со случайными событиями. Удачи!",
    buttonText: "Начать свободную игру!",
    nextStepAction: { type: "onboarding/finishOnboarding" },
  },
];
