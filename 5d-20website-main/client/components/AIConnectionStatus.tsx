import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import QuantumPassAIService from '@/services/QuantumPassAIService';

interface AIConnectionStatusProps {
  showDetails?: boolean;
  showPopover?: boolean;
  className?: string;
}

const AIConnectionStatus: React.FC<AIConnectionStatusProps> = ({
  showDetails = false,
  showPopover = true,
  className = ''
}) => {
  const [connectionStatus, setConnectionStatus] = useState({
    isOnline: false,
    status: 'connecting',
    lastPing: -1
  });
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);
  const [testHistory, setTestHistory] = useState<{ time: Date; success: boolean; responseTime: number }[]>([]);

  useEffect(() => {
    const aiService = QuantumPassAIService.getInstance();
    
    // Get initial status
    const initialStatus = aiService.getOnlineStatus();
    setConnectionStatus(initialStatus);

    // Subscribe to status changes
    const unsubscribe = aiService.onOnlineStatusChange((isOnline: boolean, status: string, lastPing: number) => {
      setConnectionStatus({ isOnline, status, lastPing });
    });

    // Initial connection test
    setTimeout(() => {
      testConnection();
    }, 1000);

    // Cleanup
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const testConnection = async () => {
    setIsTesting(true);
    const startTime = Date.now();
    
    try {
      const aiService = QuantumPassAIService.getInstance();
      const success = await aiService.forceConnectionTest();
      const responseTime = Date.now() - startTime;
      
      setLastTestTime(new Date());
      setTestHistory(prev => [
        { time: new Date(), success, responseTime },
        ...prev.slice(0, 4) // Keep last 5 tests
      ]);
      
      console.log(`🔍 AI Connection Test: ${success ? 'SUCCESS' : 'FAILED'} (${responseTime}ms)`);
    } catch (error) {
      console.error('Connection test error:', error);
      setTestHistory(prev => [
        { time: new Date(), success: false, responseTime: Date.now() - startTime },
        ...prev.slice(0, 4)
      ]);
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = () => {
    if (isTesting) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    
    switch (connectionStatus.status) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-400" />;
      case 'connecting':
        return <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'disconnected':
      case 'failed':
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
    }
  };

  const getStatusColor = () => {
    if (isTesting) return 'bg-blue-600';
    
    switch (connectionStatus.status) {
      case 'connected':
        return 'bg-green-600';
      case 'connecting':
        return 'bg-yellow-600';
      case 'disconnected':
      case 'failed':
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-orange-600';
    }
  };

  const getStatusText = () => {
    if (isTesting) return 'Testing...';
    
    switch (connectionStatus.status) {
      case 'connected':
        return 'AI Online';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'AI Offline';
      case 'failed':
        return 'Connection Failed';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const StatusBadge = () => (
    <Badge className={`${getStatusColor()} flex items-center gap-1 ${className}`}>
      {getStatusIcon()}
      <span className="text-white">{getStatusText()}</span>
    </Badge>
  );

  const StatusDetails = () => (
    <Card className="bg-slate-800 border-slate-700 w-80">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          AI Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Status:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-white">{getStatusText()}</span>
          </div>
        </div>

        {/* Last Ping */}
        {connectionStatus.lastPing > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Response Time:</span>
            <span className="text-white">{connectionStatus.lastPing}ms</span>
          </div>
        )}

        {/* Last Test */}
        {lastTestTime && (
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Last Test:</span>
            <span className="text-white text-sm">
              {lastTestTime.toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Test History */}
        {testHistory.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-300">Recent Tests:</div>
            <div className="space-y-1">
              {testHistory.map((test, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {test.success ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-400" />
                    )}
                    <span className="text-slate-400">
                      {test.time.toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="text-white">{test.responseTime}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 border-t border-slate-600 pt-4">
          <Button
            onClick={testConnection}
            disabled={isTesting}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isTesting ? 'animate-spin' : ''}`} />
            {isTesting ? 'Testing Connection...' : 'Test Connection'}
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={() => {
              // Navigate to AI Configuration
              window.location.href = '/canvas-control-center';
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure AI Settings
          </Button>
        </div>

        {/* Configuration Info */}
        <div className="bg-slate-900 rounded-lg p-3 space-y-1">
          <div className="text-xs text-slate-400">Current Configuration:</div>
          <div className="text-xs space-y-1">
            <div>
              <span className="text-slate-300">Endpoint: </span>
              <span className="text-blue-400 font-mono text-xs">
                {QuantumPassAIService.getInstance().getConfiguration().endpoint}
              </span>
            </div>
            <div>
              <span className="text-slate-300">Model: </span>
              <span className="text-green-400">
                {QuantumPassAIService.getInstance().getConfiguration().model}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (showDetails) {
    return <StatusDetails />;
  }

  if (showPopover) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="cursor-pointer">
            <StatusBadge />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 border-0">
          <StatusDetails />
        </PopoverContent>
      </Popover>
    );
  }

  return <StatusBadge />;
};

export default AIConnectionStatus;
