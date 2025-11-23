const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');
const { HfInference } = require('@huggingface/inference');

dotenv.config();

/**
 * AI Service - Handles calls to Hugging Face API
 */
class AIService {
  constructor() {
    this.huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;
    
    // Initialize Hugging Face client
    if (this.huggingfaceApiKey) {
      this.hf = new HfInference(this.huggingfaceApiKey);
    }
  }

  /**
   * Process image using specified AI provider
   * @param {string} imagePath - Path to the uploaded image
   * @param {string} prompt - Text prompt for image editing
   * @returns {Promise<Object>} - Processed image result
   */
  async processImage(imagePath, prompt) {
    return await this.processWithHuggingFace(imagePath, prompt);
  }

  /**
   * Process image using Hugging Face API
   * Uses multiple Stable Diffusion models with fallback
   */
  async processWithHuggingFace(imagePath, prompt) {
    if (!this.huggingfaceApiKey || !this.hf) {
      throw new Error('Hugging Face API key is not configured');
    }

    try {
      console.log('Processing with Hugging Face...');

      // Enhance prompt with context
      const enhancedPrompt = `${prompt}, high quality, detailed`;

      // Try multiple models in order of availability
      const models = [
        'runwayml/stable-diffusion-v1-5',
        'stabilityai/stable-diffusion-xl-base-1.0',
        'dreamlike-art/dreamlike-photoreal-2.0'
      ];

      for (const model of models) {
        try {
          console.log(`Trying model: ${model}`);
          const blob = await this.hf.textToImage({
            model: model,
            inputs: enhancedPrompt,
          });

          // Convert blob to base64
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const imageUrl = `data:image/jpeg;base64,${base64}`;

          console.log(`Successfully generated with ${model}`);

          return {
            provider: 'huggingface',
            imageUrl: imageUrl,
            prompt: enhancedPrompt
          };
        } catch (modelError) {
          console.log(`Model ${model} failed, trying next...`);
          continue;
        }
      }

      throw new Error('All Hugging Face models failed');
    } catch (error) {
      console.error('Hugging Face API error:', error);
      throw new Error(`Hugging Face processing failed: ${error.message}`);
    }
  }

  /**
   * Get MIME type from file extension
   */
  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }
}

module.exports = new AIService();
