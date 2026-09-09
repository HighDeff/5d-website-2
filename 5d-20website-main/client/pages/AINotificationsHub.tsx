import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Filter,
  Search,
  Trash2,
  RefreshCw,
  Brain,
  Zap,
  Shield,
  Wrench,
  BookOpen
} from "lucide-react";
import EnhancedAIAutoFixService from "@/services/EnhancedAIAutoFixService";
import EnhancedAIKnowledgeDatabase from "@/services/EnhancedAIKnowledgeDatabase";
import RealAIAutoFixAlerts from "@/components/RealAIAutoFixAlerts";

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  source: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const AutoFixDashboard = () => {
  const [autoFixService] = useState(() => EnhancedAIAutoFixService.getInstance());
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [fixHistory, setFixHistory] = useState([]);

  useEffect(() => {
    autoFixService.startMonitoring();

    const interval = setInterval(() => {
      setIssues(autoFixService.getDetectedIssues());
      setStats(autoFixService.getStatistics());
      setFixHistory(autoFixService.getFixHistory());
    }, 2000);

    return () => {
      clearInterval(interval);
      autoFixService.stopMonitoring();
    };
  }, [autoFixService]);

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-green-400" />
            Enhanced Auto-Fix System
          </CardTitle>
          <CardDescription>
            Automatic issue detection and resolution with 16 fix methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">Current Issues</h4>
              <div className="text-2xl font-bold text-blue-400">{issues.length}</div>
              <p className="text-xs text-slate-400">Active problems</p>
            </div>
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">Success Rate</h4>
              <div className="text-2xl font-bold text-green-400">{stats?.successRate?.toFixed(1) || 0}%</div>
              <p className="text-xs text-slate-400">Fix success rate</p>
            </div>
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-2">Total Fixes</h4>
              <div className="text-2xl font-bold text-purple-400">{stats?.totalFixes || 0}</div>
              <p className="text-xs text-slate-400">Applied fixes</p>
            </div>
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-400 mb-2">Critical Issues</h4>
              <div className="text-2xl font-bold text-yellow-400">{stats?.criticalIssues || 0}</div>
              <p className="text-xs text-slate-400">Needs attention</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-white">Recent Issues</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {issues.slice(0, 5).map((issue: any) => (
                  <div key={issue.id} className="bg-slate-900 border border-slate-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{issue.type}</span>
                      <Badge variant="outline" className={
                        issue.severity === 'critical' ? 'bg-red-900 text-red-300 border-red-600' :
                        issue.severity === 'high' ? 'bg-orange-900 text-orange-300 border-orange-600' :
                        issue.severity === 'medium' ? 'bg-yellow-900 text-yellow-300 border-yellow-600' :
                        'bg-blue-900 text-blue-300 border-blue-600'
                      }>
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{issue.description}</p>
                    {issue.autoFixable && (
                      <Button
                        size="sm"
                        onClick={() => autoFixService.autoFixIssue(issue)}
                        className="mt-2 bg-green-600 hover:bg-green-700"
                      >
                        Auto-Fix
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-white">Fix History</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {fixHistory.slice(-5).map((fix: any, index) => (
                  <div key={index} className="bg-slate-900 border border-slate-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{fix.result.methodUsed}</span>
                      <Badge variant="outline" className={
                        fix.result.success
                          ? 'bg-green-900 text-green-300 border-green-600'
                          : 'bg-red-900 text-red-300 border-red-600'
                      }>
                        {fix.result.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{fix.issue.description}</p>
                    <p className="text-xs text-slate-500">
                      {fix.timestamp.toLocaleTimeString()} • {fix.result.executionTime}ms
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const KnowledgeDashboard = () => {
  const [knowledgeDB] = useState(() => EnhancedAIKnowledgeDatabase.getInstance());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    setStats(knowledgeDB.getStatistics());
    setRecommendations(knowledgeDB.getRecommendations(['canvas', 'ai', 'fix'], 5));
  }, [knowledgeDB]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = knowledgeDB.searchKnowledge(searchQuery);
      setSearchResults(results);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            AI Knowledge Database
          </CardTitle>
          <CardDescription>
            Enhanced knowledge base with auto-learning and pattern recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">Total Entries</h4>
              <div className="text-2xl font-bold text-blue-400">{stats?.totalEntries || 0}</div>
              <p className="text-xs text-slate-400">Knowledge items</p>
            </div>
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">Effectiveness</h4>
              <div className="text-2xl font-bold text-green-400">{stats?.averageEffectiveness?.toFixed(1) || 0}%</div>
              <p className="text-xs text-slate-400">Average effectiveness</p>
            </div>
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-2">Patterns</h4>
              <div className="text-2xl font-bold text-purple-400">{stats?.learningPatterns || 0}</div>
              <p className="text-xs text-slate-400">Learning patterns</p>
            </div>
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-400 mb-2">Interactions</h4>
              <div className="text-2xl font-bold text-yellow-400">{stats?.userInteractions || 0}</div>
              <p className="text-xs text-slate-400">User interactions</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge base..."
                className="bg-slate-700 border-slate-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-white">Recommended Knowledge</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recommendations.map((entry: any) => (
                  <div key={entry.id} className="bg-slate-900 border border-slate-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{entry.title}</span>
                      <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-600">
                        {entry.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{entry.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">Effectiveness: {entry.effectiveness}%</span>
                      <span className="text-xs text-slate-500">Used: {entry.usageCount} times</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-white">Search Results</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No search results</p>
                    <p className="text-xs">Try searching for commands, solutions, or patterns</p>
                  </div>
                ) : (
                  searchResults.map((entry: any) => (
                    <div key={entry.id} className="bg-slate-900 border border-slate-600 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{entry.title}</span>
                        <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                          {entry.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{entry.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-slate-700 text-slate-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AINotificationsHub = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'error',
        title: 'Canvas Anomaly Detected',
        message: 'Spiral pattern detected in main canvas. Auto-correction applied.',
        timestamp: new Date(Date.now() - 300000),
        source: 'Canvas Monitor',
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'success',
        title: 'AI System Recovery',
        message: 'All AI systems have been successfully restored and are operating normally.',
        timestamp: new Date(Date.now() - 600000),
        source: 'System Monitor',
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Memory Usage Alert',
        message: 'System memory usage has reached 85%. Consider clearing cache.',
        timestamp: new Date(Date.now() - 900000),
        source: 'Performance Monitor',
        read: true,
        priority: 'medium'
      },
      {
        id: '4',
        type: 'info',
        title: 'New AI Feature Available',
        message: 'Enhanced consciousness system is now active and monitoring user interactions.',
        timestamp: new Date(Date.now() - 1200000),
        source: 'Feature Updates',
        read: true,
        priority: 'low'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-900 text-red-300 border-red-600';
      case 'high': return 'bg-orange-900 text-orange-300 border-orange-600';
      case 'medium': return 'bg-yellow-900 text-yellow-300 border-yellow-600';
      default: return 'bg-blue-900 text-blue-300 border-blue-600';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read) ||
      notification.type === filter;

    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.source.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Bell className="h-10 w-10 text-purple-400" />
            AI Notifications Hub
          </h1>
          <p className="text-slate-300">Monitor all AI system notifications and alerts</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-800 text-xs">
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="ai-alerts" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              <span className="hidden sm:inline">AI Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="system-status" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span className="hidden sm:inline">Status</span>
            </TabsTrigger>
            <TabsTrigger value="auto-fix" className="flex items-center gap-1">
              <Wrench className="h-3 w-3" />
              <span className="hidden sm:inline">Auto-Fix</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span className="hidden sm:inline">Knowledge</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Notifications</CardTitle>
                    <CardDescription>
                      {notifications.filter(n => !n.read).length} unread notifications
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                      Mark All Read
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Filter */}
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                      >
                        All
                      </Button>
                      <Button
                        variant={filter === 'unread' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('unread')}
                      >
                        Unread
                      </Button>
                      <Button
                        variant={filter === 'error' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('error')}
                      >
                        Errors
                      </Button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-all hover:bg-slate-700 ${
                          notification.read
                            ? 'bg-slate-800 border-slate-600'
                            : 'bg-slate-700 border-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getTypeIcon(notification.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-semibold ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                                  {notification.title}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getPriorityColor(notification.priority)}`}
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-300 mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-400">
                                <span>{notification.source}</span>
                                <span>{notification.timestamp.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark Read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  Real AI Auto-Fix Alerts
                </CardTitle>
                <CardDescription>Live system alerts and automatic fixes in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <RealAIAutoFixAlerts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-alerts" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>AI System Alerts</CardTitle>
                <CardDescription>Real-time alerts from AI monitoring systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-400">Active Monitoring</h4>
                    <div className="space-y-3">
                      <div className="bg-slate-900 border border-slate-600 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Canvas Monitor</span>
                          <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                            Active
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">Monitoring canvas anomalies and patterns</p>
                      </div>

                      <div className="bg-slate-900 border border-slate-600 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">AI Consciousness</span>
                          <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-600">
                            Learning
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">Monitoring user interactions and building awareness</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-purple-400">Recent AI Events</h4>
                    <div className="space-y-3">
                      <div className="bg-slate-900 border border-slate-600 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium">Pattern Recognition</span>
                        </div>
                        <p className="text-xs text-slate-400">New behavior pattern identified and catalogued</p>
                      </div>

                      <div className="bg-slate-900 border border-slate-600 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium">Auto-Fix Applied</span>
                        </div>
                        <p className="text-xs text-slate-400">System automatically corrected canvas anomaly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system-status" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>System Status Overview</CardTitle>
                <CardDescription>Real-time status of all AI systems and components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-green-400">Healthy Systems</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Canvas Engine</span>
                        <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                          Online
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Monitoring</span>
                        <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                          Online
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Database Health</span>
                        <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                          Online
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-yellow-400">Warning Systems</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Memory Usage</span>
                        <Badge variant="outline" className="bg-yellow-900 text-yellow-300 border-yellow-600">
                          High
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>CPU Load</span>
                        <Badge variant="outline" className="bg-yellow-900 text-yellow-300 border-yellow-600">
                          Elevated
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-blue-400">Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Response Time</span>
                        <span className="text-blue-400">45ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime</span>
                        <span className="text-green-400">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Error Rate</span>
                        <span className="text-green-400">0.02%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auto-fix" className="space-y-6">
            <AutoFixDashboard />
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <KnowledgeDashboard />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
                <CardDescription>Security-related notifications and system access logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-red-400">Security Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>System Integrity</span>
                        <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                          Secure
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Access Controls</span>
                        <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                          Active
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Protection</span>
                        <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                          Enabled
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure notification preferences and alert levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Alert Preferences</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Enable Real-time Notifications
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Configure Alert Thresholds
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Set Notification Channels
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">System Configuration</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Auto-dismiss Settings
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Priority Level Rules
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Export Notification History
                        </Button>
                      </div>
                    </div>
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

export default AINotificationsHub;
