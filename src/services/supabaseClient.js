import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are provided
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url');

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Warning: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured.\n' +
    'Please set these environment variables in your .env file to enable cloud synchronization.\n' +
    'Falling back to client-only LocalStorage mode.'
  );
}

// Initialize Supabase client (only if configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Save a scan item to Supabase (scan_history table)
 * @param {Object} historyItem - The history item from backend (contains id, timestamp, imageBase64, result)
 * @param {string} userId - The unique user ID
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const saveScanToSupabase = async (historyItem, userId) => {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase
      .from('scan_history')
      .insert({
        id: historyItem.id,
        user_id: userId,
        timestamp: historyItem.timestamp,
        image_base_64: historyItem.imageBase64, // thumbnail
        result: historyItem.result
      });

    if (error) {
      console.error('[Supabase] Error inserting scan:', error);
      return { success: false, error };
    }

    console.log('[Supabase] Successfully saved scan to cloud:', historyItem.id);
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Exception saving scan:', err);
    return { success: false, error: err };
  }
};

/**
 * Submit user feedback to Supabase (user_feedback table)
 * @param {string} userId - The unique user ID (Primary Key, one feedback per user)
 * @param {number} rating - Star rating (1-5)
 * @param {string} feedbackMessage - Detailed review message
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const submitUserFeedbackToSupabase = async (userId, rating, feedbackMessage) => {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase
      .from('user_feedback')
      .insert({
        user_id: userId,
        rating,
        feedback_message: feedbackMessage
      });

    if (error) {
      console.error('[Supabase] Error submitting feedback:', error);
      return { success: false, error };
    }

    console.log('[Supabase] Successfully saved feedback for user:', userId);
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Exception submitting feedback:', err);
    return { success: false, error: err };
  }
};

/**
 * Check if a user has already submitted feedback
 * @param {string} userId - The unique user ID
 * @returns {Promise<{success: boolean, submitted: boolean, error: any}>}
 */
export const checkFeedbackStatusFromSupabase = async (userId) => {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, submitted: false, error: 'Supabase is not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('user_feedback')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[Supabase] Error checking feedback status:', error);
      return { success: false, submitted: false, error };
    }

    return { success: true, submitted: Boolean(data) };
  } catch (err) {
    console.error('[Supabase] Exception checking feedback status:', err);
    return { success: false, submitted: false, error: err };
  }
};

/**
 * Delete a single scan history item from Supabase by ID
 * @param {string} itemId - The history item ID to delete
 * @param {string} userId - The unique user ID
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const deleteHistoryItemFromSupabase = async (itemId, userId) => {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase
      .from('scan_history')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    if (error) {
      console.error('[Supabase] Error deleting scan item:', error);
      return { success: false, error };
    }

    console.log('[Supabase] Successfully deleted scan item:', itemId);
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Exception deleting scan item:', err);
    return { success: false, error: err };
  }
};

/**
 * Clear all scan history for a user from Supabase
 * @param {string} userId - The unique user ID
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const clearHistoryFromSupabase = async (userId) => {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase
      .from('scan_history')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('[Supabase] Error clearing history:', error);
      return { success: false, error };
    }

    console.log('[Supabase] Successfully cleared all history for user:', userId);
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Exception clearing history:', err);
    return { success: false, error: err };
  }
};

/**
 * Fetch scan history for a specific user from Supabase (scan_history table)
 * @param {string} userId - The unique user ID
 * @returns {Promise<{success: boolean, data: Array, error: any}>}
 */
export const fetchHistoryFromSupabase = async (userId) => {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, data: [], error: 'Supabase is not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('[Supabase] Error fetching history:', error);
      return { success: false, data: [], error };
    }

    const mappedData = data.map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      imageBase64: item.image_base_64,
      result: item.result
    }));

    return { success: true, data: mappedData };
  } catch (err) {
    console.error('[Supabase] Exception fetching history:', err);
    return { success: false, data: [], error: err };
  }
};
