import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Users,
  HeadphonesIcon,
  Menu,
  ChevronDown,
  X,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";

export default function Contact() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      inquiryType: "general",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "hello@lillys.com",
      action: "mailto:hello@lillys.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 8am to 5pm",
      contact: "(555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Start Chat",
      action: "#",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come see us in person",
      contact: "123 Fashion Ave, NY 10001",
      action: "#",
    },
  ];

  const departments = [
    {
      name: "Customer Service",
      description: "General inquiries and order support",
      email: "support@lillys.com",
      hours: "24/7",
    },
    {
      name: "Sales Team",
      description: "Product recommendations and bulk orders",
      email: "sales@lillys.com",
      hours: "Mon-Fri 9am-6pm",
    },
    {
      name: "Returns & Exchanges",
      description: "Return policies and exchange requests",
      email: "returns@lillys.com",
      hours: "Mon-Fri 9am-5pm",
    },
    {
      name: "Partnership",
      description: "Business partnerships and collaborations",
      email: "partners@lillys.com",
      hours: "Mon-Fri 10am-4pm",
    },
  ];

  const faqs = [
    {
      question: "What are your shipping times?",
      answer:
        "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer 30-day returns on all items in original condition. Return shipping is free for exchanges.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to over 50 countries worldwide. International shipping times vary by location.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You'll receive a tracking number via email once your order ships. You can also track orders in your account.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="fixed inset-0 opacity-3 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
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
                  className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
                >
                  Contact
                </Link>
                <Link
                  to="/mobile-app"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center"
                >
                  📱 Mobile App
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/mobile-app">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-purple-100 flex items-center space-x-2"
                  title="Mobile App"
                >
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <span className="hidden sm:inline text-purple-600 font-medium">
                    App
                  </span>
                </Button>
              </Link>

              <Button
                onClick={() =>
                  window.open(
                    "https://lillys-fashion-couture.myshopify.com",
                    "_blank",
                  )
                }
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
              >
                🛒 Shopify
              </Button>

              <ShoppingCart
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
              />

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

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-8">
            <Link to="/">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-lg">
              💬 Get in Touch
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're here to help! Whether you have questions about our products,
              need assistance with an order, or want to share feedback, our team
              is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-xl transition-all duration-300 border-0 cursor-pointer group"
                onClick={() =>
                  method.action.startsWith("#")
                    ? null
                    : window.open(method.action)
                }
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">
                  {method.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {method.description}
                </p>
                <p className="text-purple-600 font-semibold">
                  {method.contact}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">
                Send us a Message
              </h2>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Your full name"
                          required
                          className="rounded-lg border-2 border-gray-200 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="your@email.com"
                          required
                          className="rounded-lg border-2 border-gray-200 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) =>
                          handleInputChange("inquiryType", e.target.value)
                        }
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 bg-white"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="returns">Returns & Exchanges</option>
                        <option value="partnership">
                          Business Partnership
                        </option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        placeholder="Brief description of your inquiry"
                        required
                        className="rounded-lg border-2 border-gray-200 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        required
                        className="rounded-lg border-2 border-gray-200 focus:border-purple-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold"
                    >
                      <Send className="mr-2 w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">
                Contact Information
              </h2>

              {/* Office Hours */}
              <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-purple-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Office Hours
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST
                    </p>
                    <p>
                      <strong>Saturday:</strong> 10:00 AM - 4:00 PM EST
                    </p>
                    <p>
                      <strong>Sunday:</strong> Closed
                    </p>
                    <p className="text-sm mt-4 text-purple-600">
                      *Customer support available 24/7 via email
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Departments */}
              <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <Users className="w-6 h-6 text-purple-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Departments
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {departments.map((dept, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-4"
                      >
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {dept.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {dept.description}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <a
                            href={`mailto:${dept.email}`}
                            className="text-purple-600 hover:underline"
                          >
                            {dept.email}
                          </a>
                          <span className="text-gray-500">{dept.hours}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <HeadphonesIcon className="w-6 h-6 text-purple-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Quick Answers
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-4"
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Need Immediate Help?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our customer support team is standing by to assist you with any
            questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={() => window.open("tel:+15551234567")}
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold"
            >
              <Phone className="mr-2 w-4 h-4" />
              Call Now
            </Button>
            <Button
              onClick={() => window.open("mailto:hello@lillys.com")}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-3 rounded-lg font-semibold"
            >
              <Mail className="mr-2 w-4 h-4" />
              Email Us
            </Button>
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
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Menu
                </h2>
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
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/collections"
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Collections
                </Link>
                <Link
                  to="/about"
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block text-lg font-medium text-purple-600 border-b-2 border-purple-600 pb-1"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/mobile-app"
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  📱 Mobile App
                </Link>
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-700 mb-4">Shop</h3>
                  <div className="space-y-3 ml-4">
                    <Link
                      to="/shop/jewelry"
                      className="block text-gray-600 hover:text-purple-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      💍 Jewelry
                    </Link>
                    <Link
                      to="/shop/clothing"
                      className="block text-gray-600 hover:text-purple-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      👗 Clothing
                    </Link>
                    <Link
                      to="/shop/beauty"
                      className="block text-gray-600 hover:text-purple-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      💄 Beauty
                    </Link>
                    <Link
                      to="/shop/shoes-accessories"
                      className="block text-gray-600 hover:text-purple-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      👜 Accessories
                    </Link>
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white mt-6"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open(
                      "https://lillys-fashion-couture.myshopify.com",
                      "_blank",
                    );
                  }}
                >
                  🛒 Shopify Store
                </Button>
                <div className="flex items-center justify-center pt-4">
                  <span className="text-gray-600">
                    Cart (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
