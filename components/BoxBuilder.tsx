'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Minus, Plus, Sparkles } from 'lucide-react';
import { track } from '@/lib/analytics';
import { products, tiers, type ProductKey } from '@/lib/data';
import type { Rozana } from '@/lib/store';

export type Mix = Record<ProductKey, number>;

const EMPTY: Mix = { fit: 0, shakti: 0, light: 0, glow: 0 };
const keys = products.map((product) => product.key);

/** One-off box sizes. Auto-replenish is a subscription of the monthly box, not a size. */
const boxes = tiers.filter((tier) => !tier.subscription);

const total = (mix: Mix) => keys.reduce((sum, key) => sum + mix[key], 0);

/**
 * Largest-remainder rescale: proportional, then the leftover sachets go to the
 * flavours with the biggest fractional parts, so the total lands exactly on size.
 */
function rescale(mix: Mix, size: number): Mix {
  const current = total(mix);
  if (current === 0 || current === size) return current === size ? mix : EMPTY;

  const exact = keys.map((key) => (mix[key] * size) / current);
  const next = { ...EMPTY };
  keys.forEach((key, index) => {
    next[key] = Math.floor(exact[index]);
  });

  let left = size - total(next);
  const order = keys
    .map((key, index) => ({ key, fraction: exact[index] - Math.floor(exact[index]) }))
    .sort((a, b) => b.fraction - a.fraction);

  let index = 0;
  while (left > 0) {
    next[order[index % order.length].key] += 1;
    left -= 1;
    index += 1;
  }
  return next;
}

