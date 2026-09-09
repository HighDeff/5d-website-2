import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserAuth } from "@/hooks/useUserAuth";

interface FunctionalSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FunctionalSignupModal({
  isOpen,
  onClose,
}: FunctionalSignupModalProps) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, signIn } = useUserAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "signup" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (mode === "signup") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === "signup") {
        const result = signUp(formData.name, formData.email, formData.password);
        if (result.success) {
          // Show success message
          const successDiv = document.createElement("div");
          successDiv.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; max-width: 400px;">
              <div style="font-weight: bold; margin-bottom: 8px;">🎉 Welcome to Lilly's Fashion!</div>
              <div style="font-size: 14px; opacity: 0.9;">Account created successfully</div>
              <div style="font-size: 12px; margin-top: 8px;">You can now start selling and earning commissions!</div>
            </div>
          `;
          document.body.appendChild(successDiv.firstElementChild as Element);

          setTimeout(() => {
            const notification = document.body.lastElementChild;
            if (
              notification &&
              notification.textContent?.includes("Welcome to Lilly's Fashion")
            ) {
              document.body.removeChild(notification);
            }
          }, 5000);

          onClose();
        }
      } else {
        const result = signIn(formData.email, formData.password);
        if (result.success) {
          onClose();
        } else {
          setErrors({ general: "Invalid email or password" });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    });
    setErrors({});
  };

  const switchMode = () => {
    setMode(mode === "signup" ? "signin" : "signup");
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {mode === "signup" ? "Join Lilly's Fashion" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "signup"
              ? "Start your fashion business journey today"
              : "Sign in to your account"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {mode === "signup" && (
            <>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      agreeToTerms: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <a href="/terms" className="text-purple-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-purple-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
              )}
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : mode === "signup"
                ? "Create Account"
                : "Sign In"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-purple-600 hover:underline text-sm"
            >
              {mode === "signup"
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        {mode === "signup" && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <h4 className="font-semibold text-purple-800 mb-2">
              Start Earning Today!
            </h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Upload and sell your products</li>
              <li>• Keep 85% of sales (90% with membership)</li>
              <li>• Access to analytics and customer management</li>
              <li>• Join our community of successful sellers</li>
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
