import { useState, useCallback } from 'react';
import { classifyWaste, mockClassifyWaste } from '../services/aiService';

/**
 * Custom hook for AI waste classification
 */
const useClassifier = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  /**
   * Analyze a waste image
   * @param {string} base64Image - Base64 image data
   * @param {boolean} [useMock=false] - Use mock data for testing
   */
  const analyze = useCallback(async (base64Image, useMock = false) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 400);

    try {
      const classificationResult = await classifyWaste(base64Image);

      setProgress(100);
      setResult(classificationResult);
      return classificationResult;
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menganalisis gambar.');
      return null;
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  }, []);

  /** Reset classifier state */
  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    isAnalyzing,
    result,
    error,
    progress,
    analyze,
    reset,
  };
};

export default useClassifier;
