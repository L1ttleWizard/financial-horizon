// src/data/achievementsData.ts

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export const achievementsData: Achievement[] = [
    // Tier 1
    {
        id: 'FIRST_STEPS',
        title: 'Первые шаги',
        description: 'Завершить первый игровой месяц.',
        icon: '👣',
    },
    {
        id: 'FIRST_SAVINGS',
        title: 'Первые сбережения',
        description: 'Открыть свой первый накопительный счет.',
        icon: '🏦',
    },
    {
        id: 'CREDIT_BAPTISM',
        title: 'Крещение кредитом',
        description: 'Взять свой первый кредит.',
        icon: '💳',
    },
    {
        id: 'DEBT_FREE',
        title: 'Свобода от долгов',
        description: 'Полностью погасить свой первый долг.',
        icon: '✅',
    },
    {
        id: 'WISE_SHOPPER',
        title: 'Разумный покупатель',
        description: 'Совершить 3 экономные покупки.',
        icon: '🛒',
    },
    {
        id: 'SIDE_HUSTLER',
        title: 'Мастер подработок',
        description: 'Успешно завершить 3 подработки.',
        icon: '💪',
    },

    // Tier 2
    {
        id: 'RAINY_DAY_FUND',
        title: 'На черный день',
        description: 'Сформировать подушку безопасности (накопить сумму равную 3 месяцам расходов).',
        icon: '☔',
    },
    {
        id: 'DIVERSIFIER',
        title: 'Диверсификатор',
        description: 'Иметь одновременно активный вклад и другие инвестиции.',
        icon: '📊',
    },
    {
        id: 'REAL_ESTATE_MOGUL',
        title: 'Магнат недвижимости',
        description: 'Приобрести свою первую недвижимость.',
        icon: '🏘️',
    },
    {
        id: 'COMPOUND_MAGIC',
        title: 'Магия процентов',
        description: 'Получить первую выплату процентов по вкладу.',
        icon: '✨',
    },
    {
        id: 'DEBT_AVOIDER',
        title: 'Мастер экономии',
        description: 'Прожить 3 месяца без долгов.',
        icon: '🧘',
    },
    {
        id: 'PHILANTHROPIST',
        title: 'Филантроп',
        description: 'Сделать пожертвование на благотворительность.',
        icon: '💖',
    },

    // Tier 3
    {
        id: 'MILLIONAIRE',
        title: 'Миллионер',
        description: 'Достичь чистого капитала в 1,000,000р.',
        icon: '💎',
    },
    {
        id: 'PASSIVE_INCOME',
        title: 'Финансовая свобода',
        description: 'Достичь пассивного дохода, превышающего ежемесячные расходы.',
        icon: '🏖️',
    },
    {
        id: 'CRISIS_MANAGER',
        title: 'Антикризисный менеджер',
        description: 'Успешно пережить глобальную рецессию.',
        icon: '👨‍🚒',
    },
    {
        id: 'BOOK_AUTHOR',
        title: 'Писатель',
        description: 'Завершить написание книги и получить гонорар.',
        icon: '✍️',
    },
    {
        id: 'ZERO_DEBT_MASTER',
        title: 'Повелитель долгов',
        description: 'Погасить долг на общую сумму более 200,000р.',
        icon: '⚔️',
    },
];

// Функция для удобного поиска ачивки по ID
export const getAchievementById = (id: string) => achievementsData.find(a => a.id === id);
