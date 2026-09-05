'use client';

import { useMemo, useState } from 'react';
import { Check, Flame, Heart, Sunrise } from 'lucide-react';
import { CHALLENGE_POINTS, challengeForDay, challenges, formatForDay } from '@/lib/data';
import { dayKey, type Rozana } from '@/lib/store';

const dayNumber = () => Math.floor(Date.now() / 86400000);

export function DailyChallenge({ rozana }: { rozana: Rozana }) {
  const { state } = rozana;
  const today = dayNumber();
  const played = (state.earnMarks['challenge'] ?? []).includes(dayKey());

  // Locked to the day, and to the questions she has not seen before.
  const challenge = useMemo(() => {
    const storedId = state.lastChallenge?.day === dayKey() ? state.lastChallenge.id : null;
    if (storedId) {
      const seen = challenges.find((item) => item.id === storedId);
      if (seen) return seen;
    }
    return challengeForDay(today, state.answeredChallenges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, state.lastChallenge?.id]);
  const tomorrow = formatForDay(today + 1);
  const [pick, setPick] = useState<string | null>(null);
  const stored = state.lastChallenge?.day === dayKey() ? state.lastChallenge : null;
  const answered = played || pick !== null;
  const right = stored ? stored.correct : pick === challenge.correct;

  return (
    <article className="game-card">
      <div className="game-top">
        <div>
          <span>TODAY’S QUESTION</span>
          <h3>{challenge.format}</h3>
        </div>
        <div className="streak">
          <Flame /> {state.streak}
        </div>
      </div>

      {!answered ? (
        <>
          <p className="daily-question">{challenge.question}</p>
          <div className="trivia-board">
            {challenge.options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setPick(option);
                  rozana.attemptChallenge(challenge.id, option === challenge.correct);
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <small>One go a day. Get it right and that&rsquo;s {CHALLENGE_POINTS} points.</small>
        </>
      ) : (
        <div className={right ? 'game-win' : 'game-win game-miss'}>
          {right ? <Check /> : <Heart />}
          <h3>{right ? `You got it. ${CHALLENGE_POINTS} points.` : 'Not this time.'}</h3>
          <p className="answer-line">
            The answer is <b>{challenge.correct}</b>.
          </p>
          <p>{challenge.fact}</p>
          <span className="tomorrow">
            <Sunrise /> Tomorrow: {tomorrow}
          </span>
        </div>
      )}
    </article>
  );
}
