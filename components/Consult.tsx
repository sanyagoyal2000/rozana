'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, HeartPulse, Send, Stethoscope, Video } from 'lucide-react';
import { askLibraryAnswers, consultTiers, medicalTriggers } from '@/lib/data';
import type { Rozana } from '@/lib/store';

type Reply =
  | { kind: 'answer'; text: string; source: string }
  | { kind: 'referral'; text: string }
  | { kind: 'miss'; text: string };

export function Consult({ rozana }: { rozana: Rozana }) {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState<Reply | null>(null);
  const subscriber = rozana.state.subscription === 'active';

  function ask(event: React.FormEvent) {
    event.preventDefault();
    const text = question.trim();
    if (!text) return;

    // Anything medical is routed out before the library is even consulted.
    if (medicalTriggers.test(text)) {
      setReply({
        kind: 'referral',
        text: 'That one is for a doctor, not for us. Please do speak to yours — and take the details with you.',
      });
      return;
    }
    const hit = askLibraryAnswers.find((item) => item.match.test(text));
    setReply(
      hit
        ? { kind: 'answer', text: hit.answer, source: hit.source }
        : {
            kind: 'miss',
            text: 'We haven’t written about that yet, and we’d rather say so than guess.',
          },
    );
  }

  return (
    <section className="section consult" id="consult">
      <p className="eyebrow">Talking to someone</p>
      <div className="section-heading">
        <h2>
          Ask us anything about food.
          <br />
          <em>We&rsquo;ll be straight with you.</em>
        </h2>
        <p>
          The free answers come from our own guides. Anything medical goes to a doctor, every time.
        </p>
      </div>

      <div className="consult-grid">
        {consultTiers.map((tier) => (
          <article
            key={tier.key}
            className={tier.key === 'sub' && subscriber ? 'consult-card active' : 'consult-card'}
          >
            <span className="consult-icon">
              {tier.key === 'free' ? <BookOpen /> : tier.key === 'sub' ? <Video /> : <Stethoscope />}
            </span>
            <h3>{tier.name}</h3>
            <p className="consult-price">{tier.price}</p>
            <p>{tier.body}</p>
            <ul>
              {tier.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {tier.key === 'sub' && subscriber && <span className="consult-tag">Included in your subscription</span>}
          </article>
        ))}
      </div>

      <form className="ask-box" onSubmit={ask}>
        <label htmlFor="ask">Ask the ROZANA library</label>
        <div className="ask-row">
          <input
            id="ask"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="e.g. how much calcium is in til?"
          />
          <button aria-label="Ask">
            <Send />
          </button>
        </div>
        {reply && (
          <div className={`ask-reply ${reply.kind}`}>
            {reply.kind === 'referral' ? <HeartPulse /> : <BookOpen />}
            <div>
              <p>{reply.text}</p>
              {reply.kind === 'answer' && <small>Source: {reply.source}</small>}
              {reply.kind === 'referral' && (
                <small>We don’t keep this question.</small>
              )}
            </div>
          </div>
        )}
        <small className="ask-foot">
          Answers come from our own guides and recipes. It&rsquo;s food information, not medical advice.
        </small>
      </form>

      {!subscriber && (
        <div className="consult-nudge">
          <p>
            A 15-minute call with a nutritionist comes free every three months with auto-replenish. Or
            ₹499 for half an hour, taken off your next box.
          </p>
          <a href="#range">
            See the boxes <ArrowRight />
          </a>
        </div>
      )}
    </section>
  );
}
