'use client';

import { useState } from 'react';
import { ArrowRight, Check, Gift, Info, Repeat, ShieldAlert, X } from 'lucide-react';
import { track } from '@/lib/analytics';
import { POINT_VALUE, products, tiers, type Product } from '@/lib/data';
import type { Rozana } from '@/lib/store';
import { BoxBuilder, type Mix } from './BoxBuilder';

const mixToList = (mix: Mix) =>
  products.map((product) => ({ key: product.key as string, count: mix[product.key] })).filter((item) => item.count > 0);

export function Range({ rozana, onStartCheckIn }: { rozana: Rozana; onStartCheckIn: () => void }) {
  const [detail, setDetail] = useState<Product | null>(null);
  const [boxKey, setBoxKey] = useState<string>(rozana.state.profile?.tierKey ?? 'routine21');
  const [subscribe, setSubscribe] = useState(false);
  const [cart, setCart] = useState<Mix | null>(null);
  const profile = rozana.state.profile;

  function chooseBox(key: string, asSubscription: boolean) {
    setBoxKey(asSubscription ? 'monthly' : key);
    setSubscribe(asSubscription);
    track('package_selected', { tier: key, subscription: asSubscription });
    document.getElementById('build')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section className="section range" id="range">
      <p className="eyebrow">Meet the range</p>
      <div className="section-heading">
        <h2>
          Four products.
          <br />
          <em>Your box, your way.</em>
        </h2>
        <p>
          Pick what you like, or let the Check-In suggest a place to start. You choose the box size,
          then how many of each go in it.
        </p>
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const Icon = product.icon;
          return (
            <article
              className="product-card"
              key={product.key}
              style={{ '--tone': product.colour } as React.CSSProperties}
            >
              <div className="product-top">
                <Icon />
                <span>{product.name}</span>
              </div>
              <div className="product-pack">
                <img src={product.image} alt={`ROZANA ${product.name} ${product.flavour} pack`} />
              </div>
              <p className="flavour">{product.flavour}</p>
              <h3>{product.benefit}</h3>
              <p>{product.copy}</p>
              <small>{product.ingredientsLine}</small>
              <button
                onClick={() => {
                  setDetail(product);
                  track('product_viewed', { product: product.key });
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Info />
                  <p>Serving, ingredients and allergens</p>
                  <ArrowRight />
                </div>
              </button>
            </article>
          );
        })}
      </div>

      <div className="ladder-head">
        <div>
          <p className="eyebrow">The commitment ladder</p>
          <h3>
            Begin at whatever size you actually believe in.
            <br />
            <em>Every step up lowers the cost per serving.</em>
          </h3>
        </div>
        {!profile && (
          <button className="primary-cta" onClick={onStartCheckIn}>
            Take the Check-In first <ArrowRight />
          </button>
        )}
      </div>

      <div className="tier-grid">
        {tiers.map((tier) => {
          const recommended = profile?.tierKey === tier.key;
          return (
            <article
              key={tier.key}
              className={['tier-card', tier.popular ? 'popular' : '', recommended ? 'recommended' : '']
                .filter(Boolean)
                .join(' ')}
            >
              {tier.popular && <span className="pill-popular">Most popular</span>}
              {recommended && <span className="pill-recommended">Your Check-In suggested this size</span>}
              <h4>{tier.name}</h4>
              <div className="tier-price">
                <strong>{tier.priceLabel}</strong>
                <span>{tier.perServing}</span>
              </div>
              <p className="tier-contents">{tier.contents}</p>
              <ul>
                {tier.included.map((item) => (
                  <li key={item}>
                    <Check /> {item}
                  </li>
                ))}
              </ul>
              {tier.note && <small className="tier-note">{tier.note}</small>}
              {tier.subscription && (
                <div className="sub-controls">
                  <span>Pause</span>
                  <span>Skip</span>
                  <span>Change flavour</span>
                  <span>Cancel</span>
                </div>
              )}
              <button
                className={recommended || tier.popular ? 'primary-cta' : ''}
                onClick={() => chooseBox(tier.key, Boolean(tier.subscription))}
              >
                {tier.subscription ? 'Subscribe and build it' : 'Choose this size'}
              </button>
            </article>
          );
        })}
      </div>

      <BoxBuilder
        rozana={rozana}
        boxKey={boxKey}
        setBoxKey={(key) => {
          setBoxKey(key);
          if (key !== 'monthly') setSubscribe(false);
        }}
        onAddToCart={setCart}
      />

      <div className="mix-explainer">
        <Repeat />
        <div>
          <b>Same price, whichever flavours you pick.</b>
          <p>
            A 28-sachet box is ₹899 whether you fill it with one flavour or all four. Nothing is locked,
            there is no minimum of anything, and the price never moves with the mix. Three ways to fill
            the same ₹899 box:
          </p>
          <div className="mix-examples">
            {[
              { label: 'All Fit', mix: [{ key: 'fit', count: 28 }] },
              {
                label: 'Mostly Shakti',
                mix: [
                  { key: 'shakti', count: 14 },
                  { key: 'fit', count: 7 },
                  { key: 'light', count: 4 },
                  { key: 'glow', count: 3 },
                ],
              },
              {
                label: 'An even split',
                mix: [
                  { key: 'fit', count: 7 },
                  { key: 'shakti', count: 7 },
                  { key: 'light', count: 7 },
                  { key: 'glow', count: 7 },
                ],
              },
            ].map((example) => (
              <div key={example.label}>
                <span>{example.label} · ₹899</span>
                <StaticMix mix={example.mix} sachets={28} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {detail && <ProductDetail product={detail} onClose={() => setDetail(null)} />}
      {cart && (
        <Checkout
          rozana={rozana}
          tierKey={boxKey}
          mix={mixToList(cart)}
          subscribe={subscribe}
          onClose={() => setCart(null)}
        />
      )}
    </section>
  );
}

export function StaticMix({ mix, sachets }: { mix: { key: string; count: number }[]; sachets: number }) {
  const byKey = Object.fromEntries(products.map((product) => [product.key, product]));
  return (
    <div className="mix">
      <div className="mix-bar">
        {mix.map((item) => (
          <span
            key={item.key}
            style={{ width: `${(item.count / sachets) * 100}%`, background: byKey[item.key].colour }}
          />
        ))}
      </div>
      <div className="mix-key">
        {mix.map((item) => (
          <span key={item.key}>
            <i style={{ background: byKey[item.key].colour }} />
            {byKey[item.key].name} {item.count}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`ROZANA ${product.name}`}>
      <article className="detail-modal" style={{ '--tone': product.colour } as React.CSSProperties}>
        <button className="close" onClick={onClose} aria-label="Close">
          <X />
        </button>
        <img src={product.image} alt={`ROZANA ${product.name}`} />
        <p className="flavour">{product.flavour}</p>
        <h2>ROZANA {product.name}</h2>
        <p className="detail-benefit">{product.benefit}</p>
        <dl>
          <div>
            <dt>Serving size</dt>
            <dd>{product.serving}</dd>
          </div>
          <div>
            <dt>Format</dt>
            <dd>{product.format}</dd>
          </div>
          <div>
            <dt>When it works best</dt>
            <dd>{product.cue}</dd>
          </div>
          <div>
            <dt>Ingredients</dt>
            <dd>{product.ingredients}</dd>
          </div>
          <div>
            <dt>Allergens and suitability</dt>
            <dd>{product.allergens}</dd>
          </div>
          <div>
            <dt>Dietary</dt>
            <dd>Vegetarian. Savoury, not sweet.</dd>
          </div>
        </dl>
        <p className="detail-disclaimer">
          <ShieldAlert /> Please check the allergen line above if you avoid anything. Food, not medicine
          — it doesn&rsquo;t treat or prevent any condition.
        </p>
      </article>
    </div>
  );
}

function Checkout({
  rozana,
  tierKey,
  mix,
  subscribe,
  onClose,
}: {
  rozana: Rozana;
  tierKey: string;
  mix: { key: string; count: number }[];
  subscribe: boolean;
  onClose: () => void;
}) {
  const tier = tiers.find((item) => item.key === tierKey)!;
  const [addOn, setAddOn] = useState<string>('fit');
  const [blocks, setBlocks] = useState(0);
  const { state } = rozana;

  // Blocks of 200 only, no partial burn, maximum 400 on any one order.
  const maxBlocks = Math.min(2, Math.floor(state.points / 200));
  const applied = blocks * 200;
  const discount = subscribe ? 0 : applied * POINT_VALUE;
  const price = subscribe ? 899 : tier.price;
  const totalDue = Math.max(0, price - discount);
  const done = Boolean(state.purchase) && Date.now() - state.purchase!.at < 4000;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="checkout-modal">
        <button className="close" onClick={onClose} aria-label="Close">
          <X />
        </button>
        {done ? (
          <div className="checkout-done">
            <span className="result-check">
              <Check />
            </span>
            <h2>You&rsquo;re all set.</h2>
            <p>Your 21 days start now. Everything you need is on your plan.</p>
            <button className="primary-cta" onClick={onClose}>
              Open My ROZANA Plan <ArrowRight />
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Your box</p>
            <h2>{subscribe ? 'Auto-replenish' : tier.name}</h2>
            <p className="checkout-line">
              {tier.contents} · {subscribe ? 'arrives every 28 days' : tier.perServing}
            </p>
            <p className="checkout-line">What you chose:</p>
            <StaticMix mix={mix} sachets={tier.sachets} />

            <div className="checkout-block">
              <b>
                <Gift /> Free ₹40 sachet, on the house
              </b>
              <div className="addon-row">
                {products.map((product) => (
                  <button
                    key={product.key}
                    className={addOn === product.key ? 'on' : ''}
                    onClick={() => setAddOn(product.key)}
                  >
                    {product.name}
                  </button>
                ))}
              </div>
              <small>One extra sachet, free, on top of what you chose.</small>
            </div>

            <div className="checkout-block">
              <b>Use points</b>
              {subscribe ? (
                <p className="rule-note">
                  Points don&rsquo;t come off the auto-replenish price, but you keep collecting them.
                </p>
              ) : maxBlocks === 0 ? (
                <p className="rule-note">
                  You have {state.points} points. You can start spending them at 200.
                </p>
              ) : (
                <div className="block-picker">
                  {[0, 1, 2].map((count) => (
                    <button
                      key={count}
                      disabled={count > maxBlocks}
                      className={blocks === count ? 'on' : ''}
                      onClick={() => setBlocks(count)}
                    >
                      {count === 0 ? 'None' : `${count * 200} pts · ₹${count * 200 * POINT_VALUE}`}
                    </button>
                  ))}
                </div>
              )}
              <small>Up to 400 points on one box. They come off when it ships.</small>
            </div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>₹{Math.round(totalDue)}</strong>
            </div>
            {discount > 0 && (
              <p className="rule-note">₹{Math.round(discount)} off, using {applied} points.</p>
            )}

            <button
              className="primary-cta"
              onClick={() => rozana.buy(tierKey, addOn, subscribe ? 0 : applied, mix, subscribe)}
            >
              {subscribe ? 'Start auto-replenish' : 'Place my order'} <ArrowRight />
            </button>

          </>
        )}
      </div>
    </div>
  );
}
