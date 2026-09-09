import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Star, DollarSign, Package, Users, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";

const AuthSection: React.FC = () => {
  const { signIn, signUp, currentUser, isSignedIn, isLoading } = useUserAuth();
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // Show loading state during initialization to prevent glitching
  if (isLoading) {
    return (
      <section
        id="auth-section"
        className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  // If user is already signed in, show welcome message instead of forms
  if (isSignedIn && currentUser) {
    return (
      <section
        id="auth-section"
        className="py-20 bg-gradient-to-br from-green-800 via-emerald-800 to-green-900 text-white"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
              Welcome back, {currentUser.name}! 👋
            </h2>
            <p className="text-xl text-green-100 mb-8">
              You're signed in and ready to buy, sell, and explore our
              marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                  <Package className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/upload">
                <Button
                  variant="outline"
                  className="border-green-400 text-green-200 hover:bg-green-800 px-8 py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Upload Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleSignIn = () => {
    if (signInData.email && signInData.password) {
      try {
        const result = signIn(signInData.email, signInData.password);
        if (result.success) {
          // Don't automatically redirect - let user stay on current page
          console.log("Signed in successfully:", result.user);
          // Just update the UI state, no redirect
        } else {
          alert(
            "Invalid credentials. Please check your email and password or create a new account.",
          );
        }
      } catch (error) {
        console.error("Sign in error:", error);
        alert("Sign in failed. Please try again.");
      }
    } else {
      alert("Please enter both email and password");
    }
  };

  const handleSignUp = () => {
    console.log("Starting signup process...", signUpData);
    console.log("SignUp function available:", typeof signUp);

    if (!signUp) {
      alert("Sign up function not available. Please refresh the page.");
      return;
    }

    // Only email is required for basic signup
    if (!signUpData.email) {
      alert("Email is required to create an account");
      return;
    }

    if (!signUpData.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    setIsCreatingAccount(true);

    try {
      // Use provided name or generate from email
      const fullName =
        signUpData.firstName && signUpData.lastName
          ? `${signUpData.firstName} ${signUpData.lastName}`
          : signUpData.firstName
            ? signUpData.firstName
            : signUpData.email.split("@")[0];

      console.log("Generated full name:", fullName);

      // Store form data for next page
      const formData = {
        name: fullName,
        email: signUpData.email,
        phone: signUpData.phone,
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("userFormData", JSON.stringify(formData));

      console.log("Calling signUp function...");
      const result = signUp(
        fullName,
        signUpData.email,
        signUpData.password || "quicksignup123", // Default password if not provided
        "free",
      );

      console.log("SignUp result:", result);

      if (result && result.success) {
        // Reset form
        setSignUpData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
        });

        // Verify user was saved
        const savedUser = localStorage.getItem("currentUser");
        console.log("Saved user in localStorage:", savedUser);

        // Success! Stay on current page, just update UI
        console.log("Account created successfully, user can continue browsing");
        // The AuthSection will automatically update to show signed-in state
      } else {
        const errorMessage =
          result?.error || "Failed to create account. Email may already exist.";
        console.error("Account creation failed:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        "Failed to create account. Please try again. Error: " + error.message,
      );
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <section
      id="auth-section"
      className="py-20 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 text-white"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
              Join Our Community
            </h2>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              Sign in to your account or create a new one to start buying,
              selling, and earning
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sign In Form */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  Sign In
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signInEmail" className="text-pink-100">
                    Email or Phone
                  </Label>
                  <Input
                    id="signInEmail"
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={signInData.email}
                    onChange={(e) =>
                      setSignInData({ ...signInData, email: e.target.value })
                    }
                    className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signInPassword" className="text-pink-100">
                    Password
                  </Label>
                  <Input
                    id="signInPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) =>
                      setSignInData({ ...signInData, password: e.target.value })
                    }
                    className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3"
                  onClick={handleSignIn}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <div className="text-center">
                  <Link
                    to="/auth"
                    className="text-pink-200 hover:text-white text-sm"
                  >
                    Forgot password? Reset here
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Sign Up Form */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Star className="w-6 h-6 mr-2" />
                  Create Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="w-5 h-5 text-green-300 mr-1" />
                    <span className="text-green-200 font-semibold">
                      Keep 90% of Your Sales!
                    </span>
                  </div>
                  <p className="text-green-100 text-sm text-center">
                    Only 10% platform fee • Fast withdrawals
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="signUpFirstName" className="text-pink-100">
                      First Name
                    </Label>
                    <Input
                      id="signUpFirstName"
                      placeholder="John"
                      value={signUpData.firstName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          firstName: e.target.value,
                        })
                      }
                      className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signUpLastName" className="text-pink-100">
                      Last Name
                    </Label>
                    <Input
                      id="signUpLastName"
                      placeholder="Doe"
                      value={signUpData.lastName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          lastName: e.target.value,
                        })
                      }
                      className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signUpEmail" className="text-pink-100">
                    Email <span className="text-red-300">*</span>
                  </Label>
                  <Input
                    id="signUpEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, email: e.target.value })
                    }
                    className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signUpPhone" className="text-pink-100">
                    Phone Number (optional)
                  </Label>
                  <Input
                    id="signUpPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={signUpData.phone}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, phone: e.target.value })
                    }
                    className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signUpPassword" className="text-pink-100">
                    Password (optional)
                  </Label>
                  <Input
                    id="signUpPassword"
                    type="password"
                    placeholder="Leave blank for quick signup"
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, password: e.target.value })
                    }
                    className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                  />
                  <p className="text-xs text-pink-200/70">
                    * Only email required • Add details later in your profile
                  </p>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3"
                  onClick={handleSignUp}
                  disabled={isCreatingAccount}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {isCreatingAccount
                    ? "Creating Account..."
                    : "Create Account & Start Selling"}
                </Button>

                <div className="text-center text-pink-200 text-xs">
                  By signing up, you agree to our{" "}
                  <Link
                    to="/terms"
                    className="text-pink-100 hover:text-white underline"
                  >
                    Terms of Service
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur">
              <Package className="w-12 h-12 text-pink-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Start Selling Today
              </h3>
              <p className="text-pink-100 text-sm">
                List unlimited products and reach thousands of customers
              </p>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur">
              <DollarSign className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Keep More Earnings
              </h3>
              <p className="text-pink-100 text-sm">
                Only 10% platform fee - you keep 90% of every sale
              </p>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur">
              <Users className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Join Community
              </h3>
              <p className="text-pink-100 text-sm">
                Connect with buyers and sellers in our growing marketplace
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
