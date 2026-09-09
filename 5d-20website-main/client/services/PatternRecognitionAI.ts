// Advanced Pattern Recognition AI - Image Analysis, OCR, and Pattern Matching
// Based on extending AIs conversation - creating pattern AI for image analysis

import AIMemorySystem from "./AIMemorySystem";

export interface ImagePattern {
  id: string;
  type: "button" | "text" | "image" | "layout" | "color" | "shape";
  features: {
    colors: string[];
    dimensions: { width: number; height: number };
    position: { x: number; y: number };
    text?: string;
    confidence: number;
  };
  template: string; // Base64 encoded template
  metadata: {
    frequency: number;
    lastSeen: string;
    context: string;
    reliability: number;
  };
}

export interface OCRResult {
  id: string;
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  language: string;
  timestamp: string;
}

export interface PatternMatch {
  pattern: ImagePattern;
  similarity: number;
  location: { x: number; y: number };
  context: string;
  suggestions: string[];
}

class PatternRecognitionAIService {
  private patterns: Map<string, ImagePattern> = new Map();
  private ocrCache: Map<string, OCRResult[]> = new Map();
  private isOCREnabled: boolean = true;
  private screenshotQueue: string[] = [];
  private processingQueue: Promise<any>[] = [];

  constructor() {
    this.initializePatternAI();
    this.startContinuousAnalysis();
  }

  private initializePatternAI() {
    console.log("🔍 Pattern Recognition AI initializing...");

    // Load existing patterns
    this.loadStoredPatterns();

    // Create default templates for common elements
    this.createDefaultPatterns();

    // Setup automatic screenshot and analysis
    this.setupAutomaticCapture();

    console.log(
      `🔍 Pattern Recognition AI ready with ${this.patterns.size} patterns`,
    );
  }

  // Advanced screenshot capture with analysis
  async captureAndAnalyze(
    options: {
      fullPage?: boolean;
      element?: HTMLElement;
      analyze?: boolean;
    } = {},
  ): Promise<{
    screenshot: string;
    patterns: PatternMatch[];
    ocr: OCRResult[];
    analysis: any;
  }> {
    try {
      // Capture screenshot
      const screenshot = await this.captureScreenshot(options);

      if (!options.analyze) {
        return {
          screenshot,
          patterns: [],
          ocr: [],
          analysis: {},
        };
      }

      // Analyze patterns in parallel
      const [patterns, ocr, analysis] = await Promise.all([
        this.analyzePatterns(screenshot),
        this.performOCR(screenshot),
        this.analyzeLayout(screenshot),
      ]);

      // Save to memory for learning
      AIMemorySystem.saveContext("pattern_ai", {
        context: {
          userInput: "screenshot_analysis",
          aiResponse: JSON.stringify({ patterns, ocr, analysis }),
          actionTaken: "pattern_analysis",
          results: { patternsFound: patterns.length, textFound: ocr.length },
          relatedTasks: [],
          collaboratingAIs: ["visual_ai", "ocr_ai"],
        },
        metadata: {
          category: "pattern_analysis",
          tags: ["screenshot", "patterns", "ocr"],
          success: true,
          priority: "medium",
        },
      });

      return {
        screenshot,
        patterns,
        ocr,
        analysis,
      };
    } catch (error) {
      console.error("Pattern analysis failed:", error);
      return {
        screenshot: "",
        patterns: [],
        ocr: [],
        analysis: { error: error.message },
      };
    }
  }

  private async captureScreenshot(options: {
    fullPage?: boolean;
    element?: HTMLElement;
  }): Promise<string> {
    return new Promise((resolve) => {
      if (options.element) {
        // Capture specific element
        this.captureElement(options.element).then(resolve);
      } else {
        // Capture full viewport or page
        this.captureViewport(options.fullPage || false).then(resolve);
      }
    });
  }

