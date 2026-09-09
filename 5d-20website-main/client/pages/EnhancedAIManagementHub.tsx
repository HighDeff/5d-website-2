import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
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
  Plus,
  TestTube,
  Globe,
  Monitor,
  Cpu,
  Database,
  MessageSquare,
  Palette,
  Layers,
  Terminal,
  Sparkles,
  Gauge,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Square,
  RotateCcw,
  Save,
  Copy,
  ExternalLink,
  Info,
  XCircle,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";
import QuantumPassAIService from "@/services/QuantumPassAIService";
import AIAPIConfigurationSettings from "@/components/AIAPIConfigurationSettings";

interface AIAgent {
  id: string;
  name: string;
  type: 'gpt2' | 'qwen2.5vl' | 'llama3.2' | 'claude' | 'custom';
  status: 'active' | 'idle' | 'training' | 'error' | 'offline';
  capabilities: string[];
  performance: {
    accuracy: number;
    speed: number;
    reliability: number;
    memory_usage: number;
  };
  config: {
    endpoint: string;
    model: string;
    temperature: number;
    maxTokens: number;
    contextWindow: number;
    conversationHistory: any[];
    longTermMemory: any[];
  };
  statistics: {
    totalRequests: number;
    successfulRequests: number;
    averageResponseTime: number;
    uptime: number;
  };
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  category: 'system' | 'ai' | 'canvas' | 'user' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  actions?: { label: string; action: () => void }[];
  dismissed: boolean;
  autoExpire?: number; // minutes
}

