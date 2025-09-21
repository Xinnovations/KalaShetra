import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { Search, Filter, Heart, Play, MapPin, Star } from "lucide-react";

const Marketplace = () => {
  const products = [
    {
      id: 1,
      title: "Handwoven Bamboo Basket",
      artisan: "Priya Devi",
      location: "Assam, India",
      price: "₹1,250",
      image: "/placeholder.svg",
      rating: 4.8,
      heritage: "Traditional Assamese weaving technique passed down through 5 generations",
      tags: ["Eco-friendly", "Handmade", "Traditional"]
    },
    {
      id: 2,
      title: "Kashmiri Pashmina Shawl",
      artisan: "Mohammed Khan",
      location: "Srinagar, Kashmir",
      price: "₹8,500",
      image: "/placeholder.svg",
      rating: 4.9,
      heritage: "Hand-spun from finest Himalayan goat fiber using 400-year-old techniques",
      tags: ["Luxury", "Heritage", "Warmth"]
    },
    {
      id: 3,
      title: "Madhubani Painting",
      artisan: "Sunita Kumari",
      location: "Mithila, Bihar",
      price: "₹2,750",
      image: "/placeholder.svg",
      rating: 4.7,
      heritage: "Ancient art form depicting Hindu mythology with natural dyes and brushes",
      tags: ["Art", "Mythology", "Natural Dyes"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-heritage">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Discover Authentic Crafts
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Explore handmade treasures from talented artisans across India. Each piece comes with its unique story, 
            told through AI-powered narratives in your preferred language.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search by craft type, region, or artisan..." 
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button variant="golden" size="lg">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="border-heritage-bronze/20 shadow-cultural hover:shadow-warm transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-heritage-saffron"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <div className="absolute top-4 left-4">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="mr-1 mb-1 bg-white/90">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{product.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{product.artisan} • {product.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-heritage-saffron text-heritage-saffron" />
                          <span className="ml-1 text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-2xl font-display font-bold text-primary">{product.price}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-base mb-4 line-clamp-2">
                    {product.heritage}
                  </CardDescription>
                  
                  <div className="flex gap-3">
                    <Button variant="customer" className="flex-1">
                      <Play className="mr-2 h-4 w-4" />
                      Listen to Story
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-semibold mb-12">
            Why Choose KalaShetra Marketplace?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Voice Stories</h3>
              <p className="text-muted-foreground">
                Listen to each artisan's story in your preferred language, bringing their heritage to life.
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-heritage-emerald/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-heritage-emerald" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Authentic Heritage</h3>
              <p className="text-muted-foreground">
                Every product comes with its cultural backstory, connecting you to India's rich traditions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-heritage-saffron/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-heritage-saffron" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Support Local Artisans</h3>
              <p className="text-muted-foreground">
                Directly support skilled craftspeople and help preserve traditional art forms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Marketplace;