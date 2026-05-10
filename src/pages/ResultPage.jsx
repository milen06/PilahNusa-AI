import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Camera, Share2 } from 'lucide-react';
import Button from '../components/ui/Button';
import ClassificationResultCard from '../components/result/ClassificationResultCard';
import { getHistoryItemById } from '../utils/storageUtils';

/**
 * Result page — displays full waste classification results using ClassificationResultCard
 */
const ResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get result from navigation state or localStorage fallback
  const stateResult = location.state?.result;
  const stateImage  = location.state?.imageDataUrl;
  const historyItem = !stateResult ? getHistoryItemById(id) : null;

  const result   = stateResult || historyItem?.result;
  const imageUrl = stateImage  || historyItem?.imageBase64;

  if (!result) {
    return (
      <div className="result-not-found animate-slide-up">
        <Trash2 size={48} color="var(--color-text-tertiary)" aria-hidden="true" />
        <h1>Hasil tidak ditemukan</h1>
        <p>Hasil scan tidak tersedia. Coba scan ulang.</p>
        <Button
          variant="primary"
          icon={<Camera size={16} />}
          onClick={() => navigate('/scan')}
          id="btn-scan-again"
          aria-label="Mulai scan baru"
        >
          Scan Sekarang
        </Button>

        <style>{`
          .result-not-found {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            min-height: 60vh;
            padding: 40px;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  const handleShare = async () => {
    const text = `Saya baru saja menscan sampah menggunakan PilahNusa AI!\n${result.name} — Kategori: ${result.category}\n#PilahNusaAI #GoGreen`;
    if (navigator.share) {
      await navigator.share({ title: 'PilahNusa AI — Hasil Scan', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Teks berhasil disalin!');
    }
  };

  return (
    <div className="result-page animate-slide-up">
      {/* Sticky header */}
      <div className="result-page__header">
        <button
          className="result-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="result-page__title">Hasil Klasifikasi</h1>
        <button
          className="result-share-btn"
          onClick={handleShare}
          aria-label="Bagikan hasil"
          title="Bagikan"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Main scrollable content */}
      <div className="result-content">
        {/* All result sections delegated to ClassificationResultCard */}
        <ClassificationResultCard result={result} imageUrl={imageUrl} />

        {/* Action buttons */}
        <div className="result-actions">
          <Button
            variant="outline"
            size="md"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/history')}
            id="btn-see-history"
            aria-label="Lihat riwayat scan"
          >
            Lihat Riwayat
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Camera size={16} />}
            onClick={() => navigate('/scan')}
            id="btn-scan-new"
            aria-label="Scan sampah baru"
            fullWidth
          >
            Scan Lagi
          </Button>
        </div>
      </div>

      <style>{`
        .result-page {
          padding: 0;
          min-height: 100vh;
          background: var(--color-bg);
        }

        .result-page__header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          background: var(--color-white);
          border-bottom: 1px solid var(--color-border-light);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .result-back-btn,
        .result-share-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--color-border);
          background: var(--color-white);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .result-back-btn:hover, .result-share-btn:hover {
          background: var(--color-bg);
          color: var(--color-text-primary);
        }

        .result-page__title {
          flex: 1;
          font-size: 1.0625rem;
          font-weight: 700;
          margin: 0;
          text-align: center;
        }

        .result-content {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 720px;
          margin: 0 auto;
        }

        .result-actions {
          display: flex;
          gap: 12px;
          padding-bottom: 8px;
        }

        @media (max-width: 767px) {
          .result-content {
            padding: 16px;
          }
          .result-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultPage;
