'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  Gauge,
  PauseCircle,
  Play,
  PlayCircle,
  RefreshCw,
  Repeat,
  Shuffle,
  XCircle,
} from 'lucide-react';
import { track } from '@/lib/analytics';
import { journey, productByKey, reels, type ProductKey } from '@/lib/data';
import { journeyStopFor, tierFor } from '@/lib/engine';
import { dayKey, replenishmentDate, routineDay, servingsRemaining, weekKey, type Rozana } from '@/lib/store';
import { StaticMix } from './Range';
import { DailyChallenge } from './DailyChallenge';
import { ProgressPanel, nextReward } from './ProgressPanel';

export function Dashboard({
  rozana,
  onGoTo,
  onStartCheckIn,
  onExplain,
}: {
  rozana: Rozana;
  onGoTo: (hash: string) => void;
  onStartCheckIn: () => void;
  onExplain: () => void;
}) {
  const { state } = rozana;
  const profile = state.profile!;
  const day = routineDay(state);
  const stop = journeyStopFor(day || 1);
  const remaining = servingsRemaining(state);
  const refillDate = replenishmentDate(state);
  const takenToday = state.log.includes(dayKey());
  const plain = state.gameMode === 'plain';
  const purchase = state.purchase;

  // Today's product follows the mix: the top priority most days, the rest woven in.
  const mixKeys: ProductKey[] = (purchase?.mix.map((item) => item.key) ?? profile.productKeys) as ProductKey[];
  const today = productByKey[mixKeys[day % Math.max(1, mixKeys.length)] ?? profile.productKeys[0]];
  const contextReel = reels.find((reel) => reel.id === stop.contentId) ?? reels[0];

  const [weeklyNote, setWeeklyNote] = useState('');
  const weeklyDone = state.weeklyCheckins.some(
    (item) => weekKey(new Date(item.at)) === weekKey(),
  );

  // Weekly logging bonus and the Day 21 milestone are awarded, not claimed.
  useEffect(() => {
    const thisWeek = state.log.filter((value) => weekKey(new Date(value)) === weekKey()).length;
    if (thisWeek >= 5) rozana.loggedFiveThisWeek();
    if (day >= 21) {
      rozana.finishRoutine();
      track('replenishment_prompted', { reason: 'day21' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.log.length, day]);

  useEffect(() => {
    if (remaining > 0 && remaining <= 5) track('replenishment_prompted', { reason: 'low_servings' });
  }, [remaining]);

  return (
    <section className="section dashboard" id="plan">
      <div className="dash-head">
        <div>
          <p className="eyebrow">My ROZANA Plan</p>
          <h2>
            {purchase ? `Day ${Math.max(1, day)} of 21.` : 'Your plan is saved.'}
            <br />
            <em>{purchase ? 'Small, and yours.' : 'Pick a box when you’re ready.'}</em>
          </h2>
        </div>
        <div className="dash-mode">
          <button
            className={plain ? '' : 'on'}
            onClick={() => rozana.setGameMode('full')}
          >
            Show points
          </button>
          <button className={plain ? 'on' : ''} onClick={() => rozana.setGameMode('plain')}>
            Hide points
          </button>
        </div>
      </div>

      {!plain && (
        <>
          <ProgressPanel rozana={rozana} onExplain={onExplain} />
          <ReturnHooks rozana={rozana} />
        </>
      )}

      <div className="dash-grid">
        <article className="dash-card today" style={{ '--tone': today.colour } as React.CSSProperties}>
          <span className="card-label">Today</span>
          <img src={today.image} alt={`ROZANA ${today.name}`} />
          <h3>ROZANA {today.name}</h3>
          <p className="cue">{today.cue}</p>
          <button className="take" disabled={takenToday || !purchase} onClick={rozana.logToday}>
            {takenToday ? (
              <>
                <Check /> Marked as taken
              </>
            ) : (
              <>Mark as taken</>
            )}
          </button>
          {!purchase && <small>You can start ticking these off once your box is on its way.</small>}
        </article>

        <article className="dash-card supply">
          <span className="card-label">Your supply</span>
          <div className="supply-figure">
            <strong>{remaining}</strong>
            <span>sachets left of {purchase?.sachets ?? 0}</span>
          </div>
          <div className="supply-bar">
            <span style={{ width: `${purchase ? ((purchase.sachets - remaining) / purchase.sachets) * 100 : 0}%` }} />
          </div>
          {refillDate && (
            <p>
              <CalendarClock /> Estimated replenishment{' '}
              <b>
                {refillDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </b>
            </p>
          )}
          {purchase && <StaticMix mix={purchase.mix} sachets={purchase.sachets} />}
          {purchase && !purchase.shippedAt && (
            <button className="ghost" onClick={rozana.markShipped}>
              <RefreshCw /> Mark my box as shipped
            </button>
          )}
        </article>

        <article className="dash-card journey">
          <span className="card-label">The 21-day routine</span>
          <ol className="journey-line">
            {journey.map((item) => {
              const state_ = day >= item.day ? 'done' : 'ahead';
              return (
                <li key={item.day} className={state_}>
                  <span className="node">{day >= item.day ? <Check /> : item.day}</span>
                  <div>
                    <b>Day {item.day} · {item.title}</b>
                    <p>{item.cue}</p>
                    <small>{item.content}</small>
                  </div>
                </li>
              );
            })}
          </ol>
          {day >= 21 && (
            <div className="journey-done">
              <Check /> You finished the 21 days. 100 points added — and you can change your mix for the next box.
            </div>
          )}
        </article>

        <article className="dash-card reel-of-day">
          <span className="card-label">For today</span>
          <button
            className="reel-tile"
            style={{ backgroundImage: `url(${contextReel.poster})` }}
            onClick={() => {
              rozana.watchReel(contextReel.id);
              onGoTo('guidance');
            }}
          >
            <PlayCircle />
          </button>
          <h3>{contextReel.title}</h3>
          <small>
            {contextReel.series} · {contextReel.duration}
          </small>
        </article>

        {!plain && <DailyChallenge rozana={rozana} />}

        <article className="dash-card weekly">
          <span className="card-label">Weekly check-in</span>
          {weeklyDone ? (
            <div className="weekly-done">
              <Check />
              <p>Done for this week. Thank you.</p>
            </div>
          ) : (
            <>
              <p>{stop.checkIn}</p>
              <textarea
                rows={3}
                placeholder="A sentence is plenty."
                value={weeklyNote}
                onChange={(event) => setWeeklyNote(event.target.value)}
              />
              <button
                className="primary-cta"
                disabled={!weeklyNote.trim()}
                onClick={() => {
                  rozana.weeklyCheckIn(weeklyNote.trim());
                  setWeeklyNote('');
                }}
              >
                Submit {plain ? '' : '· 5 points'}
              </button>
            </>
          )}
        </article>

        <article className="dash-card controls">
          <span className="card-label">Your box</span>
          {purchase ? (
            <>
              <p className="control-summary">
                <b>{tierFor(purchase.tierKey).name}</b> · ₹{purchase.price}
                {state.subscription === 'active' && ' · renewing every 28 days'}
                {state.subscription === 'paused' && ' · paused'}
                {state.subscription === 'cancelled' && ' · cancelled'}
              </p>
              <div className="control-grid">
                <button onClick={rozana.reorder}>
                  <Repeat /> Reorder now
                </button>
                {state.subscription !== 'active' ? (
                  <button onClick={() => rozana.setSubscription('active')}>
                    <Bell /> Start auto-replenish
                  </button>
                ) : (
                  <button onClick={() => rozana.setSubscription('paused')}>
                    <PauseCircle /> Pause
                  </button>
                )}
                <button onClick={() => onGoTo('range')}>
                  <Shuffle /> Change my bundle
                </button>
                <button onClick={onStartCheckIn}>
                  <Gauge /> Retake the Check-In
                </button>
                {state.subscription === 'active' || state.subscription === 'paused' ? (
                  <button className="danger" onClick={() => rozana.setSubscription('cancelled')}>
                    <XCircle /> Cancel subscription
                  </button>
                ) : null}
              </div>
              <small>Pause, skip, swap or cancel — all of it here, in one tap.</small>
            </>
          ) : (
            <>
              <p>No box yet. The Check-In has suggested a size to start with.</p>
              <button className="primary-cta" onClick={() => onGoTo('range')}>
                <Play /> Choose my first box <ArrowRight />
              </button>
            </>
          )}
        </article>
      </div>


    </section>
  );
}

/**
 * Quiet reasons to come back. No timers, no countdowns, nothing that sounds
 * like a warning — just a nudge she would not mind reading.
 */
function ReturnHooks({ rozana }: { rozana: Rozana }) {
  const { state } = rozana;
  const next = nextReward(state.points);
  const away = next ? next.cost - state.points : 0;
  const visitedToday = state.visitDays.includes(dayKey());
  const yesterday = state.visitDays.includes(dayKey(new Date(Date.now() - 86400000)));
  const streakAtRisk = state.streak >= 3 && visitedToday && !yesterday;

  const hooks: string[] = [];
  if (state.streakSaved) hooks.push('You missed a day and your streak held. Nothing lost.');
  else if (streakAtRisk) hooks.push(`Your ${state.streak}-day streak is still going. A quick look tomorrow keeps it.`);
  if (next && away > 0 && away <= 150) hooks.push(`You are ${away} points from ${next.label.toLowerCase()}.`);

  if (hooks.length === 0) return null;

  return (
    <div className="return-hooks">
      {hooks.map((hook) => (
        <p key={hook}>{hook}</p>
      ))}
    </div>
  );
}
