import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Zap,
  Target,
  Palette,
  Wand2,
  Layers,
  Activity,
  Eye,
  Settings,
  Sparkles,
  MousePointer,
  Hand
} from 'lucide-react';

interface PlaygroundEntity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: 'particle' | 'wave' | 'field' | 'vortex' | 'cluster';
  energy: number;
  lifetime: number;
  interactions: number;
  trail: { x: number; y: number; timestamp: number }[];
}

interface InteractionTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  cursor: string;
}

const InteractiveCanvasPlayground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(false);
  const [entities, setEntities] = useState<PlaygroundEntity[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('particle');
  const [brushSize, setBrushSize] = useState(20);
  const [intensity, setIntensity] = useState(50);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [showTrails, setShowTrails] = useState(true);
  const [showFields, setShowFields] = useState(true);
  const [gravity, setGravity] = useState(0.1);
  const [friction, setFriction] = useState(0.99);
  const [colorMode, setColorMode] = useState<'rainbow' | 'energy' | 'velocity' | 'age'>('rainbow');

  const tools: InteractionTool[] = [
    {
      id: 'particle',
      name: 'Particle Brush',
      icon: <Sparkles className="h-4 w-4" />,
      description: 'Create particles with mouse movement',
      cursor: 'crosshair'
    },
    {
      id: 'wave',
      name: 'Wave Generator',
      icon: <Activity className="h-4 w-4" />,
      description: 'Generate wave patterns',
      cursor: 'pointer'
    },
    {
      id: 'field',
      name: 'Force Field',
      icon: <Target className="h-4 w-4" />,
      description: 'Create gravitational fields',
      cursor: 'grab'
    },
    {
      id: 'vortex',
      name: 'Vortex Creator',
      icon: <Layers className="h-4 w-4" />,
      description: 'Generate spinning vortices',
      cursor: 'alias'
    },
    {
      id: 'eraser',
      name: 'Eraser',
      icon: <Square className="h-4 w-4" />,
      description: 'Remove entities',
      cursor: 'not-allowed'
    }
  ];

  const generateEntity = useCallback((x: number, y: number, type: PlaygroundEntity['type']): PlaygroundEntity => {
    const colors = {
      particle: `hsl(${Math.random() * 360}, 70%, 60%)`,
      wave: `hsl(${200 + Math.random() * 60}, 80%, 65%)`,
      field: `hsl(${280 + Math.random() * 40}, 70%, 55%)`,
      vortex: `hsl(${0 + Math.random() * 40}, 85%, 65%)`,
      cluster: `hsl(${100 + Math.random() * 60}, 75%, 60%)`
    };

    return {
      id: `entity_${Date.now()}_${Math.random()}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * brushSize + 5,
      color: colors[type],
      type,
      energy: Math.random() * intensity + 20,
      lifetime: 1000 + Math.random() * 2000,
      interactions: 0,
      trail: []
    };
  }, [brushSize, intensity]);

  const handleCanvasInteraction = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setMousePos({ x, y });

    if (event.type === 'mousedown') {
      setIsDrawing(true);
    } else if (event.type === 'mouseup') {
      setIsDrawing(false);
    }

    if (isDrawing || event.type === 'click') {
      const newEntities: PlaygroundEntity[] = [];

      switch (selectedTool) {
        case 'particle':
          for (let i = 0; i < Math.ceil(intensity / 20); i++) {
            newEntities.push(generateEntity(
              x + (Math.random() - 0.5) * brushSize,
              y + (Math.random() - 0.5) * brushSize,
              'particle'
            ));
          }
          break;
        case 'wave':
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const distance = brushSize * 0.5;
            newEntities.push(generateEntity(
              x + Math.cos(angle) * distance,
              y + Math.sin(angle) * distance,
              'wave'
            ));
          }
          break;
        case 'field':
          newEntities.push(generateEntity(x, y, 'field'));
          break;
        case 'vortex':
          newEntities.push(generateEntity(x, y, 'vortex'));
          break;
        case 'eraser':
          setEntities(prev => prev.filter(entity => {
            const distance = Math.sqrt((entity.x - x) ** 2 + (entity.y - y) ** 2);
            return distance > brushSize;
          }));
          return;
      }

      if (newEntities.length > 0) {
        setEntities(prev => [...prev, ...newEntities]);
      }
    }
  }, [selectedTool, brushSize, intensity, isDrawing, generateEntity]);

  const updateEntities = useCallback(() => {
    setEntities(prev => {
      return prev.map(entity => {
        // Update trail
        const newTrail = [...entity.trail, { x: entity.x, y: entity.y, timestamp: Date.now() }]
          .filter(point => Date.now() - point.timestamp < 2000)
          .slice(-20);

        // Apply physics based on entity type
        let newVx = entity.vx;
        let newVy = entity.vy;
        let newX = entity.x;
        let newY = entity.y;

        switch (entity.type) {
          case 'particle':
            newVy += gravity;
            newVx *= friction;
            newVy *= friction;
            break;
          case 'wave':
            const waveTime = Date.now() * 0.001;
            newVx = Math.sin(waveTime + entity.id.length) * 2;
            newVy = Math.cos(waveTime + entity.id.length) * 2;
            break;
          case 'field':
            // Fields attract nearby particles
            newVx *= 0.9;
            newVy *= 0.9;
            break;
          case 'vortex':
            // Circular motion
            const centerX = entity.x;
            const centerY = entity.y;
            const angle = Math.atan2(newVy, newVx) + 0.1;
            const speed = Math.sqrt(newVx * newVx + newVy * newVy);
            newVx = Math.cos(angle) * speed * 0.95;
            newVy = Math.sin(angle) * speed * 0.95;
            break;
        }

        newX += newVx;
        newY += newVy;

        // Boundary bouncing
        const canvas = canvasRef.current;
        if (canvas) {
          if (newX <= 0 || newX >= canvas.width) newVx *= -0.8;
          if (newY <= 0 || newY >= canvas.height) newVy *= -0.8;
          newX = Math.max(0, Math.min(canvas.width, newX));
          newY = Math.max(0, Math.min(canvas.height, newY));
        }

        return {
          ...entity,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          trail: newTrail,
          lifetime: entity.lifetime - 16, // Assume 60fps
          energy: Math.max(0, entity.energy - 0.1)
        };
      }).filter(entity => entity.lifetime > 0 && entity.energy > 0);
    });
  }, [gravity, friction]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw entities
    entities.forEach(entity => {
      // Draw trails
      if (showTrails && entity.trail.length > 1) {
        ctx.strokeStyle = entity.color + '40';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(entity.trail[0].x, entity.trail[0].y);
        entity.trail.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }

      // Draw entity
      ctx.fillStyle = entity.color;
      ctx.beginPath();
      
      switch (entity.type) {
        case 'particle':
          ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
          break;
        case 'wave':
          const size = entity.size + Math.sin(Date.now() * 0.01) * 5;
          ctx.arc(entity.x, entity.y, size, 0, Math.PI * 2);
          break;
        case 'field':
          ctx.save();
          ctx.globalAlpha = 0.3;
          ctx.arc(entity.x, entity.y, entity.size * 3, 0, Math.PI * 2);
          ctx.restore();
          ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
          break;
        case 'vortex':
          ctx.save();
          ctx.translate(entity.x, entity.y);
          ctx.rotate(Date.now() * 0.01);
          ctx.fillRect(-entity.size, -entity.size/4, entity.size*2, entity.size/2);
          ctx.fillRect(-entity.size/4, -entity.size, entity.size/2, entity.size*2);
          ctx.restore();
          break;
      }
      
      ctx.fill();

      // Draw energy indicator
      if (entity.energy > 0) {
        const energyHeight = (entity.energy / 100) * 20;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
        ctx.fillRect(entity.x - entity.size/2, entity.y - entity.size - 25, 3, 20);
        ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
        ctx.fillRect(entity.x - entity.size/2, entity.y - entity.size - 25 + (20 - energyHeight), 3, energyHeight);
      }
    });

    // Draw brush preview
    if (selectedTool !== 'eraser') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, brushSize, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [entities, showTrails, selectedTool, brushSize, mousePos]);

  const animate = useCallback(() => {
    if (isRunning) {
      updateEntities();
      renderCanvas();
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, updateEntities, renderCanvas]);

  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, animate]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const startSimulation = () => setIsRunning(true);
  const pauseSimulation = () => setIsRunning(false);
  const clearCanvas = () => {
    setEntities([]);
    setIsRunning(false);
  };

  const addRandomEntities = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newEntities: PlaygroundEntity[] = [];
    for (let i = 0; i < 20; i++) {
      const types: PlaygroundEntity['type'][] = ['particle', 'wave', 'field', 'vortex'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      newEntities.push(generateEntity(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        randomType
      ));
    }
    setEntities(prev => [...prev, ...newEntities]);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-400" />
            Interactive Canvas Playground
          </CardTitle>
          <CardDescription>
            Create and manipulate particles, waves, and force fields in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Button onClick={startSimulation} disabled={isRunning} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start
              </Button>
              <Button onClick={pauseSimulation} disabled={!isRunning} variant="outline" className="flex items-center gap-2">
                <Pause className="h-4 w-4" />
                Pause
              </Button>
              <Button onClick={clearCanvas} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>
              <Button onClick={addRandomEntities} variant="outline" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Random
              </Button>
              <Badge variant="outline" className="ml-auto">
                Entities: {entities.length}
              </Badge>
            </div>

            <Tabs defaultValue="tools" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="physics">Physics</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
              </TabsList>

              <TabsContent value="tools" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {tools.map(tool => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "outline"}
                      onClick={() => setSelectedTool(tool.id)}
                      className="flex flex-col items-center gap-1 h-auto p-3"
                      title={tool.description}
                    >
                      {tool.icon}
                      <span className="text-xs">{tool.name}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Brush Size: {brushSize}px</label>
                    <Slider
                      value={[brushSize]}
                      onValueChange={([value]) => setBrushSize(value)}
                      min={5}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Intensity: {intensity}%</label>
                    <Slider
                      value={[intensity]}
                      onValueChange={([value]) => setIntensity(value)}
                      min={10}
                      max={100}
                      step={10}
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="physics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Gravity: {gravity.toFixed(2)}</label>
                    <Slider
                      value={[gravity]}
                      onValueChange={([value]) => setGravity(value)}
                      min={0}
                      max={1}
                      step={0.01}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Friction: {friction.toFixed(2)}</label>
                    <Slider
                      value={[friction]}
                      onValueChange={([value]) => setFriction(value)}
                      min={0.8}
                      max={1}
                      step={0.01}
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="visual" className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant={showTrails ? "default" : "outline"}
                    onClick={() => setShowTrails(!showTrails)}
                    className="flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    Trails
                  </Button>
                  <Button
                    variant={showFields ? "default" : "outline"}
                    onClick={() => setShowFields(!showFields)}
                    className="flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    Fields
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="border border-slate-600 rounded-lg bg-slate-900 cursor-crosshair w-full"
              style={{ cursor: tools.find(t => t.id === selectedTool)?.cursor }}
              onMouseDown={handleCanvasInteraction}
              onMouseUp={handleCanvasInteraction}
              onMouseMove={handleCanvasInteraction}
              onClick={handleCanvasInteraction}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveCanvasPlayground;
