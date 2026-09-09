import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Brain,
  Shield,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Activity,
  Settings,
  Zap,
  Target,
  Award,
  RefreshCw,
  Download,
  Upload,
  Eye,
  BarChart3,
  PieChart,
  Calendar,
  Bell,
  Lock,
  Unlock,
  Heart,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";

const AIManagementHub: React.FC = () => {
  const { user } = useUserAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [errorPredictions, setErrorPredictions] = useState<any[]>([]);
  const [routineChecks, setRoutineChecks] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [salesAgreements, setSalesAgreements] = useState<any[]>([]);
  const [aiReservePool, setAIReservePool] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIManagementData();
  }, []);

  const loadAIManagementData = async () => {
    try {
      setLoading(true);

      // Load error prediction data
      const { default: AIErrorPredictionService } = await import(
        "../services/AIErrorPredictionService"
      );
      const predictions = AIErrorPredictionService.getErrorPredictions();
      const checks = AIErrorPredictionService.getRoutineCheckStatus();
      const tests = AIErrorPredictionService.getTestResults();

      setErrorPredictions(predictions);
      setRoutineChecks(checks);
      setTestResults(tests);

      // Load sales management data
      const { default: SalesSharePaybackService } = await import(
        "../services/SalesSharePaybackService"
      );
      const agreements = user?.id
        ? SalesSharePaybackService.getUserAgreements(user.id)
        : [];
      const reservePool = SalesSharePaybackService.getAIReservePoolStatus();

      setSalesAgreements(agreements);
      setAIReservePool(reservePool);
    } catch (error) {
      console.error("Error loading AI management data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTest = async (functionality: string) => {
    try {
      const { default: AIErrorPredictionService } = await import(
        "../services/AIErrorPredictionService"
      );
      const result =
        await AIErrorPredictionService.createTestPage(functionality);

      // Refresh test results
      const updatedTests = AIErrorPredictionService.getTestResults();
      setTestResults(updatedTests);

      alert(
        `Test completed for ${functionality}: ${result.status.toUpperCase()}`,
      );
    } catch (error) {
      alert(`Test failed: ${error.message}`);
    }
  };

  const handleCreateSalesAgreement = async () => {
    if (!user?.id) {
      alert("Please sign in to create sales agreements");
      return;
    }

    try {
      const { default: SalesSharePaybackService } = await import(
        "../services/SalesSharePaybackService"
      );

      // Mock data for demo
      const mockSourcingInfo = {
        originalCost: 50,
        supplier: "Local Retailer",
        purchaseDate: new Date().toISOString(),
        receipts: ["receipt-001.jpg"],
        authenticity: "Verified",
        condition: "Excellent",
        marketValue: 100,
      };

      const agreement = await SalesSharePaybackService.createPaybackAgreement(
        user.id,
        `item-${Date.now()}`,
        "Sample Item for Resale",
        100,
        "standard-resale",
        mockSourcingInfo,
      );

      // Refresh agreements
      const updatedAgreements = SalesSharePaybackService.getUserAgreements(
        user.id,
      );
      setSalesAgreements(updatedAgreements);

      alert(`Sales agreement created: ${agreement.id}`);
    } catch (error) {
      alert(`Error creating agreement: ${error.message}`);
    }
  };

  const handleProcessSale = async (agreementId: string) => {
    try {
      const { default: SalesSharePaybackService } = await import(
        "../services/SalesSharePaybackService"
      );

      const saleRecord = await SalesSharePaybackService.processSale(
        agreementId,
        "buyer-123",
        75, // Sale amount
      );

      // Refresh data
      await loadAIManagementData();

      alert(`Sale processed: $${saleRecord.amount}`);
    } catch (error) {
      alert(`Error processing sale: ${error.message}`);
    }
  };

  if (!user?.isAdmin && user?.email !== "haynes.d1993@yahoo.com") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Admin Access Required
            </h2>
            <p className="text-gray-600 mb-4">
              This page is only accessible to administrators.
            </p>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Management Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-purple-600" />
                  AI Management Hub
                </h1>
                <p className="text-sm text-gray-600">
                  Error prediction, sales management, and AI optimization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-purple-100 text-purple-800">
                Admin Access
              </Badge>
              <Button
                onClick={loadAIManagementData}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 bg-white rounded-xl p-1 shadow-sm">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="error-prediction"
              className="flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Error Prediction</span>
            </TabsTrigger>
            <TabsTrigger
              value="testing"
              className="flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>Testing</span>
            </TabsTrigger>
            <TabsTrigger
              value="sales-management"
              className="flex items-center space-x-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Sales</span>
            </TabsTrigger>
            <TabsTrigger
              value="ai-reserve"
              className="flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>AI Reserve</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Error Predictions</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {errorPredictions.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Routine Checks</p>
                      <p className="text-2xl font-bold text-green-600">
                        {
                          routineChecks.filter((c) => c.status === "passing")
                            .length
                        }
                        /{routineChecks.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Sales Agreements</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {salesAgreements.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">AI Reserve Pool</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${aiReservePool.totalAmount?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Tools Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  AI Tools Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link to="/admin/ai-image-recognition">
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col items-center justify-center hover:bg-purple-50 border-purple-200"
                    >
                      <Eye className="w-6 h-6 mb-2 text-purple-600" />
                      <span className="text-sm">AI Image Recognition</span>
                    </Button>
                  </Link>
                  <Link to="/admin/csv-matcher">
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col items-center justify-center hover:bg-blue-50 border-blue-200"
                    >
                      <FileText className="w-6 h-6 mb-2 text-blue-600" />
                      <span className="text-sm">CSV Image Matcher</span>
                    </Button>
                  </Link>
                  <Link to="/admin/ai-content">
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col items-center justify-center hover:bg-green-50 border-green-200"
                    >
                      <Settings className="w-6 h-6 mb-2 text-green-600" />
                      <span className="text-sm">AI Content Management</span>
                    </Button>
                  </Link>
                  <Link to="/admin/navigation-analytics">
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col items-center justify-center hover:bg-orange-50 border-orange-200"
                    >
                      <Activity className="w-6 h-6 mb-2 text-orange-600" />
                      <span className="text-sm">Navigation Analytics</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* System Health Overview */}
            <Card>
              <CardHeader>
                <CardTitle>System Health Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Error Prevention System</span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Routine Monitoring</span>
                    <Badge className="bg-blue-100 text-blue-800">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sales Management</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI Reserve Pool</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Growing
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Prediction Tab */}
          <TabsContent value="error-prediction" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Error Predictions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                    Predicted Errors (Next 30 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {errorPredictions.slice(0, 5).map((prediction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {prediction.error}
                          </p>
                          <p className="text-xs text-gray-600">
                            Expected in: {prediction.timeframe}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              prediction.probability > 0.7
                                ? "bg-red-100 text-red-800"
                                : prediction.probability > 0.4
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {(prediction.probability * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Routine Checks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Routine Checks Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {routineChecks.map((check) => (
                      <div
                        key={check.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{check.name}</p>
                          <p className="text-xs text-gray-600">
                            Frequency: {check.frequency}
                          </p>
                          <p className="text-xs text-gray-600">
                            Last run: {new Date(check.lastRun).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              check.status === "passing"
                                ? "bg-green-100 text-green-800"
                                : check.status === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {check.status}
                          </Badge>
                          {check.autoFix && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">
                              Auto-Fix
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Testing and Reproduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Create test pages to reproduce functionality and identify
                  potential issues.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => handleRunTest("favorites")}
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <Heart className="w-6 h-6 mb-2" />
                    Test Favorites
                  </Button>
                  <Button
                    onClick={() => handleRunTest("collections")}
                    className="h-24 flex flex-col items-center justify-center"
                    variant="outline"
                  >
                    <FileText className="w-6 h-6 mb-2" />
                    Test Collections
                  </Button>
                  <Button
                    onClick={() => handleRunTest("validation")}
                    className="h-24 flex flex-col items-center justify-center"
                    variant="outline"
                  >
                    <Shield className="w-6 h-6 mb-2" />
                    Test Validation
                  </Button>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Recent Test Results
                    </h3>
                    <div className="space-y-3">
                      {testResults.slice(-5).map((result) => (
                        <div
                          key={result.testId}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {result.functionality}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(result.timestamp).toLocaleString()}
                            </p>
                            {result.errors.length > 0 && (
                              <p className="text-xs text-red-600">
                                {result.errors.length} errors found
                              </p>
                            )}
                          </div>
                          <Badge
                            className={
                              result.status === "pass"
                                ? "bg-green-100 text-green-800"
                                : result.status === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {result.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Management Tab */}
          <TabsContent value="sales-management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Agreement */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Share Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Manage revenue sharing agreements and payback contracts.
                  </p>

                  <Button
                    onClick={handleCreateSalesAgreement}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Sales Agreement
                  </Button>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Standard Payback:</span>
                      <span className="font-medium">70%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Seasonal Member:</span>
                      <span className="font-medium">80%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>AI Reserve:</span>
                      <span className="font-medium">$0.01 per sale</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Agreements */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Agreements</CardTitle>
                </CardHeader>
                <CardContent>
                  {salesAgreements.length > 0 ? (
                    <div className="space-y-3">
                      {salesAgreements.slice(0, 5).map((agreement) => (
                        <div
                          key={agreement.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {agreement.itemName}
                            </p>
                            <p className="text-xs text-gray-600">
                              Payback: {agreement.paybackPercentage}%
                            </p>
                            <p className="text-xs text-gray-600">
                              Status: {agreement.status}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleProcessSale(agreement.id)}
                              disabled={agreement.status !== "active"}
                            >
                              Process Sale
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">
                      No active agreements
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contract Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Standard Resale</h4>
                    <p className="text-sm text-gray-600">
                      70% payback, 30 days
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      For regular platform users
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg border-blue-200 bg-blue-50">
                    <h4 className="font-medium">Seasonal Member</h4>
                    <p className="text-sm text-gray-600">
                      80% payback, 45 days
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Enhanced terms for members
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Consignment</h4>
                    <p className="text-sm text-gray-600">
                      60% payback, 14 days
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      High-value item handling
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Reserve Tab */}
          <TabsContent value="ai-reserve" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reserve Pool Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-500" />
                    AI Reserve Pool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">
                        ${aiReservePool.totalAmount?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-sm text-gray-600">Total Reserve</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold">
                          {aiReservePool.contributions?.length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Contributions</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">
                          {aiReservePool.disbursements?.length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Disbursements</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-2">
                        Purpose: Market stabilization, payment differences,
                        sales incentives
                      </p>
                      <p className="text-xs text-gray-500">
                        1 cent per sale automatically contributed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reserve Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiReservePool.contributions
                      ?.slice(-5)
                      .map((contribution: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">Contribution</p>
                            <p className="text-xs text-gray-600">
                              Sale: {contribution.saleId}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              +${contribution.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(contribution.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}

                    {aiReservePool.disbursements
                      ?.slice(-3)
                      .map((disbursement: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">Disbursement</p>
                            <p className="text-xs text-gray-600">
                              {disbursement.reason}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-red-600">
                              -${disbursement.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(disbursement.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}

                    {(!aiReservePool.contributions ||
                      aiReservePool.contributions.length === 0) &&
                      (!aiReservePool.disbursements ||
                        aiReservePool.disbursements.length === 0) && (
                        <p className="text-gray-600 text-center py-8">
                          No recent activity
                        </p>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reserve Usage Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>AI Reserve Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">
                      Approved Uses
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Cover payment differences</li>
                      <li>• Sales growth incentives</li>
                      <li>• Market stabilization</li>
                      <li>• User retention bonuses</li>
                      <li>• Platform improvement funding</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">
                      Contribution Sources
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• $0.01 per standard sale</li>
                      <li>• $0.005 per seasonal member sale</li>
                      <li>• Contract penalty fees</li>
                      <li>• Platform fee adjustments</li>
                      <li>• Interest on reserve balance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIManagementHub;
