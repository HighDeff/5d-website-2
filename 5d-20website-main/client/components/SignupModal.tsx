import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  DollarSign,
  Gift,
  Crown,
  Package,
  Percent,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [quickFormData, setQuickFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    wantToSell: false,
    agreeToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setQuickFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickSignup = () => {
    // Store quick signup data in sessionStorage for the full signup page
    sessionStorage.setItem("quickSignupData", JSON.stringify(quickFormData));
    onClose();
    window.location.href = "/signup";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-md mx-4 shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div></div>
            <CardTitle className="text-2xl font-bold">
              Join & Start Earning
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-purple-100 mt-2">
            Quick signup to start selling today!
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {/* Commission Highlight */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-6 h-6 text-green-600 mr-2" />
              <span className="font-bold text-green-800 text-lg">
                Keep 90% of Sales!
              </span>
            </div>
            <p className="text-sm text-green-600">
              Only 10% platform fee • Fast withdrawals • No monthly costs
            </p>
          </div>

          {/* Quick Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="quickFirstName" className="text-xs">
                  First Name
                </Label>
                <Input
                  id="quickFirstName"
                  value={quickFormData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="First name"
                  className="border-purple-200 focus:border-purple-400 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="quickLastName" className="text-xs">
                  Last Name
                </Label>
                <Input
                  id="quickLastName"
                  value={quickFormData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Last name"
                  className="border-purple-200 focus:border-purple-400 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="quickEmail" className="text-xs">
                Email Address
              </Label>
              <Input
                id="quickEmail"
                type="email"
                value={quickFormData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                className="border-purple-200 focus:border-purple-400 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="quickPhone" className="text-xs">
                Phone Number
              </Label>
              <Input
                id="quickPhone"
                type="tel"
                value={quickFormData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                className="border-purple-200 focus:border-purple-400 text-sm"
              />
            </div>

            {/* Selling Option */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="quickWantToSell"
                  checked={quickFormData.wantToSell}
                  onCheckedChange={(checked) =>
                    handleInputChange("wantToSell", checked)
                  }
                />
                <label
                  htmlFor="quickWantToSell"
                  className="text-sm font-medium flex items-center"
                >
                  <Package className="w-4 h-4 mr-2 text-purple-600" />I want to
                  sell products and earn money
                </label>
              </div>
              {quickFormData.wantToSell && (
                <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                  <div className="flex items-center text-xs text-green-600 mb-1">
                    <Percent className="w-3 h-3 mr-1" />
                    <span className="font-medium">Commission Structure:</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    • You keep 90% of every sale
                    <br />
                    • We handle payments & shipping
                    <br />• Weekly payouts to your bank
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="quickAgreeToTerms"
                checked={quickFormData.agreeToTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms", checked)
                }
                className="mt-1"
              />
              <label
                htmlFor="quickAgreeToTerms"
                className="text-xs text-gray-600"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-purple-600 hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </Link>
                {quickFormData.wantToSell && (
                  <span>
                    {" "}
                    and the 10% commission fee for selling on the platform
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleQuickSignup}
              disabled={
                !quickFormData.firstName ||
                !quickFormData.lastName ||
                !quickFormData.email ||
                !quickFormData.phone ||
                !quickFormData.agreeToTerms
              }
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-semibold"
            >
              {quickFormData.wantToSell ? (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Create Seller Account
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/signup"
                onClick={onClose}
                className="text-sm text-purple-600 hover:underline"
              >
                Need more options? Use full signup form →
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <Gift className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                <div className="text-xs font-medium text-yellow-800">
                  $10 Bonus
                </div>
                <div className="text-xs text-yellow-600">First Sale</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <Star className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-xs font-medium text-blue-800">
                  Free Listing
                </div>
                <div className="text-xs text-blue-600">No Setup Fees</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
