import express from 'express';
import ttsService from '../services/tts.js';

const router = express.Router();

// POST /api/voice/generate
// Generate speech audio from text
router.post('/generate', async (req, res) => {
  try {
    const { text, language = 'en-US', voiceName, gender } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Missing text',
        message: 'Please provide text to convert to speech'
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'Text too long',
        message: 'Please provide text shorter than 5000 characters'
      });
    }

    const result = await ttsService.generateSpeech(text, {
      languageCode: language,
      voiceName,
      gender
    });

    res.json({
      success: true,
      ...result,
      message: 'Speech audio generated successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Speech generation failed',
      message: error.message
    });
  }
});

// POST /api/voice/generate-multilingual
// Generate speech in multiple languages
router.post('/generate-multilingual', async (req, res) => {
  try {
    const { text, languages = ['en-US', 'hi-IN'] } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Missing text',
        message: 'Please provide text to convert to speech'
      });
    }

    if (!Array.isArray(languages) || languages.length === 0) {
      return res.status(400).json({
        error: 'Invalid languages',
        message: 'Please provide an array of language codes'
      });
    }

    const result = await ttsService.generateMultilingualSpeech(text, languages);

    res.json({
      success: true,
      ...result,
      message: 'Multilingual speech generated successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Multilingual speech generation failed',
      message: error.message
    });
  }
});

// POST /api/voice/story-narration
// Generate voice narration for cultural stories
router.post('/story-narration', async (req, res) => {
  try {
    const { story, productId, artisanName, language = 'en-US' } = req.body;

    if (!story) {
      return res.status(400).json({
        error: 'Missing story',
        message: 'Please provide a story to narrate'
      });
    }

    // Create a more engaging narration format
    const narrativeText = `
      Welcome to the story of ${artisanName || 'our skilled artisan'}. 
      ${story}
      Thank you for listening to this cultural journey. 
      We hope this story connects you to the rich heritage behind this beautiful handcrafted piece.
    `;

    const result = await ttsService.generateSpeech(narrativeText.trim(), {
      languageCode: language,
      gender: 'FEMALE' // Use female voice for storytelling
    });

    // If productId is provided, we could save this audio URL to the product
    if (productId && result.success) {
      // This would update the product with the audio URL
      // For now, we'll just include it in the response
      result.productId = productId;
    }

    res.json({
      success: true,
      ...result,
      narrativeType: 'cultural-story',
      message: 'Story narration generated successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Story narration failed',
      message: error.message
    });
  }
});

// POST /api/voice/product-description
// Generate voice narration for product descriptions
router.post('/product-description', async (req, res) => {
  try {
    const { description, productName, language = 'en-US' } = req.body;

    if (!description) {
      return res.status(400).json({
        error: 'Missing description',
        message: 'Please provide a product description to narrate'
      });
    }

    // Create engaging product narration
    const narrativeText = `
      Discover ${productName || 'this beautiful handcrafted piece'}. 
      ${description}
      Experience the authentic craftsmanship and cultural heritage in every detail.
    `;

    const result = await ttsService.generateSpeech(narrativeText.trim(), {
      languageCode: language,
      gender: 'NEUTRAL'
    });

    res.json({
      success: true,
      ...result,
      narrativeType: 'product-description',
      message: 'Product description narration generated successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Product narration failed',
      message: error.message
    });
  }
});

// GET /api/voice/languages
// Get supported languages for TTS
router.get('/languages', (req, res) => {
  try {
    const languages = ttsService.getSupportedLanguages();

    res.json({
      success: true,
      languages,
      totalLanguages: languages.length,
      message: 'Supported languages retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch languages',
      message: error.message
    });
  }
});

// GET /api/voice/audio-files
// List all generated audio files
router.get('/audio-files', async (req, res) => {
  try {
    const result = await ttsService.listAudioFiles();

    res.json({
      success: true,
      ...result,
      message: 'Audio files retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to list audio files',
      message: error.message
    });
  }
});

// DELETE /api/voice/audio/:filename
// Delete specific audio file
router.delete('/audio/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        error: 'Missing filename',
        message: 'Please specify the audio filename to delete'
      });
    }

    const result = await ttsService.deleteAudio(filename);

    res.json({
      success: true,
      ...result,
      message: 'Audio file deleted successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete audio file',
      message: error.message
    });
  }
});

export default router;
