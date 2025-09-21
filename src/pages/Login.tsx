import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Users, ShoppingBag, ArrowLeft } from "lucide-react";
import kalashetraLogo from "@/assets/kalashetra-logo.jpeg";

const Login = () => {
  const [artisanForm, setArtisanForm] = useState({ email: '', password: '' });
  const [customerForm, setCustomerForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleArtisanLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (artisanForm.email && artisanForm.password) {
      toast({
        title: "Login Successful",
        description: "Welcome to your Artisan Dashboard!",
      });
      navigate('/artisan-dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password",
        variant: "destructive",
      });
    }
  };

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerForm.email && customerForm.password) {
      toast({
        title: "Login Successful",
        description: "Welcome to KalaShetra Marketplace!",
      });
      navigate('/customer-dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-heritage flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <img 
            src={kalashetraLogo} 
            alt="KalaShetra Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground">Welcome to KalaShetra</h1>
        </div>

        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Customer
            </TabsTrigger>
            <TabsTrigger value="artisan" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Artisan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Customer Login</CardTitle>
                <CardDescription>
                  Access the marketplace to discover authentic handcrafted products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomerLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="customer@example.com"
                      value={customerForm.email}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-password">Password</Label>
                    <Input
                      id="customer-password"
                      type="password"
                      placeholder="Enter your password"
                      value={customerForm.password}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full" variant="customer">
                    Login as Customer
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Demo: Use any email and password to login
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="artisan">
            <Card>
              <CardHeader>
                <CardTitle>Artisan Login</CardTitle>
                <CardDescription>
                  Access your dashboard to create and manage your products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleArtisanLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="artisan-email">Email</Label>
                    <Input
                      id="artisan-email"
                      type="email"
                      placeholder="artisan@example.com"
                      value={artisanForm.email}
                      onChange={(e) => setArtisanForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="artisan-password">Password</Label>
                    <Input
                      id="artisan-password"
                      type="password"
                      placeholder="Enter your password"
                      value={artisanForm.password}
                      onChange={(e) => setArtisanForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full" variant="artisan">
                    Login as Artisan
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Demo: Use any email and password to login
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
