import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Cloud TTS (optional - requires service account)
let textToSpeech = null;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const { TextToSpeechClient } = await import('@google-cloud/text-to-speech');
    textToSpeech = new TextToSpeechClient();
  }
} catch (error) {
  console.log('Google Cloud TTS not available, using fallback method');
}

class TTSService {
  constructor() {
    this.audioDir = path.join(__dirname, '..', 'audio');
    this.ensureAudioDir();
  }

  async ensureAudioDir() {
    await fs.ensureDir(this.audioDir);
  }

  // Generate speech from text using Google Cloud TTS
  async generateSpeech(text, options = {}) {
    const {
      languageCode = 'en-US',
      voiceName = null,
      gender = 'NEUTRAL',
      audioEncoding = 'MP3'
    } = options;

    try {
      if (textToSpeech) {
        return await this.generateWithGoogleTTS(text, {
          languageCode,
          voiceName,
          gender,
          audioEncoding
        });
      } else {
        return await this.generateFallbackAudio(text, options);
      }
    } catch (error) {
      console.error('TTS Generation Error:', error);
      throw new Error('Failed to generate speech audio');
    }
  }

  // Google Cloud TTS implementation
  async generateWithGoogleTTS(text, options) {
    const request = {
      input: { text },
      voice: {
        languageCode: options.languageCode,
        name: options.voiceName,
        ssmlGender: options.gender
      },
      audioConfig: {
        audioEncoding: options.audioEncoding,
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0
      }
    };

    const [response] = await textToSpeech.synthesizeSpeech(request);
    const audioContent = response.audioBuffer;

    // Save audio file
    const filename = `${uuidv4()}-${Date.now()}.mp3`;
    const filePath = path.join(this.audioDir, filename);
    
    await fs.writeFile(filePath, audioContent);

    return {
      success: true,
      audioUrl: `/audio/${filename}`,
      filename,
      filePath,
      method: 'google-cloud-tts',
      language: options.languageCode,
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      createdAt: new Date().toISOString()
    };
  }

  // Fallback method - creates a placeholder audio file with metadata
  async generateFallbackAudio(text, options) {
    const filename = `fallback-${uuidv4()}-${Date.now()}.json`;
    const filePath = path.join(this.audioDir, filename);

    const audioMetadata = {
      type: 'fallback-audio',
      text,
      language: options.languageCode || 'en-US',
      voice: options.voiceName || 'default',
      instructions: 'This is a fallback audio file. In production, this would be actual speech audio.',
      message: 'To enable real TTS, configure Google Cloud credentials.',
      createdAt: new Date().toISOString()
    };

    await fs.writeFile(filePath, JSON.stringify(audioMetadata, null, 2));

    return {
      success: true,
      audioUrl: `/audio/${filename}`,
      filename,
      filePath,
      method: 'fallback',
      language: options.languageCode || 'en-US',
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      createdAt: new Date().toISOString(),
      note: 'Fallback mode - configure Google Cloud TTS for actual audio'
    };
  }

  // Generate speech for multiple languages
  async generateMultilingualSpeech(text, languages = ['en-US', 'hi-IN']) {
    const results = {};

    for (const lang of languages) {
      try {
        const voiceOptions = this.getVoiceOptions(lang);
        const result = await this.generateSpeech(text, {
          languageCode: lang,
          ...voiceOptions
        });
        results[lang] = result;
      } catch (error) {
        console.error(`Failed to generate speech for ${lang}:`, error);
        results[lang] = {
          success: false,
          error: error.message,
          language: lang
        };
      }
    }

    return {
      success: true,
      results,
      totalLanguages: languages.length,
      successfulLanguages: Object.values(results).filter(r => r.success).length
    };
  }

