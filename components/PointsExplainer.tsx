'use client';

import { ArrowRight, Clock, Gift, Sparkles, Truck, X } from 'lucide-react';
import { POINT_VALUE, pointsExplainer, rewards } from '@/lib/data';
import type { Rozana } from '@/lib/store';

export function PointsExplainer({ rozana, onClose }: { rozana: Rozana; onClose: () => void }) {
  const { state } = rozana;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="How points work">
      <article className="points-modal">
        <button className="close" onClick={onClose} aria-label="Close">
          <X />
        </button>
        <p className="eyebrow">
          <Sparkles /> How points work
        </p>
        <h2>Small things, added up.</h2>
        <p className="points-worth">{pointsExplainer.worth}</p>

        <div className="points-you">
          <span>You have</span>
          <strong>{state.points} points</strong>
          <span>≈ ₹{Math.round(state.points * POINT_VALUE)}</span>
        </div>

        <h3>How you collect them</h3>
        <ul className="points-earn">
          {pointsExplainer.earn.map((item) => (
            <li key={item.label}>
              <b>{item.points}</b>
              <div>
                <span>{item.label}</span>
                <small>{item.detail}</small>
              </div>
            </li>
          ))}
        </ul>

        <h3>What you can use them for</h3>
        <ul className="points-spend">
          {rewards.map((reward) => (
            <li key={reward.cost} className={state.points >= reward.cost ? 'reached' : ''}>
              <b>{reward.cost}</b>
              <div>
                <span>{reward.label}</span>
                <small>{reward.detail}</small>
              </div>
            </li>
          ))}
        </ul>

        <div className="points-notes">
          <p>
            <Truck /> {pointsExplainer.shipping}
          </p>
          <p>
            <Clock /> {pointsExplainer.expiry}
          </p>
        </div>

        <button className="primary-cta" onClick={onClose}>
          <Gift /> Got it <ArrowRight />
        </button>
      </article>
    </div>
  );
}
