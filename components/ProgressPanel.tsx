'use client';

import { CalendarClock, Check, Flame, HelpCircle, Package, Trophy } from 'lucide-react';
import { POINT_VALUE, rewards } from '@/lib/data';
import { dayKey, replenishmentDate, routineDay, servingsRemaining, weekKey, type Rozana } from '@/lib/store';

/** The lowest reward she has not yet reached, so the bar always has somewhere to go. */
export function nextReward(points: number) {
  return rewards.find((reward) => reward.cost > points) ?? null;
}

export function ProgressPanel({
  rozana,
  onExplain,
  compact = false,
}: {
  rozana: Rozana;
  onExplain: () => void;
  compact?: boolean;
}) {
  const { state } = rozana;
  const day = routineDay(state);
  const remaining = servingsRemaining(state);
  const refill = replenishmentDate(state);
  const next = nextReward(state.points);
  const previousLevel = [...rewards].reverse().find((reward) => reward.cost <= state.points);
  const floor = previousLevel?.cost ?? 0;
  const progress = next ? Math.min(100, ((state.points - floor) / (next.cost - floor)) * 100) : 100;

  const thisWeek = weekKey();
  const challengeDone = (state.earnMarks['challenge'] ?? []).includes(dayKey());
  const reelsThisWeek = (state.earnMarks['reel'] ?? []).filter((mark) => mark === thisWeek).length;
  const weeklyDone = state.weeklyCheckins.some((item) => weekKey(new Date(item.at)) === thisWeek);
  const daysLogged = state.log.filter((value) => weekKey(new Date(value)) === thisWeek).length;

  const dots = Array.from({ length: 7 }, (_, index) => index < Math.min(7, state.streak));

  return (
    <div className={compact ? 'progress-panel compact' : 'progress-panel'}>
      <section className="pp-block pp-streak">
        <span className="pp-label">Your streak</span>
        <div className="pp-streak-figure">
          <Flame />
          <strong>{state.streak}</strong>
          <span>{state.streak === 1 ? 'day' : 'days'} in a row</span>
        </div>
        <div className="pp-dots" aria-hidden="true">
          {dots.map((on, index) => (
            <i key={index} className={on ? 'on' : ''} />
          ))}
        </div>
        {state.streakSaved && <p className="pp-soft">You missed a day and kept it. Nice one.</p>}
      </section>

      <section className="pp-block pp-points">
        <span className="pp-label">
          Points
          <button type="button" className="pp-help" onClick={onExplain}>
            <HelpCircle /> How points work
          </button>
        </span>
        <div className="pp-points-figure">
          <Trophy />
          <strong>{state.points}</strong>
          <span>≈ ₹{Math.round(state.points * POINT_VALUE)}</span>
        </div>
        {state.pending > 0 && <p className="pp-soft">{state.pending} more arrive when your box ships.</p>}
        <div className="pp-bar">
          <span style={{ width: `${Math.round(progress)}%` }} />
        </div>
        <p className="pp-next">
          {next
            ? `${next.cost - state.points} more to unlock ${next.label.toLowerCase()}`
            : 'You can unlock anything on the list.'}
        </p>
      </section>

      {state.purchase && (
        <section className="pp-block pp-routine">
          <span className="pp-label">Your 21 days</span>
          <div className="pp-routine-figure">
            <strong>Day {Math.max(1, day)}</strong>
            <span>of 21</span>
          </div>
          <div className="pp-track" aria-hidden="true">
            {Array.from({ length: 21 }, (_, index) => (
              <i key={index} className={index < day ? 'on' : ''} />
            ))}
          </div>
        </section>
      )}

      <section className="pp-block pp-week">
        <span className="pp-label">This week</span>
        <ul className="pp-check">
          <li className={challengeDone ? 'done' : ''}>
            <span className="pp-tick">{challengeDone && <Check />}</span>
            Today&rsquo;s question
          </li>
          <li className={reelsThisWeek >= 3 ? 'done' : ''}>
            <span className="pp-tick">{reelsThisWeek >= 3 && <Check />}</span>
            Clips watched <b>{reelsThisWeek} of 3</b>
          </li>
          <li className={weeklyDone ? 'done' : ''}>
            <span className="pp-tick">{weeklyDone && <Check />}</span>
            Weekly check-in
          </li>
          <li className={daysLogged >= 5 ? 'done' : ''}>
            <span className="pp-tick">{daysLogged >= 5 && <Check />}</span>
            Days ticked off <b>{daysLogged} of 7</b>
          </li>
        </ul>
      </section>

      {state.purchase && (
        <section className="pp-block pp-box">
          <span className="pp-label">Your box</span>
          <div className="pp-box-figure">
            <Package />
            <strong>{remaining}</strong>
            <span>{remaining === 1 ? 'sachet' : 'sachets'} left</span>
          </div>
          {refill && (
            <p className="pp-next">
              <CalendarClock /> Time to reorder around{' '}
              <b>{refill.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</b>
            </p>
          )}
        </section>
      )}
    </div>
  );
}
