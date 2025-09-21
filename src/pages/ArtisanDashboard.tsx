import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import ProductDraftManager from "@/components/ProductDraftManager";
import ArtistServiceManager from "@/components/ArtistServiceManager";
import { Upload, Wand2, Globe, Share2, BarChart3, Mic, DollarSign, Package, Users, TrendingUp, Target, Lightbulb, Star, Eye, Heart } from "lucide-react";
import { useState } from "react";

const ArtisanDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'analytics'>('products');

  return (
    <div className="min-h-screen bg-gradient-heritage">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Artisan Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create products, enhance them with AI tools, and publish to the marketplace.
            Start with basic info, then use AI to create professional descriptions and stories.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8">
        <Button
          variant={activeTab === 'products' ? 'default' : 'outline'}
          onClick={() => setActiveTab('products')}
          className="flex items-center space-x-2"
        >
          <Package className="w-4 h-4" />
          <span>Products</span>
        </Button>
        <Button
          variant={activeTab === 'services' ? 'default' : 'outline'}
          onClick={() => setActiveTab('services')}
          className="flex items-center space-x-2"
        >
          <Users className="w-4 h-4" />
          <span>Artist Services</span>
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analytics')}
          className="flex items-center space-x-2"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </Button>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 pb-12">
        {activeTab === 'products' && <ProductDraftManager />}
        {activeTab === 'services' && <ArtistServiceManager />}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Business Growth Tips */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-blue-900">Business Growth Tips</CardTitle>
                </div>
                <CardDescription className="text-blue-700">
                  AI-powered insights to grow your artisan business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Increase Visibility</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Add more product images and use AI-generated cultural stories to increase customer engagement by 40%
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-orange-600" />
                      <h4 className="font-semibold text-gray-900">Optimize Pricing</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Use AI pricing suggestions to find the sweet spot - products priced 15-20% higher show better perceived value
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Share2 className="h-4 w-4 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Social Media Boost</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Generate Instagram content with AI - posts with cultural stories get 3x more engagement
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <h4 className="font-semibold text-gray-900">Quality Focus</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Products with detailed descriptions and multiple images have 60% higher conversion rates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Analytics */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Product Views</CardTitle>
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-1">2,847</div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-green-600">+12%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{width: '68%'}}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Customer Interest</CardTitle>
                    <Heart className="h-4 w-4 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-1">156</div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-green-600">+8%</span>
                    <span className="text-gray-500 ml-1">favorites added</span>
                  </div>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-red-600 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">AI Enhancement Usage</CardTitle>
                    <Wand2 className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-1">89%</div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-green-600">+15%</span>
                    <span className="text-gray-500 ml-1">AI tools used</span>
                  </div>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{width: '89%'}}></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Monthly Growth Trend</span>
                </CardTitle>
                <CardDescription>
                  Track your business performance over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end space-x-2 h-32">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-blue-600 rounded-t" style={{height: '60px', width: '40px'}}></div>
                    <span className="text-xs text-gray-500">Jan</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-blue-600 rounded-t" style={{height: '75px', width: '40px'}}></div>
                    <span className="text-xs text-gray-500">Feb</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-blue-600 rounded-t" style={{height: '85px', width: '40px'}}></div>
                    <span className="text-xs text-gray-500">Mar</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-blue-600 rounded-t" style={{height: '95px', width: '40px'}}></div>
                    <span className="text-xs text-gray-500">Apr</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-blue-600 rounded-t" style={{height: '105px', width: '40px'}}></div>
                    <span className="text-xs text-gray-500">May</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-blue-600 rounded-t" style={{height: '120px', width: '40px'}}></div>
                    <span className="text-xs text-gray-500">Jun</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-green-600">+24%</div>
                    <div className="text-xs text-gray-500">Revenue Growth</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-600">+18%</div>
                    <div className="text-xs text-gray-500">Customer Base</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">+31%</div>
                    <div className="text-xs text-gray-500">Product Views</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDashboard;