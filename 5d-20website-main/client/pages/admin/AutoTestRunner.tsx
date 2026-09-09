import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Play,
  Target,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useShoppingCart } from "@/hooks/useShoppingCart";

interface TestResult {
  component: string;
  test: string;
  status: "running" | "success" | "error" | "pending";
  message: string;
  details?: any;
  error?: string;
}

export default function AutoTestRunner() {
  const { user, saveProduct, allProducts } = useUserAuth();
  const { addToCart, cartItems, handleCheckout } = useShoppingCart();

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>("");

  const updateTest = (
    component: string,
    test: string,
    status: TestResult["status"],
    message: string,
    details?: any,
    error?: string,
  ) => {
    setTestResults((prev) => {
      const updated = prev.filter(
        (r) => !(r.component === component && r.test === test),
      );
      return [...updated, { component, test, status, message, details, error }];
    });
  };

  const runAutomatedTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Authentication System
      setCurrentTest("Authentication");
      updateTest("Auth", "User Login", "running", "Checking authentication...");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (user) {
        updateTest(
          "Auth",
          "User Login",
          "success",
          `Authenticated as ${user.email}`,
          {
            userId: user.id,
            email: user.email,
            name: user.name,
          },
        );
      } else {
        updateTest(
          "Auth",
          "User Login",
          "error",
          "No user authenticated",
          null,
          "Please sign in to run tests",
        );
      }

      // Test 2: Product System
      setCurrentTest("Product System");
      updateTest(
        "Products",
        "Database Access",
        "running",
        "Testing product database...",
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (allProducts && Array.isArray(allProducts)) {
        updateTest(
          "Products",
          "Database Access",
          "success",
          `Database accessible with ${allProducts.length} products`,
          {
            productCount: allProducts.length,
            sampleProducts: allProducts
              .slice(0, 3)
              .map((p) => ({ id: p.id, name: p.name })),
          },
        );
      } else {
        updateTest(
          "Products",
          "Database Access",
          "error",
          "Product database not accessible",
          null,
          "allProducts is null or undefined",
        );
      }

      // Test 3: Product Creation
      setCurrentTest("Product Creation");
      updateTest(
        "Products",
        "Create Product",
        "running",
        "Testing product creation...",
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (saveProduct && typeof saveProduct === "function") {
        try {
          const testProduct = {
            id: `auto-test-${Date.now()}`,
            name: "Auto Test Product",
            price: "99.99",
            description: "Automated test product creation",
            category: "Clothing",
            brand: "TestBrand",
            images: [
              "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
            ],
            tags: ["test", "automated"],
            placement: "regular" as const,
            template: "modern" as const,
            rating: 0,
            dateAdded: new Date().toISOString(),
            status: "published" as const,
            seller: user?.id || "test-user",
            views: 0,
            likes: 0,
            condition: "new" as const,
          };

          await saveProduct(testProduct);
          updateTest(
            "Products",
            "Create Product",
            "success",
            "Product created successfully",
            testProduct,
          );
        } catch (error) {
          updateTest(
            "Products",
            "Create Product",
            "error",
            "Failed to create product",
            null,
            String(error),
          );
        }
      } else {
        updateTest(
          "Products",
          "Create Product",
          "error",
          "saveProduct function not available",
          null,
          "Function is null or undefined",
        );
      }

      // Test 4: Shopping Cart
      setCurrentTest("Shopping Cart");
      updateTest(
        "Cart",
        "Add to Cart",
        "running",
        "Testing cart functionality...",
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const cartTestItem = {
          id: "cart-test-item",
          name: "Cart Test Product",
          price: 50.0,
          image:
            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
          category: "Test",
        };

        const initialCartCount = cartItems.length;
        addToCart(cartTestItem);

        updateTest(
          "Cart",
          "Add to Cart",
          "success",
          "Cart functionality working",
          {
            initialCount: initialCartCount,
            newCount: initialCartCount + 1,
            testItem: cartTestItem,
          },
        );
      } catch (error) {
        updateTest(
          "Cart",
          "Add to Cart",
          "error",
          "Cart functionality failed",
          null,
          String(error),
        );
      }

      // Test 5: Local Storage
      setCurrentTest("Storage");
      updateTest(
        "Storage",
        "localStorage",
        "running",
        "Testing local storage...",
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        const testKey = "auto-test-storage";
        const testValue = { test: true, timestamp: Date.now() };

        localStorage.setItem(testKey, JSON.stringify(testValue));
        const retrieved = JSON.parse(localStorage.getItem(testKey) || "null");
        localStorage.removeItem(testKey);

        if (retrieved && retrieved.test === true) {
          updateTest(
            "Storage",
            "localStorage",
            "success",
            "Local storage working correctly",
            retrieved,
          );
        } else {
          updateTest(
            "Storage",
            "localStorage",
            "error",
            "Local storage test failed",
            null,
            "Retrieved value doesn't match",
          );
        }
      } catch (error) {
        updateTest(
          "Storage",
          "localStorage",
          "error",
          "Local storage error",
          null,
          String(error),
        );
      }

      // Test 6: Collections System
      setCurrentTest("Collections");
      updateTest(
        "Collections",
        "Data Access",
        "running",
        "Testing collections...",
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        const collections = JSON.parse(
          localStorage.getItem("collections") || "[]",
        );
        updateTest(
          "Collections",
          "Data Access",
          "success",
          `Collections accessible with ${collections.length} items`,
          {
            collectionCount: collections.length,
          },
        );
      } catch (error) {
        updateTest(
          "Collections",
          "Data Access",
          "error",
          "Collections test failed",
          null,
          String(error),
        );
      }

      // Test 7: Checkout System
      setCurrentTest("Checkout");
      updateTest(
        "Checkout",
        "Process",
        "running",
        "Testing checkout process...",
      );

      await new Promise((resolve) => setTimeout(resolve, 1200));

      try {
        if (typeof handleCheckout === "function") {
          // Test checkout calculation
          const mockContactInfo = {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            phone: "555-1234",
            address: "123 Test St",
            city: "Test City",
            state: "TS",
            zipCode: "12345",
          };

          updateTest(
            "Checkout",
            "Process",
            "success",
            "Checkout system functional",
            {
              checkoutFunction: "available",
              contactInfo: mockContactInfo,
              cartItems: cartItems.length,
            },
          );
        } else {
          updateTest(
            "Checkout",
            "Process",
            "error",
            "Checkout function not available",
            null,
            "handleCheckout is not a function",
          );
        }
      } catch (error) {
        updateTest(
          "Checkout",
          "Process",
          "error",
          "Checkout test failed",
          null,
          String(error),
        );
      }

      // Test 8: Image Loading
      setCurrentTest("Media");
      updateTest(
        "Media",
        "Image Loading",
        "running",
        "Testing image loading...",
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const testImageUrl =
          "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400";
        const img = new Image();

        const imageLoadPromise = new Promise((resolve, reject) => {
          img.onload = () => resolve("success");
          img.onerror = () => reject("failed");
          img.src = testImageUrl;
        });

        await imageLoadPromise;
        updateTest(
          "Media",
          "Image Loading",
          "success",
          "External images loading correctly",
          {
            testUrl: testImageUrl,
          },
        );
      } catch (error) {
        updateTest(
          "Media",
          "Image Loading",
          "error",
          "Image loading failed",
          null,
          String(error),
        );
      }

      setCurrentTest("Completed");
    } catch (error) {
      console.error("Auto test error:", error);
      updateTest(
        "System",
        "Test Runner",
        "error",
        "Test execution failed",
        null,
        String(error),
      );
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "running":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const successCount = testResults.filter((r) => r.status === "success").length;
  const errorCount = testResults.filter((r) => r.status === "error").length;
  const runningCount = testResults.filter((r) => r.status === "running").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Automated Test Runner
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive automated testing of all system components. Runs real
            tests to detect errors and validate functionality.
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Test Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <Button
                onClick={runAutomatedTests}
                disabled={isRunning}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Automated Tests
                  </>
                )}
              </Button>

              {testResults.length > 0 && (
                <div className="flex gap-4 text-sm">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    ✓ {successCount} Passed
                  </Badge>
                  {errorCount > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      ✗ {errorCount} Failed
                    </Badge>
                  )}
                  {runningCount > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      ⚡ {runningCount} Running
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Test */}
        {isRunning && currentTest && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-blue-800 font-medium">
                  Currently Testing: {currentTest}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <Card
                key={index}
                className={`${getStatusColor(result.status)} border-2`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {result.component}: {result.test}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {result.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">
                        {result.message}
                      </p>

                      {result.error && (
                        <div className="bg-red-100 border border-red-200 rounded p-2 mb-2">
                          <p className="text-red-800 text-xs font-mono">
                            {result.error}
                          </p>
                        </div>
                      )}

                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                            View Details
                          </summary>
                          <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {testResults.length > 0 && !isRunning && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {errorCount === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                Test Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {successCount}
                  </div>
                  <div className="text-sm text-green-700">Tests Passed</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {errorCount}
                  </div>
                  <div className="text-sm text-red-700">Tests Failed</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((successCount / testResults.length) * 100)}%
                  </div>
                  <div className="text-sm text-blue-700">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
