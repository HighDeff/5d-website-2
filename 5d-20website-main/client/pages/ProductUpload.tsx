import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Plus,
  DollarSign,
  Package,
  Camera,
  Tag,
  ArrowLeft,
  Save,
  Eye,
  AlertCircle,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";
import AuthGuard from "../components/AuthGuard";
import AIContentAnalyzer from "../services/AIContentAnalyzer";
import UserNotificationService from "../services/UserNotificationService";

interface ProductImage {
  id: string;
  file: File;
  url: string;
  isMain: boolean;
}

const ProductUpload: React.FC = () => {
  const { user, addProduct, isSignedIn } = useUserAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ensure user is authenticated
  if (!isSignedIn || !user) {
    return null; // AuthGuard will handle the redirect
  }

  const [images, setImages] = useState<ProductImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    condition: "new",
    brand: "",
    size: "",
    color: "",
    material: "",
    tags: [] as string[],
    shipping: {
      weight: "",
      dimensions: "",
      shippingCost: "",
      processingTime: "1-3",
    },
    sellerInfo: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: "",
    },
  });
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);

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

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const url = URL.createObjectURL(file);

        const newImage: ProductImage = {
          id: imageId,
          file,
          url,
          isMain: images.length === 0, // First image is main
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
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId);
      // If removed image was main, make first remaining image main
      if (filtered.length > 0 && !filtered.some((img) => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  const setMainImage = (imageId: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isMain: img.id === imageId,
      })),
    );
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in to upload products");
      return;
    }

    if (images.length === 0) {
      alert("Please add at least one image");
      return;
    }

    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      // Simulate image upload
      const uploadedImages = images.map((img) => img.url);

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: uploadedImages,
        status: "active" as const,
        tags: formData.tags,
        condition: formData.condition,
        brand: formData.brand,
        size: formData.size,
        color: formData.color,
        material: formData.material,
        shipping: formData.shipping,
      };

      const result = addProduct(productData);

      if (result.success) {
        alert("Product uploaded successfully!");

        // Trigger AI analysis for the new product
        try {
          await AIContentAnalyzer.analyzeUserContent(user.id, false);

          // Create notification about AI analysis
          UserNotificationService.createSystemNotification(
            user.id,
            "🤖 AI Analysis Started",
            "Your new product is being analyzed for optimization suggestions. You'll receive recommendations shortly.",
            "low",
          );
        } catch (error) {
          console.error("AI analysis error:", error);
        }

        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          condition: "new",
          brand: "",
          size: "",
          color: "",
          material: "",
          tags: [],
          shipping: {
            weight: "",
            dimensions: "",
            shippingCost: "",
            processingTime: "1-3",
          },
          sellerInfo: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            location: "",
          },
        });
        setImages([]);
        window.location.href = "/dashboard";
      } else {
        alert("Failed to upload product: " + result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Upload Product
                </h1>
                <p className="text-sm text-gray-600">
                  Add your item to the marketplace
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPreview(!preview)}
                className="hidden md:flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                {preview ? "Edit" : "Preview"}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={uploading || !user}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Upload Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {!preview ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Product Images</span>
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Drop images here or click to browse
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Support for JPEG, PNG, WebP up to 10MB each
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Images
                  </Button>
                </div>

                {/* Image Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className={`relative group rounded-lg overflow-hidden border-2 ${
                          image.isMain ? "border-purple-500" : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => setMainImage(image.id)}
                            disabled={image.isMain}
                          >
                            {image.isMain ? "Main" : "Set Main"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(image.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {image.isMain && (
                          <Badge className="absolute top-2 left-2 text-xs">
                            Main
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <select
                      id="condition"
                      value={formData.condition}
                      onChange={(e) =>
                        setFormData({ ...formData, condition: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {conditions.map((condition) => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product in detail..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="Brand name"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      placeholder="Size (e.g., M, 10, One Size)"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      placeholder="Primary color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      placeholder="Main material"
                      value={formData.material}
                      onChange={(e) =>
                        setFormData({ ...formData, material: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          <span>{tag}</span>
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerName">Name</Label>
                    <Input
                      id="sellerName"
                      placeholder="Your name"
                      value={formData.sellerInfo.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sellerInfo: {
                            ...formData.sellerInfo,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellerEmail">Email</Label>
                    <Input
                      id="sellerEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.sellerInfo.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sellerInfo: {
                            ...formData.sellerInfo,
                            email: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellerPhone">Phone</Label>
                    <Input
                      id="sellerPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.sellerInfo.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sellerInfo: {
                            ...formData.sellerInfo,
                            phone: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellerLocation">Location</Label>
                    <Input
                      id="sellerLocation"
                      placeholder="City, State"
                      value={formData.sellerInfo.location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sellerInfo: {
                            ...formData.sellerInfo,
                            location: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        ) : (
          /* Preview Mode */
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Product Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {images.length > 0 && (
                <div className="mb-6">
                  <img
                    src={images.find((img) => img.isMain)?.url || images[0].url}
                    alt={formData.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {images.length > 1 && (
                    <div className="flex space-x-2 mt-2">
                      {images.slice(1, 5).map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt=""
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {formData.name || "Product Name"}
                  </h2>
                  <p className="text-3xl font-bold text-purple-600">
                    ${formData.price || "0.00"}
                  </p>
                </div>

                {formData.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{formData.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {formData.category && (
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {formData.category}
                    </div>
                  )}
                  {formData.condition && (
                    <div>
                      <span className="font-medium">Condition:</span>{" "}
                      {formData.condition}
                    </div>
                  )}
                  {formData.brand && (
                    <div>
                      <span className="font-medium">Brand:</span>{" "}
                      {formData.brand}
                    </div>
                  )}
                  {formData.size && (
                    <div>
                      <span className="font-medium">Size:</span> {formData.size}
                    </div>
                  )}
                </div>

                {formData.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const ProtectedProductUpload: React.FC = () => {
  return (
    <AuthGuard>
      <ProductUpload />
    </AuthGuard>
  );
};

export default ProtectedProductUpload;
