import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  DollarSign,
  Shield,
  Star,
  CheckCircle,
  Database,
  Trash2,
  Users,
  TrendingUp,
  Eye,
  Gift,
  Crown,
  Zap,
  Package,
  EyeOff,
  Heart,
  CreditCard,
  Landmark,
  Percent,
  Send,
  MessageSquare,
  AlertCircle,
  Loader,
  X,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/hooks/useUserAuth";
import AuthService from "@/services/AuthService";
import DatabaseService from "@/services/DatabaseService";
import BackToTop from "@/components/BackToTop";

export default function Auth() {
  const navigate = useNavigate();
  const { signUp, signIn, isSignedIn, allUsers } = useUserAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    emailOrPhone: "", // For sign-in
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    paypalEmail: "",
    cashAppTag: "",
    skipPayment: true,
    membershipLevel: "free" as "free" | "member" | "premium",
    verificationCode: "",
  });

  // Show welcome message if already signed in instead of redirecting
  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            You're Already Signed In!
          </h2>
          <p className="text-gray-600 mb-6">
            You're all set to explore the marketplace.
          </p>
          <div className="space-y-3">
            <Button
              className="w-full bg-green-600 text-white"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (!formData.emailOrPhone || !formData.password) {
        setError("Please enter both email/phone and password");
        setIsLoading(false);
        return;
      }

      // Validate email format only if it looks like an email (contains @)
      if (
        formData.emailOrPhone.includes("@") &&
        !validateEmail(formData.emailOrPhone)
      ) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      console.log("Attempting sign in with:", formData.emailOrPhone);
      const result = signIn(formData.emailOrPhone, formData.password);

      if (result.success) {
        setSuccess("Successfully signed in! Redirecting...");
        console.log("Sign in successful:", result.user);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError(
          result.error ||
            "Invalid credentials. Please check your email/phone and password.",
        );
        console.log("Sign in failed:", result.error);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An error occurred during sign in");
    }

    setIsLoading(false);
  };

  const handleSignUp = () => {
    setIsLoading(true);
    setError("");

    try {
      // Validation
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password
      ) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (!formData.agreeToTerms) {
        setError("Please agree to the terms and conditions");
        setIsLoading(false);
        return;
      }

      // Use the same signup system as AuthSection
      const fullName = `${formData.firstName} ${formData.lastName}`;

      console.log("=== Auth.tsx SignUp Process ===");
      console.log("Form data:", formData);
      console.log("Full name:", fullName);
      console.log("Email:", formData.email);
      console.log("Password:", formData.password ? "[PRESENT]" : "[MISSING]");
      console.log("signUp function available:", typeof signUp);

      console.log("Creating account with useUserAuth signup...");
      const result = signUp(
        fullName,
        formData.email,
        formData.password,
        formData.membershipLevel || "free",
      );

      console.log("SignUp result from useUserAuth:", result);
      console.log("Result success:", result?.success);
      console.log("Result error:", result?.error);

      if (result && result.success) {
        console.log("✅ User created successfully:", result.user);

        setSuccess(
          "Account created successfully! You can now browse or go to your dashboard.",
        );

        // Don't auto-redirect, let user choose where to go next
        // The page will update to show signed-in state
      } else {
        const errorMessage =
          result?.error || "Failed to create account. Please try again.";
        console.error("=== SIGNUP FAILED ===");
        console.error("Result object:", result);
        console.error("Error message:", errorMessage);
        console.error("Current allUsers before signup:", allUsers);

        // Show detailed error to user
        setError(`Signup failed: ${errorMessage}. Check console for details.`);
      }
    } catch (error) {
      setError("An error occurred during signup");
    }

    setIsLoading(false);
  };

  const membershipPlans = [
    {
      id: "free",
      name: "Free",
      price: "Free",
      commission: "15%",
      color: "gray",
      features: [
        "List unlimited products",
        "Basic support",
        "Standard processing",
      ],
    },
    {
      id: "member",
      name: "Member",
      price: "$9.99/month",
      commission: "10%",
      color: "blue",
      features: [
        "Lower commission fees",
        "Priority support",
        "Fast processing",
        "Featured listings",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19.99/month",
      commission: "5%",
      color: "purple",
      features: [
        "Lowest commission fees",
        "VIP support",
        "Instant processing",
        "Featured listings",
        "Advanced analytics",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100">
      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                LILLY'S
              </h1>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-md">
          {/* Auth Toggle */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {isSignUpMode ? "Join Lilly's" : "Welcome Back"}
            </h1>
            <p className="text-gray-600 mb-6">
              {isSignUpMode
                ? "Create your account to start buying and selling"
                : "Sign in to your account"}
            </p>
            <div className="flex bg-gray-100 rounded-lg p-1 max-w-xs mx-auto">
              <Button
                onClick={() => {
                  setIsSignUpMode(false);
                  setError("");
                  setSuccess("");
                }}
                variant={!isSignUpMode ? "default" : "ghost"}
                className={`flex-1 ${!isSignUpMode ? "bg-white shadow-sm" : ""}`}
                size="sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  setIsSignUpMode(true);
                  setError("");
                  setSuccess("");
                }}
                variant={isSignUpMode ? "default" : "ghost"}
                className={`flex-1 ${isSignUpMode ? "bg-white shadow-sm" : ""}`}
                size="sm"
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Membership Features Banner for Signup */}
          {isSignUpMode && (
            <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-bold text-purple-800 mb-3 flex items-center justify-center">
                    <Crown className="w-5 h-5 mr-2" />
                    🎉 Unlock Premium Membership Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      </div>
                      <h4 className="font-medium text-purple-800">
                        Messaging & Voting
                      </h4>
                      <p className="text-purple-600">
                        Direct messaging with sellers, voting on products,
                        member discussions
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-blue-800">
                        Advanced Dashboard
                      </h4>
                      <p className="text-blue-600">
                        Analytics, sales tracking, advanced upload tools, AI
                        features
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CreditCard className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-medium text-green-800">
                        Cart & History
                      </h4>
                      <p className="text-green-600">
                        Saved cart, purchase history, favorites sync, wishlist
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI-Powered Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-yellow-700">
                      <p>🤖 AI helps with sales optimization</p>
                      <p>📊 AI product upload assistance</p>
                      <p>🎯 AI-powered recommendations</p>
                      <p>💰 AI pricing suggestions</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">
                      🔥 Resell & Friend Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-orange-700">
                      <p>🔄 Cross-selling with friends</p>
                      <p>🤝 Assisted selling network</p>
                      <p>📈 Cross-product posting</p>
                      <p>💬 Collaborative collections</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Auth Form */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                {/* Sign In Form */}
                {!isSignUpMode && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">
                        Email Address or Phone Number
                      </Label>
                      <Input
                        id="signin-email"
                        type="text"
                        value={formData.emailOrPhone}
                        onChange={(e) =>
                          handleInputChange("emailOrPhone", e.target.value)
                        }
                        placeholder="Enter your email or phone number"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can sign in with either your email address or phone
                        number
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          placeholder="Enter your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={handleSignIn}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                )}

                {/* Sign Up Form */}
                {isSignUpMode && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          placeholder="First name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          placeholder="Last name"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+1 (555) 123-4567"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          placeholder="Create a password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        placeholder="Confirm your password"
                        className="mt-1"
                      />
                    </div>

                    {/* Membership Plan Selection */}
                    <div>
                      <Label>Choose Your Plan</Label>
                      <div className="mt-2 space-y-3">
                        {membershipPlans.map((plan) => (
                          <div
                            key={plan.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              formData.membershipLevel === plan.id
                                ? `border-${plan.color}-500 bg-${plan.color}-50`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() =>
                              handleInputChange("membershipLevel", plan.id)
                            }
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold">{plan.name}</h4>
                                  <Badge
                                    className={`bg-${plan.color}-100 text-${plan.color}-800`}
                                  >
                                    {plan.commission} commission
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {plan.price}
                                </p>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  formData.membershipLevel === plan.id
                                    ? `bg-${plan.color}-500 border-${plan.color}-500`
                                    : "border-gray-300"
                                }`}
                              >
                                {formData.membershipLevel === plan.id && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Setup (Optional) */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Checkbox
                          id="skipPayment"
                          checked={formData.skipPayment}
                          onCheckedChange={(checked) =>
                            handleInputChange("skipPayment", checked)
                          }
                        />
                        <Label htmlFor="skipPayment" className="text-sm">
                          I'll add payment information later
                        </Label>
                      </div>

                      {!formData.skipPayment && (
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="paypalEmail">
                              PayPal Email (optional)
                            </Label>
                            <Input
                              id="paypalEmail"
                              type="email"
                              value={formData.paypalEmail}
                              onChange={(e) =>
                                handleInputChange("paypalEmail", e.target.value)
                              }
                              placeholder="your-email@paypal.com"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cashAppTag">
                              CashApp Tag (optional)
                            </Label>
                            <Input
                              id="cashAppTag"
                              value={formData.cashAppTag}
                              onChange={(e) =>
                                handleInputChange("cashAppTag", e.target.value)
                              }
                              placeholder="$YourCashTag"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeToTerms", checked)
                        }
                        className="mt-1"
                      />
                      <Label
                        htmlFor="agreeToTerms"
                        className="text-sm text-gray-600 leading-relaxed"
                      >
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-purple-600 hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-purple-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        , and understand the commission structure for my chosen
                        plan.
                      </Label>
                    </div>

                    <Button
                      onClick={handleSignUp}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Links */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {isSignUpMode
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUpMode(!isSignUpMode);
                  setError("");
                  setSuccess("");
                }}
                className="text-purple-600 hover:underline font-medium"
              >
                {isSignUpMode ? "Sign in here" : "Sign up here"}
              </button>
            </p>
          </div>

          {/* Debug Section */}
          <div className="text-center mt-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs"
              >
                {showDebug ? "Hide" : "Show"} Existing Accounts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="text-xs text-red-600 border-red-300"
              >
                Clear All Data
              </Button>
            </div>

            {showDebug && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">
                    Existing User Accounts ({allUsers.length})
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open("/admin/database", "_blank")}
                      className="text-xs h-6 px-2"
                    >
                      <Database className="w-3 h-3 mr-1" />
                      Admin Panel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (
                          confirm("This will clear all user data. Continue?")
                        ) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                      className="text-xs h-6 px-2 text-red-600"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear Data
                    </Button>
                  </div>
                </div>

                {allUsers.length === 0 ? (
                  <div className="text-center py-6">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      No users found. Create an account to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {allUsers.map((user) => (
                      <div
                        key={user.id}
                        className="bg-white p-3 rounded border hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">
                                {user.name}
                              </span>
                              <Badge
                                variant={
                                  user.verified ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {user.verified ? "Verified" : "Unverified"}
                              </Badge>
                              {user.membershipLevel &&
                                user.membershipLevel !== "free" && (
                                  <Badge variant="outline" className="text-xs">
                                    {user.membershipLevel}
                                  </Badge>
                                )}
                            </div>

                            <div className="space-y-1 text-xs text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>@{user.username || "N/A"}</span>
                              </div>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="flex items-center">
                                  <DollarSign className="w-3 h-3 mr-1" />$
                                  {(user.totalEarnings || 0).toFixed(2)}
                                </span>
                                <span className="flex items-center">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  {user.salesCount || 0} sales
                                </span>
                                <span className="text-gray-500">
                                  {new Date(user.joinDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1 ml-3">
                            <Button
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  emailOrPhone: user.email,
                                  password: "",
                                }));
                                setIsSignUpMode(false);
                                setError("");
                                setSuccess("");
                              }}
                              className="text-xs h-6 px-2"
                            >
                              <Mail className="w-3 h-3 mr-1" />
                              Email
                            </Button>
                            {user.phone && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    emailOrPhone: user.phone,
                                    password: "",
                                  }));
                                  setIsSignUpMode(false);
                                  setError("");
                                  setSuccess("");
                                }}
                                className="text-xs h-6 px-2"
                              >
                                <Phone className="w-3 h-3 mr-1" />
                                Phone
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                window.open(
                                  `/admin/database?user=${user.id}`,
                                  "_blank",
                                )
                              }
                              className="text-xs h-6 px-2"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Total: {allUsers.length} accounts</span>
                    <span>Database: localStorage</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowDebug(false)}
                      className="text-xs h-5 px-1"
                    >
                      Hide
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BackToTop />
    </div>
  );
}
