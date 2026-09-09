import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Brain,
  Wifi,
  WifiOff,
  Settings,
  Activity,
  Zap,
  TestTube,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import QuantumPassAIService from '@/services/QuantumPassAIService';
import AIConnectionStatus from '@/components/AIConnectionStatus';

interface TestResult {
  id: string;
  test: string;
  success: boolean;
  message: string;
  timestamp: Date;
  responseTime: number;
  details?: any;
}

const AIStatus: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [aiService] = useState(() => QuantumPassAIService.getInstance());
  const [connectionStatus, setConnectionStatus] = useState({
    isOnline: false,
    status: 'checking',
    lastPing: -1
  });
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [systemInfo, setSystemInfo] = useState<any>({});

  useEffect(() => {
    initializeAISystem();
  }, []);

  const initializeAISystem = async () => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Initializing AI System...');
      
      // Subscribe to status changes
      aiService.onOnlineStatusChange((isOnline: boolean, status: string, lastPing: number) => {
        setConnectionStatus({ isOnline, status, lastPing });
      });

      // Get current configuration
      const config = aiService.getConfiguration();
      console.log('📋 AI Configuration:', config);
      
      // Get initial status
      const initialStatus = aiService.getOnlineStatus();
      setConnectionStatus(initialStatus);
      
      // Set system info
      setSystemInfo({
        endpoint: config.endpoint,
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        contextWindow: config.contextWindow,
        timeout: config.timeout
      });

      // Run initial tests
      await runDiagnosticTests();
      
    } catch (error) {
      console.error('❌ Failed to initialize AI system:', error);
      addTestResult('System Initialization', false, `Failed to initialize: ${error}`, {});
    } finally {
      setIsLoading(false);
    }
  };

  const runDiagnosticTests = async () => {
    setIsTesting(true);
    const tests: TestResult[] = [];

    try {
      // Test 1: Configuration Check
      const startTime = Date.now();
      const config = aiService.getConfiguration();
      
      tests.push({
        id: 'config-check',
        test: 'Configuration Check',
        success: !!config.endpoint && !!config.model,
        message: config.endpoint && config.model ? 
          `Configuration valid: ${config.model} at ${config.endpoint}` : 
          'Invalid configuration: Missing endpoint or model',
        timestamp: new Date(),
        responseTime: Date.now() - startTime,
        details: config
      });

      // Test 2: Network Connectivity
      const networkStart = Date.now();
      const networkOnline = navigator.onLine;
      
      tests.push({
        id: 'network-check',
        test: 'Network Connectivity',
        success: networkOnline,
        message: networkOnline ? 'Network connection available' : 'No network connection',
        timestamp: new Date(),
        responseTime: Date.now() - networkStart
      });

      // Test 3: AI Service Ping
      if (networkOnline) {
        const pingStart = Date.now();
        try {
          const pingSuccess = await aiService.checkOnlineStatus();
          
          tests.push({
            id: 'ping-test',
            test: 'AI Service Ping',
            success: pingSuccess,
            message: pingSuccess ? 
              `AI service responding (${Date.now() - pingStart}ms)` : 
              'AI service not responding',
            timestamp: new Date(),
            responseTime: Date.now() - pingStart
          });
        } catch (error) {
          tests.push({
            id: 'ping-test',
            test: 'AI Service Ping',
            success: false,
            message: `Ping failed: ${error}`,
            timestamp: new Date(),
            responseTime: Date.now() - pingStart
          });
        }

        // Test 4: Full Connection Test
        const connectionStart = Date.now();
        try {
          const connectionSuccess = await aiService.testConnection();
          
          tests.push({
            id: 'connection-test',
            test: 'Full Connection Test',
            success: connectionSuccess,
            message: connectionSuccess ? 
              `Full connection test successful (${Date.now() - connectionStart}ms)` : 
              'Full connection test failed',
            timestamp: new Date(),
            responseTime: Date.now() - connectionStart
          });
        } catch (error) {
          tests.push({
            id: 'connection-test',
            test: 'Full Connection Test',
            success: false,
            message: `Connection test failed: ${error}`,
            timestamp: new Date(),
            responseTime: Date.now() - connectionStart
          });
        }

        // Test 5: AI Response Test
        const responseStart = Date.now();
        try {
          const testMessage = await aiService.sendMessage('Hello! This is a test message. Please respond with "Test successful" if you receive this.');
          
          tests.push({
            id: 'response-test',
            test: 'AI Response Test',
            success: testMessage.includes('Test successful') || testMessage.length > 10,
            message: testMessage.length > 10 ? 
              `AI responded successfully: "${testMessage.substring(0, 100)}..."` : 
              'AI response was too short or invalid',
            timestamp: new Date(),
            responseTime: Date.now() - responseStart,
            details: { response: testMessage }
          });
        } catch (error) {
          tests.push({
            id: 'response-test',
            test: 'AI Response Test',
            success: false,
            message: `AI response test failed: ${error}`,
            timestamp: new Date(),
            responseTime: Date.now() - responseStart
          });
        }
      }

    } catch (error) {
      console.error('❌ Diagnostic tests failed:', error);
      tests.push({
        id: 'diagnostic-error',
        test: 'Diagnostic Tests',
        success: false,
        message: `Diagnostic tests failed: ${error}`,
        timestamp: new Date(),
        responseTime: 0
      });
    }

    setTestResults(tests);
    setIsTesting(false);
  };

  const addTestResult = (test: string, success: boolean, message: string, details: any = {}) => {
    const result: TestResult = {
      id: `test-${Date.now()}`,
      test,
      success,
      message,
      timestamp: new Date(),
      responseTime: 0,
      details
    };
    setTestResults(prev => [result, ...prev]);
  };

  const retryTests = async () => {
    setTestResults([]);
    await runDiagnosticTests();
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-400" />
    ) : (
      <XCircle className="h-4 w-4 text-red-400" />
    );
  };

  const overallStatus = testResults.length > 0 ? 
    testResults.filter(t => t.success).length / testResults.length : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8">
          <CardContent className="text-center">
            <RefreshCw className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-2">Initializing AI System</h2>
            <p className="text-slate-300">Running diagnostic tests...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
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
                  AI System Status
                </h1>
                <p className="text-slate-300 mt-2">Real-time AI connectivity and performance monitoring</p>
              </div>
            </div>
            
            <AIConnectionStatus showDetails={false} />
          </div>
        </div>

        {/* Overall Status */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                System Overview
              </span>
              <Badge className={overallStatus > 0.8 ? 'bg-green-600' : overallStatus > 0.5 ? 'bg-yellow-600' : 'bg-red-600'}>
                {overallStatus > 0.8 ? 'Healthy' : overallStatus > 0.5 ? 'Degraded' : 'Critical'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {connectionStatus.isOnline ? 'ONLINE' : 'OFFLINE'}
                </div>
                <div className="text-sm text-slate-400">Connection Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {testResults.filter(t => t.success).length}/{testResults.length}
                </div>
                <div className="text-sm text-slate-400">Tests Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {connectionStatus.lastPing > 0 ? `${connectionStatus.lastPing}ms` : 'N/A'}
                </div>
                <div className="text-sm text-slate-400">Response Time</div>
              </div>
            </div>
            
            <Progress value={overallStatus * 100} className="mb-4" />
            
            <div className="flex gap-2">
              <Button onClick={retryTests} disabled={isTesting} className="flex items-center gap-2">
                <RefreshCw className={`h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
                {isTesting ? 'Running Tests...' : 'Retry Tests'}
              </Button>
              <Link to="/canvas-control-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  AI Configuration
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Info */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-400" />
              Current Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Endpoint:</span>
                  <span className="text-blue-400 font-mono text-sm">{systemInfo.endpoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Model:</span>
                  <span className="text-green-400">{systemInfo.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Temperature:</span>
                  <span className="text-white">{systemInfo.temperature}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Max Tokens:</span>
                  <span className="text-white">{systemInfo.maxTokens?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Context Window:</span>
                  <span className="text-white">{systemInfo.contextWindow?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Timeout:</span>
                  <span className="text-white">{systemInfo.timeout ? Math.floor(systemInfo.timeout / 1000) : 0}s</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-green-400" />
              Diagnostic Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.length === 0 && !isTesting && (
                <div className="text-center text-slate-400 py-8">
                  No test results yet. Click "Retry Tests" to run diagnostics.
                </div>
              )}
              
              {isTesting && (
                <div className="text-center text-slate-400 py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  Running diagnostic tests...
                </div>
              )}
              
              {testResults.map(result => (
                <Alert key={result.id} className={`bg-slate-900 border-l-4 ${
                  result.success ? 'border-l-green-500' : 'border-l-red-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(result.success)}
                      <div className="flex-1">
                        <AlertTitle className="text-white flex items-center gap-2">
                          {result.test}
                          <Badge variant={result.success ? 'outline' : 'destructive'} className="text-xs">
                            {result.responseTime}ms
                          </Badge>
                        </AlertTitle>
                        <AlertDescription className="text-slate-300 mt-1">
                          {result.message}
                        </AlertDescription>
                        <div className="text-xs text-slate-400 mt-2">
                          {result.timestamp.toLocaleString()}
                        </div>
                        {result.details && Object.keys(result.details).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-blue-400 cursor-pointer">Show Details</summary>
                            <pre className="text-xs text-slate-400 mt-1 bg-slate-800 p-2 rounded overflow-x-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIStatus;
