'use client';

import { useCallback, useState } from 'react';
import {
  ArrowRight,
  Bone,
  Camera,
  Check,
  Dumbbell,
  Factory,
  Flame,
  FlaskConical,
  Leaf,
  Menu,
  MessagesSquare,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Trophy,
  Utensils,
  Video,
  X,
} from 'lucide-react';
import { CheckIn } from '@/components/CheckIn';
import { Consult } from '@/components/Consult';
import { Dashboard } from '@/components/Dashboard';
import { Guidance } from '@/components/Guidance';
import { Progress } from '@/components/Progress';
import { Range } from '@/components/Range';
import { Roadmap } from '@/components/Roadmap';
import { DataDrawer, GuideModal } from '@/components/Overlays';
import { PointsExplainer } from '@/components/PointsExplainer';
import { Notice } from '@/components/Notice';
import { track } from '@/lib/analytics';
import type { GuideKey } from '@/lib/data';
import { useRozana } from '@/lib/store';

export default function Home() {
  const rozana = useRozana();
  const [menu, setMenu] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [guide, setGuide] = useState<GuideKey | null>(null);
  const [data, setData] = useState(false);
  const [points, setPoints] = useState(false);

  const { state, ready } = rozana;
  const hasPlan = Boolean(state.profile);
  const showGame = state.gameMode === 'full' && hasPlan;

  const goTo = useCallback((hash: string) => {
    setMenu(false);
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const startCheckIn = useCallback(() => {
    setMenu(false);
    setCheckIn(true);
    track('checkin_started', {});
  }, []);

  /** The plan button opens the dashboard once a plan exists, the Check-In when it does not. */
  const planAction = useCallback(() => {
    if (hasPlan) goTo('plan');
    else startCheckIn();
  }, [hasPlan, goTo, startCheckIn]);

  return (
    <main>
      <header className="nav-wrap">
        <a className="brand-lockup" href="#top">
          <span className="itc-mark">
            <img src="/itc-logo-white.png" alt="ITC Limited" />
          </span>
          <span className="wordmark">
            ROZANA<i>.</i>
          </span>
        </a>
        <nav className={menu ? 'nav-links open' : 'nav-links'}>
          <a href="#understand" onClick={() => setMenu(false)}>
            Understand the change
          </a>
          <a href="#range" onClick={() => setMenu(false)}>
            The range
          </a>
          <a href="#guidance" onClick={() => setMenu(false)}>
            Guidance
          </a>
          {showGame && (
            <a href="#progress" onClick={() => setMenu(false)}>
              My progress
            </a>
          )}
          <button onClick={planAction}>{hasPlan ? 'My ROZANA Plan' : 'Start my plan'}</button>
        </nav>
        <div className="nav-actions">
          {showGame && (
            <button
              className="points-chip"
              onClick={() => setPoints(true)}
              aria-label={`${state.points} points. How points work`}
            >
              <Trophy />
              <b>{state.points}</b> pts
            </button>
          )}
          <button aria-label="The range" onClick={() => goTo('range')}>
            <ShoppingBag />
          </button>
          <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Menu">
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero rs-hero" id="top">
        <img
          className="hero-photo"
          src="/rozana-hero-woman.png"
          alt="Confident Indian woman preparing a healthy meal"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">{hasPlan ? 'Welcome back' : 'Make your ROZANA shift'}</p>
          <h1>
            {hasPlan ? (
              <>
                Your routine is
                <br />
                <em>waiting for you.</em>
              </>
            ) : (
              <>
                Your best years
                <br />
                need your <em>strongest you.</em>
              </>
            )}
          </h1>
          <p className="hero-text">
            Savoury, everyday nutrition for the years when your body starts asking for something
            different — in a routine small enough to actually keep.
          </p>
          <div className="hero-buttons">
            <button className="primary-cta" onClick={planAction}>
              {hasPlan ? 'Open my plan' : 'Begin my Check-In'} <ArrowRight />
            </button>
            <a className="text-link" href="#understand">
              Understand the change <ArrowRight />
            </a>
          </div>
          <p className="micro">
            <Check /> Personalised guidance.
          </p>
        </div>

        {ready && (
          <div className="daily-card">
            {hasPlan ? (
              <>
                <span>YOUR ROZANA TODAY</span>
                <strong>
                  {state.gameMode === 'full' ? (
                    <>
                      <Flame /> {state.streak}-day streak
                    </>
                  ) : (
                    'Your routine is waiting'
                  )}
                </strong>
                <p>
                  {state.log.length} sachets logged
                  {state.gameMode === 'full' ? ` · ${state.points} points banked.` : '.'}
                </p>
                <button onClick={() => goTo('plan')}>
                  Open my plan <ArrowRight />
                </button>
              </>
            ) : (
              <>
                <span>TWELVE QUESTIONS · NO TYPING</span>
                <strong>Start with the Check-In</strong>
                <p>
                  A few questions about how you have been feeling and how you eat. You get a starting
                  point at the end of it.
                </p>
                <button onClick={startCheckIn}>
                  <div style={{ display: 'flex', alignItems: 'center',gap: '0.5rem' }}>
                    <p>Begin</p> <ArrowRight />
                  </div>
                </button>
              </>
            )}
          </div>
        )}
      </section>

      <section className="trust-strip">
        <span>
          <Leaf /> Vegetarian
        </span>
        <span>
          <Utensils /> Familiar Indian flavours
        </span>
        <span>
          <Sparkles /> Savoury, never sweet
        </span>
        <button onClick={() => setData(true)}>
          <ShieldCheck /> Your data
        </button>
      </section>

      {hasPlan && (
        <Dashboard
          rozana={rozana}
          onGoTo={goTo}
          onStartCheckIn={startCheckIn}
          onExplain={() => setPoints(true)}
        />
      )}

      <section className="body-change section" id="understand">
        <div className="body-photo-pair">
          <figure>
            <img src="/rozana-neck-young.png" alt="Indian professional experiencing mild neck stiffness while working" />
            <figcaption>Neck and shoulder stiffness from desk-heavy days</figcaption>
          </figure>
          <figure>
            <img src="/rozana-knee-midlife.png" alt="Indian woman experiencing mild knee discomfort" />
            <figcaption>Knee discomfort and changing mobility</figcaption>
          </figure>
        </div>
        <div className="body-copy">
          <p className="eyebrow">Understand the change</p>
          <h2>
            Everyday signals.
            <br />
            <em>Worth noticing.</em>
          </h2>
          <p>
            Sleep, energy, knees, digestion, skin — things start behaving differently, often all at
            once. It usually isn&rsquo;t a sign that something is wrong. It is a good moment to look at
            what an ordinary week is actually giving you.
          </p>
          <div className="need-list">
            <button onClick={() => setGuide('muscle')}>
              <Dumbbell />
              <span>
                <b>Muscle &amp; strength</b>Why protein is not only for gym-goers
              </span>
              <ArrowRight />
            </button>
            <button onClick={() => setGuide('bone')}>
              <Bone />
              <span>
                <b>Bones &amp; mobility</b>Why calcium alone is not the conversation
              </span>
              <ArrowRight />
            </button>
            <button onClick={() => setGuide('skin')}>
              <Sparkles />
              <span>
                <b>Skin &amp; change</b>Collagen versus collagen-support nutrition
              </span>
              <ArrowRight />
            </button>
            <button onClick={() => setGuide('markers')}>
              <FlaskConical />
              <span>
                <b>Four markers after 40</b>What to ask your doctor to check
              </span>
              <ArrowRight />
            </button>
          </div>
          <small>If pain is ongoing or severe, please see a doctor.</small>
        </div>
      </section>

      <section className="active-story">
        <img src="/rozana-active-runner.png" alt="Active Indian woman in her fifties running on an outdoor track" />
        <div>
          <p className="eyebrow">Active does not mean fully nourished</p>
          <h2>
            She shows up for her run.
            <br />
            <em>Her nutrition must show up too.</em>
          </h2>
          <p>
            Exercise is powerful, but activity alone does not guarantee consistent protein, calcium,
            vitamin D or fibre. ROZANA supports women at every step, whether you're just starting out or already active.
          </p>
          <button onClick={planAction}>
            {hasPlan ? 'Open my plan' : 'Check my nutrition priorities'} <ArrowRight />
          </button>
        </div>
      </section>

      <Range rozana={rozana} onStartCheckIn={startCheckIn} />
      <Guidance rozana={rozana} onOpenGuide={setGuide} />
      {hasPlan && <Progress rozana={rozana} onExplain={() => setPoints(true)} />}
      <Consult rozana={rozana} />
      <Roadmap rozana={rozana} />

      <section className="why-itc section" id="itc">
        <p className="eyebrow">From the house of ITC</p>
        <div className="section-heading">
          <h2>
            Built on Indian insight.
            <br />
            <em>Backed by food expertise.</em>
          </h2>
          <p>
            The same kitchens, the same sourcing standards and the same food safety checks behind the
            packets already in your kitchen cupboard.
          </p>
        </div>
        <div className="itc-reasons">
          <article>
            <Leaf />
            <b>Where the ingredients come from</b>
            <p>
              Chana, til, jowar, methi and oats sourced through the same farm networks ITC has worked with
              for decades — and checked before they reach a kitchen.
            </p>
          </article>
          <article>
            <ShieldCheck />
            <b>Made in kitchens you already trust</b>
            <p>
              Cooked and packed in ITC food facilities, to the food safety standards that already sit
              behind brands in your home.
            </p>
          </article>
          <article>
            <Factory />
            <b>Savoury, because that is what you eat</b>
            <p>
              Getting til and methi to taste right at ₹35 a serving takes a proper food kitchen. That is
              the part we did not want to shortcut.
            </p>
          </article>
          <article>
            <Store />
            <b>Easy to actually get hold of</b>
            <p>
              Delivered to your door, and stocked where you already shop — so a routine does not fall
              apart because a box ran out.
            </p>
          </article>
        </div>
      </section>

      <section className="community" id="community">
        <div>
          <p className="eyebrow">The ROZANA Circle</p>
          <h2>
            Useful, honest conversations
            <br />
            <em>for life after 40.</em>
          </h2>
          <p>Recipes, questions and honest answers. Come say hello.</p>
          <div className="instagram-embed">
            <iframe src="https://www.instagram.com/itc_limited/embed" title="ITC Limited on Instagram" loading="lazy" />
            <div>
              <Camera />
              <strong>@itc_limited</strong>
              <span>Official ITC Instagram</span>
              <a href="https://www.instagram.com/itc_limited/" target="_blank" rel="noreferrer">
                View on Instagram <ArrowRight />
              </a>
            </div>
          </div>
          <div className="social-links">
            <a href="https://www.instagram.com/itc_limited/" target="_blank" rel="noreferrer">
              <Camera /> Instagram
            </a>
            <a href="https://www.youtube.com/@ITCCorporate" target="_blank" rel="noreferrer">
              <Video /> YouTube
            </a>
            <a href="https://www.itcportal.com/" target="_blank" rel="noreferrer">
              <MessagesSquare /> ITC Limited
            </a>
          </div>

        </div>

        <div className="join-card">
          <span className="category">TELL A FRIEND</span>
          <h3>Know someone who would like this?</h3>
          <p>
            Share. Earn. Save. Refer a friend and earn 200 points, when they place their first order. Start referring now!

          </p>
          <br/>
          <button className="primary-cta" onClick={rozana.referralConverted}>
            See how it works <ArrowRight />
          </button>
          <small>Points arrive when her box ships. For every 1000 points you earn get ₹50 off.</small>
        </div>
      </section>

      <footer>
        <div>
          <a className="brand-lockup footer-brand" href="#top">
            <span className="itc-mark">
              <img src="/itc-logo-white.png" alt="ITC Limited" />
            </span>
            <span className="wordmark">
              ROZANA<i>.</i>
            </span>
          </a>
          <p>Food-led nutrition for changing lives.</p>
        </div>
        <div>
          <strong>Explore</strong>
          <a href="#understand">Understand the change</a>
          <a href="#range">The range</a>
          <a href="#guidance">Guidance</a>
          <button onClick={planAction}>{hasPlan ? 'My ROZANA Plan' : 'Start my plan'}</button>
        </div>
        <div>
          <strong>Help</strong>
          <button onClick={() => setData(true)}>Your data</button>
          <button onClick={() => setGuide('markers')}>When to see a doctor</button>
          <a href="#consult">Ask a question</a>
        </div>
        <p className="footer-note">
          A concept prototype. Products, prices and claims are illustrative.
        </p>
      </footer>

      {checkIn && (
        <CheckIn
          rozana={rozana}
          onClose={() => setCheckIn(false)}
          onOpenGuide={(key) => {
            setCheckIn(false);
            setGuide(key);
          }}
          onGoTo={goTo}
        />
      )}
      {guide && <GuideModal guideKey={guide} onClose={() => setGuide(null)} onStartCheckIn={startCheckIn} />}
      {data && <DataDrawer rozana={rozana} onClose={() => setData(false)} />}
      {points && <PointsExplainer rozana={rozana} onClose={() => setPoints(false)} />}
      <Notice rozana={rozana} />
    </main>
  );
}
