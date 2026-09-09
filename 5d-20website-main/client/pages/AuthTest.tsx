import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserAuth } from "../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";

const AuthTest: React.FC = () => {
  const { signUp, currentUser, isSignedIn, allUsers } = useUserAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleTestSignup = () => {
    console.log("=== TESTING SIGNUP ===");
    console.log("Input email:", email);
    console.log("Input name:", name);
    console.log("Current users before signup:", allUsers);
    console.log("Is signed in before:", isSignedIn);
    console.log("Current user before:", currentUser);

    if (!email || !name) {
      alert("Please enter both name and email");
      return;
    }

    const result = signUp(name, email, "testpass123", "free");

    console.log("Signup result:", result);

    // Check localStorage immediately
    const savedUser = localStorage.getItem("currentUser");
    const savedUsers = localStorage.getItem("allUsers");

    console.log("localStorage currentUser after signup:", savedUser);
    console.log("localStorage allUsers after signup:", savedUsers);

    if (result && result.success) {
      alert("Account created! Check console for details.");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      alert("Failed: " + (result?.error || "Unknown error"));
    }
  };

  const checkAuthState = () => {
    console.log("=== CURRENT AUTH STATE ===");
    console.log("isSignedIn:", isSignedIn);
    console.log("currentUser:", currentUser);
    console.log("allUsers:", allUsers);
    console.log(
      "localStorage currentUser:",
      localStorage.getItem("currentUser"),
    );
    console.log("localStorage allUsers:", localStorage.getItem("allUsers"));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Auth System Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <Button onClick={handleTestSignup} className="w-full">
            Test Signup
          </Button>

          <Button onClick={checkAuthState} variant="outline" className="w-full">
            Check Auth State
          </Button>

          <div className="text-sm text-gray-600 space-y-1">
            <p>Signed In: {isSignedIn ? "Yes" : "No"}</p>
            <p>Current User: {currentUser?.name || "None"}</p>
            <p>Total Users: {allUsers.length}</p>
          </div>

          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="w-full"
          >
            Go to Dashboard
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest;
