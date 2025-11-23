import axios from 'axios';

const API_URL = 'https://image-changer-delta.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Process image with AI
 * @param {File} imageFile - Image file to process
 * @param {string} prompt - Text prompt for image editing
 * @param {string} provider - AI provider ('huggingface')
 * @returns {Promise<Object>} - API response with processed image
 */
export const processImage = async (imageFile, prompt, provider = 'huggingface') => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('prompt', prompt);
  formData.append('provider', provider);

  const response = await api.post('/edit/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Health check
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
