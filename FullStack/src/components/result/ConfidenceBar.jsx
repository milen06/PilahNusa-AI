import React from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * ConfidenceBar — animated progress bar showing AI classification confidence.
 * @param {number} confidence - 0–100 percent value
 */
const ConfidenceBar = ({ confidence }) => {
  const color =
    confidence >= 85 ? '#22C55E' :
    confidence >= 65 ? '#F59E0B' : '#EF4444';

  const label =
    confidence >= 85 ? 'Sangat Yakin' :
    confidence >= 65 ? 'Cukup Yakin' : 'Kurang Yakin';

  return (
    <div className="conf-bar" aria-label={`Tingkat keyakinan AI: ${confidence}%`}>
      <div className="conf-bar__header">
        <span className="conf-bar__title">
          <BarChart3 size={14} aria-hidden="true" />
          Tingkat Keyakinan AI
        </span>
        <div className="conf-bar__right">
          <span className="conf-bar__label" style={{ color }}>{label}</span>
          <span className="conf-bar__pct" style={{ color }}>{confidence}%</span>
        </div>
      </div>
      <div
        className="conf-bar__track"
        role="progressbar"
        aria-valuenow={confidence}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="conf-bar__fill"
          style={{ width: `${confidence}%`, backgroundColor: color }}
        />
      </div>

      <style>{`
        .conf-bar {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .conf-bar__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .conf-bar__title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        .conf-bar__right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .conf-bar__label {
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-body);
          opacity: 0.85;
        }
        .conf-bar__pct {
          font-size: 0.9375rem;
          font-weight: 800;
          font-family: var(--font-heading);
        }
        .conf-bar__track {
          height: 10px;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .conf-bar__fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
          animation: confBarFill 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes confBarFill {
          from { width: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default ConfidenceBar;