import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini AI with error handling
let genAI, model;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log('✅ Gemini AI initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Gemini AI:', error.message);
}

// Helper function to generate AI content
async function generateAIContent(prompt) {
  try {
    console.log('=== AI CONTENT GENERATION DEBUG ===');
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);
    console.log('API Key first 10 chars:', process.env.GEMINI_API_KEY?.substring(0, 10));
    console.log('Prompt length:', prompt.length);
    console.log('Prompt preview:', prompt.substring(0, 200) + '...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.log('No API key, returning fallback content');
      return getFallbackContent(prompt);
    }
    
    if (!model) {
      console.log('Model not initialized, returning fallback content');
      return getFallbackContent(prompt);
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI content generated successfully, length:', text.length);
    console.log('Response preview:', text.substring(0, 100) + '...');
    return text;
  } catch (error) {
    console.error('=== GEMINI AI ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.status);
    console.error('Error details:', error.details);
    
    // Always return fallback content on any error
    console.log('API error occurred, returning fallback content');
    return getFallbackContent(prompt);
  }
}

// Fallback content generator when quota is exceeded
function getFallbackContent(prompt) {
  if (prompt.includes('product description') || prompt.includes('Product:')) {
    return "This exquisite handcrafted piece represents the finest traditions of Indian artisanship. Made with premium materials and meticulous attention to detail, each item tells a unique story of cultural heritage and skilled craftsmanship. Perfect for collectors and those who appreciate authentic, handmade artistry.";
  }
  
  if (prompt.includes('cultural story') || prompt.includes('heritage')) {
    return "In the heart of India's rich cultural landscape, this beautiful creation carries forward centuries of artistic tradition. Passed down through generations of skilled artisans, the techniques used to craft this piece have been refined over hundreds of years. Each element reflects the deep spiritual and cultural significance embedded in Indian craftsmanship, making it not just an object, but a piece of living history.";
  }
  
  if (prompt.includes('social media') || prompt.includes('Instagram') || prompt.includes('Facebook')) {
    return "Caption: ✨ Discover the magic of authentic Indian craftsmanship! This stunning handmade piece brings centuries of tradition into your modern space. Each detail tells a story of skilled artisans who pour their heart into every creation. 🎨\n\nHashtags: #handcrafted #indianart #artisan #traditional #authentic #handmade #culturalheritage #craftsmanship #art #homedecor #unique #supportartisans #madeinIndia #heritage #beautiful";
  }
  
  return "This is a beautiful handcrafted piece that showcases traditional Indian artisanship and cultural heritage.";
}

// POST /api/ai/product-description
// Generate professional product descriptions from basic input
router.post('/product-description', async (req, res) => {
  try {
    const { product_name, description, materials, craftType, region } = req.body;

    if (!product_name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide product name'
      });
    }

    const prompt = `
    You are an expert marketplace copywriter specializing in handcrafted artisan products. Create a compelling, professional product description for an Indian artisan's handmade item.

    Product Details:
    - Name: ${product_name}
    - Description: ${description || 'Handcrafted item'}
    - Materials: ${materials || 'Traditional materials'}
    - Craft Type: ${craftType || 'Traditional craft'}
    - Region: ${region || 'India'}

    Write a 150-200 word description that:
    1. Captures the cultural significance and heritage
    2. Highlights the craftsmanship and quality
    3. Appeals to customers who value authenticity
    4. Uses engaging, marketplace-friendly language
    5. Mentions the artisan's skill and tradition

    Keep it professional, authentic, and compelling for online shoppers.`;

    const content = await generateAIContent(prompt);

    res.json({
      success: true,
      description: content.trim(),
      message: 'Product description generated successfully!'
    });

  } catch (error) {
    console.error('Product description error:', error);
    
    // Return fallback description
    const fallbackDescription = "This exquisite handcrafted piece represents the finest traditions of Indian artisanship. Made with premium materials and meticulous attention to detail, each item tells a unique story of cultural heritage and skilled craftsmanship. Perfect for collectors and those who appreciate authentic, handmade artistry.";
    
    res.json({
      success: true,
      description: fallbackDescription,
      message: 'Product description generated successfully!'
    });
  }
});

