import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');
const videosDir = path.join(__dirname, '..', 'uploads', 'videos');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadType = req.body.uploadType || req.query.uploadType || 'products';
    const uploadPath = uploadType === 'videos' ? videosDir : uploadsDir;
    await fs.ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  // Allow images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 50 * 1024 * 1024, // 50MB for videos
  },
  fileFilter: fileFilter
});

// POST /api/upload/product-image
// Upload product images
router.post('/product-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select an image file to upload'
      });
    }

    const imageUrl = `/uploads/${req.body.uploadType || req.query.uploadType || 'products'}/${req.file.filename}`;
    
    // Optional: Upload to Cloudinary if configured
    let cloudinaryUrl = null;
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        // Cloudinary upload would go here
        // For now, we'll just use local storage
        cloudinaryUrl = imageUrl;
      } catch (cloudinaryError) {
        console.log('Cloudinary upload failed, using local storage:', cloudinaryError.message);
      }
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully!',
      imageUrl: cloudinaryUrl || imageUrl,
      localPath: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message || 'Failed to upload image. Please try again.'
    });
  }
});

// POST /api/upload/multiple-images
// Upload multiple product images
router.post('/multiple-images', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select image files to upload'
      });
    }

    const uploadedImages = req.files.map(file => ({
      imageUrl: `/uploads/${req.body.uploadType || req.query.uploadType || 'products'}/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully!`,
      files: uploadedImages.map(img => ({
        path: img.imageUrl,
        url: img.imageUrl,
        imageUrl: img.imageUrl,
        filename: img.filename,
        originalName: img.originalName,
        size: img.size
      })),
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message || 'Failed to upload images. Please try again.'
    });
  }
});

// POST /api/upload/single
// Single file upload endpoint for both images and videos
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      });
    }

    const uploadType = req.body.uploadType || 'products';
    const imageUrl = `/uploads/${uploadType}/${req.file.filename}`;
    
    // Optional: Upload to Cloudinary if configured
    let cloudinaryUrl = null;
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        // Cloudinary upload would go here
        // For now, we'll just use local storage
        cloudinaryUrl = imageUrl;
      } catch (cloudinaryError) {
        console.log('Cloudinary upload failed, using local storage:', cloudinaryError.message);
      }
    }

    res.json({
      success: true,
      message: 'File uploaded successfully!',
      imageUrl: cloudinaryUrl || imageUrl,
      localPath: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message || 'Failed to upload file. Please try again.'
    });
  }
});

// POST /api/upload/multiple
// Multiple file upload endpoint
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select files to upload'
      });
    }

    const uploadType = req.body.uploadType || 'products';
    const uploadedFiles = req.files.map(file => {
      const imageUrl = `/uploads/${uploadType}/${file.filename}`;
      return {
        imageUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
      };
    });

    res.json({
      success: true,
      message: `${req.files.length} files uploaded successfully!`,
      files: uploadedFiles.map(img => ({
        path: img.imageUrl,
        url: img.imageUrl,
        imageUrl: img.imageUrl,
        filename: img.filename,
        originalName: img.originalName,
        size: img.size
      })),
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message || 'Failed to upload files. Please try again.'
    });
  }
});

// DELETE /api/upload/image/:filename
// Delete uploaded image
router.delete('/image/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        error: 'No filename provided',
        message: 'Please specify the filename to delete'
      });
    }

    const filePath = path.join(__dirname, '..', 'uploads', req.body.uploadType || req.query.uploadType || 'products', filename);
    
    // Check if file exists
    const fileExists = await fs.pathExists(filePath);
    if (!fileExists) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The specified image file does not exist'
      });
    }

    // Delete the file
    await fs.remove(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully!',
      filename: filename
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: error.message || 'Failed to delete image. Please try again.'
    });
  }
});

// GET /api/upload/images
// List all uploaded images
router.get('/images', async (req, res) => {
  try {
    const uploadsPath = path.join(__dirname, '..', 'uploads', req.query.uploadType || 'products');
    
    // Ensure directory exists
    await fs.ensureDir(uploadsPath);
    
    const files = await fs.readdir(uploadsPath);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mkv', '.avi'].includes(ext);
    });

    const images = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(uploadsPath, filename);
        const stats = await fs.stat(filePath);
        
        return {
          filename,
          imageUrl: `/uploads/${req.query.uploadType || 'products'}/${filename}`,
          size: stats.size,
          uploadedAt: stats.birthtime.toISOString()
        };
      })
    );

    // Sort by upload date (newest first)
    images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.json({
      success: true,
      message: `Found ${images.length} images`,
      images,
      totalCount: images.length
    });

  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({
      error: 'Failed to list images',
      message: error.message || 'Could not retrieve image list. Please try again.'
    });
  }
});

export default router;
