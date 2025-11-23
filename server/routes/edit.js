const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const aiService = require('../services/aiService');
const fileService = require('../services/fileService');

// Configure multer for file uploads (memory storage for serverless)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// POST /api/edit/process - Process image with AI
router.post('/process', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { prompt, provider = 'huggingface' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Process image with AI service (using buffer for serverless)
    const result = await aiService.processImage(req.file.buffer, prompt, provider);

    res.json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('Error processing image:', error);
    
    res.status(500).json({ 
      error: 'Failed to process image',
      message: error.message 
    });
  }
});

module.exports = router;
