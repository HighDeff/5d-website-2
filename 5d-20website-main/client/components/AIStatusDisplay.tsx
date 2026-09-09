import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Activity,
  Zap
} from 'lucide-react';
import QuantumPassAIService from '@/services/QuantumPassAIService';
import AgentTaskEngine from '@/services/AgentTaskEngine';
import AIConfidenceScoring from '@/services/AIConfidenceScoring';
import AISelfFixingSystem from '@/services/AISelfFixingSystem';

interface AIStatusDisplayProps {
  showDetails?: boolean;
  compact?: boolean;
  onStatusChange?: (status: any) => void;
}

interface AIServiceStatus {
  isOnline: boolean;
  status: string;
  lastPing: number;
  confidence: number;
  selfFixingActive: boolean;
  errorCount: number;
  lastError?: string;
  isInitialized: boolean;
  endpoint?: string;
  model?: string;
  fallbackActive?: boolean;
}

const AIStatusDisplay: React.FC<AIStatusDisplayProps> = ({
  showDetails = false,
  compact = false,
  onStatusChange
}) => {
  const [aiService] = useState(() => QuantumPassAIService.getInstance());
  const [confidenceScoring] = useState(() => AIConfidenceScoring.getInstance());
  const [selfFixingSystem] = useState(() => AISelfFixingSystem.getInstance());
  const [engine] = useState(() => AgentTaskEngine.getInstance());
  const [offline, setOffline] = useState<boolean>(engine.getOfflineMode());
  const [queueCount, setQueueCount] = useState<number>(engine.listQueue().length);
  const [status, setStatus] = useState<AIServiceStatus>({
    isOnline: false,
    status: 'initializing',
    lastPing: 0,
    confidence: 0,
    selfFixingActive: false,
    errorCount: 0,
    isInitialized: false
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      try {
        const onlineStatus = aiService.getOnlineStatus();
        const confidenceMetrics = aiService.getConfidenceMetrics();
        const selfFixingStatus = aiService.getSelfFixingStatus();

        const newStatus: AIServiceStatus = {
          isOnline: onlineStatus?.isOnline ?? false,
          status: onlineStatus?.status ?? 'unknown',
          lastPing: onlineStatus?.lastPing ?? -1,
          confidence: confidenceMetrics?.average ?? 0,
          selfFixingActive: selfFixingSystem.isLoopModeRunning(),
          errorCount: selfFixingStatus?.totalErrors ?? 0,
          isInitialized: aiService.isReady(),
          endpoint: onlineStatus?.endpoint,
          model: onlineStatus?.model,
          fallbackActive: onlineStatus?.fallbackActive
        };

        setStatus(newStatus);

        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      } catch (error) {
        console.warn('Error updating AI status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setStatus(prev => ({
          ...prev,
          lastError: errorMessage,
          status: 'error',
          isOnline: false
        }));
      }
    };

    // Initial update
    updateStatus();

    // Set up periodic updates
    const interval = setInterval(updateStatus, 3000);

    // Poll engine state for queued tasks/offline flag
    const qInt = setInterval(() => {
      try {
        setOffline(engine.getOfflineMode());
        setQueueCount(engine.listQueue().length);
      } catch {}
    }, 2000);

    // Listen for AI status changes
    const statusCallback = () => updateStatus();
    aiService.onOnlineStatusChange(statusCallback);

    return () => {
      clearInterval(interval);
      clearInterval(qInt as any);
      aiService.offOnlineStatusChange(statusCallback);
    };
  }, [aiService, confidenceScoring, selfFixingSystem, onStatusChange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Force reinitialize AI service
      await aiService.initialize();

      // Update status immediately
      const onlineStatus = aiService.getOnlineStatus();
      const confidenceMetrics = aiService.getConfidenceMetrics();

      setStatus(prev => ({
        ...prev,
        isOnline: onlineStatus.isOnline,
        status: onlineStatus.status,
        lastPing: onlineStatus.lastPing,
        confidence: confidenceMetrics.average,
        lastError: undefined
      }));
    } catch (error) {
      console.error('Error refreshing AI status:', error);
      setStatus(prev => ({
        ...prev,
        lastError: error.message || 'Refresh failed'
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = () => {
    if (isRefreshing) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }

    if (!status.isInitialized) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }

    if (status.isOnline) {
      return <Wifi className="h-4 w-4 text-green-500" />;
    }

    if (status.lastError) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }

    return <WifiOff className="h-4 w-4 text-orange-500" />;
  };

  const getStatusColor = () => {
    if (status.fallbackActive) return 'bg-amber-900 text-amber-300 border-amber-600';
    if (status.isOnline) return 'bg-green-900 text-green-300 border-green-600';
    if (status.lastError) return 'bg-red-900 text-red-300 border-red-600';
    if (!status.isInitialized) return 'bg-yellow-900 text-yellow-300 border-yellow-600';
    return 'bg-orange-900 text-orange-300 border-orange-600';
  };

  const getStatusText = () => {
    if (isRefreshing) return 'Refreshing...';
    if (!status.isInitialized) return 'Initializing...';
    if (status.fallbackActive) return 'Backup';
    if (status.isOnline) return 'Online';
    if (status.lastError) return 'Error';
    return 'Offline';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <Badge variant="outline" className={getStatusColor()}>
          {getStatusText()}
        </Badge>
        {status.isOnline && status.lastPing > 0 && (
          <span className="text-xs text-gray-500">
            {status.lastPing}ms
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            AI Service Status
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm">Connection</span>
          </div>
          <Badge variant="outline" className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>

        {/* Response Time */}
        {status.isOnline && status.lastPing > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Response Time</span>
            <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-600">
              {status.lastPing}ms
            </Badge>
          </div>
        )}

        {/* Active Endpoint */}
        {status.endpoint && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Active Endpoint</span>
            <Badge variant="outline" className="bg-purple-900 text-purple-300 border-purple-600 max-w-[60%] truncate">
              {status.endpoint}
            </Badge>
          </div>
        )}

        {/* Model */}
        {status.model && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Model</span>
            <Badge variant="outline" className="bg-cyan-900 text-cyan-300 border-cyan-600">
              {status.model}
            </Badge>
          </div>
        )}

        {/* Offline Mode and Queue */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Offline Mode</span>
          <Badge variant="outline" className={offline ? 'bg-amber-900 text-amber-300 border-amber-600' : 'bg-gray-900 text-gray-300 border-gray-600'}>
            {offline ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Queued Tasks</span>
          <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
            {queueCount}
          </Badge>
        </div>

        {/* Fallback Indicator */}
        {status.fallbackActive && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Fallback</span>
            <Badge variant="outline" className="bg-amber-900 text-amber-300 border-amber-600">
              Backup (gpt2)
            </Badge>
          </div>
        )}

        {/* Confidence Score */}
        {status.confidence > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>AI Confidence</span>
              <span>{(status.confidence * 100).toFixed(0)}%</span>
            </div>
            <Progress value={status.confidence * 100} className="h-2" />
          </div>
        )}

        {/* Self-Fixing Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">Self-Fixing</span>
          </div>
          <Badge
            variant="outline"
            className={status.selfFixingActive
              ? "bg-green-900 text-green-300 border-green-600"
              : "bg-gray-900 text-gray-300 border-gray-600"
            }
          >
            {status.selfFixingActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Error Count */}
        {status.errorCount > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm">Recent Errors</span>
            </div>
            <Badge variant="destructive">
              {status.errorCount}
            </Badge>
          </div>
        )}

        {/* Last Error */}
        {status.lastError && (
          <div className="p-2 bg-red-900/20 border border-red-600/30 rounded text-xs text-red-300">
            <div className="font-medium">Last Error:</div>
            <div className="mt-1 opacity-80">{status.lastError}</div>
          </div>
        )}

        {/* Quick Actions */}
        {showDetails && (
          <div className="pt-3 border-t border-slate-600">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (status.selfFixingActive) {
                    selfFixingSystem.stopLoopMode();
                  } else {
                    selfFixingSystem.startLoopMode();
                  }
                }}
                className="bg-slate-700 border-slate-600 text-white"
              >
                <Zap className="h-3 w-3 mr-1" />
                {status.selfFixingActive ? 'Stop' : 'Start'} Fix
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-slate-700 border-slate-600 text-white"
              >
                <Activity className="h-3 w-3 mr-1" />
                Test Connection
              </Button>
            </div>
          </div>
        )}

        {/* Offline Mode Info */}
        {!status.isOnline && (
          <div className="p-2 bg-orange-900/20 border border-orange-600/30 rounded text-xs text-orange-300">
            <div className="font-medium">Offline Mode Active</div>
            <div className="mt-1 opacity-80">
              Limited functionality available. The system will automatically reconnect when the AI service becomes available.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIStatusDisplay;
