import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  DollarSign,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Package,
  Camera,
  Globe,
  CheckCircle,
  Menu,
  ChevronDown,
  X,
  Upload,
  Store,
  CreditCard,
  Smartphone,
  PlayCircle,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Award,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import BackToTop from "@/components/BackToTop";

export default function SellProducts() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const benefits = [
    {
      icon: DollarSign,
      title: "Keep More Money",
      description: "85% commission for free users, 90% for members",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Users,
      title: "Global Reach",
      description: "Access to thousands of active buyers worldwide",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Safe payments and buyer protection guaranteed",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Start selling in minutes with our easy upload tools",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Create Your Account",
      description: "Sign up for free and complete your seller profile",
      icon: Users,
      details: [
        "Click 'Start Selling' to create your account",
        "Verify your email address",
        "Complete your seller profile with photos and bio",
        "Choose between free or membership plans",
      ],
    },
    {
      step: "02",
      title: "Upload Your Products",
      description: "Add photos, descriptions, and pricing for your items",
      icon: Upload,
      details: [
        "Take high-quality photos of your products",
        "Write compelling descriptions with keywords",
        "Set competitive prices based on market research",
        "Choose appropriate categories and tags",
      ],
    },
    {
      step: "03",
      title: "Manage Your Store",
      description: "Track sales, respond to customers, and grow your business",
      icon: Store,
      details: [
        "Monitor your sales dashboard and analytics",
        "Respond to customer messages promptly",
        "Update inventory and add new products regularly",
        "Build your reputation with excellent service",
      ],
    },
    {
      step: "04",
      title: "Get Paid",
      description: "Receive payments directly to your PayPal or Cash App",
      icon: CreditCard,
      details: [
        "Automatic commission calculations",
        "Fast payment processing within 24-48 hours",
        "Multiple payment options (PayPal, Cash App)",
        "Detailed earning reports and tax documents",
      ],
    },
  ];

  const faqs = [
    {
      question: "How much does it cost to start selling?",
      answer:
        "It's completely free to start! You only pay a small commission (15% for free users, 10% for members) when you make a sale.",
    },
    {
      question: "What can I sell on Lilly's Fashion?",
      answer:
        "You can sell clothing, jewelry, shoes, accessories, beauty products, home decor, and kitchen items. All items must be authentic and in good condition.",
    },
    {
      question: "How do I get paid?",
      answer:
        "We process payments through PayPal and Cash App. You'll receive your earnings within 24-48 hours after a confirmed sale.",
    },
    {
      question: "Do you provide shipping labels?",
      answer:
        "You handle shipping directly with buyers. We recommend using tracked shipping methods and providing tracking information promptly.",
    },
    {
      question: "How do I increase my sales?",
      answer:
        "Use high-quality photos, write detailed descriptions, price competitively, respond quickly to messages, and consider upgrading to membership for better visibility.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                <Link
                  to="/sell-products"
                  className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
                >
                  💼 Sell Products
                </Link>
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
              </div>
            </div>

            <div className="flex items-center space-x-4">
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

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="space-y-4">
              <Link
                to="/collections"
                className="block text-lg font-medium text-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Collections
              </Link>
              <Link
                to="/sell-products"
                className="block text-lg font-medium text-purple-600"
                onClick={() => setShowMobileMenu(false)}
              >
                💼 Sell Products
              </Link>
              <Link
                to="/about"
                className="block text-lg font-medium text-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-lg font-medium text-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 text-lg">
              💼 Start Your Business Today
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Turn Your Products Into
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Profit
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Join thousands of successful sellers on Lilly's marketplace. Sell
              fashion, jewelry, home goods, and beauty products to our global
              community of buyers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/admin/products">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl">
                  <Store className="mr-3 w-5 h-5" />
                  Start Selling Now
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-xl font-semibold text-lg"
                onClick={() =>
                  document
                    .getElementById("learn-how")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <BookOpen className="mr-3 w-5 h-5" />
                Learn How It Works
              </Button>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Learn How Section */}
      <section id="learn-how" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              How to{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Start Selling
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to launch your online business and start
              earning money today
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="overflow-hidden shadow-lg border-0"
                >
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-xl">
                              {step.step}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {step.title}
                            </h3>
                            <p className="text-lg text-gray-600">
                              {step.description}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto">
                          <Icon className="w-12 h-12 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about selling on Lilly's Fashion
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <HelpCircle className="w-6 h-6 text-purple-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-gray-900">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful sellers earning money on Lilly's
            Fashion today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admin/products">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg">
                <Upload className="mr-3 w-5 h-5" />
                Upload Your First Product
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg"
              >
                <MessageSquare className="mr-3 w-5 h-5" />
                Get Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <BackToTop />
    </div>
  );
}
