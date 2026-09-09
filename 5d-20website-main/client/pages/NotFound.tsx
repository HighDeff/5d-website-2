import { Button } from "@/components/ui/button";
import { Heart, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
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
          {/* Left side - Pink roses isolated */}
          <div className="absolute top-2 left-4 opacity-70">
            <img
              src="https://images.pexels.com/photos/7291705/pexels-photo-7291705.jpeg"
              alt="Pink roses isolated"
              className="w-28 h-20 object-contain animate-pulse drop-shadow-lg flower-decoration"
            />
          </div>

          {/* Center - Pink lilies isolated */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 opacity-75">
            <img
              src="https://images.pexels.com/photos/132466/pexels-photo-132466.jpeg"
              alt="Pink lilies isolated"
              className="w-24 h-28 object-contain animate-bounce drop-shadow-lg flower-decoration"
              style={{
                animationDelay: "1s",
              }}
            />
          </div>

          {/* Right side - Orange flowers isolated */}
          <div className="absolute top-2 right-4 opacity-70">
            <img
              src="https://images.pexels.com/photos/65589/flower-orange-bright-garden-flower-65589.jpeg"
              alt="Orange flowers isolated"
              className="w-28 h-20 object-contain animate-pulse drop-shadow-lg flower-decoration"
              style={{
                animationDelay: "2s",
              }}
            />
          </div>

          {/* Additional smaller decorative flowers */}
          <div className="absolute top-6 left-1/4 opacity-50">
            <img
              src="https://images.pexels.com/photos/7291705/pexels-photo-7291705.jpeg"
              alt="Pink roses accent"
              className="w-20 h-14 object-contain animate-bounce drop-shadow-md flower-decoration"
              style={{
                animationDelay: "0.5s",
              }}
            />
          </div>
          <div className="absolute top-4 right-1/4 opacity-55">
            <img
              src="https://images.pexels.com/photos/132466/pexels-photo-132466.jpeg"
              alt="Pink lilies accent"
              className="w-18 h-22 object-contain animate-pulse drop-shadow-md flower-decoration"
              style={{
                animationDelay: "1.5s",
              }}
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
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button size="sm">
                  <Home className="mr-2 w-4 h-4" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="text-center max-w-2xl mx-auto px-6 relative z-20">
          {/* Large 404 */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-none">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Oops! Page Not Found
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              It seems this beautiful page has wandered off like a flower in the
              wind. Let's help you find your way back to our garden of fashion.
            </p>
          </div>

          {/* Decorative Element */}
          <div className="mb-8 flex justify-center">
            <div className="text-6xl opacity-60">🌸</div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg"
              >
                <Home className="mr-2 w-5 h-5" />
                Return to Home
              </Button>
            </Link>

            <Link to="/collections">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary/30 hover:bg-primary/10 bg-white/80 backdrop-blur"
              >
                <Search className="mr-2 w-5 h-5" />
                Browse Collections
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-12 p-6 bg-white/60 backdrop-blur rounded-2xl border border-pink-200/50">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Looking for something specific?
            </h3>
            <p className="text-gray-600 mb-4">
              Our customer service team is here to help you find exactly what
              you're looking for.
            </p>
            <Button variant="outline" size="sm">
              <Heart className="mr-2 w-4 h-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Product Elements for Visual Interest */}
      <div className="absolute top-1/4 left-10 hidden xl:block opacity-20">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F9f9f5e0484a343fe810daef579fa8ac1?format=webp&width=800"
          alt="Luxury handbag"
          className="w-24 h-24 object-contain animate-pulse rounded-xl"
          style={{
            filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
            mixBlendMode: "multiply",
            backgroundColor: "transparent",
          }}
        />
      </div>

      <div className="absolute top-1/3 right-16 hidden xl:block opacity-20">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F58b088204c5941629cce86cf5b2878f9?format=webp&width=800"
          alt="Gold jewelry"
          className="w-20 h-20 object-contain animate-bounce rounded-full"
          style={{
            animationDelay: "0.5s",
            filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
            mixBlendMode: "multiply",
            backgroundColor: "transparent",
          }}
        />
      </div>

      <div className="absolute bottom-1/4 left-1/4 hidden xl:block opacity-15">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fad71e3b8a0b74bd7bdf9c6564286c0b8?format=webp&width=800"
          alt="Pink lingerie"
          className="w-18 h-18 object-contain animate-pulse rounded-lg"
          style={{
            animationDelay: "1s",
            filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
            mixBlendMode: "multiply",
            backgroundColor: "transparent",
          }}
        />
      </div>
    </div>
  );
};

export default NotFound;
