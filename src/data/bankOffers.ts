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
        id: 'solid_bank',
        bankName: 'Solid Bank',
        description: 'Надежность — наше всё. Гарантированный доход без рисков.',
        annualRate: 0.05, // 5%
        termOptions: [4, 8, 12],
        minDeposit: 100,
        maxDeposit: 2000,
    },
    {
        id: 'quick_cash',
        bankName: 'QuickCash',
        description: 'Высокий доход для тех, кто не боится рисковать.',
        annualRate: 0.15, // 15%
        termOptions: [4, 8],
        minDeposit: 250,
        maxDeposit: 1000,
    },
    {
        id: 'eco_invest',
        bankName: 'EcoInvest',
        description: 'Долгосрочные вклады в зеленое будущее. Требует терпения.',
        annualRate: 0.08, // 8%
        termOptions: [12, 16, 24],
        minDeposit: 500,
        maxDeposit: 5000,
    },
    {
        id: 'capital_growth',
        bankName: 'Capital Growth',
        description: 'Сбалансированные предложения для уверенного роста.',
        annualRate: 0.07, // 7%
        termOptions: [8, 12],
        minDeposit: 16400,
        maxDeposit: 246000,
    }
];