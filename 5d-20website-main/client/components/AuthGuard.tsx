import React, { useEffect } from "react";
import { useUserAuth } from "../hooks/useUserAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, User, ArrowRight } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = "/",
  requireAuth = true,
}) => {
  const { isSignedIn, currentUser, isLoading } = useUserAuth();

  useEffect(() => {
    // Only redirect if auth is loaded and user is definitely not signed in
    if (requireAuth && !isLoading && !isSignedIn && !currentUser) {
      // Scroll to auth section instead of redirecting
      setTimeout(() => {
        const authSection = document.getElementById("auth-section");
        if (authSection) {
          authSection.scrollIntoView({ behavior: "smooth" });
        } else {
          // If no auth section, redirect to home
          window.location.href = redirectTo;
        }
      }, 200);
    }
  }, [isSignedIn, currentUser, isLoading, requireAuth, redirectTo]);

  if (requireAuth && !isLoading && !isSignedIn && !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">
              Sign In Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-pink-100">
              You need to be signed in to access this page. Please create an
              account or sign in to continue.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                onClick={() => (window.location.href = redirectTo)}
              >
                <User className="w-4 h-4 mr-2" />
                Go to Sign In
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10"
                onClick={() => window.history.back()}
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
