'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Rozana } from '@/lib/store';

const SHOW_FOR = 6000;

/**
 * One short, friendly line at the bottom of the screen. Whether it is visible
 * is decided from its own timestamp, so no unrelated state write can cut it
 * short or leave it stuck on screen.
 */
export function Notice({ rozana }: { rozana: Rozana }) {
  const notice = rozana.state.notice;
  const [, tick] = useState(0);

  useEffect(() => {
    if (!notice) return;
    const left = notice.at + SHOW_FOR - Date.now();
    if (left <= 0) return;
    const timer = window.setTimeout(() => tick((value) => value + 1), left);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!notice || Date.now() - notice.at >= SHOW_FOR) return null;

  return (
    <div className="notice" role="status">
      <p>{notice.text}</p>
      <button onClick={rozana.dismissNotice} aria-label="Close">
        <X />
      </button>
    </div>
  );
}
