import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, BarChart3, Trash2, Camera, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import CategoryBadge from '../components/ui/Badge';
import useHistory from '../hooks/useHistory';
import { CATEGORY_LIST } from '../data/wasteCategories';

const FILTER_OPTIONS = [
  { key: 'all', label: 'Semua' },
  { key: 'organik', label: 'Organik' },
  { key: 'anorganik', label: 'Anorganik' },
  { key: 'B3', label: 'B3' },
];

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * History page — scan history list with filters and search
 */
const HistoryPage = () => {
  const navigate = useNavigate();
  const { history, totalScans, categoryCounts, removeFromHistory, clearAllHistory, filterByCategory, searchHistory } = useHistory();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  // Apply filter then search
  const filtered = filterByCategory(activeFilter);
  const displayed = searchQuery
    ? filtered.filter((item) =>
        item.result?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.result?.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filtered;

  const handleItemClick = (item) => {
    navigate(`/result/${item.id}`, {
      state: { result: item.result, imageDataUrl: item.imageBase64 },
    });
  };

  const handleClear = () => {
    if (confirmClear) {
      clearAllHistory();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div className="history-page animate-slide-up">
      {/* Left panel — filters */}
      <aside className="history-page__sidebar" aria-label="Filter riwayat">
        <h1 className="history-sidebar__title">Filter</h1>

        <div className="history-filters" role="group" aria-label="Filter kategori">
          {FILTER_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              className={`history-filter-btn ${activeFilter === key ? 'history-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(key)}
              aria-pressed={activeFilter === key}
              id={`filter-${key}`}
            >
              <span>{label}</span>
              <span className="history-filter-btn__count">
                {key === 'all' ? totalScans : (categoryCounts[key] || 0)}
              </span>
            </button>
          ))}
        </div>

        {/* Stats card */}
        <div className="history-stats-card">
          <div className="history-stats-card__icon" aria-hidden="true">
            <BarChart3 size={18} color="var(--color-primary)" />
          </div>
          <div>
            <strong className="history-stats-card__value">{totalScans}</strong>
            <p className="history-stats-card__label">Total Scan</p>
            <p className="history-stats-card__sub">Riwayat tersimpan</p>
          </div>
        </div>

        {totalScans > 0 && (
          <button
            className={`history-clear-btn ${confirmClear ? 'history-clear-btn--confirm' : ''}`}
            onClick={handleClear}
            id="btn-clear-history"
            aria-label={confirmClear ? 'Klik lagi untuk konfirmasi hapus semua' : 'Hapus semua riwayat'}
          >
            {confirmClear ? (
              <>
                <AlertTriangle size={14} aria-hidden="true" />
                Konfirmasi Hapus
              </>
            ) : (
              <>
                <Trash2 size={14} aria-hidden="true" />
                Hapus Semua
              </>
            )}
          </button>
        )}
      </aside>

      {/* Right panel — history list */}
      <main className="history-page__main">
        <div className="history-main__header">
          <div>
            <h2 className="history-main__title">Riwayat Scan</h2>
            <p className="history-main__subtitle">Total {displayed.length} hasil scan</p>
          </div>

          {/* Search */}
          <div className="history-search" role="search">
            <Search size={16} className="history-search__icon" aria-hidden="true" />
            <input
              type="search"
              className="history-search__input"
              placeholder="Cari riwayat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="history-search-input"
              aria-label="Cari riwayat scan"
            />
          </div>
        </div>

        {/* Content */}
        {displayed.length === 0 ? (
          <div className="history-empty" aria-live="polite">
            <div className="history-empty__icon" aria-hidden="true">
              <Clock size={48} color="var(--color-text-tertiary)" />
            </div>
            <h3 className="history-empty__title">
              {searchQuery ? 'Tidak ditemukan' : 'Belum ada riwayat'}
            </h3>
            <p className="history-empty__desc">
              {searchQuery
                ? `Tidak ada hasil untuk "${searchQuery}"`
                : 'Mulai scan sampah untuk melihat riwayat'}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                icon={<Camera size={16} />}
                onClick={() => navigate('/scan')}
                id="btn-start-scan"
                aria-label="Mulai scan sekarang"
              >
                Mulai Scan
              </Button>
            )}
          </div>
        ) : (
          <div className="history-list stagger-children" role="list">
            {displayed.map((item) => (
              <div
                key={item.id}
                className="history-item"
                role="listitem"
                onClick={() => handleItemClick(item)}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleItemClick(item)}
                aria-label={`${item.result?.name}, ${item.result?.category}, ${formatDate(item.timestamp)}`}
              >
                {item.imageBase64 ? (
                  <img
                    src={item.imageBase64}
                    alt={`Foto ${item.result?.name}`}
                    className="history-item__image"
                  />
                ) : (
                  <div className="history-item__image-placeholder" aria-hidden="true">
                    <Camera size={20} color="var(--color-text-tertiary)" />
                  </div>
                )}

                <div className="history-item__info">
                  <strong className="history-item__name">{item.result?.name}</strong>
                  <div className="history-item__meta">
                    <CategoryBadge category={item.result?.category} size="sm" />
                    <span className="history-item__confidence" aria-label={`Akurasi ${item.result?.confidence}%`}>
                      {item.result?.confidence}% akurasi
                    </span>
                  </div>
                  <time
                    className="history-item__date"
                    dateTime={item.timestamp}
                  >
                    <Clock size={12} aria-hidden="true" />
                    {formatDate(item.timestamp)}
                  </time>
                </div>

                <button
                  className="history-item__delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(item.id);
                  }}
                  aria-label={`Hapus riwayat ${item.result?.name}`}
                  title="Hapus"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .history-page {
          display: grid;
          grid-template-columns: 240px 1fr;
          min-height: 100vh;
        }

        /* ---- Sidebar ---- */
        .history-page__sidebar {
          padding: 24px 16px;
          background: var(--color-white);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .history-sidebar__title {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
        }

        .history-filters {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .history-filter-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1.5px solid transparent;
          background: transparent;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          font-family: var(--font-body);
          transition: all var(--transition-fast);
        }

        .history-filter-btn:hover {
          background: var(--color-bg);
          color: var(--color-text-primary);
        }

        .history-filter-btn--active {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: white;
          border-color: transparent;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
        }

        .history-filter-btn__count {
          min-width: 22px;
          height: 22px;
          border-radius: var(--radius-full);
          background: rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0 6px;
        }

        .history-filter-btn--active .history-filter-btn__count {
          background: rgba(255,255,255,0.25);
        }

        .history-stats-card {
          background: var(--color-primary-bg);
          border: 1px solid var(--color-primary-bg-md);
          border-radius: var(--radius-lg);
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .history-stats-card__icon {
          width: 36px;
          height: 36px;
          background: white;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
        }

        .history-stats-card__value {
          display: block;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-primary);
          font-family: var(--font-heading);
          line-height: 1;
        }

        .history-stats-card__label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 2px 0 1px;
        }

        .history-stats-card__sub {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .history-clear-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--color-border);
          background: transparent;
          cursor: pointer;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          font-family: var(--font-body);
          transition: all var(--transition-fast);
          margin-top: auto;
        }

        .history-clear-btn:hover {
          border-color: #EF4444;
          color: #EF4444;
          background: #FEF2F2;
        }

        .history-clear-btn--confirm {
          border-color: #EF4444;
          color: #EF4444;
          background: #FEF2F2;
          animation: scanPulse 0.5s ease-in-out 2;
        }

        /* ---- Main ---- */
        .history-page__main {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: var(--color-bg);
        }

        .history-main__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .history-main__title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 4px;
        }

        .history-main__subtitle {
          font-size: 0.8125rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        /* ---- Search ---- */
        .history-search {
          position: relative;
          flex: 1;
          max-width: 320px;
        }

        .history-search__icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-tertiary);
          pointer-events: none;
        }

        .history-search__input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          font-size: 0.9rem;
          font-family: var(--font-body);
          background: var(--color-white);
          color: var(--color-text-primary);
          transition: border-color var(--transition-fast);
          outline: none;
        }

        .history-search__input::placeholder {
          color: var(--color-text-tertiary);
        }

        .history-search__input:focus {
          border-color: var(--color-primary);
        }

        /* ---- Empty State ---- */
        .history-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          padding: 60px 20px;
          flex: 1;
        }

        .history-empty__title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
        }

        .history-empty__desc {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        /* ---- List ---- */
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          background: var(--color-white);
          border-radius: var(--radius-lg);
          border: 1.5px solid var(--color-border-light);
          cursor: pointer;
          transition: all var(--transition-normal);
          position: relative;
        }

        .history-item:hover {
          border-color: var(--color-primary);
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.1);
          transform: translateY(-2px);
        }

        .history-item:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        .history-item__image {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-md);
          object-fit: cover;
          flex-shrink: 0;
          background: var(--color-bg-secondary);
        }

        .history-item__image-placeholder {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-md);
          background: var(--color-bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .history-item__info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .history-item__name {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--color-text-primary);
          font-family: var(--font-heading);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .history-item__meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .history-item__confidence {
          font-size: 0.75rem;
          color: var(--color-text-tertiary);
          font-weight: 500;
        }

        .history-item__date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--color-text-tertiary);
        }

        .history-item__delete {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--color-text-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .history-item:hover .history-item__delete {
          opacity: 1;
        }

        .history-item__delete:hover {
          background: #FEF2F2;
          color: #EF4444;
        }

        /* ---- Responsive ---- */
        @media (max-width: 767px) {
          .history-page {
            grid-template-columns: 1fr;
          }

          .history-page__sidebar {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            padding: 16px;
          }

          .history-filters {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px;
          }

          .history-filter-btn {
            flex: none;
          }

          .history-page__main {
            padding: 16px;
          }

          .history-main__header {
            flex-direction: column;
          }

          .history-search {
            max-width: 100%;
          }

          .history-item__delete {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;
