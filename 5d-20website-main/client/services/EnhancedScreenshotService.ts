// Enhanced Screenshot Service - Captures, crops, and analyzes screenshots for error visualization
import AICentralCommand from "./AICentralCommand";

export interface ErrorScreenshot {
  id: string;
  timestamp: string;
  fullImage: string;
  croppedImage: string;
  errorArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  ocrText: string;
  errorType: string;
  errorDescription: string;
  suggestedFix: string;
  confidence: number;
  relatedElements: string[];
}

export interface SolutionPreview {
  id: string;
  taskId: string;
  beforeImage: string;
  mockupImage: string;
  description: string;
  steps: string[];
  expectedOutcome: string;
  confidence: number;
  implementationTime: number;
}

class EnhancedScreenshotService {
  private static instance: EnhancedScreenshotService;
  private errorScreenshots: Map<string, ErrorScreenshot> = new Map();
  private solutionPreviews: Map<string, SolutionPreview> = new Map();

  static getInstance(): EnhancedScreenshotService {
    if (!EnhancedScreenshotService.instance) {
      EnhancedScreenshotService.instance = new EnhancedScreenshotService();
    }
    return EnhancedScreenshotService.instance;
  }

  constructor() {
    console.log("📸 Enhanced Screenshot Service: Initialized");
  }

  async captureErrorScreenshot(
    errorElement: string,
    errorType: string,
    errorDescription: string,
  ): Promise<ErrorScreenshot> {
    try {
      console.log(`📸 Capturing error screenshot for: ${errorType}`);

      // Get the element that has the error
      const element = document.querySelector(errorElement);
      if (!element) {
        throw new Error(`Element not found: ${errorElement}`);
      }

      const rect = element.getBoundingClientRect();

      // Capture full page screenshot first
      const fullImage = await this.captureFullPage();

      // Crop the area around the error with some padding
      const padding = 50;
      const cropArea = {
        x: Math.max(0, rect.left - padding),
        y: Math.max(0, rect.top - padding),
        width: Math.min(
          window.innerWidth - rect.left + padding,
          rect.width + padding * 2,
        ),
        height: Math.min(
          window.innerHeight - rect.top + padding,
          rect.height + padding * 2,
        ),
      };

      const croppedImage = await this.cropImage(fullImage, cropArea);

      // Perform OCR on the cropped area
      const ocrText = await this.performOCROnArea(cropArea);

      // Find related elements
      const relatedElements = this.findRelatedElements(element);

      const errorScreenshot: ErrorScreenshot = {
        id: `error_${Date.now()}`,
        timestamp: new Date().toISOString(),
        fullImage,
        croppedImage,
        errorArea: cropArea,
        ocrText,
        errorType,
        errorDescription,
        suggestedFix: this.generateSuggestedFix(errorType, element),
        confidence: 0.8,
        relatedElements,
      };

      this.errorScreenshots.set(errorScreenshot.id, errorScreenshot);
      this.saveScreenshotsToStorage();

      console.log(`📸 Error screenshot captured: ${errorScreenshot.id}`);
      return errorScreenshot;
    } catch (error) {
      console.error("Failed to capture error screenshot:", error);
      throw error;
    }
  }

  async generateSolutionPreview(
    taskId: string,
    taskDescription: string,
  ): Promise<SolutionPreview> {
    try {
      console.log(`🎨 Generating solution preview for task: ${taskId}`);

      // Capture current state
      const beforeImage = await this.captureFullPage();

      // Generate a mockup of the expected solution
      const mockupImage = await this.generateSolutionMockup(taskDescription);

      // Extract implementation steps
      const steps = this.extractImplementationSteps(taskDescription);

      const solutionPreview: SolutionPreview = {
        id: `solution_${Date.now()}`,
        taskId,
        beforeImage,
        mockupImage,
        description: taskDescription,
        steps,
        expectedOutcome: this.generateExpectedOutcome(taskDescription),
        confidence: 0.7,
        implementationTime: this.estimateImplementationTime(steps),
      };

      this.solutionPreviews.set(solutionPreview.id, solutionPreview);
      this.saveSolutionPreviewsToStorage();

      console.log(`🎨 Solution preview generated: ${solutionPreview.id}`);
      return solutionPreview;
    } catch (error) {
      console.error("Failed to generate solution preview:", error);
      throw error;
    }
  }

