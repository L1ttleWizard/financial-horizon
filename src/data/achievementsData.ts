// src/data/achievementsData.ts

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export const achievementsData: Achievement[] = [
    {
        id: 'FIRST_SAVINGS',
        title: 'Первые сбережения',
        description: 'Открыть свой первый накопительный счет.',
        icon: '🏦',
    },
    {
        id: 'MONEY_BOX',
        title: 'Копилка',
        description: 'Накопить на балансе и сбережениях более 1000$.',
        icon: '💰',
    },
    {
        id: 'CREDIT_BAPTISM',
        title: 'Крещение кредитом',
        description: 'Взять свой первый кредит.',
        icon: '💳',
    },
    {
        id: 'FINANCIAL_WISDOM',
        title: 'Финансовая мудрость',
        description: 'Отказаться от дорогой покупки, которая вам не по карману.',
        icon: '🦉',
    },
    {
        id: 'FIRST_STEPS',
        title: 'Первые шаги',
        description: 'Завершить первый игровой месяц.',
        icon: '👣',
    },
    {
        id: 'ANTIFRAGILITY',
        title: 'Антихрупкость',
        description: 'Успешно справиться с непредвиденными расходами, не влезая в долги.',
        icon: '🛡️',
    },
];

// Функция для удобного поиска ачивки по ID
export const getAchievementById = (id: string) => achievementsData.find(a => a.id === id);