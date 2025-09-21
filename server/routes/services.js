import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Path to services data file
const servicesFilePath = path.join(__dirname, '..', 'data', 'services.json');
const bookingsFilePath = path.join(__dirname, '..', 'data', 'bookings.json');

// Helper function to read services from file
async function readServices() {
  try {
    await fs.ensureFile(servicesFilePath);
    const data = await fs.readFile(servicesFilePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading services:', error);
    return [];
  }
}

// Helper function to write services to file
async function writeServices(services) {
  try {
    await fs.ensureDir(path.dirname(servicesFilePath));
    await fs.writeFile(servicesFilePath, JSON.stringify(services, null, 2));
  } catch (error) {
    console.error('Error writing services:', error);
    throw new Error('Failed to save service data');
  }
}

// Helper function to read bookings from file
async function readBookings() {
  try {
    await fs.ensureFile(bookingsFilePath);
    const data = await fs.readFile(bookingsFilePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading bookings:', error);
    return [];
  }
}

// Helper function to write bookings to file
async function writeBookings(bookings) {
  try {
    await fs.ensureDir(path.dirname(bookingsFilePath));
    await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2));
  } catch (error) {
    console.error('Error writing bookings:', error);
    throw new Error('Failed to save booking data');
  }
}

// GET /api/services
// Get all services with optional filtering and search
router.get('/', async (req, res) => {
  try {
    const services = await readServices();
    let filteredServices = [...services];

    // Search functionality
    const { search, category, region, artType, minRate, maxRate, artisanId, status, available, limit = 20, offset = 0 } = req.query;

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredServices = filteredServices.filter(service =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.artisanName.toLowerCase().includes(searchTerm) ||
        service.artType.toLowerCase().includes(searchTerm) ||
        service.specialization.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      filteredServices = filteredServices.filter(service => service.category === category);
    }

    // Filter by art type
    if (artType && artType !== 'all') {
      filteredServices = filteredServices.filter(service => service.artType === artType);
    }

    // Filter by region
    if (region && region !== 'all') {
      filteredServices = filteredServices.filter(service => service.region === region);
    }

    // Filter by rate range
    if (minRate) {
      filteredServices = filteredServices.filter(service => service.hourlyRate >= parseFloat(minRate));
    }
    if (maxRate) {
      filteredServices = filteredServices.filter(service => service.hourlyRate <= parseFloat(maxRate));
    }

    // Filter by artisan
    if (artisanId) {
      filteredServices = filteredServices.filter(service => service.artisanId === artisanId);
    }

    // Filter by status
    if (status) {
      filteredServices = filteredServices.filter(service => service.status === status);
    }

    // Filter by availability
    if (available === 'true') {
      filteredServices = filteredServices.filter(service => service.available === true);
    }

    // Pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    res.json({
      services: paginatedServices,
      total: filteredServices.length,
      page: Math.floor(startIndex / parseInt(limit)) + 1,
      totalPages: Math.ceil(filteredServices.length / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      error: 'Failed to fetch services',
      message: 'We encountered an issue loading the artist services. Please try again.'
    });
  }
});

// POST /api/services
// Create a new service
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      artType,
      category,
      specialization,
      hourlyRate,
      region,
      artisanId,
      artisanName,
      images,
      videos,
      phone,
      instagram,
      facebook,
      whatsapp,
      available = true,
      minBookingHours = 1,
      maxBookingHours = 8
    } = req.body;

    // Validation
    if (!title || !description || !artType || !hourlyRate || !artisanId || !artisanName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide title, description, art type, hourly rate, and artisan information.',
        required: ['title', 'description', 'artType', 'hourlyRate', 'artisanId', 'artisanName']
      });
    }

    const services = await readServices();
    
    const newService = {
      id: uuidv4(),
      title,
      description,
      artType,
      category: category || artType,
      specialization: specialization || '',
      hourlyRate: parseFloat(hourlyRate),
      region: region || '',
      artisanId,
      artisanName,
      images: images || [],
      videos: videos || [],
      phone: phone || '',
      instagram: instagram || '',
      facebook: facebook || '',
      whatsapp: whatsapp || '',
      available,
      minBookingHours: parseInt(minBookingHours),
      maxBookingHours: parseInt(maxBookingHours),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      bookings: 0,
      rating: 0,
      reviews: []
    };

    services.push(newService);
    await writeServices(services);

    res.status(201).json({
      message: 'Service created successfully',
      service: newService
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      error: 'Failed to create service',
      message: 'We encountered an issue creating your service. Please try again.'
    });
  }
});

// GET /api/services/:id
// Get a specific service by ID
router.get('/:id', async (req, res) => {
  try {
    const services = await readServices();
    const service = services.find(s => s.id === req.params.id);

    if (!service) {
      return res.status(404).json({
        error: 'Service not found',
        message: 'The requested service could not be found.'
      });
    }

    // Increment view count
    service.views = (service.views || 0) + 1;
    await writeServices(services);

    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      error: 'Failed to fetch service',
      message: 'We encountered an issue loading the service details.'
    });
  }
});

// PATCH /api/services/:id
// Update a service
router.patch('/:id', async (req, res) => {
  try {
    const services = await readServices();
    const serviceIndex = services.findIndex(s => s.id === req.params.id);

    if (serviceIndex === -1) {
      return res.status(404).json({
        error: 'Service not found',
        message: 'The service you are trying to update could not be found.'
      });
    }

    // Update service with provided fields
    const updatedService = {
      ...services[serviceIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    services[serviceIndex] = updatedService;
    await writeServices(services);

    res.json({
      message: 'Service updated successfully',
      service: updatedService
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      error: 'Failed to update service',
      message: 'We encountered an issue updating your service.'
    });
  }
});

// POST /api/services/:id/book
// Book a service
router.post('/:id/book', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventTime,
      duration,
      eventType,
      venue,
      specialRequests,
      totalAmount
    } = req.body;

    // Validation
    if (!customerName || !customerEmail || !eventDate || !duration) {
      return res.status(400).json({
        error: 'Missing required booking information',
        message: 'Please provide customer name, email, event date, and duration.',
        required: ['customerName', 'customerEmail', 'eventDate', 'duration']
      });
    }

    const services = await readServices();
    const service = services.find(s => s.id === req.params.id);

    if (!service) {
      return res.status(404).json({
        error: 'Service not found',
        message: 'The service you are trying to book could not be found.'
      });
    }

    if (!service.available) {
      return res.status(400).json({
        error: 'Service not available',
        message: 'This service is currently not available for booking.'
      });
    }

    const bookings = await readBookings();
    
    const newBooking = {
      id: uuidv4(),
      serviceId: req.params.id,
      serviceName: service.title,
      artisanId: service.artisanId,
      artisanName: service.artisanName,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      eventDate,
      eventTime: eventTime || '',
      duration: parseInt(duration),
      eventType: eventType || '',
      venue: venue || '',
      specialRequests: specialRequests || '',
      hourlyRate: service.hourlyRate,
      totalAmount: totalAmount || (service.hourlyRate * parseInt(duration)),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    await writeBookings(bookings);

    // Update service booking count
    service.bookings = (service.bookings || 0) + 1;
    await writeServices(services);

    res.status(201).json({
      message: 'Booking request submitted successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      error: 'Failed to create booking',
      message: 'We encountered an issue processing your booking request.'
    });
  }
});

// GET /api/services/bookings/:artisanId
// Get bookings for a specific artisan
router.get('/bookings/:artisanId', async (req, res) => {
  try {
    const bookings = await readBookings();
    const artisanBookings = bookings.filter(booking => booking.artisanId === req.params.artisanId);

    res.json({
      bookings: artisanBookings,
      total: artisanBookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      message: 'We encountered an issue loading the bookings.'
    });
  }
});

// Add comment to service
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, userName } = req.body;

    if (!text || !userName) {
      return res.status(400).json({ error: 'Text and userName are required' });
    }

    const comment = {
      id: Date.now().toString(),
      serviceId: id,
      text,
      userName,
      createdAt: new Date().toISOString()
    };

    // In a real app, save to database
    // For now, just return the comment
    res.json({ 
      success: true, 
      comment 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

export default router;
