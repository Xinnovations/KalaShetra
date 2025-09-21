import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, ImagePlus } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ProductUpload = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    materials: '',
    techniques: '',
    description: '',
    price: '',
    region: '',
    artisan_name: '',
    artisan_story: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in product name, category, and select at least one image.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const uploadFormData = new FormData();
      
      // Add product data
      Object.entries(formData).forEach(([key, value]) => {
        uploadFormData.append(key, value);
      });

      // Add files
      Array.from(selectedFiles).forEach((file, index) => {
        uploadFormData.append(`images`, file);
      });

      const response = await apiService.createProduct(uploadFormData);
      
      toast({
        title: "Success!",
        description: "Product uploaded successfully",
      });

      // Reset form
      setFormData({
        name: '',
        category: '',
        materials: '',
        techniques: '',
        description: '',
        price: '',
        region: '',
        artisan_name: '',
        artisan_story: ''
      });
      setSelectedFiles(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to upload product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="artisan" size="xl" className="mb-12">
          <Upload className="mr-2 h-5 w-5" />
          Upload New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Product</DialogTitle>
          <DialogDescription>
            Add your handcrafted product to the marketplace with detailed information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Images */}
          <div>
            <Label htmlFor="images" className="text-base font-medium">Product Images *</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="images"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  Choose Images
                </Label>
                <p className="mt-2 text-sm text-gray-500">
                  Upload multiple images of your product (PNG, JPG, JPEG)
                </p>
                {selectedFiles && (
                  <p className="mt-2 text-sm text-green-600">
                    {selectedFiles.length} file(s) selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Handwoven Silk Saree"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => handleInputChange('category', value)}>
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
                  <SelectItem value="sculptures">Sculptures</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Materials */}
            <div>
              <Label htmlFor="materials">Materials</Label>
              <Input
                id="materials"
                value={formData.materials}
                onChange={(e) => handleInputChange('materials', e.target.value)}
                placeholder="e.g., Pure silk, gold thread"
              />
            </div>

            {/* Techniques */}
            <div>
              <Label htmlFor="techniques">Techniques</Label>
              <Input
                id="techniques"
                value={formData.techniques}
                onChange={(e) => handleInputChange('techniques', e.target.value)}
                placeholder="e.g., Traditional handloom weaving"
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="e.g., 5000"
              />
            </div>

            {/* Region */}
            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="e.g., Varanasi, Uttar Pradesh"
              />
            </div>
          </div>

          {/* Product Description */}
          <div>
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your product, its unique features, and craftsmanship..."
              rows={4}
            />
          </div>

          {/* Artisan Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Artisan Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="artisan_name">Artisan Name</Label>
                <Input
                  id="artisan_name"
                  value={formData.artisan_name}
                  onChange={(e) => handleInputChange('artisan_name', e.target.value)}
                  placeholder="Your name or workshop name"
                />
              </div>
              <div>
                <Label htmlFor="artisan_story">Artisan Story</Label>
                <Textarea
                  id="artisan_story"
                  value={formData.artisan_story}
                  onChange={(e) => handleInputChange('artisan_story', e.target.value)}
                  placeholder="Tell your story, heritage, and journey as an artisan..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductUpload;
