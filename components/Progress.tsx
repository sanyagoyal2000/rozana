'use client';

import { useState } from 'react';
import { Check, Copy, Gift, Trophy, Users } from 'lucide-react';
import { POINT_VALUE, REFERRAL_POINTS, rewards } from '@/lib/data';
import type { Rozana } from '@/lib/store';
import { DailyChallenge } from './DailyChallenge';
import { ProgressPanel } from './ProgressPanel';

export function Progress({ rozana, onExplain }: { rozana: Rozana; onExplain: () => void }) {
  const { state } = rozana;

  if (state.gameMode === 'plain') {
    return (
      <section className="section progress-off" id="progress">
        <p className="eyebrow">My progress</p>
        <h2>
          Points are switched off.
          <br />
          <em>Your routine works exactly the same.</em>
        </h2>
        <p>
          No points, no streaks, no daily question. You still earn them quietly, and you can turn this
          back on whenever you like.
        </p>
        <button className="primary-cta" onClick={() => rozana.setGameMode('full')}>
          Turn progress back on
        </button>
      </section>
    );
  }

  return (
    <section className="section progress-zone" id="progress">
      <p className="eyebrow">My progress</p>
      <div className="section-heading">
        <h2>
          Small things,
          <br />
          <em>added up.</em>
        </h2>
        <p>
          Where you are this week, and what you have collected so far. Ticking off your sachet and
          answering the weekly check-in are the two that add up fastest.
        </p>
      </div>

      <ProgressPanel rozana={rozana} onExplain={onExplain} />

      <div className="progress-grid">
        <DailyChallenge rozana={rozana} />

        <article className="redeem-card">
          <h3>
            <Gift /> What you can use them for
          </h3>
          <div className="redeem-list">
            {rewards.map((reward) => {
              const affordable = state.points >= reward.cost;
              const taken = state.redeemed.some((item) => item.label === reward.label);
              return (
                <div key={reward.cost} className={affordable ? 'redeem-row on' : 'redeem-row'}>
                  <div>
                    <b>{reward.label}</b>
                    <small>{reward.detail}</small>
                  </div>
                  <button
                    disabled={!affordable || taken}
                    onClick={() => rozana.redeem(reward.cost, reward.label)}
                  >
                    {taken ? 'Used' : `${reward.cost} pts`}
                  </button>
                </div>
              );
            })}
          </div>
          <button className="ghost" onClick={onExplain}>
            How points work
          </button>
        </article>

        <Referral rozana={rozana} />

        <article className="ledger-card">
          <h3>
            <Trophy /> Recently
          </h3>
          {state.ledger.length === 0 ? (
            <p className="rule-note">Nothing yet. Points show up here as you earn them.</p>
          ) : (
            <ul>
              {state.ledger.slice(0, 10).map((entry, index) => (
                <li key={`${entry.at}-${index}`}>
                  <span>{entry.label}</span>
                  <b className={entry.points < 0 ? 'minus' : ''}>
                    {entry.points > 0 ? '+' : ''}
                    {entry.points}
                  </b>
                </li>
              ))}
            </ul>
          )}
          <button className="ghost" onClick={() => rozana.setGameMode('plain')}>
            Hide points and challenges
          </button>
        </article>
      </div>
    </section>
  );
}

function Referral({ rozana }: { rozana: Rozana }) {
  const [copied, setCopied] = useState(false);
  const { state } = rozana;
  const link =
    typeof window === 'undefined'
      ? `rozana.in/join/${state.referralCode}`
      : `${window.location.origin}/?join=${state.referralCode}`;

  return (
    <article className="referral-card">
      <h3>
        <Users /> Tell a friend
      </h3>
      <p>
        You get {REFERRAL_POINTS} points — about ₹{Math.round(REFERRAL_POINTS * POINT_VALUE)} — when a
        friend you sent orders her first box.
      </p>
      <div className="referral-link">
        <code>{link}</code>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(link).catch(() => undefined);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2500);
          }}
        >
          {copied ? <Check /> : <Copy />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="referral-count">
        {state.referrals === 0
          ? 'No one yet. Send it to someone who would like it.'
          : `${state.referrals} ${state.referrals === 1 ? 'friend has' : 'friends have'} joined so far.`}
      </p>
      <button className="ghost" onClick={rozana.referralConverted}>
        See what happens when a friend joins
      </button>
    </article>
  );
}