const EnhancedAIManagementHub: React.FC = () => {
  const { user } = useUserAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [aiAgents, setAIAgents] = useState<AIAgent[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [alertSettings, setAlertSettings] = useState({
    showInfo: true,
    showWarnings: true,
    showErrors: true,
    showSuccess: true,
    autoExpire: true,
    soundEnabled: true,
    desktopNotifications: true,
    emailNotifications: false,
    categories: {
      system: true,
      ai: true,
      canvas: true,
      user: true,
      security: true
    },
    priority: {
      low: true,
      medium: true,
      high: true,
      critical: true
    }
  });
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [canvasSettings, setCanvasSettings] = useState({
    showGrid: true,
    showTrails: true,
    autoSave: true,
    maxEntities: 100,
    realTimeSync: true,
    collaborationMode: false
  });

  useEffect(() => {
    initializeAIAgents();
    loadSystemAlerts();
    setupAlertMonitoring();
  }, []);

  const initializeAIAgents = () => {
    const defaultAgents: AIAgent[] = [
      {
        id: 'gpt2-agent',
        name: 'GPT-2 Long Context',
        type: 'gpt2',
        status: 'active',
        capabilities: ['text-generation', 'conversation', 'long-context', 'memory-retention'],
        performance: { accuracy: 87, speed: 92, reliability: 94, memory_usage: 45 },
        config: {
          endpoint: 'https://api.huggingface.co/models/gpt2',
          model: 'gpt2-xl',
          temperature: 0.7,
          maxTokens: 8192,
          contextWindow: 32000,
          conversationHistory: [],
          longTermMemory: []
        },
        statistics: { totalRequests: 1247, successfulRequests: 1198, averageResponseTime: 450, uptime: 98.7 }
      },
      {
        id: 'qwen-agent',
        name: 'Qwen2.5VL Vision',
        type: 'qwen2.5vl',
        status: 'active',
        capabilities: ['vision', 'text-generation', 'multimodal', 'code-generation'],
        performance: { accuracy: 92, speed: 88, reliability: 96, memory_usage: 62 },
        config: {
          endpoint: 'https://ai.quantumpass.io/ollama/api/chat',
          model: 'qwen2.5vl:7b',
          temperature: 0.7,
          maxTokens: 4000,
          contextWindow: 10000,
          conversationHistory: [],
          longTermMemory: []
        },
        statistics: { totalRequests: 892, successfulRequests: 871, averageResponseTime: 380, uptime: 99.2 }
      },
      {
        id: 'llama-agent',
        name: 'Llama 3.2 Assistant',
        type: 'llama3.2',
        status: 'idle',
        capabilities: ['reasoning', 'analysis', 'problem-solving', 'code-review'],
        performance: { accuracy: 89, speed: 85, reliability: 91, memory_usage: 58 },
        config: {
          endpoint: 'https://ai.quantumpass.io/ollama/api/chat',
          model: 'llama3.2:latest',
          temperature: 0.6,
          maxTokens: 4096,
          contextWindow: 12000,
          conversationHistory: [],
          longTermMemory: []
        },
        statistics: { totalRequests: 634, successfulRequests: 612, averageResponseTime: 520, uptime: 96.5 }
      }
    ];
    setAIAgents(defaultAgents);
  };

  const loadSystemAlerts = () => {
    const alerts: SystemAlert[] = [
      {
        id: 'alert-1',
        type: 'warning',
        title: 'High Memory Usage',
        message: 'GPT-2 agent is using 78% of allocated memory. Consider optimizing context window.',
        timestamp: new Date(Date.now() - 300000),
        category: 'ai',
        priority: 'medium',
        actionable: true,
        actions: [
          { label: 'Optimize Memory', action: () => optimizeAgentMemory('gpt2-agent') },
          { label: 'View Details', action: () => showAgentDetails('gpt2-agent') }
        ],
        dismissed: false,
        autoExpire: 60
      },
      {
        id: 'alert-2',
        type: 'success',
        title: 'Canvas Sync Complete',
        message: 'All canvas data has been successfully synchronized across all connected clients.',
        timestamp: new Date(Date.now() - 120000),
        category: 'canvas',
        priority: 'low',
        actionable: false,
        dismissed: false,
        autoExpire: 15
      },
      {
        id: 'alert-3',
        type: 'error',
        title: 'API Connection Failed',
        message: 'Failed to connect to Llama 3.2 endpoint. Retrying in 30 seconds.',
        timestamp: new Date(Date.now() - 600000),
        category: 'system',
        priority: 'high',
        actionable: true,
        actions: [
          { label: 'Retry Connection', action: () => retryConnection('llama-agent') },
          { label: 'Check Settings', action: () => setActiveTab('api-config') }
        ],
        dismissed: false
      },
      {
        id: 'alert-4',
        type: 'info',
        title: 'New User Registered',
        message: 'A new user has joined the platform and is exploring AI features.',
        timestamp: new Date(Date.now() - 900000),
        category: 'user',
        priority: 'low',
        actionable: false,
        dismissed: false,
        autoExpire: 30
      }
    ];
    setSystemAlerts(alerts);
  };

  const setupAlertMonitoring = () => {
    // Simulate real-time alert monitoring
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every interval
        generateRandomAlert();
      }

      // Auto-expire alerts
      if (alertSettings.autoExpire) {
        setSystemAlerts(prev => prev.filter(alert => {
          if (alert.autoExpire) {
            const expireTime = new Date(alert.timestamp.getTime() + alert.autoExpire * 60000);
            return new Date() < expireTime;
          }
          return true;
        }));
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  };

  const generateRandomAlert = () => {
    const types: SystemAlert['type'][] = ['info', 'warning', 'error', 'success'];
    const categories: SystemAlert['category'][] = ['system', 'ai', 'canvas', 'user', 'security'];
    const priorities: SystemAlert['priority'][] = ['low', 'medium', 'high'];

    const messages = {
      info: ['New feature available', 'System update scheduled', 'Performance report ready'],
      warning: ['High CPU usage detected', 'Memory threshold reached', 'Slow response times'],
      error: ['Connection timeout', 'Authentication failed', 'Service unavailable'],
      success: ['Task completed', 'Sync successful', 'Optimization applied']
    };

    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const messageList = messages[type];
    const message = messageList[Math.floor(Math.random() * messageList.length)];

    const newAlert: SystemAlert = {
      id: `alert-${Date.now()}`,
      type,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      message,
      timestamp: new Date(),
      category,
      priority,
      actionable: type === 'warning' || type === 'error',
      actions: type === 'warning' || type === 'error' ? [
        { label: 'Investigate', action: () => investigateAlert(newAlert.id) }
      ] : undefined,
      dismissed: false,
      autoExpire: type === 'info' || type === 'success' ? 30 : undefined
    };

    setSystemAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep only last 50 alerts
  };

  const testAIAgent = async (agentId: string) => {
    setIsTestingAI(true);
    try {
      const agent = aiAgents.find(a => a.id === agentId);
      if (!agent) return;

      const testPrompt = "Hello! This is a test message. Please respond with a confirmation that you're working properly and tell me about your capabilities.";

      // Simulate API call
      const startTime = Date.now();

      // For GPT-2, simulate long context processing
      if (agent.type === 'gpt2') {
        const longContext = "This is a long conversation history that tests the agent's ability to maintain context over extended interactions. " +
                          "Previous topics discussed include: AI development, neural networks, machine learning algorithms, and natural language processing. " +
                          "The agent should be able to reference this context in its response.";
        console.log('Testing GPT-2 with long context:', longContext);
      }

      // Mock response based on agent type
      const responses = {
        'gpt2': 'Hello! GPT-2 Long Context agent is operational. I can handle extended conversations with up to 32,000 tokens of context, maintain conversation history, and provide coherent responses across long dialogues. My capabilities include text generation, conversation management, and memory retention.',
        'qwen2.5vl': 'Qwen2.5VL Vision agent responding! I\'m functioning properly and ready to assist. My capabilities include vision processing, multimodal understanding, text generation, and code generation. I can analyze images, understand visual content, and provide detailed responses.',
        'llama3.2': 'Llama 3.2 Assistant here! System check complete. I specialize in reasoning, analysis, problem-solving, and code review. I\'m currently optimized for analytical tasks and can provide detailed explanations and solutions.'
      };

      const response = responses[agent.type] || 'Agent responding normally.';
      const responseTime = Date.now() - startTime + Math.random() * 1000; // Add some realistic delay

      const testResult = {
        id: `test-${Date.now()}`,
        agentId,
        agentName: agent.name,
        prompt: testPrompt,
        response,
        responseTime,
        success: true,
        timestamp: new Date(),
        contextLength: agent.config.conversationHistory.length,
        memoryUsage: agent.performance.memory_usage
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 9)]); // Keep last 10 results

      // Update agent statistics
      setAIAgents(prev => prev.map(a =>
        a.id === agentId
          ? {
              ...a,
              statistics: {
                ...a.statistics,
                totalRequests: a.statistics.totalRequests + 1,
                successfulRequests: a.statistics.successfulRequests + 1,
                averageResponseTime: (a.statistics.averageResponseTime + responseTime) / 2
              }
            }
          : a
      ));

      // Add success alert
      const successAlert: SystemAlert = {
        id: `test-success-${Date.now()}`,
        type: 'success',
        title: 'AI Test Successful',
        message: `${agent.name} responded successfully in ${responseTime.toFixed(0)}ms`,
        timestamp: new Date(),
        category: 'ai',
        priority: 'low',
        actionable: false,
        dismissed: false,
        autoExpire: 15
      };
      setSystemAlerts(prev => [successAlert, ...prev]);

    } catch (error) {
      console.error('AI test failed:', error);

      // Add error alert
      const errorAlert: SystemAlert = {
        id: `test-error-${Date.now()}`,
        type: 'error',
        title: 'AI Test Failed',
        message: `Failed to test AI agent: ${(error as Error).message}`,
        timestamp: new Date(),
        category: 'ai',
        priority: 'high',
        actionable: true,
        actions: [
          { label: 'Retry Test', action: () => testAIAgent(agentId) },
          { label: 'Check Configuration', action: () => setActiveTab('api-config') }
        ],
        dismissed: false
      };
      setSystemAlerts(prev => [errorAlert, ...prev]);
    } finally {
      setIsTestingAI(false);
    }
  };

  const dismissAlert = (alertId: string) => {
    setSystemAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const clearAllAlerts = () => {
    setSystemAlerts([]);
  };

  const optimizeAgentMemory = (agentId: string) => {
    setAIAgents(prev => prev.map(agent =>
      agent.id === agentId
        ? {
            ...agent,
            performance: { ...agent.performance, memory_usage: Math.max(20, agent.performance.memory_usage - 30) },
            config: { ...agent.config, conversationHistory: agent.config.conversationHistory.slice(-10) } // Keep only last 10 conversations
          }
        : agent
    ));

    const alert: SystemAlert = {
      id: `optimize-${Date.now()}`,
      type: 'success',
      title: 'Memory Optimized',
      message: `Successfully optimized memory for ${aiAgents.find(a => a.id === agentId)?.name}`,
      timestamp: new Date(),
      category: 'ai',
      priority: 'low',
      actionable: false,
      dismissed: false,
      autoExpire: 15
    };
    setSystemAlerts(prev => [alert, ...prev]);
  };

  const showAgentDetails = (agentId: string) => {
    setActiveTab('agents');
    // Scroll to agent or highlight it
  };

  const retryConnection = (agentId: string) => {
    setAIAgents(prev => prev.map(agent =>
      agent.id === agentId ? { ...agent, status: 'active' as const } : agent
    ));

    const alert: SystemAlert = {
      id: `retry-${Date.now()}`,
      type: 'success',
      title: 'Connection Restored',
      message: `Successfully reconnected to ${aiAgents.find(a => a.id === agentId)?.name}`,
      timestamp: new Date(),
      category: 'system',
      priority: 'low',
      actionable: false,
      dismissed: false,
      autoExpire: 15
    };
    setSystemAlerts(prev => [alert, ...prev]);
  };

  const investigateAlert = (alertId: string) => {
    console.log('Investigating alert:', alertId);
    // Could open a detailed investigation modal
  };

  const filteredAlerts = systemAlerts.filter(alert => {
    if (alert.dismissed) return false;
    if (!alertSettings.categories[alert.category]) return false;
    if (!alertSettings.priority[alert.priority]) return false;

    switch (alert.type) {
      case 'info': return alertSettings.showInfo;
      case 'warning': return alertSettings.showWarnings;
      case 'error': return alertSettings.showErrors;
      case 'success': return alertSettings.showSuccess;
      default: return true;
    }
  });

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4 text-blue-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
  };

  const getStatusColor = (status: AIAgent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'idle': return 'bg-yellow-600';
      case 'training': return 'bg-blue-600';
      case 'error': return 'bg-red-600';
      case 'offline': return 'bg-gray-600';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8">
          <CardContent className="text-center">
            <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-slate-300 mb-4">Please sign in to access AI Management Hub</p>
            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                  <Brain className="h-10 w-10 text-blue-400" />
                  Enhanced AI Management Hub
                </h1>
                <p className="text-slate-300 mt-2">Comprehensive AI agent management, testing, and system monitoring</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">{aiAgents.filter(a => a.status === 'active').length}</div>
                <div className="text-xs text-slate-400">Active Agents</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-400">{filteredAlerts.length}</div>
                <div className="text-xs text-slate-400">Active Alerts</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400">{testResults.length}</div>
                <div className="text-xs text-slate-400">Test Results</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 text-xs">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              <span className="hidden sm:inline">AI Agents</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              <span className="hidden sm:inline">System Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-1">
              <TestTube className="h-3 w-3" />
              <span className="hidden sm:inline">AI Testing</span>
            </TabsTrigger>
            <TabsTrigger value="canvas" className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              <span className="hidden sm:inline">Canvas</span>
            </TabsTrigger>
            <TabsTrigger value="api-config" className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              <span className="hidden sm:inline">API Config</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* System Health */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Overall</span>
                      <Badge className="bg-green-600">98.7%</Badge>
                    </div>
                    <Progress value={98.7} className="h-2" />
                    <div className="text-xs text-slate-400">All systems operational</div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Agents */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-400" />
                    AI Agents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {aiAgents.map(agent => (
                      <div key={agent.id} className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{agent.name}</span>
                        <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-400" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filteredAlerts.slice(0, 3).map(alert => (
                      <div key={alert.id} className="flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        <span className="text-xs text-slate-300 truncate">{alert.title}</span>
                      </div>
                    ))}
                    {filteredAlerts.length === 0 && (
                      <div className="text-xs text-slate-400">No active alerts</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Avg Response</span>
                      <span className="text-sm text-white">450ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Success Rate</span>
                      <span className="text-sm text-green-400">96.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Memory Usage</span>
                      <span className="text-sm text-yellow-400">55%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Recent AI Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testResults.slice(0, 5).map(result => (
                    <div key={result.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <div>
                          <div className="text-sm font-medium text-white">{result.agentName}</div>
                          <div className="text-xs text-slate-400">{result.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">{result.responseTime.toFixed(0)}ms</div>
                        <div className="text-xs text-green-400">Success</div>
                      </div>
                    </div>
                  ))}
                  {testResults.length === 0 && (
                    <div className="text-center text-slate-400 py-8">
                      No recent activity. Start testing AI agents to see results here.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {aiAgents.map(agent => (
                <Card key={agent.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                      <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                    </div>
                    <div className="text-sm text-slate-400">{agent.type.toUpperCase()} • {agent.capabilities.length} capabilities</div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Performance Metrics */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Accuracy</span>
                        <span className="text-white">{agent.performance.accuracy}%</span>
                      </div>
                      <Progress value={agent.performance.accuracy} className="h-1" />

                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Speed</span>
                        <span className="text-white">{agent.performance.speed}%</span>
                      </div>
                      <Progress value={agent.performance.speed} className="h-1" />

                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Memory</span>
                        <span className={agent.performance.memory_usage > 70 ? "text-red-400" : "text-white"}>
                          {agent.performance.memory_usage}%
                        </span>
                      </div>
                      <Progress value={agent.performance.memory_usage} className="h-1" />
                    </div>

                    {/* Configuration Info */}
                    <div className="bg-slate-900 rounded-lg p-3 space-y-2">
                      <div className="text-xs text-slate-400">Configuration</div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Model:</span>
                          <span className="text-white">{agent.config.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Context:</span>
                          <span className="text-white">{agent.config.contextWindow.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Temperature:</span>
                          <span className="text-white">{agent.config.temperature}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Conversations:</span>
                          <span className="text-white">{agent.config.conversationHistory.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-slate-900 rounded-lg p-3 space-y-2">
                      <div className="text-xs text-slate-400">Statistics</div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Requests:</span>
                          <span className="text-white">{agent.statistics.totalRequests.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Success Rate:</span>
                          <span className="text-green-400">
                            {((agent.statistics.successfulRequests / agent.statistics.totalRequests) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Avg Response:</span>
                          <span className="text-white">{agent.statistics.averageResponseTime.toFixed(0)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Uptime:</span>
                          <span className="text-blue-400">{agent.statistics.uptime}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => testAIAgent(agent.id)}
                        disabled={isTestingAI}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <TestTube className="h-3 w-3" />
                        Test
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => optimizeAgentMemory(agent.id)}
                        className="flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        Optimize
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab('api-config')}
                        className="flex items-center gap-1"
                      >
                        <Settings className="h-3 w-3" />
                        Config
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* System Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            {/* Alert Controls */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-400" />
                    Alert Settings
                  </span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={clearAllAlerts}>
                      Clear All
                    </Button>
                    <Badge variant="outline">{filteredAlerts.length} Active</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Alert Types</Label>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alertSettings.showInfo}
                          onCheckedChange={(checked) =>
                            setAlertSettings(prev => ({ ...prev, showInfo: checked }))
                          }
                        />
                        <Label className="text-xs text-slate-400">Info</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alertSettings.showWarnings}
                          onCheckedChange={(checked) =>
                            setAlertSettings(prev => ({ ...prev, showWarnings: checked }))
                          }
                        />
                        <Label className="text-xs text-slate-400">Warnings</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alertSettings.showErrors}
                          onCheckedChange={(checked) =>
                            setAlertSettings(prev => ({ ...prev, showErrors: checked }))
                          }
                        />
                        <Label className="text-xs text-slate-400">Errors</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alertSettings.showSuccess}
                          onCheckedChange={(checked) =>
                            setAlertSettings(prev => ({ ...prev, showSuccess: checked }))
                          }
                        />
                        <Label className="text-xs text-slate-400">Success</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Categories</Label>
                    <div className="space-y-1">
                      {Object.entries(alertSettings.categories).map(([category, enabled]) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) =>
                              setAlertSettings(prev => ({
                                ...prev,
                                categories: { ...prev.categories, [category]: checked }
                              }))
                            }
                          />
                          <Label className="text-xs text-slate-400 capitalize">{category}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Priority</Label>
                    <div className="space-y-1">
                      {Object.entries(alertSettings.priority).map(([priority, enabled]) => (
                        <div key={priority} className="flex items-center space-x-2">
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) =>
                              setAlertSettings(prev => ({
                                ...prev,
                                priority: { ...prev.priority, [priority]: checked }
                              }))
                            }
                          />
                          <Label className="text-xs text-slate-400 capitalize">{priority}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Options</Label>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alertSettings.autoExpire}
                          onCheckedChange={(checked) =>
                            setAlertSettings(prev => ({ ...prev, autoExpire: checked }))
                          }
                        />
                        <Label className="text-xs text-slate-400">Auto Expire</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alertSettings.soundEnabled}
                          onCheckedChange={(checked) =>
                            setAlertSettings(prev => ({ ...prev, soundEnabled: checked }))
                          }
                        />
                        <Label className="text-xs text-slate-400">Sound</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alertSettings.desktopNotifications}
                          onCheckedChange={(checked) =>
                            setAlertSettings(prev => ({ ...prev, desktopNotifications: checked }))
                          }
                        />
                        <Label className="text-xs text-slate-400">Desktop</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alertSettings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setAlertSettings(prev => ({ ...prev, emailNotifications: checked }))
                          }
                        />
                        <Label className="text-xs text-slate-400">Email</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <div className="space-y-3">
              {filteredAlerts.map(alert => (
                <Alert key={alert.id} className={`bg-slate-800 border-l-4 ${
                  alert.type === 'error' ? 'border-l-red-500' :
                  alert.type === 'warning' ? 'border-l-yellow-500' :
                  alert.type === 'success' ? 'border-l-green-500' :
                  'border-l-blue-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <AlertTitle className="text-white flex items-center gap-2">
                          {alert.title}
                          <Badge variant="outline" className="text-xs">
                            {alert.category}
                          </Badge>
                          <Badge
                            variant={alert.priority === 'critical' ? 'destructive' : 'outline'}
                            className="text-xs"
                          >
                            {alert.priority}
                          </Badge>
                        </AlertTitle>
                        <AlertDescription className="text-slate-300 mt-1">
                          {alert.message}
                        </AlertDescription>
                        <div className="text-xs text-slate-400 mt-2">
                          {alert.timestamp.toLocaleString()}
                          {alert.autoExpire && (
                            <span className="ml-2">• Auto-expires in {alert.autoExpire}m</span>
                          )}
                        </div>
                        {alert.actions && (
                          <div className="flex gap-2 mt-3">
                            {alert.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                onClick={action.action}
                                className="text-xs"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Alert>
              ))}

              {filteredAlerts.length === 0 && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">All Clear!</h3>
                    <p className="text-slate-400">No active alerts matching your filter criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* AI Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-blue-400" />
                    AI Agent Testing
                  </span>
                  <Badge variant="outline">{testResults.length} Tests Run</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {aiAgents.map(agent => (
                    <div key={agent.id} className="bg-slate-900 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-blue-400" />
                          <span className="font-medium text-white">{agent.name}</span>
                        </div>
                        <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                      </div>
                      <div className="text-xs text-slate-400 mb-3">
                        {agent.type.toUpperCase()} • {agent.config.model}
                      </div>
                      <Button
                        onClick={() => testAIAgent(agent.id)}
                        disabled={isTestingAI || agent.status === 'offline'}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        {isTestingAI ? 'Testing...' : 'Run Test'}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Test Results */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Test Results
                  </h3>

                  {testResults.map(result => (
                    <Card key={result.id} className="bg-slate-900 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="font-medium text-white">{result.agentName}</span>
                            <Badge variant="outline" className="text-xs">
                              {result.responseTime.toFixed(0)}ms
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400">
                            {result.timestamp.toLocaleString()}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Test Prompt:</div>
                            <div className="text-sm text-slate-300 bg-slate-800 rounded p-2">
                              {result.prompt}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-slate-400 mb-1">AI Response:</div>
                            <div className="text-sm text-white bg-slate-800 rounded p-2">
                              {result.response}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="text-slate-400">Context Length:</span>
                              <span className="text-white ml-1">{result.contextLength}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Memory Usage:</span>
                              <span className="text-white ml-1">{result.memoryUsage}%</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Success:</span>
                              <span className="text-green-400 ml-1">✓</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {testResults.length === 0 && (
                    <Card className="bg-slate-900 border-slate-600">
                      <CardContent className="text-center py-12">
                        <TestTube className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No Tests Yet</h3>
                        <p className="text-slate-400">Run your first AI agent test to see results here.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Canvas Settings Tab */}
          <TabsContent value="canvas" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-400" />
                  Canvas Management & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Visual Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Show Grid</Label>
                        <Switch
                          checked={canvasSettings.showGrid}
                          onCheckedChange={(checked) =>
                            setCanvasSettings(prev => ({ ...prev, showGrid: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Show Entity Trails</Label>
                        <Switch
                          checked={canvasSettings.showTrails}
                          onCheckedChange={(checked) =>
                            setCanvasSettings(prev => ({ ...prev, showTrails: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Auto Save</Label>
                        <Switch
                          checked={canvasSettings.autoSave}
                          onCheckedChange={(checked) =>
                            setCanvasSettings(prev => ({ ...prev, autoSave: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Performance Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-slate-300">Max Entities: {canvasSettings.maxEntities}</Label>
                        <Slider
                          value={[canvasSettings.maxEntities]}
                          onValueChange={([value]) =>
                            setCanvasSettings(prev => ({ ...prev, maxEntities: value }))
                          }
                          min={10}
                          max={500}
                          step={10}
                          className="mt-2"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Real-time Sync</Label>
                        <Switch
                          checked={canvasSettings.realTimeSync}
                          onCheckedChange={(checked) =>
                            setCanvasSettings(prev => ({ ...prev, realTimeSync: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Collaboration Mode</Label>
                        <Switch
                          checked={canvasSettings.collaborationMode}
                          onCheckedChange={(checked) =>
                            setCanvasSettings(prev => ({ ...prev, collaborationMode: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Canvas Actions */}
                <div className="border-t border-slate-600 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Canvas Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Reset Canvas
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save State
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Import
                    </Button>
                  </div>
                </div>

                {/* Canvas Status */}
                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Current Canvas Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Active Entities</div>
                      <div className="text-2xl font-bold text-blue-400">127</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Memory Usage</div>
                      <div className="text-2xl font-bold text-yellow-400">45%</div>
                    </div>
                    <div>
                      <div className="text-slate-400">FPS</div>
                      <div className="text-2xl font-bold text-green-400">60</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Sync Status</div>
                      <div className="text-2xl font-bold text-green-400">✓</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Configuration Tab */}
          <TabsContent value="api-config" className="space-y-6">
            <AIAPIConfigurationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAIManagementHub;
