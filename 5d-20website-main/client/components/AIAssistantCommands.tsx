import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Terminal, 
  Play, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Plus,
  Settings,
  Code,
  Sparkles,
  Brain,
  Zap,
  Target,
  Activity
} from "lucide-react";

interface AICommand {
  id: string;
  name: string;
  description: string;
  command: string;
  parameters: string[];
  category: 'canvas' | 'database' | 'ui' | 'ai' | 'system' | 'custom';
  successRate: number;
  lastUsed: Date | null;
  isCustom: boolean;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'scheduled';
  executionTime?: number;
}

interface ScheduledTask {
  id: string;
  commandId: string;
  scheduledTime: Date;
  parameters: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

const AIAssistantCommands = () => {
  const [commands, setCommands] = useState<AICommand[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [newCommand, setNewCommand] = useState({
    name: '',
    description: '',
    command: '',
    parameters: '',
    category: 'custom' as AICommand['category']
  });
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [commandOutput, setCommandOutput] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Initialize with pre-built commands
    const prebuiltCommands: AICommand[] = [
      {
        id: 'fix-canvas-errors',
        name: 'Fix Canvas Errors',
        description: 'Automatically detect and fix canvas rendering issues',
        command: 'fix_canvas_errors',
        parameters: ['severity', 'auto_restart'],
        category: 'canvas',
        successRate: 89,
        lastUsed: new Date(Date.now() - 3600000),
        isCustom: false,
        status: 'idle'
      },
      {
        id: 'organize-homepage',
        name: 'Organize Homepage',
        description: 'Move canvases to tabs and organize layout',
        command: 'organize_homepage',
        parameters: ['layout_type', 'preserve_settings'],
        category: 'ui',
        successRate: 95,
        lastUsed: new Date(Date.now() - 7200000),
        isCustom: false,
        status: 'idle'
      },
      {
        id: 'detect-ai-entities',
        name: 'Detect AI Entities',
        description: 'Scan and visualize AI entities in 3D space',
        command: 'detect_ai_entities',
        parameters: ['scan_depth', 'visualization_mode'],
        category: 'ai',
        successRate: 78,
        lastUsed: null,
        isCustom: false,
        status: 'idle'
      },
      {
        id: 'auto-fix-database',
        name: 'Auto-Fix Database',
        description: 'Repair database connections and storage issues',
        command: 'auto_fix_database',
        parameters: ['repair_level', 'backup_first'],
        category: 'database',
        successRate: 92,
        lastUsed: new Date(Date.now() - 1800000),
        isCustom: false,
        status: 'idle'
      },
      {
        id: 'enhance-knowledge',
        name: 'Enhance Knowledge',
        description: 'Update AI knowledge base with new solutions',
        command: 'enhance_knowledge',
        parameters: ['learning_mode', 'data_sources'],
        category: 'ai',
        successRate: 85,
        lastUsed: new Date(Date.now() - 900000),
        isCustom: false,
        status: 'idle'
      }
    ];
    setCommands(prebuiltCommands);
  }, []);

  const executeCommand = async (commandId: string, parameters: Record<string, any> = {}) => {
    const command = commands.find(cmd => cmd.id === commandId);
    if (!command) return;

    setCommands(prev => prev.map(cmd => 
      cmd.id === commandId ? { ...cmd, status: 'running' } : cmd
    ));

    setCommandOutput(`Executing: ${command.name}\n`);
    setCommandOutput(prev => prev + `Command: ${command.command}\n`);
    setCommandOutput(prev => prev + `Parameters: ${JSON.stringify(parameters)}\n\n`);

    try {
      // Simulate command execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate different outcomes based on command
      const success = Math.random() < (command.successRate / 100);
      
      if (success) {
        setCommandOutput(prev => prev + `✅ ${command.name} completed successfully!\n`);
        setCommandOutput(prev => prev + `Execution time: ${Math.floor(Math.random() * 3000 + 500)}ms\n`);
        
        setCommands(prev => prev.map(cmd => 
          cmd.id === commandId 
            ? { 
                ...cmd, 
                status: 'completed', 
                lastUsed: new Date(),
                executionTime: Math.floor(Math.random() * 3000 + 500)
              } 
            : cmd
        ));
      } else {
        setCommandOutput(prev => prev + `❌ ${command.name} failed to execute\n`);
        setCommandOutput(prev => prev + `Error: Simulated failure for testing\n`);
        
        setCommands(prev => prev.map(cmd => 
          cmd.id === commandId ? { ...cmd, status: 'failed' } : cmd
        ));
      }
    } catch (error) {
      setCommandOutput(prev => prev + `❌ Error: ${error}\n`);
      setCommands(prev => prev.map(cmd => 
        cmd.id === commandId ? { ...cmd, status: 'failed' } : cmd
      ));
    }
  };

  const scheduleCommand = (commandId: string, delay: number) => {
    const scheduledTime = new Date(Date.now() + delay * 1000);
    const newTask: ScheduledTask = {
      id: `task-${Date.now()}`,
      commandId,
      scheduledTime,
      parameters: {},
      status: 'pending'
    };
    
    setScheduledTasks(prev => [...prev, newTask]);
    setCommandOutput(prev => prev + `📅 Command scheduled for ${scheduledTime.toLocaleTimeString()}\n`);
  };

  const createCustomCommand = () => {
    if (!newCommand.name || !newCommand.command) return;

    const customCommand: AICommand = {
      id: `custom-${Date.now()}`,
      name: newCommand.name,
      description: newCommand.description,
      command: newCommand.command,
      parameters: newCommand.parameters.split(',').map(p => p.trim()).filter(Boolean),
      category: newCommand.category,
      successRate: 0,
      lastUsed: null,
      isCustom: true,
      status: 'idle'
    };

    setCommands(prev => [...prev, customCommand]);
    setNewCommand({ name: '', description: '', command: '', parameters: '', category: 'custom' });
    setIsCreating(false);
    setCommandOutput(prev => prev + `✨ Created custom command: ${customCommand.name}\n`);
  };

