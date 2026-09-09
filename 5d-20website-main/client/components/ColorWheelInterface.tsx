import React, { useState, useEffect, useRef, useCallback } from "react";
import { fontColorAI, ColorWheelData } from "../services/FontColorAI";

interface ColorWheelInterfaceProps {
  onColorSelect: (color: string) => void;
  baseColor?: string;
  showComplementary?: boolean;
  showAccessibility?: boolean;
  userId?: string;
}

const ColorWheelInterface: React.FC<ColorWheelInterfaceProps> = ({
  onColorSelect,
  baseColor = "#3b82f6",
  showComplementary = true,
  showAccessibility = true,
  userId,
}) => {
  const [selectedColor, setSelectedColor] = useState(baseColor);
  const [colorWheel, setColorWheel] = useState<ColorWheelData[]>([]);
  const [complementaryColors, setComplementaryColors] = useState<string[]>([]);
  const [accessibilityInfo, setAccessibilityInfo] = useState<any>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateColorWheel();
    if (showComplementary) {
      updateComplementaryColors();
    }
    if (showAccessibility) {
      updateAccessibilityInfo();
    }
  }, [selectedColor, isCustomMode]);

  const generateColorWheel = useCallback(() => {
    if (isCustomMode) {
      setColorWheel(fontColorAI.generateCustomColorWheel(selectedColor));
    } else {
      setColorWheel(fontColorAI.generateColorWheel());
    }
  }, [selectedColor, isCustomMode]);

  const updateComplementaryColors = useCallback(() => {
    const colors = fontColorAI.generateComplementaryColors(selectedColor);
    setComplementaryColors(colors);
  }, [selectedColor]);

  const updateAccessibilityInfo = useCallback(async () => {
    const info = await fontColorAI.analyzeAccessibility(
      selectedColor,
      "#ffffff",
    );
    setAccessibilityInfo(info);
  }, [selectedColor]);

  const drawColorWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = ((angle - 1) * Math.PI) / 180;
      const endAngle = (angle * Math.PI) / 180;

      for (let r = 0; r < radius; r += 1) {
        const saturation = r / radius;
        const lightness = 0.5;
        const color = `hsl(${angle}, ${saturation * 100}%, ${lightness * 100}%)`;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, startAngle, endAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw selected color indicator
    const selectedHsl = hexToHsl(selectedColor);
    const selectedAngle = (selectedHsl.h * Math.PI) / 180;
    const selectedRadius = (selectedHsl.s / 100) * radius;
    const selectedX = centerX + selectedRadius * Math.cos(selectedAngle);
    const selectedY = centerY + selectedRadius * Math.sin(selectedAngle);

    ctx.beginPath();
    ctx.arc(selectedX, selectedY, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [selectedColor]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const hue = angle < 0 ? angle + 360 : angle;
      const saturation = (distance / radius) * 100;
      const lightness = 50;

      const color = hslToHex(hue, saturation, lightness);
      handleColorChange(color);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorSelect(color);
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    const r = Math.round(f(0) * 255);
    const g = Math.round(f(8) * 255);
    const b = Math.round(f(4) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  useEffect(() => {
    drawColorWheel();
  }, [drawColorWheel]);

  return (
    <div className="color-wheel-interface p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Color Selection</h3>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-lg border-2 border-gray-300"
            style={{ backgroundColor: selectedColor }}
          />
          <div>
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="font-mono text-sm p-2 border rounded"
              placeholder="#000000"
            />
            <p className="text-xs text-gray-500 mt-1">Selected Color</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setIsCustomMode(false)}
            className={`px-3 py-1 rounded text-sm ${
              !isCustomMode ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Full Spectrum
          </button>
          <button
            onClick={() => setIsCustomMode(true)}
            className={`px-3 py-1 rounded text-sm ${
              isCustomMode ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Custom Variations
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          onClick={handleCanvasClick}
          className="border rounded cursor-crosshair"
        />
      </div>

      {showComplementary && complementaryColors.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Complementary Colors</h4>
          <div className="flex gap-2">
            {complementaryColors.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {showAccessibility && accessibilityInfo && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Accessibility Info</h4>
          <div className="text-sm bg-gray-50 p-3 rounded">
            <p>Contrast Ratio: {accessibilityInfo.ratio.toFixed(2)}</p>
            <p
              className={`font-medium ${
                accessibilityInfo.level === "AAA"
                  ? "text-green-600"
                  : accessibilityInfo.level === "AA"
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              WCAG Level: {accessibilityInfo.level}
            </p>
            {accessibilityInfo.recommendation && (
              <p className="text-gray-600 mt-1">
                {accessibilityInfo.recommendation}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-6 gap-2">
        {colorWheel.slice(0, 36).map((colorData, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
            style={{ backgroundColor: colorData.hex }}
            onClick={() => handleColorChange(colorData.hex)}
            title={`${colorData.hex} - HSL(${colorData.hue}, ${colorData.saturation}%, ${colorData.lightness}%)`}
          />
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Click on the color wheel or swatches to select a color</p>
        <p>Use the input field to enter specific hex values</p>
      </div>
    </div>
  );
};

export default ColorWheelInterface;
