import {
  Bone,
  Dumbbell,
  Leaf,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* The four products. Do not add or rename.                            */
/* ------------------------------------------------------------------ */

export type ProductKey = 'fit' | 'shakti' | 'light' | 'glow';
export type PriorityKey = 'muscle' | 'bone' | 'digestion' | 'skin';

export type Product = {
  key: ProductKey;
  name: string;
  flavour: string;
  benefit: string;
  priority: PriorityKey;
  colour: string;
  icon: LucideIcon;
  image: string;
  copy: string;
  ingredientsLine: string;
  serving: string;
  format: string;
  ingredients: string;
  allergens: string;
  cue: string;
};

export const products: Product[] = [
  {
    key: 'fit',
    name: 'Fit',
    flavour: 'Masala Chana',
    benefit: 'Protein for muscle support',
    priority: 'muscle',
    colour: '#cf654c',
    icon: Dumbbell,
    image: '/rozana-fit-pack.png',
    copy: 'A savoury protein-led portion for maintaining muscle through changing routines.',
    ingredientsLine: 'Chana · Besan · Pea protein',
    serving: '30 g sachet · one serving',
    format: 'Roasted savoury bite, ready to eat',
    ingredients: 'Roasted chana, besan, pea protein isolate, rice bran oil, iodised salt, spices and condiments (chilli, amchur, jeera, hing).',
    allergens: 'Contains legumes. Made in a facility that also handles peanuts, tree nuts, milk and wheat.',
    cue: 'Late afternoon, when the usual alternative would be a biscuit.',
  },
  {
    key: 'shakti',
    name: 'Shakti',
    flavour: 'Til Methi',
    benefit: 'Calcium + vitamin D for bones',
    priority: 'bone',
    colour: '#dc9e22',
    icon: Bone,
    image: '/rozana-shakti-pack.png',
    copy: 'Familiar til and methi meet carefully formulated bone-support nutrition.',
    ingredientsLine: 'Til · Methi · Calcium + D',
    serving: '30 g sachet · one serving',
    format: 'Roasted savoury bite, ready to eat',
    ingredients: 'Til (sesame), jowar, methi, chana dal, calcium carbonate, vitamin D2, rice bran oil, iodised salt, spices.',
    allergens: 'Contains sesame and legumes. Made in a facility that also handles peanuts, tree nuts, milk and wheat.',
    cue: 'With morning chai, so it lands at the same time every day.',
  },
  {
    key: 'light',
    name: 'Light',
    flavour: 'Pudina Ajwain',
    benefit: 'High fibre for digestive health',
    priority: 'digestion',
    colour: '#788d69',
    icon: Leaf,
    image: '/rozana-light-pack.png',
    copy: 'A crisp, fibre-led option designed around digestive comfort and Indian taste.',
    ingredientsLine: 'Jowar · Oats · Seeds',
    serving: '30 g sachet · one serving',
    format: 'Roasted savoury bite, ready to eat',
    ingredients: 'Jowar, oats, flax and sunflower seeds, chana dal, rice bran oil, pudina, ajwain, iodised salt, spices.',
    allergens: 'Contains oats (gluten) and legumes. Made in a facility that also handles peanuts, tree nuts and milk.',
    cue: 'Mid-evening, roughly two hours before dinner.',
  },
  {
    key: 'glow',
    name: 'Glow',
    flavour: 'Tomato Jeera',
    benefit: 'Vitamin C + zinc + biotin for skin',
    priority: 'skin',
    colour: '#aa5260',
    icon: Sparkles,
    image: '/rozana-glow-pack.png',
    copy: 'A savoury, vegetarian option designed around everyday skin-support nutrition.',
    ingredientsLine: 'Vitamin C · Zinc · Biotin',
    serving: '30 g sachet · one serving',
    format: 'Roasted savoury bite, ready to eat',
    ingredients: 'Chana, jowar, tomato powder, jeera, rice bran oil, ascorbic acid, zinc gluconate, biotin, iodised salt, spices.',
    allergens: 'Contains legumes. Made in a facility that also handles peanuts, tree nuts, milk and wheat. Vegetarian. Contains no collagen.',
    cue: 'With lunch, alongside something fresh.',
  },
];

export const productByKey = Object.fromEntries(products.map((p) => [p.key, p])) as Record<
  ProductKey,
  Product
>;

export const priorityMeta: Record<
  PriorityKey,
  { label: string; product: ProductKey; read: string; icon: LucideIcon }
> = {
  muscle: {
    label: 'Muscle and everyday strength',
    product: 'fit',
    read: 'Protein isn’t showing up evenly across an ordinary day.',
    icon: Dumbbell,
  },
  bone: {
    label: 'Bone nutrition and mobility',
    product: 'shakti',
    read: 'Calcium and vitamin D are worth making a regular part of the week.',
    icon: Bone,
  },
  digestion: {
    label: 'Digestive comfort and fibre',
    product: 'light',
    read: 'More variety in your fibre is the easiest thing to change first.',
    icon: Leaf,
  },
  skin: {
    label: 'Skin, hair and nail nutrition',
    product: 'glow',
    read: 'The nutrients behind normal skin, hair and nails are worth a look.',
    icon: Sparkles,
  },
};

/* ------------------------------------------------------------------ */
/* The Check-In — 12 questions, four blocks                            */
/* ------------------------------------------------------------------ */

export type Question = {
  id: number;
  block: 'A' | 'B' | 'C' | 'D';
  blockLabel: string;
  title: string;
  note: string;
  multi: boolean;
  max?: number;
  options: { value: string; hint?: string }[];
};

const opt = (...values: string[]) => values.map((value) => ({ value }));

export const questions: Question[] = [
  {
    id: 1,
    block: 'A',
    blockLabel: 'Where you are',
    title: 'Which age band are you in?',
    note: 'We use this to choose language and priorities, never to label you.',
    multi: false,
    options: opt('Under 40', '40–45', '46–50', '51–55', '56–60', 'Over 60'),
  },
  {
    id: 2,
    block: 'A',
    blockLabel: 'Where you are',
    title: 'How would you describe your cycle right now?',
    note: 'Answer only if you are comfortable. “Prefer not to say” changes nothing you can access.',
    multi: false,
    options: opt(
      'Regular',
      'Irregular for under a year',
      'Irregular for over a year',
      'Stopped 1–5 years ago',
      'Stopped more than 5 years ago',
      'I have had a hysterectomy',
      'Prefer not to say',
    ),
  },
  {
    id: 3,
    block: 'B',
    blockLabel: 'What you have noticed lately',
    title: 'Sleep and night-time heat',
    note: 'Choose anything you have noticed lately. Choose nothing if none apply.',
    multi: true,
    options: opt(
      'Taking longer to fall asleep',
      'Waking in the night',
      'Night-time heat or sweating',
      'Waking up unrested',
      'None of these',
    ),
  },
  {
    id: 4,
    block: 'B',
    blockLabel: 'What you have noticed lately',
    title: 'Energy and mood through the day',
    note: 'Think about an ordinary week, not your best week.',
    multi: true,
    options: opt(
      'An afternoon dip',
      'Tiring sooner than I used to',
      'Feeling more irritable or low',
      'Finding it harder to concentrate',
      'None of these',
    ),
  },
  {
    id: 5,
    block: 'B',
    blockLabel: 'What you have noticed lately',
    title: 'Joint, knee or back comfort',
    note: 'Persistent or severe pain belongs with a doctor, not a food quiz.',
    multi: true,
    options: opt(
      'Morning stiffness',
      'Knees on stairs',
      'Lower back or neck ache',
      'Less confident on uneven ground',
      'None of these',
    ),
  },
  {
    id: 6,
    block: 'B',
    blockLabel: 'What you have noticed lately',
    title: 'Anything else you have noticed?',
    note: 'Hair, skin and nails · weight and midsection · digestion.',
    multi: true,
    options: opt(
      'Hair thinning or fall',
      'Drier skin or brittle nails',
      'Weight settling around the midsection',
      'Clothes fitting differently',
      'Bloating after meals',
      'Less regular digestion',
      'None of these',
    ),
  },
  {
    id: 7,
    block: 'C',
    blockLabel: 'Your food and your week',
    title: 'How do you eat?',
    note: 'We only recommend within what you already eat.',
    multi: false,
    options: opt('Vegetarian', 'Eggetarian', 'Non-vegetarian'),
  },
  {
    id: 8,
    block: 'C',
    blockLabel: 'Your food and your week',
    title: 'On a normal day, where does your protein come from?',
    note: 'Select everything that genuinely appears most days.',
    multi: true,
    options: opt(
      'Dal or rajma or chana',
      'Curd, milk or paneer',
      'Eggs',
      'Chicken, fish or meat',
      'Soya, tofu or sprouts',
      'Nuts and seeds',
      'Honestly, not much',
    ),
  },
  {
    id: 9,
    block: 'C',
    blockLabel: 'Your food and your week',
    title: 'How much do you move in a normal week?',
    note: 'There is no wrong answer here.',
    multi: false,
    options: opt('None right now', 'Walking', 'Gym or yoga', 'Running or a sport'),
  },
  {
    id: 10,
    block: 'C',
    blockLabel: 'Your food and your week',
    title: 'What usually gets in the way?',
    note: 'This shapes the routine we suggest, and the size of the first box.',
    multi: true,
    options: opt(
      'No time',
      'My family eats differently',
      'I dislike protein powders',
      'Cost',
      'I do not know what to eat',
    ),
  },
  {
    id: 11,
    block: 'D',
    blockLabel: 'What you want next',
    title: 'In three months, what would you like to feel different?',
    note: 'Pick up to two.',
    multi: true,
    max: 2,
    options: opt(
      'Stronger through the day',
      'More confident on my knees and stairs',
      'Lighter and less bloated',
      'Better skin, hair and nails',
      'Simply more consistent',
    ),
  },
  {
    id: 12,
    block: 'D',
    blockLabel: 'What you want next',
    title: 'Have you had a blood test in the last year?',
    note: 'We do not ask for results here. This only decides what we show you next.',
    multi: false,
    options: opt('Yes', 'No', 'I am not sure what to test'),
  },
];

export const blockOrder: Question['block'][] = ['A', 'B', 'C', 'D'];

/* ------------------------------------------------------------------ */
/* Commitment ladder                                                   */
/* ------------------------------------------------------------------ */

export type Tier = {
  key: string;
  name: string;
  price: number;
  priceLabel: string;
  sachets: number;
  perServing: string;
  flavourCount: number;
  contents: string;
  included: string[];
  popular?: boolean;
  subscription?: boolean;
  note?: string;
};

export const tiers: Tier[] = [
  {
    key: 'try',
    name: 'Try it once',
    price: 40,
    priceLabel: '₹40',
    sachets: 1,
    perServing: '₹40.00 per serving',
    flavourCount: 1,
    contents: '1 sachet',
    included: ['One sachet, one flavour', 'Also free with any bigger box'],
    note: 'A single sachet, if you just want to taste it first.',
  },
  {
    key: 'week',
    name: 'First week',
    price: 249,
    priceLabel: '₹249',
    sachets: 7,
    perServing: '₹35.57 per serving',
    flavourCount: 2,
    contents: '7 sachets',
    included: ['Enough to see how it fits your week', 'Your plan is saved'],
  },
  {
    key: 'fortnight',
    name: 'Two weeks',
    price: 479,
    priceLabel: '₹479',
    sachets: 14,
    perServing: '₹34.21 per serving',
    flavourCount: 3,
    contents: '14 sachets',
    included: ['Two weeks of your own mix', 'Weekly check-in unlocked'],
  },
  {
    key: 'routine21',
    name: 'The 21-day routine',
    price: 699,
    priceLabel: '₹699',
    sachets: 21,
    perServing: '₹33.29 per serving',
    flavourCount: 4,
    contents: '21 sachets',
    included: ['Long enough for it to become a habit', 'Day-by-day tracker', 'Free delivery'],
  },
  {
    key: 'monthly',
    name: 'Monthly routine',
    price: 899,
    priceLabel: '₹899',
    sachets: 28,
    perServing: '₹32.11 per serving',
    flavourCount: 4,
    contents: '28 sachets',
    included: ['A full month, your mix', 'One call with a nutritionist'],
    popular: true,
  },
  {
    key: 'auto',
    name: 'Auto-replenish',
    price: 899,
    priceLabel: '₹899/month',
    sachets: 28,
    perServing: 'Arrives every 28 days',
    flavourCount: 4,
    contents: '28 sachets, every 28 days',
    included: [
      'Pause, skip or swap anytime',
      'Change your mix whenever you like',
      'Same price as the monthly box',
    ],
    subscription: true,
    note: 'For when you’d rather not think about reordering.',
  },
];

/* ------------------------------------------------------------------ */
/* Rewards                                                             */
/* ------------------------------------------------------------------ */

export const POINT_VALUE = 0.05; // 1 point = ₹0.05

/** Referral award. Change this one number if the reward is increased later. */
export const REFERRAL_POINTS = 100;

export type EarnRule = {
  key: string;
  label: string;
  points: number;
  cap: string;
  period: 'day' | 'week' | 'once';
  limit: number;
};

export const recurringEarn: EarnRule[] = [
  { key: 'visit', label: 'Drop in', points: 5, cap: 'once a day', period: 'day', limit: 1 },
  { key: 'challenge', label: 'Get the daily question right', points: 10, cap: 'one go a day', period: 'day', limit: 1 },
  { key: 'reel', label: 'Watch a clip', points: 5, cap: '3 a week', period: 'week', limit: 3 },
  { key: 'weekly', label: 'Answer the weekly check-in', points: 25, cap: 'once a week', period: 'week', limit: 1 },
  { key: 'logged5', label: 'Tick off 5 days in a week', points: 25, cap: 'once a week', period: 'week', limit: 1 },
];

/** Enforced quietly in code. Never printed as a rule; only ever surfaced as a friendly message. */
export const MONTHLY_LIMIT = 540;
export const FREE_LIMIT = 500;
export const REDEEM_BLOCK = 1000;
export const REDEEM_MAX_PER_ORDER = 2000;

export const milestoneEarn: EarnRule[] = [
  { key: 'checkin', label: 'Finish the Check-In', points: 250, cap: 'once', period: 'once', limit: 1 },
  { key: 'consent', label: 'Save your plan', points: 125, cap: 'once', period: 'once', limit: 1 },
  { key: 'day21', label: 'Finish your first 21 days', points: 500, cap: 'once', period: 'once', limit: 1 },
  { key: 'streak28', label: 'Drop in 28 days in a row', points: 125, cap: 'once', period: 'once', limit: 1 },
  { key: 'referral', label: 'A friend you told orders her first box', points: REFERRAL_POINTS, cap: 'once', period: 'once', limit: 1 },
];

export type Reward = { cost: number; label: string; detail: string };

export const rewards: Reward[] = [
  { cost: 1000, label: '₹50 off', detail: 'Comes off your next box.' },
  { cost: 1500, label: 'Free 5-sachet flavour add-on', detail: 'Any flavour you like, added to your next delivery.' },
  { cost: 2500, label: '15 minutes with a nutritionist', detail: 'At a time that suits you.' },
  { cost: 3500, label: 'First to try something new', detail: 'You get it before anyone else, and we ask what you think.' },
];

/** The four or five things worth telling her. Everything else is enforced quietly. */
export const pointsExplainer = {
  worth: 'Every point is worth 5 paise. A thousand of them takes ₹50 off your next box.',
  earn: [
    { label: 'Look in', points: '5 points', detail: 'Once a day, just for stopping by.' },
    { label: 'Get the daily question right', points: '10 points', detail: 'One question a day, one go at it.' },
    { label: 'Watch a clip', points: '5 points', detail: 'Up to three a week.' },
    { label: 'Answer the weekly check-in', points: '25 points', detail: 'One line about how the week went.' },
    { label: 'Tick off five days in a week', points: '25 points', detail: 'This is the one that adds up fastest.' },
  ],
  shipping: 'Points arrive when your box ships, not when you order.',
  expiry: 'They last six months from the last time you were here.',
};

/* ------------------------------------------------------------------ */
/* Daily challenge — three rotating formats                            */
/* ------------------------------------------------------------------ */

export type ChallengeFormat = 'Remember when' | 'Swap it' | 'Kitchen quiz';

export type Challenge = {
  id: string;
  format: ChallengeFormat;
  question: string;
  options: string[];
  correct: string;
  fact: string;
};

export const CHALLENGE_POINTS = 10;

/** The formats rotate in this order, one per day. */
export const challengeFormats: ChallengeFormat[] = ['Remember when', 'Swap it', 'Kitchen quiz'];

export const challenges: Challenge[] = [
  /* ---------------- Remember when ---------------- */
  {
    id: 'rw-surabhi',
    format: 'Remember when',
    question: 'Which Doordarshan show, hosted by Renuka Shahane and Siddharth Kak, celebrated India’s crafts and traditions?',
    options: ['Surabhi', 'Chitrahaar', 'Turning Point', 'Rangoli'],
    correct: 'Surabhi',
    fact: 'Surabhi ran from 1990 and drew so much post that it once held a record for viewer letters.',
  },
  {
    id: 'rw-amul',
    format: 'Remember when',
    question: 'Which brand asked us to buy something “utterly butterly delicious”?',
    options: ['Amul', 'Nirma', 'Vicco', 'Dalda'],
    correct: 'Amul',
    fact: 'The Amul girl first appeared in 1966 and is still going — one of the longest-running ad campaigns anywhere.',
  },
  {
    id: 'rw-humlog',
    format: 'Remember when',
    question: 'Which 1984 serial is remembered as India’s first television soap opera?',
    options: ['Hum Log', 'Buniyaad', 'Nukkad', 'Wagle Ki Duniya'],
    correct: 'Hum Log',
    fact: 'Hum Log ran for 154 episodes, and Ashok Kumar closed each one with a few words of advice.',
  },
  {
    id: 'rw-nirma',
    format: 'Remember when',
    question: 'Complete the jingle: “Washing powder ___, washing powder ___.”',
    options: ['Nirma', 'Surf', 'Rin', 'Wheel'],
    correct: 'Nirma',
    fact: 'The Nirma jingle ran for years and made a small Gujarat business a household name.',
  },
  {
    id: 'rw-malgudi',
    format: 'Remember when',
    question: 'Malgudi Days was based on the stories of which writer?',
    options: ['R. K. Narayan', 'Ruskin Bond', 'Munshi Premchand', 'Khushwant Singh'],
    correct: 'R. K. Narayan',
    fact: 'The town of Malgudi was invented — but the series was filmed in Agumbe, in Karnataka.',
  },
  {
    id: 'rw-milesur',
    format: 'Remember when',
    question: 'Which song, first shown in 1988, brought together singers and actors from across India?',
    options: ['Mile Sur Mera Tumhara', 'Vande Mataram', 'Ae Mere Watan Ke Logon', 'Saare Jahan Se Achha'],
    correct: 'Mile Sur Mera Tumhara',
    fact: 'It travelled through fourteen languages in six minutes, and most of us can still hum the opening.',
  },
  {
    id: 'rw-bajaj',
    format: 'Remember when',
    question: 'Which scooter’s advertisement ended with the words “Hamara Bajaj”?',
    options: ['Bajaj Chetak', 'Lambretta', 'Vespa', 'Kinetic Honda'],
    correct: 'Bajaj Chetak',
    fact: 'Waiting lists for a Chetak once ran into years — a booking was practically an inheritance.',
  },
  {
    id: 'rw-vicco',
    format: 'Remember when',
    question: 'Which advertisement insisted it was “nahin cosmetic”?',
    options: ['Vicco Turmeric', 'Pond’s', 'Fair & Lovely', 'Boroline'],
    correct: 'Vicco Turmeric',
    fact: 'Vicco Turmeric ran the same jingle for decades, and it is still recognised instantly.',
  },
  {
    id: 'rw-karamchand',
    format: 'Remember when',
    question: 'Which television detective, played by Pankaj Kapur, was never without a carrot?',
    options: ['Karamchand', 'Byomkesh Bakshi', 'Inspector Vijay', 'Sherlock'],
    correct: 'Karamchand',
    fact: 'Karamchand first aired in 1985, and the carrot was his own idea — an actor’s bit of business that stuck.',
  },
  {
    id: 'rw-antakshari',
    format: 'Remember when',
    question: 'Who hosted Antakshari on Zee TV from 1993?',
    options: ['Annu Kapoor', 'Siddharth Kak', 'Tabassum', 'Amin Sayani'],
    correct: 'Annu Kapoor',
    fact: 'Annu Kapoor hosted it for a decade, and family antakshari on long train journeys was never the same again.',
  },
  {
    id: 'rw-maggi',
    format: 'Remember when',
    question: 'Which product arrived in Indian kitchens in 1983 promising “two-minute” cooking?',
    options: ['Maggi noodles', 'Kissan jam', 'Rasna', 'Complan'],
    correct: 'Maggi noodles',
    fact: 'Two minutes was always optimistic — but it changed what an after-school snack looked like.',
  },
  {
    id: 'rw-shaktimaan',
    format: 'Remember when',
    question: 'Which 1997 Doordarshan hero spun on the spot to gather his powers?',
    options: ['Shaktimaan', 'Junoon', 'Captain Vyom', 'Chandrakanta'],
    correct: 'Shaktimaan',
    fact: 'Sunday mornings belonged to Shaktimaan, and an entire generation of children practised that spin.',
  },
  {
    id: 'rw-lifebuoy',
    format: 'Remember when',
    question: 'Complete the line: “Lifebuoy hai jahan, ___ hai wahan.”',
    options: ['tandurusti', 'khushi', 'safai', 'sehat'],
    correct: 'tandurusti',
    fact: 'That jingle ran from the 1960s onwards and outlived several changes of packaging.',
  },
  {
    id: 'rw-chitrahaar',
    format: 'Remember when',
    question: 'Which Doordarshan programme was half an hour of film songs, twice a week?',
    options: ['Chitrahaar', 'Surabhi', 'Ye Jo Hai Zindagi', 'Turning Point'],
    correct: 'Chitrahaar',
    fact: 'Homework got done fast on Chitrahaar evenings. Rangoli did the same job on Sunday mornings.',
  },

  /* ---------------- Swap it ---------------- */
  {
    id: 'sw-chana-poha',
    format: 'Swap it',
    question: 'More protein in 100 g — roasted chana or poha?',
    options: ['Roasted chana', 'Poha'],
    correct: 'Roasted chana',
    fact: 'Roasted chana carries around 20 g of protein per 100 g. Poha is mostly starch.',
  },
  {
    id: 'sw-ragi-maida',
    format: 'Swap it',
    question: 'More calcium — ragi or maida?',
    options: ['Ragi', 'Maida'],
    correct: 'Ragi',
    fact: 'Ragi is one of the highest-calcium grains eaten in India. Maida has almost none.',
  },
  {
    id: 'sw-til-poha',
    format: 'Swap it',
    question: 'More calcium — til or poha?',
    options: ['Til', 'Poha'],
    correct: 'Til',
    fact: 'A spoon of til goes a long way. It is one of the reasons Shakti is built around it.',
  },
  {
    id: 'sw-rajma-rice',
    format: 'Swap it',
    question: 'More protein — a bowl of rajma or a bowl of rice?',
    options: ['Rajma', 'Rice'],
    correct: 'Rajma',
    fact: 'Rajma brings both protein and fibre. Together on one plate they make a better pair than either alone.',
  },
  {
    id: 'sw-ragi-kheer',
    format: 'Swap it',
    question: 'More calcium — ragi porridge or rice kheer?',
    options: ['Ragi porridge', 'Rice kheer'],
    correct: 'Ragi porridge',
    fact: 'Making ragi a regular part of the week is easier to remember than a tablet.',
  },
  {
    id: 'sw-paneer-malai',
    format: 'Swap it',
    question: 'More protein — paneer or malai?',
    options: ['Paneer', 'Malai'],
    correct: 'Paneer',
    fact: 'Paneer is mostly milk protein; malai is mostly fat. Both have their place, but only one builds a meal.',
  },
  {
    id: 'sw-bajra-naan',
    format: 'Swap it',
    question: 'More fibre — a bajra roti or a maida naan?',
    options: ['Bajra roti', 'Maida naan'],
    correct: 'Bajra roti',
    fact: 'Whole grains keep their bran, and the bran is where most of the fibre lives.',
  },
  {
    id: 'sw-moong-sabudana',
    format: 'Swap it',
    question: 'More protein — moong dal or sabudana?',
    options: ['Moong dal', 'Sabudana'],
    correct: 'Moong dal',
    fact: 'Sabudana is almost pure starch. On a fasting day, pairing it with curd or peanuts helps.',
  },
  {
    id: 'sw-curd-coconut',
    format: 'Swap it',
    question: 'More calcium — a bowl of curd or a glass of coconut water?',
    options: ['A bowl of curd', 'A glass of coconut water'],
    correct: 'A bowl of curd',
    fact: 'Coconut water is lovely for other reasons, but calcium is not one of them.',
  },
  {
    id: 'sw-atta-suji',
    format: 'Swap it',
    question: 'More fibre — whole wheat atta or suji?',
    options: ['Whole wheat atta', 'Suji'],
    correct: 'Whole wheat atta',
    fact: 'Suji is made from the inner part of the grain, so most of the fibre has already gone.',
  },
  {
    id: 'sw-soya-paneer',
    format: 'Swap it',
    question: 'More protein per 100 g, dry — soya chunks or paneer?',
    options: ['Soya chunks', 'Paneer'],
    correct: 'Soya chunks',
    fact: 'Dry soya chunks are unusually high in protein. They swell up a lot once soaked, so a little goes far.',
  },
  {
    id: 'sw-rajgira-rice',
    format: 'Swap it',
    question: 'More calcium — rajgira or white rice?',
    options: ['Rajgira', 'White rice'],
    correct: 'Rajgira',
    fact: 'Rajgira, or amaranth, turns up in fasting food and carries far more calcium than rice does.',
  },
  {
    id: 'sw-dalia-cornflakes',
    format: 'Swap it',
    question: 'More fibre — a bowl of dalia or a bowl of cornflakes?',
    options: ['Dalia', 'Cornflakes'],
    correct: 'Dalia',
    fact: 'Dalia is cracked whole wheat, so the bran stays. Most cornflakes have been stripped and sweetened.',
  },

  /* ---------------- Kitchen quiz ---------------- */
  {
    id: 'kq-til',
    format: 'Kitchen quiz',
    question: 'Small, flat, pale seeds. Toasted, they turn a dry ladoo fragrant — and they are one of India’s richest plant sources of calcium.',
    options: ['Til', 'Jeera', 'Ajwain', 'Methi'],
    correct: 'Til',
    fact: 'Til, or sesame. Til ladoo in winter is not a coincidence — it is old, sensible kitchen wisdom.',
  },
  {
    id: 'kq-methi',
    format: 'Kitchen quiz',
    question: 'Bitter, tiny, golden. Soaked overnight it turns slippery, and it is a classic winter addition to theplas.',
    options: ['Methi', 'Saunf', 'Rai', 'Kalonji'],
    correct: 'Methi',
    fact: 'Methi, or fenugreek. Both the seeds and the leaves carry fibre.',
  },
  {
    id: 'kq-hing',
    format: 'Kitchen quiz',
    question: 'A resin with a strong smell, added to hot oil at the start, often used in cooking dals for people who avoid onion and garlic.',
    options: ['Hing', 'Amchur', 'Kokum', 'Anardana'],
    correct: 'Hing',
    fact: 'Hing, or asafoetida. A pinch in the tadka is traditionally said to make dal easier on the stomach.',
  },
  {
    id: 'kq-panchphoron',
    format: 'Kitchen quiz',
    question: 'Which Bengali spice mix contains five whole seeds, used without grinding?',
    options: ['Panch phoron', 'Garam masala', 'Sambar podi', 'Chaat masala'],
    correct: 'Panch phoron',
    fact: 'Panch phoron: methi, kalonji, saunf, rai and jeera, thrown into hot oil whole.',
  },
  {
    id: 'kq-kadhi',
    format: 'Kitchen quiz',
    question: 'Which two ingredients form the base of kadhi?',
    options: ['Besan and curd', 'Maida and milk', 'Rice flour and buttermilk', 'Toor dal and tamarind'],
    correct: 'Besan and curd',
    fact: 'Besan and curd, slow-cooked. Every region does it differently — Gujarati kadhi is sweeter, Punjabi thicker.',
  },
  {
    id: 'kq-dhokla',
    format: 'Kitchen quiz',
    question: 'Dhokla gets its sponginess from which process?',
    options: ['Fermenting the batter', 'Deep frying', 'Adding baking soda only', 'Slow roasting'],
    correct: 'Fermenting the batter',
    fact: 'Fermenting. It is also what makes idli and dosa batter what they are.',
  },
  {
    id: 'kq-bisibele',
    format: 'Kitchen quiz',
    question: 'Bisi bele bath comes from which state?',
    options: ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh'],
    correct: 'Karnataka',
    fact: 'Karnataka. The name means hot lentil rice, and rice, toor dal and vegetables all go in together.',
  },
  {
    id: 'kq-litti',
    format: 'Kitchen quiz',
    question: 'Litti chokha, the roasted wheat balls stuffed with sattu, belongs to which region?',
    options: ['Bihar', 'Rajasthan', 'Punjab', 'Odisha'],
    correct: 'Bihar',
    fact: 'Bihar. The sattu filling is roasted gram flour — protein-rich, and made to travel.',
  },
  {
    id: 'kq-undhiyu',
    format: 'Kitchen quiz',
    question: 'Undhiyu, the mixed winter vegetable dish, is made in which state?',
    options: ['Gujarat', 'Maharashtra', 'Madhya Pradesh', 'Haryana'],
    correct: 'Gujarat',
    fact: 'Gujarat. It is a winter dish because it uses whatever the season has just given you.',
  },
  {
    id: 'kq-tadka',
    format: 'Kitchen quiz',
    question: 'What is the everyday word for spices bloomed in hot oil or ghee and poured over a dish?',
    options: ['Tadka', 'Bhuna', 'Dum', 'Talna'],
    correct: 'Tadka',
    fact: 'Tadka, or chhaunk. The heat pulls the flavour out of the whole spices in seconds.',
  },
  {
    id: 'kq-kokum',
    format: 'Kitchen quiz',
    question: 'Which dark, dried fruit rind is used along the Konkan coast to make food sour?',
    options: ['Kokum', 'Imli', 'Amchur', 'Nimbu'],
    correct: 'Kokum',
    fact: 'Kokum. Sol kadhi, the pink drink served after a coastal meal, is made from it.',
  },
  {
    id: 'kq-sattu',
    format: 'Kitchen quiz',
    question: 'Sattu is made by roasting and grinding which of these?',
    options: ['Chana', 'Rice', 'Wheat bran', 'Bajra'],
    correct: 'Chana',
    fact: 'Roasted chana, ground fine. A glass of sattu with jeera and lemon is a summer standard.',
  },
  {
    id: 'kq-jaggery',
    format: 'Kitchen quiz',
    question: 'Gur is made from which of these?',
    options: ['Sugarcane juice', 'Coconut water', 'Rice starch', 'Beetroot'],
    correct: 'Sugarcane juice',
    fact: 'Sugarcane juice, boiled down. Date palm gur is made the same way, further east.',
  },
  {
    id: 'kq-ajwain',
    format: 'Kitchen quiz',
    question: 'Which seed, sharp and slightly bitter, is pressed into parathas and traditionally chewed after a heavy meal?',
    options: ['Ajwain', 'Til', 'Khus khus', 'Chironji'],
    correct: 'Ajwain',
    fact: 'Ajwain, or carom. It is the flavour behind Light, alongside pudina.',
  },
];

/**
 * One question a day. The format rotates, and a question she has already seen
 * never comes back — so the bank thins out rather than repeating.
 */
export function challengeForDay(dayNumber: number, answeredIds: string[]): Challenge {
  const format = challengeFormats[dayNumber % challengeFormats.length];
  const unseen = challenges.filter(
    (item) => item.format === format && !answeredIds.includes(item.id),
  );
  const pool = unseen.length
    ? unseen
    : challenges.filter((item) => !answeredIds.includes(item.id));
  const finalPool = pool.length ? pool : challenges;
  return finalPool[dayNumber % finalPool.length];
}

export function formatForDay(dayNumber: number): ChallengeFormat {
  return challengeFormats[dayNumber % challengeFormats.length];
}

/* ------------------------------------------------------------------ */
/* Content — video-first                                               */
/* ------------------------------------------------------------------ */

export type Reel = {
  id: string;
  series: 'Rozana Rasoi' | 'Rozana Move' | 'Rozana Explains';
  title: string;
  duration: string;
  stat?: string;
  seo: string;
  poster: string;
  tone: string;
};

export const reels: Reel[] = [
  {
    id: 'rasoi-khichdi',
    series: 'Rozana Rasoi',
    title: 'Millet khichdi, one pan, eight minutes',
    duration: '0:48',
    stat: '14 g protein per bowl',
    seo: 'A one-pan millet and moong dal khichdi made in under ten minutes, with the protein per serving shown on screen. Suitable for vegetarians.',
    poster: '/rozana-sachets.png',
    tone: '#cf654c',
  },
  {
    id: 'rasoi-chilla',
    series: 'Rozana Rasoi',
    title: 'Besan chilla you can make before the chai boils',
    duration: '0:42',
    stat: '11 g protein per chilla',
    seo: 'Besan chilla recipe with onion, coriander and ajwain, cooked in one pan in under ten minutes. Protein per serving stated on screen.',
    poster: '/rozana-fit-pack.png',
    tone: '#cf654c',
  },
  {
    id: 'rasoi-sattu',
    series: 'Rozana Rasoi',
    title: 'The sattu drink your nani already knew about',
    duration: '0:39',
    stat: '9 g protein per glass',
    seo: 'A savoury sattu drink with jeera, black salt and lemon. Traditional Bihari preparation, made in under five minutes.',
    poster: '/rozana-light-pack.png',
    tone: '#788d69',
  },
  {
    id: 'rasoi-ragi',
    series: 'Rozana Rasoi',
    title: 'Ragi dosa, no fermenting, no waiting',
    duration: '0:51',
    stat: '190 mg calcium per two dosas',
    seo: 'Instant ragi dosa recipe requiring no fermentation, with the calcium contribution per serving shown on screen.',
    poster: '/rozana-shakti-pack.png',
    tone: '#dc9e22',
  },
  {
    id: 'rasoi-chaat',
    series: 'Rozana Rasoi',
    title: 'Chana chaat that is actually a meal',
    duration: '0:44',
    stat: '15 g protein per plate',
    seo: 'Kala chana chaat with tomato, onion, jeera and lemon, assembled in one bowl. Protein per plate shown on screen.',
    poster: '/rozana-fit-pack.png',
    tone: '#cf654c',
  },
  {
    id: 'rasoi-cheela',
    series: 'Rozana Rasoi',
    title: 'Moong dal cheela for a slow morning',
    duration: '0:47',
    stat: '12 g protein per cheela',
    seo: 'Moong dal cheela made from soaked and ground dal, cooked in one pan. Protein per serving stated on screen.',
    poster: '/rozana-glow-pack.png',
    tone: '#aa5260',
  },
  {
    id: 'move-knees',
    series: 'Rozana Move',
    title: 'Sixty seconds for stiff knees, done at home',
    duration: '1:00',
    seo: 'A one-minute seated and standing routine for knee stiffness, demonstrated in a living room by a woman in her fifties. Stop if it hurts and speak to a professional.',
    poster: '/rozana-knee-midlife.png',
    tone: '#dc9e22',
  },
  {
    id: 'move-neck',
    series: 'Rozana Move',
    title: 'Desk neck: the reset between two meetings',
    duration: '0:58',
    seo: 'A one-minute neck and shoulder mobility sequence for long desk hours, filmed at a dining table rather than a gym.',
    poster: '/rozana-neck-young.png',
    tone: '#788d69',
  },
  {
    id: 'move-grip',
    series: 'Rozana Move',
    title: 'Grip strength, using a steel dabba',
    duration: '0:55',
    seo: 'Simple grip and forearm exercises using household objects. Grip strength is a practical everyday marker of capability.',
    poster: '/rozana-active-runner.png',
    tone: '#cf654c',
  },
  {
    id: 'move-balance',
    series: 'Rozana Move',
    title: 'Balance you can practise while the dal cooks',
    duration: '0:52',
    seo: 'A one-minute standing balance routine performed next to a kitchen counter for support.',
    poster: '/rozana-pain-women.png',
    tone: '#aa5260',
  },
  {
    id: 'explains-ghee',
    series: 'Rozana Explains',
    title: 'Does ghee cause weight gain after 40?',
    duration: '0:57',
    seo: 'A plain-language explanation of dietary fat, portion size and total energy intake, without fear-based language.',
    poster: '/rozana-hero-woman.png',
    tone: '#082b59',
  },
  {
    id: 'explains-whey',
    series: 'Rozana Explains',
    title: 'Do you actually need whey protein?',
    duration: '0:53',
    seo: 'Comparing protein from everyday Indian foods with powdered supplements, and when each makes practical sense.',
    poster: '/rozana-fit-pack.png',
    tone: '#082b59',
  },
  {
    id: 'explains-calcium',
    series: 'Rozana Explains',
    title: 'Is your calcium tablet doing anything without vitamin D?',
    duration: '0:59',
    seo: 'How vitamin D status relates to calcium, and why testing and medical advice matter more than a single ingredient.',
    poster: '/rozana-shakti-pack.png',
    tone: '#082b59',
  },
];

export const seriesBlurbs: Record<Reel['series'], string> = {
  'Rozana Rasoi': 'One recipe, one pan, under ten minutes. Every reel ends with the protein or calcium number on screen.',
  'Rozana Move': 'Sixty seconds of movement, filmed with women in their forties and fifties, in a living room rather than a gym.',
  'Rozana Explains': 'Straight answers to the questions everyone asks. No scare stories.',
};

/* ------------------------------------------------------------------ */
/* Long-form guides                                                    */
/* ------------------------------------------------------------------ */

export type GuideKey = 'midlife' | 'bone' | 'muscle' | 'skin' | 'markers';

export const guides: Record<
  GuideKey,
  { label: string; time: string; title: string; intro: string; sections: [string, string][] }
> = {
  midlife: {
    label: 'Midlife basics',
    time: '6 min',
    title: 'What actually changes in nutrition after 40?',
    intro:
      'Midlife does not require a completely new diet. It does make a few familiar priorities easier to overlook: adequate protein, calcium and vitamin D, fibre, and a varied diet that supplies micronutrients.',
    sections: [
      ['Start with patterns, not panic', 'Menopause is a life stage, not a deficiency diagnosis. Sleep, appetite, activity, work patterns and food preferences can all shift. Begin by noticing what is consistently absent from ordinary meals rather than buying a long list of products.'],
      ['Four practical priorities', 'Include a meaningful protein source across meals; make calcium-containing foods visible in the week; choose grains, pulses, vegetables, fruits and seeds that increase fibre variety; and discuss vitamin D testing or supplementation with a qualified professional when relevant.'],
      ['An Indian plate can already do much of the work', 'Dal, chana, rajma, soy, curd, paneer, ragi, til, vegetables, fruit and whole grains can contribute to a strong food pattern. Convenience products should help close practical gaps, not replace meals.'],
      ['When to ask for medical guidance', 'Persistent pain, unexplained weight change, severe digestive symptoms, suspected deficiency or concerns about osteoporosis require professional assessment. A food quiz cannot diagnose any of these.'],
    ],
  },
  bone: {
    label: 'Bone health',
    time: '5 min',
    title: 'Calcium is only one part of the conversation',
    intro:
      'Bone health is not solved by adding one ingredient. Calcium matters, but so do vitamin D status, protein intake, physical activity, age, medication history and individual medical risk.',
    sections: [
      ['Build a food pattern', 'Look across the week for calcium-containing foods such as dairy where suitable, ragi, sesame and fortified foods. Read labels because the amount delivered per portion matters more than the presence of an ingredient on the front of pack.'],
      ['Vitamin D needs separate attention', 'Food alone may not answer every vitamin D need. Sun exposure, testing and supplementation decisions are individual; discuss them with a qualified clinician instead of relying on a snack to correct a suspected deficiency.'],
      ['Movement belongs in the plan', 'Muscle-strengthening, balance and appropriate weight-bearing movement can support function. The right plan depends on fitness, pain, fracture risk and existing conditions.'],
      ['What Shakti is, and what it isn’t', 'Shakti is an easy way to get calcium and vitamin D into an ordinary day. It is food, not medicine — it does not treat osteoporosis, knee pain or a fracture, and anything like that belongs with your doctor.'],
    ],
  },
  muscle: {
    label: 'Muscle and protein',
    time: '5 min',
    title: 'Protein is not only for gym-goers',
    intro:
      'Protein supports normal body functions and maintenance of muscle. The useful question is not whether someone goes to the gym; it is whether her normal meals repeatedly include enough protein-rich foods for her needs.',
    sections: [
      ['Spread attention across the day', 'Many Indian breakfasts and snacks are grain-heavy. Adding dal, chana, beans, soy, dairy, eggs or other preferred protein foods can make the overall pattern more balanced.'],
      ['Food quality still matters', 'A protein number does not automatically make a product healthy. Taste, total composition, portion size, sodium, added sugar and how the product fits the rest of the diet all matter.'],
      ['Pair nutrition with suitable activity', 'Regular resistance or strength-focused movement is relevant to maintaining muscle and capability. Anyone with pain, injury or a diagnosed condition should seek an appropriate professional plan.'],
      ['Where Fit fits', 'Fit is for the moment when the alternative would have been a biscuit. It won’t build muscle on its own and it doesn’t replace meals.'],
    ],
  },
  skin: {
    label: 'Skin nutrition',
    time: '5 min',
    title: 'Collagen versus collagen-support nutrition',
    intro:
      'These phrases are not interchangeable. A product containing collagen peptides supplies animal-derived collagen. A vegetarian collagen-support product supplies nutrients involved in the body’s normal processes but does not contain collagen.',
    sections: [
      ['Understand the label', 'Vitamin C has a role in normal collagen formation. Zinc and biotin have distinct roles related to normal skin. Their presence should not be combined into an exaggerated promise that a snack will reverse ageing.'],
      ['Vegetarian does not mean vegan collagen', 'Commercial collagen peptides are generally derived from animal sources such as fish or cattle. Products described as vegan collagen builders usually contain supporting nutrients rather than collagen itself.'],
      ['Expectations should remain realistic', 'Skin appearance is influenced by many factors including genetics, sun exposure, sleep, smoking, hydration, diet and health conditions. Nutrition products cannot guarantee visible transformation.'],
      ['Glow contains no collagen', 'Glow is vegetarian and has no collagen in it. If we ever make one that does, we’ll say where it comes from on the front of the pack.'],
    ],
  },
  markers: {
    label: 'Testing',
    time: '4 min',
    title: 'Four markers worth discussing with your doctor after 40',
    intro:
      'ROZANA cannot test, interpret or diagnose anything. This is simply the short list many Indian clinicians raise with women after 40, so that you can ask an informed question at your next appointment.',
    sections: [
      ['Vitamin D (25-hydroxy vitamin D)', 'Relevant to how the body handles calcium. Levels vary widely in India despite the sunshine, because of indoor work, clothing, skin tone and pollution. Testing and any supplementation are decisions for your doctor.'],
      ['Vitamin B12', 'Frequently discussed for people eating largely vegetarian diets, since B12 occurs mainly in animal foods and fortified products. Symptoms are non-specific, which is exactly why a test is more useful than guesswork.'],
      ['Thyroid (TSH)', 'Thyroid function changes are common in Indian women and can be mistaken for ordinary midlife tiredness or weight change. It is a simple blood test.'],
      ['HbA1c', 'A three-month average of blood glucose. Family history of diabetes is common in India, and this is the standard way to have that conversation early rather than late.'],
      ['What we won’t do', 'We won’t tell you that you’re deficient, we won’t suggest a dose, and we won’t read a report for you. If a number looks off, that conversation belongs with your doctor.'],
    ],
  },
};

/* ------------------------------------------------------------------ */
/* 21-day journey                                                      */
/* ------------------------------------------------------------------ */

export type JourneyStop = {
  day: number;
  title: string;
  cue: string;
  content: string;
  contentId: string;
  checkIn: string;
};

export const journey: JourneyStop[] = [
  {
    day: 1,
    title: 'Pick your time, not your willpower',
    cue: 'Attach your first sachet to something you already do — the morning chai, the 4pm break.',
    content: 'Rozana Explains: do you actually need whey protein?',
    contentId: 'explains-whey',
    checkIn: 'Which cue did you choose?',
  },
  {
    day: 7,
    title: 'One week in',
    cue: 'Add one cooked thing from Rozana Rasoi to the week — not seven.',
    content: 'Rozana Rasoi: besan chilla before the chai boils',
    contentId: 'rasoi-chilla',
    checkIn: 'How many days did the cue actually work?',
  },
  {
    day: 14,
    title: 'The week most people stop',
    cue: 'If you have missed days, do not restart. Continue from today.',
    content: 'Rozana Move: sixty seconds for stiff knees',
    contentId: 'move-knees',
    checkIn: 'What got in the way, honestly?',
  },
  {
    day: 21,
    title: 'You have a routine now',
    cue: 'Look back at the log before you look at the next box.',
    content: 'Rozana Explains: is your calcium tablet doing anything without vitamin D?',
    contentId: 'explains-calcium',
    checkIn: 'What do you want to change in the next mix?',
  },
];

/* ------------------------------------------------------------------ */
/* Consultation                                                        */
/* ------------------------------------------------------------------ */

export const consultTiers = [
  {
    key: 'free',
    name: 'Free',
    price: 'Included with your Check-In',
    body: 'Your Check-In result, plus a box where you can ask us anything about food.',
    points: [
      'Answers come from our own guides and recipes',
      'Anything medical goes straight to a doctor',
      'No diagnosis, no doses, ever',
    ],
  },
  {
    key: 'sub',
    name: 'Included with subscription',
    price: 'One call per quarter',
    body: 'A 15-minute video call with a qualified nutritionist, included with auto-replenish.',
    points: [
      '15 minutes, booked at a time you choose',
      'We only share your answers if you say yes',
      'Renews every quarter while you subscribe',
    ],
  },
  {
    key: 'paid',
    name: 'Paid consultation',
    price: '₹499 for 30 minutes',
    body: 'A longer session, credited in full against your next order.',
    points: [
      '30 minutes with a qualified nutritionist',
      '₹499 credited against your next box',
      'Available whether or not you subscribe',
    ],
  },
];

export const askLibraryAnswers: { match: RegExp; answer: string; source: string }[] = [
  {
    match: /protein|muscle|strength|whey|powder/i,
    answer:
      'Protein supports the maintenance of muscle. The practical question is whether an ordinary day already includes dal, chana, curd, paneer, eggs, soya or nuts — not whether you go to a gym. Rozana Fit is designed for the moment when the usual alternative would offer very little protein.',
    source: 'Guide: Protein is not only for gym-goers',
  },
  {
    match: /calcium|bone|osteo|knee|vitamin d/i,
    answer:
      'Calcium is one part of bone nutrition; vitamin D status, protein, activity and individual medical risk all matter too. Rozana Shakti is a convenient calcium and vitamin D food option — it is not a treatment for any bone condition.',
    source: 'Guide: Calcium is only one part of the conversation',
  },
  {
    match: /skin|hair|nail|collagen|glow/i,
    answer:
      'Vitamin C has a role in normal collagen formation, and zinc and biotin have roles related to normal skin. Rozana Glow contains no collagen and is suitable for vegetarians. Skin appearance depends on far more than one product.',
    source: 'Guide: Collagen versus collagen-support nutrition',
  },
  {
    match: /fibre|fiber|bloat|digest|constipat/i,
    answer:
      'Fibre variety — grains, pulses, vegetables, fruit and seeds across the week — usually does more than any single high-fibre product. Rozana Light is a fibre-led savoury option built around that idea.',
    source: 'Guide: What actually changes in nutrition after 40?',
  },
  {
    match: /test|blood|b12|thyroid|hba1c|report/i,
    answer:
      'Vitamin D, B12, thyroid and HbA1c are the four markers most often raised with women after 40. ROZANA cannot test or interpret anything — please take that conversation to your doctor.',
    source: 'Guide: Four markers worth discussing with your doctor after 40',
  },
];

export const medicalTriggers =
  /pain|severe|bleed|lump|fracture|cancer|tumour|tumor|dizzy|faint|chest|breath|depress|suicid|medicine|medication|dose|dosage|diagnos|prescri|hrt|hormone therapy/i;
