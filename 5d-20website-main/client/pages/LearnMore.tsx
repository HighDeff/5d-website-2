import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Crown,
  Folder,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Check,
  Gift,
  Heart,
  Eye,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";

export default function LearnMore() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  const membershipBenefits = [
    {
      icon: Folder,
      title: "Unlimited Collections",
      description:
        "Create and manage unlimited product collections to organize your inventory",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description:
        "Get detailed insights into your sales performance and customer behavior",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: Crown,
      title: "Premium Features",
      description:
        "Access exclusive features including priority support and early feature access",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Member Network",
      description:
        "Connect with other verified sellers and access member-only events",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: Shield,
      title: "Seller Protection",
      description: "Enhanced seller protection and dispute resolution services",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Zap,
      title: "Higher Offer Limits",
      description:
        "Accept offers of any amount while regular users are limited to 15% maximum",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  const collectionFeatures = [
    {
      title: "Organize Your Products",
      description:
        "Group related items together to make browsing easier for customers",
      icon: "🗂️",
    },
    {
      title: "Enhanced Visibility",
      description: "Collections get featured placement on your seller profile",
      icon: "👁️",
    },
    {
      title: "Better Sales",
      description: "Organized collections lead to higher conversion rates",
      icon: "📈",
    },
    {
      title: "Professional Branding",
      description:
        "Showcase your products professionally with curated collections",
      icon: "✨",
    },
  ];

  const pricingTiers = [
    {
      name: "Regular User",
      price: "Free",
      features: [
        "List up to 10 products",
        "Basic analytics",
        "Standard support",
        "15% maximum offers",
        "90% commission rate",
      ],
      color: "from-gray-500 to-gray-600",
      popular: false,
    },
    {
      name: "Premium Member",
      price: "$9.99/month",
      features: [
        "Unlimited products",
        "Unlimited collections",
        "Advanced analytics",
        "Priority support",
        "Unlimited offer amounts",
        "90% commission rate",
        "Early feature access",
      ],
      color: "from-purple-600 to-pink-600",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-12">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    L
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                  LILLY'S
                </h1>
              </Link>

              <div className="hidden lg:flex items-center space-x-8">
                <Link
                  to="/collections"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Collections
                </Link>
                <div className="relative group">
                  <button className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center space-x-1">
                    <span>Shop</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      to="/shop/jewelry"
                      className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      💍 Jewelry
                    </Link>
                    <Link
                      to="/shop/clothing"
                      className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      👗 Clothing
                    </Link>
                    <Link
                      to="/shop/beauty"
                      className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      💄 Beauty
                    </Link>
                    <Link
                      to="/shop/shoes-accessories"
                      className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      👜 Accessories
                    </Link>
                  </div>
                </div>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to="/mobile-app"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center"
                >
                  📱 Mobile App
                </Link>
                <Link
                  to="/membership"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  👑 Membership
                </Link>
                <span className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1">
                  📚 Learn More
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block">
                <ShoppingCart
                  cartItems={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  onCheckout={handleCheckout}
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="pt-24 sm:pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center mb-6 sm:mb-8">
            <Link to="/my-items">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="mr-2 w-4 h-4" />
                <span className="hidden sm:inline">Back to My Items</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Crown className="w-16 h-16 text-purple-600 mr-4" />
              <Folder className="w-16 h-16 text-pink-600" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-6">
              Unlock Your Selling Potential
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover how membership and collections can transform your selling
              experience and boost your sales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg">
                  <Crown className="w-5 h-5 mr-2" />
                  Become a Member
                </Button>
              </Link>
              <Link to="/my-items">
                <Button variant="outline" className="px-8 py-3 text-lg">
                  <Folder className="w-5 h-5 mr-2" />
                  Manage Collections
                </Button>
              </Link>
            </div>
          </div>

          {/* Collections Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Why Use Collections?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collectionFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="shadow-xl bg-white/90 backdrop-blur-sm border-0"
                >
                  <CardContent className="p-8">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Membership Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Membership Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {membershipBenefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="shadow-xl bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Choose Your Plan
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <Card
                  key={index}
                  className={`shadow-xl border-2 relative ${tier.popular ? "border-purple-500 transform scale-105" : "border-gray-200"}`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold">
                      {tier.name}
                    </CardTitle>
                    <div className="text-4xl font-bold text-purple-600 mt-2">
                      {tier.price}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Link to={tier.popular ? "/membership" : "/signup"}>
                        <Button
                          className={`w-full ${
                            tier.popular
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                          }`}
                        >
                          {tier.popular ? "Upgrade Now" : "Get Started"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "What are collections and how do they work?",
                  answer:
                    "Collections allow you to group related products together, making it easier for customers to browse and discover your items. You can create themed collections like 'Vintage Jewelry' or 'Designer Handbags' to showcase your products professionally.",
                },
                {
                  question: "Can I create collections as a regular user?",
                  answer:
                    "Collections are a premium feature available only to members. Regular users can list individual products but cannot create collections. Upgrade to membership to unlock this powerful organizing tool.",
                },
                {
                  question:
                    "What's the difference between member and regular user offers?",
                  answer:
                    "Regular users can only receive offers up to 15% of their listing price, while members can accept offers of any amount. This gives members more flexibility in negotiating with buyers.",
                },
                {
                  question: "How do I upgrade to membership?",
                  answer:
                    "You can upgrade to membership anytime by visiting the Membership page. Your upgrade is instant and you'll immediately have access to all premium features including unlimited collections.",
                },
              ].map((faq, index) => (
                <Card
                  key={index}
                  className="shadow-lg bg-white/90 backdrop-blur-sm border-0"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-purple-700">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 sm:p-12 text-white">
            <Crown className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Boost Your Sales?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful sellers who use collections and
              membership to grow their business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/membership">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  <Crown className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl overflow-y-auto">
            <div className="p-6 min-h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-6">
                <Link
                  to="/"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/collections"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Collections
                </Link>
                <Link
                  to="/membership"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Membership
                </Link>
                <span className="block text-lg font-medium text-purple-600 font-semibold border-b-2 border-purple-600 pb-1">
                  📚 Learn More
                </span>
                <div className="pt-4">
                  <ShoppingCart
                    cartItems={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    onCheckout={handleCheckout}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
