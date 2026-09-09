import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  Gift,
  Crown,
  Zap,
  TrendingUp,
  Users,
  Package,
  Eye,
  Heart,
  CreditCard,
  Landmark,
  Percent,
  Send,
  MessageSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/hooks/useUserAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useUserAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationMethod, setVerificationMethod] = useState<"email" | "sms">(
    "email",
  );
  const [wantToSell, setWantToSell] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToCommission: false,
    bankAccount: "",
    routingNumber: "",
    paypalEmail: "",
    cashAppTag: "",
    skipPayment: false,
    sellDescription: "",
    expectedProducts: "",
    verificationCode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const sendVerification = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setVerificationSent(true);
    setIsLoading(false);
    setCurrentStep(3);
  };

  const completeSignup = async () => {
    setIsLoading(true);

    try {
      // Create the user account
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const result = signUp(fullName, formData.email, formData.password);

      if (result.success) {
        console.log("User created successfully:", result.user);

        // Send welcome email (simulate)
        console.log("Sending welcome email to:", formData.email);
        console.log("Sending verification email to:", formData.email);

        setIsLoading(false);

        // Redirect to user dashboard
        navigate("/dashboard");
      } else {
        console.error("Signup failed:", result.error);
        alert(result.error || "Signup failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup. Please try again.");
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step <= currentStep
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? "bg-purple-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Join Lilly's Fashion
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {renderStepIndicator()}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create Your Account
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Join thousands of successful sellers on our platform
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Enter your first name"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Enter your last name"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Create a strong password"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="flex items-center"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder="Confirm your password"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreeToTerms", checked)
                    }
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-gray-600"
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
                  </label>
                </div>

                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.email ||
                    !formData.phone ||
                    !formData.password ||
                    !formData.confirmPassword ||
                    !formData.agreeToTerms
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
                >
                  Continue to Selling Options
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Selling Options */}
          {currentStep === 2 && (
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Start Selling & Earning
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Set up your seller account with our 10% commission system
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Commission Info Card */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-xl font-bold text-green-800">
                        90% Profit Share
                      </h3>
                      <p className="text-green-600">
                        You keep 90% of every sale!
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        90%
                      </div>
                      <div className="text-sm text-green-700">
                        Your Earnings
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        10%
                      </div>
                      <div className="text-sm text-purple-700">
                        Platform Fee
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        Fast
                      </div>
                      <div className="text-sm text-blue-700">Withdrawals</div>
                    </div>
                  </div>
                </div>

                {/* Want to Sell Toggle */}
                <div className="flex items-center space-x-4">
                  <Checkbox
                    id="wantToSell"
                    checked={wantToSell}
                    onCheckedChange={setWantToSell}
                  />
                  <label htmlFor="wantToSell" className="text-lg font-medium">
                    Yes, I want to sell products on your platform
                  </label>
                </div>

                {wantToSell && (
                  <div className="space-y-6 p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="space-y-2">
                      <Label
                        htmlFor="sellDescription"
                        className="flex items-center"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        What do you want to sell?
                      </Label>
                      <Textarea
                        id="sellDescription"
                        value={formData.sellDescription}
                        onChange={(e) =>
                          handleInputChange("sellDescription", e.target.value)
                        }
                        placeholder="Describe the products you'd like to sell (jewelry, clothing, accessories, etc.)"
                        className="border-purple-200 focus:border-purple-400"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="expectedProducts"
                        className="flex items-center"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        How many products do you plan to list?
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("expectedProducts", value)
                        }
                      >
                        <SelectTrigger className="border-purple-200 focus:border-purple-400">
                          <SelectValue placeholder="Select estimated quantity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 products</SelectItem>
                          <SelectItem value="6-20">6-20 products</SelectItem>
                          <SelectItem value="21-50">21-50 products</SelectItem>
                          <SelectItem value="51-100">
                            51-100 products
                          </SelectItem>
                          <SelectItem value="100+">100+ products</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Payment Information (for withdrawals)
                      </h4>

                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="skipPayment"
                          checked={formData.skipPayment}
                          onCheckedChange={(checked) =>
                            handleInputChange("skipPayment", checked)
                          }
                        />
                        <Label htmlFor="skipPayment" className="text-sm">
                          Skip payment setup for now (you can add this later)
                        </Label>
                      </div>

                      {!formData.skipPayment && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="paypalEmail">PayPal Email</Label>
                              <Input
                                id="paypalEmail"
                                type="email"
                                value={formData.paypalEmail}
                                onChange={(e) =>
                                  handleInputChange(
                                    "paypalEmail",
                                    e.target.value,
                                  )
                                }
                                placeholder="your-email@paypal.com"
                                className="border-purple-200 focus:border-purple-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cashAppTag">CashApp Tag</Label>
                              <Input
                                id="cashAppTag"
                                value={formData.cashAppTag}
                                onChange={(e) =>
                                  handleInputChange(
                                    "cashAppTag",
                                    e.target.value,
                                  )
                                }
                                placeholder="$YourCashTag"
                                className="border-purple-200 focus:border-purple-400"
                              />
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h5 className="font-medium text-blue-800 mb-2">
                              Alternative: Bank Account
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="routingNumber">
                                  Routing Number
                                </Label>
                                <Input
                                  id="routingNumber"
                                  value={formData.routingNumber}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "routingNumber",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Bank routing number"
                                  className="border-blue-200 focus:border-blue-400"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="bankAccount">
                                  Account Number
                                </Label>
                                <Input
                                  id="bankAccount"
                                  value={formData.bankAccount}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "bankAccount",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Bank account number"
                                  className="border-blue-200 focus:border-blue-400"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToCommission"
                        checked={formData.agreeToCommission}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeToCommission", checked)
                        }
                      />
                      <label
                        htmlFor="agreeToCommission"
                        className="text-sm text-gray-600"
                      >
                        I agree to the 10% commission fee and understand that
                        90% of my sales will be deposited to my bank account
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={
                      wantToSell &&
                      (!formData.agreeToCommission ||
                        !formData.sellDescription ||
                        !formData.expectedProducts)
                    }
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Continue to Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Verification */}
          {currentStep === 3 && (
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Verify Your Account
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Choose your preferred verification method
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant={
                      verificationMethod === "email" ? "default" : "outline"
                    }
                    onClick={() => setVerificationMethod("email")}
                    className={`p-6 h-auto flex flex-col items-center space-y-2 ${
                      verificationMethod === "email"
                        ? "bg-purple-600 text-white"
                        : "border-purple-200 hover:border-purple-400"
                    }`}
                  >
                    <Mail className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-semibold">Email Verification</div>
                      <div className="text-sm opacity-80">
                        Verify via {formData.email}
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant={
                      verificationMethod === "sms" ? "default" : "outline"
                    }
                    onClick={() => setVerificationMethod("sms")}
                    className={`p-6 h-auto flex flex-col items-center space-y-2 ${
                      verificationMethod === "sms"
                        ? "bg-purple-600 text-white"
                        : "border-purple-200 hover:border-purple-400"
                    }`}
                  >
                    <MessageSquare className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-semibold">SMS Verification</div>
                      <div className="text-sm opacity-80">
                        Verify via {formData.phone}
                      </div>
                    </div>
                  </Button>
                </div>

                {!verificationSent ? (
                  <Button
                    onClick={sendVerification}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Send className="w-4 h-4 mr-2 animate-spin" />
                        Sending Verification...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Verification{" "}
                        {verificationMethod === "email" ? "Email" : "SMS"}
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800 font-medium">
                        Verification code sent to your{" "}
                        {verificationMethod === "email" ? "email" : "phone"}!
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">
                        Enter Verification Code
                      </Label>
                      <Input
                        id="verificationCode"
                        value={formData.verificationCode}
                        onChange={(e) =>
                          handleInputChange("verificationCode", e.target.value)
                        }
                        placeholder="Enter 6-digit code"
                        className="border-purple-200 focus:border-purple-400 text-center text-2xl font-bold"
                        maxLength={6}
                      />
                    </div>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      disabled={formData.verificationCode.length !== 6}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
                    >
                      Verify & Continue
                    </Button>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Welcome */}
          {currentStep === 4 && (
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome to Lilly's Fashion!
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Your account is ready. Let's complete your setup.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8">
                    <Crown className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Account Created Successfully!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Welcome email sent to {formData.email}
                    </p>

                    {wantToSell && (
                      <div className="bg-white rounded-lg p-4 border border-green-300">
                        <div className="flex items-center justify-center mb-2">
                          <Percent className="w-6 h-6 text-green-600 mr-2" />
                          <span className="font-bold text-green-800">
                            Seller Account Activated
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          You can now start listing products and earning 90% on
                          every sale!
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-purple-800">
                        Join Community
                      </h4>
                      <p className="text-sm text-purple-600">
                        Connect with other sellers
                      </p>
                    </div>
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                      <Gift className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-pink-800">
                        Welcome Bonus
                      </h4>
                      <p className="text-sm text-pink-600">
                        $10 credit on your first sale
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={completeSignup}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Crown className="w-5 h-5 mr-2 animate-spin" />
                      Setting up your membership...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Go to My Membership Dashboard
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
