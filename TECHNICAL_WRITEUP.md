# Technical Write-up (200 words max)

## AI Models Used
I integrated **Hugging Face's Stable Diffusion models** for natural-language image generation with a 3-model fallback system (runwayml/stable-diffusion-v1-5, stabilityai/stable-diffusion-xl-base-1.0, dreamlike-art/dreamlike-photoreal-2.0).

## Why These Models?
**Hugging Face**: Chosen for free access, reliability, and official SDK support. The multi-model fallback ensures availability if one model is unavailable. Uses text-to-image generation capable of creating variations based on natural language prompts.

## How AI is Used
Users upload an image and provide natural language instructions (e.g., "cartoon boy wearing red hoodie with mountains"). The app:
1. Uploads image to backend via multer
2. Processes prompt through Hugging Face Inference API
3. Generates new image based on text description
4. Returns generated image URL
5. Displays result in frontend

## Architecture
**Frontend**: React + Vite for fast development, Axios for API calls, responsive CSS
**Backend**: Express.js with multer for file uploads, CORS for cross-origin requests
**Services**: Modular architecture - `aiService.js` handles AI providers, `fileService.js` manages cleanup
**Deployment**: Backend on Render, Frontend on Vercel

Clean separation of concerns enables easy model swapping and maintenance.

---
**Word Count**: ~175 words
