'use client';

import { Check, FlaskConical, Wine } from 'lucide-react';
import type { Rozana } from '@/lib/store';

export function Roadmap({ rozana }: { rozana: Rozana }) {
  const vote = rozana.state.phase2Vote;

  return (
    <section className="section roadmap" id="whats-next">
      <div className="sachet-poll">
        <div className="sachet-image">
          <img src="/rozana-sachets.png" alt="ROZANA calcium and collagen sachets" />
        </div>
        <div className="sachet-copy">
          <p className="eyebrow">Coming next</p>
          <h2>What would you like next?</h2>
          <p>
            We&rsquo;re working on dissolvable calcium and collagen sachets. Which would you actually use?
          </p>
          <div className="vote-options">
            {['Calcium+', 'Collagen Boost', 'Both', 'Neither yet'].map((option) => (
              <button
                key={option}
                className={vote === option ? 'selected' : ''}
                onClick={() => rozana.setPhase2Vote(option)}
              >
                {vote === option && <Check />}
                {option}
              </button>
            ))}
          </div>
          {vote && (
            <p className="thanks">
              <Check /> Thank you — noted.
            </p>
          )}
          <small>
            Collagen comes from animal sources. We&rsquo;ll always tell you what&rsquo;s in a product
            before you buy it.
          </small>
        </div>
      </div>

      <div className="next-cards">
        <article>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FlaskConical />
          <h3><b>Calcium+</b></h3></div>
          <p>
            A sachet that stirs calcium into water.
          </p>
        </article>
        <br/>
        <article>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

          <Wine />
          <h3><b>Collagen Boost</b></h3></div>
          <p>
            Collagen itself, in a sachet that dissolves into water.
          </p>
        </article>
      </div>
    </section>
  );
}
