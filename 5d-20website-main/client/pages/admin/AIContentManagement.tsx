// AI Content Management - Admin dashboard for AI-powered content analysis
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Users,
  Package,
  Copy,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  RefreshCw,
  Search,
  Filter,
  Download,
  Settings,
  Zap,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import AIContentAnalyzer, {
  ContentAnalysis,
  AISuggestion,
} from "@/services/AIContentAnalyzer";
import UserNotificationService from "@/services/UserNotificationService";
import { useUserAuth } from "@/hooks/useUserAuth";

interface AIStats {
  totalAnalyses: number;
  pendingReviews: number;
  approvedSuggestions: number;
  rejectedSuggestions: number;
  duplicatesFound: number;
  categoryMismatches: number;
  enhancementsApplied: number;
  avgConfidenceScore: number;
}

const AIContentManagement: React.FC = () => {
  const { user, allUsers } = useUserAuth();
  const [stats, setStats] = useState<AIStats>({
    totalAnalyses: 0,
    pendingReviews: 0,
    approvedSuggestions: 0,
    rejectedSuggestions: 0,
    duplicatesFound: 0,
    categoryMismatches: 0,
    enhancementsApplied: 0,
    avgConfidenceScore: 0,
  });

  const [analyses, setAnalyses] = useState<ContentAnalysis[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await loadAnalyses();
      await loadSuggestions();
      calculateStats();
    } catch (error) {
      console.error("Error loading AI management data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyses = async () => {
    try {
      const saved = localStorage.getItem("aiAnalysisHistory");
      if (saved) {
        setAnalyses(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading analyses:", error);
      setAnalyses([]);
    }
  };

  const loadSuggestions = async () => {
    try {
      const saved = localStorage.getItem("aiSuggestions");
      if (saved) {
        setSuggestions(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
      setSuggestions([]);
    }
  };

  const calculateStats = () => {
    const totalAnalyses = analyses.length;
    const pendingReviews = analyses.filter(
      (a) => a.status === "pending",
    ).length;
    const approvedSuggestions = analyses.filter(
      (a) => a.status === "approved",
    ).length;
    const rejectedSuggestions = analyses.filter(
      (a) => a.status === "rejected",
    ).length;
    const duplicatesFound = analyses.reduce(
      (sum, a) => sum + a.duplicates.length,
      0,
    );
    const categoryMismatches = analyses.filter(
      (a) => a.confidence < 0.8,
    ).length;
    const enhancementsApplied = analyses.filter(
      (a) => Object.keys(a.suggestedChanges).length > 0,
    ).length;
    const avgConfidenceScore =
      analyses.length > 0
        ? analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length
        : 0;

    setStats({
      totalAnalyses,
      pendingReviews,
      approvedSuggestions,
      rejectedSuggestions,
      duplicatesFound,
      categoryMismatches,
      enhancementsApplied,
      avgConfidenceScore,
    });
  };

  const runFullAnalysis = async () => {
    if (!allUsers || isRunningAnalysis) return;

    setIsRunningAnalysis(true);
    try {
      console.log("🤖 Starting full AI content analysis...");

      for (const user of allUsers.slice(0, 10)) {
        // Limit to prevent performance issues
        await AIContentAnalyzer.analyzeUserContent(user.id, true);
      }

      // Reload data
      await loadData();

      // Show success notification
      UserNotificationService.createSystemNotification(
        user?.id || "admin",
        "✅ AI Analysis Complete",
        `Full content analysis completed for ${allUsers.slice(0, 10).length} users.`,
        "medium",
      );
    } catch (error) {
      console.error("Error running full analysis:", error);
      UserNotificationService.createSystemNotification(
        user?.id || "admin",
        "❌ Analysis Failed",
        "AI content analysis failed. Please try again.",
        "high",
      );
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  const exportData = () => {
    const exportData = {
      stats,
      analyses: analyses.slice(0, 100), // Limit export size
      suggestions: suggestions.slice(0, 100),
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-content-analysis-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
      analysis.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.currentCategory
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      analysis.suggestedCategory
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "pending" && analysis.status === "pending") ||
      (selectedFilter === "approved" && analysis.status === "approved") ||
      (selectedFilter === "rejected" && analysis.status === "rejected") ||
      (selectedFilter === "low-confidence" && analysis.confidence < 0.7) ||
      (selectedFilter === "duplicates" && analysis.duplicates.length > 0) ||
      (selectedFilter === "enhancements" &&
        Object.keys(analysis.suggestedChanges).length > 0);

    const matchesUser =
      selectedUser === "all" || analysis.userId === selectedUser;

    return matchesSearch && matchesFilter && matchesUser;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading AI management dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin">
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <span>AI Content Management</span>
                </h1>
                <p className="text-gray-600">
                  Monitor and manage AI-powered content analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={exportData}
                variant="outline"
                size="sm"
                disabled={analyses.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                onClick={runFullAnalysis}
                disabled={isRunningAnalysis}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isRunningAnalysis ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Run Full Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Analyses
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalAnalyses}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Reviews
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.pendingReviews}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Duplicates Found
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.duplicatesFound}
                  </p>
                </div>
                <Copy className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Confidence
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {(stats.avgConfidenceScore * 100).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search analyses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Analyses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="low-confidence">Low Confidence</option>
                <option value="duplicates">Has Duplicates</option>
                <option value="enhancements">Has Enhancements</option>
              </select>

              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Users</option>
                {allUsers?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {filteredAnalyses.length} results
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analyses List */}
        <Card>
          <CardHeader>
            <CardTitle>Content Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {filteredAnalyses.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No analyses found
                </h3>
                <p className="text-gray-500 mb-6">
                  {analyses.length === 0
                    ? "Run an AI analysis to see results here."
                    : "Try adjusting your search or filters."}
                </p>
                {analyses.length === 0 && (
                  <Button
                    onClick={runFullAnalysis}
                    disabled={isRunningAnalysis}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Start AI Analysis
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnalyses.map((analysis) => (
                  <Card
                    key={analysis.id}
                    className={`transition-all duration-200 ${
                      analysis.status === "pending"
                        ? "border-orange-200 bg-orange-50/30"
                        : analysis.status === "approved"
                          ? "border-green-200 bg-green-50/30"
                          : "border-gray-200"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-800">
                              {analysis.itemName}
                            </h3>
                            <Badge
                              variant={
                                analysis.status === "pending"
                                  ? "secondary"
                                  : analysis.status === "approved"
                                    ? "default"
                                    : "outline"
                              }
                              className={
                                analysis.status === "pending"
                                  ? "bg-orange-100 text-orange-800"
                                  : analysis.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {analysis.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                analysis.confidence > 0.8
                                  ? "border-green-300 text-green-700"
                                  : analysis.confidence > 0.6
                                    ? "border-yellow-300 text-yellow-700"
                                    : "border-red-300 text-red-700"
                              }
                            >
                              {(analysis.confidence * 100).toFixed(1)}%
                              confidence
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>
                              Current:{" "}
                              <strong>{analysis.currentCategory}</strong>
                            </span>
                            <span>→</span>
                            <span>
                              Suggested:{" "}
                              <strong>{analysis.suggestedCategory}</strong>
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 mb-2">
                            {analysis.reasoning}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>User: {analysis.userId}</span>
                            <span>
                              {new Date(analysis.createdAt).toLocaleString()}
                            </span>
                            {analysis.duplicates.length > 0 && (
                              <Badge variant="outline" className="text-red-600">
                                {analysis.duplicates.length} duplicates
                              </Badge>
                            )}
                            {Object.keys(analysis.suggestedChanges).length >
                              0 && (
                              <Badge
                                variant="outline"
                                className="text-blue-600"
                              >
                                has enhancements
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedAnalysis(
                              expandedAnalysis === analysis.id
                                ? null
                                : analysis.id,
                            )
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Expanded Details */}
                      {expandedAnalysis === analysis.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Suggested Changes */}
                            {Object.keys(analysis.suggestedChanges).length >
                              0 && (
                              <div>
                                <h4 className="font-medium text-gray-800 mb-2">
                                  Suggested Changes:
                                </h4>
                                <div className="bg-blue-50 rounded-lg p-3">
                                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                    {JSON.stringify(
                                      analysis.suggestedChanges,
                                      null,
                                      2,
                                    )}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {/* Duplicates */}
                            {analysis.duplicates.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-800 mb-2">
                                  Potential Duplicates:
                                </h4>
                                <div className="space-y-2">
                                  {analysis.duplicates.map(
                                    (duplicate, index) => (
                                      <div
                                        key={index}
                                        className="bg-red-50 rounded-lg p-3"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-medium">
                                            {duplicate.name}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="text-red-600"
                                          >
                                            {(
                                              duplicate.similarity * 100
                                            ).toFixed(1)}
                                            % similar
                                          </Badge>
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">
                                          User: {duplicate.userId} | Action:{" "}
                                          {duplicate.suggestedAction}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIContentManagement;
