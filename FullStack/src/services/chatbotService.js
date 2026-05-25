import axios from 'axios';

/**
 * Send a waste education question to the Gemini-powered backend chatbot.
 * @param {string} message
 * @returns {Promise<string>}
 */
export const sendChatbotMessage = async (message) => {
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!trimmedMessage) {
    throw new Error('Tulis pertanyaan terlebih dahulu.');
  }

  try {
    const response = await axios.post('/api/chatbot', { message: trimmedMessage });
    return response.data.reply;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      'Chatbot belum bisa menjawab sekarang. Silakan coba lagi.'
    );
  }
};
