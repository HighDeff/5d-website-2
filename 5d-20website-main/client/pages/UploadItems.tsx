import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  X,
  Plus,
  DollarSign,
  Camera,
  ArrowLeft,
  Package,
  Sparkles,
  Users,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Folder,
  Star,
  Eye,
  Heart,
  Crown,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";
import AIProductValidationService from "../services/AIProductValidationService";
import AIAccountCreationService from "../services/AIAccountCreationService";
import CollectionManagementAI from "../services/CollectionManagementAI";
import { UploadTrackingAI } from "../services/UploadTrackingAI";
import { SocialProfileAI } from "../services/SocialProfileAI";

interface ProductImage {
  id: string;
  file: File;
  url: string;
}

const UploadItems: React.FC = () => {
  const navigate = useNavigate();
  const { user, isSignedIn, allUsers } = useUserAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAIFeatures, setShowAIFeatures] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    condition: "good",
    collectionName: "",
    createNewCollection: false,
    existingCollection: "",
    tags: "",
    isPublic: true,
    allowOffers: true,
    quickSellMode: false,
  });

  const categories = [
    "Clothing",
    "Jewelry",
    "Beauty",
    "Accessories",
    "Shoes",
    "Home & Kitchen",
    "Electronics",
    "Art",
    "Vintage",
    "Handmade",
  ];

  const conditions = [
    { value: "new", label: "New with tags" },
    { value: "like-new", label: "Like new" },
    { value: "good", label: "Good condition" },
    { value: "fair", label: "Fair condition" },
    { value: "vintage", label: "Vintage" },
  ];

  // Check user authentication and route accordingly
  useEffect(() => {
    if (!isSignedIn && !user) {
      // Check if it's a member user trying to access - redirect to member chat
      const isMemberUser = window.location.search.includes("member=true");
      if (isMemberUser) {
        navigate("/member-chat");
        return;
      }
      // Guest user - redirect to signup with special features
      navigate("/auth?signup=true&features=true");
      return;
    }

    // Initialize AI features for authenticated users
    if (user && isSignedIn) {
      setShowAIFeatures(true);
      generateAISuggestions();
    }
  }, [user, isSignedIn, navigate]);

  const generateAISuggestions = async () => {
    try {
      const suggestions = await AIProductValidationService.getUploadSuggestions(
        user?.id,
      );
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    if (images.length >= 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") && images.length < 10) {
        const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const url = URL.createObjectURL(file);

        const newImage: ProductImage = {
          id: imageId,
          file,
          url,
        };

        setImages((prev) => [...prev, newImage]);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productName || !formData.price || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      alert("Please add at least one image");
      return;
    }

    setUploading(true);

    try {
      // AI Product Validation
      const validationResult = await AIProductValidationService.validateProduct(
        {
          name: formData.productName,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          images: images.map((img) => img.url),
          sellerId: user?.id,
        },
      );

      if (!validationResult.isValid) {
        if (
          validationResult.suggestions &&
          validationResult.suggestions.length > 0
        ) {
          const useAIFix = window.confirm(
            `AI detected potential issues:\n${validationResult.issues?.join("\n")}\n\nWould you like to use AI suggestions to fix these issues?`,
          );

          if (useAIFix && validationResult.suggestedFixes) {
            // Apply AI fixes
            setFormData((prev) => ({
              ...prev,
              productName:
                validationResult.suggestedFixes?.name || prev.productName,
              description:
                validationResult.suggestedFixes?.description ||
                prev.description,
              price:
                validationResult.suggestedFixes?.price?.toString() ||
                prev.price,
              category:
                validationResult.suggestedFixes?.category || prev.category,
            }));

            setUploading(false);
            alert("AI fixes applied! Please review and resubmit.");
            return;
          }
        } else {
          alert(
            `Upload validation failed: ${validationResult.issues?.join(", ")}`,
          );
          setUploading(false);
          return;
        }
      }

      // Handle collection creation/assignment
      let collectionId = formData.existingCollection;

      if (formData.createNewCollection && formData.collectionName) {
        const aiCollectionResult =
          await CollectionManagementAI.createAIOptimizedCollection({
            name: formData.collectionName,
            description: `Collection for ${formData.category} items`,
            category: formData.category,
            ownerId: user?.id,
            isPublic: formData.isPublic,
          });

        if (aiCollectionResult.success) {
          collectionId = aiCollectionResult.collection?.id;
        }
      }

      // Create the product
      const uploadedImages = images.map((img) => img.url);
      const productData = {
        id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.productName,
        description: formData.description,
        price: parseFloat(formData.price),
        images: uploadedImages,
        category: formData.category,
        condition: formData.condition,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        sellerId: user?.id,
        sellerName: user?.name,
        collectionId: collectionId,
        isPublic: formData.isPublic,
        allowOffers: formData.allowOffers,
        createdAt: new Date().toISOString(),
        status: "active",
      };

      // Track upload with AI system BEFORE saving to database
      const uploadMetadata = {
        method: "form",
        fileDetails: images.map((img) => ({
          size: img.file.size,
          format: img.file.type,
          dimensions: { width: 0, height: 0 }, // Could be detected from image
        })),
      };

      const uploadId = await UploadTrackingAI.trackUpload(
        user?.id || "guest",
        user?.name || "Guest User",
        productData,
        uploadMetadata,
      );

      // Save to local storage (simulated upload)
      const existingProducts = JSON.parse(
        localStorage.getItem("products") || "[]",
      );
      existingProducts.push({ ...productData, uploadId });
      localStorage.setItem("products", JSON.stringify(existingProducts));

      // Update user's product count
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.id === user?.id);
      if (userIndex !== -1) {
        users[userIndex].products = users[userIndex].products || [];
        users[userIndex].products.push(productData.id);
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Create or update social profile
      if (user?.id) {
        await SocialProfileAI.createOrUpdateProfile(user.id, {
          username: user.name,
        });
      }

      setUploadResult(productData);
      setUploaded(true);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle guest AI account creation
  const handleGuestAIUpload = async () => {
    try {
      const aiAccountData = {
        productInfo: {
          name: formData.productName,
          description: formData.description,
          category: formData.category,
          price: formData.price,
        },
        images: images.map((img) => img.url),
      };

      const accountResult =
        await AIAccountCreationService.createAccountFromUpload(aiAccountData);

      if (accountResult.success) {
        alert(
          `AI created account: ${accountResult.account?.name}\nPassword: ${accountResult.account?.password}\nCollections: ${accountResult.account?.collections?.join(", ")}`,
        );
        navigate("/auth");
      } else {
        alert("Failed to create AI account. Please try manual signup.");
        navigate("/auth?signup=true");
      }
    } catch (error) {
      console.error("AI account creation error:", error);
      navigate("/auth?signup=true");
    }
  };

  if (uploaded && uploadResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/collections"
                className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Collections
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                Upload Successful! 🎉
              </h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                Product Added to Collection!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-2">
                  📦 {uploadResult.name}
                </h3>
                <p className="text-green-700 mb-4">
                  Price: ${uploadResult.price}
                </p>
                <div className="space-y-2 text-sm text-green-600">
                  <p>✅ Added to your collection</p>
                  <p>✅ Available for purchase</p>
                  <p>✅ AI optimized for better visibility</p>
                  {uploadResult.allowOffers && (
                    <p>✅ Send offer button enabled</p>
                  )}
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="flex gap-4 justify-center">
                  <Link to="/collections">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      View Collections
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline">Go to Dashboard</Button>
                  </Link>
                </div>
                <Link to="/upload-items">
                  <Button variant="ghost" className="text-purple-600">
                    Upload Another Item
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/collections"
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Collections
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Upload Items & Create Collections
            </h1>
            <div className="flex items-center space-x-2">
              {user && (
                <Badge variant="outline" className="text-green-700">
                  ✅ {user.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* AI Features Banner */}
        {showAIFeatures && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800 mb-2">
                    🤖 AI-Powered Upload Assistant
                  </h3>
                  <p className="text-purple-700 text-sm mb-3">
                    Our AI will help optimize your listings, suggest
                    collections, detect duplicates, and maximize your sales
                    potential.
                  </p>
                  {aiSuggestions.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="font-medium text-purple-800">
                        AI Suggestions:
                      </h4>
                      {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                        <p key={index} className="text-sm text-purple-600">
                          • {suggestion}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Product Photos (max 10)</span>
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">Add Product Photos</h3>
                <p className="text-gray-600 mb-4">
                  Drop images here or click to browse (max 10 images)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 10}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {images.length >= 10 ? "Max Images Reached" : "Add Photos"}
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt=""
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Vintage Denim Jacket"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price ($) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="25.00"
                      className="pl-10"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) =>
                      setFormData({ ...formData, condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem
                          key={condition.value}
                          value={condition.value}
                        >
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="vintage, designer, summer, etc."
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Collection Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Folder className="w-5 h-5" />
                  <span>Collection Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="createNewCollection"
                    checked={formData.createNewCollection}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        createNewCollection: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="createNewCollection">
                    Create new collection
                  </Label>
                </div>

                {formData.createNewCollection && (
                  <div className="space-y-2">
                    <Label htmlFor="collectionName">Collection Name</Label>
                    <Input
                      id="collectionName"
                      placeholder="e.g., Summer Collection 2024"
                      value={formData.collectionName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          collectionName: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                {!formData.createNewCollection && (
                  <div className="space-y-2">
                    <Label htmlFor="existingCollection">
                      Add to existing collection
                    </Label>
                    <Select
                      value={formData.existingCollection}
                      onValueChange={(value) =>
                        setFormData({ ...formData, existingCollection: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select collection" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">
                          General Collection
                        </SelectItem>
                        <SelectItem value="featured">Featured Items</SelectItem>
                        <SelectItem value="sale">Sale Items</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isPublic: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="isPublic">
                      Make public (others can see)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowOffers"
                      checked={formData.allowOffers}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          allowOffers: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="allowOffers">
                      Allow "Send Offer" button
                    </Label>
                  </div>
                </div>

                {showAIFeatures && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Features Enabled
                    </h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>✅ Duplicate detection</p>
                      <p>✅ Price optimization suggestions</p>
                      <p>✅ Collection auto-organization</p>
                      <p>✅ SEO optimization</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submit */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={uploading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4"
                >
                  {uploading ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Processing with AI...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5 mr-2" />
                      Add to Collection
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-600">
                  AI will validate, optimize, and organize your item
                  automatically
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default UploadItems;
