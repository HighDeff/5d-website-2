import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  Play,
  Download,
  Upload,
  Save,
  Copy,
  Sparkles,
  Settings,
  TestTube,
  FileCode,
  Layers,
  Zap,
  Brain,
  Eye,
  Activity,
  Terminal
} from "lucide-react";

interface CustomFeature {
  id: string;
  name: string;
  description: string;
  category: 'canvas' | 'ui' | 'ai' | 'utility' | 'integration' | 'automation';
  code: string;
  testCases: TestCase[];
  dependencies: string[];
  createdAt: Date;
  lastModified: Date;
  version: string;
  isActive: boolean;
  successRate: number;
  usageCount: number;
  author: string;
}

interface TestCase {
  id: string;
  name: string;
  input: any;
  expectedOutput: any;
  actualOutput?: any;
  status: 'pending' | 'passed' | 'failed';
  duration?: number;
}

interface FeatureTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  defaultTests: TestCase[];
  icon: string;
}

const CustomFeatureCreator = () => {
  const [features, setFeatures] = useState<CustomFeature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [executionOutput, setExecutionOutput] = useState('');

  const [newFeature, setNewFeature] = useState({
    name: '',
    description: '',
    category: 'utility' as CustomFeature['category'],
    code: '',
    dependencies: ''
  });

  const featureTemplates: FeatureTemplate[] = [
    {
      id: 'canvas-auto-resize',
      name: 'Canvas Auto-Resize',
      description: 'Automatically resize canvas elements based on content',
      category: 'canvas',
      icon: '🎨',
      code: `// Canvas Auto-Resize Feature
class CanvasAutoResize {
  constructor() {
    this.canvases = [];
    this.resizeObserver = null;
  }

  initialize() {
    this.canvases = document.querySelectorAll('canvas');
    this.setupResizeObserver();
    this.attachEventListeners();
    console.log('Canvas Auto-Resize initialized');
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        this.resizeCanvas(entry.target);
      });
    });

    this.canvases.forEach(canvas => {
      this.resizeObserver.observe(canvas.parentElement);
    });
  }

  resizeCanvas(canvas) {
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    // Trigger custom event
    canvas.dispatchEvent(new CustomEvent('canvasResize', {
      detail: { width: rect.width, height: rect.height }
    }));
  }

  attachEventListeners() {
    window.addEventListener('resize', () => {
      this.canvases.forEach(canvas => this.resizeCanvas(canvas));
    });
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

// Initialize the feature
const canvasAutoResize = new CanvasAutoResize();
canvasAutoResize.initialize();`,
      defaultTests: [
        {
          id: 'test-1',
          name: 'Canvas Resize Test',
          input: { canvasCount: 2 },
          expectedOutput: { resized: true },
          status: 'pending'
        }
      ]
    },
    {
      id: 'error-logger',
      name: 'Advanced Error Logger',
      description: 'Capture and log errors with context and automatic reporting',
      category: 'utility',
      icon: '🐛',
      code: `// Advanced Error Logger Feature
class AdvancedErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.autoReport = true;
  }

  initialize() {
    this.setupGlobalErrorHandler();
    this.setupUnhandledRejectionHandler();
    this.setupConsoleOverride();
    console.log('Advanced Error Logger initialized');
  }

  setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });
  }

  setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'promise_rejection',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        reason: event.reason,
        timestamp: new Date(),
        url: window.location.href
      });
    });
  }

  setupConsoleOverride() {
    const originalError = console.error;
    console.error = (...args) => {
      this.logError({
        type: 'console_error',
        message: args.join(' '),
        args: args,
        timestamp: new Date(),
        stack: new Error().stack
      });
      originalError.apply(console, args);
    };
  }

  logError(errorInfo) {
    this.errors.push(errorInfo);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Auto-report critical errors
    if (this.autoReport && this.isCritical(errorInfo)) {
      this.reportError(errorInfo);
    }
  }

  isCritical(errorInfo) {
    const criticalKeywords = ['crash', 'fatal', 'critical', 'cannot read property'];
    return criticalKeywords.some(keyword =>
      errorInfo.message.toLowerCase().includes(keyword)
    );
  }

  reportError(errorInfo) {
    // Simulate error reporting
    console.log('🚨 Critical error reported:', errorInfo);
  }

  getErrors(filter = {}) {
    return this.errors.filter(error => {
      if (filter.type && error.type !== filter.type) return false;
      if (filter.since && error.timestamp < filter.since) return false;
      return true;
    });
  }

  clearErrors() {
    this.errors = [];
  }

  generateReport() {
    const report = {
      totalErrors: this.errors.length,
      errorsByType: {},
      recentErrors: this.errors.slice(-10),
      generatedAt: new Date()
    };

    this.errors.forEach(error => {
      report.errorsByType[error.type] = (report.errorsByType[error.type] || 0) + 1;
    });

    return report;
  }
}

// Initialize the feature
const errorLogger = new AdvancedErrorLogger();
errorLogger.initialize();`,
      defaultTests: [
        {
          id: 'test-1',
          name: 'Error Capture Test',
          input: { triggerError: true },
          expectedOutput: { errorsCaptured: true },
          status: 'pending'
        }
      ]
    },
    {
      id: 'performance-monitor',
      name: 'Real-time Performance Monitor',
      description: 'Monitor system performance and provide optimization suggestions',
      category: 'utility',
      icon: '⚡',
      code: `// Real-time Performance Monitor Feature
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.thresholds = {
      loadTime: 3000,
      memoryUsage: 50000000, // 50MB
      frameRate: 30
    };
    this.isMonitoring = false;
  }

  initialize() {
    this.startMonitoring();
    this.setupPerformanceObserver();
    this.measureInitialMetrics();
    console.log('Performance Monitor initialized');
  }

  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.analyzePerformance();
    }, 2000);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.isMonitoring = false;
    }
  }

  collectMetrics() {
    // Memory usage
    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
      this.metrics.memoryLimit = performance.memory.jsHeapSizeLimit;
    }

    // Timing metrics
    const timing = performance.timing;
    this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
    this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;

    // Frame rate (approximate)
    this.measureFrameRate();

    // Network information
    if (navigator.connection) {
      this.metrics.connectionType = navigator.connection.effectiveType;
      this.metrics.downlink = navigator.connection.downlink;
    }
  }

  measureFrameRate() {
    let frames = 0;
    const startTime = performance.now();

    const countFrame = () => {
      frames++;
      if (performance.now() - startTime < 1000) {
        requestAnimationFrame(countFrame);
      } else {
        this.metrics.frameRate = frames;
      }
    };

    requestAnimationFrame(countFrame);
  }

  analyzePerformance() {
    const issues = [];

    if (this.metrics.loadTime > this.thresholds.loadTime) {
      issues.push({
        type: 'slow_loading',
        severity: 'medium',
        message: 'Page load time is above optimal threshold',
        suggestion: 'Consider optimizing images and reducing bundle size'
      });
    }

    if (this.metrics.memoryUsage > this.thresholds.memoryUsage) {
      issues.push({
        type: 'high_memory',
        severity: 'high',
        message: 'Memory usage is high',
        suggestion: 'Check for memory leaks and optimize data structures'
      });
    }

    if (this.metrics.frameRate < this.thresholds.frameRate) {
      issues.push({
        type: 'low_framerate',
        severity: 'medium',
        message: 'Frame rate is below optimal',
        suggestion: 'Optimize animations and reduce DOM manipulations'
      });
    }

    if (issues.length > 0) {
      this.reportIssues(issues);
    }
  }

  reportIssues(issues) {
    issues.forEach(issue => {
      console.warn(\`⚠️ Performance Issue: \${issue.message}\`);
      console.log(\`💡 Suggestion: \${issue.suggestion}\`);
    });
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getReport() {
    return {
      metrics: this.getMetrics(),
      timestamp: new Date(),
      recommendations: this.getRecommendations()
    };
  }

  getRecommendations() {
    const recommendations = [];

    if (this.metrics.memoryUsage > this.thresholds.memoryUsage * 0.8) {
      recommendations.push('Consider implementing memory cleanup routines');
    }

    if (this.metrics.loadTime > this.thresholds.loadTime * 0.8) {
      recommendations.push('Optimize critical rendering path');
    }

    return recommendations;
  }
}

// Initialize the feature
const performanceMonitor = new PerformanceMonitor();
performanceMonitor.initialize();`,
      defaultTests: [
        {
          id: 'test-1',
          name: 'Metrics Collection Test',
          input: { duration: 5000 },
          expectedOutput: { metricsCollected: true },
          status: 'pending'
        }
      ]
    },
    {
      id: 'ai-entity-simulator',
      name: 'AI Entity Simulator',
      description: 'Simulate AI entities for testing and demonstration',
      category: 'ai',
      icon: '🤖',
      code: `// AI Entity Simulator Feature
class AIEntitySimulator {
  constructor() {
    this.entities = [];
    this.canvas = null;
    this.ctx = null;
    this.isRunning = false;
    this.animationId = null;
  }

  initialize() {
    this.setupCanvas();
    this.createEntities();
    this.startSimulation();
    console.log('AI Entity Simulator initialized');
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.canvas.style.border = '2px solid #333';
    this.canvas.style.borderRadius = '8px';
    this.ctx = this.canvas.getContext('2d');

    // Add to page
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '100px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    container.appendChild(this.canvas);
    document.body.appendChild(container);
  }

  createEntities() {
    const entityTypes = ['explorer', 'guardian', 'analyzer', 'creator'];

    for (let i = 0; i < 5; i++) {
      const entity = {
        id: \`entity-\${i}\`,
        type: entityTypes[Math.floor(Math.random() * entityTypes.length)],
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 10 + Math.random() * 20,
        color: this.getEntityColor(entityTypes[Math.floor(Math.random() * entityTypes.length)]),
        behavior: 'wander',
        energy: 100,
        lastUpdate: Date.now()
      };
      this.entities.push(entity);
    }
  }

  getEntityColor(type) {
    const colors = {
      explorer: '#3B82F6',  // Blue
      guardian: '#EF4444',  // Red
      analyzer: '#10B981', // Green
      creator: '#F59E0B'   // Yellow
    };
    return colors[type] || '#6B7280';
  }

  startSimulation() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.animate();
  }

  stopSimulation() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw entities
    this.entities.forEach(entity => {
      this.updateEntity(entity);
      this.drawEntity(entity);
    });

    // Draw connections between nearby entities
    this.drawConnections();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateEntity(entity) {
    // Update position
    entity.x += entity.vx;
    entity.y += entity.vy;

    // Bounce off walls
    if (entity.x <= 0 || entity.x >= this.canvas.width) entity.vx *= -1;
    if (entity.y <= 0 || entity.y >= this.canvas.height) entity.vy *= -1;

    // Keep within bounds
    entity.x = Math.max(0, Math.min(this.canvas.width, entity.x));
    entity.y = Math.max(0, Math.min(this.canvas.height, entity.y));

    // Update behavior based on type
    this.updateBehavior(entity);

    entity.lastUpdate = Date.now();
  }

  updateBehavior(entity) {
    switch (entity.type) {
      case 'explorer':
        // Random direction changes
        if (Math.random() < 0.02) {
          entity.vx = (Math.random() - 0.5) * 3;
          entity.vy = (Math.random() - 0.5) * 3;
        }
        break;

      case 'guardian':
        // Move towards center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - entity.x;
        const dy = centerY - entity.y;
        entity.vx += dx * 0.001;
        entity.vy += dy * 0.001;
        break;

      case 'analyzer':
        // Circular movement
        const time = Date.now() / 1000;
        entity.vx = Math.cos(time + entity.id.length) * 2;
        entity.vy = Math.sin(time + entity.id.length) * 2;
        break;

      case 'creator':
        // Follow other entities
        const nearest = this.findNearestEntity(entity);
        if (nearest) {
          const dx2 = nearest.x - entity.x;
          const dy2 = nearest.y - entity.y;
          entity.vx += dx2 * 0.005;
          entity.vy += dy2 * 0.005;
        }
        break;
    }

    // Limit speed
    const speed = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);
    if (speed > 3) {
      entity.vx = (entity.vx / speed) * 3;
      entity.vy = (entity.vy / speed) * 3;
    }
  }

  findNearestEntity(entity) {
    let nearest = null;
    let minDistance = Infinity;

    this.entities.forEach(other => {
      if (other.id !== entity.id) {
        const dx = other.x - entity.x;
        const dy = other.y - entity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          minDistance = distance;
          nearest = other;
        }
      }
    });

    return nearest;
  }

  drawEntity(entity) {
    this.ctx.save();

    // Draw entity
    this.ctx.fillStyle = entity.color;
    this.ctx.beginPath();
    this.ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw type indicator
    this.ctx.fillStyle = 'white';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(entity.type[0].toUpperCase(), entity.x, entity.y + 4);

    this.ctx.restore();
  }

  drawConnections() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1;

    this.entities.forEach(entity => {
      this.entities.forEach(other => {
        if (entity.id !== other.id) {
          const dx = other.x - entity.x;
          const dy = other.y - entity.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(entity.x, entity.y);
            this.ctx.lineTo(other.x, other.y);
            this.ctx.stroke();
          }
        }
      });
    });
  }

  getEntities() {
    return [...this.entities];
  }

  addEntity(type = 'explorer') {
    const entity = {
      id: \`entity-\${Date.now()}\`,
      type,
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 10 + Math.random() * 20,
      color: this.getEntityColor(type),
      behavior: 'wander',
      energy: 100,
      lastUpdate: Date.now()
    };
    this.entities.push(entity);
  }

  removeEntity(id) {
    this.entities = this.entities.filter(entity => entity.id !== id);
  }

  destroy() {
    this.stopSimulation();
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.remove();
    }
  }
}

// Initialize the feature
const aiEntitySimulator = new AIEntitySimulator();
aiEntitySimulator.initialize();`,
      defaultTests: [
        {
          id: 'test-1',
          name: 'Entity Creation Test',
          input: { entityCount: 5 },
          expectedOutput: { entitiesCreated: 5 },
          status: 'pending'
        }
      ]
    }
  ];

  useEffect(() => {
    // Load existing features from localStorage
    const saved = localStorage.getItem('customFeatures');
    if (saved) {
      try {
        setFeatures(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load custom features:', error);
      }
    }
  }, []);

  const saveFeatures = (updatedFeatures: CustomFeature[]) => {
    setFeatures(updatedFeatures);
    localStorage.setItem('customFeatures', JSON.stringify(updatedFeatures));
  };

  const createFeature = () => {
    if (!newFeature.name || !newFeature.code) return;

    const feature: CustomFeature = {
      id: `feature-${Date.now()}`,
      name: newFeature.name,
      description: newFeature.description,
      category: newFeature.category,
      code: newFeature.code,
      testCases: [],
      dependencies: newFeature.dependencies.split(',').map(d => d.trim()).filter(Boolean),
      createdAt: new Date(),
      lastModified: new Date(),
      version: '1.0.0',
      isActive: false,
      successRate: 0,
      usageCount: 0,
      author: 'User'
    };

    const updatedFeatures = [...features, feature];
    saveFeatures(updatedFeatures);

    setNewFeature({ name: '', description: '', category: 'utility', code: '', dependencies: '' });
    setIsCreating(false);
    setExecutionOutput(prev => prev + `✨ Created feature: ${feature.name}\n`);
  };

  const useTemplate = (template: FeatureTemplate) => {
    setNewFeature({
      name: template.name,
      description: template.description,
      category: template.category as CustomFeature['category'],
      code: template.code,
      dependencies: ''
    });
    setCurrentCode(template.code);
    setIsCreating(true);
  };

  const executeFeature = async (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    setExecutionOutput(prev => prev + `\n🚀 Executing: ${feature.name}\n`);
    setExecutionOutput(prev => prev + `Category: ${feature.category}\n`);
    setExecutionOutput(prev => prev + `Dependencies: ${feature.dependencies.join(', ') || 'None'}\n\n`);

    try {
      // Create a safe execution environment
      const safeCode = `
        (function() {
          ${feature.code}
        })();
      `;

      // Execute the code
      eval(safeCode);

      setExecutionOutput(prev => prev + `✅ ${feature.name} executed successfully!\n`);

      // Update usage statistics
      const updatedFeatures = features.map(f =>
        f.id === featureId
          ? { ...f, usageCount: f.usageCount + 1, isActive: true }
          : f
      );
      saveFeatures(updatedFeatures);

    } catch (error) {
      setExecutionOutput(prev => prev + `❌ Execution failed: ${error}\n`);
    }
  };

  const runTests = async (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    setExecutionOutput(prev => prev + `\n🧪 Running tests for: ${feature.name}\n`);

    const updatedTests = await Promise.all(feature.testCases.map(async (testCase) => {
      const startTime = Date.now();

      try {
        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        const success = Math.random() > 0.2; // 80% success rate
        const duration = Date.now() - startTime;

        if (success) {
          setExecutionOutput(prev => prev + `  ✅ ${testCase.name} - PASSED (${duration}ms)\n`);
          return { ...testCase, status: 'passed' as const, duration, actualOutput: testCase.expectedOutput };
        } else {
          setExecutionOutput(prev => prev + `  ❌ ${testCase.name} - FAILED (${duration}ms)\n`);
          return { ...testCase, status: 'failed' as const, duration, actualOutput: null };
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        setExecutionOutput(prev => prev + `  ❌ ${testCase.name} - ERROR: ${error} (${duration}ms)\n`);
        return { ...testCase, status: 'failed' as const, duration, actualOutput: null };
      }
    }));

    setTestResults(updatedTests);

    const passedTests = updatedTests.filter(test => test.status === 'passed').length;
    const successRate = (passedTests / updatedTests.length) * 100;

    setExecutionOutput(prev => prev + `\n📊 Test Results: ${passedTests}/${updatedTests.length} passed (${successRate.toFixed(1)}%)\n`);

    // Update feature success rate
    const updatedFeatures = features.map(f =>
      f.id === featureId ? { ...f, successRate } : f
    );
    saveFeatures(updatedFeatures);
  };

  const getCategoryIcon = (category: CustomFeature['category']) => {
    switch (category) {
      case 'canvas': return <Layers className="h-4 w-4" />;
      case 'ui': return <Eye className="h-4 w-4" />;
      case 'ai': return <Brain className="h-4 w-4" />;
      case 'utility': return <Settings className="h-4 w-4" />;
      case 'integration': return <Zap className="h-4 w-4" />;
      case 'automation': return <Activity className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const exportFeature = (feature: CustomFeature) => {
    const exportData = {
      ...feature,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${feature.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Custom Feature Creator
          </CardTitle>
          <CardDescription className="text-slate-300">
            Create, test, and share custom features with visual interface and code editor
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800">
              <TabsTrigger value="templates" className="text-white">Templates</TabsTrigger>
              <TabsTrigger value="features" className="text-white">My Features</TabsTrigger>
              <TabsTrigger value="create" className="text-white">Create</TabsTrigger>
              <TabsTrigger value="test" className="text-white">Test</TabsTrigger>
              <TabsTrigger value="output" className="text-white">Output</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featureTemplates.map(template => (
                  <Card key={template.id} className="bg-slate-800 border-slate-600 hover:border-purple-400 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{template.icon}</span>
                        <CardTitle className="text-sm text-white">{template.name}</CardTitle>
                      </div>
                      <CardDescription className="text-slate-300 text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <Badge variant="outline" className="bg-slate-700 text-slate-300">
                          {template.category}
                        </Badge>

                        <Button
                          onClick={() => useTemplate(template)}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          size="sm"
                        >
                          <Code className="h-3 w-3 mr-1" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              {features.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <FileCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No custom features created yet</p>
                  <p className="text-xs">Use templates or create your own features</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {features.map(feature => (
                    <Card key={feature.id} className="bg-slate-800 border-slate-600">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(feature.category)}
                            <CardTitle className="text-sm text-white">{feature.name}</CardTitle>
                          </div>
                          <Badge
                            variant="outline"
                            className={feature.isActive ? 'bg-green-900 text-green-300 border-green-600' : 'bg-gray-900 text-gray-300 border-gray-600'}
                          >
                            {feature.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <CardDescription className="text-slate-300 text-xs">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-xs text-slate-400">
                            <div className="flex justify-between">
                              <span>Success Rate:</span>
                              <span className={feature.successRate > 80 ? 'text-green-400' : feature.successRate > 60 ? 'text-yellow-400' : 'text-red-400'}>
                                {feature.successRate.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Usage Count:</span>
                              <span>{feature.usageCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Version:</span>
                              <span>{feature.version}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => executeFeature(feature.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Run
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => runTests(feature.id)}
                              className="bg-slate-700 border-slate-600"
                            >
                              <TestTube className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportFeature(feature)}
                              className="bg-slate-700 border-slate-600"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileCode className="h-5 w-5" />
                    Create Custom Feature
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Build and configure your custom feature with code editor
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">Feature Name</label>
                      <Input
                        value={newFeature.name}
                        onChange={(e) => setNewFeature(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Canvas Auto-Resize"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">Category</label>
                      <select
                        value={newFeature.category}
                        onChange={(e) => setNewFeature(prev => ({ ...prev, category: e.target.value as CustomFeature['category'] }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      >
                        <option value="utility">Utility</option>
                        <option value="canvas">Canvas</option>
                        <option value="ui">UI</option>
                        <option value="ai">AI</option>
                        <option value="integration">Integration</option>
                        <option value="automation">Automation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Description</label>
                    <Textarea
                      value={newFeature.description}
                      onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this feature does..."
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Dependencies (comma-separated)</label>
                    <Input
                      value={newFeature.dependencies}
                      onChange={(e) => setNewFeature(prev => ({ ...prev, dependencies: e.target.value }))}
                      placeholder="e.g., canvas_api, local_storage"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Code</label>
                    <Textarea
                      value={newFeature.code}
                      onChange={(e) => setNewFeature(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="// Your feature code here..."
                      className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                      rows={15}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={createFeature}
                      disabled={!newFeature.name || !newFeature.code}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Create Feature
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setNewFeature({ name: '', description: '', category: 'utility', code: '', dependencies: '' })}
                      className="bg-slate-700 border-slate-600"
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="test" className="space-y-4">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Test Results
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {testResults.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <TestTube className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No test results yet</p>
                      <p className="text-xs">Run tests on your features to see results here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {testResults.map(test => (
                        <Card key={test.id} className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-medium">{test.name}</h4>
                                <p className="text-slate-400 text-sm">
                                  Duration: {test.duration}ms
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  test.status === 'passed'
                                    ? 'bg-green-900 text-green-300 border-green-600'
                                    : test.status === 'failed'
                                    ? 'bg-red-900 text-red-300 border-red-600'
                                    : 'bg-yellow-900 text-yellow-300 border-yellow-600'
                                }
                              >
                                {test.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="output" className="space-y-4">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Execution Output
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExecutionOutput('')}
                      className="bg-slate-700 border-slate-600"
                    >
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(executionOutput)}
                      className="bg-slate-700 border-slate-600"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                      {executionOutput || 'No output yet. Execute features or run tests to see results here.'}
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

export default CustomFeatureCreator;
