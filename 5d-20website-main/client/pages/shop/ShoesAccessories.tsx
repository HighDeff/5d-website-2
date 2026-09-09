import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Filter,
  Heart,
  Eye,
  Search,
  ShoppingBag,
  Menu,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ProductPopout from "@/components/ProductPopout";
import { useShoppingCart } from "@/hooks/useShoppingCart";

export default function ShoesAccessories() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductPopout, setShowProductPopout] = useState(false);
  const { addToCart } = useShoppingCart();

  const handleProductView = (product: any) => {
    const productData = {
      ...product,
      price: parseFloat(product.price.replace("$", "").replace(",", "")),
      description: product.description,
      features: [
        "Premium leather materials",
        "Comfortable fit",
        "Durable construction",
        "Designer styling",
        "Quality craftsmanship",
      ],
      inStock: true,
      originalPrice:
        parseFloat(product.price.replace("$", "").replace(",", "")) + 150,
      category: "Shoes & Accessories",
    };
    setSelectedProduct(productData);
    setShowProductPopout(true);
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.price.replace("$", "").replace(",", "")),
      image: product.image,
      category: "Shoes & Accessories",
    });
  };

  const products = [
    {
      id: 1,
      name: "Luxury Textured Handbag",
      price: "$1,850",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop&crop=center",
      description:
        "Sophisticated handbag with unique burgundy texture and premium leather construction.",
      rating: 5,
      isBestseller: true,
    },
    {
      id: 2,
      name: "Designer Heel Collection",
      price: "$450",
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop&crop=center",
      description:
        "Elegant high heels with premium materials and comfortable design.",
      rating: 5,
      isNew: true,
    },
    {
      id: 3,
      name: "Classic Black Handbag",
      price: "$2,100",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&crop=center",
      description:
        "Timeless black leather handbag with gold hardware and luxurious finish.",
      rating: 5,
    },
    {
      id: 4,
      name: "Luxury Sneaker Collection",
      price: "$380",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop&crop=center",
      description:
        "Premium sneakers with designer details and superior comfort.",
      rating: 4,
    },
    {
      id: 5,
      name: "Rose Gold Accessories",
      price: "$175",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop&crop=center",
      description:
        "Elegant rose gold toned accessories with distinctive design patterns.",
      rating: 4,
    },
    {
      id: 6,
      name: "Designer Boot Collection",
      price: "$520",
      image:
        "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=800&fit=crop&crop=center",
      description:
        "Luxury boots with premium leather and sophisticated styling.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Falling Flowers Animation */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="lily-fall lily-1">🌹</div>
        <div className="lily-fall lily-2">🌺</div>
        <div className="lily-fall lily-3">🌻</div>
        <div className="lily-fall lily-4">🌷</div>
        <div className="lily-fall lily-5">🌹</div>
        <div className="lily-fall lily-6">🌸</div>
        <div className="lily-fall lily-7">🌺</div>
        <div className="lily-fall lily-8">🌻</div>
      </div>

      {/* Realistic Flower Decorations at Top */}
      <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
        <div className="relative h-40 overflow-hidden">
          <div className="absolute top-2 left-4 opacity-70">
            <img
              src="https://images.pexels.com/photos/7291705/pexels-photo-7291705.jpeg"
              alt="Pink roses isolated"
              className="w-28 h-20 object-contain animate-pulse drop-shadow-lg flower-decoration"
            />
          </div>
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 opacity-75">
            <img
              src="https://images.pexels.com/photos/132466/pexels-photo-132466.jpeg"
              alt="Pink lilies isolated"
              className="w-24 h-28 object-contain animate-bounce drop-shadow-lg flower-decoration"
              style={{ animationDelay: "1s" }}
            />
          </div>
          <div className="absolute top-2 right-4 opacity-70">
            <img
              src="https://images.pexels.com/photos/65589/flower-orange-bright-garden-flower-65589.jpeg"
              alt="Orange flowers isolated"
              className="w-28 h-20 object-contain animate-pulse drop-shadow-lg flower-decoration"
              style={{ animationDelay: "2s" }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/20 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/30 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Link
                to="/"
                className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              >
                LILLY'S
              </Link>
              <div className="hidden lg:flex items-center space-x-8 text-sm font-medium">
                <Link
                  to="/collections"
                  className="hover:text-primary transition-colors"
                >
                  COLLECTIONS
                </Link>
                <div className="relative group">
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    SHOP
                  </span>
                  <div className="absolute top-full left-0 w-48 bg-white shadow-lg border border-gray-200 rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      to="/shop/jewelry"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Jewelry
                    </Link>
                    <Link
                      to="/shop/home-kitchen"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Home & Kitchen
                    </Link>
                    <Link
                      to="/shop/clothing"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Clothing
                    </Link>
                    <Link
                      to="/shop/shoes-accessories"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Shoes & Accessories
                    </Link>
                    <Link
                      to="/shop/beauty"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Beauty
                    </Link>
                  </div>
                </div>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  ABOUT
                </Link>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  CONTACT
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ShoppingBag className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="w-4 h-4" />
              </Button>
              <Button size="sm" className="hidden lg:inline-flex">
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-8">
            <Link to="/collections" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Collections
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-500 text-white text-lg px-6 py-2">
              👠 Shoes & Accessories
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Shoes & Accessories Collection
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Complete your look with our curated selection of luxury shoes,
              handbags, and accessories. Each piece is designed to complement
              your style with sophisticated elegance and premium craftsmanship.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 hover:bg-primary/10"
              >
                <Filter className="mr-2 w-4 h-4" />
                Filter by Type
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 hover:bg-primary/10"
              >
                Sort by Price
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-amber-50 to-orange-100"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-8"
                    style={{
                      filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                      mixBlendMode: "multiply",
                      backgroundColor: "transparent",
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    {product.isNew && (
                      <Badge className="bg-amber-500 text-white">✨ New</Badge>
                    )}
                    {product.isBestseller && (
                      <Badge className="bg-orange-500 text-white">
                        �� Bestseller
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <span className="text-lg font-bold text-amber-600">
                      {product.price}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < product.rating
                            ? "fill-current text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.rating}.0)
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex space-x-2 mb-4">
                    <Badge variant="outline">Premium</Badge>
                    <Badge variant="outline">Designer</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3"
                      onClick={() => handleProductView(product)}
                    >
                      Quick View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Popout */}
      <ProductPopout
        product={selectedProduct}
        isOpen={showProductPopout}
        onClose={() => setShowProductPopout(false)}
      />

      {/* Footer */}
      <footer className="bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
                LILLY'S FASHION COUTURE
              </h3>
              <p className="text-lg opacity-90 mb-6 max-w-md">
                Creating timeless elegance through floral-inspired fashion,
                luxury jewelry, and exceptional craftsmanship since 1985.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-pink-200">
                Shop Categories
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/shop/jewelry"
                    className="opacity-75 hover:opacity-100 hover:text-pink-200 transition-all"
                  >
                    Jewelry
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/home-kitchen"
                    className="opacity-75 hover:opacity-100 hover:text-pink-200 transition-all"
                  >
                    Home & Kitchen
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/clothing"
                    className="opacity-75 hover:opacity-100 hover:text-pink-200 transition-all"
                  >
                    Clothing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/shoes-accessories"
                    className="opacity-75 hover:opacity-100 hover:text-pink-200 transition-all"
                  >
                    Shoes & Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/beauty"
                    className="opacity-75 hover:opacity-100 hover:text-pink-200 transition-all"
                  >
                    Beauty
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-purple-200">
                Contact
              </h4>
              <ul className="space-y-3 opacity-75">
                <li>123 Fashion Ave</li>
                <li>New York, NY 10001</li>
                <li>(555) 123-4567</li>
                <li>hello@lillys.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center opacity-75">
            <p>
              &copy; 2024 Lilly's Fashion Couture. Where elegance blooms. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
