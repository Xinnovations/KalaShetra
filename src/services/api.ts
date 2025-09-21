const API_BASE_URL = 'http://localhost:5001/api';

// API service class for KalaShetra backend
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // AI Services - Fixed to match backend expectations
  async generateProductDescription(productData: {
    productName?: string;
    name?: string;
    category?: string;
    materials?: string;
    techniques?: string;
    craftType?: string;
    region?: string;
    description?: string;
    basicDescription?: string;
  }) {
    return this.request('/ai/product-description', {
      method: 'POST',
      body: JSON.stringify({
        product_name: productData.productName || productData.name,
        description: productData.basicDescription || productData.description || `${productData.category || productData.craftType} made with ${productData.materials}`,
        materials: productData.materials,
        craftType: productData.craftType || productData.techniques,
        region: productData.region || 'India'
      }),
    });
  }

  async generateCulturalStory(storyData: {
    craft_type?: string;
    craftType?: string;
    region?: string;
    personal_story?: string;
    personalStory?: string;
    traditions?: string;
    tradition?: string;
    product_name?: string;
    name?: string;
    materials?: string;
  }) {
    return this.request('/ai/cultural-story', {
      method: 'POST',
      body: JSON.stringify({
        product_name: storyData.product_name || storyData.name,
        craftType: storyData.craftType || storyData.craft_type,
        region: storyData.region || 'India',
        materials: storyData.materials
      }),
    });
  }

  async translateContent(translationData: {
    text: string;
    target_language: string;
    source_language?: string;
  }) {
    return this.request('/ai/translate', {
      method: 'POST',
      body: JSON.stringify({
        text: translationData.text,
        targetLanguages: [translationData.target_language]
      }),
    });
  }

  async generateSocialMediaContent(contentData: {
    product_name?: string;
    productName?: string;
    description: string;
    platform: string;
    style?: string;
    craftType?: string;
    region?: string;
  }) {
    return this.request('/ai/social-media', {
      method: 'POST',
      body: JSON.stringify({
        product_name: contentData.productName || contentData.product_name,
        description: contentData.description,
        platform: contentData.platform,
        craftType: contentData.craftType || contentData.style || 'Traditional craft',
        region: contentData.region || 'India'
      }),
    });
  }

  async getPricingSuggestion(pricingData: {
    productName?: string;
    product_name?: string;
    category: string;
    materials: string;
    size?: string;
    region: string;
    craftType: string;
    time_to_make?: string;
    description?: string;
    basePrice?: number;
  }) {
    return this.request('/ai/pricing-suggestion', {
      method: 'POST',
      body: JSON.stringify({
        product_name: pricingData.productName || pricingData.product_name,
        description: pricingData.description,
        materials: pricingData.materials,
        craftType: pricingData.craftType,
        region: pricingData.region,
        basePrice: pricingData.basePrice
      }),
    });
  }

  async generateVoiceNarration(voiceData: {
    text: string;
    language?: string;
    voice_type?: string;
  }) {
    return this.request('/ai/voice-narration', {
      method: 'POST',
      body: JSON.stringify({
        text: voiceData.text,
        language: voiceData.language || 'en',
        voiceType: voiceData.voice_type || 'female'
      }),
    });
  }

  async generatePricingAnalysis(data: any) {
    return this.request('/ai/pricing-analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Product Services - Fixed to match backend field requirements
  async createProduct(productData: FormData) {
    // Convert FormData to regular object for JSON API
    const data: any = {};
    
    // Extract form data
    for (const [key, value] of productData.entries()) {
      if (key !== 'images') {
        data[key] = value;
      }
    }

    // Map frontend fields to backend expected fields
    const backendData = {
      name: data.name,
      description: data.description || `Beautiful ${data.category} handcrafted item`,
      price: data.price || 1000,
      materials: data.materials || 'Traditional materials',
      craftType: data.techniques || data.category,
      category: data.category,
      region: data.region || 'India',
      artisanId: data.artisan_name || 'artisan-001',
      artisanName: data.artisan_name || 'Skilled Artisan',
      images: [],
      status: data.status || 'draft'
    };

    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async getProducts(filters?: {
    category?: string;
    search?: string;
    artisan_id?: string;
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Artisan Services
  async createArtisan(artisanData: any) {
    return this.request('/artisans', {
      method: 'POST',
      body: JSON.stringify(artisanData),
    });
  }

  async getArtisans(filters?: {
    search?: string;
    region?: string;
    craft_type?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/artisans${queryString ? `?${queryString}` : ''}`);
  }

  async getArtisan(id: string) {
    return this.request(`/artisans/${id}`);
  }

  async updateArtisan(id: string, artisanData: any) {
    return this.request(`/artisans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(artisanData),
    });
  }

  async getArtisanAnalytics(id: string) {
    return this.request(`/artisans/${id}/analytics`);
  }

  // Service endpoints
  async getServices(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/services${queryString}`);
  }

  async getService(id: string) {
    return this.request(`/services/${id}`);
  }

  async createService(serviceData: any) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id: string, serviceData: any) {
    return this.request(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(serviceData),
    });
  }

  async bookService(serviceId: string, bookingData: any) {
    return this.request(`/services/${serviceId}/book`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings(artisanId: string) {
    return this.request(`/services/bookings/${artisanId}`);
  }

  // Upload endpoints
  async uploadSingle(formData: FormData) {
    return this.request('/upload/single', {
      method: 'POST',
      body: formData,
    });
  }

  async uploadMultiple(formData: FormData) {
    return this.request('/upload/multiple', {
      method: 'POST',
      body: formData,
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  async getAudioSummary(serviceId: string) {
    return this.request('/ai/audio-summary', {
      method: 'POST',
      body: JSON.stringify({ serviceId }),
    });
  }

  async addComment(serviceId: string, commentText: string) {
    return this.request(`/services/${serviceId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ 
        text: commentText,
        userName: 'Demo User',
        createdAt: new Date().toISOString()
      }),
    });
  }
}

export const apiService = new ApiService();
export default ApiService;