  private async captureElement(element: HTMLElement): Promise<string> {
    // Use html2canvas for element capture
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const rect = element.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;

      // Simple element capture using DOM
      if (ctx) {
        ctx.fillStyle = window.getComputedStyle(element).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add text content if present
        const text = element.textContent?.trim();
        if (text) {
          ctx.fillStyle = window.getComputedStyle(element).color;
          ctx.font = window.getComputedStyle(element).font;
          ctx.fillText(text, 10, 20);
        }
      }

      resolve(canvas.toDataURL());
    });
  }

  private async captureViewport(fullPage: boolean): Promise<string> {
    // Use browser's built-in screenshot capabilities
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = window.innerWidth;
      canvas.height = fullPage
        ? document.body.scrollHeight
        : window.innerHeight;

      if (ctx) {
        // Capture visible page
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add current page content representation
        const elements = document.querySelectorAll("*");
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const styles = window.getComputedStyle(el);
            ctx.fillStyle = styles.backgroundColor || "#f0f0f0";
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
          }
        });
      }

      resolve(canvas.toDataURL());
    });
  }

  // Advanced pattern analysis
  private async analyzePatterns(screenshot: string): Promise<PatternMatch[]> {
    const matches: PatternMatch[] = [];

    // Convert screenshot to analyzable format
    const analysisData = await this.preprocessImage(screenshot);

    // Compare against stored patterns
    for (const [id, pattern] of this.patterns) {
      const similarity = await this.calculatePatternSimilarity(
        analysisData,
        pattern,
      );

      if (similarity > 0.7) {
        // High confidence match
        matches.push({
          pattern,
          similarity,
          location: await this.findPatternLocation(analysisData, pattern),
          context: this.getPageContext(),
          suggestions: this.generatePatternSuggestions(pattern),
        });
      }
    }

    // Learn new patterns from this analysis
    await this.learnNewPatterns(analysisData);

    return matches.sort((a, b) => b.similarity - a.similarity);
  }

  private async preprocessImage(screenshot: string): Promise<any> {
    // Convert base64 to image data for analysis
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // Extract features for pattern matching
          const features = {
            imageData,
            colors: this.extractColors(imageData),
            edges: this.detectEdges(imageData),
            shapes: this.detectShapes(imageData),
            text: this.detectTextRegions(imageData),
          };

          resolve(features);
        }
      };
      img.src = screenshot;
    });
  }

  private extractColors(imageData: ImageData): string[] {
    const colors: Map<string, number> = new Map();
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = this.rgbToHex(r, g, b);

      colors.set(hex, (colors.get(hex) || 0) + 1);
    }

    // Return top 10 most frequent colors
    return Array.from(colors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((entry) => entry[0]);
  }

  private detectEdges(imageData: ImageData): any[] {
    // Simple edge detection using Sobel operator
    const edges = [];
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        // Simple gradient calculation
        const gx =
          data[idx + 4] -
          data[idx - 4] +
          2 * (data[idx + width * 4 + 4] - data[idx + width * 4 - 4]) +
          data[idx + 2 * width * 4 + 4] -
          data[idx + 2 * width * 4 - 4];

        const gy =
          data[idx - width * 4] -
          data[idx + width * 4] +
          2 * (data[idx - width * 4 + 4] - data[idx + width * 4 + 4]) +
          data[idx - width * 4 + 8] -
          data[idx + width * 4 + 8];

        const magnitude = Math.sqrt(gx * gx + gy * gy);

        if (magnitude > 50) {
          // Threshold for edge detection
          edges.push({ x, y, strength: magnitude });
        }
      }
    }

    return edges;
  }

  private detectShapes(imageData: ImageData): any[] {
    // Simple shape detection
    const shapes = [];
    const edges = this.detectEdges(imageData);

    // Group edges into potential shapes
    const edgeGroups = this.groupNearbyEdges(edges);

    edgeGroups.forEach((group) => {
      const shape = this.classifyShape(group);
      if (shape) {
        shapes.push(shape);
      }
    });

    return shapes;
  }

  private detectTextRegions(imageData: ImageData): any[] {
    // Simple text region detection based on color and edge patterns
    const textRegions = [];
    const edges = this.detectEdges(imageData);

    // Look for text-like patterns (horizontal lines, consistent spacing)
    const horizontalEdges = edges.filter(
      (edge) => Math.abs(edge.gx) > Math.abs(edge.gy),
    );

    // Group horizontal edges that might be text
    const textGroups = this.groupTextLikeEdges(horizontalEdges);

    textGroups.forEach((group) => {
      textRegions.push({
        x: Math.min(...group.map((e) => e.x)),
        y: Math.min(...group.map((e) => e.y)),
        width:
          Math.max(...group.map((e) => e.x)) -
          Math.min(...group.map((e) => e.x)),
        height:
          Math.max(...group.map((e) => e.y)) -
          Math.min(...group.map((e) => e.y)),
        confidence: this.calculateTextConfidence(group),
      });
    });

    return textRegions;
  }

  // OCR Implementation
  private async performOCR(screenshot: string): Promise<OCRResult[]> {
    if (!this.isOCREnabled) return [];

    try {
      // Simple OCR implementation
      const ocrResults = await this.extractTextFromImage(screenshot);

      // Cache results
      const cacheKey = this.generateImageHash(screenshot);
      this.ocrCache.set(cacheKey, ocrResults);

      return ocrResults;
    } catch (error) {
      console.error("OCR failed:", error);
      return [];
    }
  }

  private async extractTextFromImage(screenshot: string): Promise<OCRResult[]> {
    // Mock OCR implementation - in real app, integrate with Tesseract.js or cloud OCR
    const results: OCRResult[] = [];

    // Extract text from visible DOM elements for demonstration
    const textElements = document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, span, div, button, a",
    );

    textElements.forEach((element, index) => {
      const text = element.textContent?.trim();
      if (text && text.length > 0) {
        const rect = element.getBoundingClientRect();

        results.push({
          id: `ocr_${index}_${Date.now()}`,
          text,
          confidence: 0.9, // Mock confidence
          boundingBox: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
          language: "en",
          timestamp: new Date().toISOString(),
        });
      }
    });

    return results;
  }

  // Pattern learning and adaptation
  private async learnNewPatterns(analysisData: any) {
    // Don't learn new patterns if we have too many already
    if (this.patterns.size > 100) {
      console.log("Pattern limit reached, skipping new pattern learning");
      return;
    }

    // Selective element learning - only important elements
    const elements = document.querySelectorAll(
      "button:not([data-pattern-analyzed]), .card:not([data-pattern-analyzed]), .product-item:not([data-pattern-analyzed])",
    );

    // Limit to 5 new elements per analysis to prevent overflow
    const elementsToAnalyze = Array.from(elements).slice(0, 5);

    for (const element of elementsToAnalyze) {
      try {
        // Mark as analyzed to avoid re-processing
        (element as HTMLElement).setAttribute("data-pattern-analyzed", "true");

        const elementData = await this.analyzeElement(element as HTMLElement);

        // Skip if element is too simple (not worth learning)
        if (!this.isElementWorthLearning(elementData)) {
          continue;
        }

        // Check if this is a new pattern (with stricter similarity threshold)
        const existingPattern = this.findSimilarPattern(elementData, 0.9); // Higher threshold

        if (!existingPattern) {
          // Only create new pattern if we have space and it's valuable
          if (
            this.patterns.size < 80 &&
            this.shouldCreatePattern(elementData)
          ) {
            const pattern = await this.createPatternFromElement(
              element as HTMLElement,
              elementData,
            );
            this.patterns.set(pattern.id, pattern);
          }
        } else {
          // Update existing pattern frequency
          existingPattern.metadata.frequency++;
          existingPattern.metadata.lastSeen = new Date().toISOString();
          existingPattern.metadata.reliability = Math.min(
            existingPattern.metadata.reliability + 0.05, // Smaller increments
            1.0,
          );
        }
      } catch (error) {
        console.warn("Failed to analyze element for pattern learning:", error);
      }
    }

    // Only save if we actually learned something new
    if (elementsToAnalyze.length > 0) {
      this.throttledSavePatterns();
    }
  }

  private isElementWorthLearning(elementData: any): boolean {
    // Skip elements that are too simple or generic
    if (!elementData.text && !elementData.className) return false;

    // Skip very small elements
    if (elementData.dimensions.width < 20 || elementData.dimensions.height < 20)
      return false;

    // Skip elements with generic classes
    const genericClasses = ["div", "span", "p", "a", "img"];
    if (genericClasses.includes(elementData.tagName?.toLowerCase()))
      return false;

    return true;
  }

  private shouldCreatePattern(elementData: any): boolean {
    // Only create patterns for elements that appear valuable

    // Interactive elements are valuable
    if (["button", "a", "input"].includes(elementData.tagName?.toLowerCase()))
      return true;

    // Elements with meaningful classes
    if (
      elementData.className?.includes("card") ||
      elementData.className?.includes("product") ||
      elementData.className?.includes("btn")
    )
      return true;

    // Elements with significant text content
    if (elementData.text && elementData.text.length > 5) return true;

    return false;
  }

  private findSimilarPattern(
    elementData: any,
    threshold: number = 0.8,
  ): ImagePattern | null {
    for (const pattern of this.patterns.values()) {
      const similarity = this.calculateElementSimilarity(elementData, pattern);
      if (similarity > threshold) {
        return pattern;
      }
    }
    return null;
  }

  private throttledSavePatterns = (() => {
    let timeout: NodeJS.Timeout | null = null;
    return () => {
      if (timeout) return; // Already scheduled

      timeout = setTimeout(() => {
        try {
          this.savePatterns();
        } catch (error) {
          console.error("Throttled pattern save failed:", error);
        } finally {
          timeout = null;
        }
      }, 10000); // Save at most every 10 seconds
    };
  })();

  private async analyzeElement(element: HTMLElement): Promise<any> {
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);

    return {
      dimensions: { width: rect.width, height: rect.height },
      position: { x: rect.x, y: rect.y },
      colors: [styles.backgroundColor, styles.color, styles.borderColor],
      text: element.textContent?.trim(),
      className: element.className,
      tagName: element.tagName,
      styles: {
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        padding: styles.padding,
        margin: styles.margin,
        borderRadius: styles.borderRadius,
      },
    };
  }

  private async createPatternFromElement(
    element: HTMLElement,
    elementData: any,
  ): Promise<ImagePattern> {
    const template = await this.captureElement(element);

    return {
      id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.classifyElementType(element),
      features: {
        colors: elementData.colors.filter((c: string) => c !== "transparent"),
        dimensions: elementData.dimensions,
        position: elementData.position,
        text: elementData.text,
        confidence: 0.8,
      },
      template,
      metadata: {
        frequency: 1,
        lastSeen: new Date().toISOString(),
        context: this.getPageContext(),
        reliability: 0.8,
      },
    };
  }

  private classifyElementType(
    element: HTMLElement,
  ): "button" | "text" | "image" | "layout" | "color" | "shape" {
    if (
      element.tagName === "BUTTON" ||
      element.getAttribute("role") === "button"
    ) {
      return "button";
    }
    if (element.tagName === "IMG") {
      return "image";
    }
    if (
      ["H1", "H2", "H3", "H4", "H5", "H6", "P", "SPAN"].includes(
        element.tagName,
      )
    ) {
      return "text";
    }
    if (
      element.className.includes("card") ||
      element.className.includes("container")
    ) {
      return "layout";
    }
    return "shape";
  }

  // Advanced analysis functions
  private async analyzeLayout(screenshot: string): Promise<any> {
    return {
      pageStructure: this.analyzePageStructure(),
      responsiveness: this.analyzeResponsiveness(),
      accessibility: this.analyzeAccessibility(),
      performance: this.analyzePerformance(),
    };
  }

  private analyzePageStructure(): any {
    const structure = {
      header: !!document.querySelector("header, .header"),
      navigation: !!document.querySelector("nav, .navigation"),
      main: !!document.querySelector("main, .main-content"),
      sidebar: !!document.querySelector("aside, .sidebar"),
      footer: !!document.querySelector("footer, .footer"),
      sections: document.querySelectorAll("section").length,
      articles: document.querySelectorAll("article").length,
    };

    return structure;
  }

  private analyzeResponsiveness(): any {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    };

    const breakpoints = {
      mobile: viewport.width <= 768,
      tablet: viewport.width > 768 && viewport.width <= 1024,
      desktop: viewport.width > 1024,
    };

    return { viewport, breakpoints };
  }

  private analyzeAccessibility(): any {
    return {
      altTextMissing: document.querySelectorAll("img:not([alt])").length,
      buttonsWithoutLabels: document.querySelectorAll(
        "button:not([aria-label]):not([title])",
      ).length,
      headingStructure: this.analyzeHeadingStructure(),
      colorContrast: this.analyzeColorContrast(),
    };
  }

  private analyzePerformance(): any {
    return {
      domElements: document.querySelectorAll("*").length,
      images: document.querySelectorAll("img").length,
      scripts: document.querySelectorAll("script").length,
      stylesheets: document.querySelectorAll("link[rel='stylesheet']").length,
    };
  }

  // Utility functions
  private calculatePatternSimilarity(
    imageData: any,
    pattern: ImagePattern,
  ): Promise<number> {
    return new Promise((resolve) => {
      // Simple similarity calculation based on colors and dimensions
      let similarity = 0;

      // Color similarity
      const colorSimilarity = this.calculateColorSimilarity(
        imageData.colors,
        pattern.features.colors,
      );
      similarity += colorSimilarity * 0.4;

      // Dimension similarity (if available)
      if (pattern.features.dimensions) {
        const dimSimilarity = this.calculateDimensionSimilarity(
          imageData.dimensions || { width: 100, height: 100 },
          pattern.features.dimensions,
        );
        similarity += dimSimilarity * 0.3;
      }

      // Text similarity
      if (pattern.features.text && imageData.text) {
        try {
          const textSimilarity = this.calculateTextSimilarity(
            imageData.text,
            pattern.features.text,
          );
          similarity += textSimilarity * 0.3;
        } catch (error) {
          console.warn("Text similarity calculation failed:", error);
          // Skip text similarity if it fails
        }
      }

      resolve(Math.min(similarity, 1.0));
    });
  }

  private calculateColorSimilarity(
    colors1: string[],
    colors2: string[],
  ): number {
    if (!colors1.length || !colors2.length) return 0;

    let matches = 0;
    colors1.forEach((color1) => {
      colors2.forEach((color2) => {
        if (this.colorsAreSimilar(color1, color2)) {
          matches++;
        }
      });
    });

    return matches / Math.max(colors1.length, colors2.length);
  }

  private colorsAreSimilar(color1: string, color2: string): boolean {
    // Simple color similarity check
    if (color1 === color2) return true;

    // Convert to RGB and check difference
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return false;

    const diff = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2),
    );

    return diff < 50; // Threshold for similarity
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  private calculateDimensionSimilarity(
    dim1: { width: number; height: number },
    dim2: { width: number; height: number },
  ): number {
    const widthRatio =
      Math.min(dim1.width, dim2.width) / Math.max(dim1.width, dim2.width);
    const heightRatio =
      Math.min(dim1.height, dim2.height) / Math.max(dim1.height, dim2.height);
    return (widthRatio + heightRatio) / 2;
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Ensure both parameters are strings
    const str1 = typeof text1 === "string" ? text1 : String(text1 || "");
    const str2 = typeof text2 === "string" ? text2 : String(text2 || "");

    if (str1 === str2) return 1;
    if (!str1 || !str2) return 0;

    const words1 = str1.toLowerCase().split(" ");
    const words2 = str2.toLowerCase().split(" ");

    let matches = 0;
    words1.forEach((word1) => {
      if (words2.includes(word1)) matches++;
    });

    return matches / Math.max(words1.length, words2.length);
  }

  private generateImageHash(image: string): string {
    // Simple hash for caching
    let hash = 0;
    for (let i = 0; i < image.length; i++) {
      const char = image.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private getPageContext(): string {
    return `${window.location.pathname}_${document.title}`;
  }

  private findPatternLocation(
    imageData: any,
    pattern: ImagePattern,
  ): Promise<{ x: number; y: number }> {
    return Promise.resolve({ x: 0, y: 0 }); // Mock implementation
  }

  private generatePatternSuggestions(pattern: ImagePattern): string[] {
    const suggestions = [];

    if (pattern.type === "button") {
      suggestions.push("This looks like a button - check if it's functional");
      suggestions.push("Verify button accessibility");
    } else if (pattern.type === "text") {
      suggestions.push("Check text readability and contrast");
      suggestions.push("Verify text content is up to date");
    } else if (pattern.type === "image") {
      suggestions.push("Check image loading and alt text");
      suggestions.push("Verify image optimization");
    }

    return suggestions;
  }

  // Storage and persistence
  private loadStoredPatterns() {
    try {
      const stored = localStorage.getItem("ai_patterns");
      if (stored) {
        const patterns = JSON.parse(stored);
        this.patterns = new Map(patterns);
      }
    } catch (error) {
      console.error("Failed to load stored patterns:", error);
    }
  }

  private savePatterns() {
    try {
      // Primary storage: IndexedDB for larger capacity
      const patternsArray = Array.from(this.patterns.entries());
      this.savePatternsToIndexedDB(patternsArray);

      // Secondary storage: localStorage with compression and limits
      this.savePatternsToLocalStorage(patternsArray);
    } catch (error) {
      console.error("Failed to save patterns:", error);
      this.handlePatternStorageQuotaExceeded();
    }
  }

  private savePatternsToLocalStorage(patternsArray: any[]) {
    try {
      // Compress and filter patterns for localStorage
      const compressedPatterns = this.compressPatterns(patternsArray);
      const patternsData = JSON.stringify(compressedPatterns);

      // Check size limit (1MB for patterns)
      const maxSize = 1024 * 1024; // 1MB

      if (patternsData.length > maxSize) {
        console.warn(
          `Patterns data too large (${patternsData.length} bytes), using emergency compression`,
        );
        const emergencyPatterns = this.emergencyCompressPatterns(patternsArray);
        localStorage.setItem("ai_patterns", JSON.stringify(emergencyPatterns));
      } else {
        localStorage.setItem("ai_patterns", patternsData);
      }
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.warn(
          "Patterns localStorage quota exceeded, using IndexedDB only",
        );
        this.clearPatternLocalStorage();
      } else {
        throw error;
      }
    }
  }

  private compressPatterns(patternsArray: any[]): any[] {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;

    return patternsArray
      .filter(([id, pattern]) => {
        const lastSeen = new Date(pattern.metadata.lastSeen).getTime();

        // Keep recent patterns
        if (lastSeen > oneHourAgo) return true;

        // Keep frequently used patterns
        if (pattern.metadata.frequency > 5) return true;

        // Keep reliable patterns from last day
        if (lastSeen > oneDayAgo && pattern.metadata.reliability > 0.8)
          return true;

        return false;
      })
      .slice(-50) // Max 50 patterns in localStorage
      .map(([id, pattern]) => [
        id,
        {
          id: pattern.id,
          type: pattern.type,
          features: {
            colors: pattern.features.colors.slice(0, 3), // Max 3 colors
            dimensions: pattern.features.dimensions,
            confidence: pattern.features.confidence,
            text: pattern.features.text?.substring(0, 50) || undefined, // Truncate text
          },
          template: "", // Remove template data to save space
          metadata: {
            frequency: pattern.metadata.frequency,
            lastSeen: pattern.metadata.lastSeen,
            reliability: pattern.metadata.reliability,
            context: pattern.metadata.context?.substring(0, 50) || "",
          },
        },
      ]);
  }

  private emergencyCompressPatterns(patternsArray: any[]): any[] {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    return patternsArray
      .filter(([id, pattern]) => {
        const lastSeen = new Date(pattern.metadata.lastSeen).getTime();
        return lastSeen > oneHourAgo && pattern.metadata.frequency > 2;
      })
      .slice(-20) // Only 20 most recent patterns
      .map(([id, pattern]) => [
        id,
        {
          id: pattern.id,
          type: pattern.type,
          frequency: pattern.metadata.frequency,
          reliability: pattern.metadata.reliability,
          lastSeen: pattern.metadata.lastSeen,
        },
      ]);
  }

  private async savePatternsToIndexedDB(patternsArray: any[]) {
    try {
      const request = indexedDB.open("PatternDB", 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("patterns")) {
          db.createObjectStore("patterns");
        }
      };

      request.onsuccess = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("patterns")) {
          console.warn("Patterns object store does not exist");
          return;
        }

        try {
          const transaction = db.transaction(["patterns"], "readwrite");
          const store = transaction.objectStore("patterns");
          store.put(patternsArray, "data");
        } catch (transactionError) {
          console.error(
            "Failed to save patterns to IndexedDB:",
            transactionError,
          );
        }
      };

      request.onerror = () => {
        console.error("Failed to open patterns IndexedDB:", request.error);
      };
    } catch (error) {
      console.error("IndexedDB pattern save failed:", error);
    }
  }

  private handlePatternStorageQuotaExceeded() {
    console.warn("Pattern storage quota exceeded, performing cleanup");

    try {
      // Clear localStorage patterns
      this.clearPatternLocalStorage();

      // Aggressive pattern cleanup
      this.aggressivePatternCleanup();

      // Retry saving minimal data
      setTimeout(() => {
        this.savePatterns();
      }, 1000);
    } catch (error) {
      console.error("Pattern storage emergency cleanup failed:", error);
    }
  }

  private clearPatternLocalStorage() {
    try {
      localStorage.removeItem("ai_patterns");

      // Clear other pattern-related storage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key?.startsWith("pattern_") ||
          key?.includes("ocr_") ||
          key?.includes("template_")
        ) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      console.log(`Cleared ${keysToRemove.length} pattern storage keys`);
    } catch (error) {
      console.error("Failed to clear pattern localStorage:", error);
    }
  }

  private aggressivePatternCleanup() {
    const originalSize = this.patterns.size;
    const newPatterns = new Map();

    // Keep only the most valuable patterns
    const sortedPatterns = Array.from(this.patterns.entries()).sort(
      ([, a], [, b]) => {
        const scoreA = this.calculatePatternValue(a);
        const scoreB = this.calculatePatternValue(b);
        return scoreB - scoreA;
      },
    );

    // Keep top 30 patterns
    sortedPatterns.slice(0, 30).forEach(([id, pattern]) => {
      newPatterns.set(id, pattern);
    });

    this.patterns = newPatterns;

    console.log(
      `Aggressive pattern cleanup: ${originalSize} → ${this.patterns.size} patterns`,
    );
  }

  private calculatePatternValue(pattern: ImagePattern): number {
    let value = 0;

    // Frequency bonus
    value += pattern.metadata.frequency * 2;

    // Reliability bonus
    value += pattern.metadata.reliability * 10;

    // Recency bonus
    const hoursSinceLastSeen =
      (Date.now() - new Date(pattern.metadata.lastSeen).getTime()) /
      (1000 * 60 * 60);
    value += Math.max(0, 10 - hoursSinceLastSeen);

    // Type importance
    const typeBonus = {
      button: 5,
      text: 3,
      image: 4,
      layout: 6,
      color: 2,
      shape: 1,
    };
    value += typeBonus[pattern.type] || 0;

    return value;
  }

  private createDefaultPatterns() {
    // Create default patterns for common elements
    const defaultPatterns = [
      {
        name: "standard_button",
        type: "button" as const,
        features: {
          colors: ["#3b82f6", "#ffffff"],
          dimensions: { width: 120, height: 40 },
          confidence: 0.8,
        },
      },
      {
        name: "product_card",
        type: "layout" as const,
        features: {
          colors: ["#ffffff", "#f8fafc"],
          dimensions: { width: 300, height: 400 },
          confidence: 0.7,
        },
      },
    ];

    defaultPatterns.forEach((patternData) => {
      const pattern: ImagePattern = {
        id: `default_${patternData.name}`,
        type: patternData.type,
        features: {
          ...patternData.features,
          position: { x: 0, y: 0 },
        },
        template: "", // No template for default patterns
        metadata: {
          frequency: 1,
          lastSeen: new Date().toISOString(),
          context: "default",
          reliability: 0.9,
        },
      };

      this.patterns.set(pattern.id, pattern);
    });
  }

  private setupAutomaticCapture() {
    // Automatically capture and analyze on page changes
    let captureTimer: NodeJS.Timeout;

    const scheduleCapture = () => {
      clearTimeout(captureTimer);
      captureTimer = setTimeout(() => {
        this.captureAndAnalyze({ analyze: true });
      }, 2000); // Capture 2 seconds after last change
    };

    // Monitor for page changes
    const observer = new MutationObserver(() => {
      scheduleCapture();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Initial capture
    scheduleCapture();
  }

  private startContinuousAnalysis() {
    // Continuous analysis every 30 seconds
    setInterval(() => {
      this.captureAndAnalyze({ analyze: true });
    }, 30000);

    // Cleanup old patterns every 5 minutes
    setInterval(
      () => {
        this.cleanupOldPatterns();
      },
      5 * 60 * 1000,
    );
  }

  private cleanupOldPatterns() {
    const cutoffTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

    this.patterns.forEach((pattern, id) => {
      const lastSeen = new Date(pattern.metadata.lastSeen).getTime();
      if (lastSeen < cutoffTime && pattern.metadata.frequency < 3) {
        this.patterns.delete(id);
      }
    });

    this.savePatterns();
  }

  // Helper functions for shape and text detection
  private groupNearbyEdges(edges: any[]): any[][] {
    const groups: any[][] = [];
    const visited = new Set();

    edges.forEach((edge, i) => {
      if (visited.has(i)) return;

      const group = [edge];
      visited.add(i);

      // Find nearby edges
      edges.forEach((otherEdge, j) => {
        if (visited.has(j)) return;

        const distance = Math.sqrt(
          Math.pow(edge.x - otherEdge.x, 2) + Math.pow(edge.y - otherEdge.y, 2),
        );

        if (distance < 20) {
          // Threshold for grouping
          group.push(otherEdge);
          visited.add(j);
        }
      });

      if (group.length > 5) {
        // Minimum edges for a shape
        groups.push(group);
      }
    });

    return groups;
  }

  private classifyShape(edgeGroup: any[]): any | null {
    // Simple shape classification
    const bounds = this.calculateBounds(edgeGroup);
    const aspectRatio = bounds.width / bounds.height;

    if (aspectRatio > 0.8 && aspectRatio < 1.2) {
      return { type: "square", bounds, confidence: 0.7 };
    } else if (aspectRatio > 2) {
      return { type: "rectangle", bounds, confidence: 0.6 };
    } else if (this.looksLikeCircle(edgeGroup)) {
      return { type: "circle", bounds, confidence: 0.8 };
    }

    return null;
  }

  private calculateBounds(points: any[]): any {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);

    return {
      x: Math.min(...xs),
      y: Math.min(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys),
    };
  }

  private looksLikeCircle(edgeGroup: any[]): boolean {
    // Simple circle detection based on edge distribution
    const center = this.calculateCenter(edgeGroup);
    const distances = edgeGroup.map((edge) =>
      Math.sqrt(
        Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2),
      ),
    );

    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const variance =
      distances.reduce((a, b) => a + Math.pow(b - avgDistance, 2), 0) /
      distances.length;

    return variance < avgDistance * 0.2; // Low variance indicates circle
  }

  private calculateCenter(points: any[]): { x: number; y: number } {
    const sumX = points.reduce((sum, point) => sum + point.x, 0);
    const sumY = points.reduce((sum, point) => sum + point.y, 0);

    return {
      x: sumX / points.length,
      y: sumY / points.length,
    };
  }

  private groupTextLikeEdges(edges: any[]): any[][] {
    // Group edges that look like text
    const groups: any[][] = [];
    const visited = new Set();

    edges.forEach((edge, i) => {
      if (visited.has(i)) return;

      const group = [edge];
      visited.add(i);

      // Find horizontally aligned edges
      edges.forEach((otherEdge, j) => {
        if (visited.has(j)) return;

        const verticalDistance = Math.abs(edge.y - otherEdge.y);
        const horizontalDistance = Math.abs(edge.x - otherEdge.x);

        if (verticalDistance < 5 && horizontalDistance < 100) {
          group.push(otherEdge);
          visited.add(j);
        }
      });

      if (group.length > 3) {
        groups.push(group);
      }
    });

    return groups;
  }

  private calculateTextConfidence(edgeGroup: any[]): number {
    // Calculate confidence that this is text based on patterns
    const bounds = this.calculateBounds(edgeGroup);
    const aspectRatio = bounds.width / bounds.height;

    // Text typically has high width to height ratio
    if (aspectRatio > 3) return 0.8;
    if (aspectRatio > 2) return 0.6;
    return 0.3;
  }

  private analyzeHeadingStructure(): any {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const structure: any = {};

    headings.forEach((heading) => {
      const level = heading.tagName.toLowerCase();
      structure[level] = (structure[level] || 0) + 1;
    });

    return structure;
  }

  private analyzeColorContrast(): any {
    // Simple color contrast analysis
    const elements = document.querySelectorAll("*");
    let lowContrastCount = 0;

    elements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;

      if (bgColor && textColor && this.hasLowContrast(bgColor, textColor)) {
        lowContrastCount++;
      }
    });

    return { lowContrastElements: lowContrastCount };
  }

  private hasLowContrast(bgColor: string, textColor: string): boolean {
    // Simple contrast check - in real implementation, use WCAG contrast ratio
    return (
      bgColor === textColor || (bgColor === "white" && textColor === "yellow")
    );
  }

  private findSimilarPattern(elementData: any): ImagePattern | null {
    for (const pattern of this.patterns.values()) {
      const similarity = this.calculateElementSimilarity(elementData, pattern);
      if (similarity > 0.8) {
        return pattern;
      }
    }
    return null;
  }

  private calculateElementSimilarity(
    elementData: any,
    pattern: ImagePattern,
  ): number {
    let similarity = 0;

    // Compare dimensions
    if (elementData.dimensions && pattern.features.dimensions) {
      const dimSim = this.calculateDimensionSimilarity(
        elementData.dimensions,
        pattern.features.dimensions,
      );
      similarity += dimSim * 0.4;
    }

    // Compare colors
    if (elementData.colors && pattern.features.colors) {
      const colorSim = this.calculateColorSimilarity(
        elementData.colors,
        pattern.features.colors,
      );
      similarity += colorSim * 0.3;
    }

    // Compare text
    if (elementData.text && pattern.features.text) {
      try {
        const textSim = this.calculateTextSimilarity(
          elementData.text,
          pattern.features.text,
        );
        similarity += textSim * 0.3;
      } catch (error) {
        console.warn("Element text similarity calculation failed:", error);
        // Skip text similarity if it fails
      }
    }

    return similarity;
  }

  // Public API
  async getScreenshotWithAnalysis(options: any = {}): Promise<any> {
    return this.captureAndAnalyze(options);
  }

  getStoredPatterns(): ImagePattern[] {
    return Array.from(this.patterns.values());
  }

  getOCRResults(imageHash?: string): OCRResult[] {
    if (imageHash) {
      return this.ocrCache.get(imageHash) || [];
    }
    // Return all cached OCR results
    const allResults: OCRResult[] = [];
    this.ocrCache.forEach((results) => {
      allResults.push(...results);
    });
    return allResults;
  }

  enableOCR(enabled: boolean = true) {
    this.isOCREnabled = enabled;
    console.log(`🔍 OCR ${enabled ? "enabled" : "disabled"}`);
  }

  isOCRActive(): boolean {
    return this.isOCREnabled;
  }

  clearPatterns() {
    this.patterns.clear();
    this.savePatterns();
  }

  getPatternStats(): any {
    const patterns = Array.from(this.patterns.values());
    const stats = {
      totalPatterns: patterns.length,
      patternTypes: {} as any,
      averageReliability: 0,
      totalFrequency: 0,
    };

    patterns.forEach((pattern) => {
      stats.patternTypes[pattern.type] =
        (stats.patternTypes[pattern.type] || 0) + 1;
      stats.totalFrequency += pattern.metadata.frequency;
      stats.averageReliability += pattern.metadata.reliability;
    });

    if (patterns.length > 0) {
      stats.averageReliability /= patterns.length;
    }

    return stats;
  }
}

// Global instance
const PatternRecognitionAI = new PatternRecognitionAIService();

export default PatternRecognitionAI;
export { PatternRecognitionAIService };
