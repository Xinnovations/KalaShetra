import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Path to artisans data file
const artisansFilePath = path.join(__dirname, '..', 'data', 'artisans.json');

// Helper function to read artisans from file
async function readArtisans() {
  try {
    await fs.ensureFile(artisansFilePath);
    const data = await fs.readFile(artisansFilePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading artisans:', error);
    return [];
  }
}

// Helper function to write artisans to file
async function writeArtisans(artisans) {
  try {
    await fs.ensureDir(path.dirname(artisansFilePath));
    await fs.writeFile(artisansFilePath, JSON.stringify(artisans, null, 2));
  } catch (error) {
    console.error('Error writing artisans:', error);
    throw new Error('Failed to save artisan data');
  }
}

// GET /api/artisans
// Get all artisans with optional filtering
router.get('/', async (req, res) => {
  try {
    const artisans = await readArtisans();
    let filteredArtisans = [...artisans];

    const { search, region, craftType, limit = 20, offset = 0 } = req.query;

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredArtisans = filteredArtisans.filter(artisan =>
        artisan.name.toLowerCase().includes(searchTerm) ||
        artisan.craftSpecialty.toLowerCase().includes(searchTerm) ||
        artisan.region.toLowerCase().includes(searchTerm) ||
        artisan.bio.toLowerCase().includes(searchTerm)
      );
    }

    if (region) {
      filteredArtisans = filteredArtisans.filter(artisan => 
        artisan.region.toLowerCase().includes(region.toLowerCase())
      );
    }

    if (craftType) {
      filteredArtisans = filteredArtisans.filter(artisan => 
        artisan.craftSpecialty.toLowerCase().includes(craftType.toLowerCase())
      );
    }

    // Sort by creation date (newest first)
    filteredArtisans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedArtisans = filteredArtisans.slice(startIndex, endIndex);

    res.json({
      success: true,
      artisans: paginatedArtisans,
      pagination: {
        total: filteredArtisans.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: endIndex < filteredArtisans.length
      },
      message: `Found ${filteredArtisans.length} artisans`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch artisans',
      message: error.message
    });
  }
});

// GET /api/artisans/:id
// Get single artisan by ID
router.get('/:id', async (req, res) => {
  try {
    const artisans = await readArtisans();
    const artisan = artisans.find(a => a.id === req.params.id);

    if (!artisan) {
      return res.status(404).json({
        error: 'Artisan not found',
        message: 'The requested artisan profile does not exist'
      });
    }

    // Increment profile views
    artisan.profileViews = (artisan.profileViews || 0) + 1;
    await writeArtisans(artisans);

    res.json({
      success: true,
      artisan,
      message: 'Artisan profile retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch artisan',
      message: error.message
    });
  }
});

// POST /api/artisans
// Create new artisan profile
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bio,
      craftSpecialty,
      region,
      yearsOfExperience,
      profileImage,
      socialLinks,
      languages
    } = req.body;

    // Validation
    if (!name || !craftSpecialty || !region) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide name, craft specialty, and region'
      });
    }

    const artisans = await readArtisans();
    
    const newArtisan = {
      id: uuidv4(),
      name: name.trim(),
      email: email || '',
      phone: phone || '',
      bio: bio || '',
      craftSpecialty: craftSpecialty.trim(),
      region: region.trim(),
      yearsOfExperience: parseInt(yearsOfExperience) || 0,
      profileImage: profileImage || '',
      socialLinks: socialLinks || {},
      languages: languages || ['Hindi', 'English'],
      profileViews: 0,
      totalProducts: 0,
      totalSales: 0,
      rating: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    artisans.push(newArtisan);
    await writeArtisans(artisans);

    res.status(201).json({
      success: true,
      artisan: newArtisan,
      message: 'Artisan profile created successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to create artisan profile',
      message: error.message
    });
  }
});

// PUT /api/artisans/:id
// Update existing artisan profile
router.put('/:id', async (req, res) => {
  try {
    const artisans = await readArtisans();
    const artisanIndex = artisans.findIndex(a => a.id === req.params.id);

    if (artisanIndex === -1) {
      return res.status(404).json({
        error: 'Artisan not found',
        message: 'The artisan profile you want to update does not exist'
      });
    }

    const existingArtisan = artisans[artisanIndex];
    const updatedArtisan = {
      ...existingArtisan,
      ...req.body,
      id: existingArtisan.id, // Preserve ID
      createdAt: existingArtisan.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };

    artisans[artisanIndex] = updatedArtisan;
    await writeArtisans(artisans);

    res.json({
      success: true,
      artisan: updatedArtisan,
      message: 'Artisan profile updated successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to update artisan profile',
      message: error.message
    });
  }
});

