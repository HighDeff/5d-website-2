import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Zap,
  CreditCard,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import GuestUploadService from "../services/GuestUploadService";

interface ProductImage {
  id: string;
  file: File;
  url: string;
}

const GuestUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    condition: "good",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
    paymentMethod: "paypal" as "paypal" | "cashapp",
    paymentHandle: "",
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

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    if (images.length >= 3) {
      alert("Maximum 3 images allowed for guest uploads");
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") && images.length < 3) {
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

    if (!formData.sellerEmail || !formData.paymentHandle) {
      alert("Please provide your email and payment information");
      return;
    }

    // Validate payment handle
    if (
      formData.paymentMethod === "paypal" &&
      !formData.paymentHandle.includes("@")
    ) {
      alert("Please enter a valid PayPal email address");
      return;
    }

    if (
      formData.paymentMethod === "cashapp" &&
      !formData.paymentHandle.startsWith("$")
    ) {
      alert("Please enter a valid CashApp tag (starting with $)");
      return;
    }

    setUploading(true);

    try {
      const uploadedImages = images.map((img) => img.url);

      const result = GuestUploadService.createGuestUpload({
        productName: formData.productName,
        description: formData.description,
        price: parseFloat(formData.price),
        images: uploadedImages,
        category: formData.category,
        condition: formData.condition,
        sellerInfo: {
          name: formData.sellerName || formData.sellerEmail.split("@")[0],
          email: formData.sellerEmail,
          phone: formData.sellerPhone,
          paymentMethod: formData.paymentMethod,
          paymentHandle: formData.paymentHandle,
        },
      });

      if (result.success) {
        setUploadResult(result.upload);
        setUploaded(true);
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

  if (uploaded && uploadResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
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
                Your Item is Live!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-2">
                  📦 {uploadResult.productName}
                </h3>
                <p className="text-green-700 mb-4">
                  Price: ${uploadResult.price}
                </p>
                <div className="space-y-2 text-sm text-green-600">
                  <p>✅ Your item is now visible to all shoppers</p>
                  <p>✅ Buyers can purchase with 1-click</p>
                  <p>
                    ✅ You'll receive ${uploadResult.sellerAmount.toFixed(2)}{" "}
                    after our{" "}
                    {(
                      (uploadResult.platformFee / uploadResult.price) *
                      100
                    ).toFixed(0)}
                    % fee
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  What happens when someone buys?
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                  <li>Buyer sends payment to our platform</li>
                  <li>
                    We forward your payment to:{" "}
                    {uploadResult.sellerInfo.paymentHandle}
                  </li>
                  <li>We'll email you the buyer's contact info</li>
                  <li>You arrange pickup/delivery directly</li>
                </ol>
              </div>

              <div className="text-center space-y-4">
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  View Your Item on Homepage
                </Button>
                <p className="text-sm text-gray-600">
                  Want to upload more items?{" "}
                  <Link to="/auth" className="text-purple-600 hover:underline">
                    Create a free account
                  </Link>{" "}
                  for lower fees!
                </p>
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
              to="/"
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Quick Sell</h1>
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Info Banner */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">
                  ⚡ Quick Sell - No Account Required!
                </h3>
                <p className="text-orange-700 text-sm mb-3">
                  Upload 1 item instantly with just your email and payment info.
                  Buyers can purchase with 1-click!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-orange-600">✅ Upload in 2 minutes</p>
                    <p className="text-orange-600">✅ 1-click purchasing</p>
                    <p className="text-orange-600">✅ Instant payments</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-orange-600">💰 15% platform fee</p>
                    <p className="text-orange-600">🎯 Direct to buyers</p>
                    <p className="text-orange-600">📧 Email notifications</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Photos (max 3)</span>
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
                <h3 className="text-lg font-medium mb-2">Add Photos</h3>
                <p className="text-gray-600 mb-4">
                  Drop images here or click to browse (max 3 images)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 3}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {images.length >= 3 ? "Max Images Reached" : "Add Photos"}
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image) => (
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
                      max="1000"
                      placeholder="25.00"
                      className="pl-10"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  {formData.price && (
                    <p className="text-sm text-gray-600">
                      You'll receive: $
                      {(parseFloat(formData.price) * 0.85).toFixed(2)} (after
                      15% fee)
                    </p>
                  )}
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
              </CardContent>
            </Card>

            {/* Seller & Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Your Info & Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sellerName">Your Name</Label>
                  <Input
                    id="sellerName"
                    placeholder="John Doe"
                    value={formData.sellerName}
                    onChange={(e) =>
                      setFormData({ ...formData, sellerName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerEmail">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="sellerEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.sellerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, sellerEmail: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-gray-600">
                    We'll email you when someone buys your item
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerPhone">Phone (optional)</Label>
                  <Input
                    id="sellerPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.sellerPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, sellerPhone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Payment Method <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value: "paypal" | "cashapp") =>
                      setFormData({ ...formData, paymentMethod: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="cashapp">CashApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentHandle">
                    {formData.paymentMethod === "paypal"
                      ? "PayPal Email"
                      : "CashApp Tag"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="paymentHandle"
                    placeholder={
                      formData.paymentMethod === "paypal"
                        ? "your.paypal@email.com"
                        : "$YourCashApp"
                    }
                    value={formData.paymentHandle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentHandle: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-xs text-gray-600">
                    This is where you'll receive payment after sales
                  </p>
                </div>
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
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4"
                >
                  {uploading ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      List Item for Sale
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-600">
                  By uploading, you agree to our 15% fee and terms of service
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default GuestUpload;
