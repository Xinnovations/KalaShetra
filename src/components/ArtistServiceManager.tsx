import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiService } from '@/services/api';
import { Upload, Eye, Edit, Trash2, Wand2, MessageSquare, Share2, DollarSign, Volume2, Video, Image as ImageIcon, Calendar, Clock, Users } from 'lucide-react';

interface ArtistService {
  id: string;
  title: string;
  description: string;
  artType: string;
  specialization: string;
  hourlyRate: number;
  region: string;
  artisanId: string;
  artisanName: string;
  images: string[];
  videos: string[];
  phone: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  available: boolean;
  minBookingHours: number;
  maxBookingHours: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  views?: number;
  bookings?: number;
  rating?: number;
  culturalStory?: string;
  socialMediaContent?: string;
  pricingSuggestion?: string;
  audioUrl?: string;
  ai_description?: string;
  enhanced_description?: string;
  cultural_story?: string;
  social_content?: string;
}

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  eventDate: string;
  duration: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Comment {
  id: string;
  serviceId: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: string;
}

const ArtistServiceManager: React.FC = () => {
  const [services, setServices] = useState<ArtistService[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedServiceForView, setSelectedServiceForView] = useState<ArtistService | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [audioSummary, setAudioSummary] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [comments, setComments] = useState<{[key: string]: any[]}>({});
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    artType: '',
    specialization: '',
    hourlyRate: '',
    region: '',
    phone: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    minBookingHours: '1',
    maxBookingHours: '8'
  });

  const artTypes = [
    'Classical Dance',
    'Folk Dance',
    'Contemporary Dance',
    'Theater Acting',
    'Film Acting',
    'Voice Acting',
    'Classical Music',
    'Folk Music',
    'Contemporary Music',
    'Painting',
    'Sculpture',
    'Traditional Crafts',
    'Photography',
    'Storytelling',
    'Poetry',
    'Comedy'
  ];

  useEffect(() => {
    fetchServices();
    fetchBookings();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getServices({ artisanId: 'artisan-001' });
      setServices(response.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load your services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await apiService.getBookings('artisan-001');
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'videos') => {
    const files = Array.from(e.target.files || []);
    if (type === 'images') {
      setSelectedFiles(files);
    } else {
      setSelectedVideos(files);
    }
  };

  const uploadFiles = async (files: File[], type: 'images' | 'videos') => {
    if (files.length === 0) return [];

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadType', type === 'videos' ? 'videos' : 'products');
      
      const response = await apiService.uploadSingle(formData);
      return response.imageUrl;
    });

    return Promise.all(uploadPromises);
  };

  const createService = async () => {
    try {
      if (!formData.title || !formData.description || !formData.artType || !formData.hourlyRate) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);

      // Upload files
      const imageUrls = await uploadFiles(selectedFiles, 'images');
      const videoUrls = await uploadFiles(selectedVideos, 'videos');

      const serviceData = {
        title: formData.title,
        description: formData.description,
        artType: formData.artType,
        specialization: formData.specialization,
        hourlyRate: parseFloat(formData.hourlyRate),
        minBookingHours: parseInt(formData.minBookingHours),
        maxBookingHours: parseInt(formData.maxBookingHours),
        region: formData.region,
        phoneNumber: formData.phone,
        instagramHandle: formData.instagram,
        facebookHandle: formData.facebook,
        whatsappNumber: formData.whatsapp,
        artisanId: 'artisan-001',
        artisanName: 'Demo Artisan',
        images: imageUrls,
        videos: videoUrls,
        status: 'draft'
      };

      await apiService.createService(serviceData);
      
      toast({
        title: "Success!",
        description: "Your service has been created successfully.",
      });

      setIsCreateDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      artType: '',
      specialization: '',
      hourlyRate: '',
      region: '',
      phone: '',
      instagram: '',
      facebook: '',
      whatsapp: '',
      minBookingHours: '1',
      maxBookingHours: '8'
    });
    setSelectedFiles([]);
    setSelectedVideos([]);
  };

  const enhanceWithAI = async (serviceId: string, enhancementType: string) => {
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      let response;
      switch (enhancementType) {
        case 'description':
          response = await apiService.generateProductDescription({
            productName: service.title,
            basicDescription: service.description,
            materials: service.specialization,
            craftType: service.artType,
            region: service.region
          });
          break;
        case 'story':
          response = await apiService.generateCulturalStory({
            craftType: service.artType,
            region: service.region,
            personalStory: service.description,
            tradition: service.specialization
          });
          break;
        case 'social':
          response = await apiService.generateSocialMediaContent({
            productName: service.title,
            description: service.description,
            craftType: service.artType,
            platform: 'instagram'
          });
          break;
        case 'pricing':
          response = await apiService.generatePricingAnalysis({
            productName: service.title,
            materials: service.specialization,
            craftType: service.artType,
            currentPrice: service.hourlyRate
          });
          break;
      }
      
      // Update service with AI enhancement
      const updateData: any = {};
      if (enhancementType === 'description') updateData.enhanced_description = response.description;
      if (enhancementType === 'story') updateData.cultural_story = response.content;
      if (enhancementType === 'social') updateData.social_content = response.content;
      if (enhancementType === 'pricing') updateData.pricingSuggestion = response.analysis;

      await apiService.updateService(serviceId, updateData);
      
      toast({
        title: "AI Enhancement Complete!",
        description: `Your service has been enhanced with AI-generated ${enhancementType}.`,
      });

      fetchServices();
    } catch (error) {
      console.error('Error enhancing with AI:', error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance with AI. Please try again.",
        variant: "destructive",
      });
    }
  };

  const publishService = async (serviceId: string) => {
    try {
      await apiService.updateService(serviceId, { status: 'published' });
      toast({
        title: "Service Published!",
        description: "Your service is now live and available for booking.",
      });
      fetchServices();
    } catch (error) {
      console.error('Error publishing service:', error);
      toast({
        title: "Publishing Failed",
        description: "Failed to publish service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openViewDetails = (service: ArtistService) => {
    setSelectedServiceForView(service);
    setIsViewDetailsOpen(true);
  };

  const playAudioSummary = async () => {
    try {
      setIsPlayingAudio(true);
      const response = await apiService.getAudioSummary(selectedServiceForView.id);
      setAudioSummary(response.audioSummary);
    } catch (error) {
      console.error('Error playing audio summary:', error);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const stopAudioSummary = () => {
    setIsPlayingAudio(false);
  };

  const addComment = async () => {
    try {
      setIsAddingComment(true);
      const response = await apiService.addComment(selectedServiceForView.id, newComment);
      const comment = response.comment;
      setComments(prev => ({ ...prev, [selectedServiceForView.id]: [...(prev[selectedServiceForView.id] || []), comment] }));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Artist Services</h2>
          <p className="text-gray-600 mt-2">Manage your performance and art services</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Upload className="w-4 h-4 mr-2" />
              Create New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Artist Service</DialogTitle>
              <DialogDescription>
                Create a new service offering for customers to book your artistic talents.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Classical Bharatanatyam Performance"
                  />
                </div>
                <div>
                  <Label htmlFor="artType">Art Type *</Label>
                  <Select value={formData.artType} onValueChange={(value) => handleInputChange('artType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select art type" />
                    </SelectTrigger>
                    <SelectContent>
                      {artTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your service, what you offer, and what makes you unique..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    placeholder="e.g., Wedding performances, Corporate events"
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate (₹) *</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    placeholder="2000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    placeholder="e.g., Mumbai, Maharashtra"
                  />
                </div>
                <div>
                  <Label htmlFor="minBookingHours">Min Hours</Label>
                  <Input
                    id="minBookingHours"
                    type="number"
                    value={formData.minBookingHours}
                    onChange={(e) => handleInputChange('minBookingHours', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxBookingHours">Max Hours</Label>
                  <Input
                    id="maxBookingHours"
                    type="number"
                    value={formData.maxBookingHours}
                    onChange={(e) => handleInputChange('maxBookingHours', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    placeholder="@artist_name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook Handle</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    placeholder="@artist_name"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="images">Portfolio Images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'images')}
                  />
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">{selectedFiles.length} image(s) selected</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="videos">Portfolio Videos</Label>
                  <Input
                    id="videos"
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, 'videos')}
                  />
                  {selectedVideos.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">{selectedVideos.length} video(s) selected</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createService} disabled={isUploading}>
                {isUploading ? 'Creating...' : 'Create Service'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className="inline-flex items-center">
                      <Badge variant="secondary" className="mr-2">{service.artType}</Badge>
                      <span className="text-sm">₹{service.hourlyRate}/hour</span>
                    </span>
                  </CardDescription>
                </div>
                <Badge variant={service.status === 'published' ? 'default' : 'secondary'}>
                  {service.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
              
              {/* Media Preview */}
              <div className="flex gap-2 mb-4">
                {service.images.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    {service.images.length} photos
                  </Badge>
                )}
                {service.videos.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Video className="w-3 h-3 mr-1" />
                    {service.videos.length} videos
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {service.views || 0} views
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {service.bookings || 0} bookings
                </span>
              </div>

              {/* AI Enhancement Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => enhanceWithAI(service.id, 'description')}
                  className={service.enhanced_description ? 'bg-green-50 border-green-200' : ''}
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Description
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => enhanceWithAI(service.id, 'story')}
                  className={service.cultural_story ? 'bg-green-50 border-green-200' : ''}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Story
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => enhanceWithAI(service.id, 'social')}
                  className={service.social_content ? 'bg-green-50 border-green-200' : ''}
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  Social
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => enhanceWithAI(service.id, 'pricing')}
                  className={service.pricingSuggestion ? 'bg-green-50 border-green-200' : ''}
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  Pricing
                </Button>
              </div>

              {/* AI Generated Content Display */}
              {service.enhanced_description && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-sm text-blue-800 mb-2">AI Enhanced Description:</h4>
                  <p className="text-sm text-gray-700">{service.enhanced_description}</p>
                </div>
              )}

              {service.cultural_story && (
                <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-sm text-purple-800 mb-2">Cultural Story:</h4>
                  <p className="text-sm text-gray-700">{service.cultural_story}</p>
                </div>
              )}

              {service.social_content && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-sm text-green-800 mb-2">Social Media Content:</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{service.social_content}</pre>
                </div>
              )}

              {service.pricingSuggestion && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-sm text-orange-800 mb-2">Pricing Analysis:</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{service.pricingSuggestion}</pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {service.status === 'draft' && (
                  <Button
                    size="sm"
                    onClick={() => publishService(service.id)}
                    className="bg-orange-500 hover:bg-orange-600 flex-1"
                  >
                    Publish Service
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => openViewDetails(service)}>
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      {bookings.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
          <div className="grid gap-4">
            {bookings.slice(0, 5).map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{booking.serviceName}</h4>
                      <p className="text-sm text-gray-600">Customer: {booking.customerName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.eventDate).toLocaleDateString()} • {booking.duration} hours
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{booking.totalAmount}</p>
                      <Badge variant={booking.status === 'pending' ? 'secondary' : 'default'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {services.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-600 mb-4">Create your first artist service to start receiving bookings.</p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600">
            Create Your First Service
          </Button>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Service Details</DialogTitle>
            <DialogDescription>
              View comprehensive information about your service including media, AI content, and comments.
            </DialogDescription>
          </DialogHeader>
          
          {selectedServiceForView && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-lg">{selectedServiceForView.title}</h4>
                  <p className="text-gray-600 mb-2">{selectedServiceForView.description}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{selectedServiceForView.artType}</Badge>
                    <Badge variant="outline">₹{selectedServiceForView.hourlyRate}/hr</Badge>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Media</h5>
                  <div className="flex gap-2">
                    {selectedServiceForView.images.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {selectedServiceForView.images.length} photos
                      </Badge>
                    )}
                    {selectedServiceForView.videos.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Video className="w-3 h-3 mr-1" />
                        {selectedServiceForView.videos.length} videos
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Media Gallery */}
              {(selectedServiceForView.images.length > 0 || selectedServiceForView.videos.length > 0) && (
                <div>
                  <h5 className="font-medium mb-3">Media Gallery</h5>
                  
                  {/* Images */}
                  {selectedServiceForView.images.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-sm font-medium mb-2">Photos ({selectedServiceForView.images.length})</h6>
                      <div className="relative">
                        <img 
                          src={`http://localhost:5001${selectedServiceForView.images[currentImageIndex]}`}
                          alt={`${selectedServiceForView.title} - Image ${currentImageIndex + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        {selectedServiceForView.images.length > 1 && (
                          <>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                              {selectedServiceForView.images.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={`w-2 h-2 rounded-full ${
                                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                            <button
                              onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
                              disabled={currentImageIndex === 0}
                            >
                              ←
                            </button>
                            <button
                              onClick={() => setCurrentImageIndex(Math.min(selectedServiceForView.images.length - 1, currentImageIndex + 1))}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
                              disabled={currentImageIndex === selectedServiceForView.images.length - 1}
                            >
                              →
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {selectedServiceForView.videos.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-sm font-medium mb-2">Videos ({selectedServiceForView.videos.length})</h6>
                      <div className="relative">
                        <video 
                          src={`http://localhost:5001${selectedServiceForView.videos[currentVideoIndex]}`}
                          controls
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        {selectedServiceForView.videos.length > 1 && (
                          <div className="mt-2 flex gap-2">
                            {selectedServiceForView.videos.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentVideoIndex(index)}
                                className={`px-3 py-1 text-xs rounded ${
                                  index === currentVideoIndex 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                Video {index + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Generated Content */}
              {(selectedServiceForView.enhanced_description || selectedServiceForView.cultural_story || selectedServiceForView.social_content) && (
                <div>
                  <h5 className="font-medium mb-3">AI Enhanced Content</h5>
                  
                  {selectedServiceForView.enhanced_description && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h6 className="font-medium text-sm text-blue-800 mb-2">Enhanced Description</h6>
                      <p className="text-sm text-gray-700">{selectedServiceForView.enhanced_description}</p>
                    </div>
                  )}

                  {selectedServiceForView.cultural_story && (
                    <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h6 className="font-medium text-sm text-purple-800 mb-2">Cultural Story</h6>
                      <p className="text-sm text-gray-700">{selectedServiceForView.cultural_story}</p>
                    </div>
                  )}

                  {selectedServiceForView.social_content && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h6 className="font-medium text-sm text-green-800 mb-2">Social Media Content</h6>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedServiceForView.social_content}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* AI Audio Summary */}
              <div>
                <h5 className="font-medium mb-3">AI Audio Summary</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Listen to an AI-generated summary about this art form and artist
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={playAudioSummary} 
                    disabled={isPlayingAudio || !audioSummary}
                    size="sm"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    {isPlayingAudio ? 'Playing...' : 'Play Summary'}
                  </Button>
                  {isPlayingAudio && (
                    <Button onClick={stopAudioSummary} variant="outline" size="sm">
                      Stop
                    </Button>
                  )}
                </div>
                {audioSummary && (
                  <div className="mt-3 p-3 bg-gray-50 border rounded-lg">
                    <p className="text-sm text-gray-700">{audioSummary}</p>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div>
                <h5 className="font-medium mb-3">Comments & Reviews</h5>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {comments[selectedServiceForView.id]?.map((comment) => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-800 mb-1">{comment.text}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">{comment.userName}</span>
                        <span>•</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
                  )}
                </div>
                
                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addComment()}
                  />
                  <Button 
                    onClick={addComment} 
                    disabled={isAddingComment || !newComment.trim()}
                    size="sm"
                  >
                    {isAddingComment ? 'Adding...' : 'Comment'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistServiceManager;
