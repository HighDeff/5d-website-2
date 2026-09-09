import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings,
  Palette,
  Activity,
  Zap,
  Eye,
  Grid,
  Layers,
  Target,
  Brain,
  Gauge,
  Sliders,
  Monitor,
  Save,
  RotateCcw,
  Download,
  Upload
} from "lucide-react";

interface CanvasSettings {
  // Visual Settings
  backgroundColor: string;
  gridEnabled: boolean;
  gridSize: number;
  gridOpacity: number;
  showTrails: boolean;
  trailLength: number;
  
  // Performance Settings
  maxEntities: number;
  frameRate: number;
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  enablePhysics: boolean;
  
  // AI Settings
  aiResponseTime: number;
  confidenceThreshold: number;
  anomalyDetection: boolean;
  autoFix: boolean;
  learningMode: boolean;
  
  // Interaction Settings
  mouseTracking: boolean;
  clickEffects: boolean;
  hoverInfo: boolean;
  touchGestures: boolean;
  
  // Advanced Settings
  quantumMode: boolean;
  multiDimensional: boolean;
  timeCompression: number;
  realityDistortion: number;
}

const defaultSettings: CanvasSettings = {
  backgroundColor: "#0f172a",
  gridEnabled: true,
  gridSize: 20,
  gridOpacity: 0.3,
  showTrails: true,
  trailLength: 10,
  maxEntities: 100,
  frameRate: 60,
  renderQuality: 'high',
  enablePhysics: true,
  aiResponseTime: 100,
  confidenceThreshold: 0.7,
  anomalyDetection: true,
  autoFix: true,
  learningMode: true,
  mouseTracking: true,
  clickEffects: true,
  hoverInfo: true,
  touchGestures: true,
  quantumMode: false,
  multiDimensional: false,
  timeCompression: 1.0,
  realityDistortion: 0.0
};

