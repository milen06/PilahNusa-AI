import axios from 'axios';

/**
 * Classify waste from a base64-encoded image using the Express backend
 * @param {string} base64Image - Base64 encoded image data
 * @returns {Promise<Object>} Classification result
 */
export const classifyWaste = async (base64Image) => {
  try {
    // Convert raw base64 to Blob securely
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Create FormData
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');

    // Send to backend
    const response = await axios.post('/api/classifications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error classifying waste:', error);
    throw new Error(error.response?.data?.error || 'Gagal memproses gambar. Silakan coba lagi.');
  }
};

/**
 * Compatibility export for existing code
 */
export const mockClassifyWaste = classifyWaste;

