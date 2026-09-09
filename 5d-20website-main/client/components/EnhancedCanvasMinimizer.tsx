import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Minimize2, 
  Maximize2, 
  X, 
  Move, 
  Settings,
  Eye,
  EyeOff,
  Grid,
  Layers,
  Activity
} from "lucide-react";

interface CanvasItem {
  id: string;
  title: string;
  type: 'canvas' | 'ai-entity' | 'control-panel' | 'monitor';
  isMinimized: boolean;
  isDocked: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isVisible: boolean;
  status: 'active' | 'idle' | 'error' | 'processing';
}

const EnhancedCanvasMinimizer = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [selectedCanvas, setSelectedCanvas] = useState<string | null>(null);

  useEffect(() => {
    // Auto-detect canvases and AI components
    const detectCanvases = () => {
      const detectedItems: CanvasItem[] = [
        {
          id: 'main-canvas',
          title: 'Main AI Canvas',
          type: 'canvas',
          isMinimized: false,
          isDocked: false,
          position: { x: 100, y: 100 },
          size: { width: 600, height: 400 },
          isVisible: true,
          status: 'active'
        },
        {
          id: 'ai-control-center',
          title: 'AI Control Center',
          type: 'control-panel',
          isMinimized: false,
          isDocked: false,
          position: { x: 750, y: 100 },
          size: { width: 400, height: 500 },
          isVisible: true,
          status: 'active'
        },
        {
          id: 'entity-detector',
          title: '3D AI Entity Detector',
          type: 'ai-entity',
          isMinimized: false,
          isDocked: false,
          position: { x: 100, y: 550 },
          size: { width: 500, height: 300 },
          isVisible: true,
          status: 'processing'
        },
        {
          id: 'performance-monitor',
          title: 'Performance Monitor',
          type: 'monitor',
          isMinimized: true,
          isDocked: true,
          position: { x: 50, y: 50 },
          size: { width: 350, height: 250 },
          isVisible: true,
          status: 'active'
        }
      ];
      setCanvasItems(detectedItems);
    };

    detectCanvases();
    
    // Auto-detect new canvases every 5 seconds
    const interval = setInterval(detectCanvases, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleMinimize = (id: string) => {
    setCanvasItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isMinimized: !item.isMinimized, isDocked: item.isMinimized ? false : item.isDocked }
        : item
    ));
  };

  const toggleDock = (id: string) => {
    setCanvasItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isDocked: !item.isDocked, isMinimized: item.isDocked ? false : true }
        : item
    ));
  };

  const toggleVisibility = (id: string) => {
    setCanvasItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isVisible: !item.isVisible }
        : item
    ));
  };

  const closeCanvas = (id: string) => {
    setCanvasItems(prev => prev.filter(item => item.id !== id));
  };

  const getStatusColor = (status: CanvasItem['status']) => {
    switch (status) {
      case 'active': return 'bg-green-900 text-green-300 border-green-600';
      case 'processing': return 'bg-blue-900 text-blue-300 border-blue-600';
      case 'error': return 'bg-red-900 text-red-300 border-red-600';
      default: return 'bg-gray-900 text-gray-300 border-gray-600';
    }
  };

  const getTypeIcon = (type: CanvasItem['type']) => {
    switch (type) {
      case 'canvas': return <Layers className="h-4 w-4" />;
      case 'ai-entity': return <Activity className="h-4 w-4" />;
      case 'control-panel': return <Settings className="h-4 w-4" />;
      case 'monitor': return <Eye className="h-4 w-4" />;
      default: return <Grid className="h-4 w-4" />;
    }
  };

  const minimizedItems = canvasItems.filter(item => item.isMinimized);
  const dockedItems = canvasItems.filter(item => item.isDocked);

  return (
    <>
      {/* Canvas Manager Toggle */}
      <Button
        onClick={() => setIsManagerOpen(!isManagerOpen)}
        className="fixed top-20 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white"
        size="sm"
      >
        <Grid className="h-4 w-4 mr-2" />
        Canvas Manager
        {minimizedItems.length > 0 && (
          <Badge variant="outline" className="ml-2 bg-blue-900 text-blue-300 border-blue-600">
            {minimizedItems.length}
          </Badge>
        )}
      </Button>

      {/* Docked Items Bar */}
      {dockedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 p-2">
          <div className="flex items-center justify-center gap-2 max-w-6xl mx-auto">
            {dockedItems.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => toggleDock(item.id)}
                className="text-white hover:bg-slate-700 flex items-center gap-2"
              >
                {getTypeIcon(item.type)}
                <span className="hidden sm:inline">{item.title}</span>
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Canvas Manager Panel */}
      {isManagerOpen && (
        <div className="fixed top-16 left-4 z-50 w-96">
          <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Grid className="h-5 w-5 text-blue-400" />
                  Canvas Manager
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsManagerOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-slate-300">
                Manage all canvases and AI components
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {canvasItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Grid className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No canvases detected</p>
                  <p className="text-xs">Auto-scanning for components...</p>
                </div>
              ) : (
                canvasItems.map(item => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedCanvas === item.id 
                        ? 'bg-slate-700 border-blue-500' 
                        : 'bg-slate-800 border-slate-600 hover:bg-slate-700'
                    }`}
                    onClick={() => setSelectedCanvas(item.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        <span className="text-white font-medium text-sm">{item.title}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status === 'processing' && item.type === 'ai-entity' ? 'DETECTED' : item.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMinimize(item.id);
                        }}
                        className="text-slate-400 hover:text-white p-1 h-auto"
                        title={item.isMinimized ? "Maximize" : "Minimize"}
                      >
                        {item.isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDock(item.id);
                        }}
                        className="text-slate-400 hover:text-white p-1 h-auto"
                        title={item.isDocked ? "Undock" : "Dock to taskbar"}
                      >
                        <Move className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVisibility(item.id);
                        }}
                        className="text-slate-400 hover:text-white p-1 h-auto"
                        title={item.isVisible ? "Hide" : "Show"}
                      >
                        {item.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeCanvas(item.id);
                        }}
                        className="text-red-400 hover:text-red-300 p-1 h-auto"
                        title="Close"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {selectedCanvas === item.id && (
                      <div className="mt-3 pt-3 border-t border-slate-600 text-xs text-slate-300">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-400">Size:</span>
                            <br />
                            {item.size.width}×{item.size.height}
                          </div>
                          <div>
                            <span className="text-slate-400">Position:</span>
                            <br />
                            {item.position.x},{item.position.y}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {/* Quick Actions */}
              {canvasItems.length > 0 && (
                <div className="pt-3 border-t border-slate-700">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCanvasItems(prev => prev.map(item => ({ ...item, isMinimized: false, isDocked: false })))}
                      className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Maximize2 className="h-3 w-3 mr-1" />
                      Show All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCanvasItems(prev => prev.map(item => ({ ...item, isMinimized: true, isDocked: true })))}
                      className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Move className="h-3 w-3 mr-1" />
                      Dock All
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Individual Canvas Controls (overlay on detected canvases) */}
      {canvasItems.filter(item => !item.isMinimized && item.isVisible).map(item => (
        <div
          key={`controls-${item.id}`}
          className="fixed z-30 bg-slate-900/90 rounded-lg p-2 backdrop-blur-sm border border-slate-600"
          style={{ 
            left: item.position.x + item.size.width - 120, 
            top: item.position.y - 5 
          }}
        >
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleMinimize(item.id)}
              className="text-slate-400 hover:text-white p-1 h-auto"
              title="Minimize"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleDock(item.id)}
              className="text-slate-400 hover:text-white p-1 h-auto"
              title="Dock"
            >
              <Move className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => closeCanvas(item.id)}
              className="text-red-400 hover:text-red-300 p-1 h-auto"
              title="Close"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};

export default EnhancedCanvasMinimizer;
