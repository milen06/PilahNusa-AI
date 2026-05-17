import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ThumbsUp, ThumbsDown, Star, Send, X } from 'lucide-react';
import { useToast } from '../ui/Toast';

/**
 * FeedbackCard — Premium interactive feedback modal shown to users.
 * Renders via React Portal on document.body to overlay everything including sidebars.
 * @param {function} onSubmit - submitUserFeedback(rating, message) callback from hook
 */
const FeedbackCard = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isGood, setIsGood] = useState(null); // true = akurat, false = tidak akurat
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  // Scroll lock effect: prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAccuracySelect = (value) => {
    setIsGood(value);
    // Auto-set rating suggestion based on binary choice
    if (value === true && rating === 0) {
      setRating(5); // Default to 5 stars if accurate
    } else if (value === false && (rating === 0 || rating > 3)) {
      setRating(2); // Suggest lower rating if inaccurate
    }
    setError(null);
  };

  const handleRatingSelect = (star) => {
    setRating(star);
    // Keep binary choice in sync with stars
    if (star >= 4) {
      setIsGood(true);
    } else if (star <= 2) {
      setIsGood(false);
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Mohon pilih rating bintang terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { success, error: apiError } = await onSubmit(rating, message);
      
      if (success) {
        addToast('Terima kasih! Feedback Anda berhasil dikirim.', 'success');
        setIsOpen(false); // Close the modal
      } else {
        setError(apiError?.message || 'Gagal mengirim feedback. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="feedback-modal-backdrop animate-fade-in" role="dialog" aria-modal="true">
      <div className="feedback-modal-content animate-scale-in">
        {/* Close Button */}
        <button
          type="button"
          className="feedback-modal-close"
          onClick={() => setIsOpen(false)}
          aria-label="Tutup feedback"
        >
          <X size={18} />
        </button>

        <div className="feedback-header">
          <h3 className="feedback-title">Bantu Kami Meningkatkan AI</h3>
          <p className="feedback-subtitle">Apakah hasil klasifikasi sampah sudah akurat?</p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Binary Accuracy Toggle */}
          <div className="feedback-binary">
            <button
              type="button"
              className={`feedback-binary-btn feedback-binary-btn--yes ${isGood === true ? 'feedback-binary-btn--active' : ''}`}
              onClick={() => handleAccuracySelect(true)}
              aria-pressed={isGood === true}
            >
              <div className="feedback-binary-icon">
                <ThumbsUp size={18} />
              </div>
              <span>Ya, Akurat</span>
            </button>

            <button
              type="button"
              className={`feedback-binary-btn feedback-binary-btn--no ${isGood === false ? 'feedback-binary-btn--active' : ''}`}
              onClick={() => handleAccuracySelect(false)}
              aria-pressed={isGood === false}
            >
              <div className="feedback-binary-icon">
                <ThumbsDown size={18} />
              </div>
              <span>Tidak Akurat</span>
            </button>
          </div>

          {/* Star Rating Section */}
          <div className="feedback-stars-container">
            <label className="feedback-label">Beri Rating Hasil Klasifikasi:</label>
            <div className="feedback-stars" role="radiogroup" aria-label="Rating Klasifikasi">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = (hoveredRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    className={`feedback-star-btn ${isActive ? 'feedback-star-btn--active' : ''}`}
                    onClick={() => handleRatingSelect(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    aria-label={`${star} Bintang`}
                    role="radio"
                    aria-checked={rating === star}
                  >
                    <Star
                      size={28}
                      fill={isActive ? 'var(--star-active-color, #F59E0B)' : 'none'}
                      stroke={isActive ? 'var(--star-active-color, #F59E0B)' : 'var(--color-text-tertiary)'}
                      className="feedback-star-icon"
                    />
                  </button>
                );
              })}
            </div>
            {rating > 0 && (
              <span className="feedback-rating-desc">
                {rating === 5 && 'Sangat Sempurna & Akurat! 😍'}
                {rating === 4 && 'Cukup Bagus & Akurat! 🙂'}
                {rating === 3 && 'Kurang Lebih Benar/Mirip 🤔'}
                {rating === 2 && 'Salah Klasifikasi 😕'}
                {rating === 1 && 'Sangat Kacau/Salah Total 😡'}
              </span>
            )}
          </div>

          {/* Message Input */}
          <div className="feedback-message-container">
            <label htmlFor="feedback-comment" className="feedback-label">
              Tulis masukan Anda <span className="feedback-label-muted">(opsional)</span>:
            </label>
            <textarea
              id="feedback-comment"
              className="feedback-textarea"
              placeholder="Contoh: Ini botol air mineral plastik, bukan kaca. Atau saran perbaikan lainnya..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={300}
            />
            <div className="feedback-textarea-footer">
              <span className="feedback-char-count">{message.length}/300</span>
            </div>
          </div>

          {error && <div className="feedback-error-msg">{error}</div>}

          <button
            type="submit"
            className="feedback-submit-btn"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? (
              <>
                <div className="feedback-spinner" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Kirim Feedback</span>
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        /* ---- Modal Backdrop Overlay ---- */
        .feedback-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.7); /* Slightly darker slate overlay */
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999999; /* Absolute topmost z-index to cover sidebar */
          padding: 20px;
        }

        /* ---- Modal Box Content ---- */
        .feedback-modal-content {
          background: var(--color-white);
          border-radius: var(--radius-2xl);
          padding: 32px 28px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          position: relative;
          border: 1px solid var(--color-border-light);
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: all var(--transition-normal);
        }

        /* ---- Close Button ---- */
        .feedback-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--color-bg-secondary);
          border: none;
          border-radius: var(--radius-full);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-text-secondary);
          transition: all var(--transition-normal);
        }

        .feedback-modal-close:hover {
          background: var(--color-border-light);
          color: var(--color-text-primary);
          transform: rotate(90deg);
        }

        .feedback-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-right: 24px;
        }

        .feedback-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
          color: var(--color-text-primary);
        }

        .feedback-subtitle {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ---- Binary Button Selector ---- */
        .feedback-binary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .feedback-binary-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          border-radius: var(--radius-lg);
          border: 1.5px solid var(--color-border);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          background: var(--color-white);
          transition: all var(--transition-normal);
        }

        .feedback-binary-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .feedback-binary-btn:hover {
          background: var(--color-bg);
          color: var(--color-text-primary);
          border-color: var(--color-text-tertiary);
        }

        .feedback-binary-btn:hover .feedback-binary-icon {
          transform: scale(1.15);
        }

        /* Active Binary Styling */
        .feedback-binary-btn--yes.feedback-binary-btn--active {
          background: var(--color-primary-bg);
          border-color: var(--color-primary);
          color: var(--color-primary-darker);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        }

        .feedback-binary-btn--no.feedback-binary-btn--active {
          background: var(--color-b3-bg);
          border-color: var(--color-b3);
          color: #B91C1C;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }

        /* ---- Star Rating ---- */
        .feedback-stars-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-top: 1px dashed var(--color-border);
          border-bottom: 1px dashed var(--color-border);
        }

        .feedback-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .feedback-label-muted {
          font-weight: 400;
          color: var(--color-text-tertiary);
        }

        .feedback-stars {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .feedback-star-btn {
          background: transparent;
          border: none;
          padding: 4px;
          cursor: pointer;
          transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          outline: none;
        }

        .feedback-star-btn:hover {
          transform: scale(1.25) rotate(5deg);
        }

        .feedback-star-btn:active {
          transform: scale(0.95);
        }

        .feedback-star-icon {
          transition: all 0.25s ease;
        }

        .feedback-rating-desc {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #D97706;
          animation: scanPulse 1.5s infinite alternate;
        }

        /* ---- Comment Textarea ---- */
        .feedback-message-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feedback-textarea {
          width: 100%;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 12px 14px;
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--color-text-primary);
          background: var(--color-white);
          outline: none;
          transition: border-color var(--transition-fast);
          resize: none;
        }

        .feedback-textarea:focus {
          border-color: var(--color-primary);
        }

        .feedback-textarea::placeholder {
          color: var(--color-text-tertiary);
        }

        .feedback-textarea-footer {
          display: flex;
          justify-content: flex-end;
        }

        .feedback-char-count {
          font-size: 0.75rem;
          color: var(--color-text-tertiary);
        }

        /* ---- Error message ---- */
        .feedback-error-msg {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-b3);
          background: var(--color-b3-bg);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(239, 68, 68, 0.2);
          text-align: center;
        }

        /* ---- Submit Button ---- */
        .feedback-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          border-radius: var(--radius-lg);
          border: none;
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          box-shadow: var(--shadow-green);
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .feedback-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-green-lg);
        }

        .feedback-submit-btn:disabled {
          background: var(--color-bg-secondary);
          color: var(--color-text-tertiary);
          box-shadow: none;
          cursor: not-allowed;
        }

        /* ---- Spinner ---- */
        .feedback-spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default FeedbackCard;
