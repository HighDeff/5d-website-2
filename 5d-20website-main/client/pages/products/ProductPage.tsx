import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { useShoppingCart } from "@/hooks/useShoppingCart";

// Product data - in a real app this would come from an API/database
const products = {
  "black-elegance-dress": {
    id: "black-elegance-dress",
    name: "Black Elegance Dress",
    price: 295,
    originalPrice: 395,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933",
    category: "Clothing",
    description:
      "Sophisticated black dress perfect for evening events and special occasions. Crafted from premium materials with attention to detail.",
    features: [
      "Premium fabric blend",
      "Tailored fit",
      "Hidden zipper closure",
      "Professional dry clean only",
      "Available in sizes XS-XL",
    ],
    specifications: {
      Material: "85% Polyester, 15% Elastane",
      Care: "Dry clean only",
      Country: "Made in Italy",
      Fit: "True to size",
    },
    rating: 4.8,
    reviews: 124,
    inStock: true,
    shipping: "Free shipping on orders over $200",
  },
  "ocean-dreams-dress": {
    id: "ocean-dreams-dress",
    name: "Ocean Dreams Dress",
    price: 265,
    originalPrice: 325,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3",
    category: "Clothing",
    description:
      "Flowing dress inspired by ocean waves with beautiful blue tones and comfortable fit.",
    features: [
      "Breathable fabric",
      "Flowy silhouette",
      "Easy care machine washable",
      "Perfect for summer",
      "Available in sizes XS-XL",
    ],
    specifications: {
      Material: "100% Cotton",
      Care: "Machine wash cold",
      Country: "Made in Portugal",
      Fit: "Relaxed fit",
    },
    rating: 4.6,
    reviews: 89,
    inStock: true,
    shipping: "Free shipping on orders over $200",
  },
  "rainbow-burst-scarf": {
    id: "rainbow-burst-scarf",
    name: "Rainbow Burst Scarf",
    price: 85,
    originalPrice: 120,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145",
    category: "Shoes & Accessories",
    description:
      "Vibrant silk scarf with rainbow pattern that adds a pop of color to any outfit.",
    features: [
      "100% pure silk",
      "Hand-rolled edges",
      "Versatile styling options",
      "Fade-resistant colors",
      "Square shape 90cm x 90cm",
    ],
    specifications: {
      Material: "100% Silk",
      Care: "Hand wash or dry clean",
      Country: "Made in France",
      Size: "90cm x 90cm",
    },
    rating: 4.9,
    reviews: 67,
    inStock: true,
    shipping: "Free shipping on orders over $200",
  },
  "azure-pattern-top": {
    id: "azure-pattern-top",
    name: "Azure Pattern Top",
    price: 155,
    originalPrice: 195,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c",
    category: "Clothing",
    description:
      "Elegant top with intricate azure pattern, perfect for professional and casual wear.",
    features: [
      "Wrinkle-resistant fabric",
      "Comfortable stretch",
      "Professional appearance",
      "Easy to style",
      "Available in sizes XS-XL",
    ],
    specifications: {
      Material: "70% Polyester, 30% Elastane",
      Care: "Machine wash cold",
      Country: "Made in Turkey",
      Fit: "Fitted",
    },
    rating: 4.7,
    reviews: 92,
    inStock: true,
    shipping: "Free shipping on orders over $200",
  },
  "classic-plaid-robe": {
    id: "classic-plaid-robe",
    name: "Classic Plaid Robe",
    price: 125,
    originalPrice: 165,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605",
    category: "Clothing",
    description:
      "Comfortable and stylish plaid robe perfect for lounging at home or spa days.",
    features: [
      "Soft cotton blend",
      "Classic plaid pattern",
      "Comfortable fit",
      "Machine washable",
      "One size fits most",
    ],
    specifications: {
      Material: "80% Cotton, 20% Polyester",
      Care: "Machine wash warm",
      Country: "Made in USA",
      Fit: "One size",
    },
    rating: 4.5,
    reviews: 156,
    inStock: true,
    shipping: "Free shipping on orders over $200",
  },
  "blue-daisy-dress": {
    id: "blue-daisy-dress",
    name: "Blue Daisy Dress",
    price: 295,
    originalPrice: 365,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fc15060186fc94e5586b70291e8647e98",
    category: "Clothing",
    description:
      "Charming dress with delicate blue daisy print, perfect for spring and summer occasions.",
    features: [
      "Feminine floral print",
      "Lightweight fabric",
      "Midi length",
      "Side pockets",
      "Available in sizes XS-XL",
    ],
    specifications: {
      Material: "100% Viscose",
      Care: "Hand wash cold",
      Country: "Made in India",
      Fit: "True to size",
    },
    rating: 4.8,
    reviews: 203,
    inStock: true,
    shipping: "Free shipping on orders over $200",
  },
};

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useShoppingCart();

  const product = productId
    ? products[productId as keyof typeof products]
    : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-gray-600">
                  ({product.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge className="bg-red-100 text-red-800">
                    Save ${product.originalPrice - product.price}
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.category === "Clothing" &&
              product.id !== "classic-plaid-robe" && (
                <div>
                  <h3 className="font-semibold mb-3">Size</h3>
                  <div className="flex space-x-2">
                    {["XS", "S", "M", "L", "XL"].map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {addedToCart ? "✅ Added to Cart!" : "Add to Cart"}
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>{product.shipping}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Authentic guarantee</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Features & Specifications */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