export function BoxBuilder({
  rozana,
  boxKey,
  setBoxKey,
  onAddToCart,
}: {
  rozana: Rozana;
  boxKey: string;
  setBoxKey: (key: string) => void;
  onAddToCart: (mix: Mix) => void;
}) {
  const [mix, setMix] = useState<Mix>(EMPTY);
  const [notice, setNotice] = useState('');
  const previousBox = useRef(boxKey);

  const box = boxes.find((item) => item.key === boxKey) ?? boxes[3];
  const size = box.sachets;
  const chosen = total(mix);
  const left = size - chosen;
  const over = left < 0;
  const complete = left === 0;
  const suggestion = rozana.state.profile?.productKeys;

  // Changing box size keeps her proportions and lands the total exactly on the new size.
  useEffect(() => {
    if (previousBox.current === boxKey) return;
    previousBox.current = boxKey;
    setMix((current) => {
      const next = rescale(current, size);
      setNotice(
        total(current) === 0
          ? ''
          : `Your mix was adjusted to fit ${size} ${size === 1 ? 'sachet' : 'sachets'}. Change anything you like.`,
      );
      return next;
    });
    track('package_selected', { tier: boxKey, value: box.price });
  }, [boxKey, size, box.price]);

  function step(key: ProductKey, delta: number) {
    setMix((current) => {
      const next = current[key] + delta;
      // Inert rather than disabled: out-of-range taps simply do nothing.
      if (next < 0) return current;
      if (delta > 0 && total(current) >= size) return current;
      setNotice('');
      return { ...current, [key]: next };
    });
  }

  function useSuggestion() {
    if (!suggestion) return;
    const weights = size >= 21 ? [14, 7, 4, 3] : size >= 14 ? [6, 5, 3, 0] : size >= 7 ? [4, 3, 0, 0] : [1, 0, 0, 0];
    const order: ProductKey[] = [...suggestion, ...keys.filter((key) => !suggestion.includes(key))];
    const draft = { ...EMPTY };
    order.forEach((key, index) => {
      draft[key] = weights[index] ?? 0;
    });
    setMix(rescale(draft, size));
    setNotice('Filled in from your Check-In. Every number is still yours to change.');
  }

  return (
    <div className="builder" id="build">
      <div className="builder-head">
        <div>
          <p className="eyebrow">Build your box</p>
          <h3>
            Pick a size, then fill it
            <br />
            <em>however you want.</em>
          </h3>
        </div>
        <p className="same-price">Same price whatever you choose.</p>
      </div>

      <fieldset className="size-picker">
        <legend>Box size</legend>
        {boxes.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={item.key === boxKey}
            className={item.key === boxKey ? 'size-option on' : 'size-option'}
            onClick={() => setBoxKey(item.key)}
          >
            {item.popular && <span className="size-flag">Most popular</span>}
            <b>{item.name}</b>
            <strong>₹{item.price}</strong>
            <span>
              {item.sachets} {item.sachets === 1 ? 'sachet' : 'sachets'} · {item.perServing}
            </span>
          </button>
        ))}
      </fieldset>

      <div className="builder-bar">
        <div className="mix-bar" aria-hidden="true">
          {chosen === 0 ? (
            <span className="mix-empty" />
          ) : (
            products.map((product) =>
              mix[product.key] > 0 ? (
                <span
                  key={product.key}
                  style={{
                    width: `${(mix[product.key] / Math.max(chosen, size)) * 100}%`,
                    background: product.colour,
                  }}
                />
              ) : null,
            )
          )}
        </div>
        <div className="mix-key" aria-hidden="true">
          {products.map((product) => (
            <span key={product.key} className={mix[product.key] > 0 ? '' : 'off'}>
              <i style={{ background: product.colour }} />
              {product.name} {mix[product.key]}
            </span>
          ))}
        </div>

        <div className="builder-total" aria-live="polite">
          <strong>
            {chosen} of {size} {size === 1 ? 'sachet' : 'sachets'} chosen
          </strong>
          {over && (
            <span className="builder-error">
              {Math.abs(left)} too many — remove some to continue
            </span>
          )}
          {!over && !complete && (
            <span className="builder-hint">
              {left} still to choose
            </span>
          )}
          {complete && <span className="builder-ok">Your box is full.</span>}
        </div>
        {notice && <p className="builder-notice">{notice}</p>}
      </div>

      {suggestion && chosen === 0 && (
        <button type="button" className="suggestion-link" onClick={useSuggestion}>
          <Sparkles /> Start from my Check-In suggestion — you can change every number
        </button>
      )}

      <ul className="flavour-rows">
        {products.map((product) => {
          const count = mix[product.key];
          const atFloor = count === 0;
          const atCeiling = chosen >= size;
          return (
            <li key={product.key} style={{ '--tone': product.colour } as React.CSSProperties}>
              <span className="flavour-dot" aria-hidden="true" />
              <div className="flavour-copy">
                <b>{product.name}</b>
                <span className="flavour-name">{product.flavour}</span>
                <small>{product.benefit}</small>
              </div>
              <div className="stepper">
                <button
                  type="button"
                  aria-label={`Remove one ${product.name} sachet`}
                  aria-disabled={atFloor}
                  onClick={() => step(product.key, -1)}
                >
                  <Minus />
                </button>
                <span className="stepper-count" aria-label={`${count} ${product.name} sachets`}>
                  {count}
                </span>
                <button
                  type="button"
                  aria-label={`Add one ${product.name} sachet`}
                  aria-disabled={atCeiling}
                  onClick={() => step(product.key, 1)}
                >
                  <Plus />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="builder-foot">
        <button
          type="button"
          className="primary-cta"
          aria-disabled={!complete}
          onClick={() => {
            if (!complete) return;
            onAddToCart(mix);
          }}
        >
          Add to cart · ₹{box.price} <ArrowRight />
        </button>
        <p className="builder-help">
          {over
            ? `Remove ${Math.abs(left)} ${Math.abs(left) === 1 ? 'sachet' : 'sachets'} to continue.`
            : complete
              ? 'All set. The price is the same whichever flavours you picked.'
              : `Choose ${left} more ${left === 1 ? 'sachet' : 'sachets'} to continue.`}
        </p>
      </div>

      <small className="builder-note">
        Any mix works. All of one flavour is fine — there&rsquo;s no minimum, and nothing is chosen for
        you.
      </small>
    </div>
  );
}
