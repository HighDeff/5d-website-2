interface FontStyle {
  family: string;
  size: string;
  weight: string;
  style: string;
  lineHeight: string;
  letterSpacing: string;
}

interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

interface ColorWheelData {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  hex: string;
  rgb: string;
  hsl: string;
}

interface FontChangeRequest {
  selector: string;
  property: "family" | "size" | "weight" | "color";
  value: string;
  userId: string;
  timestamp: Date;
}

class FontColorAI {
  private availableFonts: string[] = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Source Sans Pro",
    "Playfair Display",
    "Merriweather",
    "Raleway",
    "Ubuntu",
    "Nunito",
  ];

  private colorPalettes: Map<string, ColorPalette> = new Map();
  private userPreferences: Map<string, any> = new Map();
  private fontChangeHistory: FontChangeRequest[] = [];

  constructor() {
    this.initializeColorPalettes();
  }

  private initializeColorPalettes(): void {
    const palettes: ColorPalette[] = [
      {
        id: "modern",
        name: "Modern",
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#1f2937",
        border: "#e5e7eb",
      },
      {
        id: "dark",
        name: "Dark Mode",
        primary: "#60a5fa",
        secondary: "#9ca3af",
        accent: "#fbbf24",
        background: "#111827",
        text: "#f9fafb",
        border: "#374151",
      },
      {
        id: "warm",
        name: "Warm Tones",
        primary: "#dc2626",
        secondary: "#ea580c",
        accent: "#d97706",
        background: "#fef7ed",
        text: "#451a03",
        border: "#fed7aa",
      },
    ];

    palettes.forEach((palette) => {
      this.colorPalettes.set(palette.id, palette);
    });
  }

  async changeFont(
    selector: string,
    fontFamily: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const elements = document.querySelectorAll(selector);

      if (elements.length === 0) {
        throw new Error(`No elements found for selector: ${selector}`);
      }

      // Validate font availability
      if (!this.availableFonts.includes(fontFamily)) {
        throw new Error(`Font ${fontFamily} is not available`);
      }

      // Apply font change
      elements.forEach((element) => {
        (element as HTMLElement).style.fontFamily = fontFamily;
      });

      // Record the change
      this.fontChangeHistory.push({
        selector,
        property: "family",
        value: fontFamily,
        userId,
        timestamp: new Date(),
      });

      // Update user preferences
      const userPrefs = this.userPreferences.get(userId) || {};
      userPrefs.preferredFont = fontFamily;
      this.userPreferences.set(userId, userPrefs);

      return true;
    } catch (error) {
      console.error("Font change failed:", error);
      return false;
    }
  }

  async changeFontSize(
    selector: string,
    fontSize: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const elements = document.querySelectorAll(selector);

      elements.forEach((element) => {
        (element as HTMLElement).style.fontSize = fontSize;
      });

      this.fontChangeHistory.push({
        selector,
        property: "size",
        value: fontSize,
        userId,
        timestamp: new Date(),
      });

      return true;
    } catch (error) {
      console.error("Font size change failed:", error);
      return false;
    }
  }

  async changeColor(
    selector: string,
    color: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const elements = document.querySelectorAll(selector);

      // Validate color format
      if (!this.isValidColor(color)) {
        throw new Error(`Invalid color format: ${color}`);
      }

      elements.forEach((element) => {
        (element as HTMLElement).style.color = color;
      });

      this.fontChangeHistory.push({
        selector,
        property: "color",
        value: color,
        userId,
        timestamp: new Date(),
      });

      return true;
    } catch (error) {
      console.error("Color change failed:", error);
      return false;
    }
  }

  generateColorWheel(): ColorWheelData[] {
    const colors: ColorWheelData[] = [];

    for (let hue = 0; hue < 360; hue += 15) {
      for (let saturation = 20; saturation <= 100; saturation += 20) {
        for (let lightness = 20; lightness <= 80; lightness += 20) {
          const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          const rgb = this.hslToRgb(hue, saturation, lightness);
          const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

          colors.push({
            hue,
            saturation,
            lightness,
            alpha: 1,
            hex,
            rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            hsl,
          });
        }
      }
    }

    return colors;
  }

  generateCustomColorWheel(baseColor: string): ColorWheelData[] {
    const baseHsl = this.hexToHsl(baseColor);
    const variations: ColorWheelData[] = [];

    // Generate variations of the base color
    for (let satDelta = -40; satDelta <= 40; satDelta += 10) {
      for (let lightDelta = -30; lightDelta <= 30; lightDelta += 10) {
        const newSat = Math.max(0, Math.min(100, baseHsl.s + satDelta));
        const newLight = Math.max(10, Math.min(90, baseHsl.l + lightDelta));

        const hsl = `hsl(${baseHsl.h}, ${newSat}%, ${newLight}%)`;
        const rgb = this.hslToRgb(baseHsl.h, newSat, newLight);
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

        variations.push({
          hue: baseHsl.h,
          saturation: newSat,
          lightness: newLight,
          alpha: 1,
          hex,
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          hsl,
        });
      }
    }

    return variations;
  }

  async applyColorPalette(paletteId: string, userId: string): Promise<boolean> {
    try {
      const palette = this.colorPalettes.get(paletteId);
      if (!palette) {
        throw new Error(`Palette ${paletteId} not found`);
      }

      // Apply palette to common elements
      const colorMappings = [
        {
          selector: "body",
          property: "background-color",
          color: palette.background,
        },
        { selector: "body", property: "color", color: palette.text },
        {
          selector: ".btn-primary, [data-primary]",
          property: "background-color",
          color: palette.primary,
        },
        {
          selector: ".btn-secondary, [data-secondary]",
          property: "background-color",
          color: palette.secondary,
        },
        {
          selector: ".accent, [data-accent]",
          property: "color",
          color: palette.accent,
        },
        {
          selector: "border, .border, [data-border]",
          property: "border-color",
          color: palette.border,
        },
      ];

      colorMappings.forEach((mapping) => {
        const elements = document.querySelectorAll(mapping.selector);
        elements.forEach((element) => {
          (element as HTMLElement).style.setProperty(
            mapping.property,
            mapping.color,
          );
        });
      });

      // Update user preferences
      const userPrefs = this.userPreferences.get(userId) || {};
      userPrefs.preferredPalette = paletteId;
      this.userPreferences.set(userId, userPrefs);

      return true;
    } catch (error) {
      console.error("Palette application failed:", error);
      return false;
    }
  }

  generateComplementaryColors(baseColor: string): string[] {
    const hsl = this.hexToHsl(baseColor);
    const complementary = (hsl.h + 180) % 360;

    const colors = [
      baseColor,
      this.hslToHex(complementary, hsl.s, hsl.l),
      this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
      this.hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 20)),
      this.hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 20)),
    ];

    return colors;
  }

  async analyzeAccessibility(
    foreground: string,
    background: string,
  ): Promise<{
    ratio: number;
    level: "AAA" | "AA" | "Fail";
    recommendation?: string;
  }> {
    const fgLuminance = this.calculateLuminance(foreground);
    const bgLuminance = this.calculateLuminance(background);

    const ratio =
      (Math.max(fgLuminance, bgLuminance) + 0.05) /
      (Math.min(fgLuminance, bgLuminance) + 0.05);

    let level: "AAA" | "AA" | "Fail";
    let recommendation: string | undefined;

    if (ratio >= 7) {
      level = "AAA";
    } else if (ratio >= 4.5) {
      level = "AA";
    } else {
      level = "Fail";
      recommendation =
        ratio < 3
          ? "Increase contrast significantly for better readability"
          : "Slightly increase contrast to meet AA standards";
    }

    return { ratio, level, recommendation };
  }

  private isValidColor(color: string): boolean {
    const colorRegex =
      /^(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\(\d+,\s*\d+,\s*\d+\)|rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)|hsl\(\d+,\s*\d+%,\s*\d+%\))$/;
    return colorRegex.test(color);
  }

  private hslToRgb(
    h: number,
    s: number,
    l: number,
  ): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    return {
      r: Math.round(f(0) * 255),
      g: Math.round(f(8) * 255),
      b: Math.round(f(4) * 255),
    };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const rgb = this.hexToRgb(hex);
    return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  private rgbToHsl(
    r: number,
    g: number,
    b: number,
  ): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

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
  }

  private hslToHex(h: number, s: number, l: number): string {
    const rgb = this.hslToRgb(h, s, l);
    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  private calculateLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    const r =
      rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g =
      gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b =
      bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  getUserPreferences(userId: string): any {
    return this.userPreferences.get(userId) || {};
  }

  getFontChangeHistory(userId?: string): FontChangeRequest[] {
    if (userId) {
      return this.fontChangeHistory.filter(
        (change) => change.userId === userId,
      );
    }
    return this.fontChangeHistory;
  }

  getAvailableFonts(): string[] {
    return [...this.availableFonts];
  }

  getColorPalettes(): ColorPalette[] {
    return Array.from(this.colorPalettes.values());
  }
}

export const fontColorAI = new FontColorAI();
export type { FontStyle, ColorPalette, ColorWheelData, FontChangeRequest };
