/**
 * Comprehensive Database Monitoring Page
 * Shows all files, AI movements, data transfers, and real-time activity
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Activity, 
  FileText, 
  Bot, 
  Eye, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Server,
  HardDrive,
  Network,
  Zap,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react';

interface DatabaseFile {
  id: string;
  name: string;
  type: string;
  size: number;
  location: string;
  lastModified: Date;
  accessedBy: string[];
  status: 'active' | 'archived' | 'processing' | 'error';
}

interface AIActivity {
  id: string;
  aiName: string;
  action: 'enter' | 'leave' | 'store' | 'retrieve' | 'process' | 'communicate';
  target: string;
  data: any;
  timestamp: Date;
  status: 'success' | 'pending' | 'error';
  intention: string;
}

interface DatabaseStats {
  totalFiles: number;
  totalSize: number;
  activeAIs: number;
  operations: number;
  errors: number;
  uptime: number;
}

const DatabaseMonitor: React.FC = () => {
  const [files, setFiles] = useState<DatabaseFile[]>([]);
  const [activities, setActivities] = useState<AIActivity[]>([]);
  const [stats, setStats] = useState<DatabaseStats>({
    totalFiles: 0,
    totalSize: 0,
    activeAIs: 0,
    operations: 0,
    errors: 0,
    uptime: 0
  });
  
  const [activeTab, setActiveTab] = useState<'files' | 'activity' | 'settings' | 'monitoring'>('files');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState<DatabaseFile | null>(null);
  const activitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeDatabaseMonitor();
    
    if (isLiveMode) {
      const interval = setInterval(() => {
        updateLiveData();
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  const initializeDatabaseMonitor = () => {
    console.log('🗄️ Initializing Database Monitor...');
    
    // Load existing files from various storage locations
    loadDatabaseFiles();
    
    // Setup AI activity monitoring
    setupAIActivityMonitoring();
    
    // Setup real-time notifications
    setupRealTimeNotifications();
    
    // Initialize central AI monitoring
    setupCentralAIMonitoring();
    
    console.log('✅ Database Monitor initialized');
  };

  const loadDatabaseFiles = () => {
    const allFiles: DatabaseFile[] = [];
    
    // Scan localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          allFiles.push({
            id: `ls-${i}`,
            name: key,
            type: key.includes('chunk') ? 'chunk' : key.includes('meta') ? 'metadata' : 'data',
            size: value.length,
            location: 'localStorage',
            lastModified: new Date(),
            accessedBy: ['system'],
            status: 'active'
          });
        }
      }
    }
    
    // Scan sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        if (value) {
          allFiles.push({
            id: `ss-${i}`,
            name: key,
            type: 'session-data',
            size: value.length,
            location: 'sessionStorage',
            lastModified: new Date(),
            accessedBy: ['session'],
            status: 'active'
          });
        }
      }
    }
    
    // Check memory storage
    if ((window as any).memoryStorage) {
      const memoryStorage = (window as any).memoryStorage as Map<string, any>;
      let index = 0;
      for (const [key, value] of memoryStorage) {
        allFiles.push({
          id: `mem-${index++}`,
          name: key,
          type: 'memory-data',
          size: JSON.stringify(value).length,
          location: 'memory',
          lastModified: new Date(),
          accessedBy: ['memory-fallback'],
          status: 'active'
        });
      }
    }
    
    setFiles(allFiles);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalFiles: allFiles.length,
      totalSize: allFiles.reduce((sum, file) => sum + file.size, 0)
    }));
  };

  const setupAIActivityMonitoring = () => {
    // Monitor AI activities from various sources
    const originalSetItem = Storage.prototype.setItem;
    const originalGetItem = Storage.prototype.getItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    
    Storage.prototype.setItem = function(key, value) {
      recordActivity('store', key, value, 'Unknown AI');
      return originalSetItem.call(this, key, value);
    };
    
    Storage.prototype.getItem = function(key) {
      const result = originalGetItem.call(this, key);
      recordActivity('retrieve', key, result, 'Unknown AI');
      return result;
    };
    
    Storage.prototype.removeItem = function(key) {
      recordActivity('process', key, null, 'System');
      return originalRemoveItem.call(this, key);
    };
  };

  const recordActivity = (action: AIActivity['action'], target: string, data: any, aiName: string) => {
    const activity: AIActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      aiName,
      action,
      target,
      data: data ? (typeof data === 'string' ? data.substring(0, 100) : JSON.stringify(data).substring(0, 100)) : null,
      timestamp: new Date(),
      status: 'success',
      intention: generateIntention(action, target)
    };
    
    setActivities(prev => [activity, ...prev.slice(0, 999)]); // Keep last 1000 activities
    
    // Update stats
    setStats(prev => ({
      ...prev,
      operations: prev.operations + 1
    }));
    
    // Show notification
    showNotification(activity);
  };

  const generateIntention = (action: string, target: string): string => {
    const intentions = {
      store: [
        `Storing ${target} for future retrieval`,
        `Persisting data to ensure reliability`,
        `Caching information for optimization`,
        `Backing up critical data`
      ],
      retrieve: [
        `Accessing ${target} for analysis`,
        `Loading data for processing`,
        `Fetching information for task execution`,
        `Reading stored configuration`
      ],
      process: [
        `Processing ${target} for cleanup`,
        `Analyzing data structure`,
        `Optimizing storage usage`,
        `Performing maintenance on ${target}`
      ],
      enter: [
        `Entering database to perform operations`,
        `Connecting to storage system`,
        `Initializing database session`
      ],
      leave: [
        `Exiting database after completion`,
        `Closing database connection`,
        `Finalizing storage operations`
      ],
      communicate: [
        `Sharing data with other AIs`,
        `Coordinating with central command`,
        `Broadcasting status update`
      ]
    };
    
    const actionIntentions = intentions[action] || ['Performing database operation'];
    return actionIntentions[Math.floor(Math.random() * actionIntentions.length)];
  };

  const setupRealTimeNotifications = () => {
    // Create notification system for live updates
    if (!document.getElementById('db-notifications')) {
      const notificationContainer = document.createElement('div');
      notificationContainer.id = 'db-notifications';
      notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 300px;
        pointer-events: none;
      `;
      document.body.appendChild(notificationContainer);
    }
  };

  const showNotification = (activity: AIActivity) => {
    const container = document.getElementById('db-notifications');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      border-left: 4px solid ${getActionColor(activity.action)};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      pointer-events: auto;
      font-size: 12px;
    `;
    
    notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px;">
        ${getActionIcon(activity.action)} ${activity.aiName}
      </div>
      <div style="opacity: 0.9;">
        ${activity.action.toUpperCase()}: ${activity.target}
      </div>
      <div style="opacity: 0.7; font-size: 10px; margin-top: 4px;">
        ${activity.intention}
      </div>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  };

  const getActionColor = (action: string): string => {
    const colors = {
      store: '#10b981',
      retrieve: '#3b82f6',
      process: '#f59e0b',
      enter: '#8b5cf6',
      leave: '#ef4444',
      communicate: '#06b6d4'
    };
    return colors[action] || '#6b7280';
  };

  const getActionIcon = (action: string): string => {
    const icons = {
      store: '💾',
      retrieve: '📖',
      process: '⚙️',
      enter: '🔓',
      leave: '🔒',
      communicate: '📡'
    };
    return icons[action] || '📄';
  };

  const setupCentralAIMonitoring = () => {
    // Monitor central AI activities
    if ((window as any).aiCentralCommand) {
      const central = (window as any).aiCentralCommand;
      
      // Override key methods to track activity
      const originalBroadcast = central.broadcastMessage;
      if (originalBroadcast) {
        central.broadcastMessage = function(message: any) {
          recordActivity('communicate', 'broadcast-message', message, 'Central AI');
          return originalBroadcast.call(this, message);
        };
      }
    }
    
    // Monitor individual AI agents
    if ((window as any).advancedAINetwork) {
      const network = (window as any).advancedAINetwork;
      
      network.agents?.forEach((agent: any) => {
        // Track when AIs enter/leave tasks
        const originalExecuteTask = agent.executeTask;
        if (originalExecuteTask) {
          agent.executeTask = async function(taskId: string) {
            recordActivity('enter', `task-${taskId}`, { taskId }, agent.name || 'AI Agent');
            const result = await originalExecuteTask.call(this, taskId);
            recordActivity('leave', `task-${taskId}`, result, agent.name || 'AI Agent');
            return result;
          };
        }
      });
    }
  };

  const updateLiveData = () => {
    // Update statistics
    setStats(prev => ({
      ...prev,
      uptime: prev.uptime + 1,
      activeAIs: getActiveAICount()
    }));
    
    // Refresh file list if needed
    const currentFileCount = localStorage.length + sessionStorage.length;
    if (currentFileCount !== files.filter(f => f.location !== 'memory').length) {
      loadDatabaseFiles();
    }
  };

  const getActiveAICount = (): number => {
    let count = 0;
    
    if ((window as any).advancedAINetwork?.agents) {
      count += Array.from((window as any).advancedAINetwork.agents.values())
        .filter((agent: any) => agent.consciousness?.isActive).length;
    }
    
    if ((window as any).canvasEntityManager?.entities) {
      count += (window as any).canvasEntityManager.entities.length;
    }
    
    return count;
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType || file.location === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.aiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.intention.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Database Monitor</h1>
                <p className="text-gray-600">Real-time database activity and AI monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant={isLiveMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsLiveMode(!isLiveMode)}
                className="flex items-center space-x-2"
              >
                {isLiveMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isLiveMode ? 'Live' : 'Paused'}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadDatabaseFiles()}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Files</p>
                    <p className="text-xl font-bold">{stats.totalFiles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="text-xl font-bold">{formatFileSize(stats.totalSize)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active AIs</p>
                    <p className="text-xl font-bold">{stats.activeAIs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Operations</p>
                    <p className="text-xl font-bold">{stats.operations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Errors</p>
                    <p className="text-xl font-bold">{stats.errors}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Uptime</p>
                    <p className="text-lg font-bold">{formatUptime(stats.uptime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 border-b">
          {[
            { id: 'files', label: 'Database Files', icon: FileText },
            { id: 'activity', label: 'Live Activity', icon: Activity },
            { id: 'settings', label: 'AI Settings', icon: Settings },
            { id: 'monitoring', label: 'Field Monitor', icon: Eye }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'activity' && (
                <Badge variant="secondary" className="ml-2">
                  {activities.length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files, activities, or AIs..."
                className="pl-10"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Types</option>
            <option value="localStorage">Local Storage</option>
            <option value="sessionStorage">Session Storage</option>
            <option value="memory">Memory Storage</option>
            <option value="chunk">Chunks</option>
            <option value="metadata">Metadata</option>
          </select>
        </div>

        {/* Tab Content */}
        {activeTab === 'files' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Files List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Database Files ({filteredFiles.length})</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredFiles.map(file => (
                      <div
                        key={file.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedFile?.id === file.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="font-medium truncate">{file.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {file.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{file.location}</span>
                              <span>{file.lastModified.toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={file.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {file.status}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* File Details */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>File Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">{selectedFile.name}</h4>
                        <p className="text-sm text-gray-600">{selectedFile.type}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Size:</span>
                          <span>{formatFileSize(selectedFile.size)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Location:</span>
                          <span>{selectedFile.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Status:</span>
                          <Badge variant="outline">{selectedFile.status}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Modified:</span>
                          <span>{selectedFile.lastModified.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Accessed By:</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedFile.accessedBy.map((accessor, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {accessor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Select a file to view details
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live AI Activity Stream</span>
                <div className="flex items-center space-x-2">
                  {isLiveMode && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Live</span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActivities([])}
                  >
                    Clear
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={activitiesRef}
                className="space-y-2 max-h-96 overflow-y-auto"
              >
                {filteredActivities.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No activities recorded yet. Enable live mode to see real-time data.
                  </p>
                ) : (
                  filteredActivities.map(activity => (
                    <div
                      key={activity.id}
                      className="p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span style={{ color: getActionColor(activity.action) }}>
                              {getActionIcon(activity.action)}
                            </span>
                            <span className="font-medium">{activity.aiName}</span>
                            <Badge variant="outline" className="text-xs">
                              {activity.action}
                            </Badge>
                            <Badge
                              variant={activity.status === 'success' ? 'default' : activity.status === 'error' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            Target: {activity.target}
                          </p>
                          
                          <p className="text-xs text-gray-500 italic">
                            {activity.intention}
                          </p>
                          
                          {activity.data && (
                            <details className="mt-2">
                              <summary className="text-xs text-blue-600 cursor-pointer">
                                Show data
                              </summary>
                              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                                {activity.data}
                              </pre>
                            </details>
                          )}
                        </div>
                        
                        <span className="text-xs text-gray-400">
                          {activity.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Main AI Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Auto-Fix System</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Knowledge Database</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Canvas Monitoring</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Wave Communication</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sub AI Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Entity Tracking</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Relationships</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Real-time Updates</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Error Recovery</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <Card>
            <CardHeader>
              <CardTitle>Field Interaction Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">5D Field Interactions</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Neural Network AI</span>
                        <Badge variant="default">Strong Field</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Generating wave patterns around data nodes
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Decision Tree AI</span>
                        <Badge variant="secondary">Weak Field</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Processing data with minimal field disturbance
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Data Flow Patterns</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="w-4 h-4 text-green-600" />
                        <span>Inbound: 1.2 MB/s</span>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-2">
                        <ArrowLeft className="w-4 h-4 text-blue-600" />
                        <span>Outbound: 0.8 MB/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DatabaseMonitor;
