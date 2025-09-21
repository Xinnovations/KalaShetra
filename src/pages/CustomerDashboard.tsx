import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"; // Import Label component
import { useToast } from "@/hooks/use-toast";
import { apiService } from '@/services/api';
import { Search, Heart, Share2, Eye, ShoppingCart, Filter, MapPin, Play, Pause, Square, Volume2, Users, ImageIcon, Video, Calendar } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  finalPrice?: number;
  category: string;
  materials: string;
  craftType: string;
  region: string;
  artisanName: string;
  images?: string[];
  audioUrl?: string;
  ai_description?: string;
  cultural_story?: string;
  culturalStory?: string;
  aiDescription?: string;
  views?: number;
  likes?: number;
  phone?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}

interface ArtistService {
  id: string;
  title: string;
  description: string;
  artType: string;
  specialization: string;
  hourlyRate: number;
  region: string;
  artisanName: string;
  images: string[];
  videos: string[];
  available: boolean;
  minBookingHours: number;
  maxBookingHours: number;
  views?: number;
  bookings?: number;
  rating?: number;
  phone?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  enhanced_description?: string;
  cultural_story?: string;
  social_content?: string;
  pricing_analysis?: string;
}

const CustomerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<ArtistService[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredServices, setFilteredServices] = useState<ArtistService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedService, setSelectedService] = useState<ArtistService | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isPlayingStory, setIsPlayingStory] = useState(false);
  const [isPausedStory, setIsPausedStory] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    address: {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    payment: {
      method: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    }
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
    loadServices();
  }, []);

  useEffect(() => {
    filterProducts();
    filterServices();
  }, [products, services, searchQuery, selectedCategory, selectedRegion]);

  useEffect(() => {
    if (window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Set default voice (prefer English voices)
        const englishVoice = availableVoices.find(voice => voice.lang.startsWith('en') && voice.name.includes('Male'));
        if (englishVoice) {
          setSelectedVoice(englishVoice);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    if (speechSynthesis && selectedVoice && selectedProduct) {
      const textToSpeak = getCulturalStory(selectedProduct) || getProductDescription(selectedProduct);
      const newUtterance = new SpeechSynthesisUtterance(textToSpeak);
      newUtterance.voice = selectedVoice;
      newUtterance.lang = selectedLanguage;
      newUtterance.rate = 0.9;
      newUtterance.pitch = 1;
      
      newUtterance.onstart = () => setIsPlaying(selectedProduct.id);
      newUtterance.onend = () => setIsPlaying(null);
      newUtterance.onerror = () => {
        setIsPlaying(null);
        toast({
          title: "Speech Error",
          description: "Failed to play voice narration",
          variant: "destructive",
        });
      };
      
      setCurrentUtterance(newUtterance);
    }
  }, [speechSynthesis, selectedVoice, selectedProduct, voices, selectedLanguage]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      console.log('Loading products from API...');
      const response = await apiService.getProducts({ status: 'published' });
      console.log('API Response:', response);
      
      if (response && Array.isArray(response)) {
        setProducts(response);
        console.log('Loaded products:', response.length);
      } else if (response && response.products && Array.isArray(response.products)) {
        setProducts(response.products);
        console.log('Loaded products:', response.products.length);
      } else if (response && response.success && response.products) {
        setProducts(response.products);
        console.log('Loaded products:', response.products.length);
      } else {
        console.warn('Unexpected API response format:', response);
        setProducts([]);
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: `Failed to load products: ${error.message}. Make sure the backend server is running on port 5001.`,
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadServices = async () => {
    setIsLoading(true);
    try {
      console.log('Loading services from API...');
      const response = await apiService.getServices({ status: 'published' });
      console.log('API Response:', response);
      
      if (response && Array.isArray(response)) {
        setServices(response);
        console.log('Loaded services:', response.length);
      } else if (response && response.services && Array.isArray(response.services)) {
        setServices(response.services);
        console.log('Loaded services:', response.services.length);
      } else if (response && response.success && response.services) {
        setServices(response.services);
        console.log('Loaded services:', response.services.length);
      } else {
        console.warn('Unexpected API response format:', response);
        setServices([]);
      }
    } catch (error: any) {
      console.error('Error loading services:', error);
      toast({
        title: "Error",
        description: `Failed to load services: ${error.message}. Make sure the backend server is running on port 5001.`,
        variant: "destructive",
      });
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.materials.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.craftType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(product => product.region === selectedRegion);
    }

    setFilteredProducts(filtered);
  };

  const filterServices = () => {
    let filtered = services;

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.artType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.artType === selectedCategory);
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(service => service.region === selectedRegion);
    }

    setFilteredServices(filtered);
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  const viewService = (service: ArtistService) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    toast({
      title: favorites.includes(productId) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(productId) ? "Product removed from your wishlist" : "Product added to your wishlist",
    });
  };

  const shareProduct = (product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this beautiful ${product.craftType} from ${product.artisanName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    }
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
  };

  const getUniqueRegions = () => {
    const regions = [...new Set(products.map(p => p.region))];
    return regions;
  };

  const getProductDescription = (product: Product) => {
    return product.ai_description || product.description || 'No description available';
  };

  const getCulturalStory = (product: Product) => {
    return product.cultural_story || product.culturalStory || '';
  };

  const speak = () => {
    if (currentUtterance && speechSynthesis) {
      speechSynthesis.speak(currentUtterance);
    }
  };

  const pause = () => {
    if (currentUtterance && speechSynthesis) {
      speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (currentUtterance && speechSynthesis) {
      speechSynthesis.resume();
    }
  };

  const stop = () => {
    if (currentUtterance && speechSynthesis) {
      speechSynthesis.cancel();
    }
  };

  const selectLanguage = (language: string) => {
    setSelectedLanguage(language);
  };

  const playStory = (text: string, language: string = 'en-US') => {
    if (!speechSynthesis || !selectedVoice) return;
    
    // Stop any current speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setIsPlayingStory(true);
      setIsPausedStory(false);
    };
    
    utterance.onend = () => {
      setIsPlayingStory(false);
      setIsPausedStory(false);
    };
    
    speechSynthesis.speak(utterance);
  };

  const pauseStory = () => {
    if (speechSynthesis && isPlayingStory) {
      speechSynthesis.pause();
      setIsPausedStory(true);
    }
  };

  const resumeStory = () => {
    if (speechSynthesis && isPausedStory) {
      speechSynthesis.resume();
      setIsPausedStory(false);
    }
  };

  const stopStory = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlayingStory(false);
      setIsPausedStory(false);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const removeFromCart = (productId: string) => {
    const newCart = cartItems.filter(item => item.id !== productId);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const updateCheckoutData = (data: any) => {
    setCheckoutData(prev => ({ ...prev, ...data }));
  };

  // Cart utility functions
  const getCartItemQuantity = (productId: string) => {
    return cartItems.filter(item => item.id === productId).length;
  };

  const getTotalItems = () => {
    return cartItems.length;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const updateCartQuantity = (productId: string, change: number) => {
    if (change > 0) {
      const product = products.find(p => p.id === productId);
      if (product) {
        addToCart(product);
      }
    } else {
      const itemIndex = cartItems.findIndex(item => item.id === productId);
      if (itemIndex !== -1) {
        const newCart = [...cartItems];
        newCart.splice(itemIndex, 1);
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
    }
  };

  const openServiceDetails = (service: ArtistService) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Header with Cart */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">KalaShetra Marketplace</h1>
          <div className="flex items-center gap-6">
            {/* Customer Profile */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                PK
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Priya Sharma</div>
                <div className="text-gray-500">Mumbai, India</div>
              </div>
            </div>
            
            {/* Cart */}
            <div className="relative">
              <Button variant="outline" size="sm" onClick={openCart}>
                <ShoppingCart className="h-4 w-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Authentic Handcrafted Treasures
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore unique artisan products from across India, each with its own story and cultural heritage.
          </p>
        </div>

        {!isLoading && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm">
            <p><strong>Debug Info:</strong> Loaded {products.length} products from backend</p>
            {products.length === 0 && (
              <p className="text-red-600 mt-2">
                No products found. Make sure the backend server is running on port 5001.
              </p>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('products')}
              className="mr-2"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Products to Buy
            </Button>
            <Button
              variant={activeTab === 'services' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('services')}
            >
              <Users className="w-4 h-4 mr-2" />
              Artists to Book
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={activeTab === 'products' ? "Search products..." : "Search artists and services..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {activeTab === 'products' ? (
                <>
                  <SelectItem value="Textiles">Textiles</SelectItem>
                  <SelectItem value="Pottery">Pottery</SelectItem>
                  <SelectItem value="Jewelry">Jewelry</SelectItem>
                  <SelectItem value="Woodwork">Woodwork</SelectItem>
                  <SelectItem value="Metalwork">Metalwork</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="Classical Dance">Classical Dance</SelectItem>
                  <SelectItem value="Folk Dance">Folk Dance</SelectItem>
                  <SelectItem value="Theater Acting">Theater Acting</SelectItem>
                  <SelectItem value="Classical Music">Classical Music</SelectItem>
                  <SelectItem value="Folk Music">Folk Music</SelectItem>
                  <SelectItem value="Painting">Painting</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Kolkata">Kolkata</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5001${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-48 object-contain bg-gray-50"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  {/* Artist Profile Section */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {product.artisanName?.split(' ').map(n => n[0]).join('') || 'A'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-500">By {product.artisanName}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{product.finalPrice || product.price}
                    </span>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {product.region}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {product.views || 0}
                    </span>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="mb-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs font-medium text-orange-800 mb-2">📞 Contact Artisan:</p>
                    <div className="flex gap-1 flex-wrap">
                      {product.phone && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-6 px-2 bg-white hover:bg-blue-50"
                          onClick={() => window.open(`tel:${product.phone}`)}
                        >
                          📞 Call
                        </Button>
                      )}
                      {product.whatsapp && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-6 px-2 bg-white hover:bg-green-50"
                          onClick={() => window.open(`https://wa.me/${product.whatsapp}`)}
                        >
                          💬 WhatsApp
                        </Button>
                      )}
                      {product.instagram && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-6 px-2 bg-white hover:bg-pink-50"
                          onClick={() => window.open(`https://instagram.com/${product.instagram}`)}
                        >
                          📷 Instagram
                        </Button>
                      )}
                      {product.facebook && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-6 px-2 bg-white hover:bg-blue-50"
                          onClick={() => window.open(`https://facebook.com/${product.facebook}`)}
                        >
                          📘 Facebook
                        </Button>
                      )}
                      {!product.phone && !product.whatsapp && !product.instagram && !product.facebook && (
                        <span className="text-xs text-gray-500 italic">Contact via purchase</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => viewProduct(product)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {service.images && service.images.length > 0 ? (
                    <img
                      src={service.images[0].startsWith('http') ? service.images[0] : `http://localhost:5001${service.images[0]}`}
                      alt={service.title}
                      className="w-full h-48 object-contain bg-gray-50"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                      <Users className="w-12 h-12 text-orange-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-500">Available</Badge>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {service.images.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {service.images.length}
                      </Badge>
                    )}
                    {service.videos.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Video className="w-3 h-3 mr-1" />
                        {service.videos.length}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{service.hourlyRate}/hr
                    </span>
                    <Badge variant="secondary">{service.artType}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {service.region || 'Location TBD'}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {service.views || 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    By {service.artisanName} • Min: {service.minBookingHours}h, Max: {service.maxBookingHours}h
                  </p>
                  {(service.phone || service.whatsapp || service.instagram || service.facebook) && (
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 mb-2">Contact Artist:</p>
                      <div className="flex gap-1 flex-wrap">
                        {service.phone && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-6 px-2"
                            onClick={() => window.open(`tel:${service.phone}`)}
                          >
                            📞 {service.phone}
                          </Button>
                        )}
                        {service.whatsapp && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-6 px-2"
                            onClick={() => window.open(`https://wa.me/${service.whatsapp}`)}
                          >
                            💬 WhatsApp
                          </Button>
                        )}
                        {service.instagram && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-6 px-2"
                            onClick={() => window.open(`https://instagram.com/${service.instagram}`)}
                          >
                            📷 @{service.instagram}
                          </Button>
                        )}
                        {service.facebook && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-6 px-2"
                            onClick={() => window.open(`https://facebook.com/${service.facebook}`)}
                          >
                            📘 {service.facebook}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setSelectedService(service);
                        setIsBookingOpen(true);
                      }}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Book Artist
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openServiceDetails(service)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty States */}
        {activeTab === 'products' && filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        )}

        {activeTab === 'services' && filteredServices.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No artists found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find artists.</p>
          </div>
        )}

        {/* Product Details Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>{selectedProduct?.name || 'Product Details'}</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left Side - Product Images */}
                <div className="bg-gray-50 p-6">
                  <div className="space-y-4">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <>
                        <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
                          <img
                            src={selectedProduct.images[0].startsWith('http') ? selectedProduct.images[0] : `http://localhost:5001${selectedProduct.images[0]}`}
                            alt={selectedProduct.name}
                            className="w-full h-96 object-contain bg-gray-50"
                          />
                        </div>
                        {selectedProduct.images.length > 1 && (
                          <div className="grid grid-cols-4 gap-2">
                            {selectedProduct.images.slice(1, 5).map((image, index) => (
                              <div key={index} className="aspect-square rounded-md overflow-hidden bg-white shadow-sm">
                                <img
                                  src={image.startsWith('http') ? image : `http://localhost:5001${image}`}
                                  alt={`${selectedProduct.name} ${index + 2}`}
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Product Information */}
                <div className="p-6 space-y-6">
                  {/* Product Title & Price */}
                  <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h1>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-3xl font-bold text-green-600">
                        ₹{(selectedProduct.price || selectedProduct.finalPrice || 0).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-sm text-gray-600">(4.8) • 127 reviews</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedProduct.category}</Badge>
                      <Badge variant="outline">{selectedProduct.region}</Badge>
                      <span className="text-sm text-green-600 font-medium">✓ In Stock</span>
                    </div>
                  </div>

                  {/* Artist Information */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Meet the Artist</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedProduct.artisanName?.split(' ').map(n => n[0]).join('') || 'A'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{selectedProduct.artisanName}</div>
                        <div className="text-sm text-gray-600">{selectedProduct.craftType} Specialist</div>
                        <div className="text-sm text-gray-500">📍 {selectedProduct.region}</div>
                      </div>
                    </div>
                    
                    {/* Social Media Links */}
                    {(selectedProduct.phone || selectedProduct.instagram || selectedProduct.facebook || selectedProduct.whatsapp) && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Connect with the Artist:</p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedProduct.phone && (
                            <Button variant="outline" size="sm" className="text-xs">
                              📞 Call
                            </Button>
                          )}
                          {selectedProduct.whatsapp && (
                            <Button variant="outline" size="sm" className="text-xs">
                              💬 WhatsApp
                            </Button>
                          )}
                          {selectedProduct.instagram && (
                            <Button variant="outline" size="sm" className="text-xs">
                              📷 Instagram
                            </Button>
                          )}
                          {selectedProduct.facebook && (
                            <Button variant="outline" size="sm" className="text-xs">
                              📘 Facebook
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Product Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium text-gray-700">Art Form:</span> <span className="text-gray-900">{selectedProduct.craftType}</span></div>
                      <div><span className="font-medium text-gray-700">Materials:</span> <span className="text-gray-900">{selectedProduct.materials}</span></div>
                      <div><span className="font-medium text-gray-700">Origin:</span> <span className="text-gray-900">{selectedProduct.region}</span></div>
                      <div><span className="font-medium text-gray-700">Category:</span> <span className="text-gray-900">{selectedProduct.category}</span></div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {getProductDescription(selectedProduct)}
                    </p>
                  </div>

                  {/* Customer Reviews Section */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>
                    
                    {/* Review Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-3xl font-bold">4.8</div>
                        <div>
                          <div className="flex text-yellow-400 mb-1">
                            {'★'.repeat(5)}
                          </div>
                          <div className="text-sm text-gray-600">Based on 127 reviews</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map(rating => (
                          <div key={rating} className="flex items-center gap-2 text-sm">
                            <span className="w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${rating === 5 ? 75 : rating === 4 ? 20 : 5}%` }}
                              ></div>
                            </div>
                            <span className="w-8 text-gray-600">{rating === 5 ? 95 : rating === 4 ? 25 : 7}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            S
                          </div>
                          <div>
                            <div className="font-medium">Sneha Patel</div>
                            <div className="flex text-yellow-400 text-sm">
                              {'★'.repeat(5)}
                            </div>
                          </div>
                          <div className="ml-auto text-sm text-gray-500">2 days ago</div>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Absolutely beautiful craftsmanship! The quality is exceptional and the cultural story behind it makes it even more special. Highly recommended!"
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            R
                          </div>
                          <div>
                            <div className="font-medium">Rahul Kumar</div>
                            <div className="flex text-yellow-400 text-sm">
                              {'★'.repeat(4)}
                            </div>
                          </div>
                          <div className="ml-auto text-sm text-gray-500">1 week ago</div>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Great product and fast delivery. The artisan's attention to detail is remarkable. Will definitely buy again."
                        </p>
                      </div>
                    </div>

                    {/* Write Review Button */}
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Write a Review
                      </Button>
                    </div>
                  </div>

                  {/* Cultural Story with Voice Controls */}
                  {getCulturalStory(selectedProduct) && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3 text-amber-800">🎭 Cultural Heritage Story</h3>
                      <p className="text-sm text-amber-700 mb-4">
                        Listen to the fascinating cultural story behind this masterpiece
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <Select value={selectedLanguage} onValueChange={selectLanguage}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en-US">🇺🇸 English</SelectItem>
                            <SelectItem value="hi-IN">🇮🇳 Hindi</SelectItem>
                            <SelectItem value="ta-IN">🇮🇳 Tamil</SelectItem>
                            <SelectItem value="te-IN">🇮🇳 Telugu</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex gap-2">
                          {isPlayingStory ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={pauseStory}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={resumeStory}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={stopStory}
                              >
                                <Square className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => playStory(getCulturalStory(selectedProduct), selectedLanguage)}
                              disabled={!selectedVoice}
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              <Volume2 className="h-4 w-4 mr-2" />
                              Play Story
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="border-t pt-6 space-y-4">
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => addToCart(selectedProduct)}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3"
                        size="lg"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        onClick={() => toggleFavorite(selectedProduct.id)}
                        variant="outline"
                        size="lg"
                        className="px-4"
                      >
                        <Heart className={`h-5 w-5 ${favorites.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button 
                        onClick={() => shareProduct(selectedProduct)}
                        variant="outline"
                        size="lg"
                        className="px-4"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        🚚 Free shipping on orders above ₹2,000 • 🔒 Secure payment • 📞 24/7 support
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Service Details Modal */}
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
            <DialogHeader>
              <DialogTitle>{selectedService?.title || 'Service Details'}</DialogTitle>
            </DialogHeader>
            {selectedService && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left Side - Artist Images */}
                <div className="bg-gray-50 p-6">
                  <div className="space-y-4">
                    {selectedService.images && selectedService.images.length > 0 ? (
                      <>
                        <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
                          <img
                            src={selectedService.images[0].startsWith('http') ? selectedService.images[0] : `http://localhost:5001${selectedService.images[0]}`}
                            alt={selectedService.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {selectedService.images.length > 1 && (
                          <div className="grid grid-cols-4 gap-2">
                            {selectedService.images.slice(1, 5).map((image, index) => (
                              <div key={index} className="aspect-square rounded-md overflow-hidden bg-white shadow-sm">
                                <img
                                  src={image.startsWith('http') ? image : `http://localhost:5001${image}`}
                                  alt={`${selectedService.title} ${index + 2}`}
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Artist Information */}
                <div className="p-6 space-y-6">
                  {/* Artist Title & Price */}
                  <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedService.title}</h1>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-3xl font-bold text-green-600">
                        ₹{selectedService.hourlyRate}/hr
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-sm text-gray-600">(4.8) • 127 reviews</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedService.artType}</Badge>
                      <Badge variant="outline">{selectedService.region}</Badge>
                      <span className="text-sm text-green-600 font-medium">✓ Available</span>
                    </div>
                  </div>

                  {/* Artist Information */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Meet the Artist</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedService.artisanName?.split(' ').map(n => n[0]).join('') || 'A'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{selectedService.artisanName}</div>
                        <div className="text-sm text-gray-600">{selectedService.specialization} Specialist</div>
                        <div className="text-sm text-gray-500">📍 {selectedService.region}</div>
                      </div>
                    </div>
                    
                    {/* Social Media Links */}
                    {(selectedService.phone || selectedService.instagram || selectedService.facebook || selectedService.whatsapp) && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Connect with the Artist:</p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedService.phone && (
                            <Button variant="outline" size="sm" className="text-xs">
                              📞 Call
                            </Button>
                          )}
                          {selectedService.whatsapp && (
                            <Button variant="outline" size="sm" className="text-xs">
                              💬 WhatsApp
                            </Button>
                          )}
                          {selectedService.instagram && (
                            <Button variant="outline" size="sm" className="text-xs">
                              📷 Instagram
                            </Button>
                          )}
                          {selectedService.facebook && (
                            <Button variant="outline" size="sm" className="text-xs">
                              📘 Facebook
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Description */}
                  {selectedService.enhanced_description && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-sm text-blue-800 mb-2">Enhanced Description</h4>
                      <p className="text-sm text-gray-700">{selectedService.enhanced_description}</p>
                    </div>
                  )}

                  {/* Cultural Story */}
                  {selectedService.cultural_story && (
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-sm text-purple-800 mb-2">Cultural Story</h4>
                      <p className="text-sm text-gray-700">{selectedService.cultural_story}</p>
                    </div>
                  )}

                  {/* Social Media Content */}
                  {selectedService.social_content && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-sm text-green-800 mb-2">Social Media Highlights</h4>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedService.social_content}</pre>
                    </div>
                  )}

                  {/* Videos Section */}
                  {selectedService.videos && selectedService.videos.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg mb-3">Artist Videos</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedService.videos.slice(0, 2).map((video, index) => (
                          <div key={index} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                            <video 
                              src={video.startsWith('http') ? video : `http://localhost:5001${video}`}
                              controls
                              className="w-full h-full object-cover"
                              poster="/placeholder.svg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Booking Section */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-lg mb-3">Book This Artist</h3>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Minimum Booking:</span>
                          <div className="text-lg font-semibold text-orange-600">{selectedService.minBookingHours} hours</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Maximum Booking:</span>
                          <div className="text-lg font-semibold text-orange-600">{selectedService.maxBookingHours} hours</div>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={() => {
                          setSelectedService(selectedService);
                          setIsBookingOpen(true);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book This Artist
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Booking Modal */}
        <Dialog open={isBookingOpen} onOpenChange={() => setIsBookingOpen(false)}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
            <DialogHeader>
              <DialogTitle>Book Artist</DialogTitle>
            </DialogHeader>
            {selectedService && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left Side - Artist Images */}
                <div className="bg-gray-50 p-6">
                  <div className="space-y-4">
                    {selectedService.images && selectedService.images.length > 0 ? (
                      <>
                        <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
                          <img
                            src={selectedService.images[0].startsWith('http') ? selectedService.images[0] : `http://localhost:5001${selectedService.images[0]}`}
                            alt={selectedService.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {selectedService.images.length > 1 && (
                          <div className="grid grid-cols-4 gap-2">
                            {selectedService.images.slice(1, 5).map((image, index) => (
                              <div key={index} className="aspect-square rounded-md overflow-hidden bg-white shadow-sm">
                                <img
                                  src={image.startsWith('http') ? image : `http://localhost:5001${image}`}
                                  alt={`${selectedService.title} ${index + 2}`}
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Artist Information */}
                <div className="p-6 space-y-6">
                  {/* Artist Title & Price */}
                  <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedService.title}</h1>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-3xl font-bold text-green-600">
                        ₹{selectedService.hourlyRate}/hr
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-sm text-gray-600">(4.8) • 127 reviews</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedService.artType}</Badge>
                      <Badge variant="outline">{selectedService.region}</Badge>
                      <span className="text-sm text-green-600 font-medium">✓ Available</span>
                    </div>
                  </div>

                  {/* Artist Information */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Meet the Artist</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedService.artisanName?.split(' ').map(n => n[0]).join('') || 'A'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{selectedService.artisanName}</div>
                        <div className="text-sm text-gray-600">{selectedService.specialization} Specialist</div>
                        <div className="text-sm text-gray-500">📍 {selectedService.region}</div>
                      </div>
                    </div>
                    
                    {/* Social Media Links */}
                    {(selectedService.phone || selectedService.instagram || selectedService.facebook || selectedService.whatsapp) && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Connect with the Artist:</p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedService.phone && (
                            <Button variant="outline" size="sm" className="text-xs">
                              📞 Call
                            </Button>
                          )}
                          {selectedService.whatsapp && (
                            <Button variant="outline" size="sm" className="text-xs">
                              💬 WhatsApp
                            </Button>
                          )}
                          {selectedService.instagram && (
                            <Button variant="outline" size="sm" className="text-xs">
                              📷 Instagram
                            </Button>
                          )}
                          {selectedService.facebook && (
                            <Button variant="outline" size="sm" className="text-xs">
                              📘 Facebook
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Artist Details */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Artist Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium text-gray-700">Art Form:</span> <span className="text-gray-900">{selectedService.artType}</span></div>
                      <div><span className="font-medium text-gray-700">Specialization:</span> <span className="text-gray-900">{selectedService.specialization}</span></div>
                      <div><span className="font-medium text-gray-700">Origin:</span> <span className="text-gray-900">{selectedService.region}</span></div>
                      <div><span className="font-medium text-gray-700">Category:</span> <span className="text-gray-900">{selectedService.artType}</span></div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {selectedService.description}
                    </p>
                  </div>

                  {/* Customer Reviews Section */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>
                    
                    {/* Review Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-3xl font-bold">4.8</div>
                        <div>
                          <div className="flex text-yellow-400 mb-1">
                            {'★'.repeat(5)}
                          </div>
                          <div className="text-sm text-gray-600">Based on 127 reviews</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map(rating => (
                          <div key={rating} className="flex items-center gap-2 text-sm">
                            <span className="w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${rating === 5 ? 75 : rating === 4 ? 20 : 5}%` }}
                              ></div>
                            </div>
                            <span className="w-8 text-gray-600">{rating === 5 ? 95 : rating === 4 ? 25 : 7}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            S
                          </div>
                          <div>
                            <div className="font-medium">Sneha Patel</div>
                            <div className="flex text-yellow-400 text-sm">
                              {'★'.repeat(5)}
                            </div>
                          </div>
                          <div className="ml-auto text-sm text-gray-500">2 days ago</div>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Absolutely beautiful craftsmanship! The quality is exceptional and the cultural story behind it makes it even more special. Highly recommended!"
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            R
                          </div>
                          <div>
                            <div className="font-medium">Rahul Kumar</div>
                            <div className="flex text-yellow-400 text-sm">
                              {'★'.repeat(4)}
                            </div>
                          </div>
                          <div className="ml-auto text-sm text-gray-500">1 week ago</div>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Great product and fast delivery. The artisan's attention to detail is remarkable. Will definitely buy again."
                        </p>
                      </div>
                    </div>

                    {/* Write Review Button */}
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Write a Review
                      </Button>
                    </div>
                  </div>

                  {/* Booking Interface */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-lg mb-3">Book Artist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bookingDate">Booking Date</Label>
                        <Input
                          id="bookingDate"
                          type="date"
                          value={checkoutData.address.addressLine1}
                          onChange={(e) => updateCheckoutData({ address: { ...checkoutData.address, addressLine1: e.target.value } })}
                          placeholder="Select date"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bookingTime">Booking Time</Label>
                        <Input
                          id="bookingTime"
                          type="time"
                          value={checkoutData.address.addressLine2}
                          onChange={(e) => updateCheckoutData({ address: { ...checkoutData.address, addressLine2: e.target.value } })}
                          placeholder="Select time"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bookingHours">Booking Hours</Label>
                        <Input
                          id="bookingHours"
                          type="number"
                          value={checkoutData.address.city}
                          onChange={(e) => updateCheckoutData({ address: { ...checkoutData.address, city: e.target.value } })}
                          placeholder="Enter hours"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" size="lg" onClick={closeCheckout}>
                        Cancel
                      </Button>
                      <Button variant="default" size="lg">
                        Book Artist
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Cart Modal */}
        <Dialog open={isCartOpen} onOpenChange={closeCart}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
            <DialogHeader>
              <DialogTitle>Cart</DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="text-gray-600">Add some products to your cart to get started</p>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Your Cart</h3>
                  <div className="space-y-4">
                    {cartItems.map((product) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <img src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5001${product.images[0]}`} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{getProductDescription(product)}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          ₹{product.price.toLocaleString()}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => removeFromCart(product.id)}>
                          <Square className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-lg mb-2">Subtotal</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Subtotal</div>
                      <div className="text-sm text-gray-900">₹{cartItems.reduce((acc, product) => acc + product.price, 0).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Shipping</div>
                      <div className="text-sm text-gray-900">Free</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-sm text-gray-900">₹{cartItems.reduce((acc, product) => acc + product.price, 0).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" size="lg" onClick={closeCart}>
                      Continue Shopping
                    </Button>
                    <Button variant="default" size="lg" onClick={openCheckout}>
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Checkout Modal */}
        <Dialog open={isCheckoutOpen} onOpenChange={closeCheckout}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-6">
              <h3 className="font-semibold text-lg mb-3">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={checkoutData.address.fullName}
                    onChange={(e) => updateCheckoutData({ address: { ...checkoutData.address, fullName: e.target.value } })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={checkoutData.address.phone}
                    onChange={(e) => updateCheckoutData({ address: { ...checkoutData.address, phone: e.target.value } })}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="addressLine1">Address Line 1</Label>
                  <Input
                    id="addressLine1"
                    value={checkoutData.address.addressLine1}
                    onChange={(e) => updateCheckoutData({ address: { ...checkoutData.address, addressLine1: e.target.value } })}
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={checkoutData.address.addressLine2}
                    onChange={(e) => updateCheckoutData({ address: { ...checkoutData.address, addressLine2: e.target.value } })}
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={checkoutData.address.city}
                    onChange={(e) => updateCheckoutData({ address: { ...checkoutData.address, city: e.target.value } })}
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={checkoutData.address.state}
                    onChange={(e) => updateCheckoutData({ address: { ...checkoutData.address, state: e.target.value } })}
                    placeholder="Enter your state"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={checkoutData.address.pincode}
                    onChange={(e) => updateCheckoutData({ address: { ...checkoutData.address, pincode: e.target.value } })}
                    placeholder="Enter pincode"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={checkoutData.address.country}
                    onValueChange={(value) => updateCheckoutData({ address: { ...checkoutData.address, country: value } })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-3 mt-6">Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={checkoutData.payment.method}
                    onValueChange={(value) => updateCheckoutData({ payment: { ...checkoutData.payment, method: value } })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {checkoutData.payment.method === 'card' && (
                  <>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={checkoutData.payment.cardNumber}
                        onChange={(e) => updateCheckoutData({ payment: { ...checkoutData.payment, cardNumber: e.target.value } })}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={checkoutData.payment.expiryDate}
                        onChange={(e) => updateCheckoutData({ payment: { ...checkoutData.payment, expiryDate: e.target.value } })}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={checkoutData.payment.cvv}
                        onChange={(e) => updateCheckoutData({ payment: { ...checkoutData.payment, cvv: e.target.value } })}
                        placeholder="123"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        value={checkoutData.payment.nameOnCard}
                        onChange={(e) => updateCheckoutData({ payment: { ...checkoutData.payment, nameOnCard: e.target.value } })}
                        placeholder="Enter name as on card"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" size="lg" onClick={closeCheckout}>
                  Cancel
                </Button>
                <Button variant="default" size="lg">
                  Place Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CustomerDashboard;
