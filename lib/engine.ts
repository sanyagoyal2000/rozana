import {
  journey,
  priorityMeta,
  products,
  reels,
  tiers,
  type PriorityKey,
  type ProductKey,
} from './data';

export type Answers = Record<number, string[]>;

export type Profile = {
  stageHeadline: string;
  stageBody: string;
  stageTags: string[];
  priorities: { key: PriorityKey; label: string; read: string; why: string[] }[];
  productKeys: ProductKey[];
  recipeReelIds: string[];
  movementReelId: string;
  tierKey: string;
  tierReason: string;
  testBranch: 'guide' | 'teaser';
  noted: string[];
};

const has = (answers: Answers, id: number, ...values: string[]) =>
  values.some((value) => (answers[id] ?? []).includes(value));

const first = (answers: Answers, id: number) => (answers[id] ?? [])[0] ?? '';

const countSignals = (answers: Answers, id: number) =>
  (answers[id] ?? []).filter((value) => value !== 'None of these').length;

/**
 * Reflects back what she told us. It does not infer menopause status,
 * deficiency or any condition — every sentence is traceable to an answer.
 */
function stageRead(answers: Answers): Pick<Profile, 'stageHeadline' | 'stageBody' | 'stageTags'> {
  const age = first(answers, 1);
  const cycle = first(answers, 2);
  const tags = [age, cycle].filter((value) => value && value !== 'Prefer not to say');

  let headline = 'Here is what you told us';
  let body =
    'You kept some of this private, which is entirely your call. The rest of this comes from what you did share.';

  if (cycle === 'Regular') {
    headline = 'Your cycles are regular right now';
    body =
      'Nothing here assumes anything is changing. What follows comes from how you have been feeling and how you eat.';
  } else if (cycle === 'Irregular for under a year' || cycle === 'Irregular for over a year') {
    headline = 'You told us your cycles have become irregular';
    body =
      'A lot of women say this is the stretch where sleep, energy and appetite stop being predictable. We have used what you told us to work out where to start — nothing more than that.';
  } else if (cycle === 'Stopped 1–5 years ago' || cycle === 'Stopped more than 5 years ago') {
    headline = 'You told us your cycles have stopped';
    body =
      'In these years the food conversation is a steady one: enough protein, calcium and vitamin D in an ordinary week, and enough movement to stay sure on your feet.';
  } else if (cycle === 'I have had a hysterectomy') {
    headline = 'You told us you have had a hysterectomy';
    body =
      'What follows comes from how you have been feeling and how you eat. Anything to do with your surgery, hormones or medication belongs with your own doctor.';
  }

  if (age === 'Under 40' && cycle === 'Regular') {
    body =
      'You are early to this conversation, which is a good place to be. What follows is about building a habit now, not fixing a problem.';
  }

  return { stageHeadline: headline, stageBody: body, stageTags: tags };
}

function score(answers: Answers) {
  const scores: Record<PriorityKey, number> = { muscle: 0, bone: 0, digestion: 0, skin: 0 };
  const why: Record<PriorityKey, { text: string; weight: number }[]> = {
    muscle: [], bone: [], digestion: [], skin: [],
  };

  const add = (key: PriorityKey, points: number, reason: string) => {
    scores[key] += points;
    if (reason && !why[key].some((item) => item.text === reason)) {
      why[key].push({ text: reason, weight: points });
    }
  };

  // Block A — where she is
  if (has(answers, 1, '51–55', '56–60', 'Over 60')) add('bone', 1, 'of your age');
  if (has(answers, 2, 'Stopped 1–5 years ago', 'Stopped more than 5 years ago')) {
    add('bone', 2, 'you told us your cycles have stopped');
    add('muscle', 1, 'you told us your cycles have stopped');
  }
  if (has(answers, 2, 'Irregular for over a year')) add('bone', 1, 'your cycles have been irregular for a while');

  // Block B — signals
  if (countSignals(answers, 4) >= 2) add('muscle', 2, 'of the dips in energy you mentioned');
  if (has(answers, 4, 'Tiring sooner than I used to')) add('muscle', 2, 'you said you tire sooner than you used to');
  if (countSignals(answers, 5) >= 1) add('bone', 2, 'you mentioned your knees and joints');
  if (has(answers, 5, 'Less confident on uneven ground')) add('bone', 1, 'you said you feel less sure on your feet');
  if (has(answers, 6, 'Hair thinning or fall', 'Drier skin or brittle nails')) {
    add('skin', 3, 'you noticed changes in your skin, hair or nails');
  }
  if (has(answers, 6, 'Weight settling around the midsection', 'Clothes fitting differently')) {
    add('muscle', 2, 'you mentioned changes around your middle');
  }
  if (has(answers, 6, 'Bloating after meals', 'Less regular digestion')) {
    add('digestion', 3, 'you mentioned bloating and digestion');
  }

  // Block C — food and week
  if (has(answers, 8, 'Honestly, not much')) add('muscle', 3, 'protein doesn’t show up much on a normal day');
  const proteinSources = (answers[8] ?? []).filter((value) => value !== 'Honestly, not much').length;
  if (proteinSources > 0 && proteinSources <= 1) add('muscle', 2, 'your protein comes from one or two places');
  if (!has(answers, 8, 'Curd, milk or paneer')) add('bone', 1, 'dairy doesn’t appear most days');
  if (has(answers, 7, 'Vegetarian') && proteinSources <= 2) {
    add('muscle', 1, 'you eat vegetarian and there isn’t much protein variety');
  }
  if (has(answers, 9, 'None right now')) add('bone', 1, 'you’re not moving much at the moment');
  if (has(answers, 9, 'Gym or yoga', 'Running or a sport')) add('muscle', 1, 'of the exercise you already do');

  // Block D — intent, weighted highest
  if (has(answers, 11, 'Stronger through the day')) add('muscle', 4, 'you said you want to feel stronger through the day');
  if (has(answers, 11, 'More confident on my knees and stairs')) add('bone', 4, 'you said you want to feel steadier on your knees and stairs');
  if (has(answers, 11, 'Lighter and less bloated')) add('digestion', 4, 'you said you want to feel lighter and less bloated');
  if (has(answers, 11, 'Better skin, hair and nails')) add('skin', 4, 'you said you want better skin, hair and nails');
  if (has(answers, 11, 'Simply more consistent')) {
    add('muscle', 1, 'you want to be consistent more than anything dramatic');
    add('digestion', 1, 'you want to be consistent more than anything dramatic');
  }

  return { scores, why };
}

