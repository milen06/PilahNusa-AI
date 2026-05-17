import React from 'react';
import { PlayCircle, Youtube } from 'lucide-react';

/**
 * YoutubeTutorials — displays clickable YouTube tutorial links for a waste type.
 * @param {Array<{label: string, url: string}>} tutorials
 */
const YoutubeTutorials = ({ tutorials = [] }) => {
  if (!tutorials || tutorials.length === 0) return null;

  return (
    <div className="yt-tutorials">
      <div className="yt-tutorials__header">
        <div className="yt-tutorials__icon">
          <Youtube size={16} color="#EF4444" />
        </div>
        <h3 className="yt-tutorials__title">Tutorial Daur Ulang</h3>
      </div>

      <div className="yt-tutorials__grid">
        {tutorials.map((tutorial, i) => (
          <a
            key={i}
            href={tutorial.url}
            target="_blank"
            rel="noopener noreferrer"
            className="yt-tutorials__chip"
            aria-label={`Tonton tutorial: ${tutorial.label}`}
          >
            <PlayCircle size={14} className="yt-tutorials__play" />
            <span>{tutorial.label}</span>
          </a>
        ))}
      </div>

      <style>{`
        .yt-tutorials {
          background: var(--color-white);
          border-radius: var(--radius-xl);
          padding: 18px 20px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border-light);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .yt-tutorials__header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .yt-tutorials__icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: var(--radius-sm);
          background: #FEF2F2;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .yt-tutorials__title {
          font-size: 0.9375rem;
          font-weight: 700;
          margin: 0;
          color: var(--color-text-primary);
        }
        .yt-tutorials__grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .yt-tutorials__chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: var(--radius-full);
          color: #B91C1C;
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          transition: all var(--transition-fast);
          line-height: 1.3;
        }
        .yt-tutorials__chip:hover {
          background: #EF4444;
          border-color: #EF4444;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        .yt-tutorials__play {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default YoutubeTutorials;
