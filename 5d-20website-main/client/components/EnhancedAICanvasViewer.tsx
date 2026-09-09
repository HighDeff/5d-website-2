import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Palette,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Eye,
  Target,
  Activity,
  Brain,
  Settings,
  Download,
  Upload,
  Save,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import QuantumPassAIService from '@/services/QuantumPassAIService';
import AIConfidenceScoring from '@/services/AIConfidenceScoring';
import AISelfFixingSystem from '@/services/AISelfFixingSystem';

interface CanvasEntity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  size: number;
  color: string;
  type: 'normal' | 'anomaly' | 'spiral' | 'cluster';
  lastUpdate: number;
  confidence: number;
}

interface CanvasAnomalyDetection {
  id: string;
  type: 'spiral' | 'rapid_movement' | 'cluster' | 'boundary_escape' | 'velocity_spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  entities: string[];
  confidence: number;
  timestamp: Date;
  description: string;
  autoFixSuggestion: string;
}

interface CanvasMetrics {
  totalEntities: number;
  averageVelocity: number;
  energyLevel: number;
  stability: number;
  anomalyCount: number;
  frameRate: number;
  aiResponseTime: number;
  confidenceScore: number;
}

const EnhancedAICanvasViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(false);
  const [entities, setEntities] = useState<CanvasEntity[]>([]);
  const [anomalies, setAnomalies] = useState<CanvasAnomalyDetection[]>([]);
  const [metrics, setMetrics] = useState<CanvasMetrics>({
    totalEntities: 0,
    averageVelocity: 0,
    energyLevel: 0,
    stability: 1,
    anomalyCount: 0,
    frameRate: 60,
    aiResponseTime: 0,
    confidenceScore: 0
  });
  const [aiService] = useState(() => QuantumPassAIService.getInstance());
  const [confidenceScoring] = useState(() => AIConfidenceScoring.getInstance());
  const [selfFixingSystem] = useState(() => AISelfFixingSystem.getInstance());
  const [aiOnlineStatus, setAiOnlineStatus] = useState({ isOnline: false, status: 'connecting', lastPing: 0 });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('canvas');

  useEffect(() => {
    initializeCanvas();

    let cleanup: (() => void) | undefined;

    setupAIMonitoring().then(cleanupFn => {
      cleanup = cleanupFn;
    }).catch(error => {
      console.error('AI monitoring setup failed:', error);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  useEffect(() => {
    // Monitor AI online status
    const statusCallback = (online: boolean, status: string, ping: number) => {
      setAiOnlineStatus({ isOnline: online, status, lastPing: ping });
    };

    aiService.onOnlineStatusChange(statusCallback);

    return () => {
      aiService.offOnlineStatusChange(statusCallback);
    };
  }, [aiService]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Create initial entities
    const initialEntities: CanvasEntity[] = [];
    for (let i = 0; i < 20; i++) {
      initialEntities.push(createRandomEntity());
    }

    setEntities(initialEntities);
  };

  const createRandomEntity = (): CanvasEntity => ({
    id: `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    x: Math.random() * 750 + 25,
    y: Math.random() * 550 + 25,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    mass: Math.random() * 10 + 5,
    size: Math.random() * 8 + 4,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    type: 'normal',
    lastUpdate: Date.now(),
    confidence: Math.random() * 0.3 + 0.7
  });

  const setupAIMonitoring = async () => {
    try {
      console.log('🔧 Setting up AI monitoring for canvas...');

      // Initialize AI services with timeout
      const initPromise = aiService.initialize();
      const timeoutPromise = new Promise<boolean>(resolve =>
        setTimeout(() => resolve(false), 10000) // 10 second timeout
      );

      const initialized = await Promise.race([initPromise, timeoutPromise]);

      if (initialized) {
        console.log('✅ AI services initialized for canvas');
      } else {
        console.warn('⚠️ AI services initialization timeout - running in limited mode');
      }

      // Start self-fixing system monitoring (works offline)
      if (autoFixEnabled) {
        try {
          selfFixingSystem.startLoopMode();
          console.log('🔄 Self-fixing loop mode started');
        } catch (error) {
          console.warn('Self-fixing system start failed:', error);
        }
      }

      // Monitor anomalies (works offline)
      const monitoringInterval = setInterval(() => {
        if (isMonitoring) {
          try {
            detectAnomalies();
            updateMetrics();
          } catch (error) {
            console.warn('Monitoring update failed:', error);
          }
        }
      }, 2000);

      // Store interval for cleanup
      return () => {
        clearInterval(monitoringInterval);
      };

    } catch (error) {
      console.error('Error setting up AI monitoring:', error);

      // Continue with basic monitoring even if AI setup fails
      const basicInterval = setInterval(() => {
        if (isMonitoring) {
          updateMetrics();
        }
      }, 2000);

      return () => {
        clearInterval(basicInterval);
      };
    }
  };

  const startAnimation = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      animate();
    }
  }, [isRunning]);

  const stopAnimation = () => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const animate = () => {
    if (!isRunning) return;

    updateEntities();
    renderCanvas();

    animationRef.current = requestAnimationFrame(animate);
  };

  const updateEntities = () => {
    setEntities(prevEntities => {
      return prevEntities.map(entity => {
        // Update position
        let newX = entity.x + entity.vx;
        let newY = entity.y + entity.vy;

        // Bounce off walls
        if (newX <= entity.size || newX >= 800 - entity.size) {
          entity.vx *= -0.8;
          newX = Math.max(entity.size, Math.min(800 - entity.size, newX));
        }
        if (newY <= entity.size || newY >= 600 - entity.size) {
          entity.vy *= -0.8;
          newY = Math.max(entity.size, Math.min(600 - entity.size, newY));
        }

        // Apply friction
        entity.vx *= 0.995;
        entity.vy *= 0.995;

        // Random movement variation
        entity.vx += (Math.random() - 0.5) * 0.1;
        entity.vy += (Math.random() - 0.5) * 0.1;

        // Update confidence based on behavior
        const velocity = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);
        const expectedVelocity = 2;
        const confidenceDelta = Math.abs(velocity - expectedVelocity) < 1 ? 0.01 : -0.005;
        const newConfidence = Math.max(0.1, Math.min(1, entity.confidence + confidenceDelta));

        return {
          ...entity,
          x: newX,
          y: newY,
          lastUpdate: Date.now(),
          confidence: newConfidence
        };
      });
    });
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw entities
    entities.forEach(entity => {
      ctx.save();

      // Entity shadow/glow based on confidence
      const alpha = entity.confidence;
      ctx.shadowColor = entity.color;
      ctx.shadowBlur = 10 * alpha;

      // Entity body
      ctx.fillStyle = entity.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
      ctx.fill();

      // Confidence indicator
      ctx.strokeStyle = entity.confidence > 0.7 ? '#10b981' : entity.confidence > 0.4 ? '#f59e0b' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Velocity vector
      if (Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy) > 0.5) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(entity.x, entity.y);
        ctx.lineTo(entity.x + entity.vx * 10, entity.y + entity.vy * 10);
        ctx.stroke();
      }

      // Anomaly highlighting
      if (entity.type !== 'normal') {
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, entity.size + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();
    });

    // Draw anomaly zones
    anomalies.forEach(anomaly => {
      ctx.save();
      ctx.strokeStyle = anomaly.severity === 'critical' ? '#dc2626' :
                        anomaly.severity === 'high' ? '#ea580c' :
                        anomaly.severity === 'medium' ? '#ca8a04' : '#65a30d';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.globalAlpha = 0.3;

      // Draw anomaly boundary
      const affectedEntities = entities.filter(e => anomaly.entities.includes(e.id));
      if (affectedEntities.length > 0) {
        const minX = Math.min(...affectedEntities.map(e => e.x)) - 20;
        const maxX = Math.max(...affectedEntities.map(e => e.x)) + 20;
        const minY = Math.min(...affectedEntities.map(e => e.y)) - 20;
        const maxY = Math.max(...affectedEntities.map(e => e.y)) + 20;

        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      }

      ctx.restore();
    });

    // Draw metrics overlay
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(10, 10, 200, 120);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px monospace';
    ctx.fillText(`Entities: ${entities.length}`, 20, 30);
    ctx.fillText(`Anomalies: ${anomalies.length}`, 20, 45);
    ctx.fillText(`AI Online: ${aiOnlineStatus.isOnline ? 'Yes' : 'No'}`, 20, 60);
    ctx.fillText(`Confidence: ${(metrics.confidenceScore * 100).toFixed(1)}%`, 20, 75);
    ctx.fillText(`Stability: ${(metrics.stability * 100).toFixed(1)}%`, 20, 90);
    ctx.fillText(`Frame Rate: ${metrics.frameRate.toFixed(0)} FPS`, 20, 105);
    ctx.fillText(`AI Ping: ${aiOnlineStatus.lastPing}ms`, 20, 120);
  };

  const detectAnomalies = () => {
    const newAnomalies: CanvasAnomalyDetection[] = [];

    // Detect spiral patterns
    const spiralEntities = entities.filter(entity => {
      const velocity = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);
      const angularVelocity = Math.atan2(entity.vy, entity.vx);
      return velocity > 3 && Math.abs(angularVelocity) > 1;
    });

    if (spiralEntities.length >= 3) {
      newAnomalies.push({
        id: `spiral_${Date.now()}`,
        type: 'spiral',
        severity: 'high',
        entities: spiralEntities.map(e => e.id),
        confidence: 0.85,
        timestamp: new Date(),
        description: 'Spiral pattern detected in entity movement',
        autoFixSuggestion: 'Apply velocity dampening and reset entity positions'
      });
    }

    // Detect rapid movement
    const rapidEntities = entities.filter(entity => {
      const velocity = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);
      return velocity > 5;
    });

    if (rapidEntities.length > 0) {
      newAnomalies.push({
        id: `rapid_${Date.now()}`,
        type: 'rapid_movement',
        severity: rapidEntities.length > 5 ? 'critical' : 'medium',
        entities: rapidEntities.map(e => e.id),
        confidence: 0.75,
        timestamp: new Date(),
        description: `${rapidEntities.length} entities moving at excessive velocity`,
        autoFixSuggestion: 'Apply friction and velocity limits'
      });
    }

    // Detect clustering
    const clusters = findClusters();
    clusters.forEach((cluster, index) => {
      if (cluster.length > 5) {
        newAnomalies.push({
          id: `cluster_${Date.now()}_${index}`,
          type: 'cluster',
          severity: 'low',
          entities: cluster.map(e => e.id),
          confidence: 0.65,
          timestamp: new Date(),
          description: `Entity cluster detected with ${cluster.length} entities`,
          autoFixSuggestion: 'Apply repulsion forces to distribute entities'
        });
      }
    });

    setAnomalies(newAnomalies);

    // Auto-fix anomalies if enabled
    if (autoFixEnabled && newAnomalies.length > 0) {
      handleAutoFix(newAnomalies);
    }
  };

  const findClusters = (): CanvasEntity[][] => {
    const clusters: CanvasEntity[][] = [];
    const visited = new Set<string>();

    entities.forEach(entity => {
      if (visited.has(entity.id)) return;

      const cluster = [entity];
      visited.add(entity.id);

      // Find nearby entities
      entities.forEach(other => {
        if (visited.has(other.id)) return;

        const distance = Math.sqrt(
          (entity.x - other.x) ** 2 + (entity.y - other.y) ** 2
        );

        if (distance < 50) {
          cluster.push(other);
          visited.add(other.id);
        }
      });

      if (cluster.length > 1) {
        clusters.push(cluster);
      }
    });

    return clusters;
  };

  const handleAutoFix = async (detectedAnomalies: CanvasAnomalyDetection[]) => {
    for (const anomaly of detectedAnomalies) {
      try {
        console.log(`🔧 Auto-fixing anomaly: ${anomaly.type}`);

        switch (anomaly.type) {
          case 'spiral':
            // Apply spiral prevention
            setEntities(prev => prev.map(entity => {
              if (anomaly.entities.includes(entity.id)) {
                return {
                  ...entity,
                  vx: entity.vx * 0.5,
                  vy: entity.vy * 0.5,
                  type: 'normal'
                };
              }
              return entity;
            }));
            break;

          case 'rapid_movement':
            // Apply velocity limits
            setEntities(prev => prev.map(entity => {
              if (anomaly.entities.includes(entity.id)) {
                const velocity = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);
                const scale = Math.min(1, 3 / velocity);
                return {
                  ...entity,
                  vx: entity.vx * scale,
                  vy: entity.vy * scale,
                  type: 'normal'
                };
              }
              return entity;
            }));
            break;

          case 'cluster':
            // Apply repulsion forces
            setEntities(prev => prev.map(entity => {
              if (anomaly.entities.includes(entity.id)) {
                const repulsionX = (Math.random() - 0.5) * 2;
                const repulsionY = (Math.random() - 0.5) * 2;
                return {
                  ...entity,
                  vx: entity.vx + repulsionX,
                  vy: entity.vy + repulsionY,
                  type: 'normal'
                };
              }
              return entity;
            }));
            break;
        }

        // Report fix to AI system
        await aiService.sendMessage(
          `Auto-fixed canvas anomaly: ${anomaly.type}. ${anomaly.description}. Applied: ${anomaly.autoFixSuggestion}`
        );

      } catch (error) {
        console.error(`Failed to auto-fix anomaly ${anomaly.type}:`, error);
      }
    }
  };

  const updateMetrics = () => {
    const totalVelocity = entities.reduce((sum, entity) => {
      return sum + Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);
    }, 0);

    const averageConfidence = entities.reduce((sum, entity) => sum + entity.confidence, 0) / entities.length;
    const energyLevel = totalVelocity / entities.length;
    const stability = 1 - (anomalies.length / (entities.length || 1));

    setMetrics({
      totalEntities: entities.length,
      averageVelocity: totalVelocity / entities.length,
      energyLevel,
      stability: Math.max(0, stability),
      anomalyCount: anomalies.length,
      frameRate: 60, // Would calculate actual FPS in real implementation
      aiResponseTime: aiOnlineStatus.lastPing,
      confidenceScore: averageConfidence
    });
  };

  const resetCanvas = () => {
    stopAnimation();
    setEntities([]);
    setAnomalies([]);
    initializeCanvas();
  };

  const addRandomEntity = () => {
    setEntities(prev => [...prev, createRandomEntity()]);
  };

  const handleAIQuery = async (query: string) => {
    try {
      const response = await aiService.sendConfidentMessage(
        `Canvas Analysis: ${query}. Current state: ${entities.length} entities, ${anomalies.length} anomalies detected.`,
        undefined,
        0.7
      );

      console.log('🤖 AI Response:', response.response);
      console.log('🎯 Confidence:', (response.confidence.overallScore * 100).toFixed(1) + '%');

      return response;
    } catch (error) {
      console.error('AI query failed:', error);
      return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="canvas" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Canvas
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Controls
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Anomalies
          </TabsTrigger>
          <TabsTrigger value="ai-status" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="canvas" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-400" />
                  Enhanced AI Canvas Viewer
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={aiOnlineStatus.isOnline ? "default" : "destructive"}
                    className={aiOnlineStatus.isOnline ? "bg-green-600" : "bg-red-600"}
                  >
                    {aiOnlineStatus.isOnline ? 'AI Online' : 'AI Offline'}
                  </Badge>
                  <Badge variant="outline" className="text-blue-300 border-blue-600">
                    {metrics.confidenceScore > 0.7 ? 'High Confidence' :
                     metrics.confidenceScore > 0.4 ? 'Medium Confidence' : 'Low Confidence'}
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Real-time entity visualization with AI-powered anomaly detection and auto-fixing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Button
                    onClick={isRunning ? stopAnimation : startAnimation}
                    className="flex items-center gap-2"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                  <Button onClick={resetCanvas} variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button onClick={addRandomEntity} variant="outline" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Add Entity
                  </Button>
                  <Button
                    onClick={() => handleAIQuery('Analyze current canvas state')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    AI Analysis
                  </Button>
                </div>

                <canvas
                  ref={canvasRef}
                  className="border border-slate-600 rounded-lg bg-slate-900"
                  style={{ width: '100%', maxWidth: '800px', aspectRatio: '4/3' }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Monitoring Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Anomaly Detection</span>
                  <Button
                    size="sm"
                    variant={isMonitoring ? "default" : "outline"}
                    onClick={() => setIsMonitoring(!isMonitoring)}
                  >
                    {isMonitoring ? 'Active' : 'Inactive'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-Fix</span>
                  <Button
                    size="sm"
                    variant={autoFixEnabled ? "default" : "outline"}
                    onClick={() => setAutoFixEnabled(!autoFixEnabled)}
                  >
                    {autoFixEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Self-Fixing Loop</span>
                  <Button
                    size="sm"
                    variant={selfFixingSystem.isLoopModeRunning() ? "default" : "outline"}
                    onClick={() => {
                      if (selfFixingSystem.isLoopModeRunning()) {
                        selfFixingSystem.stopLoopMode();
                      } else {
                        selfFixingSystem.startLoopMode();
                      }
                    }}
                  >
                    {selfFixingSystem.isLoopModeRunning() ? 'Running' : 'Stopped'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Canvas Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Load Configuration
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-slate-300">System Stability</span>
                  </div>
                  <Badge variant={metrics.stability > 0.8 ? "default" : "destructive"}>
                    {(metrics.stability * 100).toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={metrics.stability * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-slate-300">AI Confidence</span>
                  </div>
                  <Badge variant={metrics.confidenceScore > 0.7 ? "default" : "secondary"}>
                    {(metrics.confidenceScore * 100).toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={metrics.confidenceScore * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-slate-300">Energy Level</span>
                  </div>
                  <Badge variant="outline">
                    {metrics.energyLevel.toFixed(2)}
                  </Badge>
                </div>
                <Progress value={Math.min(100, metrics.energyLevel * 20)} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-slate-300">Entities</span>
                  </div>
                  <Badge variant="outline">
                    {metrics.totalEntities}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span className="text-sm text-slate-300">Anomalies</span>
                  </div>
                  <Badge variant={metrics.anomalyCount > 0 ? "destructive" : "default"}>
                    {metrics.anomalyCount}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-400" />
                    <span className="text-sm text-slate-300">Frame Rate</span>
                  </div>
                  <Badge variant="outline">
                    {metrics.frameRate.toFixed(0)} FPS
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                Detected Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {anomalies.length > 0 ? (
                <div className="space-y-3">
                  {anomalies.map(anomaly => (
                    <div key={anomaly.id} className="p-3 border border-slate-600 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            anomaly.severity === 'critical' ? 'destructive' :
                            anomaly.severity === 'high' ? 'destructive' :
                            anomaly.severity === 'medium' ? 'secondary' : 'outline'
                          }
                        >
                          {anomaly.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          Confidence: {(anomaly.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{anomaly.description}</p>
                      <p className="text-xs text-slate-400">
                        Auto-fix: {anomaly.autoFixSuggestion}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Entities affected: {anomaly.entities.length} • {anomaly.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-400" />
                  <p>No anomalies detected</p>
                  <p className="text-sm">System is operating normally</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Service Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Connection Status</span>
                  <Badge variant={aiOnlineStatus.isOnline ? "default" : "destructive"}>
                    {aiOnlineStatus.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Time</span>
                  <Badge variant="outline">
                    {aiOnlineStatus.lastPing > 0 ? `${aiOnlineStatus.lastPing}ms` : 'N/A'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Confidence</span>
                  <Badge variant={metrics.confidenceScore > 0.7 ? "default" : "secondary"}>
                    {(metrics.confidenceScore * 100).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  Self-Fixing System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Loop Mode</span>
                  <Badge variant={selfFixingSystem.isLoopModeRunning() ? "default" : "outline"}>
                    {selfFixingSystem.isLoopModeRunning() ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-Fix</span>
                  <Badge variant={autoFixEnabled ? "default" : "outline"}>
                    {autoFixEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <Button
                  onClick={() => handleAIQuery('Perform system health check')}
                  className="w-full"
                  variant="outline"
                >
                  Run Health Check
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAICanvasViewer;
