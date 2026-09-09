/**
 * Social Media Monitor Component
 * Allows users to monitor their products across social platforms
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Eye,
  MessageCircle,
  Share,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Facebook,
  Instagram,
  User,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { SocialProfileAI } from "@/services/SocialProfileAI";

interface SocialMediaMonitorProps {
  userId: string;
  productId?: string;
}

const SocialMediaMonitor: React.FC<SocialMediaMonitorProps> = ({
  userId,
  productId,
}) => {
  const [socialProfile, setSocialProfile] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    loadSocialData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadSocialData, 30000);

    return () => clearInterval(interval);
  }, [userId, productId]);

  const loadSocialData = async () => {
    try {
      setIsLoading(true);

      // Get user's social profile
      const profile = SocialProfileAI.getUserSocialProfile(userId);
      setSocialProfile(profile);

      // Set selected product if specified
      if (productId && profile) {
        const product = profile.products.find((p: any) => p.id === productId);
        setSelectedProduct(product);
      }

      setLastUpdated(new Date().toLocaleString());
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading social data:", error);
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadSocialData();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading social media data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!socialProfile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No Social Profile Found
          </h3>
          <p className="text-gray-600 mb-4">
            Upload your first product to create a social profile
          </p>
          <Button onClick={() => (window.location.href = "/upload-items")}>
            Upload Product
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Monitor</h2>
          <p className="text-gray-600">
            Track your products across all platforms
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </span>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-pink-600">
                  {socialProfile.analytics.totalLikes}
                </p>
              </div>
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-blue-600">
                  {socialProfile.analytics.totalViews}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  {socialProfile.analytics.totalSales}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {socialProfile.analytics.averageEngagement.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Tabs */}
      <Tabs defaultValue="internal">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="internal" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Internal</span>
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center space-x-2">
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </TabsTrigger>
          <TabsTrigger
            value="instagram"
            className="flex items-center space-x-2"
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="internal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Internal Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-purple-600">
                    {socialProfile.platforms.internal?.likes || 0}
                  </p>
                  <p className="text-sm text-gray-600">Likes</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-blue-600">
                    {socialProfile.platforms.internal?.views || 0}
                  </p>
                  <p className="text-sm text-gray-600">Views</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-green-600">
                    {socialProfile.platforms.internal?.bids || 0}
                  </p>
                  <p className="text-sm text-gray-600">Bids</p>
                </div>
              </div>

              <h4 className="font-semibold mb-3">Product Performance</h4>
              <div className="space-y-3">
                {socialProfile.products.slice(0, 5).map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1 text-pink-500" />
                        {product.platforms.internal?.likes || 0}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1 text-blue-500" />
                        {product.platforms.internal?.views || 0}
                      </span>
                      <Badge variant="secondary">
                        {product.totalEngagement} engagement
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facebook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                Facebook Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {socialProfile.platforms.facebook ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <p className="text-2xl font-bold text-blue-600">
                        {socialProfile.platforms.facebook.likes}
                      </p>
                      <p className="text-sm text-gray-600">Page Likes</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <p className="text-2xl font-bold text-blue-600">
                        {socialProfile.platforms.facebook.followers}
                      </p>
                      <p className="text-sm text-gray-600">Followers</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <p className="text-2xl font-bold text-blue-600">
                        {socialProfile.platforms.facebook.comments}
                      </p>
                      <p className="text-sm text-gray-600">Comments</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <p className="text-2xl font-bold text-blue-600">
                        {socialProfile.platforms.facebook.shares}
                      </p>
                      <p className="text-sm text-gray-600">Shares</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {socialProfile.products
                      .filter((p: any) => p.platforms.facebook)
                      .map((product: any) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              ${product.price}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1 text-blue-500" />
                              {product.platforms.facebook.likes}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="w-3 h-3 mr-1 text-blue-500" />
                              {product.platforms.facebook.comments}
                            </span>
                            <span className="flex items-center">
                              <Share className="w-3 h-3 mr-1 text-blue-500" />
                              {product.platforms.facebook.shares}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Facebook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Connect Facebook
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Connect your Facebook page to track performance
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Facebook
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instagram" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Instagram className="w-5 h-5 mr-2 text-pink-600" />
                Instagram Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {socialProfile.platforms.instagram ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-pink-50 rounded">
                      <p className="text-2xl font-bold text-pink-600">
                        {socialProfile.platforms.instagram.likes}
                      </p>
                      <p className="text-sm text-gray-600">Likes</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded">
                      <p className="text-2xl font-bold text-pink-600">
                        {socialProfile.platforms.instagram.followers}
                      </p>
                      <p className="text-sm text-gray-600">Followers</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded">
                      <p className="text-2xl font-bold text-pink-600">
                        {socialProfile.platforms.instagram.comments}
                      </p>
                      <p className="text-sm text-gray-600">Comments</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded">
                      <p className="text-2xl font-bold text-pink-600">
                        {socialProfile.platforms.instagram.posts}
                      </p>
                      <p className="text-sm text-gray-600">Posts</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {socialProfile.products
                      .filter((p: any) => p.platforms.instagram)
                      .map((product: any) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              ${product.price}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1 text-pink-500" />
                              {product.platforms.instagram.likes}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="w-3 h-3 mr-1 text-pink-500" />
                              {product.platforms.instagram.comments}
                            </span>
                            <Badge variant="secondary">
                              Reach: {product.platforms.instagram.reach}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Instagram className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Connect Instagram
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Connect your Instagram business account to track performance
                  </p>
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Instagram
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Suspicious Activity Alert */}
      {socialProfile.suspiciousActivity &&
        socialProfile.suspiciousActivity.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Suspicious Activity Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {socialProfile.suspiciousActivity
                  .slice(0, 3)
                  .map((activity: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white rounded"
                    >
                      <span className="text-sm">{activity.description}</span>
                      <Badge
                        variant={
                          activity.severity === "high" ||
                          activity.severity === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {activity.severity}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Selected Product Details */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Product Details: {selectedProduct.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Internal Platform</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Likes:</span>
                    <span>
                      {selectedProduct.platforms.internal?.likes || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span>
                      {selectedProduct.platforms.internal?.views || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Favorites:</span>
                    <span>
                      {selectedProduct.platforms.internal?.favorites || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales:</span>
                    <span>
                      {selectedProduct.platforms.internal?.sales || 0}
                    </span>
                  </div>
                </div>
              </div>

              {selectedProduct.platforms.facebook && (
                <div>
                  <h4 className="font-semibold mb-3">Facebook</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Likes:</span>
                      <span>{selectedProduct.platforms.facebook.likes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comments:</span>
                      <span>{selectedProduct.platforms.facebook.comments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shares:</span>
                      <span>{selectedProduct.platforms.facebook.shares}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales:</span>
                      <span>{selectedProduct.platforms.facebook.sales}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedProduct.platforms.instagram && (
                <div>
                  <h4 className="font-semibold mb-3">Instagram</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Likes:</span>
                      <span>{selectedProduct.platforms.instagram.likes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comments:</span>
                      <span>
                        {selectedProduct.platforms.instagram.comments}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saves:</span>
                      <span>{selectedProduct.platforms.instagram.saves}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales:</span>
                      <span>{selectedProduct.platforms.instagram.sales}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded">
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedProduct.totalEngagement}
                  </p>
                  <p className="text-sm text-gray-600">Total Engagement</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">
                    {(selectedProduct.conversionRate * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialMediaMonitor;