const AdvancedCanvasSettings: React.FC = () => {
  const [settings, setSettings] = useState<CanvasSettings>(defaultSettings);
  const [isApplying, setIsApplying] = useState(false);
  const [presets, setPresets] = useState<{ [key: string]: CanvasSettings }>({
    performance: { ...defaultSettings, renderQuality: 'low', maxEntities: 50, frameRate: 30 },
    quality: { ...defaultSettings, renderQuality: 'ultra', maxEntities: 200, frameRate: 120 },
    experimental: { ...defaultSettings, quantumMode: true, multiDimensional: true, timeCompression: 2.0 }
  });

  const updateSetting = <K extends keyof CanvasSettings>(key: K, value: CanvasSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applySettings = async () => {
    setIsApplying(true);
    try {
      // Apply settings to canvas system
      console.log('Applying canvas settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Failed to apply settings:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  const loadPreset = (presetName: string) => {
    if (presets[presetName]) {
      setSettings(presets[presetName]);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'canvas-settings.json';
    link.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings({ ...defaultSettings, ...imported });
        } catch (error) {
          console.error('Failed to import settings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-400" />
            Advanced Canvas Settings
          </CardTitle>
          <CardDescription>
            Configure all aspects of canvas behavior, performance, and AI integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={applySettings} disabled={isApplying} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isApplying ? 'Applying...' : 'Apply Settings'}
            </Button>
            <Button onClick={resetToDefaults} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button onClick={exportSettings} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
          </div>

          <Tabs defaultValue="visual" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 bg-slate-700">
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="ai">AI Settings</TabsTrigger>
              <TabsTrigger value="interaction">Interaction</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="gridEnabled">Show Grid</Label>
                    <Switch
                      id="gridEnabled"
                      checked={settings.gridEnabled}
                      onCheckedChange={(checked) => updateSetting('gridEnabled', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gridSize">Grid Size: {settings.gridSize}px</Label>
                    <Slider
                      id="gridSize"
                      min={10}
                      max={100}
                      step={5}
                      value={[settings.gridSize]}
                      onValueChange={([value]) => updateSetting('gridSize', value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gridOpacity">Grid Opacity: {Math.round(settings.gridOpacity * 100)}%</Label>
                    <Slider
                      id="gridOpacity"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[settings.gridOpacity]}
                      onValueChange={([value]) => updateSetting('gridOpacity', value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showTrails">Show Entity Trails</Label>
                    <Switch
                      id="showTrails"
                      checked={settings.showTrails}
                      onCheckedChange={(checked) => updateSetting('showTrails', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="trailLength">Trail Length: {settings.trailLength}</Label>
                    <Slider
                      id="trailLength"
                      min={5}
                      max={50}
                      step={1}
                      value={[settings.trailLength]}
                      onValueChange={([value]) => updateSetting('trailLength', value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxEntities">Max Entities: {settings.maxEntities}</Label>
                    <Slider
                      id="maxEntities"
                      min={10}
                      max={500}
                      step={10}
                      value={[settings.maxEntities]}
                      onValueChange={([value]) => updateSetting('maxEntities', value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="frameRate">Target Frame Rate: {settings.frameRate} FPS</Label>
                    <Slider
                      id="frameRate"
                      min={15}
                      max={144}
                      step={15}
                      value={[settings.frameRate]}
                      onValueChange={([value]) => updateSetting('frameRate', value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="renderQuality">Render Quality</Label>
                    <Select
                      value={settings.renderQuality}
                      onValueChange={(value: any) => updateSetting('renderQuality', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="ultra">Ultra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enablePhysics">Enable Physics</Label>
                    <Switch
                      id="enablePhysics"
                      checked={settings.enablePhysics}
                      onCheckedChange={(checked) => updateSetting('enablePhysics', checked)}
                    />
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Performance Presets</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadPreset('performance')}
                        className="w-full"
                      >
                        Performance Mode
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadPreset('quality')}
                        className="w-full"
                      >
                        Quality Mode
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadPreset('experimental')}
                        className="w-full"
                      >
                        Experimental Mode
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aiResponseTime">AI Response Time: {settings.aiResponseTime}ms</Label>
                    <Slider
                      id="aiResponseTime"
                      min={50}
                      max={1000}
                      step={25}
                      value={[settings.aiResponseTime]}
                      onValueChange={([value]) => updateSetting('aiResponseTime', value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confidenceThreshold">
                      Confidence Threshold: {Math.round(settings.confidenceThreshold * 100)}%
                    </Label>
                    <Slider
                      id="confidenceThreshold"
                      min={0}
                      max={1}
                      step={0.05}
                      value={[settings.confidenceThreshold]}
                      onValueChange={([value]) => updateSetting('confidenceThreshold', value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="anomalyDetection">Anomaly Detection</Label>
                    <Switch
                      id="anomalyDetection"
                      checked={settings.anomalyDetection}
                      onCheckedChange={(checked) => updateSetting('anomalyDetection', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoFix">Auto-Fix Mode</Label>
                    <Switch
                      id="autoFix"
                      checked={settings.autoFix}
                      onCheckedChange={(checked) => updateSetting('autoFix', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="learningMode">Learning Mode</Label>
                    <Switch
                      id="learningMode"
                      checked={settings.learningMode}
                      onCheckedChange={(checked) => updateSetting('learningMode', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="interaction" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mouseTracking">Mouse Tracking</Label>
                    <Switch
                      id="mouseTracking"
                      checked={settings.mouseTracking}
                      onCheckedChange={(checked) => updateSetting('mouseTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="clickEffects">Click Effects</Label>
                    <Switch
                      id="clickEffects"
                      checked={settings.clickEffects}
                      onCheckedChange={(checked) => updateSetting('clickEffects', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hoverInfo">Hover Information</Label>
                    <Switch
                      id="hoverInfo"
                      checked={settings.hoverInfo}
                      onCheckedChange={(checked) => updateSetting('hoverInfo', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="touchGestures">Touch Gestures</Label>
                    <Switch
                      id="touchGestures"
                      checked={settings.touchGestures}
                      onCheckedChange={(checked) => updateSetting('touchGestures', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="bg-amber-900/20 border border-amber-600 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Brain className="h-4 w-4" />
                  <span className="font-semibold">Experimental Features</span>
                </div>
                <p className="text-sm text-amber-300">
                  These features are experimental and may affect canvas stability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quantumMode">Quantum Mode</Label>
                    <Switch
                      id="quantumMode"
                      checked={settings.quantumMode}
                      onCheckedChange={(checked) => updateSetting('quantumMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="multiDimensional">Multi-Dimensional View</Label>
                    <Switch
                      id="multiDimensional"
                      checked={settings.multiDimensional}
                      onCheckedChange={(checked) => updateSetting('multiDimensional', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="timeCompression">Time Compression: {settings.timeCompression}x</Label>
                    <Slider
                      id="timeCompression"
                      min={0.1}
                      max={5.0}
                      step={0.1}
                      value={[settings.timeCompression]}
                      onValueChange={([value]) => updateSetting('timeCompression', value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="realityDistortion">
                      Reality Distortion: {Math.round(settings.realityDistortion * 100)}%
                    </Label>
                    <Slider
                      id="realityDistortion"
                      min={0}
                      max={1}
                      step={0.05}
                      value={[settings.realityDistortion]}
                      onValueChange={([value]) => updateSetting('realityDistortion', value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedCanvasSettings;
