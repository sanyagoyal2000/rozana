'use client';

/**
 * Prototype analytics. Events are held in memory and mirrored to a small
 * localStorage ring buffer so the on-site Data & privacy drawer can show a
 * judge exactly what is — and is not — captured.
 *
 * Deliberately never records an answer to a Check-In signal question. Stage,
 * signals, symptoms and blood-test answers stay on the device.
 */

export const EVENT_NAMES = [
  'page_view',
  'checkin_started',
  'checkin_answered',
  'checkin_completed',
  'plan_save_started',
  'plan_saved',
  'product_viewed',
  'package_selected',
  'purchase_completed',
  'plan_activated',
  'routine_action_completed',
  'weekly_checkin_completed',
  'reel_completed',
  'points_earned',
  'reward_redeemed',
  'replenishment_prompted',
  'reorder_completed',
  'subscription_started',
  'subscription_paused',
  'subscription_cancelled',
  'referral_converted',
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

export type AnalyticsEvent = {
  name: EventName;
  props: Record<string, string | number | boolean>;
  at: number;
};

const KEY = 'rozana.events.v2';
const LIMIT = 120;

/** Property keys that must never leave the device. */
const BLOCKED = /(symptom|signal|answer_value|cycle|menopause|blood|report|health|email|phone)/i;

type Listener = (events: AnalyticsEvent[]) => void;
const listeners = new Set<Listener>();
let buffer: AnalyticsEvent[] = [];
let hydrated = false;

function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) buffer = JSON.parse(raw) as AnalyticsEvent[];
  } catch {
    buffer = [];
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(buffer));
  } catch {
    /* storage unavailable — the prototype still works, it just forgets */
  }
}

export function track(name: EventName, props: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  hydrate();
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (BLOCKED.test(key)) continue;
    safe[key] = value;
  }
  buffer = [...buffer, { name, props: safe, at: Date.now() }].slice(-LIMIT);
  persist();
  for (const listener of listeners) listener(buffer);
}

export function readEvents(): AnalyticsEvent[] {
  hydrate();
  return buffer;
}

export function clearEvents() {
  buffer = [];
  persist();
  for (const listener of listeners) listener(buffer);
}

export function subscribeEvents(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
