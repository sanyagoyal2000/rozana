'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  FlaskConical,
  Lock,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { track } from '@/lib/analytics';
import {
  blockOrder,
  priorityMeta,
  productByKey,
  questions,
  reels,
  type GuideKey,
} from '@/lib/data';
import { tierFor, type Answers } from '@/lib/engine';
import type { Rozana } from '@/lib/store';

type Props = {
  rozana: Rozana;
  onClose: () => void;
  onOpenGuide: (key: GuideKey) => void;
  onGoTo: (hash: string) => void;
};

export function CheckIn({ rozana, onClose, onOpenGuide, onGoTo }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  const question = questions[step];
  const selected = answers[question?.id] ?? [];
  const profile = rozana.state.profile;

  const blockProgress = useMemo(
    () =>
      blockOrder.map((block) => {
        const inBlock = questions.filter((item) => item.block === block);
        const answered = inBlock.filter((item) => (answers[item.id] ?? []).length > 0).length;
        return { block, label: inBlock[0].blockLabel, total: inBlock.length, answered };
      }),
    [answers],
  );

  function record(id: number, values: string[]) {
    setAnswers((previous) => ({ ...previous, [id]: values }));
    track('checkin_answered', { question: id, block: question.block, count: values.length });
  }

  function choose(value: string) {
    if (question.multi) {
      const isNone = value === 'None of these';
      let next: string[];
      if (isNone) next = selected.includes(value) ? [] : [value];
      else {
        const without = selected.filter((item) => item !== 'None of these');
        next = without.includes(value) ? without.filter((item) => item !== value) : [...without, value];
        if (question.max && next.length > question.max) next = next.slice(-question.max);
      }
      record(question.id, next);
      return;
    }
    record(question.id, [value]);
    advance({ ...answers, [question.id]: [value] });
  }

  function advance(current: Answers) {
    if (step === questions.length - 1) {
      rozana.completeCheckIn(current);
      setDone(true);
      return;
    }
    setStep(step + 1);
  }

  if (done && profile) {
    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Your Check-In result">
        <div className="quiz-modal result-modal">
          <button className="close" onClick={onClose} aria-label="Close">
            <X />
          </button>
          <Result
            rozana={rozana}
            onOpenGuide={onOpenGuide}
            onGoTo={(hash) => {
              onClose();
              onGoTo(hash);
            }}
            saveOpen={saveOpen}
            setSaveOpen={setSaveOpen}
          />
        </div>
      </div>
    );
  }

  const canContinue = question.multi ? selected.length > 0 : selected.length > 0;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="ROZANA Check-In">
      <div className="quiz-modal">
        <button className="close" onClick={onClose} aria-label="Close">
          <X />
        </button>
        <div className="quiz-head">
          <span>ROZANA CHECK-IN</span>
          <span>
            {step + 1} of {questions.length}
          </span>
        </div>
        <div className="block-track">
          {blockProgress.map((item) => (
            <div key={item.block} className={item.block === question.block ? 'block-pip active' : 'block-pip'}>
              <span style={{ width: `${(item.answered / item.total) * 100}%` }} />
              <b>{item.label}</b>
            </div>
          ))}
        </div>
        <h2>{question.title}</h2>
        <p>{question.note}</p>
        {question.multi && (
          <span className="multi-hint">
            {question.max ? `Choose up to ${question.max}` : 'Choose as many as apply'}
          </span>
        )}
        <div className="quiz-options">
          {question.options.map((option) => {
            const on = selected.includes(option.value);
            return (
              <button
                key={option.value}
                className={on ? 'selected' : ''}
                aria-pressed={question.multi ? on : undefined}
                onClick={() => choose(option.value)}
              >
                {option.value}
                {question.multi ? on ? <Check /> : <span className="tick-slot" /> : <ArrowRight />}
              </button>
            );
          })}
        </div>
        <div className="quiz-foot">
          <div className="quiz-foot-actions">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)}>
                <ChevronLeft /> Back
              </button>
            )}
            {question.multi && (
              <button className="continue" disabled={!canContinue} onClick={() => advance(answers)}>
                Continue <ArrowRight />
              </button>
            )}
          </div>
          <span>
            <Lock /> Your answers stay on your phone. This helps you find a starting point. It
            isn&rsquo;t a medical assessment.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Result — order is deliberate: read, priorities, products, content,*/
/* package, and only then a purchase CTA.                            */
/* ---------------------------------------------------------------- */