  private async captureFullPage(): Promise<string> {
    try {
      // Create a canvas that captures the full page
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Cannot get canvas context");

      // Set canvas size to viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Fill with background color
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw visible elements as colored rectangles (simplified representation)
      const elements = document.querySelectorAll("*");
      Array.from(elements)
        .slice(0, 100)
        .forEach((element) => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);

          if (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.left >= 0 &&
            rect.top >= 0 &&
            rect.right <= window.innerWidth &&
            rect.bottom <= window.innerHeight
          ) {
            // Different colors for different element types
            let color = "#e5e7eb"; // Default gray
            if (element.tagName === "BUTTON") color = "#3b82f6"; // Blue for buttons
            if (element.classList.contains("error")) color = "#ef4444"; // Red for errors
            if (element.tagName === "INPUT") color = "#10b981"; // Green for inputs
            if (element.tagName === "A") color = "#8b5cf6"; // Purple for links

            ctx.fillStyle = color;
            ctx.fillRect(rect.left, rect.top, rect.width, rect.height);

            // Add text if element has text content
            if (element.textContent && element.textContent.trim().length < 50) {
              ctx.fillStyle = "#000000";
              ctx.font = "12px Arial";
              ctx.fillText(
                element.textContent.trim().substring(0, 20),
                rect.left + 2,
                rect.top + 15,
              );
            }
          }
        });

