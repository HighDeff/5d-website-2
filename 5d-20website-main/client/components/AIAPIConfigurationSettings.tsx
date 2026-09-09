import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Settings,
  Globe,
  Key,
  Brain,
  Zap,
  TestTube,
  Save,
  RotateCcw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  Copy,
  ExternalLink
} from 'lucide-react';
import QuantumPassAIService from '@/services/QuantumPassAIService';

interface AIAPIConfig {
  // Main API Settings
  endpoint: string;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
  timeout: number;

  // Advanced Settings
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];

  // Connection Settings
  retryAttempts: number;
  retryDelay: number;
  maxConcurrentRequests: number;
  rateLimitPerMinute: number;

  // Custom Headers
  customHeaders: { [key: string]: string };

  // Provider-specific settings
  provider: 'ollama' | 'openai' | 'anthropic' | 'custom' | 'backup' | 'torch';
  baseURL: string;
}

const defaultConfig: AIAPIConfig = {
  endpoint: '/api/ai/chat',
  model: 'gpt2',
  apiKey: '',
  temperature: 0.7,
  maxTokens: 4000,
  contextWindow: 10000,
  timeout: 300000,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stopSequences: [],
  retryAttempts: 3,
  retryDelay: 1000,
  maxConcurrentRequests: 5,
  rateLimitPerMinute: 60,
  customHeaders: {},
  provider: 'custom',
  baseURL: ''
};

const predefinedModels = {
  ollama: [
    'qwen2.5vl:7b',
    'llama3.2:latest',
    'llama3.1:8b',
    'codellama:7b',
    'mistral:7b',
    'phi3:latest',
    'gemma2:2b',
    'qwen2:1.5b'
  ],
  openai: [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
    'gpt-4',
    'text-davinci-003'
  ],
  anthropic: [
    'claude-3-5-sonnet-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307'
  ],
  backup: ['gpt2'],
  torch: ['torch-qa']
};

const predefinedEndpoints = {
  ollama: 'https://remote.quantumpass.io/ollama',
  openai: 'https://api.openai.com/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  backup: '/api/ai/chat',
  torch: '/api/ai/chat',
  custom: '/api/ai/chat'
};