function pickTier(answers: Answers, ranked: PriorityKey[]) {
  if (has(answers, 10, 'Cost')) {
    return {
      key: 'week',
      reason: 'You said cost gets in the way, so this is the smallest box that still saves your plan.',
    };
  }
  if (has(answers, 10, 'No time') && has(answers, 11, 'Simply more consistent')) {
    return {
      key: 'auto',
      reason: 'You want to be consistent and time is the problem. This one just turns up, at the same price as the monthly box.',
    };
  }
  if (ranked.length >= 2 && has(answers, 1, '51–55', '56–60', 'Over 60')) {
    return {
      key: 'monthly',
      reason: 'A full month is about the shortest time you would notice a difference. It comes with a call with a nutritionist.',
    };
  }
  return {
    key: 'routine21',
    reason: 'Twenty-one days is long enough to build the cue and short enough to commit to. All four flavours, free delivery.',
  };
}

export function buildProfile(answers: Answers): Profile {
  const { scores, why } = score(answers);
  const ranked = (Object.entries(scores) as [PriorityKey, number][])
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);

  const top = (ranked.length ? ranked : (['muscle', 'digestion'] as PriorityKey[])).slice(0, 2);
  const productKeys = top.map((key) => priorityMeta[key].product);

  const recipeReelIds = reels
    .filter((reel) => reel.series === 'Rozana Rasoi')
    .filter((reel) => {
      if (top[0] === 'bone') return /ragi|sattu|khichdi/.test(reel.id);
      if (top[0] === 'digestion') return /sattu|khichdi|chaat|cheela/.test(reel.id);
      if (top[0] === 'skin') return /cheela|chaat|khichdi|chilla/.test(reel.id);
      return /chilla|chaat|khichdi|cheela/.test(reel.id);
    })
    .slice(0, 3)
    .map((reel) => reel.id);

  const movementReelId =
    top.includes('bone') ? 'move-knees'
    : has(answers, 5, 'Lower back or neck ache') ? 'move-neck'
    : has(answers, 9, 'None right now') ? 'move-balance'
    : 'move-grip';

  const tier = pickTier(answers, top);

  const noted: string[] = [];
  if (countSignals(answers, 3) >= 2) {
    noted.push(
      'You mentioned sleep and night-time heat. Food won’t fix that, so we haven’t suggested anything for it — it is worth raising with your doctor.',
    );
  }
  if (countSignals(answers, 5) >= 3) {
    noted.push(
      'You mentioned a few things about your joints. If pain is ongoing or severe, please see a doctor — food is not the answer to that.',
    );
  }
  if (has(answers, 10, 'I dislike protein powders')) {
    noted.push('You said you don’t get on with protein powders. Nothing here is a powder — all four are savoury and ready to eat.');
  }
  if (has(answers, 10, 'My family eats differently')) {
    noted.push('Your family eats differently, so we have stuck to single sachets and one-pan recipes rather than cooking twice.');
  }

  return {
    ...stageRead(answers),
    priorities: top.map((key) => ({
      key,
      label: priorityMeta[key].label,
      read: priorityMeta[key].read,
      why: [...why[key]].sort((a, b) => b.weight - a.weight).map((item) => item.text).slice(0, 3),
    })),
    productKeys,
    recipeReelIds: recipeReelIds.length ? recipeReelIds : ['rasoi-khichdi', 'rasoi-chilla', 'rasoi-chaat'],
    movementReelId,
    tierKey: tier.key,
    tierReason: tier.reason,
    testBranch: first(answers, 12) === 'Yes' ? 'teaser' : 'guide',
    noted,
  };
}

/* ------------------------------------------------------------------ */
/* Box composition                                                     */
/* ------------------------------------------------------------------ */

/**
 * Every box holds the same sachet count at the same price. Only the mix moves.
 * Rule: never fewer than three of any flavour in a four-flavour box, so each
 * box keeps variety and quietly seeds trial of what she did not prioritise.
 */
const WEIGHTS: Record<number, number[]> = {
  1: [1],
  7: [4, 3],
  14: [6, 5, 3],
  21: [9, 5, 4, 3],
  28: [14, 7, 4, 3],
};

export function composeBox(sachets: number, productKeys: ProductKey[], flavourCount: number) {
  const weights = WEIGHTS[sachets] ?? WEIGHTS[28];
  const order: ProductKey[] = [
    ...productKeys,
    ...products.map((p) => p.key).filter((key) => !productKeys.includes(key)),
  ];
  const used = order.slice(0, Math.min(flavourCount, weights.length));
  return used.map((key, index) => ({ key, count: weights[index] }));
}

export function tierFor(key: string) {
  return tiers.find((tier) => tier.key === key) ?? tiers[3];
}

export function journeyStopFor(day: number) {
  return [...journey].reverse().find((stop) => day >= stop.day) ?? journey[0];
}