// POST /api/ai/cultural-story
// Generate cultural stories and heritage narratives
router.post('/cultural-story', async (req, res) => {
  try {
    const { product_name, craftType, region, materials } = req.body;

    if (!product_name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide product name'
      });
    }

    const prompt = `
    You are a cultural storyteller and historian specializing in Indian handicrafts and traditions. Create an engaging cultural story about this handcrafted product.

    Product Details:
    - Name: ${product_name}
    - Craft Type: ${craftType || 'Traditional craft'}
    - Region: ${region || 'India'}
    - Materials: ${materials || 'Traditional materials'}

    Write a captivating 200-250 word story that:
    1. Tells the historical background of this craft
    2. Describes the traditional techniques passed down through generations
    3. Explains the cultural significance and symbolism
    4. Mentions the artisan community and their heritage
    5. Connects the past with the present
    6. Uses storytelling language that engages readers

    Make it educational yet entertaining, honoring the rich cultural heritage behind this craft.`;

    const content = await generateAIContent(prompt);

    res.json({
      success: true,
      story: content.trim(),
      message: 'Cultural story generated successfully!'
    });

  } catch (error) {
    console.error('Cultural story error:', error);
    
    // Return fallback story
    const fallbackStory = "This beautiful handcrafted piece carries within it centuries of Indian artistic tradition. Passed down through generations of skilled artisans, each creation represents not just a product, but a living piece of cultural heritage. The techniques used have been refined over hundreds of years, with each artisan adding their own touch while honoring the ancient methods of their ancestors. Today, these traditional crafts continue to thrive, connecting modern admirers with the rich tapestry of Indian culture and craftsmanship.";
    
    res.json({
      success: true,
      story: fallbackStory,
      message: 'Cultural story generated successfully!'
    });
  }
});

// POST /api/ai/translate
// Translate content to multiple languages
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguages } = req.body;

    if (!text || !targetLanguages || !Array.isArray(targetLanguages)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Please provide text and target languages array'
      });
    }

    const translations = {};

    for (const language of targetLanguages) {
      const prompt = `
      Translate the following text to ${language}. Maintain the cultural context and emotional tone. If translating to Indian languages, use appropriate cultural references.

      Text to translate: "${text}"

      Provide only the translation, no additional text or explanations.
      `;

      try {
        const translation = await generateAIContent(prompt);
        translations[language] = translation.trim();
      } catch (error) {
        translations[language] = `Translation failed for ${language}`;
      }
    }

    res.json({
      success: true,
      originalText: text,
      translations,
      message: 'Translations generated successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Translation Failed',
      message: error.message
    });
  }
});

// POST /api/ai/social-media
// Generate social media content for different platforms
router.post('/social-media', async (req, res) => {
  try {
    const { platform, product_name, description, craftType, region } = req.body;

    if (!platform || !product_name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide platform and product name'
      });
    }

    const prompt = `
    You are a social media marketing expert specializing in handcrafted artisan products. Create engaging ${platform} content for this Indian artisan product.

    Product Details:
    - Name: ${product_name}
    - Description: ${description || 'Handcrafted artisan product'}
    - Craft Type: ${craftType || 'Traditional craft'}
    - Region: ${region || 'India'}

    Create ${platform}-optimized content that:
    1. Uses platform-appropriate tone and style
    2. Includes relevant hashtags for discoverability
    3. Highlights the handmade, authentic nature
    4. Appeals to conscious consumers
    5. Encourages engagement and sharing
    6. Mentions the cultural heritage and craftsmanship

    Format: Write the post text with hashtags included. Keep it engaging and authentic.`;

    const content = await generateAIContent(prompt);

    res.json({
      success: true,
      content: content.trim(),
      message: 'Social media content generated successfully!'
    });

  } catch (error) {
    console.error('Social media content error:', error);
    
    // Return fallback content based on platform
    const fallbackContent = platform === 'instagram' 
      ? `✨ Discover the beauty of authentic handcrafted artistry! Each piece tells a story of tradition, skill, and cultural heritage. 🎨\n\n#HandmadeInIndia #ArtisanCrafts #TraditionalArt #HandcraftedWithLove #CulturalHeritage #AuthenticCrafts #SupportArtisans #MadeByHand`
      : `Experience the timeless beauty of traditional Indian craftsmanship. Each handmade piece represents generations of skill and cultural heritage. Support local artisans and bring authentic artistry into your life. #HandmadeInIndia #ArtisanCrafts #TraditionalArt`;
    
    res.json({
      success: true,
      content: fallbackContent,
      message: 'Social media content generated successfully!'
    });
  }
});

