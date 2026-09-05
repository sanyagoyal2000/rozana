'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { track } from './analytics';
import {
  FREE_LIMIT,
  MONTHLY_LIMIT,
  milestoneEarn,
  recurringEarn,
  type EarnRule,
} from './data';
import { buildProfile, tierFor, type Answers, type Profile } from './engine';

const KEY = 'rozana.plan.v2';
const CYCLE_DAYS = 28;
const EXPIRY_DAYS = 180;
const SUBSCRIBER_MULTIPLIER = 1.25;

/** Friendly lines for the limits we enforce quietly. Never shown as a rules list. */
const LIMIT_MESSAGES: Record<string, string> = {
  day: 'That’s today’s done. There’s a new one tomorrow.',
  week: 'You’ve done all of these for this week. They come back on Monday.',
  monthly: 'You’ve collected everything on offer this month. It opens up again soon.',
  free: 'You’ve collected all the points you can before your first box.',
};

export type Consent = {
  email: string | null;
  whatsapp: string | null;
  frequency: string;
  givenAt: number | null;
};

export type Purchase = {
  tierKey: string;
  sachets: number;
  price: number;
  mix: { key: string; count: number }[];
  addOn: string | null;
  pointsApplied: number;
  at: number;
  shippedAt: number | null;
};

export type LedgerEntry = {
  label: string;
  points: number;
  at: number;
  kind: 'earn' | 'redeem' | 'expire';
};

export type PlanState = {
  version: 2;
  createdAt: number | null;
  answers: Answers;
  profile: Profile | null;
  consent: Consent;
  purchase: Purchase | null;
  subscription: 'none' | 'active' | 'paused' | 'cancelled';
  routineStartedAt: number | null;
  log: string[];
  points: number;
  pending: number;
  ledger: LedgerEntry[];
  earnMarks: Record<string, string[]>;
  cycleStart: number | null;
  cycleEarned: number;
  lastActivity: number | null;
  redeemed: { cost: number; label: string; at: number }[];
  reelsWatched: string[];
  weeklyCheckins: { at: number; note: string }[];
  visitDays: string[];
  streak: number;
  streakSaved: boolean;
  gameMode: 'full' | 'plain';
  referrals: number;
  referralCode: string;
  answeredChallenges: string[];
  lastChallenge: { day: string; id: string; correct: boolean } | null;
  notice: { text: string; at: number } | null;
  phase2Vote: string | null;
  phase3Interest: boolean;
};

const initial: PlanState = {
  version: 2,
  createdAt: null,
  answers: {},
  profile: null,
  consent: { email: null, whatsapp: null, frequency: 'One message a week, no more', givenAt: null },
  purchase: null,
  subscription: 'none',
  routineStartedAt: null,
  log: [],
  points: 0,
  pending: 0,
  ledger: [],
  earnMarks: {},
  cycleStart: null,
  cycleEarned: 0,
  lastActivity: null,
  redeemed: [],
  reelsWatched: [],
  weeklyCheckins: [],
  visitDays: [],
  streak: 0,
  streakSaved: false,
  gameMode: 'full',
  referrals: 0,
  referralCode: '',
  answeredChallenges: [],
  lastChallenge: null,
  notice: null,
  phase2Vote: null,
  phase3Interest: false,
};

export const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);

export function weekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - start.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

const dayDiff = (from: number, to = Date.now()) => Math.floor((to - from) / 86400000);

export function routineDay(state: PlanState) {
  if (!state.routineStartedAt) return 0;
  return Math.min(21, dayDiff(state.routineStartedAt) + 1);
}

export function servingsRemaining(state: PlanState) {
  if (!state.purchase) return 0;
  return Math.max(0, state.purchase.sachets - state.log.length);
}

export function replenishmentDate(state: PlanState) {
  if (!state.purchase) return null;
  const remaining = servingsRemaining(state);
  const days =
    state.log.length >= 3
      ? Math.round(remaining / (state.log.length / Math.max(1, dayDiff(state.purchase.at) + 1)))
      : remaining;
  return new Date(Date.now() + Math.max(0, days) * 86400000);
}

const allRules: EarnRule[] = [...recurringEarn, ...milestoneEarn];
const ruleFor = (key: string) => allRules.find((rule) => rule.key === key);

