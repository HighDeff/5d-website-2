import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Brain,
  Search,
  Code,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Copy,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Lightbulb,
  Zap,
  BookOpen,
  Settings,
  Plus,
  Eye,
  Download,
} from "lucide-react";
import {
  aiGoalsErrorManager,
  AIGoal,
  AIGoalStep,
  ResearchResult,
  GeneratedMethod,
} from "../services/AIGoalsErrorManager";

interface AIGoalsManagerProps {
  userId: string;
  currentErrors?: Error[];
}

const AIGoalsManager: React.FC<AIGoalsManagerProps> = ({
  userId,
  currentErrors = [],
}) => {
  const [userGoals, setUserGoals] = useState<AIGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<AIGoal | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);

  // New goal form state
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalCategory, setNewGoalCategory] =
    useState<AIGoal["category"]>("error_fix");
  const [newGoalPriority, setNewGoalPriority] =
    useState<AIGoal["priority"]>("medium");

  // Research state
  const [researchQuery, setResearchQuery] = useState("");
  const [isResearching, setIsResearching] = useState(false);

  useEffect(() => {
    loadUserGoals();
  }, [userId]);

  const loadUserGoals = () => {
    const goals = aiGoalsErrorManager.getUserGoals(userId);
    setUserGoals(goals);
    if (goals.length > 0 && !selectedGoal) {
      setSelectedGoal(goals[0]);
    }
  };

  const createNewGoal = () => {
    if (!newGoalTitle.trim()) return;

    const goal = aiGoalsErrorManager.createGoal(
      newGoalTitle,
      newGoalDescription,
      newGoalCategory,
      newGoalPriority,
      userId,
    );

    setSelectedGoal(goal);
    setIsCreatingGoal(false);
    setNewGoalTitle("");
    setNewGoalDescription("");
    loadUserGoals();
  };

  const createGoalFromError = (error: Error) => {
    const goal = aiGoalsErrorManager.createGoalFromError(error, {
      page: window.location.pathname,
      userId,
    });

    setSelectedGoal(goal);
    loadUserGoals();
  };

  const copyGoalFromExisting = (sourceGoalId: string) => {
    const newGoal = aiGoalsErrorManager.copyErrorToNewGoal(
      sourceGoalId,
      userId,
    );
    if (newGoal) {
      setSelectedGoal(newGoal);
      loadUserGoals();
    }
  };

  const startResearch = async () => {
    if (!selectedGoal || !researchQuery.trim()) return;

    setIsResearching(true);
    try {
      await aiGoalsErrorManager.startResearchSession(
        selectedGoal.id,
        researchQuery,
      );
      loadUserGoals();
      const updatedGoal = aiGoalsErrorManager
        .getUserGoals(userId)
        .find((g) => g.id === selectedGoal.id);
      if (updatedGoal) setSelectedGoal(updatedGoal);
    } catch (error) {
      console.error("Research failed:", error);
    } finally {
      setIsResearching(false);
    }
  };

  const completeStep = (stepId: string) => {
    if (!selectedGoal) return;

    aiGoalsErrorManager.completeStep(selectedGoal.id, stepId);
    loadUserGoals();
    const updatedGoal = aiGoalsErrorManager
      .getUserGoals(userId)
      .find((g) => g.id === selectedGoal.id);
    if (updatedGoal) setSelectedGoal(updatedGoal);
  };

  const updateGoalStatus = (status: AIGoal["status"]) => {
    if (!selectedGoal) return;

    aiGoalsErrorManager.updateGoalStatus(selectedGoal.id, status);
    loadUserGoals();
    const updatedGoal = aiGoalsErrorManager
      .getUserGoals(userId)
      .find((g) => g.id === selectedGoal.id);
    if (updatedGoal) setSelectedGoal(updatedGoal);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in_progress":
        return "text-blue-600";
      case "failed":
        return "text-red-600";
      case "paused":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "error_fix":
        return <AlertTriangle className="w-4 h-4" />;
      case "optimization":
        return <TrendingUp className="w-4 h-4" />;
      case "research":
        return <Search className="w-4 h-4" />;
      case "automation":
        return <Zap className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Target className="w-8 h-8 mr-3 text-blue-600" />
            AI Goals & Error Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Research, track, and resolve errors with AI-powered insights
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsCreatingGoal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Current Errors Alert */}
      {currentErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Current Errors Detected ({currentErrors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentErrors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded border"
                >
                  <div>
                    <h4 className="font-medium text-red-800">{error.name}</h4>
                    <p className="text-sm text-red-600">{error.message}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => createGoalFromError(error)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Create Goal
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Goals Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Your Goals ({userGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedGoal?.id === goal.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedGoal(goal)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(goal.category)}
                      <h4 className="font-medium text-sm">{goal.title}</h4>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge
                        className={`text-xs ${getPriorityColor(goal.priority)}`}
                      >
                        {goal.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${getStatusColor(goal.status)}`}>
                      {goal.status.replace("_", " ")}
                    </span>
                    <div className="text-xs text-gray-500">
                      {goal.completionPercentage}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div
                      className="bg-blue-600 h-1 rounded-full"
                      style={{ width: `${goal.completionPercentage}%` }}
                    />
                  </div>
                </div>
              ))}

              {userGoals.length === 0 && (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No goals yet</p>
                  <p className="text-sm text-gray-400">
                    Create your first AI goal
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Goal Details */}
        <div className="lg:col-span-3">
          {isCreatingGoal ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New AI Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Goal Title
                    </label>
                    <Input
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="Fix navigation error"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <Textarea
                      value={newGoalDescription}
                      onChange={(e) => setNewGoalDescription(e.target.value)}
                      placeholder="Detailed description of the goal..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Category
                      </label>
                      <Select
                        value={newGoalCategory}
                        onValueChange={(value: any) =>
                          setNewGoalCategory(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="error_fix">Error Fix</SelectItem>
                          <SelectItem value="optimization">
                            Optimization
                          </SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                          <SelectItem value="automation">Automation</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Priority
                      </label>
                      <Select
                        value={newGoalPriority}
                        onValueChange={(value: any) =>
                          setNewGoalPriority(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={createNewGoal}>Create Goal</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingGoal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedGoal ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="research">Research</TabsTrigger>
                <TabsTrigger value="code">Generated Code</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        {getCategoryIcon(selectedGoal.category)}
                        <span className="ml-2">{selectedGoal.title}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={getPriorityColor(selectedGoal.priority)}
                        >
                          {selectedGoal.priority}
                        </Badge>
                        <Badge
                          variant={
                            selectedGoal.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {selectedGoal.status.replace("_", " ")}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyGoalFromExisting(selectedGoal.id)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {selectedGoal.description}
                    </p>

                    {selectedGoal.errorMessage && (
                      <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                        <h4 className="font-semibold text-red-800 mb-2">
                          Error Details
                        </h4>
                        <p className="text-sm text-red-700 mb-2">
                          <strong>Type:</strong> {selectedGoal.errorType}
                        </p>
                        <p className="text-sm text-red-700">
                          <strong>Message:</strong> {selectedGoal.errorMessage}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedGoal.completionPercentage}%
                        </div>
                        <div className="text-sm text-gray-600">Complete</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {
                            selectedGoal.steps.filter(
                              (s) => s.status === "completed",
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-600">Steps Done</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedGoal.researchResults?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Research Results
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {selectedGoal.status !== "completed" && (
                        <Button
                          onClick={() => updateGoalStatus("in_progress")}
                          disabled={selectedGoal.status === "in_progress"}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                      )}

                      {selectedGoal.status === "in_progress" && (
                        <Button
                          variant="outline"
                          onClick={() => updateGoalStatus("paused")}
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => updateGoalStatus("completed")}
                        disabled={selectedGoal.status === "completed"}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="steps" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Goal Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedGoal.steps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`p-4 border rounded-lg ${
                            step.status === "completed"
                              ? "bg-green-50 border-green-200"
                              : step.status === "in_progress"
                                ? "bg-blue-50 border-blue-200"
                                : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  step.status === "completed"
                                    ? "bg-green-600 text-white"
                                    : step.status === "in_progress"
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-400 text-white"
                                }`}
                              >
                                {step.status === "completed" ? "✓" : index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold">{step.title}</h4>
                                <p className="text-sm text-gray-600">
                                  {step.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                  <span>Est: {step.estimatedTime}min</span>
                                  {step.actualTime && (
                                    <span>Actual: {step.actualTime}min</span>
                                  )}
                                  {step.aiGenerated && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      AI Generated
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            {step.status !== "completed" && (
                              <Button
                                size="sm"
                                onClick={() => completeStep(step.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="research" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      AI Research & Google Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Research Input */}
                      <div className="flex space-x-2">
                        <Input
                          value={researchQuery}
                          onChange={(e) => setResearchQuery(e.target.value)}
                          placeholder="Enter research query (e.g., 'how to fix querySelector error')"
                          className="flex-1"
                        />
                        <Button
                          onClick={startResearch}
                          disabled={isResearching || !researchQuery.trim()}
                        >
                          {isResearching ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {/* Research Results */}
                      {selectedGoal.researchResults &&
                        selectedGoal.researchResults.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold">Research Results</h4>
                            {selectedGoal.researchResults.map((result) => (
                              <div
                                key={result.id}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium">
                                    {result.title}
                                  </h5>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline">
                                      {result.source}
                                    </Badge>
                                    <Badge className="bg-green-100 text-green-800">
                                      {result.relevanceScore}% relevant
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {result.summary}
                                </p>

                                {result.keyInsights.length > 0 && (
                                  <div className="mb-3">
                                    <h6 className="font-medium text-sm mb-1">
                                      Key Insights:
                                    </h6>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                      {result.keyInsights.map(
                                        (insight, idx) => (
                                          <li key={idx}>{insight}</li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}

                                {result.extractedCode && (
                                  <div>
                                    <h6 className="font-medium text-sm mb-1">
                                      Code Example:
                                    </h6>
                                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                      <code>{result.extractedCode}</code>
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      AI Generated Code & Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedGoal.generatedMethods &&
                    selectedGoal.generatedMethods.length > 0 ? (
                      <div className="space-y-4">
                        {selectedGoal.generatedMethods.map((method) => (
                          <div
                            key={method.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold">{method.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {method.description}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                  {method.language}
                                </Badge>
                                <Badge
                                  className={`${
                                    method.category === "fix"
                                      ? "bg-red-100 text-red-800"
                                      : method.category === "test"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {method.category}
                                </Badge>
                                <Badge className="bg-purple-100 text-purple-800">
                                  {method.aiConfidence}% confidence
                                </Badge>
                              </div>
                            </div>

                            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                              <code>{method.code}</code>
                            </pre>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2 text-sm">
                                <span
                                  className={`flex items-center ${method.tested ? "text-green-600" : "text-gray-500"}`}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {method.tested ? "Tested" : "Not tested"}
                                </span>
                                <span
                                  className={`flex items-center ${method.implemented ? "text-blue-600" : "text-gray-500"}`}
                                >
                                  <Code className="w-4 h-4 mr-1" />
                                  {method.implemented
                                    ? "Implemented"
                                    : "Not implemented"}
                                </span>
                              </div>

                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Test
                                </Button>
                                <Button size="sm">
                                  <Download className="w-4 h-4 mr-1" />
                                  Use
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Code className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">No generated code yet</p>
                        <p className="text-sm text-gray-400">
                          Complete research to generate AI solutions
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      AI Insights & Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedGoal.aiInsights &&
                    selectedGoal.aiInsights.length > 0 ? (
                      <div className="space-y-3">
                        {selectedGoal.aiInsights.map((insight, index) => (
                          <div
                            key={index}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                          >
                            <div className="flex items-start space-x-3">
                              <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                              <p className="text-blue-800">{insight}</p>
                            </div>
                          </div>
                        ))}

                        {selectedGoal.similarErrors &&
                          selectedGoal.similarErrors.length > 0 && (
                            <div className="mt-6">
                              <h4 className="font-semibold mb-3">
                                Similar Error Patterns
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {selectedGoal.similarErrors.map(
                                  (errorId, index) => (
                                    <div
                                      key={index}
                                      className="bg-yellow-50 border border-yellow-200 rounded p-3"
                                    >
                                      <p className="text-sm text-yellow-800">
                                        Similar error pattern detected in goal:{" "}
                                        {errorId}
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Lightbulb className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">No AI insights yet</p>
                        <p className="text-sm text-gray-400">
                          Start research to generate insights
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No goal selected
                </h3>
                <p className="text-gray-500">
                  Select a goal from the sidebar or create a new one
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIGoalsManager;