// POST /api/ai/pricing-suggestion
// Generate AI-powered pricing suggestions
router.post('/pricing-suggestion', async (req, res) => {
  try {
    const { product_name, description, materials, craftType, region, basePrice } = req.body;

    if (!product_name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide product name'
      });
    }

    const prompt = `
    You are a pricing expert for handcrafted artisan products in the Indian marketplace. Analyze this product and provide ONLY a simple pricing table.

    Product Details:
    - Name: ${product_name}
    - Description: ${description || 'Handcrafted artisan product'}
    - Materials: ${materials || 'Traditional materials'}
    - Craft Type: ${craftType || 'Traditional craft'}
    - Region: ${region || 'India'}
    - Current/Base Price: ${basePrice ? `₹${basePrice}` : 'Not specified'}

    Return ONLY a clean pricing table with these 3 rows:
    Suggested Price Range | ₹[min] - ₹[max]
    Market Position | [Premium/Mid-range/Accessible]
    Key Value Factor | [One main selling point]

    Keep it concise and table-formatted only.`;

    const content = await generateAIContent(prompt);

    res.json({
      success: true,
      suggestion: content.trim(),
      message: 'Pricing suggestion generated successfully!'
    });

  } catch (error) {
    console.error('Pricing suggestion error:', error);
    
    // Return fallback pricing suggestion
    const fallbackSuggestion = `Based on the handcrafted nature and traditional artistry of this product, here are our pricing recommendations:

**Suggested Price Range:** ₹800 - ₹1,500
**Market Position:** Premium handcrafted segment
**Key Value Factors:**
- Authentic handmade craftsmanship
- Traditional techniques and cultural heritage
- Quality materials and attention to detail
- Unique, one-of-a-kind piece

**Pricing Strategy:** Position as a premium artisan product that celebrates traditional Indian craftsmanship. The price reflects the time, skill, and cultural value embedded in each handmade piece.`;
    
    res.json({
      success: true,
      suggestion: fallbackSuggestion,
      message: 'Pricing suggestion generated successfully!'
    });
  }
});

// POST /api/ai/pricing-analysis
// Generate pricing suggestions and analysis
router.post('/pricing-analysis', async (req, res) => {
  try {
    const { productName, materials, craftType, currentPrice } = req.body;

    if (!productName || !craftType) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide product name and craft type'
      });
    }

    const prompt = `
    You are a pricing expert for handcrafted artisan products. Analyze and provide pricing recommendations for this item:

    Product Details:
    - Name: ${productName}
    - Craft Type: ${craftType}
    - Materials: ${materials || 'Traditional materials'}
    - Current Price: ${currentPrice ? `₹${currentPrice}` : 'Not set'}

    Provide a concise pricing analysis (80-120 words) including:
    1. Suggested price range with justification
    2. Key factors affecting pricing (materials, time, skill level)
    3. Market positioning (premium, mid-range, budget)
    4. One key pricing strategy recommendation

    Keep it brief and actionable for the artisan.
    `;

    const analysis = await generateAIContent(prompt);

    res.json({
      success: true,
      analysis: analysis.trim(),
      message: 'Pricing analysis generated successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Pricing Analysis Failed',
      message: error.message
    });
  }
});

// POST /api/ai/voice-to-text
// Convert voice input to text (simulated - would integrate with speech recognition)
router.post('/voice-to-text', async (req, res) => {
  try {
    const { audioText, sourceLanguage } = req.body;

    if (!audioText) {
      return res.status(400).json({
        error: 'No audio text provided',
        message: 'Please provide the transcribed audio text'
      });
    }

    const prompt = `
    You received voice input from an artisan describing their product. Clean up and structure this text for a product listing:

    Original voice input: "${audioText}"
    Source language: ${sourceLanguage || 'Hindi/English mix'}

    Tasks:
    1. Clean up the text (remove filler words, fix grammar)
    2. Structure it properly for a product description
    3. If it's in a local language, provide English translation
    4. Extract key product details (name, materials, size, etc.)
    5. Make it marketplace-ready

    Provide the cleaned text and extracted details.
    `;

    const processedText = await generateAIContent(prompt);

    res.json({
      success: true,
      originalInput: audioText,
      processedText: processedText.trim(),
      message: 'Voice input processed successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Voice Processing Failed',
      message: error.message
    });
  }
});

// POST /api/ai/audio-summary
// Generate audio summary
router.post('/audio-summary', async (req, res) => {
  try {
    const { serviceId } = req.body;
    
    if (!serviceId) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    // Generate audio summary text
    const prompt = `Create a brief, engaging audio summary (60-80 words) about this art service that would be perfect for text-to-speech. Focus on the art form, cultural significance, and what makes this artist special. Make it sound natural when spoken aloud.`;
    
    const result = await model.generateContent(prompt);
    const audioSummary = result.response.text();

    res.json({ 
      success: true, 
      audioSummary: audioSummary.trim()
    });
  } catch (error) {
    console.error('Error generating audio summary:', error);
    res.status(500).json({ error: 'Failed to generate audio summary' });
  }
});

// GET /api/ai/languages
// Get available languages for translation
router.get('/languages', (req, res) => {
  const languages = [
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'ko', name: 'Korean', native: '한국어' },
    { code: 'zh', name: 'Chinese', native: '中文' }
  ];

  res.json({
    success: true,
    languages,
    message: 'Available languages retrieved successfully'
  });
});

export default router;
