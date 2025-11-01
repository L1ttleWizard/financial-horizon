// src/data/gameEvents.ts
import { GameState } from "@/store/slices/gameSlice";

export interface Choice {
  text: string;
  effects: {
    balance?: number;
    mood?: number;
    savings?: number;
    debt?: number;
  };
  outcomeText: string;
  learningPoint: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  illustration: string;
  choices: Choice[];
  difficulty: 1 | 2 | 3;
  isNegative: boolean;
  triggerCondition?: (state: GameState) => boolean;
}

// Пул всех возможных событий
export const gameEventsPool: GameEvent[] = [
  // --- УРОВЕНЬ 1: "Основы" ---
  {
    id: 'celebrate_payday',
    title: '🎉 Время отпраздновать!',
    description: 'Вы отлично поработали. Как вы решите отдохнуть и развеяться?',
    illustration: 'illustrations/week1.svg',
    difficulty: 1,
    isNegative: false,
    choices: [
      { text: 'Экономный вечер дома', effects: { balance: -1640, mood: 5 }, outcomeText: 'Вы отлично отдохнули дома, потратив совсем немного.', learningPoint: 'Умная экономия! Контроль над мелкими расходами — ключ к созданию капитала.' },
      { text: 'Встретиться с друзьями в кафе', effects: { balance: -6560, mood: 15 }, outcomeText: 'Вы прекрасно провели время с друзьями, зарядившись позитивом.', learningPoint: 'Баланс! Важно не только копить, но и жить, чтобы избежать эмоционального выгорания.' },
      { text: 'Гуляем на все!', effects: { balance: -20500, mood: 25 }, outcomeText: 'Это был незабываемый вечер! Правда, кошелек заметно опустел.', learningPoint: 'Осторожно: инфляция образа жизни! Когда с ростом дохода растут и траты, копить становится сложно.' },
    ],
  },
  {
    id: 'broken_phone',
    title: '📱 Внезапная поломка!',
    description: 'Ваш смартфон упал и больше не включается. Нужно срочно найти замену.',
    illustration: 'illustrations/week2.svg',
    difficulty: 1,
    isNegative: true,
    choices: [
      { text: 'Починить старый в мастерской', effects: { balance: -8200, mood: -5 }, outcomeText: 'Телефон снова работает, но он уже не такой быстрый, как раньше.', learningPoint: 'Финансовая подушка! Вам повезло, что были деньги на ремонт. Это доказывает важность запаса средств.' },
      { text: 'Купить новый, но недорогой', effects: { balance: -32800, mood: 5 }, outcomeText: 'Вы купили новый функциональный телефон, не влезая в долги.', learningPoint: 'Планирование! Крупные покупки лучше планировать заранее, чтобы они не били по бюджету.' },
      { text: 'Взять флагман в кредит', effects: { balance: -4100, debt: 61500, mood: 15 }, outcomeText: 'У вас в руках новейший гаджет! Теперь главное — не забывать о ежемесячных платежах.', learningPoint: 'Что такое кредит? Это удобный инструмент, но он требует дисциплины. Просрочки портят кредитную историю.' },
    ],
  },
  {
    id: 'first_savings',
    title: '🌱 Время сажать семена',
    description: 'У вас на счете скопилась приличная сумма. Может, заставить эти деньги работать?',
    illustration: 'illustrations/week3.svg',
    difficulty: 1,
    isNegative: false,
    triggerCondition: (state) => state.balance > 40000 && state.savings === 0,
    choices: [
      { text: 'Оставить все как есть', effects: {}, outcomeText: 'Деньги лежат на счете, но их покупательная способность понемногу уменьшается.', learningPoint: 'Инфляция — тихий вор. Деньги, которые не работают, со временем теряют свою ценность.' },
      { text: 'Открыть вклад в банке', effects: { balance: -41000, savings: 41000, mood: 5 }, outcomeText: 'Вы перевели часть денег в сбережения. Они в безопасности и приносят небольшой доход.', learningPoint: 'Первый шаг к инвестициям! Вклады — простой и безопасный способ защитить деньги от инфляции.' },
      { text: 'Вложиться в "стартап" друга', effects: { balance: -24600, savings: 24600, mood: 10 }, outcomeText: 'Вы поддержали друга и, возможно, в будущем получите большую прибыль. А может, и нет.', learningPoint: 'Риск и доходность! Высокорисковые инвестиции могут принести большую прибыль, но есть и шанс все потерять.' },
    ],
  },
  {
    id: 'freelance_gig',
    title: '💻 Подработка',
    description: 'Появилась возможность взять небольшой проект на выходные и подзаработать.',
    illustration: 'illustrations/freelance.svg',
    difficulty: 1,
    isNegative: false,
    choices: [
      { text: 'Взяться за работу', effects: { balance: 16400, mood: -5 }, outcomeText: 'Выходные прошли за работой, но баланс пополнился.', learningPoint: 'Дополнительный доход ускоряет достижение целей.' },
      { text: 'Отказаться и отдохнуть', effects: { mood: 10 }, outcomeText: 'Вы отлично отдохнули и набрались сил.', learningPoint: 'Отдых тоже важен, чтобы избежать выгорания.' },
    ],
  },
  {
    id: 'unexpected_gift',
    title: '🎁 Неожиданный подарок',
    description: 'Дальний родственник прислал вам в подарок немного денег.',
    illustration: 'illustrations/gift.svg',
    difficulty: 1,
    isNegative: false,
    choices: [
      { text: 'Принять с благодарностью', effects: { balance: 8200, mood: 10 }, outcomeText: 'Приятный сюрприз! Это поможет вашему бюджету.', learningPoint: 'Иногда удача улыбается вам. Главное — правильно распорядиться такими подарками.' },
    ],
  },
  {
    id: 'sale_temptation',
    title: '🛍️ Большая распродажа',
    description: 'В любимом магазине скидки до 70% на вещи, о которых вы давно мечтали.',
    illustration: 'illustrations/sale.svg',
    difficulty: 1,
    isNegative: true,
    choices: [
      { text: 'Купить только необходимое', effects: { balance: -4100, mood: 5 }, outcomeText: 'Вы сделали выгодную покупку, не выходя за рамки бюджета.', learningPoint: 'Планирование покупок помогает экономить даже на распродажах.' },
      { text: 'Поддаться искушению', effects: { balance: -24600, mood: 20 }, outcomeText: 'У вас много новых вещей, но и дыра в бюджете.', learningPoint: 'Импульсивные покупки — главный враг бюджета.' },
      { text: 'Проигнорировать', effects: { mood: -5 }, outcomeText: 'Вы устояли, хотя было немного обидно.', learningPoint: 'Финансовая дисциплина требует силы воли.' },
    ],
  },
  {
    id: 'subscription_audit',
    title: '갱️ Ревизия подписок',
    description: 'Вы заметили, что каждый месяц с вашей карты списываются деньги за подписки на сервисы, которыми вы почти не пользуетесь.',
    illustration: 'illustrations/subscriptions.svg',
    difficulty: 1,
    isNegative: false,
    choices: [
      { text: 'Отменить все ненужные', effects: { balance: 3280, mood: 10 }, outcomeText: 'Вы отменили лишние подписки и освободили часть денег в бюджете.', learningPoint: 'Регулярный аудит подписок — отличная финансовая привычка, которая экономит деньги в долгосрочной перспективе.' },
      { text: 'Оставить все как есть', effects: {}, outcomeText: 'Вы решили не тратить время на отмену подписок.', learningPoint: 'Маленькие, но регулярные траты со временем превращаются в большие суммы. Это называется "эффект латте".' },
    ],
  },
  {
    id: 'simple_pleasures',
    title: '☕ Маленькие радости',
    description: 'Вы проходите мимо уютной кофейни с невероятным запахом свежей выпечки. Может, стоит себя немного побаловать?',
    illustration: 'illustrations/coffee.svg',
    difficulty: 1,
    isNegative: false,
    triggerCondition: (state) => state.mood < 50,
    choices: [
      { text: 'Зайти на чашку кофе', effects: { balance: -820, mood: 15 }, outcomeText: 'Вы потратили немного денег, но получили огромный заряд хорошего настроения!', learningPoint: 'Небольшие, осознанные траты на то, что приносит радость, помогают поддерживать высокий уровень настроения.' },
      { text: 'Пройти мимо и сэкономить', effects: {}, outcomeText: 'Вы сэкономили деньги, но упустили возможность для маленького праздника.', learningPoint: 'Жесткая экономия на всем может привести к эмоциональному выгоранию и более крупным срывам в будущем.' },
    ],
  },
  {
    id: 'public_transport_pass',
    title: '🚌 Проездной на транспорт',
    description: 'Вы можете купить проездной на месяц. Это разовая трата, которая уменьшит ваши еженедельные расходы на транспорт.',
    illustration: 'illustrations/transport.svg',
    difficulty: 1,
    isNegative: false,
    choices: [
      { text: 'Купить проездной', effects: { balance: -10000 }, outcomeText: 'Вы купили проездной, теперь ваши еженедельные траты на транспорт снизятся.', learningPoint: 'Инвестиции в снижение регулярных расходов — это умный способ оптимизировать бюджет.' },
      { text: 'Продолжать платить за каждую поездку', effects: {}, outcomeText: 'Вы решили не покупать проездной.', learningPoint: 'Иногда стоит потратить деньги сейчас, чтобы сэкономить в будущем.' },
    ],
  },
  {
    id: 'grocery_shopping_strategy',
    title: '🛒 Стратегия покупок',
    description: 'Вы в супермаркете. Как вы будете закупаться продуктами на неделю?',
    illustration: 'illustrations/grocery.svg',
    difficulty: 1,
    isNegative: false,
    choices: [
      { text: 'Купить только по скидке', effects: { balance: -7000, mood: 5 }, outcomeText: 'Вы купили все необходимое со скидками и чувствуете себя молодцом.', learningPoint: 'Охота за скидками может быть эффективной стратегией экономии.' },
      { text: 'Строго по списку', effects: { balance: -9000 }, outcomeText: 'Вы купили все по списку, не отвлекаясь на лишнее.', learningPoint: 'Планирование покупок — основа контроля над бюджетом.' },
      { text: 'Купить все, что выглядит вкусно', effects: { balance: -12000, mood: 10 }, outcomeText: 'Вы набрали полную корзину вкусностей, но потратили больше, чем планировали.', learningPoint: 'Импульсивные покупки часто приводят к перерасходу средств.' },
    ],
  },
  {
    id: 'birthday_gift_choice',
    title: '🎂 Подарок на день рождения',
    description: 'На ваш день рождения семья предлагает подарить вам либо деньги, либо новый гаджет.',
    illustration: 'illustrations/gift.svg',
    difficulty: 1,
    isNegative: false,
    choices: [
      { text: 'Взять деньги', effects: { balance: 15000, mood: 5 }, outcomeText: 'Вы получили деньги и можете потратить их, как захотите.', learningPoint: 'Деньги — это универсальный подарок, который дает вам свободу выбора.' },
      { text: 'Взять гаджет', effects: { mood: 20 }, outcomeText: 'Вы получили новый гаджет, о котором мечтали!', learningPoint: 'Иногда эмоциональная ценность подарка важнее его денежного эквивалента.' },
    ],
  },
  {
    id: 'gym_membership',
    title: '💪 Абонемент в спортзал',
    description: 'Рядом с домом открылся новый спортзал с выгодным предложением.',
    illustration: 'illustrations/gym.svg',
    difficulty: 1,
    isNegative: false,
    choices: [
      { text: 'Купить абонемент', effects: { balance: -5000, mood: 5 }, outcomeText: 'Вы начали заниматься спортом, что улучшило ваше настроение и самочувствие.', learningPoint: 'Инвестиции в здоровье — это инвестиции в ваше будущее и продуктивность.' },
      { text: 'Заниматься дома', effects: { mood: 5 }, outcomeText: 'Вы решили заниматься дома, экономя деньги.', learningPoint: 'Для поддержания формы не всегда нужны большие затраты. Главное — дисциплина.' },
      { text: 'Проигнорировать', effects: {}, outcomeText: 'Вы решили, что у вас нет времени на спорт.', learningPoint: 'Недостаток физической активности может негативно сказаться на настроении и здоровье в долгосрочной перспективе.' },
    ],
  },
  {
    id: 'bulk_buying',
    title: '📦 Оптовая закупка',
    description: 'В оптовом магазине большая скидка на товары, которыми вы регулярно пользуетесь. Можно сэкономить в долгосрочной перспективе.',
    illustration: 'illustrations/bulk.svg',
    difficulty: 1,
    isNegative: false,
    choices: [
      { text: 'Закупиться впрок', effects: { balance: -15000, mood: 5 }, outcomeText: 'Вы потратили приличную сумму, но теперь у вас есть запас на несколько месяцев.', learningPoint: 'Оптовые закупки могут быть выгодными, но требуют наличия свободных средств и места для хранения.' },
      { text: 'Придерживаться обычных покупок', effects: {}, outcomeText: 'Вы решили не тратить большую сумму сразу.', learningPoint: 'Важно соотносить потенциальную выгоду с текущими финансовыми возможностями.' },
    ],
  },
  {
    id: 'diy_repair',
    title: '🔧 Ремонт своими руками',
    description: 'Сломался мелкий бытовой прибор. Можно попробовать починить самостоятельно по видео-инструкции или вызвать мастера.',
    illustration: 'illustrations/repair.svg',
    difficulty: 1,
    isNegative: true,
    choices: [
      { text: 'Починить самому', effects: { balance: -1000, mood: 15 }, outcomeText: 'У вас получилось! Вы сэкономили деньги и горды собой.', learningPoint: 'Некоторые вещи можно починить самостоятельно, сэкономив деньги и получив новые навыки.' },
      { text: 'Вызвать мастера', effects: { balance: -5000 }, outcomeText: 'Мастер быстро все починил.', learningPoint: 'Иногда лучше заплатить профессионалу, чтобы сэкономить время и нервы.' },
    ],
  },
  {
    id: 'lost_wallet',
    title: '💸 Потерянный кошелек',
    description: 'Вы не можете найти свой кошелек. Возможно, вы его где-то обронили.',
    illustration: 'illustrations/lost_wallet.svg',
    difficulty: 1,
    isNegative: true,
    choices: [
      { text: 'Смириться с потерей', effects: { balance: -5000, mood: -10 }, outcomeText: 'Вы мысленно попрощались с деньгами и заблокировали карты.', learningPoint: 'Иногда потери неизбежны. Важно иметь финансовую подушку для таких случаев.' },
      { text: 'Искать весь день', effects: { mood: -15 }, outcomeText: 'Вы потратили весь день на поиски, но так ничего и не нашли. Деньги и настроение потеряны.', learningPoint: 'Иногда нужно вовремя остановиться и не тратить еще больше ресурсов на безнадежное дело.' },
    ],
  },
  {
    id: 'minor_appliance_failure',
    title: '🔌 Сломалась микроволновка',
    description: 'Ваша микроволновая печь внезапно перестала работать.',
    illustration: 'illustrations/microwave.svg',
    difficulty: 1,
    isNegative: true,
    choices: [
      { text: 'Купить новую', effects: { balance: -8000 }, outcomeText: 'Вы купили новую микроволновку. Быстро, но затратно.', learningPoint: 'Бытовая техника имеет свойство ломаться. Хорошо, когда на это есть отдельный фонд.' },
      { text: 'Обойтись без нее', effects: { mood: -5 }, outcomeText: 'Вы решили пока обходиться без микроволновки, разогревая еду на плите.', learningPoint: 'Некоторые удобства не являются необходимостью. Это хороший способ проверить свои реальные потребности.' },
    ],
  },

  // --- УРОВЕНЬ 2: "Трудности роста" ---
  {
    id: 'expensive_vacation',
    title: '✈️ Отпуск мечты?',
    description: 'Коллеги зовут вас в дорогой заграничный отпуск. Поездка обойдется почти в две зарплаты.',
    illustration: 'illustrations/week4.svg',
    difficulty: 2,
    isNegative: true,
    triggerCondition: (state) => state.balance > 80000 && state.debt < 10000,
    choices: [
      { text: 'Вежливо отказаться', effects: { mood: -10 }, outcomeText: 'Вам немного грустно, но вы знаете, что приняли правильное финансовое решение.', learningPoint: 'Финансовая дисциплина! Сказать "нет" тратам не по карману — это признак финансовой зрелости.' },
      { text: 'Предложить альтернативу', effects: { balance: -12300, mood: 10 }, outcomeText: 'Вы предложили поход в горы на выходные, и некоторым коллегам эта идея понравилась!', learningPoint: 'Креативный подход! Умение находить бюджетные альтернативы — суперспособность финансово грамотного человека.' },
      { text: 'Поехать, взяв крупный кредит', effects: { debt: 123000, mood: 20 }, outcomeText: 'Вы в предвкушении невероятного отпуска! Но мысль о большом долге немного тревожит.', learningPoint: '"Плохой" долг. Кредиты на развлечения надолго ухудшают ваше финансовое положение.' },
    ],
  },
  {
    id: 'overtime_opportunity',
    title: '⏰ Сверхурочная работа',
    description: 'Начальник предлагает поработать в выходные за двойную оплату.',
    illustration: 'illustrations/overtime.svg',
    difficulty: 2,
    isNegative: false,
    choices: [
      { text: 'Согласиться на сверхурочные', effects: { balance: 24600, mood: -10 }, outcomeText: 'Вы заработали дополнительные деньги, но сильно устали.', learningPoint: 'Баланс работы и отдыха важен для долгосрочного успеха.' },
      { text: 'Отказаться и отдохнуть', effects: { mood: 15 }, outcomeText: 'Вы хорошо отдохнули и набрались сил.', learningPoint: 'Иногда отдых важнее дополнительных денег.' },
    ],
  },
  {
    id: 'career_development',
    title: '📚 Курсы повышения квалификации',
    description: 'Компания предлагает оплатить 50% стоимости полезного для работы курса.',
    illustration: 'illustrations/education.svg',
    difficulty: 2,
    isNegative: false,
    triggerCondition: (state) => !state.log.some(entry => entry.description.includes("Инвестиция в образование")),
    choices: [
      { text: 'Согласиться на обучение', effects: { balance: -16400, mood: 10 }, outcomeText: 'Вы инвестируете в свои навыки и будущую карьеру.', learningPoint: 'Инвестиции в образование — одни из лучших инвестиций в себя.' },
      { text: 'Отказаться от предложения', effects: { mood: -5 }, outcomeText: 'Вы решили сэкономить, но упустили возможность для роста.', learningPoint: 'Не всегда стоит экономить на собственном развитии.' },
    ],
  },
  {
    id: 'medical_emergency',
    title: '🏥 Зубная боль',
    description: 'У вас разболелся зуб, и визит к стоматологу нельзя откладывать.',
    illustration: 'illustrations/medical.svg',
    difficulty: 2,
    isNegative: true,
    choices: [
      { text: 'Оплатить из накоплений', effects: { balance: -24600, mood: -5 }, outcomeText: 'Вы использовали накопления на лечение. Здоровье важнее.', learningPoint: 'Финансовая подушка нужна именно для таких непредвиденных, но важных трат.' },
      { text: 'Взять кредит на лечение', effects: { debt: 24600, mood: -10 }, outcomeText: 'Вы вылечили зуб, но теперь у вас есть небольшой долг.', learningPoint: 'Кредит на здоровье — оправданный шаг, если нет других вариантов.' },
    ],
  },
  {
    id: 'friend_loan_request',
    title: '🤝 Просьба о займе',
    description: 'Близкий друг просит у вас в долг крупную сумму на "срочные дела".',
    illustration: 'illustrations/friend_loan.svg',
    difficulty: 2,
    isNegative: true,
    choices: [
      { text: 'Дать в долг', effects: { balance: -41000, mood: 5 }, outcomeText: 'Вы помогли другу, но рискуете не получить деньги обратно.', learningPoint: 'Давая в долг, будьте готовы к тому, что эти деньги к вам не вернутся. Это может испортить дружбу.' },
      { text: 'Отказать, но предложить помощь', effects: { mood: 5 }, outcomeText: 'Вы отказали в деньгах, но предложили другую поддержку, сохранив и деньги, и дружбу.', learningPoint: 'Иногда лучшая помощь — не финансовая.' },
      { text: 'Дать в долг под расписку', effects: { balance: -41000, mood: 0 }, outcomeText: 'Вы обезопасили себя юридически, но это может показаться другу недоверием.', learningPoint: 'Официальное оформление долга защищает ваши интересы, но может повлиять на отношения.' },
    ],
  },
  {
    id: 'wedding_invitation',
    title: '💒 Свадебное приглашение',
    description: 'Вас пригласили на свадьбу в другом городе. Поездка и подарок обойдутся дорого.',
    illustration: 'illustrations/wedding.svg',
    difficulty: 2,
    isNegative: true,
    choices: [
      { text: 'Поехать на свадьбу', effects: { balance: -32800, mood: 20 }, outcomeText: 'Вы побывали на прекрасной свадьбе, но потратили много денег.', learningPoint: 'Важные жизненные моменты иногда требуют расходов. Важно закладывать их в бюджет заранее.' },
      { text: 'Отправить подарок и извиниться', effects: { balance: -8200, mood: 5 }, outcomeText: 'Вы поздравили друзей, не тратясь на поездку.', learningPoint: 'Есть способы показать заботу, не разоряясь. Это разумный компромисс.' },
    ],
  },
  {
    id: 'rent_increase',
    title: '🏠 Повышение арендной платы',
    description: 'Хозяин квартиры объявил о повышении арендной платы на 20% со следующего месяца.',
    illustration: 'illustrations/rent_increase.svg',
    difficulty: 2,
    isNegative: true,
    triggerCondition: (state) => state.turn > 12 && state.turn % 12 === 0, // Happens on a yearly basis
    choices: [
      { text: 'Согласиться на повышение', effects: { mood: -10 }, outcomeText: 'Вы остались в квартире, но теперь ваши ежемесячные расходы вырастут.', learningPoint: 'Рост постоянных расходов — серьезная угроза бюджету. Нужно либо увеличивать доход, либо сокращать другие траты.' },
      { text: 'Попытаться договориться', effects: { mood: 5 }, outcomeText: 'Вы успешно договорились о меньшем повышении.', learningPoint: 'Переговоры — важный навык, который может сэкономить вам много денег.' },
      { text: 'Начать искать новое жилье', effects: { balance: -16400, mood: -5 }, outcomeText: 'Вы потратили время и деньги на поиск нового жилья. Возможно, в будущем это окупится.', learningPoint: 'Иногда переезд — это не только расходы, но и возможность найти более выгодный вариант.' },
    ],
  },
  {
    id: 'laptop_upgrade',
    title: '💻 Обновление техники',
    description: 'Ваш ноутбук устарел, и работа на нем стала неэффективной.',
    illustration: 'illustrations/laptop.svg',
    difficulty: 2,
    isNegative: true,
    choices: [
      { text: 'Купить новый дорогой ноутбук', effects: { balance: -98400, mood: 15 }, outcomeText: 'У вас теперь мощный компьютер для работы, производительность выросла.', learningPoint: 'Инвестиции в рабочие инструменты могут окупиться за счет повышения эффективности.' },
      { text: 'Купить подержанный ноутбук', effects: { balance: -32800, mood: 5 }, outcomeText: 'Вы купили б/у ноутбук, который справляется с задачами. Умно!', learningPoint: 'Подержанная техника может быть очень выгодной покупкой, если подойти к выбору с умом.' },
    ],
  },
  {
    id: 'hobby_equipment',
    title: '🎨 Хобби требует вложений',
    description: 'Вы увлеклись фотографией и хотите купить профессиональную камеру.',
    illustration: 'illustrations/camera.svg',
    difficulty: 2,
    isNegative: false,
    choices: [
      { text: 'Купить профессиональную камеру', effects: { balance: -65600, mood: 20 }, outcomeText: 'У вас теперь профессиональная камера для хобби. Ваши снимки стали лучше!', learningPoint: 'Хобби могут быть дорогими, но они важны для поддержания высокого настроения и саморазвития.' },
      { text: 'Купить бюджетную камеру', effects: { balance: -16400, mood: 10 }, outcomeText: 'Вы купили недорогую камеру, которая отлично подходит для начала.', learningPoint: 'Начинать с простого оборудования — разумный подход. Главное — навыки, а не техника.' },
      { text: 'Взять камеру в аренду', effects: { balance: -4100, mood: 5 }, outcomeText: 'Вы арендовали камеру на выходные и поняли, подходит ли вам это хобби.', learningPoint: 'Аренда позволяет попробовать дорогое оборудование, прежде чем совершать крупную покупку.' },
    ],
  },
  {
    id: 'online_course',
    title: '📖 Онлайн-курс по инвестициям',
    description: 'Вы нашли интересный курс по финансовой грамотности, но он стоит почти все ваши свободные деньги.',
    illustration: 'illustrations/online_course.svg',
    difficulty: 2,
    isNegative: false,
    choices: [
      { text: 'Купить курс', effects: { balance: -24600, mood: 10 }, outcomeText: 'Вы инвестировали в свои знания и навыки. Это точно окупится!', learningPoint: 'Образование — лучшая инвестиция в себя, которая всегда остается с вами.' },
      { text: 'Найти бесплатные материалы', effects: { mood: 5 }, outcomeText: 'Вы нашли много бесплатных ресурсов для обучения в интернете. Отлично!', learningPoint: 'Много полезной информации доступно бесплатно. Главное — желание учиться.' },
    ],
  },
  {
    id: 'insurance_offer',
    title: '🛡️ Предложение по страхованию',
    description: 'Страховой агент предлагает вам оформить полис страхования здоровья. Это ежемесячный платеж, но он защитит вас в случае беды.',
    illustration: 'illustrations/insurance.svg',
    difficulty: 2,
    isNegative: false,
    choices: [
      { text: 'Оформить страховку', effects: { balance: -4100, mood: 5 }, outcomeText: 'Вы начали платить за страховку, но теперь чувствуете себя более защищенным.', learningPoint: 'Страхование — это покупка спокойствия. Оно не приносит доход, но защищает от катастрофических убытков.' },
      { text: 'Отказаться, это дорого', effects: { mood: -5 }, outcomeText: 'Вы решили сэкономить, надеясь, что ничего плохого не случится.', learningPoint: 'Отказ от страховки — это осознанный риск, который может как сэкономить деньги, так и привести к большим потерям.' },
    ],
  },
  {
    id: 'tax_refund',
    title: '💸 Налоговый вычет',
    description: 'Отличные новости! Вы получили неожиданный налоговый вычет.',
    illustration: 'illustrations/tax_refund.svg',
    difficulty: 2,
    isNegative: false,
    choices: [
      { text: 'Погасить часть долга', effects: { balance: 15000 }, outcomeText: 'Вы разумно распорядились деньгами, уменьшив свой долг.', learningPoint: 'Погашение долга с высокой процентной ставкой — одно из лучших финансовых решений.' },
      { text: 'Инвестировать', effects: { balance: 15000, savings: 15000 }, outcomeText: 'Вы вложили деньги, чтобы они работали на вас в будущем.', learningPoint: 'Даже небольшие регулярные инвестиции могут значительно вырасти со временем благодаря сложному проценту.' },
      { text: 'Побаловать себя', effects: { balance: 15000, mood: 15 }, outcomeText: 'Вы потратили деньги на себя, что подняло вам настроение.', learningPoint: 'Важно находить баланс между сбережениями и тратами на радости жизни.' },
    ],
  },
  {
    id: 'side_hustle_burnout',
    title: '😩 Выгорание от подработок',
    description: 'Вы много работали в последнее время, и силы на исходе.',
    illustration: 'illustrations/burnout.svg',
    difficulty: 2,
    isNegative: true,
    triggerCondition: (state) => state.log.filter(e => e.description.includes("Подработка")).length > 2 && state.mood < 40,
    choices: [
      { text: 'Взять перерыв', effects: { mood: 20 }, outcomeText: 'Вы решили отдохнуть и восстановить силы.', learningPoint: 'Отдых — это не роскошь, а необходимость для поддержания продуктивности и здоровья.' },
      { text: 'Продолжать работать', effects: { mood: -15 }, outcomeText: 'Вы продолжаете работать на износ, рискуя своим здоровьем.', learningPoint: 'Хроническая усталость и выгорание могут привести к серьезным проблемам со здоровьем и потребовать еще больших трат в будущем.' },
    ],
  },
  {
    id: 'jury_duty',
    title: '⚖️ Суд присяжных',
    description: 'Вас вызвали в суд в качестве присяжного. Вы получите небольшую компенсацию, но пропустите несколько рабочих дней.',
    illustration: 'illustrations/jury.svg',
    difficulty: 2,
    isNegative: true,
    choices: [
      { text: 'Выполнить гражданский долг', effects: { balance: 5000, mood: -5 }, outcomeText: 'Вы приняли участие в судебном процессе, но потеряли часть зарплаты.', learningPoint: 'Иногда жизнь вносит свои коррективы в наши финансовые планы.' },
      { text: 'Попытаться отказаться', effects: { mood: -10 }, outcomeText: 'Вы потратили время и нервы, пытаясь отказаться, но безуспешно.', learningPoint: 'Некоторых обязанностей невозможно избежать.' },
    ],
  },
  {
    id: 'identity_theft_scare',
    title: '🔒 Угроза кражи данных',
    description: 'Вы получили уведомление о подозрительной попытке входа в ваш онлайн-банк. Деньги не пропали, но это был тревожный звонок.',
    illustration: 'illustrations/security.svg',
    difficulty: 2,
    isNegative: true,
    choices: [
      { text: 'Оплатить сервис мониторинга', effects: { balance: -10000, mood: 10 }, outcomeText: 'Вы заплатили за сервис, который будет отслеживать угрозы. Теперь вы спите спокойнее.', learningPoint: 'Кибербезопасность — это тоже часть финансовой грамотности. Защита своих данных может предотвратить большие потери.' },
      { text: 'Поменять все пароли', effects: { mood: -10 }, outcomeText: 'Вы потратили несколько часов, меняя все свои пароли. Утомительно, но необходимо.', learningPoint: 'Регулярная смена паролей и двухфакторная аутентификация — бесплатные, но эффективные способы защиты.' },
      { text: 'Проигнорировать', effects: {}, outcomeText: 'Вы решили, что это была просто ошибка, и ничего не предприняли.', learningPoint: 'Игнорирование угроз безопасности может привести к серьезным финансовым потерям в будущем.' },
    ],
  },
  {
    id: 'charity_donation',
    title: '💖 Благотворительность',
    description: 'Местная благотворительная организация проводит сбор средств на дело, которое вам небезразлично.',
    illustration: 'illustrations/charity.svg',
    difficulty: 2,
    isNegative: false,
    choices: [
      { text: 'Сделать крупное пожертвование', effects: { balance: -10000, mood: 20 }, outcomeText: 'Вы сделали доброе дело, и это принесло вам моральное удовлетворение.', learningPoint: 'Благотворительность — это не только помощь другим, но и вклад в собственное эмоциональное благополучие.' },
      { text: 'Сделать небольшое пожертвование', effects: { balance: -2000, mood: 10 }, outcomeText: 'Каждый вклад имеет значение. Вы помогли, и это приятно.', learningPoint: 'Даже небольшие пожертвования могут привести к большим изменениям, если их делают многие.' },
      { text: 'Отказаться', effects: {}, outcomeText: 'Вы решили, что сейчас не можете себе этого позволить.', learningPoint: 'Важно сначала обеспечить собственную финансовую стабильность, прежде чем помогать другим в крупных масштабах.' },
    ],
  },
  {
    id: 'unexpected_vet_bill',
    title: '🐾 Внезапный визит к ветеринару',
    description: 'Ваш домашний питомец заболел и требует срочного визита к ветеринару.',
    illustration: 'illustrations/vet.svg',
    difficulty: 2,
    isNegative: true,
    triggerCondition: (state) => state.mood > 60, // More likely if mood is high (implies having a pet)
    choices: [
      { text: 'Оплатить лучшее лечение', effects: { balance: -25000, mood: -5 }, outcomeText: 'Вы не пожалели денег на здоровье своего друга.', learningPoint: 'Домашние животные — это не только радость, но и большие непредвиденные расходы. Важно быть к ним готовым.' },
      { text: 'Выбрать экономный план лечения', effects: { balance: -12000, mood: -10 }, outcomeText: 'Вы выбрали более доступное лечение, но переживаете за питомца.', learningPoint: 'В стрессовых ситуациях приходится принимать сложные финансовые и эмоциональные решения.' },
    ],
  },

  // --- УРОВЕНЬ 3: "Высокие ставки" ---
  {
    id: 'car_breakdown',
    title: '🚗 Поломка автомобиля',
    description: 'Ваша машина сломалась, и ремонт обойдется в круглую сумму.',
    illustration: 'illustrations/car_repair.svg',
    difficulty: 3,
    isNegative: true,
    choices: [
      { text: 'Отремонтировать за свои деньги', effects: { balance: -49200 }, outcomeText: 'Машина снова в строю, но кошелек похудел.', learningPoint: 'Резервный фонд на непредвиденные расходы — необходимость.' },
      { text: 'Взять кредит на ремонт', effects: { debt: 49200, mood: -5 }, outcomeText: 'Машина отремонтирована, но теперь есть долг.', learningPoint: 'Кредиты на ремонт часто неизбежны, если машина нужна для работы.' },
      { text: 'Продать машину', effects: { balance: 164000, mood: -15 }, outcomeText: 'Вы избавились от дорогого актива и получили деньги, но потеряли в удобстве.', learningPoint: 'Иногда избавление от дорогого актива — верное финансовое решение.' },
    ],
  },
  {
    id: 'crypto_opportunity',
    title: '₿ Криптовалютная лихорадка',
    description: 'Друг предлагает вложиться в "гарантированно прибыльную" криптовалюту.',
    illustration: 'illustrations/crypto.svg',
    difficulty: 3,
    isNegative: false,
    triggerCondition: (state) => state.mood < 40 && (state.balance + state.savings - state.debt) < 50000,
    choices: [
      { text: 'Вложить небольшую сумму', effects: { balance: -16400, savings: 16400, mood: 5 }, outcomeText: 'Вы решили рискнуть небольшой суммой.', learningPoint: 'Главное правило инвестора: инвестируйте только то, что можете позволить себе потерять.' },
      { text: 'Вложить крупную сумму', effects: { balance: -82000, savings: 82000, mood: 10 }, outcomeText: 'Вы сделали крупную ставку на криптовалюту. Это может быть очень прибыльно или очень убыточно.', learningPoint: 'Высокий риск может принести высокую прибыль или большие потери. Никогда не вкладывайте все в один актив.' },
      { text: 'Отказаться от предложения', effects: { mood: 0 }, outcomeText: 'Вы проявили осторожность и не вложились в сомнительный актив.', learningPoint: 'Если не понимаете, во что инвестируете, — лучше не инвестировать вовсе.' },
    ],
  },
  {
    id: 'stock_market_crash',
    title: '📉 Падение рынка',
    description: 'Фондовый рынок резко упал, и ваши сбережения (если они есть) потеряли в цене.',
    illustration: 'illustrations/market_crash.svg',
    difficulty: 3,
    isNegative: true,
    triggerCondition: (state) => state.savings > 0.3 * (state.balance + state.savings - state.debt), // More likely if savings are a large part of net worth
    choices: [
      { text: 'Продать все и зафиксировать убытки', effects: { savings: -24600, mood: -20 }, outcomeText: 'Вы в панике продали активы с убытком, но сохранили часть денег.', learningPoint: 'Паника на рынке — плохой советчик. Эмоциональные решения часто приводят к убыткам.' },
      { text: 'Купить еще больше по низкой цене', effects: { balance: -41000, savings: 41000 }, outcomeText: 'Вы использовали падение рынка как возможность для покупок.', learningPoint: '"Покупайте, когда на улицах льется кровь" — правило успешных инвесторов.' },
      { text: 'Ничего не делать и ждать', effects: { mood: -10 }, outcomeText: 'Вы решили переждать нестабильность на рынке. Это требует выдержки.', learningPoint: 'Для долгосрочного инвестора "время в рынке" важнее, чем "попытки угадать время входа в рынок".' },
    ],
  },
  {
    id: 'investment_property',
    title: '🏘️ Возможность купить недвижимость',
    description: 'Вам предлагают купить небольшую квартиру для сдачи в аренду с первоначальным взносом.',
    illustration: 'illustrations/investment_property.svg',
    difficulty: 3,
    isNegative: false,
    triggerCondition: (state) => state.balance > 100000 && (state.debt / state.monthlySalary < 0.5),
    choices: [
      { text: 'Взять кредит и купить', effects: { balance: -410000, debt: 3690000, savings: 4100000, mood: 15 }, outcomeText: 'Вы стали владельцем недвижимости, но взяли огромный кредит.', learningPoint: 'Недвижимость может быть хорошей инвестицией, но требует больших вложений и сопряжена с рисками.' },
      { text: 'Отказаться от предложения', effects: { mood: -5 }, outcomeText: 'Вы решили не рисковать такими крупными суммами на данном этапе.', learningPoint: 'Инвестиции в недвижимость требуют тщательного анализа и готовности к большим обязательствам.' },
    ],
  },
  {
    id: 'job_offer_rival',
    title: '💼 Предложение от конкурентов',
    description: 'Конкурирующая компания предлагает вам работу с повышением зарплаты, но у них плохая репутация.',
    illustration: 'illustrations/job_offer.svg',
    difficulty: 3,
    isNegative: false,
    triggerCondition: (state) => state.turn > 52 && state.monthlySalary > 150000,
    choices: [
      { text: 'Принять предложение', effects: { mood: -10 }, outcomeText: 'Вы получили прибавку к зарплате, но рабочая атмосфера оставляет желать лучшего.', learningPoint: 'Иногда высокая зарплата не компенсирует токсичную рабочую среду и выгорание.' },
      { text: 'Использовать для переговоров', effects: { mood: 5 }, outcomeText: 'Вы использовали предложение, чтобы договориться о повышении на текущем месте. Успешно!', learningPoint: 'Наличие альтернативных предложений — сильный аргумент в переговорах о зарплате.' },
      { text: 'Отклонить предложение', effects: { mood: 5 }, outcomeText: 'Вы остались на текущем месте, ценя стабильность и хороший коллектив.', learningPoint: 'Не все измеряется деньгами. Стабильность и хорошие отношения на работе также важны.' },
    ],
  },
  {
    id: 'inheritance',
    title: '✉️ Наследство',
    description: 'Вы получили небольшое наследство от дальнего родственника.',
    illustration: 'illustrations/inheritance.svg',
    difficulty: 3,
    isNegative: false,
    triggerCondition: (state) => state.turn > 40 && !state.log.some(e => e.id === 'inheritance'),
    choices: [
      { text: 'Получить наличными', effects: { balance: 200000 }, outcomeText: 'Вы получили крупную сумму на свой счет.', learningPoint: 'Крупные суммы требуют особого внимания. Важно не потратить все сразу, а грамотно распорядиться деньгами.' },
      { text: 'Получить в виде акций', effects: { savings: 250000 }, outcomeText: 'Вы получили портфель акций. Его стоимость может как расти, так и падать.', learningPoint: 'Инвестиции в акции могут быть прибыльными, но сопряжены с риском. Диверсификация помогает снизить риски.' },
    ],
  },
  {
    id: 'global_recession',
    title: '📉 Глобальная рецессия',
    description: 'Начался мировой экономический спад. Как вы поступите?',
    illustration: 'illustrations/recession.svg',
    difficulty: 3,
    isNegative: true,
    triggerCondition: (state) => state.turn > 60 && Math.random() < 0.1,
    choices: [
      { text: 'Продать рисковые активы', effects: { savings: -50000, mood: -10 }, outcomeText: 'Вы продали часть активов с убытком, чтобы избежать еще больших потерь.', learningPoint: 'Иногда фиксация убытков — это способ сохранить капитал в условиях кризиса.' },
      { text: 'Сократить расходы', effects: { mood: -15 }, outcomeText: 'Вы решили переждать бурю, сократив все возможные расходы.', learningPoint: 'В кризис важно иметь финансовую подушку и уметь сокращать расходы.' },
      { text: 'Искать возможности', effects: { balance: -50000, savings: 60000 }, outcomeText: 'Вы решили рискнуть и купить подешевевшие активы.', learningPoint: 'Кризис — это не только время потерь, но и время возможностей для смелых инвесторов.' },
    ],
  },
  {
    id: 'stock_market_bubble',
    title: '📈 Рыночный пузырь?',
    description: 'Акции растут как на дрожжах! Все вокруг говорят о легких деньгах. Ваши вложения значительно выросли.',
    illustration: 'illustrations/bubble.svg',
    difficulty: 3,
    isNegative: false,
    triggerCondition: (state) => state.savings > 150000 && state.turn > 50,
    choices: [
      { text: 'Зафиксировать часть прибыли', effects: { savings: -50000, balance: 60000, mood: 5 }, outcomeText: 'Вы продали часть активов, зафиксировав прибыль. Лучше синица в руках.', learningPoint: 'Никто еще не разорялся, фиксируя прибыль. Управление рисками — ключ к успеху.' },
      { text: 'Держать и верить в рост', effects: { mood: 5 }, outcomeText: 'Вы решили не продавать, веря в дальнейший рост. Время покажет.', learningPoint: '"Быки делают деньги, медведи делают деньги, а свиньи идут на убой". Жадность может быть опасна.' },
      { text: 'Вложить еще (FOMO)', effects: { balance: -40000, savings: 40000, mood: 10 }, outcomeText: 'Вы поддались всеобщей эйфории и вложили еще. Рискованно!', learningPoint: 'Страх упустить выгоду (FOMO) — опасное чувство, которое часто заставляет инвесторов принимать неверные решения.' },
    ],
  },
  {
    id: 'small_business_idea',
    title: '💡 Идея для бизнеса',
    description: 'У вас появилась идея для небольшого онлайн-бизнеса. Это потребует вложений и времени.',
    illustration: 'illustrations/business_idea.svg',
    difficulty: 3,
    isNegative: false,
    triggerCondition: (state) => state.balance > 100000,
    choices: [
      { text: 'Инвестировать и начать', effects: { balance: -80000, mood: 10 }, outcomeText: 'Вы вложили деньги в свой проект. Это начало большого пути!', learningPoint: 'Предпринимательство — это высокий риск, но и потенциально высокая награда. Успех зависит от множества факторов.' },
      { text: 'Отказаться от идеи', effects: {}, outcomeText: 'Вы решили, что сейчас не время для такого риска.', learningPoint: 'Не все идеи нужно реализовывать. Иногда лучше сосредоточиться на более предсказуемых источниках дохода.' },
    ],
  },
  {
    id: 'political_unrest',
    title: '🌍 Политическая нестабильность',
    description: 'В стране, где находятся ваши активы, началась политическая нестабильность, что привело к падению рынка.',
    illustration: 'illustrations/political_unrest.svg',
    difficulty: 3,
    isNegative: true,
    triggerCondition: (state) => state.savings > 100000,
    choices: [
      { text: 'Продать затронутые активы', effects: { savings: -30000, balance: 25000, mood: -10 }, outcomeText: 'Вы продали активы с небольшим убытком, чтобы избежать дальнейших потерь.', learningPoint: 'Геополитические риски могут сильно влиять на инвестиции. Диверсификация по странам помогает их снизить.' },
      { text: 'Переждать', effects: { mood: -5 }, outcomeText: 'Вы решили переждать, надеясь на восстановление. Это требует терпения.', learningPoint: 'Рынки могут восстанавливаться после политических потрясений, но это не гарантировано.' },
      { text: 'Увеличить долю', effects: { balance: -20000, savings: 25000, mood: 5 }, outcomeText: 'Вы решили рискнуть и купить еще больше подешевевших активов.', learningPoint: 'Покупка на спаде может быть очень прибыльной, но и очень рискованной стратегией.' },
    ],
  },
  {
    id: 'book_deal',
    title: '📖 Предложение написать книгу',
    description: 'Издательство предложило вам написать книгу по вашей специальности. Это займет много времени, но сулит хороший гонорар.',
    illustration: 'illustrations/book.svg',
    difficulty: 3,
    isNegative: false,
    triggerCondition: (state) => state.turn > 70,
    choices: [
      { text: 'Принять предложение', effects: { balance: 50000, mood: -10 }, outcomeText: 'Вы получили аванс и начали работу над книгой. Это будет долгий проект.', learningPoint: 'Создание интеллектуальной собственности может стать источником пассивного дохода в будущем.' },
      { text: 'Отказаться', effects: {}, outcomeText: 'Вы решили, что у вас нет времени на такой большой проект.', learningPoint: 'Важно правильно оценивать свои силы и время. Иногда лучше отказаться от проекта, чем сделать его плохо.' },
    ],
  },
  {
    id: 'traffic_ticket',
    title: '🚦 Штраф за превышение',
    description: 'Вас остановили за превышение скорости. Теперь нужно заплатить штраф.',
    illustration: 'illustrations/traffic_ticket.svg',
    difficulty: 2,
    isNegative: true,
    choices: [
      { text: 'Оплатить штраф', effects: { balance: -10000, mood: -10 }, outcomeText: 'Вы оплатили штраф. Впредь будете внимательнее на дороге.', learningPoint: 'Незапланированные штрафы могут серьезно ударить по бюджету.' },
      { text: 'Оспорить в суде', effects: { mood: -5 }, outcomeText: 'Вы решили оспорить штраф. Это займет время и не гарантирует успеха.', learningPoint: 'Иногда стоит бороться за свои права, но нужно взвешивать потенциальные издержки.' },
    ],
  },
  {
    id: 'friends_financial_trouble',
    title: '😥 Финансовые трудности друга',
    description: 'Друг, которому вы одалживали деньги, говорит, что не может вернуть долг вовремя.',
    illustration: 'illustrations/friend_loan.svg',
    difficulty: 2,
    isNegative: true,
    triggerCondition: (state) => state.log.some(e => e.description.includes("Дать в долг")),
    choices: [
      { text: 'Простить долг', effects: { mood: 10 }, outcomeText: 'Вы простили долг другу. Дружба важнее денег.', learningPoint: 'Давая в долг, будьте готовы к тому, что деньги могут не вернуться. Не одалживайте сумму, которую не готовы потерять.' },
      { text: 'Настаивать на возврате', effects: { mood: -15 }, outcomeText: 'Вы потребовали вернуть деньги, что испортило ваши отношения.', learningPoint: 'Финансовые вопросы могут легко разрушить даже крепкую дружбу.' },
    ],
  },
  {
    id: 'major_housing_issue',
    title: '🏚️ Крупная авария в доме',
    description: 'В вашем доме прорвало трубу, и теперь требуется дорогостоящий ремонт.',
    illustration: 'illustrations/housing_issue.svg',
    difficulty: 3,
    isNegative: true,
    triggerCondition: (state) => state.propertyInvestments.length > 0,
    choices: [
      { text: 'Оплатить свою долю ремонта', effects: { balance: -100000 }, outcomeText: 'Вы оплатили ремонт. Это серьезный удар по вашим финансам.', learningPoint: 'Владение недвижимостью — это не только доход от аренды, но и большие расходы на содержание.' },
      { text: 'Взять кредит на ремонт', effects: { debt: 100000, mood: -10 }, outcomeText: 'Вы влезли в долги, чтобы покрыть расходы на ремонт.', learningPoint: 'Иногда кредиты — единственный способ справиться с крупными непредвиденными расходами.' },
    ],
  },
  {
    id: 'professional_setback',
    title: '📉 Профессиональная неудача',
    description: 'Ваш крупный проект на работе провалился. Ваша репутация под угрозой.',
    illustration: 'illustrations/setback.svg',
    difficulty: 3,
    isNegative: true,
    choices: [
      { text: 'Принять ответственность', effects: { mood: -20 }, outcomeText: 'Вы взяли на себя ответственность за провал. Это было тяжело, но вызвало уважение коллег.', learningPoint: 'Умение признавать свои ошибки — признак сильного лидера. В долгосрочной перспективе это укрепляет репутацию.' },
      { text: 'Обвинить коллегу', effects: { mood: 5 }, outcomeText: 'Вы переложили вину на другого. Вам удалось избежать последствий, но отношения в коллективе испортились.', learningPoint: 'Краткосрочная выгода от обмана может обернуться большими проблемами в будущем.' },
    ],
  },
];