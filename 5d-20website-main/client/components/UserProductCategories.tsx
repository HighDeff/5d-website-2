// User Product Categories - Display user's product categories with images
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Eye,
  TrendingUp,
  Star,
  Grid3X3,
  List,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "@/hooks/useUserAuth";
import { CATEGORY_STRUCTURE } from "@/data/productDatabase";

interface UserProductCategoriesProps {
  userId?: string;
  className?: string;
  showHeader?: boolean;
  maxCategories?: number;
  viewMode?: "grid" | "list" | "compact";
}

interface CategoryInfo {
  name: string;
  productCount: number;
  totalViews: number;
  averagePrice: number;
  products: any[];
  image: string;
  subcategories: string[];
}

const UserProductCategories: React.FC<UserProductCategoriesProps> = ({
  userId,
  className = "",
  showHeader = true,
  maxCategories = 10,
  viewMode = "grid",
}) => {
  const { currentUser, allProducts } = useUserAuth();
  const targetUserId = userId || currentUser?.id;

  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, [targetUserId, allProducts]);

  const loadCategories = () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    try {
      // Get user's products
      const userProducts = allProducts.filter(
        (product) => product.sellerId === targetUserId,
      );

      // Group products by category
      const categoryGroups = userProducts.reduce((groups: any, product) => {
        const category = product.category || "Other";
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(product);
        return groups;
      }, {});

      // Create category info objects
      const categoryInfos: CategoryInfo[] = Object.entries(categoryGroups)
        .map(([categoryName, products]: [string, any]) => {
          const totalViews = products.reduce(
            (sum: number, p: any) => sum + (p.views || 0),
            0,
          );
          const averagePrice =
            products.reduce((sum: number, p: any) => sum + (p.price || 0), 0) /
            products.length;

          // Get category image (use first product's image or default)
          const categoryImage =
            products[0]?.images?.[0] || getCategoryDefaultImage(categoryName);

          // Get subcategories from CATEGORY_STRUCTURE
          const categoryData =
            CATEGORY_STRUCTURE[categoryName as keyof typeof CATEGORY_STRUCTURE];
          const subcategories = categoryData ? Object.keys(categoryData) : [];

          return {
            name: categoryName,
            productCount: products.length,
            totalViews,
            averagePrice,
            products,
            image: categoryImage,
            subcategories,
          };
        })
        .sort((a, b) => b.productCount - a.productCount) // Sort by product count
        .slice(0, maxCategories);

      setCategories(categoryInfos);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDefaultImage = (categoryName: string): string => {
    const defaultImages = {
      Beauty:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
      "Clothing, Shoes & Accessories":
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      "Home & Kitchen":
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      Jewelry:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      Other:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    };

    return (
      defaultImages[categoryName as keyof typeof defaultImages] ||
      defaultImages.Other
    );
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
              <span className="text-gray-600">Loading categories...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={`${className}`}>
        <Card>
          {showHeader && (
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-purple-600" />
                <span>Product Categories</span>
              </CardTitle>
            </CardHeader>
          )}
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Products Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start by uploading products to see categories here.
              </p>
              {userId === currentUser?.id && (
                <Link to="/upload">
                  <Button>
                    <Package className="w-4 h-4 mr-2" />
                    Upload Products
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewMode === "compact") {
    return (
      <div className={`space-y-3 ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Package className="w-5 h-5 text-purple-600" />
              <span>Product Categories</span>
            </h3>
            <Badge variant="secondary">{categories.length} categories</Badge>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200"
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-800 truncate">
                      {category.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {category.productCount} products
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Product Categories
            </h2>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              {categories.length} categories
            </Badge>
          </div>
        </div>
      )}

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {categories.map((category) => (
          <Card
            key={category.name}
            className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md ${
              viewMode === "list" ? "flex flex-row" : ""
            }`}
          >
            <div
              className={`relative overflow-hidden ${
                viewMode === "list" ? "w-32 h-24" : "h-48"
              } ${viewMode === "grid" ? "rounded-t-lg" : "rounded-l-lg"}`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs font-medium">
                {category.productCount} items
              </div>
              {category.subcategories.length > 0 && (
                <div className="absolute top-8 right-2 bg-purple-500 text-white rounded-full px-2 py-1 text-xs">
                  {category.subcategories.length} subcategories
                </div>
              )}
            </div>

            <CardContent
              className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                  {category.name}
                </h3>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <Package className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-600">Products:</span>
                    <span className="font-medium">{category.productCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-green-600" />
                    <span className="text-gray-600">Views:</span>
                    <span className="font-medium">{category.totalViews}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-purple-600" />
                    <span className="text-gray-600">Avg Price:</span>
                    <span className="font-medium text-green-600">
                      ${category.averagePrice.toFixed(2)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.name}
                  </Badge>
                </div>

                {category.subcategories.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Subcategories:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 3).map((subcat) => (
                        <Badge
                          key={subcat}
                          variant="secondary"
                          className="text-xs"
                        >
                          {subcat}
                        </Badge>
                      ))}
                      {category.subcategories.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{category.subcategories.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length >= maxCategories && (
        <div className="text-center pt-4">
          <Link to="/dashboard">
            <Button variant="outline">
              View All Categories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserProductCategories;