function Result({
  rozana,
  onOpenGuide,
  onGoTo,
  saveOpen,
  setSaveOpen,
}: {
  rozana: Rozana;
  onOpenGuide: (key: GuideKey) => void;
  onGoTo: (hash: string) => void;
  saveOpen: boolean;
  setSaveOpen: (value: boolean) => void;
}) {
  const profile = rozana.state.profile!;
  const tier = tierFor(profile.tierKey);
  const picked = [...profile.recipeReelIds, profile.movementReelId]
    .map((id) => reels.find((reel) => reel.id === id))
    .filter(Boolean);

  return (
    <div className="result-flow">
      <span className="result-step">What you told us</span>
      <div className="result-head">
        <span className="result-check">
          <Check />
        </span>
        <h2>{profile.stageHeadline}</h2>
        <p>{profile.stageBody}</p>
        {profile.stageTags.length > 0 && (
          <div className="stage-tags">
            {profile.stageTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      <span className="result-step">Where to start</span>
      <ol className="priority-list">
        {profile.priorities.map((priority, index) => {
          const Icon = priorityMeta[priority.key].icon;
          return (
            <li key={priority.key}>
              <span className="rank" aria-hidden="true">{index + 1}</span>
              <Icon />
              <div>
                <b>{priority.label}</b>
                <p>{priority.read}</p>
                {priority.why.length > 0 && <small>Suggested because {priority.why[0]}.</small>}
              </div>
            </li>
          );
        })}
      </ol>
      {profile.noted.map((note) => (
        <p className="result-note" key={note}>
          <ShieldCheck /> {note}
        </p>
      ))}

      <span className="result-step">What we&rsquo;d suggest</span>
      <div className="result-products">
        {profile.productKeys.map((key) => {
          const product = productByKey[key];
          return (
            <div key={key} style={{ '--tone': product.colour } as React.CSSProperties}>
              <p>
                ROZANA <strong>{product.name}</strong>
              </p>
              <span>{product.flavour}</span>
              <small>{product.benefit}</small>
              <em>{product.cue}</em>
            </div>
          );
        })}
      </div>

      <span className="result-step">A few things to watch</span>
      <div className="result-reels">
        {picked.map((reel) => (
          <button key={reel!.id} onClick={() => onGoTo('guidance')}>
            <span className="reel-thumb" style={{ backgroundImage: `url(${reel!.poster})` }}>
              <Play />
            </span>
            <b>{reel!.title}</b>
            <small>
              {reel!.series} · {reel!.duration}
              {reel!.stat ? ` · ${reel!.stat}` : ''}
            </small>
          </button>
        ))}
      </div>

      <span className="result-step">A good size to begin with</span>
      <div className="result-tier">
        <div className="result-tier-head">
          <div>
            <b>{tier.name}</b>
            <span>
              {tier.priceLabel} · {tier.contents} · {tier.perServing}
            </span>
          </div>
          {tier.popular && <span className="pill-popular">Most popular</span>}
        </div>
        <p>{profile.tierReason}</p>
        <p className="tier-choice">
          That is a size, not a shopping list. You fill the box yourself — as much or as little of each
          flavour as you want, at the same price either way.
        </p>
      </div>

      {profile.testBranch === 'guide' ? (
        <div className="branch-card">
          <FlaskConical />
          <div>
            <b>You said you haven&rsquo;t had a blood test recently</b>
            <p>
              There are four things worth asking your doctor to check after 40. We can&rsquo;t test
              anything ourselves — this is just so you know what to ask for.
            </p>
            <button onClick={() => onOpenGuide('markers')}>
              Read the four markers guide <ArrowRight />
            </button>
          </div>
        </div>
      ) : (
        <div className="branch-card soon">
          <FlaskConical />
          <div>
            <b>Good — you already know your numbers</b>
            <p>
              One day you&rsquo;ll be able to share a report here and get food ideas back. We&rsquo;ll
              ask before we ever hold anything like that, and you&rsquo;ll be able to delete it.
            </p>
            <span className="soon-tag">Coming later</span>
          </div>
        </div>
      )}

      <span className="result-step">When you&rsquo;re ready</span>
      <div className="result-actions">
        <button className="primary-cta" onClick={() => onGoTo('range')}>
          See the {tier.name.toLowerCase()} <ArrowRight />
        </button>
        <button onClick={() => setSaveOpen(!saveOpen)}>
          {saveOpen ? 'Hide save options' : 'Save my plan'}
        </button>
      </div>

      {saveOpen && <SavePlan rozana={rozana} />}

      <p className="result-disclaimer">
        This is guidance, never a diagnosis. If something is ongoing or severe, please see a doctor.
      </p>
    </div>
  );
}

function SavePlan({ rozana }: { rozana: Rozana }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wantEmail, setWantEmail] = useState(false);
  const [wantWhatsapp, setWantWhatsapp] = useState(false);
  const saved = Boolean(rozana.state.consent.givenAt);

  if (saved) {
    return (
      <div className="save-card saved">
        <Check />
        <div>
          <b>Saved.</b>
          <p>
            {rozana.state.consent.email || rozana.state.consent.whatsapp
              ? `We’ll send ${rozana.state.consent.frequency.toLowerCase()}.`
              : 'You didn’t leave a contact. Your plan works all the same.'}
          </p>
          <button onClick={rozana.withdrawConsent}>Delete my contact details</button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="save-card"
      onSubmit={(event) => {
        event.preventDefault();
        rozana.savePlan({
          email: wantEmail && email ? email : null,
          whatsapp: wantWhatsapp && phone ? phone : null,
          frequency: 'One message a week, and nothing else',
        });
      }}
      onFocus={() => track('plan_save_started', {})}
    >
      <b>Save my plan</b>
      <p>
        Your plan already works on this phone without any of this. Leaving a contact just means you can
        pick it up somewhere else.
      </p>
      <label className="consent-row">
        <input type="checkbox" checked={wantEmail} onChange={(event) => setWantEmail(event.target.checked)} />
        <span>
          Email me my plan <small>One message a week, and nothing else. Unsubscribe in one tap.</small>
        </span>
      </label>
      {wantEmail && (
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      )}
      <label className="consent-row">
        <input
          type="checkbox"
          checked={wantWhatsapp}
          onChange={(event) => setWantWhatsapp(event.target.checked)}
        />
        <span>
          <MessageCircle /> Send it on WhatsApp <small>One message a week. Reply STOP to end it.</small>
        </span>
      </label>
      {wantWhatsapp && (
        <input
          type="tel"
          required
          placeholder="Mobile number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      )}
      <button className="primary-cta" type="submit">
        <Sparkles /> Save my plan
      </button>
      <small>
        Nothing is ticked for you, and you can delete everything whenever you want.
      </small>
    </form>
  );
}
