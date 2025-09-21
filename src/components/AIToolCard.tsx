import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AIToolCardProps {
  icon: React.ReactNode;
  title: string;
  badge: string;
  description: string;
  variant: "cultural" | "heritage" | "golden" | "artisan";
  toolType: "description" | "story" | "translate" | "social" | "pricing" | "voice";
}

const AIToolCard = ({ icon, title, badge, description, variant, toolType }: AIToolCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    materials: '',
    techniques: '',
    description: '',
    craft_type: '',
    region: '',
    personal_story: '',
    traditions: '',
    text: '',
    target_language: '',
    product_name: '',
    platform: '',
    style: '',
    size: '',
    time_to_make: '',
    language: '',
    voice_type: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let response;
      
      switch (toolType) {
        case 'description':
          response = await apiService.generateProductDescription({
            name: formData.name,
            category: formData.category,
            materials: formData.materials,
            techniques: formData.techniques,
            description: formData.description
          });
          break;
          
        case 'story':
          response = await apiService.generateCulturalStory({
            craft_type: formData.craft_type,
            region: formData.region,
            personal_story: formData.personal_story,
            traditions: formData.traditions
          });
          break;
          
        case 'translate':
          response = await apiService.translateContent({
            text: formData.text,
            target_language: formData.target_language
          });
          break;
          
        case 'social':
          response = await apiService.generateSocialMediaContent({
            product_name: formData.product_name,
            description: formData.description,
            platform: formData.platform,
            style: formData.style
          });
          break;
          
        case 'pricing':
          response = await apiService.getPricingSuggestion({
            product_name: formData.product_name,
            category: formData.category,
            materials: formData.materials,
            size: formData.size,
            time_to_make: formData.time_to_make,
            region: formData.region,
            craftType: formData.craft_type || formData.techniques || 'Traditional craft'
          });
          break;
          
        case 'voice':
          response = await apiService.generateVoiceNarration({
            text: formData.text,
            language: formData.language,
            voice_type: formData.voice_type
          });
          break;
          
        default:
          throw new Error('Unknown tool type');
      }
      
      setResult(response.result || response.content || response.translation || response.pricing || 'Generated successfully!');
      toast({
        title: "Success!",
        description: `${title} generated successfully`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (toolType) {
      case 'description':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Handwoven Silk Saree"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
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
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="materials">Materials</Label>
              <Input
                id="materials"
                value={formData.materials}
                onChange={(e) => handleInputChange('materials', e.target.value)}
                placeholder="e.g., Pure silk, gold thread"
              />
            </div>
            <div>
              <Label htmlFor="techniques">Techniques</Label>
              <Input
                id="techniques"
                value={formData.techniques}
                onChange={(e) => handleInputChange('techniques', e.target.value)}
                placeholder="e.g., Traditional handloom weaving"
              />
            </div>
            <div>
              <Label htmlFor="description">Brief Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Any additional details about your product..."
              />
            </div>
          </div>
        );
        
      case 'story':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="craft_type">Craft Type</Label>
              <Input
                id="craft_type"
                value={formData.craft_type}
                onChange={(e) => handleInputChange('craft_type', e.target.value)}
                placeholder="e.g., Handloom weaving"
              />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="e.g., Varanasi, Uttar Pradesh"
              />
            </div>
            <div>
              <Label htmlFor="personal_story">Personal Story (Optional)</Label>
              <Textarea
                id="personal_story"
                value={formData.personal_story}
                onChange={(e) => handleInputChange('personal_story', e.target.value)}
                placeholder="Tell us about your journey as an artisan..."
              />
            </div>
            <div>
              <Label htmlFor="traditions">Traditions (Optional)</Label>
              <Textarea
                id="traditions"
                value={formData.traditions}
                onChange={(e) => handleInputChange('traditions', e.target.value)}
                placeholder="Describe the traditional techniques and heritage..."
              />
            </div>
          </div>
        );
        
      case 'translate':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text to Translate</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => handleInputChange('text', e.target.value)}
                placeholder="Enter the text you want to translate..."
              />
            </div>
            <div>
              <Label htmlFor="target_language">Target Language</Label>
              <Select onValueChange={(value) => handleInputChange('target_language', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="bengali">Bengali</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'social':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="product_name">Product Name</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => handleInputChange('product_name', e.target.value)}
                placeholder="e.g., Handwoven Silk Saree"
              />
            </div>
            <div>
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your product..."
              />
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select onValueChange={(value) => handleInputChange('platform', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'pricing':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="product_name">Product Name</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => handleInputChange('product_name', e.target.value)}
                placeholder="e.g., Handwoven Silk Saree"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
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
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="materials">Materials</Label>
              <Input
                id="materials"
                value={formData.materials}
                onChange={(e) => handleInputChange('materials', e.target.value)}
                placeholder="e.g., Pure silk, gold thread"
              />
            </div>
            <div>
              <Label htmlFor="size">Size/Dimensions</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                placeholder="e.g., 6 yards, Medium, 12x8 inches"
              />
            </div>
            <div>
              <Label htmlFor="time_to_make">Time to Make</Label>
              <Input
                id="time_to_make"
                value={formData.time_to_make}
                onChange={(e) => handleInputChange('time_to_make', e.target.value)}
                placeholder="e.g., 2 weeks, 5 days"
              />
            </div>
          </div>
        );
        
      case 'voice':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text for Voice Narration</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => handleInputChange('text', e.target.value)}
                placeholder="Enter the text you want to convert to speech..."
              />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="border-heritage-bronze/20 shadow-cultural hover:shadow-warm transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <Badge variant="secondary" className="mt-1">{badge}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-4">
          {description}
        </CardDescription>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={variant} className="w-full">
              {title.split(' ')[0]} {title.includes('Generate') ? '' : title.split(' ').slice(1).join(' ')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                Fill in the details below to generate your content using AI.
              </DialogDescription>
            </DialogHeader>
            
            {renderForm()}
            
            {result && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <Label className="text-sm font-medium">Generated Result:</Label>
                <div className="mt-2 whitespace-pre-wrap text-sm">{result}</div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AIToolCard;
