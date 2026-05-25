import React from 'react';

/**
 * Stat chip component — displays metric like "95% Akurasi"
 */
const StatCard = ({ value, label, color = 'var(--color-primary)' }) => {
  return (
    <div className="stat-card">
      <span className="stat-card__value" style={{ color }}>
        {value}
      </span>
      <span className="stat-card__label">{label}</span>

      <style>{`
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          flex: 1;
        }
        .stat-card__value {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          line-height: 1;
        }
        .stat-card__label {
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default StatCard;