const AIAPIConfigurationSettings: React.FC = () => {
  const [config, setConfig] = useState<AIAPIConfig>(defaultConfig);
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'connection' | 'test'>('basic');
  const [testPrompt, setTestPrompt] = useState<string>('Summarize QuantumPass features in one short paragraph.');
  const [testOutput, setTestOutput] = useState<string>('');
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Load saved configuration
    loadConfiguration();
    checkConnection();
  }, []);

  const loadConfiguration = () => {
    try {
      const saved = localStorage.getItem('ai_api_config');
      if (saved && saved.trim() !== '') {
        const parsedConfig = JSON.parse(saved);
        if (typeof parsedConfig === 'object' && parsedConfig !== null) {
          setConfig({ ...defaultConfig, ...parsedConfig });
        } else {
          console.warn('Invalid configuration format in localStorage, using defaults');
          setConfig(defaultConfig);
        }
      } else {
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error('Failed to load AI configuration:', error);
      // Clear the corrupted data and use defaults
      localStorage.removeItem('ai_api_config');
      setConfig(defaultConfig);
    }
  };

  const saveConfiguration = async () => {
    try {
      localStorage.setItem('ai_api_config', JSON.stringify(config));

      // Update the QuantumPassAIService configuration
      const aiService = QuantumPassAIService.getInstance();
      await aiService.updateConfiguration({
        endpoint: config.endpoint,
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        contextWindow: config.contextWindow,
        timeout: config.timeout
      });

      setHasUnsavedChanges(false);
      setTestResult('Configuration saved successfully!');
    } catch (error) {
      console.error('Failed to save configuration:', error);
      setTestResult('Failed to save configuration: ' + (error as Error).message);
    }
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
    setHasUnsavedChanges(true);
  };

  const updateConfig = (key: keyof AIAPIConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const parseContentFromResponse = (data: any): string => {
    try {
      if (data?.choices?.[0]?.message?.content) return data.choices[0].message.content;
      if (data?.message?.content) return data.message.content;
      if (typeof data?.response === 'string') return data.response;
      if (typeof data === 'string') return data;
    } catch {}
    return '';
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult('');

    try {
      // Create a temporary service instance with the current config
      const testPayload = {
        model: config.model,
        messages: [
          {
            role: 'user',
            content: 'Hello! This is a connection test. Please respond with a short confirmation.'
          }
        ],
        temperature: config.temperature,
        max_tokens: 100
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      // Ensure endpoint normalization for ollama chat
      let endpoint = config.endpoint;
      if (config.provider === 'ollama' && !/\/api\/chat$/.test(endpoint)) {
        endpoint = endpoint.replace(/\/$/, '') + '/api/chat';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.customHeaders,
          ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
        },
        body: JSON.stringify(testPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const content = parseContentFromResponse(data);
        const contentOk = typeof content === 'string' && content.trim().length > 1;
        const looksPlaceholder = /^(Connected\.|\[GPT-2 Backup\])/.test(content || '') || /please respond/i.test(content || '');
        if (contentOk && !looksPlaceholder) {
          setTestResult(`✅ Connection successful! Model: ${config.model}\n\n${content.substring(0, 500)}`);
          setIsConnected(true);
        } else {
          setTestResult(`⚠️ Endpoint reachable but response looks placeholder or empty. Please verify server/model.`);
          setIsConnected(false);
        }
      } else {
        const errorText = await response.text();
        setTestResult(`❌ Connection failed: ${response.status} ${response.statusText} - ${errorText}`);
        setIsConnected(false);
      }
    } catch (error) {
      setTestResult(`❌ Connection failed: ${(error as Error).message}`);
      setIsConnected(false);
    } finally {
      setIsTesting(false);
    }
  };

  const checkConnection = async () => {
    try {
      const aiService = QuantumPassAIService.getInstance();
      const status = await aiService.checkOnlineStatus();
      setIsConnected(status);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const exportConfiguration = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-api-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (!content) {
            setTestResult('Failed to import configuration: Empty file');
            return;
          }
          const imported = JSON.parse(content);
          if (typeof imported !== 'object' || imported === null) {
            setTestResult('Failed to import configuration: Invalid configuration format');
            return;
          }
          setConfig({ ...defaultConfig, ...imported });
          setHasUnsavedChanges(true);
          setTestResult('Configuration imported successfully!');
        } catch (error) {
          console.error('Import error:', error);
          setTestResult(`Failed to import configuration: ${(error as Error).message}`);
        }
      };
      reader.readAsText(file);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const copyEndpoint = () => {
    navigator.clipboard.writeText(config.endpoint);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-400" />
            AI API Configuration
            <div className="ml-auto flex items-center gap-2">
              {isConnected ? (
                <Badge className="bg-green-600 flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <WifiOff className="h-3 w-3" />
                  Disconnected
                </Badge>
              )}
              {hasUnsavedChanges && (
                <Badge variant="outline" className="bg-yellow-900 text-yellow-300 border-yellow-600">
                  Unsaved Changes
                </Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Configure AI API endpoints, models, and connection settings for optimal performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={saveConfiguration} disabled={!hasUnsavedChanges} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
            <Button onClick={testConnection} disabled={isTesting} variant="outline" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button onClick={resetToDefaults} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button onClick={exportConfiguration} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importConfiguration}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-700">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="test">Test & Debug</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="provider">AI Provider</Label>
                    <Select
                      value={config.provider}
                      onValueChange={(value: any) => {
                        updateConfig('provider', value);
                        // Normalize endpoint for provider
                        let ep = predefinedEndpoints[value as keyof typeof predefinedEndpoints] || '/api/ai/chat';
                        if (value === 'ollama' && !/\/api\/chat$/.test(ep)) {
                          ep = ep.replace(/\/$/, '') + '/api/chat';
                        }
                        updateConfig('endpoint', ep);
                        const firstModel = (predefinedModels as any)[value]?.[0] || config.model;
                        updateConfig('model', firstModel);
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ollama">Ollama (Remote/Local)</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                        <SelectItem value="backup">Backup (GPT-2)</SelectItem>
                        <SelectItem value="torch">Custom PyTorch (TORCH_MODEL_URL)</SelectItem>
                        <SelectItem value="custom">Custom Endpoint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="endpoint">API Endpoint</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="endpoint"
                        value={config.endpoint}
                        onChange={(e) => updateConfig('endpoint', e.target.value)}
                        placeholder="https://api.example.com/chat"
                      />
                      <Button size="sm" variant="outline" onClick={copyEndpoint}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="model">Model Name</Label>
                    {Array.isArray((predefinedModels as any)[config.provider]) && (predefinedModels as any)[config.provider].length > 0 ? (
                      <Select
                        value={config.model}
                        onValueChange={(value) => updateConfig('model', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(predefinedModels as any)[config.provider].map((model: string) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="model"
                        value={config.model}
                        onChange={(e) => updateConfig('model', e.target.value)}
                        placeholder="Enter model name"
                        className="mt-1"
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="apiKey">API Key (Optional)</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={config.apiKey}
                      onChange={(e) => updateConfig('apiKey', e.target.value)}
                      placeholder="sk-..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="temperature">Temperature: {config.temperature}</Label>
                    <Slider
                      id="temperature"
                      min={0}
                      max={2}
                      step={0.1}
                      value={[config.temperature]}
                      onValueChange={([value]) => updateConfig('temperature', value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-slate-400 mt-1">Controls randomness: 0 = deterministic, 2 = very creative</p>
                  </div>

                  <div>
                    <Label htmlFor="maxTokens">Max Tokens: {config.maxTokens}</Label>
                    <Slider
                      id="maxTokens"
                      min={100}
                      max={8000}
                      step={100}
                      value={[config.maxTokens]}
                      onValueChange={([value]) => updateConfig('maxTokens', value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-slate-400 mt-1">Maximum response length</p>
                  </div>

                  <div>
                    <Label htmlFor="timeout">Timeout: {Math.floor(config.timeout / 1000)}s</Label>
                    <Slider
                      id="timeout"
                      min={30000}
                      max={600000}
                      step={15000}
                      value={[config.timeout]}
                      onValueChange={([value]) => updateConfig('timeout', value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-slate-400 mt-1">Request timeout duration</p>
                  </div>

                  <div>
                    <Label htmlFor="contextWindow">Context Window: {config.contextWindow}</Label>
                    <Slider
                      id="contextWindow"
                      min={1000}
                      max={50000}
                      step={1000}
                      value={[config.contextWindow]}
                      onValueChange={([value]) => updateConfig('contextWindow', value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-slate-400 mt-1">Maximum context length for conversations</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topP">Top P: {config.topP}</Label>
                    <Slider
                      id="topP"
                      min={0}
                      max={1}
                      step={0.05}
                      value={[config.topP]}
                      onValueChange={([value]) => updateConfig('topP', value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-slate-400 mt-1">Nucleus sampling parameter</p>
                  </div>

                  <div>
                    <Label htmlFor="frequencyPenalty">Frequency Penalty: {config.frequencyPenalty}</Label>
                    <Slider
                      id="frequencyPenalty"
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[config.frequencyPenalty]}
                      onValueChange={([value]) => updateConfig('frequencyPenalty', value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="presencePenalty">Presence Penalty: {config.presencePenalty}</Label>
                    <Slider
                      id="presencePenalty"
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[config.presencePenalty]}
                      onValueChange={([value]) => updateConfig('presencePenalty', value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stopSequences">Stop Sequences (one per line)</Label>
                    <Textarea
                      id="stopSequences"
                      value={config.stopSequences.join('\n')}
                      onChange={(e) => updateConfig('stopSequences', e.target.value.split('\n').filter(s => s.trim()))}
                      placeholder="<|end|>&#10;STOP&#10;###"
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="customHeaders">Custom Headers (JSON)</Label>
                    <Textarea
                      id="customHeaders"
                      value={JSON.stringify(config.customHeaders, null, 2)}
                      onChange={(e) => {
                        try {
                          if (e.target.value.trim() === '') {
                            updateConfig('customHeaders', {});
                            return;
                          }
                          const parsed = JSON.parse(e.target.value);
                          if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                            updateConfig('customHeaders', parsed);
                          }
                        } catch (error) {
                          console.warn('Invalid JSON in custom headers:', error);
                          // Don't update config with invalid JSON
                        }
                      }}
                      placeholder='{"X-Custom-Header": "value"}'
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="connection" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="retryAttempts">Retry Attempts: {config.retryAttempts}</Label>
                    <Slider
                      id="retryAttempts"
                      min={0}
                      max={10}
                      step={1}
                      value={[config.retryAttempts]}
                      onValueChange={([value]) => updateConfig('retryAttempts', value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="retryDelay">Retry Delay: {config.retryDelay}ms</Label>
                    <Slider
                      id="retryDelay"
                      min={500}
                      max={10000}
                      step={500}
                      value={[config.retryDelay]}
                      onValueChange={([value]) => updateConfig('retryDelay', value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxConcurrentRequests">Max Concurrent Requests: {config.maxConcurrentRequests}</Label>
                    <Slider
                      id="maxConcurrentRequests"
                      min={1}
                      max={20}
                      step={1}
                      value={[config.maxConcurrentRequests]}
                      onValueChange={([value]) => updateConfig('maxConcurrentRequests', value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rateLimitPerMinute">Rate Limit (per minute): {config.rateLimitPerMinute}</Label>
                    <Slider
                      id="rateLimitPerMinute"
                      min={10}
                      max={1000}
                      step={10}
                      value={[config.rateLimitPerMinute]}
                      onValueChange={([value]) => updateConfig('rateLimitPerMinute', value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-6">
              <Card className="bg-slate-900 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Connection Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <h4 className="font-semibold mb-2">Current Configuration</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Provider: <span className="text-blue-400">{config.provider}</span></div>
                        <div>Model: <span className="text-green-400">{config.model}</span></div>
                        <div>Endpoint: <span className="text-purple-400">{config.endpoint}</span></div>
                        <div>Temperature: <span className="text-yellow-400">{config.temperature}</span></div>
                      </div>
                    </div>

                    {testResult && (
                      <div className={`p-4 rounded-lg ${
                        testResult.includes('✅') ? 'bg-green-900/30 border border-green-600' :
                        'bg-red-900/30 border border-red-600'
                      }`}>
                        <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={testConnection} disabled={isTesting} className="flex items-center gap-2">
                        <TestTube className="h-4 w-4" />
                        {isTesting ? 'Testing Connection...' : 'Test Connection'}
                      </Button>
                      <Button onClick={checkConnection} variant="outline" className="flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        Check Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
          </Card>

          {/* Inline Chat Test */}
          <Card className="bg-slate-900 border-slate-600">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Inline Chat Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Type a test prompt to send to the configured model..."
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button disabled={testLoading} onClick={async () => {
                    setTestLoading(true);
                    setTestOutput('');
                    setTestResult('');
                    try {
                      let endpoint = config.endpoint;
                      if (config.provider === 'ollama' && !/\/api\/chat$/.test(endpoint)) {
                        endpoint = endpoint.replace(/\/$/, '') + '/api/chat';
                      }
                      const resp = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {}),
                        },
                        body: JSON.stringify({
                          provider: config.provider === 'backup' ? 'gpt2' : (config.provider === 'torch' ? 'torch' : undefined),
                          model: config.model,
                          messages: [{ role: 'user', content: testPrompt }],
                          temperature: config.temperature,
                          max_tokens: Math.min(512, config.maxTokens || 512),
                        }),
                      });
                      if (!resp.ok) {
                        const text = await resp.text();
                        setTestResult(`❌ Chat failed: ${resp.status} ${resp.statusText} - ${text}`);
                      } else {
                        const data = await resp.json();
                        const content = parseContentFromResponse(data);
                        const contentOk = typeof content === 'string' && content.trim().length > 1;
                        const looksPlaceholder = /^(Connected\.|\[GPT-2 Backup\])/.test(content || '') || /please respond/i.test(content || '');
                        if (contentOk && !looksPlaceholder) {
                          setTestOutput(content);
                          setTestResult('✅ Chat succeeded');
                        } else {
                          setTestResult('⚠️ Chat succeeded but response looks placeholder/empty.');
                        }
                      }
                    } catch (e: any) {
                      setTestResult(`❌ Chat error: ${e.message || e}`);
                    } finally {
                      setTestLoading(false);
                    }
                  }}>
                    {testLoading ? 'Sending...' : 'Send Test Chat'}
                  </Button>
                </div>

                {testOutput && (
                  <div className="p-3 bg-slate-800 rounded-md text-sm whitespace-pre-wrap">
                    {testOutput}
                  </div>
                )}

                {testResult && (
                  <div className={`p-2 rounded ${testResult.startsWith('✅') ? 'bg-green-900/30 border border-green-600' : testResult.startsWith('⚠️') ? 'bg-amber-900/30 border border-amber-600' : 'bg-red-900/30 border border-red-600' }`}>
                    {testResult}
                  </div>
                )}
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

export default AIAPIConfigurationSettings;
