'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, Check, PlayCircle, Video } from 'lucide-react';
import { guides, reels, seriesBlurbs, type GuideKey, type Reel } from '@/lib/data';
import type { Rozana } from '@/lib/store';

const seriesList: Reel['series'][] = ['Rozana Rasoi', 'Rozana Move', 'Rozana Explains'];

export function Guidance({
  rozana,
  onOpenGuide,
}: {
  rozana: Rozana;
  onOpenGuide: (key: GuideKey) => void;
}) {
  const [series, setSeries] = useState<Reel['series'] | 'All'>('All');
  const [open, setOpen] = useState<string | null>(null);
  const shown = series === 'All' ? reels : reels.filter((reel) => reel.series === series);

  return (
    <section className="section guidance" id="guidance">
      <p className="eyebrow">Guidance</p>
      <div className="section-heading">
        <h2>
          A minute, no more.
          <br />
          <em>Then back to your day.</em>
        </h2>
        
      </div>

      <div className="series-tabs">
        <button className={series === 'All' ? 'on' : ''} onClick={() => setSeries('All')}>
          All
        </button>
        {seriesList.map((item) => (
          <button key={item} className={series === item ? 'on' : ''} onClick={() => setSeries(item)}>
            {item}
          </button>
        ))}
      </div>
      {series !== 'All' && <p className="series-blurb">{seriesBlurbs[series]}</p>}

      <div className="reel-feed">
        {shown.map((reel) => {
          const watched = rozana.state.reelsWatched.includes(reel.id);
          const isOpen = open === reel.id;
          return (
            <article key={reel.id} className={isOpen ? 'reel-card open' : 'reel-card'}>
              <button
                className="reel-stage"
                style={{ backgroundImage: `url(${reel.poster})`, '--tone': reel.tone } as React.CSSProperties}
                onClick={() => {
                  setOpen(isOpen ? null : reel.id);
                  if (!isOpen) rozana.watchReel(reel.id);
                }}
                aria-label={`Play ${reel.title}`}
              >
                <span className="reel-shade" />
                <span className="reel-play">{watched ? <Check /> : <PlayCircle />}</span>
                <span className="reel-duration">{reel.duration}</span>
                <span className="reel-series">{reel.series}</span>
                {reel.stat && <span className="reel-stat">{reel.stat}</span>}
                <span className="reel-title">{reel.title}</span>
              </button>
              {isOpen && (
                <div className="reel-body">
                  <p className="reel-placeholder">
                    <Video /> {reel.duration}. Nothing loads until you tap.
                  </p>
                  <p className="reel-seo">{reel.seo}</p>
                  {watched && <small className="reel-earned">Counted towards your weekly reel points.</small>}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="guide-strip">
        <div>
          <p className="eyebrow">
            <BookOpen /> If you would rather read
          </p>
          <h3>Longer reads, when you have ten minutes.</h3>
        </div>
        <div className="guide-links">
          {(Object.keys(guides) as GuideKey[]).map((key) => (
            <button key={key} onClick={() => onOpenGuide(key)}>
              <span className="category">
                {guides[key].label} · {guides[key].time}
              </span>
              <b>{guides[key].title}</b>
              <ArrowRight />
            </button>
          ))}
        </div>
      </div>

      <div className="itc-video-row">
        <p className="eyebrow">From the house of ITC</p>
        <div className="video-grid">
          {[
            { id: 'q6JARYody5I', kicker: 'Nutrition at ITC', title: 'How ITC approaches nutrition-led brands' },
            { id: 'ap-HJJVoJSE', kicker: 'House of ITC', title: 'Protein for everyday Indian needs' },
            { id: 'CGMIEPxsLDU', kicker: 'Women of India', title: 'Stories of courage and possibility' },
          ].map((video) => (
            <LazyVideo key={video.id} {...video} />
          ))}
        </div>

      </div>
    </section>
  );
}

/** Nothing loads from YouTube until the tile is tapped. */
function LazyVideo({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <article>
      <div className="video-frame">
        {play ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button className="video-poster" onClick={() => setPlay(true)} aria-label={`Play ${title}`}>
            <PlayCircle />
            <span>Tap to load from YouTube</span>
          </button>
        )}
      </div>
      <span>{kicker}</span>
      <h3>{title}</h3>
    </article>
  );
}
