import { useState, useCallback, useEffect } from 'react';
import { getHistory, saveHistoryItem, deleteHistoryItem, clearHistory } from '../utils/storageUtils';

/**
 * Custom hook for managing scan history via localStorage
 */
const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history on mount
  useEffect(() => {
    const localHistory = getHistory();
    setHistory(localHistory);
    setIsLoaded(true);
  }, []);

  /**
   * Add a new scan result to history
   * @param {Object} item - History item to add
   */
  const addToHistory = useCallback((item) => {
    const updatedHistory = saveHistoryItem(item);
    setHistory(updatedHistory);
    return item;
  }, []);

  /**
   * Remove an item from history by ID
   * @param {string} id - Item ID
   */
  const removeFromHistory = useCallback((id) => {
    const updatedHistory = deleteHistoryItem(id);
    setHistory(updatedHistory);
  }, []);

  /**
   * Clear all history items
   */
  const clearAllHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  /**
   * Filter history by category
   * @param {string} category - Category to filter by ('all' for no filter)
   * @returns {Array} Filtered history
   */
  const filterByCategory = useCallback((category) => {
    if (category === 'all') return history;
    return history.filter((item) => item.result?.category === category);
  }, [history]);

  /**
   * Search history by name
   * @param {string} query - Search query
   * @returns {Array} Matching history items
   */
  const searchHistory = useCallback((query) => {
    if (!query.trim()) return history;
    const lowerQuery = query.toLowerCase();
    return history.filter(
      (item) =>
        item.result?.name?.toLowerCase().includes(lowerQuery) ||
        item.result?.category?.toLowerCase().includes(lowerQuery)
    );
  }, [history]);

  const totalScans = history.length;
  const categoryCounts = history.reduce((acc, item) => {
    const cat = item.result?.category || 'unknown';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return {
    history,
    isLoaded,
    totalScans,
    categoryCounts,
    addToHistory,
    removeFromHistory,
    clearAllHistory,
    filterByCategory,
    searchHistory,
  };
};

export default useHistory;