      return canvas.toDataURL();
    } catch (error) {
      console.warn("Failed to capture full page:", error);
      return "";
    }
  }

  private async cropImage(
    imageData: string,
    cropArea: { x: number; y: number; width: number; height: number },
  ): Promise<string> {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Cannot get canvas context");

      const img = new Image();
      img.src = imageData;

      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = cropArea.width;
          canvas.height = cropArea.height;

          ctx.drawImage(
            img,
            cropArea.x,
            cropArea.y,
            cropArea.width,
            cropArea.height,
            0,
            0,
            cropArea.width,
            cropArea.height,
          );

          resolve(canvas.toDataURL());
        };
      });
    } catch (error) {
      console.warn("Failed to crop image:", error);
      return imageData; // Return original if cropping fails
    }
  }

  private async performOCROnArea(area: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): Promise<string> {
    try {
      // Get all text elements in the specified area
      const textElements = document.querySelectorAll("*");
      const visibleText: string[] = [];

      textElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);

        // Check if element is in the specified area
        if (
          rect.left >= area.x &&
          rect.top >= area.y &&
          rect.right <= area.x + area.width &&
          rect.bottom <= area.y + area.height &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          element.textContent?.trim()
        ) {
          visibleText.push(element.textContent.trim());
        }
      });

      return visibleText.join(" ").substring(0, 500); // Limit to 500 chars
    } catch (error) {
      console.warn("OCR processing failed:", error);
      return "";
    }
  }

  private findRelatedElements(element: Element): string[] {
    const related: string[] = [];

    // Find parent container
    const parent = element.parentElement;
    if (parent) {
      related.push(this.generateElementSelector(parent));
    }

    // Find siblings
    const siblings = element.parentElement?.children;
    if (siblings) {
      Array.from(siblings).forEach((sibling) => {
        if (sibling !== element) {
          related.push(this.generateElementSelector(sibling));
        }
      });
    }

    // Find form if element is form-related
    if (
      element.tagName === "INPUT" ||
      element.tagName === "SELECT" ||
      element.tagName === "TEXTAREA"
    ) {
      const form = element.closest("form");
      if (form) {
        related.push(this.generateElementSelector(form));
      }
    }

    return related.slice(0, 5); // Limit to 5 related elements
  }

  private generateSuggestedFix(errorType: string, element: Element): string {
    switch (errorType) {
      case "broken-link":
        return `Update href attribute or add proper click handler to ${element.tagName}`;
      case "form-validation":
        return `Fix validation rules and add proper error messaging for ${element.tagName}`;
      case "missing-element":
        return `Ensure element is properly loaded or add fallback for ${element.tagName}`;
      case "color-issue":
        return `Improve color contrast for better accessibility in ${element.tagName}`;
      case "layout-error":
        return `Adjust positioning and layout properties for ${element.tagName}`;
      default:
        return `Review and fix ${element.tagName} element implementation`;
    }
  }

  private async generateSolutionMockup(
    taskDescription: string,
  ): Promise<string> {
    try {
      // Create a simple mockup canvas showing the expected solution
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Cannot get canvas context");

      canvas.width = 400;
      canvas.height = 300;

      // Background
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 16px Arial";
      ctx.fillText("Expected Solution:", 20, 30);

      // Description
      ctx.fillStyle = "#4b5563";
      ctx.font = "12px Arial";
      const lines = this.wrapText(taskDescription, 360);
      lines.slice(0, 4).forEach((line, index) => {
        ctx.fillText(line, 20, 60 + index * 20);
      });

      // Mock UI elements based on task type
      if (taskDescription.includes("button")) {
        this.drawMockButton(ctx, 20, 160, "Fixed Button");
      }
      if (taskDescription.includes("form")) {
        this.drawMockForm(ctx, 20, 200);
      }
      if (taskDescription.includes("link")) {
        this.drawMockLink(ctx, 20, 240);
      }

      // Success indicator
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 14px Arial";
      ctx.fillText("✓ Solution Implemented", 20, 280);

      return canvas.toDataURL();
    } catch (error) {
      console.warn("Failed to generate solution mockup:", error);
      return "";
    }
  }

  private drawMockButton(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
  ): void {
    // Button background
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(x, y, 120, 32);

    // Button text
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.fillText(text, x + 10, y + 20);
  }

  private drawMockForm(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
  ): void {
    // Form field
    ctx.strokeStyle = "#d1d5db";
    ctx.strokeRect(x, y, 200, 24);

    // Form label
    ctx.fillStyle = "#4b5563";
    ctx.font = "12px Arial";
    ctx.fillText("Fixed Form Field", x, y - 5);
  }

  private drawMockLink(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
  ): void {
    ctx.fillStyle = "#8b5cf6";
    ctx.font = "12px Arial";
    ctx.fillText("Working Link →", x, y);
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      if (testLine.length * 7 < maxWidth) {
        // Rough character width estimation
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  private extractImplementationSteps(description: string): string[] {
    const steps: string[] = [];

    if (description.includes("button")) {
      steps.push("Locate the button element");
      steps.push("Update button properties and handlers");
      steps.push("Test button functionality");
    }

    if (description.includes("form")) {
      steps.push("Identify form validation issues");
      steps.push("Update validation rules");
      steps.push("Improve error messaging");
      steps.push("Test form submission");
    }

    if (description.includes("link")) {
      steps.push("Find broken link elements");
      steps.push("Update href attributes");
      steps.push("Add proper navigation handlers");
      steps.push("Verify link functionality");
    }

    if (description.includes("color")) {
      steps.push("Analyze color contrast");
      steps.push("Update CSS color properties");
      steps.push("Test accessibility compliance");
    }

    // Default steps if no specific type detected
    if (steps.length === 0) {
      steps.push("Analyze the issue");
      steps.push("Implement the fix");
      steps.push("Test the solution");
      steps.push("Verify completion");
    }

    return steps;
  }

  private generateExpectedOutcome(description: string): string {
    if (description.includes("error"))
      return "Error resolved and element functioning properly";
    if (description.includes("broken"))
      return "Element restored to working condition";
    if (description.includes("missing"))
      return "Missing element properly displayed";
    if (description.includes("disabled"))
      return "Element enabled and interactive";
    return "Issue resolved successfully";
  }

  private estimateImplementationTime(steps: string[]): number {
    return Math.max(5, steps.length * 2); // At least 5 minutes, 2 minutes per step
  }

  private generateElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(" ").filter((c) => c.trim());
      if (classes.length > 0) return `.${classes[0]}`;
    }
    return element.tagName.toLowerCase();
  }

  private saveScreenshotsToStorage(): void {
    try {
      const screenshots = Array.from(this.errorScreenshots.values());
      localStorage.setItem(
        "enhanced_error_screenshots",
        JSON.stringify(screenshots),
      );
    } catch (error) {
      console.warn("Failed to save screenshots to storage:", error);
    }
  }

  private saveSolutionPreviewsToStorage(): void {
    try {
      const previews = Array.from(this.solutionPreviews.values());
      localStorage.setItem(
        "enhanced_solution_previews",
        JSON.stringify(previews),
      );
    } catch (error) {
      console.warn("Failed to save solution previews to storage:", error);
    }
  }

  // Public interface
  getErrorScreenshots(): ErrorScreenshot[] {
    return Array.from(this.errorScreenshots.values());
  }

  getSolutionPreviews(): SolutionPreview[] {
    return Array.from(this.solutionPreviews.values());
  }

  getErrorScreenshot(id: string): ErrorScreenshot | null {
    return this.errorScreenshots.get(id) || null;
  }

  getSolutionPreview(id: string): SolutionPreview | null {
    return this.solutionPreviews.get(id) || null;
  }

  clearOldScreenshots(): void {
    // Keep only last 10 screenshots
    const screenshots = Array.from(this.errorScreenshots.values())
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 10);

    this.errorScreenshots.clear();
    screenshots.forEach((screenshot) => {
      this.errorScreenshots.set(screenshot.id, screenshot);
    });

    this.saveScreenshotsToStorage();
    console.log("📸 Cleaned up old screenshots");
  }
}

export default EnhancedScreenshotService.getInstance();
