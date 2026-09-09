import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  TestTube,
  User,
  UserCheck,
  Shield,
  ShoppingCart,
  Upload,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Package,
  Clock,
} from "lucide-react";
import TestPurchaseService from "@/services/TestPurchaseService";
import AIProductValidationService from "@/services/AIProductValidationService";
import { useUserAuth } from "@/hooks/useUserAuth";
import EnhancedShoppingCartService from "@/services/EnhancedShoppingCartService";

function TestInterface() {
  const { currentUser, allUsers, allProducts } = useUserAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [selectedTestType, setSelectedTestType] = useState<
    "upload" | "purchase" | "validation" | "full"
  >("full");

  const runComprehensiveTests = async () => {
    setIsRunning(true);
    setTestResults(null);

    try {
      const results = {
        timestamp: new Date().toISOString(),
        uploadTests: {} as any,
        purchaseTests: {} as any,
        validationTests: {} as any,
        dataCrossCheck: {} as any,
      };

      // Test 1: Product Upload Tests
      console.log("Running upload tests...");
      results.uploadTests = await runUploadTests();

      // Test 2: Purchase Tests
      console.log("Running purchase tests...");
      results.purchaseTests = await runPurchaseTests();

      // Test 3: Validation Tests
      console.log("Running validation tests...");
      results.validationTests = await runValidationTests();

      // Test 4: Data Cross-Contamination Check
      console.log("Running data cross-check...");
      results.dataCrossCheck = await runDataCrossCheck();

      setTestResults(results);
    } catch (error) {
      console.error("Test execution failed:", error);
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runUploadTests = async () => {
    const tests = {
      newUserUpload: { status: "pending", details: null },
      guestUpload: { status: "pending", details: null },
      adminUpload: { status: "pending", details: null },
      duplicateCheck: { status: "pending", details: null },
    };

    try {
      // Test new user upload
      const newUserProduct = {
        name: `Test Product - New User ${Date.now()}`,
        description: "Test product uploaded by new user for validation",
        category: "Testing",
        price: 99.99,
        sellerId: "test-new-user",
      };

      const newUserValidation =
        await AIProductValidationService.validateProduct(
          newUserProduct,
          allProducts,
        );

      tests.newUserUpload = {
        status: newUserValidation.isValid ? "passed" : "failed",
        details: {
          validation: newUserValidation,
          productData: newUserProduct,
        },
      };

      // Test guest upload
      const guestProduct = {
        name: `Test Product - Guest ${Date.now()}`,
        description: "Test product uploaded by guest user",
        category: "Testing",
        price: 49.99,
        sellerId: "guest",
      };

      const guestValidation = await AIProductValidationService.validateProduct(
        guestProduct,
        allProducts,
      );

      tests.guestUpload = {
        status: guestValidation.isValid ? "passed" : "failed",
        details: {
          validation: guestValidation,
          productData: guestProduct,
        },
      };

      // Test admin upload
      const adminProduct = {
        name: `Test Product - Admin ${Date.now()}`,
        description: "Test product uploaded by admin for system testing",
        category: "Testing",
        price: 199.99,
        sellerId: currentUser?.id || "admin",
      };

      const adminValidation = await AIProductValidationService.validateProduct(
        adminProduct,
        allProducts,
      );

      tests.adminUpload = {
        status: adminValidation.isValid ? "passed" : "failed",
        details: {
          validation: adminValidation,
          productData: adminProduct,
        },
      };

      // Test duplicate detection
      const duplicateProduct = {
        name: newUserProduct.name, // Same name as previous test
        description: "This should trigger duplicate detection",
        category: "Testing",
        price: 89.99,
        sellerId: "different-seller",
      };

      const duplicateValidation =
        await AIProductValidationService.validateProduct(duplicateProduct, [
          ...allProducts,
          newUserProduct as any,
        ]);

      tests.duplicateCheck = {
        status:
          duplicateValidation.warnings.length > 0 &&
          duplicateValidation.similarProducts.length > 0
            ? "passed"
            : "failed",
        details: {
          validation: duplicateValidation,
          productData: duplicateProduct,
        },
      };
    } catch (error) {
      console.error("Upload tests failed:", error);
    }

    return tests;
  };

  const runPurchaseTests = async () => {
    try {
      // Run test scenarios for different user types
      const testScenarios = await TestPurchaseService.createTestScenarios();

      return {
        newUserPurchase: {
          status: testScenarios.newUser.success ? "passed" : "failed",
          details: testScenarios.newUser,
        },
        guestPurchase: {
          status: testScenarios.guest.success ? "passed" : "failed",
          details: testScenarios.guest,
        },
        adminPurchase: {
          status: testScenarios.admin.success ? "passed" : "failed",
          details: testScenarios.admin,
        },
        analytics: TestPurchaseService.getTestAnalytics(),
      };
    } catch (error) {
      console.error("Purchase tests failed:", error);
      return {
        error: error.message,
      };
    }
  };

  const runValidationTests = async () => {
    const tests = {
      aiValidation: { status: "pending", details: null },
      collectionValidation: { status: "pending", details: null },
      cartValidation: { status: "pending", details: null },
    };

    try {
      // Test AI validation system
      const validationAnalytics =
        AIProductValidationService.getValidationAnalytics();

      tests.aiValidation = {
        status: "passed",
        details: validationAnalytics,
      };

      // Test collection validation
      const testCollection = {
        name: "Test Collection",
        items: [
          { name: "Test Item 1", price: 10 },
          { name: "Test Item 2", price: 20 },
        ],
      };

      const collectionResult =
        await AIProductValidationService.validateCollection(testCollection);

      tests.collectionValidation = {
        status: collectionResult.success ? "passed" : "failed",
        details: collectionResult,
      };

      // Test cart validation
      const cartItems = EnhancedShoppingCartService.getCartItems();
      const cartValidation = EnhancedShoppingCartService.validateCart();

      tests.cartValidation = {
        status: cartValidation.isValid ? "passed" : "warning",
        details: {
          validation: cartValidation,
          itemCount: cartItems.length,
          summary: EnhancedShoppingCartService.getCartSummary(),
        },
      };
    } catch (error) {
      console.error("Validation tests failed:", error);
    }

    return tests;
  };

  const runDataCrossCheck = async () => {
    const checks = {
      userDataIntegrity: { status: "pending", details: null },
      productDataIntegrity: { status: "pending", details: null },
      salesDataIntegrity: { status: "pending", details: null },
      crossContamination: { status: "pending", details: null },
    };

    try {
      // Check user data integrity
      const userIssues: string[] = [];
      allUsers.forEach((user, index) => {
        if (!user.id || !user.email || !user.name) {
          userIssues.push(`User ${index} missing required fields`);
        }
        if (user.totalSales < 0 || user.totalPurchases < 0) {
          userIssues.push(`User ${user.name} has negative totals`);
        }
      });

      checks.userDataIntegrity = {
        status: userIssues.length === 0 ? "passed" : "failed",
        details: { issues: userIssues, totalUsers: allUsers.length },
      };

      // Check product data integrity
      const productIssues: string[] = [];
      allProducts.forEach((product, index) => {
        if (!product.id || !product.name || product.price <= 0) {
          productIssues.push(`Product ${index} has invalid data`);
        }
        if (!allUsers.some((user) => user.id === product.sellerId)) {
          productIssues.push(`Product ${product.name} has orphaned seller ID`);
        }
      });

      checks.productDataIntegrity = {
        status: productIssues.length === 0 ? "passed" : "failed",
        details: { issues: productIssues, totalProducts: allProducts.length },
      };

      // Check for cross-contamination
      const contamination: string[] = [];
      const sellerProducts = new Map<string, string[]>();

      allProducts.forEach((product) => {
        if (!sellerProducts.has(product.sellerId)) {
          sellerProducts.set(product.sellerId, []);
        }
        sellerProducts.get(product.sellerId)!.push(product.id);
      });

      // Check if products accidentally assigned to wrong users
      sellerProducts.forEach((productIds, sellerId) => {
        const user = allUsers.find((u) => u.id === sellerId);
        if (user && user.productCount !== productIds.length) {
          contamination.push(
            `User ${user.name} product count mismatch: ${user.productCount} vs ${productIds.length}`,
          );
        }
      });

      checks.crossContamination = {
        status: contamination.length === 0 ? "passed" : "failed",
        details: { issues: contamination },
      };
    } catch (error) {
      console.error("Data cross-check failed:", error);
    }

    return checks;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <TestTube className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "pending":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <TestTube className="w-8 h-8 mr-3 text-blue-600" />
            Admin Test Interface
          </h1>
          <p className="text-gray-600">
            Comprehensive testing for uploads, purchases, and data integrity
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button
                onClick={runComprehensiveTests}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRunning ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Test Type:</span>
                <select
                  value={selectedTestType}
                  onChange={(e) => setSelectedTestType(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                  disabled={isRunning}
                >
                  <option value="full">Full Test Suite</option>
                  <option value="upload">Upload Tests Only</option>
                  <option value="purchase">Purchase Tests Only</option>
                  <option value="validation">Validation Tests Only</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="upload">Upload Tests</TabsTrigger>
              <TabsTrigger value="purchase">Purchase Tests</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="integrity">Data Integrity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(testResults).map(([category, results]: any) => {
                  if (category === "timestamp" || category === "error")
                    return null;

                  const testCount = Object.keys(results).length;
                  const passedTests = Object.values(results).filter(
                    (test: any) => test.status === "passed",
                  ).length;

                  return (
                    <Card key={category}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 capitalize">
                              {category.replace(/([A-Z])/g, " $1")}
                            </p>
                            <p className="text-2xl font-bold">
                              {passedTests}/{testCount}
                            </p>
                          </div>
                          {passedTests === testCount ? (
                            <CheckCircle className="w-8 h-8 text-green-500" />
                          ) : (
                            <XCircle className="w-8 h-8 text-red-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="upload">
              {testResults.uploadTests && (
                <div className="space-y-4">
                  {Object.entries(testResults.uploadTests).map(
                    ([testName, result]: any) => (
                      <Card key={testName}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold capitalize">
                              {testName.replace(/([A-Z])/g, " $1")}
                            </h3>
                            <Badge
                              className={getStatusColor(result.status)}
                              variant="outline"
                            >
                              {getStatusIcon(result.status)}
                              <span className="ml-2">{result.status}</span>
                            </Badge>
                          </div>
                          {result.details && (
                            <div className="text-sm text-gray-600">
                              <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="purchase">
              {testResults.purchaseTests && (
                <div className="space-y-4">
                  {Object.entries(testResults.purchaseTests).map(
                    ([testName, result]: any) => (
                      <Card key={testName}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold capitalize">
                              {testName.replace(/([A-Z])/g, " $1")}
                            </h3>
                            {result.status && (
                              <Badge
                                className={getStatusColor(result.status)}
                                variant="outline"
                              >
                                {getStatusIcon(result.status)}
                                <span className="ml-2">{result.status}</span>
                              </Badge>
                            )}
                          </div>
                          {result.details && (
                            <div className="text-sm text-gray-600">
                              <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="validation">
              {testResults.validationTests && (
                <div className="space-y-4">
                  {Object.entries(testResults.validationTests).map(
                    ([testName, result]: any) => (
                      <Card key={testName}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold capitalize">
                              {testName.replace(/([A-Z])/g, " $1")}
                            </h3>
                            <Badge
                              className={getStatusColor(result.status)}
                              variant="outline"
                            >
                              {getStatusIcon(result.status)}
                              <span className="ml-2">{result.status}</span>
                            </Badge>
                          </div>
                          {result.details && (
                            <div className="text-sm text-gray-600">
                              <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="integrity">
              {testResults.dataCrossCheck && (
                <div className="space-y-4">
                  {Object.entries(testResults.dataCrossCheck).map(
                    ([testName, result]: any) => (
                      <Card key={testName}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold capitalize">
                              {testName.replace(/([A-Z])/g, " $1")}
                            </h3>
                            <Badge
                              className={getStatusColor(result.status)}
                              variant="outline"
                            >
                              {getStatusIcon(result.status)}
                              <span className="ml-2">{result.status}</span>
                            </Badge>
                          </div>
                          {result.details && (
                            <div className="text-sm text-gray-600">
                              {result.details.issues &&
                                result.details.issues.length > 0 && (
                                  <div className="mb-2">
                                    <h4 className="font-medium mb-1">
                                      Issues:
                                    </h4>
                                    <ul className="list-disc list-inside space-y-1">
                                      {result.details.issues.map(
                                        (issue: string, index: number) => (
                                          <li
                                            key={index}
                                            className="text-red-600"
                                          >
                                            {issue}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}
                              <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {testResults?.error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Test Execution Failed</span>
              </div>
              <p className="text-red-600 mt-2">{testResults.error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TestInterface;
