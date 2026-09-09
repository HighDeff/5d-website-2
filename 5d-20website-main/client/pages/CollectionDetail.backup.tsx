import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Heart,
  Eye,
  User,
  Package,
  Plus,
  Grid3X3,
  List,
  Star,
  Filter,
  Search,
  Folder,
  ChevronRight,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import UserDataService from "@/services/UserDataService";
import { CATEGORY_STRUCTURE } from "@/data/productDatabase";
import FavoritesService from "@/services/FavoritesService";
import ProductPopout from "@/components/ProductPopout";

interface CollectionItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  brand?: string;
  dateAdded: string;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  items: CollectionItem[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  isPublic: boolean;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  items?: CollectionItem[];
  isHierarchical?: boolean;
  subcategories?: Subcategory[];
}

const CollectionDetail: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { user, allProducts } = useUserAuth();
  const { addToCart } = useShoppingCart();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [showSubcategories, setShowSubcategories] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductPopout, setShowProductPopout] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  const loadCollection = async () => {
    if (!collectionId) return;

    try {
      setLoading(true);

      // Load collection data
      const collections = await UserDataService.loadDefaultCollections();
      let foundCollection = collections.find((c) => c.id === collectionId);

      if (!foundCollection) {
        // Try by name matching
        const nameMap: Record<string, string> = {
          "beauty-collection": "Beauty Collection",
          "jewelry-collection": "Jewelry Collection",
          "clothing-collection": "Clothing Collection",
          "accessories-collection": "Accessories Collection",
        };

        const collectionName =
          nameMap[collectionId] || collectionId.replace(/-/g, " ");
        foundCollection = collections.find((c) =>
          c.name.toLowerCase().includes(collectionName.toLowerCase()),
        );
      }

      // Create enhanced collection with AI-powered item counting
      if (foundCollection) {
        const enhancedCollection =
          await enhanceCollectionWithAI(foundCollection);
        setCollection(enhancedCollection);
        await updateViewCount(enhancedCollection);
      } else {
        // Create dynamic collection based on category
        const dynamicCollection = await createDynamicCollection(collectionId);
        setCollection(dynamicCollection);
      }

      // Initialize favorites state
      if (user?.id) {
        initializeFavorites();
      }
    } catch (error) {
      console.error("Error loading collection:", error);
    } finally {
      setLoading(false);
    }
  };

  const enhanceCollectionWithAI = async (
    baseCollection: Collection,
  ): Promise<Collection> => {
    try {
      // Use CollectionItemCounter for accurate counts
      const { CollectionItemCounter } = await import(
        "@/services/CollectionItemCounter"
      );
      const actualItemCount =
        await CollectionItemCounter.getRealTimeCollectionCount(
          baseCollection.name,
        );

      // Get subcategories if it's a hierarchical collection
      let subcategories: Subcategory[] = [];
      let items: CollectionItem[] = [];

      const categoryData =
        CATEGORY_STRUCTURE[
          baseCollection.name as keyof typeof CATEGORY_STRUCTURE
        ];
      if (categoryData) {
        subcategories = await createSubcategoriesFromData(
          categoryData,
          baseCollection.name,
        );
        items = subcategories.flatMap((sub) => sub.items);
      } else {
        // Get items from products database
        items = await getItemsFromDatabase(
          baseCollection.category || baseCollection.name,
        );
      }

      // Calculate enhanced engagement
      const enhancedLikes = await calculateCollectionLikes(items);
      const enhancedViews = await calculateCollectionViews(items);

      return {
        ...baseCollection,
        itemCount: Math.max(actualItemCount, items.length),
        items,
        subcategories: subcategories.length > 0 ? subcategories : undefined,
        isHierarchical: subcategories.length > 0,
        likes: enhancedLikes,
        views: enhancedViews,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error enhancing collection:", error);
      return baseCollection;
    }
  };

  const createDynamicCollection = async (
    collectionId: string,
  ): Promise<Collection> => {
    const nameMap: Record<
      string,
      { name: string; category: string; description: string }
    > = {
      "beauty-collection": {
        name: "Beauty Collection",
        category: "beauty",
        description: "Discover makeup, skincare, and beauty essentials",
      },
      "jewelry-collection": {
        name: "Jewelry Collection",
        category: "jewelry",
        description: "Elegant jewelry pieces for every occasion",
      },
      "clothing-collection": {
        name: "Clothing Collection",
        category: "clothing",
        description: "Fashion-forward clothing for your style",
      },
    };

    const config = nameMap[collectionId] || {
      name: collectionId.replace(/-/g, " "),
      category: "general",
      description: "Curated collection of quality items",
    };

    // Get items from database
    const items = await getItemsFromDatabase(config.category);
    const itemCount = items.length;

    // Create subcategories for beauty specifically
    let subcategories: Subcategory[] = [];
    if (config.category === "beauty") {
      subcategories = await createBeautySubcategories();
    }

    return {
      id: collectionId,
      name: config.name,
      description: config.description,
      image: `https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop`,
      itemCount,
      creator: {
        id: "system",
        name: "Curated Collections",
        avatar: "",
        verified: true,
      },
      category: config.category,
      tags: [config.category, "curated", "trending"],
      isPublic: true,
      likes: Math.floor(Math.random() * 100) + 20,
      views: Math.floor(Math.random() * 500) + 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items,
      subcategories: subcategories.length > 0 ? subcategories : undefined,
      isHierarchical: subcategories.length > 0,
    };
  };

  const getItemsFromDatabase = async (
    category: string,
  ): Promise<CollectionItem[]> => {
    try {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const guestUploads = JSON.parse(
        localStorage.getItem("guestUploads") || "[]",
      );

      // Enhanced category matching
      const categoryKeywords = getCategoryKeywords(category);

      const categoryProducts = products.filter((product: any) =>
        categoryKeywords.some(
          (keyword) =>
            product.category?.toLowerCase().includes(keyword) ||
            product.name?.toLowerCase().includes(keyword),
        ),
      );

      const guestCategoryProducts = guestUploads.filter((upload: any) =>
        categoryKeywords.some(
          (keyword) =>
            upload.category?.toLowerCase().includes(keyword) ||
            upload.productName?.toLowerCase().includes(keyword),
        ),
      );

      // Convert to CollectionItem format
      const items: CollectionItem[] = [
        ...categoryProducts.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image:
            product.images?.[0] ||
            product.image ||
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop",
          category: product.category,
          description:
            product.description ||
            `${product.name} from ${category} collection`,
          brand: product.brand,
          dateAdded: product.dateAdded || new Date().toISOString(),
        })),
        ...guestCategoryProducts.map((upload: any) => ({
          id: upload.id,
          name: upload.productName,
          price: upload.price,
          image:
            upload.images?.[0] ||
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop",
          category: upload.category,
          description:
            upload.description || `${upload.productName} from guest upload`,
          dateAdded: upload.createdAt || new Date().toISOString(),
        })),
      ];

      return items;
    } catch (error) {
      console.error("Error getting items from database:", error);
      return [];
    }
  };

  const getCategoryKeywords = (category: string): string[] => {
    const categoryMap: Record<string, string[]> = {
      beauty: [
        "beauty",
        "makeup",
        "cosmetic",
        "skincare",
        "fragrance",
        "perfume",
      ],
      jewelry: ["jewelry", "ring", "necklace", "bracelet", "earring", "watch"],
      clothing: ["clothing", "dress", "shirt", "pants", "top", "bottom"],
      accessories: ["accessory", "bag", "purse", "belt", "scarf", "hat"],
      home: ["home", "decor", "furniture", "kitchen", "bedroom"],
    };

    return categoryMap[category.toLowerCase()] || [category.toLowerCase()];
  };

  const createBeautySubcategories = async (): Promise<Subcategory[]> => {
    const beautyCategories = [
      {
        name: "Makeup",
        keywords: ["makeup", "foundation", "lipstick", "eyeshadow"],
      },
      {
        name: "Skincare",
        keywords: ["skincare", "moisturizer", "cleanser", "serum"],
      },
      {
        name: "Fragrance",
        keywords: ["fragrance", "perfume", "cologne", "scent"],
      },
      {
        name: "Hair Care",
        keywords: ["hair", "shampoo", "conditioner", "styling"],
      },
      { name: "Body Care", keywords: ["body", "lotion", "scrub", "bath"] },
    ];

    const subcategories: Subcategory[] = [];

    for (const category of beautyCategories) {
      const items = await getItemsByKeywords(category.keywords);
      if (items.length > 0) {
        subcategories.push({
          id: category.name.toLowerCase().replace(/\s+/g, "-"),
          name: category.name,
          description: `${category.name} products and essentials`,
          itemCount: items.length,
          items,
        });
      }
    }

    return subcategories;
  };

  const getItemsByKeywords = async (
    keywords: string[],
  ): Promise<CollectionItem[]> => {
    const products = JSON.parse(localStorage.getItem("products") || "[]");

    const matchingProducts = products.filter((product: any) =>
      keywords.some(
        (keyword) =>
          product.category?.toLowerCase().includes(keyword) ||
          product.name?.toLowerCase().includes(keyword) ||
          product.description?.toLowerCase().includes(keyword),
      ),
    );

    return matchingProducts.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        product.images?.[0] ||
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop",
      category: product.category,
      description: product.description,
      brand: product.brand,
      dateAdded: product.dateAdded || new Date().toISOString(),
    }));
  };

  const calculateCollectionLikes = async (
    items: CollectionItem[],
  ): Promise<number> => {
    try {
      const { AdvancedEngagementCalculator } = await import(
        "@/services/AdvancedEngagementCalculator"
      );
      let totalLikes = 0;

      for (const item of items) {
        const engagement =
          await AdvancedEngagementCalculator.getProductEngagement(
            item.id,
            collection?.id || "unknown",
          );
        totalLikes += engagement.likes;
      }

      return totalLikes;
    } catch (error) {
      return Math.floor(Math.random() * 50) + 10;
    }
  };

  const calculateCollectionViews = async (
    items: CollectionItem[],
  ): Promise<number> => {
    try {
      const { AdvancedEngagementCalculator } = await import(
        "@/services/AdvancedEngagementCalculator"
      );
      let totalViews = 0;

      for (const item of items) {
        const engagement =
          await AdvancedEngagementCalculator.getProductEngagement(
            item.id,
            collection?.id || "unknown",
          );
        totalViews += engagement.views;
      }

      return totalViews;
    } catch (error) {
      return Math.floor(Math.random() * 200) + 50;
    }
  };

  const createSubcategoriesFromData = async (
    categoryData: any,
    collectionName: string,
  ): Promise<Subcategory[]> => {
    const subcategories: Subcategory[] = [];

    Object.entries(categoryData).forEach(([subcatName, subcatData]) => {
      let itemCount = 0;
      const items: CollectionItem[] = [];

      if (typeof subcatData === "object" && subcatData !== null) {
        if ("price" in subcatData) {
          itemCount = 1;
          items.push({
            id: `${subcatName.toLowerCase().replace(/\s+/g, "-")}-1`,
            name: subcatName,
            price: subcatData.price,
            image: `https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop`,
            category: subcatName,
            description: `${subcatName} from ${collectionName} collection`,
            dateAdded: new Date().toISOString(),
          });
        } else {
          Object.entries(subcatData).forEach(([itemName, itemData]) => {
            if (typeof itemData === "object" && itemData !== null) {
              if ("price" in itemData) {
                itemCount++;
                items.push({
                  id: `${subcatName.toLowerCase().replace(/\s+/g, "-")}-${itemName.toLowerCase().replace(/\s+/g, "-")}`,
                  name: itemName,
                  price: itemData.price,
                  image: `https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop`,
                  category: subcatName,
                  description: `${itemName} from ${subcatName} subcategory`,
                  dateAdded: new Date().toISOString(),
                });
              }
            }
          });
        }
      }

      if (itemCount > 0) {
        subcategories.push({
          id: subcatName.toLowerCase().replace(/\s+/g, "-"),
          name: subcatName,
          description: `Browse ${subcatName} items in this collection`,
          itemCount,
          items,
        });
      }
    });

    return subcategories;
  };

  const updateViewCount = async (collection: Collection) => {
    try {
      const collections = await UserDataService.loadDefaultCollections();
      const updatedCollections = collections.map((c) =>
        c.id === collection.id ? { ...c, views: c.views + 1 } : c,
      );
      localStorage.setItem(
        "defaultCollections",
        JSON.stringify(updatedCollections),
      );
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  const initializeFavorites = async () => {
    if (!user?.id || !collection) return;

    try {
      // Use Enhanced Favorites Manager
      const { default: EnhancedFavoritesManager } = await import(
        "../services/EnhancedFavoritesManager"
      );

      const activeFavorites = EnhancedFavoritesManager.getActiveFavorites(
        user.id,
      );
      const favStates: Record<string, boolean> = {};

      // Check collection favorite
      favStates[collection.id] = activeFavorites.includes(collection.id);

      // Check item favorites
      if (collection.items) {
        collection.items.forEach((item) => {
          favStates[item.id] = activeFavorites.includes(item.id);
        });
      }

      setFavoriteStates(favStates);
      console.log("✅ Initialized favorites state:", favStates);
    } catch (error) {
      console.error("Error initializing favorites:", error);

      // Fallback to original system
      try {
        const favorites = FavoritesService.getFavorites(user.id);
        const favStates: Record<string, boolean> = {};
        favStates[collection.id] = favorites.includes(collection.id);
        if (collection.items) {
          collection.items.forEach((item) => {
            favStates[item.id] = favorites.includes(item.id);
          });
        }
        setFavoriteStates(favStates);
      } catch (fallbackError) {
        console.error("Fallback favorites initialization failed:", fallbackError);
      }
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (collection) {
      setCollection({
        ...collection,
        likes: isLiked ? collection.likes - 1 : collection.likes + 1,
      });
    }
  };

  const handleAddToCart = (item: CollectionItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
  };

  const handleQuickView = (item: CollectionItem) => {
    setSelectedProduct(item);
    setShowProductPopout(true);
  };

  // Enhanced favorites function with AI management
  const handleToggleFavorite = async (
    itemId: string,
    event?: React.MouseEvent,
  ) => {
    // Prevent event bubbling and default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    const userId = user?.id;

    if (!userId) {
      alert("Please sign in to add favorites");
      return;
    }

    try {
      console.log(`🤖 Enhanced Favorites: Processing ${itemId} for ${userId}`);

      // Use Enhanced Favorites Manager
      const { default: EnhancedFavoritesManager } = await import(
        "../services/EnhancedFavoritesManager"
      );

      const result = await EnhancedFavoritesManager.toggleFavorite(
        userId,
        itemId,
        event
          ? {
              x: event.clientX,
              y: event.clientY,
              buttonElement: event.currentTarget as HTMLElement,
              page: window.location.pathname,
            }
          : undefined,
      );

      if (result.success) {
        // Update local state immediately
        setFavoriteStates((prev) => ({
          ...prev,
          [itemId]: result.newState,
        }));

        console.log(
          `✅ Enhanced Favorites: ${result.newState ? "Added" : "Removed"} ${itemId}`,
        );
      }
    } catch (error) {
      console.error("Error with enhanced favorites:", error);

      // Fallback to basic toggle
      const currentState = favoriteStates[itemId] || false;
      setFavoriteStates((prev) => ({
        ...prev,
        [itemId]: !currentState,
      }));
    }
  };
  };

  // Handle collection-wide favorites
  const handleToggleCollectionFavorite = async (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!user?.id || !collection) {
      alert("Please sign in to favorite collections");
      return;
    }

    try {
      // Toggle collection favorite
      await handleToggleFavorite(collection.id, event);

      // Also toggle all items in collection if user wants
      if (collection.items && collection.items.length > 0) {
        const shouldFavoriteAll = confirm(
          `Would you like to ${favoriteStates[collection.id] ? "unfavorite" : "favorite"} all items in this collection too?`,
        );

        if (shouldFavoriteAll) {
          for (const item of collection.items) {
            await handleToggleFavorite(item.id);
            // Small delay to prevent overwhelming the system
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
      }
    } catch (error) {
      console.error("Error toggling collection favorite:", error);
    }
  };

  const getFilteredItems = () => {
    if (!collection?.items) return [];

    let items = collection.items;

    // Filter by subcategory
    if (selectedSubcategory !== "all" && collection.subcategories) {
      const subcategory = collection.subcategories.find(
        (s) => s.id === selectedSubcategory,
      );
      items = subcategory?.items || [];
    }

    // Filter by search query
    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return items;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Collection Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The collection you're looking for doesn't exist.
          </p>
          <Link to="/collections">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collections
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/collections">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Collections
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {collection.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {collection.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-blue-100 text-blue-800">
                {collection.itemCount} items
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleCollectionFavorite}
                className={favoriteStates[collection.id] ? "text-red-500" : ""}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    favoriteStates[collection.id] ? "fill-current" : ""
                  }`}
                />
                {favoriteStates[collection.id] ? "Unfavorite" : "Favorite"}{" "}
                Collection
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Collection Hero */}
      <section className="container mx-auto px-6 py-8">
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <img
            src={collection.image}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {collection.name}
                </h2>
                <p className="text-white/90 mb-4">{collection.description}</p>
                <div className="flex items-center space-x-4 text-white/80">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    <span>{collection.itemCount} Items</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>{collection.likes} Likes</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{collection.views} Views</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={
                      collection.creator.avatar ||
                      "https://i.pravatar.cc/40?img=50"
                    }
                    alt={collection.creator.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {collection.creator.name}
                    </p>
                    {collection.creator.verified && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search items in this collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {collection.subcategories && (
              <div>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Categories</option>
                  {collection.subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name} ({subcategory.itemCount})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex space-x-2">
              <div className="flex bg-gray-100 rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategories */}
        {collection.subcategories && showSubcategories && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Categories</h3>
              <Button
                variant="ghost"
                onClick={() => setShowSubcategories(false)}
                className="text-gray-600"
              >
                Hide Categories
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collection.subcategories.map((subcategory) => (
                <Card
                  key={subcategory.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedSubcategory(subcategory.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                        {subcategory.name}
                      </h4>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {subcategory.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {subcategory.itemCount} items
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Folder className="w-4 h-4 mr-1" />
                        Browse
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedSubcategory === "all"
                ? "All Items"
                : collection.subcategories?.find(
                    (s) => s.id === selectedSubcategory,
                  )?.name || "Items"}
            </h3>
            <span className="text-gray-600">{filteredItems.length} items</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No items found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubcategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list" ? "w-48 h-32" : "h-48"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop";
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-sm font-medium">
                      ${item.price}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleToggleFavorite(item.id, e)}
                        className={`h-8 w-8 p-0 bg-white/90 hover:bg-white ${
                          favoriteStates[item.id] ? "text-red-500" : ""
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favoriteStates[item.id] ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </div>

                  <CardContent className={`p-4 flex-1`}>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    {item.brand && (
                      <p className="text-xs text-gray-500 mb-2">
                        Brand: {item.brand}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickView(item);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Popout */}
      {showProductPopout && selectedProduct && (
        <ProductPopout
          product={selectedProduct}
          isOpen={showProductPopout}
          onClose={() => setShowProductPopout(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default CollectionDetail;