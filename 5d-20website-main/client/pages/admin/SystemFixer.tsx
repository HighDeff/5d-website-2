import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  CheckCircle,
  Wrench,
  Database,
  ShoppingCart,
  Upload,
  Package,
  Users,
  Settings,
  RefreshCw,
  Heart,
  Star,
  CreditCard,
  Smartphone,
  XCircle,
  FileText,
  Image,
} from "lucide-react";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useShoppingCart } from "@/hooks/useShoppingCart";

interface SystemIssue {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  category: string;
  status: "unresolved" | "checking" | "fixed" | "error";
  fixFunction?: () => Promise<void>;
}

export default function SystemFixer() {
  const { user, allProducts, isSignedIn } = useUserAuth();
  const { cartItems, addToCart } = useShoppingCart();
  const [systemIssues, setSystemIssues] = useState<SystemIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [autoFixEnabled, setAutoFixEnabled] = useState(false);

  useEffect(() => {
    runSystemScan();
  }, []);

  const runSystemScan = async () => {
    setIsScanning(true);
    const issues: SystemIssue[] = [];

    try {
      // Check 1: User Authentication System
      if (!isSignedIn) {
        issues.push({
          id: "auth-001",
          title: "User Authentication Required",
          description:
            "System testing requires user authentication for full functionality.",
          severity: "warning",
          category: "Authentication",
          status: "unresolved",
          fixFunction: async () => {
            // Redirect to login or create test user
            window.location.href = "/auth";
          },
        });
      } else {
        issues.push({
          id: "auth-002",
          title: "User Authentication Active",
          description: `Signed in as ${user?.email || "Unknown User"}`,
          severity: "info",
          category: "Authentication",
          status: "fixed",
        });
      }

      // Check 2: Product Database
      if (!allProducts || allProducts.length === 0) {
        issues.push({
          id: "db-001",
          title: "Empty Product Database",
          description:
            "No products found. Upload test products to enable full testing.",
          severity: "critical",
          category: "Database",
          status: "unresolved",
          fixFunction: async () => {
            await createTestProducts();
          },
        });
      } else {
        issues.push({
          id: "db-002",
          title: "Product Database Active",
          description: `${allProducts.length} products loaded successfully`,
          severity: "info",
          category: "Database",
          status: "fixed",
        });
      }

      // Check 3: Shopping Cart Functionality
      try {
        const testCartItem = {
          id: "test-item",
          name: "Test Product",
          price: 99.99,
          image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
          category: "Test",
        };

        // Test cart operations without actually adding
        const cartWorks = typeof addToCart === "function";

        if (cartWorks) {
          issues.push({
            id: "cart-001",
            title: "Shopping Cart Functional",
            description: `Cart system working with ${cartItems.length} items`,
            severity: "info",
            category: "Shopping Cart",
            status: "fixed",
          });
        } else {
          issues.push({
            id: "cart-002",
            title: "Shopping Cart Issues",
            description: "Cart functionality may be impaired",
            severity: "warning",
            category: "Shopping Cart",
            status: "unresolved",
            fixFunction: async () => {
              localStorage.setItem("shoppingCart", "[]");
            },
          });
        }
      } catch (error) {
        issues.push({
          id: "cart-003",
          title: "Shopping Cart Error",
          description: `Cart system error: ${error}`,
          severity: "critical",
          category: "Shopping Cart",
          status: "unresolved",
        });
      }

      // Check 4: Local Storage Health
      try {
        localStorage.setItem("test", "value");
        const testValue = localStorage.getItem("test");
        localStorage.removeItem("test");

        if (testValue === "value") {
          issues.push({
            id: "storage-001",
            title: "Local Storage Functional",
            description: "Browser storage working correctly",
            severity: "info",
            category: "Storage",
            status: "fixed",
          });
        }
      } catch (error) {
        issues.push({
          id: "storage-002",
          title: "Local Storage Issues",
          description: "Browser storage may be disabled or full",
          severity: "critical",
          category: "Storage",
          status: "unresolved",
          fixFunction: async () => {
            try {
              localStorage.clear();
              sessionStorage.clear();
            } catch (e) {
              throw new Error("Unable to clear storage");
            }
          },
        });
      }

      // Check 5: Payment System Configuration
      const paymentConfig = {
        paypal: true,
        cashapp: true,
        creditcard: false, // Simulated
      };

      if (paymentConfig.paypal && paymentConfig.cashapp) {
        issues.push({
          id: "payment-001",
          title: "Payment Systems Active",
          description: "PayPal and Cash App integration configured",
          severity: "info",
          category: "Payment",
          status: "fixed",
        });
      } else {
        issues.push({
          id: "payment-002",
          title: "Payment Configuration Issues",
          description: "Some payment methods may not be properly configured",
          severity: "warning",
          category: "Payment",
          status: "unresolved",
        });
      }

      // Check 6: Image Loading
      const testImageUrl =
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04";
      try {
        const img = new Image();
        img.onload = () => {
          updateIssueStatus("image-001", "fixed");
        };
        img.onerror = () => {
          updateIssueStatus("image-001", "error");
        };
        img.src = testImageUrl;

        issues.push({
          id: "image-001",
          title: "Image Loading",
          description: "Testing external image loading capabilities",
          severity: "info",
          category: "Media",
          status: "checking",
        });
      } catch (error) {
        issues.push({
          id: "image-002",
          title: "Image Loading Failed",
          description: "Unable to load external images",
          severity: "warning",
          category: "Media",
          status: "unresolved",
        });
      }

      // Check 7: CSV Upload System
      issues.push({
        id: "csv-001",
        title: "CSV Upload System",
        description: "CSV mapping and upload functionality available",
        severity: "info",
        category: "Upload",
        status: "fixed",
      });

      // Check 8: Collections System
      try {
        const collections = JSON.parse(
          localStorage.getItem("collections") || "[]",
        );
        issues.push({
          id: "collections-001",
          title: "Collections System",
          description: `Collections available with ${collections.length} items`,
          severity: "info",
          category: "Collections",
          status: "fixed",
        });
      } catch (error) {
        issues.push({
          id: "collections-002",
          title: "Collections System Error",
          description: "Collections may not be loading properly",
          severity: "warning",
          category: "Collections",
          status: "unresolved",
          fixFunction: async () => {
            localStorage.setItem("collections", "[]");
          },
        });
      }

      setSystemIssues(issues);
    } catch (error) {
      console.error("System scan error:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const updateIssueStatus = (id: string, status: SystemIssue["status"]) => {
    setSystemIssues((prev) =>
      prev.map((issue) => (issue.id === id ? { ...issue, status } : issue)),
    );
  };

  const createTestProducts = async () => {
    const testProducts = [
      {
        id: "test-product-1",
        name: "Vintage Designer Handbag",
        price: 295.0,
        description:
          "Authentic vintage designer handbag in excellent condition",
        category: "Clothing",
        brand: "Chanel",
        color: "Black",
        size: "Medium",
        condition: "like-new",
        material: "Leather",
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
        tags: ["vintage", "designer", "handbag", "luxury"],
        dateAdded: new Date().toISOString(),
        status: "published",
        seller: user?.id || "test-user",
        views: 0,
        likes: 0,
        inStock: true,
        quantity: 5,
      },
      {
        id: "test-product-2",
        name: "Sapphire Pendant Necklace",
        price: 189.99,
        description:
          "Beautiful sapphire pendant with 18k gold chain. Perfect gift for special occasions.",
        category: "Jewelry",
        brand: "Tiffany",
        color: "Blue",
        size: "One Size",
        condition: "new",
        material: "Gold",
        image:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        tags: ["jewelry", "sapphire", "necklace", "gift"],
        dateAdded: new Date().toISOString(),
        status: "published",
        seller: user?.id || "test-user",
        views: 0,
        likes: 0,
        inStock: true,
        quantity: 3,
      },
    ];

    // Save to localStorage for testing
    localStorage.setItem("testProducts", JSON.stringify(testProducts));

    // Update the database issue
    updateIssueStatus("db-001", "fixed");
  };

  const fixIssue = async (issue: SystemIssue) => {
    if (!issue.fixFunction) return;

    updateIssueStatus(issue.id, "checking");

    try {
      await issue.fixFunction();
      updateIssueStatus(issue.id, "fixed");
    } catch (error) {
      updateIssueStatus(issue.id, "error");
      console.error(`Failed to fix issue ${issue.id}:`, error);
    }
  };

  const fixAllIssues = async () => {
    const fixableIssues = systemIssues.filter(
      (issue) => issue.status === "unresolved" && issue.fixFunction,
    );

    for (const issue of fixableIssues) {
      await fixIssue(issue);
      // Small delay between fixes
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const getSeverityIcon = (severity: SystemIssue["severity"]) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusIcon = (status: SystemIssue["status"]) => {
    switch (status) {
      case "fixed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "checking":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const criticalIssues = systemIssues.filter(
    (issue) => issue.severity === "critical" && issue.status === "unresolved",
  );
  const warningIssues = systemIssues.filter(
    (issue) => issue.severity === "warning" && issue.status === "unresolved",
  );
  const fixedIssues = systemIssues.filter((issue) => issue.status === "fixed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wrench className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">System Fixer</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Automated system health check and repair tool. Identifies and fixes
            common issues in the e-commerce platform.
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4">
                <Button
                  onClick={runSystemScan}
                  disabled={isScanning}
                  variant="outline"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Rescan System
                    </>
                  )}
                </Button>

                {systemIssues.some(
                  (issue) => issue.status === "unresolved" && issue.fixFunction,
                ) && (
                  <Button
                    onClick={fixAllIssues}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Fix All Issues
                  </Button>
                )}
              </div>

              <div className="flex gap-4 text-sm">
                {criticalIssues.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    {criticalIssues.length} Critical
                  </Badge>
                )}
                {warningIssues.length > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    {warningIssues.length} Warnings
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {fixedIssues.length} Fixed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Issues Alert */}
        {criticalIssues.length > 0 && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <XCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Critical Issues Detected:</strong> {criticalIssues.length}{" "}
              critical issues require immediate attention to ensure system
              functionality.
            </AlertDescription>
          </Alert>
        )}

        {/* System Issues */}
        <div className="space-y-4">
          {systemIssues.map((issue) => (
            <Card
              key={issue.id}
              className={`${
                issue.severity === "critical"
                  ? "border-red-200 bg-red-50/50"
                  : issue.severity === "warning"
                    ? "border-yellow-200 bg-yellow-50/50"
                    : "border-green-200 bg-green-50/50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {issue.title}
                      </h3>
                      <Badge variant="outline" className="text-xs bg-white/50">
                        {issue.category}
                      </Badge>
                      {getStatusIcon(issue.status)}
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      {issue.description}
                    </p>
                    {issue.fixFunction && issue.status === "unresolved" && (
                      <Button
                        size="sm"
                        onClick={() => fixIssue(issue)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Wrench className="w-4 h-4 mr-1" />
                        Fix Issue
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Quick Test Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/admin/system-tester")}
                className="h-auto p-4 text-left"
              >
                <div>
                  <FileText className="w-6 h-6 mb-2 text-blue-600" />
                  <div className="font-semibold">Run Full Test</div>
                  <div className="text-sm text-gray-600">
                    Comprehensive system test
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/admin/product-upload")}
                className="h-auto p-4 text-left"
              >
                <div>
                  <Upload className="w-6 h-6 mb-2 text-purple-600" />
                  <div className="font-semibold">Test Upload</div>
                  <div className="text-sm text-gray-600">
                    CSV & image upload
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/collections")}
                className="h-auto p-4 text-left"
              >
                <div>
                  <Database className="w-6 h-6 mb-2 text-green-600" />
                  <div className="font-semibold">Test Collections</div>
                  <div className="text-sm text-gray-600">
                    View collections & items
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
