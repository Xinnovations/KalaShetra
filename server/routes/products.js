import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Path to products data file
const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

// Helper function to read products from file
async function readProducts() {
  try {
    await fs.ensureFile(productsFilePath);
    const data = await fs.readFile(productsFilePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

// Helper function to write products to file
async function writeProducts(products) {
  try {
    await fs.ensureDir(path.dirname(productsFilePath));
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing products:', error);
    throw new Error('Failed to save product data');
  }
}

// GET /api/products
// Get all products with optional filtering and search
router.get('/', async (req, res) => {
  try {
    const products = await readProducts();
    let filteredProducts = [...products];

    // Search functionality
    const { search, category, region, craftType, minPrice, maxPrice, artisanId, status, limit = 20, offset = 0 } = req.query;

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.craftType.toLowerCase().includes(searchTerm) ||
        product.materials.toLowerCase().includes(searchTerm)
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (region) {
      filteredProducts = filteredProducts.filter(product => 
        product.region.toLowerCase().includes(region.toLowerCase())
      );
    }

    if (craftType) {
      filteredProducts = filteredProducts.filter(product => 
        product.craftType.toLowerCase().includes(craftType.toLowerCase())
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= parseFloat(maxPrice)
      );
    }

    if (artisanId) {
      filteredProducts = filteredProducts.filter(product => 
        product.artisanId === artisanId
      );
    }

    if (status) {
      filteredProducts = filteredProducts.filter(product => 
        product.status === status
      );
    }

    // Sort by creation date (newest first)
    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        total: filteredProducts.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: endIndex < filteredProducts.length
      },
      message: `Found ${filteredProducts.length} products`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// GET /api/products/:id
// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    // Increment view count
    product.views = (product.views || 0) + 1;
    await writeProducts(products);

    res.json({
      success: true,
      product,
      message: 'Product retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// POST /api/products
// Create new product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      materials,
      craftType,
      category,
      region,
      artisanId,
      artisanName,
      images,
      culturalStory,
      translations,
      socialMediaContent,
      audioUrl,
      status
    } = req.body;

    // Validation
    if (!name || !description || !price || !craftType || !artisanId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide name, description, price, craft type, and artisan ID'
      });
    }

    const products = await readProducts();
    
    const newProduct = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      materials: materials || 'Traditional materials',
      craftType: craftType.trim(),
      category: category || 'Handicrafts',
      region: region || 'India',
      artisanId,
      artisanName: artisanName || 'Skilled Artisan',
      images: images || [],
      culturalStory: culturalStory || '',
      translations: translations || {},
      socialMediaContent: socialMediaContent || {},
      audioUrl: audioUrl || null,
      views: 0,
      likes: 0,
      shares: 0,
      status: status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    await writeProducts(products);

    res.status(201).json({
      success: true,
      product: newProduct,
      message: 'Product created successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to create product',
      message: error.message
    });
  }
});

// PUT /api/products/:id
// Update existing product
router.put('/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The product you want to update does not exist'
      });
    }

    const existingProduct = products[productIndex];
    const updatedProduct = {
      ...existingProduct,
      ...req.body,
      id: existingProduct.id, // Preserve ID
      createdAt: existingProduct.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;
    await writeProducts(products);

    res.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// PATCH /api/products/:id
// Partially update existing product
router.patch('/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The product you want to update does not exist'
      });
    }

    const existingProduct = products[productIndex];
    const updatedProduct = {
      ...existingProduct,
      ...req.body,
      id: existingProduct.id, // Preserve ID
      createdAt: existingProduct.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;
    await writeProducts(products);

    res.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// DELETE /api/products/:id
// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The product you want to delete does not exist'
      });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    await writeProducts(products);

    res.json({
      success: true,
      product: deletedProduct,
      message: 'Product deleted successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

// POST /api/products/:id/like
// Like/unlike a product
router.post('/:id/like', async (req, res) => {
  try {
    const products = await readProducts();
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The product does not exist'
      });
    }

    product.likes = (product.likes || 0) + 1;
    await writeProducts(products);

    res.json({
      success: true,
      likes: product.likes,
      message: 'Product liked successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to like product',
      message: error.message
    });
  }
});

// POST /api/products/:id/share
// Track product shares
router.post('/:id/share', async (req, res) => {
  try {
    const products = await readProducts();
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The product does not exist'
      });
    }

    product.shares = (product.shares || 0) + 1;
    await writeProducts(products);

    res.json({
      success: true,
      shares: product.shares,
      message: 'Product share tracked successfully!'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to track share',
      message: error.message
    });
  }
});

// GET /api/products/categories/list
// Get all available categories
router.get('/categories/list', async (req, res) => {
  try {
    const products = await readProducts();
    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

    res.json({
      success: true,
      categories,
      message: 'Categories retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// GET /api/products/crafts/list
// Get all available craft types
router.get('/crafts/list', async (req, res) => {
  try {
    const products = await readProducts();
    const craftTypes = [...new Set(products.map(p => p.craftType))].filter(Boolean);

    res.json({
      success: true,
      craftTypes,
      message: 'Craft types retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch craft types',
      message: error.message
    });
  }
});

export default router;