function load(): PlanState {
  if (typeof window === 'undefined') return initial;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<PlanState>;
    return { ...initial, ...parsed, consent: { ...initial.consent, ...parsed.consent } };
  } catch {
    return initial;
  }
}

function save(state: PlanState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — it just forgets */
  }
}

export function useRozana() {
  const [state, setState] = useState<PlanState>(initial);
  const [ready, setReady] = useState(false);
  const visited = useRef(false);
  // The ref is the source of truth so every mutation is computed exactly once,
  // even when React double-invokes a render in development.
  const stateRef = useRef<PlanState>(initial);

  useEffect(() => {
    let loaded = load();

    // Six months from the last time she was here.
    if (loaded.lastActivity && dayDiff(loaded.lastActivity) > EXPIRY_DAYS && loaded.points > 0) {
      loaded = {
        ...loaded,
        ledger: [
          { label: 'Points expired', points: -loaded.points, at: Date.now(), kind: 'expire' },
          ...loaded.ledger,
        ],
        points: 0,
      };
    }
    if (loaded.cycleStart && dayDiff(loaded.cycleStart) >= CYCLE_DAYS) {
      loaded = { ...loaded, cycleStart: Date.now(), cycleEarned: 0 };
    }
    if (!loaded.referralCode) {
      loaded = { ...loaded, referralCode: Math.random().toString(36).slice(2, 8).toUpperCase() };
    }

    stateRef.current = loaded;
    setState(loaded);
    setReady(true);
  }, []);

  const update = useCallback((fn: (previous: PlanState) => PlanState) => {
    const next = fn(stateRef.current);
    if (next === stateRef.current) return;
    stateRef.current = next;
    save(next);
    setState(next);
  }, []);

  /** Shows one short, friendly line. Never a rule, never a scolding. */
  const say = useCallback(
    (text: string) => {
      update((previous) => ({ ...previous, notice: { text, at: Date.now() } }));
    },
    [update],
  );

  /**
   * The one place points are awarded. Every limit lives here and is never
   * printed anywhere — if she reaches one, she gets a friendly line instead.
   */
  const earn = useCallback(
    (key: string, options: { pending?: boolean; quiet?: boolean } = {}) => {
      const previous = stateRef.current;
      const rule = ruleFor(key);
      if (!rule) return;

      const mark = rule.period === 'day' ? dayKey() : rule.period === 'week' ? weekKey() : 'once';
      const marks = previous.earnMarks[key] ?? [];
      if (marks.filter((value) => value === mark).length >= rule.limit) {
        if (rule.period !== 'once' && !options.quiet) say(LIMIT_MESSAGES[rule.period]);
        return;
      }

      const subscriber = previous.subscription === 'active';
      let points = Math.round(rule.points * (subscriber ? SUBSCRIBER_MULTIPLIER : 1));

      const cycleStart = previous.cycleStart ?? Date.now();
      let cycleEarned = previous.cycleEarned;
      if (rule.period !== 'once') {
        const room = Math.max(0, MONTHLY_LIMIT - cycleEarned);
        if (room === 0 && !options.quiet) say(LIMIT_MESSAGES.monthly);
        points = Math.min(points, room);
        cycleEarned += points;
      }
      if (!previous.purchase) {
        const room = Math.max(0, FREE_LIMIT - previous.points - previous.pending);
        if (room === 0 && !options.quiet) say(LIMIT_MESSAGES.free);
        points = Math.min(points, room);
      }
      if (points <= 0) return;

      // Spread the CURRENT state, not the snapshot read above — anything written
      // in between (a friendly line, another award) must not be clobbered.
      update((current) => ({
        ...current,
        points: options.pending ? current.points : current.points + points,
        pending: options.pending ? current.pending + points : current.pending,
        cycleStart,
        cycleEarned,
        lastActivity: Date.now(),
        earnMarks: { ...current.earnMarks, [key]: [...(current.earnMarks[key] ?? []), mark] },
        ledger: [
          {
            label: rule.label + (options.pending ? ' (arrives when your box ships)' : ''),
            points,
            at: Date.now(),
            kind: 'earn' as const,
          },
          ...current.ledger,
        ].slice(0, 40),
      }));
      track('points_earned', { action: key, points, subscriber });
    },
    [update, say],
  );

  // Register the daily visit and keep the streak.
  useEffect(() => {
    if (!ready || visited.current) return;
    visited.current = true;
    track('page_view', { returning: state.createdAt !== null });
    update((previous) => {
      const today = dayKey();
      if (previous.visitDays.includes(today)) return previous;

      // One missed day is forgiven. Two in a row starts again — gently.
      const yesterday = dayKey(new Date(Date.now() - 86400000));
      const dayBefore = dayKey(new Date(Date.now() - 2 * 86400000));
      const onTime = previous.visitDays.includes(yesterday);
      const saved = !onTime && previous.visitDays.includes(dayBefore) && previous.streak > 0;

      return {
        ...previous,
        visitDays: [...previous.visitDays, today].slice(-60),
        streak: onTime || saved ? previous.streak + 1 : 1,
        streakSaved: saved,
        notice: saved
          ? { text: 'You missed a day — your streak is safe. Welcome back.', at: Date.now() }
          : previous.notice,
      };
    });
    earn('visit', { quiet: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (ready && state.streak >= 28) earn('streak28', { quiet: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, state.streak]);

  const actions = useMemo(
    () => ({
      completeCheckIn(answers: Answers) {
        const profile = buildProfile(answers);
        update((previous) => ({
          ...previous,
          answers,
          profile,
          createdAt: previous.createdAt ?? Date.now(),
          cycleStart: previous.cycleStart ?? Date.now(),
          lastActivity: Date.now(),
        }));
        track('checkin_completed', {
          priority_1: profile.priorities[0]?.key ?? '',
          priority_2: profile.priorities[1]?.key ?? '',
          recommended_tier: profile.tierKey,
        });
        earn('checkin');
        return profile;
      },

      savePlan(consent: { email: string | null; whatsapp: string | null; frequency: string }) {
        update((previous) => ({
          ...previous,
          consent: { ...consent, givenAt: Date.now() },
          createdAt: previous.createdAt ?? Date.now(),
          lastActivity: Date.now(),
        }));
        track('plan_saved', {
          channel_email: Boolean(consent.email),
          channel_whatsapp: Boolean(consent.whatsapp),
        });
        if (consent.email || consent.whatsapp) earn('consent');
      },

      withdrawConsent() {
        update((previous) => ({
          ...previous,
          consent: {
            email: null,
            whatsapp: null,
            frequency: previous.consent.frequency,
            givenAt: null,
          },
        }));
      },

      buy(
        tierKey: string,
        addOn: string | null,
        pointsApplied: number,
        mix: { key: string; count: number }[],
        subscribe = false,
      ) {
        update((previous) => {
          const tier = tierFor(tierKey);
          const purchase: Purchase = {
            tierKey,
            sachets: tier.sachets,
            price: tier.price,
            mix,
            addOn,
            pointsApplied,
            at: Date.now(),
            shippedAt: null,
          };
          return {
            ...previous,
            purchase,
            points: previous.points - pointsApplied,
            subscription: subscribe || tier.subscription ? 'active' : previous.subscription,
            routineStartedAt: previous.routineStartedAt ?? Date.now(),
            createdAt: previous.createdAt ?? Date.now(),
            lastActivity: Date.now(),
            ledger: pointsApplied
              ? [
                  { label: 'Used on your box', points: -pointsApplied, at: Date.now(), kind: 'redeem' as const },
                  ...previous.ledger,
                ]
              : previous.ledger,
          };
        });
        const tier = tierFor(tierKey);
        track('purchase_completed', {
          tier: tierKey,
          value: tier.price,
          points_applied: pointsApplied,
          flavours_chosen: mix.filter((item) => item.count > 0).length,
        });
        track('plan_activated', { tier: tierKey });
        if (subscribe || tier.subscription) track('subscription_started', { tier: tierKey });
      },

      markShipped() {
        update((previous) => {
          if (!previous.purchase || previous.purchase.shippedAt) return previous;
          return {
            ...previous,
            purchase: { ...previous.purchase, shippedAt: Date.now() },
            points: previous.points + previous.pending,
            pending: 0,
            ledger: previous.pending
              ? [
                  { label: 'Points arrived with your box', points: previous.pending, at: Date.now(), kind: 'earn' as const },
                  ...previous.ledger,
                ]
              : previous.ledger,
          };
        });
      },

      logToday() {
        update((previous) => {
          const today = dayKey();
          if (previous.log.includes(today)) return previous;
          return { ...previous, log: [...previous.log, today], lastActivity: Date.now() };
        });
        track('routine_action_completed', { action: 'sachet_taken' });
      },

      weeklyCheckIn(note: string) {
        update((previous) => ({
          ...previous,
          weeklyCheckins: [{ at: Date.now(), note }, ...previous.weeklyCheckins].slice(0, 12),
          lastActivity: Date.now(),
        }));
        track('weekly_checkin_completed', {});
        earn('weekly');
      },

      watchReel(id: string) {
        update((previous) =>
          previous.reelsWatched.includes(id)
            ? previous
            : { ...previous, reelsWatched: [...previous.reelsWatched, id], lastActivity: Date.now() },
        );
        track('reel_completed', { reel: id });
        earn('reel');
      },

      attemptChallenge(id: string, correct: boolean) {
        // Award first, so the points path also stamps the day.
        if (correct) earn('challenge');
        update((previous) => {
          const today = dayKey();
          const marks = previous.earnMarks['challenge'] ?? [];
          return {
            ...previous,
            lastActivity: Date.now(),
            answeredChallenges: previous.answeredChallenges.includes(id)
              ? previous.answeredChallenges
              : [...previous.answeredChallenges, id],
            lastChallenge: { day: today, id, correct },
            // One go a day, whether she got it right or not.
            earnMarks: marks.includes(today)
              ? previous.earnMarks
              : { ...previous.earnMarks, challenge: [...marks, today] },
          };
        });
      },

      redeem(cost: number, label: string) {
        update((previous) => {
          if (previous.points < cost) return previous;
          return {
            ...previous,
            points: previous.points - cost,
            redeemed: [{ cost, label, at: Date.now() }, ...previous.redeemed],
            ledger: [
              { label: `Used for ${label}`, points: -cost, at: Date.now(), kind: 'redeem' as const },
              ...previous.ledger,
            ],
            lastActivity: Date.now(),
          };
        });
        track('reward_redeemed', { reward: label, cost });
      },

      reorder() {
        update((previous) =>
          previous.purchase
            ? {
                ...previous,
                purchase: { ...previous.purchase, at: Date.now(), shippedAt: null },
                log: [],
                lastActivity: Date.now(),
              }
            : previous,
        );
        track('reorder_completed', {});
      },

      setSubscription(next: PlanState['subscription']) {
        update((previous) => ({ ...previous, subscription: next, lastActivity: Date.now() }));
        if (next === 'active') track('subscription_started', { source: 'dashboard' });
        if (next === 'paused') track('subscription_paused', {});
        if (next === 'cancelled') track('subscription_cancelled', {});
      },

      referralConverted() {
        update((previous) => ({ ...previous, referrals: previous.referrals + 1 }));
        track('referral_converted', {});
        earn('referral', { pending: true });
      },

      finishRoutine() {
        earn('day21', { quiet: true });
      },

      loggedFiveThisWeek() {
        earn('logged5', { quiet: true });
      },

      setGameMode(mode: PlanState['gameMode']) {
        update((previous) => ({ ...previous, gameMode: mode }));
      },

      setPhase2Vote(vote: string) {
        update((previous) => ({ ...previous, phase2Vote: vote }));
      },

      setPhase3Interest(value: boolean) {
        update((previous) => ({ ...previous, phase3Interest: value }));
      },

      dismissNotice() {
        update((previous) => (previous.notice ? { ...previous, notice: null } : previous));
      },

      reset() {
        try {
          window.localStorage.removeItem(KEY);
        } catch {
          /* nothing to clear */
        }
        stateRef.current = initial;
        setState(initial);
      },
    }),
    [update, earn],
  );

  return { state, ready, earn, say, ...actions };
}

export type Rozana = ReturnType<typeof useRozana>;