  // Get appropriate voice options for different languages
  getVoiceOptions(languageCode) {
    const voiceMap = {
      'en-US': { voiceName: 'en-US-Wavenet-D', gender: 'MALE' },
      'en-GB': { voiceName: 'en-GB-Wavenet-A', gender: 'FEMALE' },
      'hi-IN': { voiceName: 'hi-IN-Wavenet-A', gender: 'FEMALE' },
      'ta-IN': { voiceName: 'ta-IN-Wavenet-A', gender: 'FEMALE' },
      'te-IN': { voiceName: 'te-IN-Standard-A', gender: 'FEMALE' },
      'bn-IN': { voiceName: 'bn-IN-Wavenet-A', gender: 'FEMALE' },
      'mr-IN': { voiceName: 'mr-IN-Wavenet-A', gender: 'FEMALE' },
      'gu-IN': { voiceName: 'gu-IN-Wavenet-A', gender: 'FEMALE' },
      'kn-IN': { voiceName: 'kn-IN-Wavenet-A', gender: 'FEMALE' },
      'ml-IN': { voiceName: 'ml-IN-Wavenet-A', gender: 'FEMALE' },
      'pa-IN': { voiceName: 'pa-IN-Wavenet-A', gender: 'FEMALE' },
      'fr-FR': { voiceName: 'fr-FR-Wavenet-A', gender: 'FEMALE' },
      'es-ES': { voiceName: 'es-ES-Wavenet-A', gender: 'FEMALE' },
      'de-DE': { voiceName: 'de-DE-Wavenet-A', gender: 'FEMALE' },
      'ja-JP': { voiceName: 'ja-JP-Wavenet-A', gender: 'FEMALE' },
      'ko-KR': { voiceName: 'ko-KR-Wavenet-A', gender: 'FEMALE' },
      'zh-CN': { voiceName: 'zh-CN-Wavenet-A', gender: 'FEMALE' }
    };

    return voiceMap[languageCode] || { gender: 'NEUTRAL' };
  }

  // Delete audio file
  async deleteAudio(filename) {
    try {
      const filePath = path.join(this.audioDir, filename);
      const exists = await fs.pathExists(filePath);
      
      if (!exists) {
        throw new Error('Audio file not found');
      }

      await fs.remove(filePath);
      return {
        success: true,
        message: 'Audio file deleted successfully',
        filename
      };
    } catch (error) {
      throw new Error(`Failed to delete audio file: ${error.message}`);
    }
  }

  // List all audio files
  async listAudioFiles() {
    try {
      const files = await fs.readdir(this.audioDir);
      const audioFiles = files.filter(file => 
        file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.json')
      );

      const fileDetails = await Promise.all(
        audioFiles.map(async (filename) => {
          const filePath = path.join(this.audioDir, filename);
          const stats = await fs.stat(filePath);
          
          return {
            filename,
            audioUrl: `/audio/${filename}`,
            size: stats.size,
            createdAt: stats.birthtime.toISOString(),
            type: filename.endsWith('.json') ? 'fallback' : 'audio'
          };
        })
      );

      return {
        success: true,
        files: fileDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        totalFiles: fileDetails.length
      };
    } catch (error) {
      throw new Error(`Failed to list audio files: ${error.message}`);
    }
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      { code: 'en-US', name: 'English (US)', native: 'English' },
      { code: 'en-GB', name: 'English (UK)', native: 'English' },
      { code: 'hi-IN', name: 'Hindi (India)', native: 'हिन्दी' },
      { code: 'ta-IN', name: 'Tamil (India)', native: 'தமிழ்' },
      { code: 'te-IN', name: 'Telugu (India)', native: 'తెలుగు' },
      { code: 'bn-IN', name: 'Bengali (India)', native: 'বাংলা' },
      { code: 'mr-IN', name: 'Marathi (India)', native: 'मराठी' },
      { code: 'gu-IN', name: 'Gujarati (India)', native: 'ગુજરાતી' },
      { code: 'kn-IN', name: 'Kannada (India)', native: 'ಕನ್ನಡ' },
      { code: 'ml-IN', name: 'Malayalam (India)', native: 'മലയാളം' },
      { code: 'pa-IN', name: 'Punjabi (India)', native: 'ਪੰਜਾਬੀ' },
      { code: 'fr-FR', name: 'French', native: 'Français' },
      { code: 'es-ES', name: 'Spanish', native: 'Español' },
      { code: 'de-DE', name: 'German', native: 'Deutsch' },
      { code: 'ja-JP', name: 'Japanese', native: '日本語' },
      { code: 'ko-KR', name: 'Korean', native: '한국어' },
      { code: 'zh-CN', name: 'Chinese', native: '中文' }
    ];
  }
}

export default new TTSService();
