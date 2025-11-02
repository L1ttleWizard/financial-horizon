// src/data/bankOffers.ts

export interface BankOffer {
    id: string;
    bankName: string;
    description: string;
    // Годовая процентная ставка
    annualRate: number; 
    // Возможные сроки вклада в неделях (ходах)
    termOptions: number[]; 
    minDeposit: number;
    maxDeposit: number;
}

// Пул всех возможных предложений. В игре будем показывать случайные 2-3 из них.
export const bankOffersPool: BankOffer[] = [
    {
        id: 'reliable_start',
        bankName: 'Банк "Надёжный Старт"',
        description: 'Идеальный вариант для вашего первого вклада. Просто и безопасно.',
        annualRate: 0.12, // 12%
        termOptions: [4, 8],
        minDeposit: 10000,
        maxDeposit: 50000,
    },
    {
        id: 'quick_income',
        bankName: '"Быстрый Доход" банк',
        description: 'Короткие сроки, высокие проценты. Для тех, кто ценит время.',
        annualRate: 0.20, // 20%
        termOptions: [4, 6],
        minDeposit: 25000,
        maxDeposit: 100000,
    },
    {
        id: 'green_invest',
        bankName: '"Зелёные Инвестиции"',
        description: 'Ваш вклад в экологически чистые проекты. Долгосрочная выгода для вас и для планеты.',
        annualRate: 0.18, // 18%
        termOptions: [12, 24, 36],
        minDeposit: 50000,
        maxDeposit: 500000,
    },
    {
        id: 'capital_growth',
        bankName: '"Рост Капитала"',
        description: 'Сбалансированное предложение для уверенного приумножения ваших средств.',
        annualRate: 0.15, // 15%
        termOptions: [8, 12, 16],
        minDeposit: 30000,
        maxDeposit: 250000,
    },
    {
        id: 'premium_client',
        bankName: '"Премиум" банк',
        description: 'Эксклюзивные условия для крупных инвесторов. Максимальная доходность на длительный срок.',
        annualRate: 0.22, // 22%
        termOptions: [24, 36],
        minDeposit: 100000,
        maxDeposit: 1000000,
    },
    {
        id: 'flexible_account',
        bankName: '"Гибкий" банк',
        description: 'Краткосрочный вклад, чтобы деньги не лежали без дела. Идеально для временного размещения.',
        annualRate: 0.10, // 10%
        termOptions: [2, 4],
        minDeposit: 5000,
        maxDeposit: 100000,
    },
    {
        id: 'strategic_reserve',
        bankName: '"Стратегический Резерв"',
        description: 'Для самых терпеливых инвесторов. Заморозьте средства надолго и получите максимальную прибыль.',
        annualRate: 0.25, // 25%
        termOptions: [52, 104],
        minDeposit: 75000,
        maxDeposit: 750000,
    },
    {
        id: 'innovators_choice',
        bankName: '"Выбор Инноватора"',
        description: 'Инвестиции в технологии будущего. Конкурентная ставка для среднесрочных вложений.',
        annualRate: 0.19, // 19%
        termOptions: [12, 18],
        minDeposit: 40000,
        maxDeposit: 400000,
    }
];
