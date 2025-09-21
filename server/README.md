# KalaShetra Backend API

**Generative AI Marketplace Assistant for Local Artisans**

A powerful Node.js backend that empowers artisans with AI-driven tools for product descriptions, cultural storytelling, multilingual translation, and voice narration using Gemini AI and Google Cloud services.

## 🚀 Features

- **AI Product Description Generator** - Transform simple notes into professional marketplace descriptions
- **Cultural Storytelling Assistant** - Create compelling heritage backstories
- **Multilingual Translation** - Translate content to 17+ languages including Indian regional languages
- **Voice Assistant** - Generate audio narrations with Google Cloud TTS
- **Social Media Content Generator** - Create Instagram/Facebook posts and captions
- **AI Pricing Assistant** - Get fair pricing suggestions based on materials and complexity
- **Product & Artisan Management** - Full CRUD operations with search and filtering
- **File Upload System** - Image upload with local storage and Cloudinary support
- **Analytics Dashboard** - Track views, likes, shares, and engagement metrics

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key (provided: `AIzaSyAK3DV1dsCMnCZL2DGwtnsomJr0i9wgiLQ`)
- Optional: Google Cloud service account for TTS

## 🛠️ Installation

1. **Clone and navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
The `.env` file is already configured with your Gemini API key. For production, consider adding:
```bash
# Optional Google Cloud TTS
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Optional Cloudinary for image storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Health Check
```bash
GET /api/health
```

### AI Features

#### Generate Product Description
```bash
POST /api/ai/product-description
Content-Type: application/json

{
  "productName": "Handwoven Bamboo Basket",
  "basicDescription": "Traditional basket made from bamboo",
  "materials": "Natural bamboo, cotton thread",
  "craftType": "Basket weaving",
  "region": "Assam"
}
```

#### Create Cultural Story
```bash
POST /api/ai/cultural-story
Content-Type: application/json

{
  "artisanName": "Kamala Devi",
  "craftType": "Pottery",
  "region": "Rajasthan",
  "tradition": "500-year-old family tradition",
  "personalStory": "Learning from grandmother since childhood"
}
```

#### Multilingual Translation
```bash
POST /api/ai/translate
Content-Type: application/json

{
  "text": "This beautiful handcrafted piece represents generations of skill",
  "targetLanguages": ["Hindi", "Tamil", "French"]
}
```

#### Generate Social Media Content
```bash
POST /api/ai/social-media
Content-Type: application/json

{
  "productName": "Silk Saree",
  "description": "Hand-woven silk saree with traditional motifs",
  "craftType": "Silk weaving",
  "platform": "instagram"
}
```

#### AI Pricing Suggestion
```bash
POST /api/ai/pricing-suggestion
Content-Type: application/json

{
  "productName": "Wooden Sculpture",
  "materials": "Teak wood, natural polish",
  "craftType": "Wood carving",
  "timeToMake": "2 weeks",
  "complexity": "High"
}
```

### Voice Assistant

#### Generate Speech Audio
```bash
POST /api/voice/generate
Content-Type: application/json

{
  "text": "Welcome to our beautiful handcrafted collection",
  "language": "en-US",
  "gender": "FEMALE"
}
```

#### Story Narration
```bash
POST /api/voice/story-narration
Content-Type: application/json

{
  "story": "This pottery tradition has been passed down for five generations...",
  "artisanName": "Kamala Devi",
  "language": "hi-IN"
}
```

### Product Management

#### Get All Products
```bash
GET /api/products?search=basket&category=handicrafts&limit=10
```

#### Create Product
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Handwoven Basket",
  "description": "Beautiful traditional basket",
  "price": 1500,
  "craftType": "Basket weaving",
  "artisanId": "artisan-uuid",
  "materials": "Bamboo, cotton"
}
```

#### Get Single Product
```bash
GET /api/products/:id
```

### Artisan Management

#### Get All Artisans
```bash
GET /api/artisans?region=rajasthan&craftType=pottery
```

#### Create Artisan Profile
```bash
POST /api/artisans
Content-Type: application/json

{
  "name": "Kamala Devi",
  "craftSpecialty": "Pottery",
  "region": "Rajasthan",
  "yearsOfExperience": 25,
  "bio": "Master potter with 25 years of experience"
}
```