// DELETE /api/artisans/:id
// Delete artisan profile
router.delete('/:id', async (req, res) => {
  try {
    const artisans = await readArtisans();
    const artisanIndex = artisans.findIndex(a => a.id === req.params.id);

    if (artisanIndex === -1) {
      return res.status(404).json({
        error: 'Artisan not found',
        message: 'The artisan profile you want to delete does not exist'
      });
    }

    const deletedArtisan = artisans.splice(artisanIndex, 1)[0];
    await writeArtisans(artisans);

    res.json({
      success: true,
      artisan: deletedArtisan,
      message: 'Artisan profile deleted successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete artisan profile',
      message: error.message
    });
  }
});

// GET /api/artisans/:id/analytics
// Get artisan analytics and statistics
router.get('/:id/analytics', async (req, res) => {
  try {
    const artisans = await readArtisans();
    const artisan = artisans.find(a => a.id === req.params.id);

    if (!artisan) {
      return res.status(404).json({
        error: 'Artisan not found',
        message: 'The artisan profile does not exist'
      });
    }

    // Read products to get artisan-specific analytics
    const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
    let products = [];
    try {
      const data = await fs.readFile(productsFilePath, 'utf8');
      products = data ? JSON.parse(data) : [];
    } catch (error) {
      console.log('No products file found');
    }

    const artisanProducts = products.filter(p => p.artisanId === req.params.id);
    
    const analytics = {
      profileViews: artisan.profileViews || 0,
      totalProducts: artisanProducts.length,
      totalViews: artisanProducts.reduce((sum, p) => sum + (p.views || 0), 0),
      totalLikes: artisanProducts.reduce((sum, p) => sum + (p.likes || 0), 0),
      totalShares: artisanProducts.reduce((sum, p) => sum + (p.shares || 0), 0),
      averageRating: artisan.rating || 0,
      totalReviews: artisan.reviews ? artisan.reviews.length : 0,
      recentProducts: artisanProducts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          views: p.views || 0,
          likes: p.likes || 0,
          createdAt: p.createdAt
        })),
      monthlyStats: {
        // This would be calculated based on actual data
        // For now, providing sample structure
        currentMonth: {
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 100) + 10,
          shares: Math.floor(Math.random() * 50) + 5
        },
        lastMonth: {
          views: Math.floor(Math.random() * 800) + 80,
          likes: Math.floor(Math.random() * 80) + 8,
          shares: Math.floor(Math.random() * 40) + 4
        }
      }
    };

    res.json({
      success: true,
      analytics,
      message: 'Analytics retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// POST /api/artisans/:id/review
// Add review for artisan
router.post('/:id/review', async (req, res) => {
  try {
    const { rating, comment, reviewerName } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Invalid rating',
        message: 'Please provide a rating between 1 and 5'
      });
    }

    const artisans = await readArtisans();
    const artisan = artisans.find(a => a.id === req.params.id);

    if (!artisan) {
      return res.status(404).json({
        error: 'Artisan not found',
        message: 'The artisan profile does not exist'
      });
    }

    const newReview = {
      id: uuidv4(),
      rating: parseInt(rating),
      comment: comment || '',
      reviewerName: reviewerName || 'Anonymous',
      createdAt: new Date().toISOString()
    };

    if (!artisan.reviews) {
      artisan.reviews = [];
    }

    artisan.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = artisan.reviews.reduce((sum, r) => sum + r.rating, 0);
    artisan.rating = totalRating / artisan.reviews.length;

    await writeArtisans(artisans);

    res.json({
      success: true,
      review: newReview,
      newRating: artisan.rating,
      message: 'Review added successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to add review',
      message: error.message
    });
  }
});

// GET /api/artisans/regions/list
// Get all available regions
router.get('/regions/list', async (req, res) => {
  try {
    const artisans = await readArtisans();
    const regions = [...new Set(artisans.map(a => a.region))].filter(Boolean);

    res.json({
      success: true,
      regions,
      message: 'Regions retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch regions',
      message: error.message
    });
  }
});

// GET /api/artisans/specialties/list
// Get all available craft specialties
router.get('/specialties/list', async (req, res) => {
  try {
    const artisans = await readArtisans();
    const specialties = [...new Set(artisans.map(a => a.craftSpecialty))].filter(Boolean);

    res.json({
      success: true,
      specialties,
      message: 'Craft specialties retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch specialties',
      message: error.message
    });
  }
});

export default router;