  const getCategoryIcon = (category: AICommand['category']) => {
    switch (category) {
      case 'canvas': return <Activity className="h-4 w-4" />;
      case 'database': return <Target className="h-4 w-4" />;
      case 'ui': return <Sparkles className="h-4 w-4" />;
      case 'ai': return <Brain className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: AICommand['status']) => {
    switch (status) {
      case 'running': return 'bg-blue-900 text-blue-300 border-blue-600';
      case 'completed': return 'bg-green-900 text-green-300 border-green-600';
      case 'failed': return 'bg-red-900 text-red-300 border-red-600';
      case 'scheduled': return 'bg-yellow-900 text-yellow-300 border-yellow-600';
      default: return 'bg-gray-900 text-gray-300 border-gray-600';
    }
  };

  const filteredCommands = (category?: string) => {
    if (!category) return commands;
    return commands.filter(cmd => cmd.category === category);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Terminal className="h-6 w-6 text-blue-400" />
            AI Assistant Commands
          </CardTitle>
          <CardDescription className="text-slate-300">
            Create, schedule, and execute AI commands with preview and tracking
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="commands" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="commands" className="text-white">Commands</TabsTrigger>
              <TabsTrigger value="scheduled" className="text-white">Scheduled</TabsTrigger>
              <TabsTrigger value="create" className="text-white">Create</TabsTrigger>
              <TabsTrigger value="output" className="text-white">Output</TabsTrigger>
            </TabsList>

            <TabsContent value="commands" className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={selectedCommand === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCommand(null)}
                  className="bg-slate-700 border-slate-600"
                >
                  All ({commands.length})
                </Button>
                {['canvas', 'database', 'ui', 'ai', 'system', 'custom'].map(category => (
                  <Button
                    key={category}
                    variant={selectedCommand === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCommand(category)}
                    className="bg-slate-700 border-slate-600"
                  >
                    {getCategoryIcon(category as AICommand['category'])}
                    <span className="ml-1 capitalize">{category}</span>
                    <Badge variant="outline" className="ml-2">
                      {filteredCommands(category).length}
                    </Badge>
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCommands(selectedCommand || undefined).map(command => (
                  <Card key={command.id} className="bg-slate-800 border-slate-600">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(command.category)}
                          <CardTitle className="text-sm text-white">{command.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className={getStatusColor(command.status)}>
                          {command.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-300 text-xs">
                        {command.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-xs text-slate-400">
                          <div className="flex justify-between">
                            <span>Success Rate:</span>
                            <span className="text-green-400">{command.successRate}%</span>
                          </div>
                          {command.lastUsed && (
                            <div className="flex justify-between">
                              <span>Last Used:</span>
                              <span>{command.lastUsed.toLocaleTimeString()}</span>
                            </div>
                          )}
                          {command.executionTime && (
                            <div className="flex justify-between">
                              <span>Exec Time:</span>
                              <span>{command.executionTime}ms</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => executeCommand(command.id)}
                            disabled={command.status === 'running'}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Execute
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => scheduleCommand(command.id, 10)}
                            className="bg-slate-700 border-slate-600"
                          >
                            <Clock className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {command.parameters.length > 0 && (
                          <div className="text-xs text-slate-400">
                            <span>Parameters: </span>
                            <span className="text-slate-300">{command.parameters.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              {scheduledTasks.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No scheduled tasks</p>
                  <p className="text-xs">Schedule commands for automated execution</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledTasks.map(task => {
                    const command = commands.find(cmd => cmd.id === task.commandId);
                    return (
                      <Card key={task.id} className="bg-slate-800 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium">{command?.name}</h4>
                              <p className="text-slate-400 text-sm">
                                Scheduled for {task.scheduledTime.toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="outline" className={getStatusColor(task.status as any)}>
                              {task.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Custom Command
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Build custom AI commands with parameters and execution logic
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">Command Name</label>
                      <Input
                        value={newCommand.name}
                        onChange={(e) => setNewCommand(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Fix Navigation Issues"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">Category</label>
                      <select
                        value={newCommand.category}
                        onChange={(e) => setNewCommand(prev => ({ ...prev, category: e.target.value as AICommand['category'] }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      >
                        <option value="custom">Custom</option>
                        <option value="canvas">Canvas</option>
                        <option value="database">Database</option>
                        <option value="ui">UI</option>
                        <option value="ai">AI</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Description</label>
                    <Textarea
                      value={newCommand.description}
                      onChange={(e) => setNewCommand(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this command does..."
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Command</label>
                    <Input
                      value={newCommand.command}
                      onChange={(e) => setNewCommand(prev => ({ ...prev, command: e.target.value }))}
                      placeholder="e.g., fix_navigation_links"
                      className="bg-slate-700 border-slate-600 text-white font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Parameters (comma-separated)</label>
                    <Input
                      value={newCommand.parameters}
                      onChange={(e) => setNewCommand(prev => ({ ...prev, parameters: e.target.value }))}
                      placeholder="e.g., severity, auto_restart, backup_first"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <Button
                    onClick={createCustomCommand}
                    disabled={!newCommand.name || !newCommand.command}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Command
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="output" className="space-y-4">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Command Output
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCommandOutput('')}
                      className="bg-slate-700 border-slate-600"
                    >
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                      {commandOutput || 'No command output yet. Execute a command to see results here.'}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantCommands;
