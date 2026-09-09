import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  MessageSquare,
  Share2,
  Crown,
  UserPlus,
  Settings,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Hand,
  Zap,
  Brain,
  Palette,
  Activity,
  Clock,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Copy
} from 'lucide-react';

interface CollaborativeUser {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  isOnline: boolean;
  lastActive: Date;
  cursor: { x: number; y: number } | null;
  selectedTool: string;
  isVoiceConnected: boolean;
  isVideoConnected: boolean;
  permissions: string[];
}

interface CanvasSession {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  participants: number;
  isPublic: boolean;
  hasPassword: boolean;
  aiAssistanceLevel: 'none' | 'basic' | 'advanced' | 'autonomous';
  status: 'active' | 'paused' | 'archived';
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'canvas_action' | 'ai_suggestion' | 'system';
  metadata?: any;
}

const AICanvasCollaborationHub: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<CanvasSession | null>(null);
  const [collaborators, setCollaborators] = useState<CollaborativeUser[]>([
    {
      id: 'user1',
      name: 'Alice Chen',
      role: 'owner',
      isOnline: true,
      lastActive: new Date(),
      cursor: { x: 150, y: 200 },
      selectedTool: 'particle',
      isVoiceConnected: true,
      isVideoConnected: false,
      permissions: ['edit', 'invite', 'admin']
    },
    {
      id: 'user2',
      name: 'Bob Smith',
      role: 'editor',
      isOnline: true,
      lastActive: new Date(Date.now() - 30000),
      cursor: { x: 300, y: 150 },
      selectedTool: 'wave',
      isVoiceConnected: false,
      isVideoConnected: true,
      permissions: ['edit', 'comment']
    },
    {
      id: 'ai1',
      name: 'Canvas AI Assistant',
      role: 'admin',
      isOnline: true,
      lastActive: new Date(),
      cursor: null,
      selectedTool: 'auto-optimize',
      isVoiceConnected: false,
      isVideoConnected: false,
      permissions: ['edit', 'suggest', 'analyze']
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg1',
      userId: 'ai1',
      username: 'Canvas AI',
      message: 'I detected some interesting particle interactions. Should I optimize the physics?',
      timestamp: new Date(Date.now() - 120000),
      type: 'ai_suggestion'
    },
    {
      id: 'msg2',
      userId: 'user1',
      username: 'Alice Chen',
      message: 'Yes, please apply the optimization',
      timestamp: new Date(Date.now() - 90000),
      type: 'text'
    },
    {
      id: 'msg3',
      userId: 'ai1',
      username: 'Canvas AI',
      message: 'Applied physics optimization. Performance improved by 23%.',
      timestamp: new Date(Date.now() - 60000),
      type: 'canvas_action',
      metadata: { action: 'optimize_physics', improvement: 23 }
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [sessionSettings, setSessionSettings] = useState({
    isPublic: false,
    allowAnonymous: false,
    maxParticipants: 10,
    aiAssistanceLevel: 'advanced' as const,
    autoSave: true,
    shareLink: 'https://canvas.app/session/abc123'
  });

  const [activeTab, setActiveTab] = useState<'collaborators' | 'chat' | 'sessions' | 'settings'>('collaborators');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: `msg_${Date.now()}`,
        userId: 'current_user',
        username: 'You',
        message: newMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate AI response
      setTimeout(() => {
        if (newMessage.toLowerCase().includes('help') || newMessage.toLowerCase().includes('suggestion')) {
          const aiResponse: ChatMessage = {
            id: `ai_${Date.now()}`,
            userId: 'ai1',
            username: 'Canvas AI',
            message: 'I can help with canvas optimization, pattern analysis, or collaborative features. What would you like assistance with?',
            timestamp: new Date(),
            type: 'ai_suggestion'
          };
          setChatMessages(prev => [...prev, aiResponse]);
        }
      }, 1000);
    }
  };

  const inviteCollaborator = () => {
    // Implementation for inviting new collaborators
    console.log('Inviting collaborator...');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(sessionSettings.shareLink);
  };

  const getRoleColor = (role: CollaborativeUser['role']) => {
    switch (role) {
      case 'owner': return 'text-purple-400';
      case 'admin': return 'text-blue-400';
      case 'editor': return 'text-green-400';
      case 'viewer': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getRoleBadge = (role: CollaborativeUser['role']) => {
    const colors = {
      owner: 'bg-purple-600',
      admin: 'bg-blue-600',
      editor: 'bg-green-600',
      viewer: 'bg-gray-600'
    };
    return <Badge className={colors[role]}>{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            AI Canvas Collaboration Hub
          </CardTitle>
          <CardDescription>
            Real-time collaborative canvas with AI assistance and team communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Badge className="bg-green-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              Session Active
            </Badge>
            <Badge variant="outline">{collaborators.filter(c => c.isOnline).length} Online</Badge>
            <Button size="sm" onClick={inviteCollaborator} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite
            </Button>
            <Button size="sm" variant="outline" onClick={copyShareLink} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Share Link
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-700">
              <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="collaborators" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-slate-900 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-lg">Active Collaborators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {collaborators.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className={user.id.startsWith('ai') ? 'bg-purple-600' : 'bg-blue-600'}>
                                  {user.id.startsWith('ai') ? <Brain className="h-4 w-4" /> : user.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              {user.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{user.name}</span>
                                {getRoleBadge(user.role)}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Palette className="h-3 w-3" />
                                <span>{user.selectedTool}</span>
                                {user.cursor && (
                                  <>
                                    <span>•</span>
                                    <span>({user.cursor.x}, {user.cursor.y})</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {user.isVoiceConnected ? (
                              <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                                <Mic className="h-3 w-3" />
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-900 text-gray-400">
                                <MicOff className="h-3 w-3" />
                              </Badge>
                            )}
                            {user.isVideoConnected ? (
                              <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-600">
                                <Video className="h-3 w-3" />
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-900 text-gray-400">
                                <VideoOff className="h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-lg">Canvas Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-blue-900/30 rounded">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-400" />
                          <span className="text-sm">Alice created 15 particles</span>
                        </div>
                        <span className="text-xs text-slate-400">2m ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-900/30 rounded">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-400" />
                          <span className="text-sm">AI optimized physics engine</span>
                        </div>
                        <span className="text-xs text-slate-400">5m ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-purple-900/30 rounded">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-purple-400" />
                          <span className="text-sm">Bob added wave patterns</span>
                        </div>
                        <span className="text-xs text-slate-400">8m ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <Card className="bg-slate-900 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Team Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-800 rounded-lg">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex gap-3 ${msg.type === 'ai_suggestion' ? 'bg-blue-900/20 p-2 rounded' : ''}`}>
                          <Avatar className="h-6 w-6 mt-1">
                            <AvatarFallback className={msg.userId.startsWith('ai') ? 'bg-purple-600' : 'bg-blue-600'}>
                              {msg.userId.startsWith('ai') ? <Brain className="h-3 w-3" /> : msg.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{msg.username}</span>
                              <span className="text-xs text-slate-400">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {msg.type === 'ai_suggestion' && (
                                <Badge variant="outline" className="bg-purple-900 text-purple-300 border-purple-600 text-xs">
                                  AI
                                </Badge>
                              )}
                              {msg.type === 'canvas_action' && (
                                <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600 text-xs">
                                  Action
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-200">{msg.message}</p>
                            {msg.metadata && (
                              <div className="text-xs text-slate-400 mt-1">
                                Performance: +{msg.metadata.improvement}%
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-slate-900 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-lg">Current Session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Session ID</span>
                      <span className="font-mono text-blue-400">canvas_2024_001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Duration</span>
                      <span className="text-green-400">45 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Participants</span>
                      <span className="text-purple-400">{collaborators.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">AI Assistant</span>
                      <Badge className="bg-purple-600">Advanced</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Auto-save</span>
                      <Badge className="bg-green-600">Enabled</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-lg">Session Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Session
                    </Button>
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Import Canvas
                    </Button>
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Share Screen
                    </Button>
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Session History
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-slate-900 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-lg">Session Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Public Session</span>
                      <Button
                        size="sm"
                        variant={sessionSettings.isPublic ? "default" : "outline"}
                        onClick={() => setSessionSettings(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                      >
                        {sessionSettings.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Allow Anonymous</span>
                      <Button
                        size="sm"
                        variant={sessionSettings.allowAnonymous ? "default" : "outline"}
                        onClick={() => setSessionSettings(prev => ({ ...prev, allowAnonymous: !prev.allowAnonymous }))}
                      >
                        {sessionSettings.allowAnonymous ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Max Participants</label>
                      <Input
                        type="number"
                        value={sessionSettings.maxParticipants}
                        onChange={(e) => setSessionSettings(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                        min={1}
                        max={50}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">AI Assistance Level</label>
                      <select
                        value={sessionSettings.aiAssistanceLevel}
                        onChange={(e) => setSessionSettings(prev => ({ ...prev, aiAssistanceLevel: e.target.value as any }))}
                        className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-white"
                      >
                        <option value="none">None</option>
                        <option value="basic">Basic</option>
                        <option value="advanced">Advanced</option>
                        <option value="autonomous">Autonomous</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Auto-save</span>
                      <Button
                        size="sm"
                        variant={sessionSettings.autoSave ? "default" : "outline"}
                        onClick={() => setSessionSettings(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                      >
                        {sessionSettings.autoSave ? 'On' : 'Off'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICanvasCollaborationHub;
