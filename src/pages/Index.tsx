import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { 
  Wand2, 
  Globe, 
  Mic, 
  Share2, 
  BarChart3, 
  Heart, 
  ArrowRight,
  Users,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import kalashetraLogo from "@/assets/kalashetra-logo.jpeg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-heritage">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <img 
              src={kalashetraLogo} 
              alt="KalaShetra Logo" 
              className="h-20 w-auto mx-auto mb-6"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
            Empowering Artisans with
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              AI-Powered Storytelling
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            KalaShetra bridges traditional craftsmanship with modern digital markets. 
            Our AI transforms simple product photos into compelling multilingual stories, 
            helping artisans reach global customers while preserving cultural heritage.
          </p>

          <div className="flex justify-center mb-8">
            <Button variant="outline" size="xl" className="text-lg px-8 py-4">
              Learn More About Our Mission
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button variant="artisan" size="xl" className="px-8 py-4 text-lg" asChild>
              <Link to="/login">
                <Users className="mr-2 h-5 w-5" />
                Artisan Dashboard
              </Link>
            </Button>
            <Button variant="customer" size="xl" className="px-8 py-4 text-lg" asChild>
              <Link to="/login">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Visit Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
              Powered by Gemini AI & Google Cloud
            </Badge>
            <h2 className="text-4xl font-display font-bold mb-6">
              Revolutionary AI Tools for Artisans
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive suite of AI tools helps artisans showcase their work beautifully, 
              tell their stories compellingly, and reach customers globally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Product Description Generator */}
            <Card className="border-heritage-bronze/20 shadow-cultural hover:shadow-warm transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-4 bg-primary/10 rounded-lg w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Wand2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">AI Description Generator</CardTitle>
                    <Badge variant="secondary" className="mt-1">Gemini AI</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Transform simple product photos and notes into professional, marketplace-ready descriptions 
                  that capture the essence and story of each handcrafted piece.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Cultural Storytelling Assistant */}
            <Card className="border-heritage-bronze/20 shadow-cultural hover:shadow-warm transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-4 bg-heritage-emerald/10 rounded-lg w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-8 w-8 text-heritage-emerald" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Cultural Storytelling</CardTitle>
                    <Badge variant="secondary" className="mt-1">Heritage AI</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Create compelling backstories about heritage, tradition, and the artisan's personal journey, 
                  connecting customers to the cultural significance of each craft.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Multilingual Translation */}
            <Card className="border-heritage-bronze/20 shadow-cultural hover:shadow-warm transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-4 bg-accent/10 rounded-lg w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Globe className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Multilingual Translation</CardTitle>
                    <Badge variant="secondary" className="mt-1">Google Translate</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Automatically translate stories into regional and global languages including Hindi, Tamil, 
                  French, Japanese, expanding your reach to international markets.
                </CardDescription>
              </CardContent>
            </Card>

            {/* AI Voice Assistant */}
            <Card className="border-heritage-bronze/20 shadow-cultural hover:shadow-warm transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-4 bg-secondary/10 rounded-lg w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Mic className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Voice Storytelling</CardTitle>
                    <Badge variant="secondary" className="mt-1">Google TTS</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Convert your stories into natural voice narrations, making content accessible to non-readers 
                  and creating deeper emotional connections with customers.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Social Media Booster */}
            <Card className="border-heritage-bronze/20 shadow-cultural hover:shadow-warm transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-4 bg-heritage-saffron/10 rounded-lg w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Share2 className="h-8 w-8 text-heritage-saffron" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Social Media Booster</CardTitle>
                    <Badge variant="secondary" className="mt-1">AI Generated</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Generate ready-to-post Instagram captions, hashtags, and Facebook posts that showcase 
                  your crafts and drive engagement on social media platforms.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Analytics Dashboard */}
            <Card className="border-heritage-bronze/20 shadow-cultural hover:shadow-warm transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-4 bg-heritage-bronze/10 rounded-lg w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-8 w-8 text-heritage-bronze" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Smart Analytics</CardTitle>
                    <Badge variant="secondary" className="mt-1">Real-time Data</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track how customers interact with your stories - views, listens, shares, and more. 
                  Understand what resonates with your audience to optimize your content.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Preserving Heritage, Empowering Artisans
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            KalaShetra isn't just a marketplace - it's a movement to preserve traditional crafts 
            and empower rural artisans with modern AI technology.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="p-6 bg-primary/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Cultural Preservation</h3>
              <p className="text-muted-foreground text-lg">
                Every story told helps preserve traditional crafts and cultural heritage for future generations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-6 bg-heritage-emerald/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-12 w-12 text-heritage-emerald" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Artisan Empowerment</h3>
              <p className="text-muted-foreground text-lg">
                AI tools level the playing field, giving rural artisans access to global marketing capabilities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-6 bg-heritage-saffron/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Globe className="h-12 w-12 text-heritage-saffron" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Global Reach</h3>
              <p className="text-muted-foreground text-lg">
                Multilingual storytelling breaks down language barriers, connecting artisans to worldwide markets.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <Button variant="artisan" size="xl" asChild>
              <Link to="/login">
                Join the KalaShetra Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;