#### Get Analytics
```bash
GET /api/artisans/:id/analytics
```

### File Upload

#### Upload Product Image
```bash
POST /api/upload/product-image
Content-Type: multipart/form-data

image: [file]
```

#### Upload Multiple Images
```bash
POST /api/upload/multiple-images
Content-Type: multipart/form-data

images: [file1, file2, file3]
```

## 🌍 Supported Languages

### Indian Languages
- Hindi (हिन्दी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)
- Odia (ଓଡ଼ିଆ)

### International Languages
- English, French, Spanish, German, Japanese, Korean, Chinese

## 📁 Project Structure

```
server/
├── routes/
│   ├── ai.js           # Gemini AI features
│   ├── products.js     # Product management
│   ├── artisans.js     # Artisan profiles
│   ├── upload.js       # File uploads
│   └── voice.js        # TTS voice features
├── services/
│   └── tts.js          # Text-to-Speech service
├── data/               # JSON file storage
├── uploads/            # Uploaded images
├── audio/              # Generated audio files
├── .env               # Environment variables
├── server.js          # Main server file
└── package.json       # Dependencies
```

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 5000)
- `GEMINI_API_KEY` - Your Gemini AI API key
- `MAX_FILE_SIZE` - Maximum upload size (default: 10MB)
- `FRONTEND_URL` - Frontend URL for CORS

### Data Storage
The backend uses JSON files for simplicity:
- `data/products.json` - Product data
- `data/artisans.json` - Artisan profiles
- `uploads/products/` - Product images
- `audio/` - Generated voice files

## 🚦 Usage Examples

### Complete Workflow: Create Product with AI

1. **Upload product image**
```bash
curl -X POST http://localhost:5000/api/upload/product-image \
  -F "image=@basket.jpg"
```

2. **Generate AI description**
```bash
curl -X POST http://localhost:5000/api/ai/product-description \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Bamboo Basket",
    "basicDescription": "Traditional woven basket",
    "craftType": "Basket weaving"
  }'
```

3. **Create cultural story**
```bash
curl -X POST http://localhost:5000/api/ai/cultural-story \
  -H "Content-Type: application/json" \
  -d '{
    "craftType": "Basket weaving",
    "region": "Assam"
  }'
```

4. **Generate voice narration**
```bash
curl -X POST http://localhost:5000/api/voice/story-narration \
  -H "Content-Type: application/json" \
  -d '{
    "story": "Generated cultural story...",
    "language": "en-US"
  }'
```

5. **Create product**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bamboo Basket",
    "description": "Generated AI description...",
    "price": 1200,
    "craftType": "Basket weaving",
    "artisanId": "artisan-id",
    "images": ["/uploads/products/image.jpg"],
    "culturalStory": "Generated story...",
    "audioUrl": "/audio/narration.mp3"
  }'
```

## 🔒 Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- File type validation for uploads
- Input sanitization and validation
- CORS configuration

## 🎯 Frontend Integration

The backend is designed to work seamlessly with your React frontend. Key integration points:

- **Base URL**: `http://localhost:5000/api`
- **Image URLs**: `http://localhost:5000/uploads/products/filename.jpg`
- **Audio URLs**: `http://localhost:5000/audio/filename.mp3`
- **CORS**: Configured for `http://localhost:5173` (Vite default)

## 🐛 Troubleshooting

### Common Issues

1. **Gemini API errors**: Check your API key and quota
2. **File upload fails**: Check file size and type
3. **TTS not working**: Google Cloud credentials not configured (fallback mode active)
4. **CORS errors**: Update `FRONTEND_URL` in `.env`

### Logs
The server provides detailed console logs for debugging. Check terminal output for error details.

## 📈 Performance

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **File Size**: Max 10MB per upload
- **Text Length**: Max 5000 characters for TTS
- **Compression**: Gzip enabled for responses
- **Caching**: Static files cached with appropriate headers

## 🤝 Contributing

This backend is designed to be easily extensible. To add new features:

1. Create new routes in `routes/` directory
2. Add services in `services/` directory  
3. Update `server.js` to include new routes
4. Test with provided API endpoints

## 📄 License

MIT License - Built for KalaShetra: Empowering Artisans with AI

---

**Ready to empower artisans with AI! 🎨✨**

For support or questions about the API, check the console logs or test endpoints using the provided examples.
