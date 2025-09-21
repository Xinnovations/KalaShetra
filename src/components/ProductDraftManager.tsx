import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiService } from '@/services/api';
import { Upload, Eye, Edit, Trash2, Wand2, MessageSquare, Share2, DollarSign, Volume2, Image as ImageIcon } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  materials: string;
  craftType: string;
  category: string;
  region: string;
  artisanId: string;
  artisanName: string;
  images: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  views?: number;
  likes?: number;
  shares?: number;
  culturalStory?: string;
  cultural_story?: string;
  socialMediaContent?: any;
  social_content?: string;
  pricingSuggestion?: string;
  audioUrl?: string;
  ai_description?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}

interface ArtisanProfile {
  name: string;
  specialization: string;
  region: string;
  experience: string;
  phone: string;
}

const ProductDraftManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToPublish, setProductToPublish] = useState<Product | null>(null);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: {[key: string]: boolean}}>({});
  const [aiResults, setAiResults] = useState<{[key: string]: any}>({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    materials: '',
    craftType: '',
    category: '',
    region: '',
    artisan_name: 'Rajesh Kumar Sharma',
    phone: '',
    instagram: '',
    facebook: '',
    whatsapp: ''
  });

  const [isViewOpen, setIsViewOpen] = useState(false);

  const { toast } = useToast();

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  const [artisanProfile, setArtisanProfile] = useState<ArtisanProfile>({
    name: 'Rajesh Kumar Sharma',
    specialization: 'Traditional Silk Weaving & Handicrafts',
    region: 'Varanasi, Uttar Pradesh',
    experience: '12+ years',
    phone: '+91 9876543210'
  });

  const [profileStats, setProfileStats] = useState({
    totalSales: 156,
    totalRevenue: 245000,
    avgRating: 4.8,
    totalReviews: 89,
    joinedDate: 'March 2020',
    lastActive: 'Today'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await apiService.getProducts({ status: 'draft' });
      if (response.success) {
        setProducts(response.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      materials: '',
      craftType: '',
      category: '',
      region: '',
      artisan_name: 'Rajesh Kumar Sharma',
      phone: '',
      instagram: '',
      facebook: '',
      whatsapp: ''
    });
    setSelectedFiles(null);
    setPreviewImages([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
      
      // Create preview URLs
      const previews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          if (previews.length === files.length) {
            setPreviewImages([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const createProduct = async () => {
    if (!formData.name || !formData.category || !formData.craftType) {
      toast({
        title: "Missing Information",
        description: "Please provide product name, category, and techniques.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let uploadedImageUrls: string[] = [];
      
      // Upload images first if any are selected
      if (selectedFiles && selectedFiles.length > 0) {
        const formDataForUpload = new FormData();
        Array.from(selectedFiles).forEach((file, index) => {
          formDataForUpload.append('images', file);
        });
        formDataForUpload.append('uploadType', 'products');

        try {
          console.log('Uploading images...', selectedFiles.length, 'files');
          const uploadResponse = await apiService.uploadMultiple(formDataForUpload);
          console.log('Upload response:', uploadResponse);
          
          if (uploadResponse.success && uploadResponse.files) {
            uploadedImageUrls = uploadResponse.files.map((file: any) => file.path || file.url || file.imageUrl);
            console.log('Uploaded image URLs:', uploadedImageUrls);
          } else {
            throw new Error('Upload response indicates failure');
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast({
            title: "Image Upload Failed",
            description: "Failed to upload images. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return; // Stop product creation if image upload fails
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description || `Beautiful ${formData.category} handcrafted with ${formData.materials || 'traditional materials'}`,
        price: parseFloat(formData.price) || 1000,
        materials: formData.materials || 'Traditional materials',
        craftType: formData.craftType,
        category: formData.category,
        region: formData.region,
        artisanId: formData.artisan_name || 'artisan-001',
        artisanName: formData.artisan_name || 'Rajesh Kumar Sharma',
        phone: formData.phone,
        instagram: formData.instagram,
        facebook: formData.facebook,
        whatsapp: formData.whatsapp,
        images: uploadedImageUrls,
        status: 'draft'
      };

      console.log('Creating product with data:', productData);

      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Success!",
        description: `Product created successfully${uploadedImageUrls.length > 0 ? ` with ${uploadedImageUrls.length} image(s)` : ''}`,
      });

      resetForm();
      setIsCreateOpen(false);
      loadProducts();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async () => {
    if (!formData.name || !formData.category || !formData.craftType) {
      toast({
        title: "Missing Information",
        description: "Please provide product name, category, and techniques.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let uploadedImageUrls: string[] = [];
      
      // Upload images first if any are selected
      if (selectedFiles && selectedFiles.length > 0) {
        const formDataForUpload = new FormData();
        Array.from(selectedFiles).forEach((file, index) => {
          formDataForUpload.append('images', file);
        });

        try {
          const uploadResponse = await apiService.uploadMultiple(formDataForUpload);
          if (uploadResponse.success && uploadResponse.files) {
            uploadedImageUrls = uploadResponse.files.map((file: any) => file.path || file.url);
          }
        } catch (uploadError) {
          console.warn('Image upload failed, proceeding without images:', uploadError);
          // Continue without images rather than failing completely
        }
      } else {
        // Keep existing images if no new files selected
        uploadedImageUrls = selectedProduct?.images || [];
      }

      const productData = {
        name: formData.name,
        description: formData.description || `Beautiful ${formData.category} handcrafted with ${formData.materials || 'traditional materials'}`,
        price: parseFloat(formData.price) || 1000,
        materials: formData.materials || 'Traditional materials',
        craftType: formData.craftType,
        category: formData.category,
        region: formData.region,
        artisanId: formData.artisan_name || 'artisan-001',
        artisanName: formData.artisan_name || 'Rajesh Kumar Sharma',
        phone: formData.phone,
        instagram: formData.instagram,
        facebook: formData.facebook,
        whatsapp: formData.whatsapp,
        images: uploadedImageUrls,
        status: 'draft'
      };

      const response = await fetch(`http://localhost:5001/api/products/${selectedProduct?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Success!",
        description: "Product draft updated successfully",
      });

      resetForm();
      setIsEditOpen(false);
      loadProducts();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishProduct = async (product: Product) => {
    // Check if AI enhancement has been done
    const hasAIEnhancement = aiResults[product.id] && (
      aiResults[product.id].description || 
      aiResults[product.id].story
    );

    if (!hasAIEnhancement) {
      toast({
        title: "Enhancement Required",
        description: "Please enhance your product with AI tools before publishing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedProduct = {
        ...product,
        status: 'published'
      };

      const response = await fetch(`http://localhost:5001/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Product Published!",
        description: "Your product is now live on the marketplace",
      });

      // Refresh the product list to remove published product from drafts
      loadProducts();
    } catch (error) {
      console.error('Error publishing product:', error);
      toast({
        title: "Publishing Failed",
        description: "Failed to publish product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIEnhancement = async (productId: string, enhancementType: string, product: Product) => {
    console.log(`Starting AI enhancement: ${enhancementType} for product:`, product.name);
    
    setLoadingStates(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [enhancementType]: true
      }
    }));

    try {
      let result;
      switch (enhancementType) {
        case 'description':
          console.log('Calling generateProductDescription...');
          result = await apiService.generateProductDescription({
            name: product.name,
            category: product.category,
            materials: product.materials,
            craftType: product.craftType,
            description: product.description,
            region: product.region
          });
          break;
        case 'story':
          console.log('Calling generateCulturalStory...');
          result = await apiService.generateCulturalStory({
            name: product.name,
            craftType: product.craftType,
            region: product.region,
            materials: product.materials
          });
          break;
        case 'social':
          console.log('Calling generateSocialMediaContent...');
          result = await apiService.generateSocialMediaContent({
            productName: product.name,
            description: product.description,
            platform: 'instagram',
            craftType: product.craftType,
            region: product.region
          });
          break;
        case 'pricing':
          console.log('Calling getPricingSuggestion...');
          result = await apiService.getPricingSuggestion({
            product_name: product.name,
            category: product.category,
            materials: product.materials,
            region: product.region || 'India',
            craftType: product.craftType,
            description: product.description,
            basePrice: product.price
          });
          break;
        case 'voice':
          console.log('Calling generateVoiceNarration...');
          result = await apiService.generateVoiceNarration({
            text: product.description + (product.culturalStory ? ' ' + product.culturalStory : '')
          });
          break;
        default:
          throw new Error('Unknown enhancement type');
      }

      console.log(`AI API Result for ${enhancementType}:`, result);

      if (result && (result.success !== false)) {
        // Extract the actual content from the result
        let content = result.content || result.data || result.description || result.story || result.suggestion || result;
        
        console.log(`Extracted content for ${enhancementType}:`, content);

        // Store AI results
        setAiResults(prev => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            [enhancementType]: content
          }
        }));

        // Update the product in the backend
        const updateData: any = {};
        switch (enhancementType) {
          case 'description':
            updateData.ai_description = content;
            break;
          case 'story':
            updateData.cultural_story = content;
            break;
          case 'social':
            updateData.social_content = content;
            break;
          case 'pricing':
            updateData.pricing_suggestion = content;
            break;
          case 'voice':
            updateData.audioUrl = content;
            break;
        }

        console.log('Updating product with data:', updateData);

        const response = await fetch(`http://localhost:5001/api/products/${productId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Backend update failed:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const updateResult = await response.json();
        console.log('Backend update successful:', updateResult);

        toast({
          title: "AI Enhancement Complete!",
          description: `${enhancementType.charAt(0).toUpperCase() + enhancementType.slice(1)} generated successfully`,
        });

        // Refresh products to show updated data
        loadProducts();
      } else {
        console.error('AI API returned unsuccessful result:', result);
        throw new Error(result?.message || 'AI enhancement failed');
      }
    } catch (error) {
      console.error('AI Enhancement Error:', error);
      toast({
        title: "Enhancement Failed",
        description: `Failed to generate ${enhancementType}. Check console for details.`,
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          [enhancementType]: false
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Artisan Profile Header */}
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {artisanProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{artisanProfile.name}</h2>
              <p className="text-lg text-gray-600">{artisanProfile.specialization}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>📍 {artisanProfile.region}</span>
                <span>🎨 {artisanProfile.experience}</span>
                <span>📞 {artisanProfile.phone}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Statistics Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Performance Metrics */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-yellow-600">{profileStats.avgRating}</span>
                  <div className="flex text-yellow-400 text-xs">{'★'.repeat(5)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sales:</span>
                <span className="font-bold text-green-600">{profileStats.totalSales}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Reviews:</span>
                <span className="font-bold text-blue-600">{profileStats.totalReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Rate:</span>
                <span className="font-bold text-purple-600">98%</span>
              </div>
            </div>
          </div>


          {/* Category Distribution */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h4 className="font-semibold text-gray-900 mb-3">Art Categories</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Textiles</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-xs font-medium">70%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pottery</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-xs font-medium">20%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Jewelry</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <span className="text-xs font-medium">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Public Profile
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Portfolio
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Customer Messages
          </Button>
        </div>
      </div>

      {/* Create New Product */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">My Art Collection</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="artisan">
              <Upload className="mr-2 h-4 w-4" />
              Create New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Product Draft</DialogTitle>
              <DialogDescription>
                Start with basic information. You can enhance it with AI tools later.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Basic Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Handwoven Silk Saree"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="textiles">Textiles</SelectItem>
                      <SelectItem value="pottery">Pottery</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="woodwork">Woodwork</SelectItem>
                      <SelectItem value="metalwork">Metalwork</SelectItem>
                      <SelectItem value="paintings">Paintings</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="techniques">Techniques *</Label>
                  <Input
                    id="techniques"
                    value={formData.craftType}
                    onChange={(e) => setFormData(prev => ({ ...prev, craftType: e.target.value }))}
                    placeholder="e.g., Traditional handloom"
                  />
                </div>
                <div>
                  <Label htmlFor="materials">Materials</Label>
                  <Input
                    id="materials"
                    value={formData.materials}
                    onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                    placeholder="e.g., Pure silk, gold thread"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    placeholder="e.g., Varanasi, India"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g., +91 1234567890"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="e.g., @artisan_name"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook Handle</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="e.g., @artisan_name"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="e.g., +91 1234567890"
                  />
                </div>
              </div>

              {/* Optional Fields */}
              <div>
                <Label htmlFor="description">Basic Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your product..."
                  rows={3}
                />
              </div>

              {/* Images */}
              <div>
                <Label htmlFor="images">Product Images (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Label htmlFor="images" className="cursor-pointer text-sm text-blue-600 hover:text-blue-500">
                    Choose Images
                  </Label>
                  {selectedFiles && (
                    <p className="mt-1 text-sm text-green-600">
                      {selectedFiles.length} file(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createProduct} disabled={isLoading}>
                {isLoading && <Upload className="mr-2 h-4 w-4 animate-spin" />}
                Create Draft
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product List */}
      <div className="grid gap-6">
        {products.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-4">Create your first product to get started</p>
              <Button onClick={() => setIsCreateOpen(true)} variant="artisan">
                Create Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded">{product.category}</span>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded">{product.status}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedProduct(product);
                      setIsViewOpen(true);
                    }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedProduct(product);
                      setIsEditOpen(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      setProductToPublish(product);
                      setIsPricingOpen(true);
                    }}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Product Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Materials:</span> {product.materials || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium">Techniques:</span> {product.craftType || 'Not specified'}
                    </div>
                  </div>

                  {/* AI Enhancement Tools */}
                  <div>
                    <h4 className="font-medium mb-3">AI Enhancement Tools</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isLoading || (loadingStates[product.id] && loadingStates[product.id].description)}
                        className={aiResults[product.id] && aiResults[product.id].description ? 'bg-green-50 border-green-200' : ''}
                        onClick={() => handleAIEnhancement(product.id, 'description', product)}
                      >
                        {loadingStates[product.id] && loadingStates[product.id].description ? (
                          <Wand2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4 mr-1" />
                        )}
                        {loadingStates[product.id] && loadingStates[product.id].description ? 'Generating...' : 
                         aiResults[product.id] && aiResults[product.id].description ? 'Enhanced' : 'Description'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isLoading || (loadingStates[product.id] && loadingStates[product.id].story)}
                        className={aiResults[product.id] && aiResults[product.id].story ? 'bg-green-50 border-green-200' : ''}
                        onClick={() => handleAIEnhancement(product.id, 'story', product)}
                      >
                        {loadingStates[product.id] && loadingStates[product.id].story ? (
                          <MessageSquare className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <MessageSquare className="h-4 w-4 mr-1" />
                        )}
                        {loadingStates[product.id] && loadingStates[product.id].story ? 'Generating...' : 
                         aiResults[product.id] && aiResults[product.id].story ? 'Enhanced' : 'Story'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isLoading || (loadingStates[product.id] && loadingStates[product.id].social)}
                        className={aiResults[product.id] && aiResults[product.id].social ? 'bg-green-50 border-green-200' : ''}
                        onClick={() => handleAIEnhancement(product.id, 'social', product)}
                      >
                        {loadingStates[product.id] && loadingStates[product.id].social ? (
                          <Share2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Share2 className="h-4 w-4 mr-1" />
                        )}
                        {loadingStates[product.id] && loadingStates[product.id].social ? 'Generating...' : 
                         aiResults[product.id] && aiResults[product.id].social ? 'Enhanced' : 'Social'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isLoading || (loadingStates[product.id] && loadingStates[product.id].pricing)}
                        className={aiResults[product.id] && aiResults[product.id].pricing ? 'bg-green-50 border-green-200' : ''}
                        onClick={() => handleAIEnhancement(product.id, 'pricing', product)}
                      >
                        {loadingStates[product.id] && loadingStates[product.id].pricing ? (
                          <DollarSign className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <DollarSign className="h-4 w-4 mr-1" />
                        )}
                        {loadingStates[product.id] && loadingStates[product.id].pricing ? 'Generating...' : 
                         aiResults[product.id] && aiResults[product.id].pricing ? 'Enhanced' : 'Pricing'}
                      </Button>
                    </div>

                    {/* AI Generated Content Sections */}
                    <div className="space-y-4">
                      {/* Description Section */}
                      {aiResults[product.id] && aiResults[product.id].description && (
                        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold text-blue-900 flex items-center">
                              <Wand2 className="h-4 w-4 mr-2" />
                              AI-Enhanced Description
                            </h5>
                            <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                              Save Description
                            </Button>
                          </div>
                          <div className="bg-white p-3 rounded border border-blue-200">
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {typeof aiResults[product.id].description === 'string' 
                                ? aiResults[product.id].description 
                                : JSON.stringify(aiResults[product.id].description)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Cultural Story Section */}
                      {aiResults[product.id] && aiResults[product.id].story && (
                        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold text-purple-900 flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Cultural Story
                            </h5>
                            <Button size="sm" variant="outline" className="text-purple-700 border-purple-300">
                              Save Story
                            </Button>
                          </div>
                          <div className="bg-white p-3 rounded border border-purple-200">
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {typeof aiResults[product.id].story === 'string' 
                                ? aiResults[product.id].story 
                                : JSON.stringify(aiResults[product.id].story)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Social Media Section */}
                      {aiResults[product.id] && aiResults[product.id].social && (
                        <div className="border border-pink-200 rounded-lg p-4 bg-pink-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold text-pink-900 flex items-center">
                              <Share2 className="h-4 w-4 mr-2" />
                              Social Media Content
                            </h5>
                            <Button size="sm" variant="outline" className="text-pink-700 border-pink-300">
                              Copy Content
                            </Button>
                          </div>
                          <div className="bg-white p-3 rounded border border-pink-200">
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {typeof aiResults[product.id].social === 'string' 
                                ? aiResults[product.id].social 
                                : JSON.stringify(aiResults[product.id].social)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Pricing Section */}
                      {aiResults[product.id] && aiResults[product.id].pricing && (
                        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold text-green-900 flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Pricing Analysis
                            </h5>
                            <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                              Apply Pricing
                            </Button>
                          </div>
                          <div className="bg-white p-3 rounded border border-green-200">
                            {(() => {
                              const pricingText = typeof aiResults[product.id].pricing === 'string' 
                                ? aiResults[product.id].pricing 
                                : JSON.stringify(aiResults[product.id].pricing);
                              
                              // Parse table format from backend (format: "Label | Value")
                              const lines = pricingText.split('\n').filter(line => line.trim());
                              const tableRows = [];
                              
                              for (const line of lines) {
                                if (line.includes('|')) {
                                  const parts = line.split('|').map(part => part.trim()).filter(part => part);
                                  if (parts.length >= 2) {
                                    tableRows.push(parts);
                                  }
                                }
                              }
                              
                              if (tableRows.length > 0) {
                                return (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <tbody>
                                        {tableRows.map((row, index) => (
                                          <tr key={index} className="border-b border-gray-100">
                                            <td className="py-2 text-gray-700 font-medium">{row[0]}</td>
                                            <td className="py-2 text-right font-semibold text-green-700">{row[1]}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                );
                              } else {
                                return (
                                  <p className="text-sm text-gray-800 leading-relaxed">
                                    {pricingText}
                                  </p>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Voice Narration Section */}
                      {aiResults[product.id] && aiResults[product.id].voice && (
                        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold text-orange-900 flex items-center">
                              <Volume2 className="h-4 w-4 mr-2" />
                              Voice Narration
                            </h5>
                            <Button size="sm" variant="outline" className="text-orange-700 border-orange-300">
                              Download Audio
                            </Button>
                          </div>
                          <div className="bg-white p-3 rounded border border-orange-200">
                            <p className="text-sm text-orange-800">
                              Audio content generated successfully. Ready for customer playback.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Publish Button */}
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      disabled={!aiResults[product.id] || !aiResults[product.id].description}
                      onClick={() => {
                        setProductToPublish(product);
                        setIsPricingOpen(true);
                      }}
                    >
                      {!aiResults[product.id] || !aiResults[product.id].description ? 'Enhance with AI first' : 'Publish to Marketplace'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Product Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              View complete product information and AI enhancements
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Product Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedProduct.name}</div>
                    <div><span className="font-medium">Category:</span> {selectedProduct.category}</div>
                    <div><span className="font-medium">Price:</span> ₹{selectedProduct.price}</div>
                    <div><span className="font-medium">Materials:</span> {selectedProduct.materials}</div>
                    <div><span className="font-medium">Techniques:</span> {selectedProduct.craftType}</div>
                    <div><span className="font-medium">Region:</span> {selectedProduct.region}</div>
                    <div><span className="font-medium">Status:</span> {selectedProduct.status}</div>
                    <div><span className="font-medium">Phone:</span> {selectedProduct.phone}</div>
                    <div><span className="font-medium">Instagram:</span> {selectedProduct.instagram}</div>
                    <div><span className="font-medium">Facebook:</span> {selectedProduct.facebook}</div>
                    <div><span className="font-medium">WhatsApp:</span> {selectedProduct.whatsapp}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Description</h4>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedProduct.description || 'No description available'}
                  </div>
                </div>
              </div>

              {/* AI Generated Content */}
              {(selectedProduct.culturalStory || selectedProduct.socialMediaContent || selectedProduct.pricingSuggestion) && (
                <div>
                  <h4 className="font-medium mb-3">AI Generated Content</h4>
                  <div className="space-y-4">
                    {selectedProduct.culturalStory && (
                      <div>
                        <h5 className="text-sm font-medium text-blue-600 mb-2">Cultural Story</h5>
                        <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                          {selectedProduct.culturalStory}
                        </div>
                      </div>
                    )}
                    
                    {selectedProduct.socialMediaContent && (
                      <div>
                        <h5 className="text-sm font-medium text-purple-600 mb-2">Social Media Content</h5>
                        <div className="text-sm text-gray-700 bg-purple-50 p-3 rounded">
                          {typeof selectedProduct.socialMediaContent === 'object' 
                            ? selectedProduct.socialMediaContent.instagram 
                            : selectedProduct.socialMediaContent}
                        </div>
                      </div>
                    )}
                    
                    {selectedProduct.pricingSuggestion && (
                      <div>
                        <h5 className="text-sm font-medium text-orange-600 mb-2">Pricing Suggestion</h5>
                        <div className="text-sm text-gray-700 bg-orange-50 p-3 rounded">
                          {selectedProduct.pricingSuggestion}
                        </div>
                      </div>
                    )}
                    
                    {selectedProduct.audioUrl && (
                      <div>
                        <h5 className="text-sm font-medium text-red-600 mb-2">Voice Narration</h5>
                        <audio controls className="w-full">
                          <source src={selectedProduct.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update your product information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Basic Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Handwoven Silk Saree"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="textiles">Textiles</SelectItem>
                    <SelectItem value="pottery">Pottery</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="woodwork">Woodwork</SelectItem>
                    <SelectItem value="metalwork">Metalwork</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-techniques">Techniques *</Label>
                <Input
                  id="edit-techniques"
                  value={formData.craftType}
                  onChange={(e) => setFormData(prev => ({ ...prev, craftType: e.target.value }))}
                  placeholder="e.g., Traditional handloom"
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="1000"
                />
              </div>
              <div>
                <Label htmlFor="edit-materials">Materials</Label>
                <Input
                  id="edit-materials"
                  value={formData.materials}
                  onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                  placeholder="e.g., Pure silk, gold thread"
                />
              </div>
              <div>
                <Label htmlFor="edit-region">Region</Label>
                <Input
                  id="edit-region"
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="e.g., Varanasi, India"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g., +91 1234567890"
                />
              </div>
              <div>
                <Label htmlFor="edit-instagram">Instagram Handle</Label>
                <Input
                  id="edit-instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="e.g., @artisan_name"
                />
              </div>
              <div>
                <Label htmlFor="edit-facebook">Facebook Handle</Label>
                <Input
                  id="edit-facebook"
                  value={formData.facebook}
                  onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                  placeholder="e.g., @artisan_name"
                />
              </div>
              <div>
                <Label htmlFor="edit-whatsapp">WhatsApp Number</Label>
                <Input
                  id="edit-whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="e.g., +91 1234567890"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your product..."
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="edit-images">Product Images</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                <Input
                  id="edit-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Label htmlFor="edit-images" className="cursor-pointer text-sm text-blue-600 hover:text-blue-500">
                  Click to upload new images
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
              
              {/* Current Images */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {previewImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateProduct} disabled={isLoading}>
              {isLoading && <Upload className="mr-2 h-4 w-4 animate-spin" />}
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricing Dialog */}
      <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pricing</DialogTitle>
            <DialogDescription>
              Set your final price before publishing
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="final-price">Final Price (₹)</Label>
              <Input
                id="final-price"
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(parseFloat(e.target.value))}
                placeholder="1000"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPricingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handlePublishProduct(productToPublish!)}>
              Publish to Marketplace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDraftManager;
