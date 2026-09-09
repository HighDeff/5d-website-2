interface MouseTrackingData {
  position: { x: number; y: number };
  timestamp: Date;
  elementUnder: HTMLElement | null;
  buttonStates: boolean[];
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  pressure: number;
  tiltX: number;
  tiltY: number;
  twist: number;
  interaction_type: "hover" | "click" | "drag" | "scroll" | "gesture";
  element_interaction: ElementInteraction;
}

interface ElementInteraction {
  element: HTMLElement | null;
  element_type: string;
  is_button: boolean;
  is_clickable: boolean;
  has_event_listeners: boolean;
  element_state: string;
  interaction_confidence: number;
  predicted_action: string;
  screenshot_region: ScreenshotRegion;
}

interface ScreenshotRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  element_screenshot: string; // base64 data
  context_screenshot: string; // larger area around element
}

interface ScreenCaptureData {
  id: string;
  timestamp: Date;
  full_page_screenshot: string;
  original_page_screenshot: string; // Without popups/overlays
  difference_map: DifferenceMap;
  detected_changes: DetectedChange[];
  popup_detection: PopupDetection;
  error_indicators: ErrorIndicator[];
  button_analysis: ButtonAnalysis[];
  element_positions: ElementPosition[];
}

interface DifferenceMap {
  changed_regions: ChangedRegion[];
  pixel_differences: number;
  similarity_score: number;
  significant_changes: boolean;
  change_categories: ChangeCategory[];
}

interface ChangedRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  change_type: "addition" | "removal" | "modification" | "movement";
  confidence: number;
  affected_elements: HTMLElement[];
  before_screenshot: string;
  after_screenshot: string;
}

interface DetectedChange {
  type:
    | "element_added"
    | "element_removed"
    | "style_changed"
    | "content_changed"
    | "position_changed";
  element: HTMLElement | null;
  before_state: any;
  after_state: any;
  significance: "high" | "medium" | "low";
  error_potential: number;
  auto_fix_available: boolean;
}

interface PopupDetection {
  popups_detected: DetectedPopup[];
  overlays_detected: DetectedOverlay[];
  modals_detected: DetectedModal[];
  original_page_visible: boolean;
  popup_removal_successful: boolean;
}

interface DetectedPopup {
  element: HTMLElement;
  type:
    | "modal"
    | "tooltip"
    | "notification"
    | "advertisement"
    | "cookie_notice";
  blocking_level: "full" | "partial" | "none";
  removal_method:
    | "close_button"
    | "escape_key"
    | "backdrop_click"
    | "automatic";
  screenshot_with: string;
  screenshot_without: string;
}

interface ErrorIndicator {
  type: "visual_error" | "layout_error" | "interaction_error" | "content_error";
  severity: "critical" | "high" | "medium" | "low";
  location: { x: number; y: number; width: number; height: number };
  description: string;
  suggested_fix: string;
  confidence: number;
  screenshot: string;
  element_info: any;
}

interface ButtonAnalysis {
  button: HTMLElement;
  position: { x: number; y: number; width: number; height: number };
  state: "normal" | "hover" | "active" | "disabled" | "error";
  is_working: boolean;
  click_target_accuracy: number;
  visual_feedback: string;
  accessibility_score: number;
  screenshot: string;
  mouse_interaction_data: MouseInteractionData[];
}

interface MouseInteractionData {
  interaction_type: "hover" | "click" | "right_click" | "double_click";
  timestamp: Date;
  mouse_position: { x: number; y: number };
  element_position: { x: number; y: number; width: number; height: number };
  interaction_accuracy: number;
  response_time: number;
  visual_feedback_detected: boolean;
  error_occurred: boolean;
}

export class AdvancedMouseScreenCapture {
  private mouseTracking: MouseTrackingData[] = [];
  private screenCaptures: ScreenCaptureData[] = [];
  private lastScreenshot: string = "";
  private originalPageScreenshot: string = "";
  private isTracking: boolean = false;
  private trackingInterval: NodeJS.Timeout | null = null;
  private captureInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeTracking();
    this.setupAdvancedMouseTracking();
    this.startScreenCapture();
  }

  private initializeTracking(): void {
    console.log("🖱️ Initializing Advanced Mouse and Screen Capture System");
    this.isTracking = true;
  }

  private setupAdvancedMouseTracking(): void {
    // High-precision mouse tracking
    document.addEventListener("mousemove", (event) => {
      this.trackMouseMovement(event);
    });

    document.addEventListener("mousedown", (event) => {
      this.trackMouseInteraction(event, "click");
    });

    document.addEventListener("mouseup", (event) => {
      this.trackMouseInteraction(event, "release");
    });

    document.addEventListener("wheel", (event) => {
      this.trackScrollInteraction(event);
    });

    document.addEventListener("contextmenu", (event) => {
      this.trackMouseInteraction(event, "right_click");
    });

    // Pointer events for better precision
    document.addEventListener("pointerdown", (event) => {
      this.trackPointerInteraction(event);
    });

    document.addEventListener("pointermove", (event) => {
      this.trackPointerMovement(event);
    });

    // Start continuous tracking
    this.trackingInterval = setInterval(() => {
      this.processMouseTracking();
    }, 16); // 60 FPS tracking
  }

  private trackMouseMovement(event: MouseEvent): void {
    const elementUnder = document.elementFromPoint(
      event.clientX,
      event.clientY,
    ) as HTMLElement;

    // Calculate velocity and acceleration
    const velocity = this.calculateVelocity(event);
    const acceleration = this.calculateAcceleration(velocity);

    const trackingData: MouseTrackingData = {
      position: { x: event.clientX, y: event.clientY },
      timestamp: new Date(),
      elementUnder,
      buttonStates: [
        event.buttons & 1 ? true : false,
        event.buttons & 2 ? true : false,
        event.buttons & 4 ? true : false,
      ],
      velocity,
      acceleration,
      pressure: (event as any).pressure || 0.5,
      tiltX: (event as any).tiltX || 0,
      tiltY: (event as any).tiltY || 0,
      twist: (event as any).twist || 0,
      interaction_type: this.determineInteractionType(event),
      element_interaction: this.analyzeElementInteraction(elementUnder, event),
    };

    this.mouseTracking.push(trackingData);

    // Clean up invalid tracking data
    this.cleanupTrackingData();

    // Keep only last 1000 tracking points
    if (this.mouseTracking.length > 1000) {
      this.mouseTracking.shift();
    }

    // Check for button interactions
    if (elementUnder && this.isInteractiveElement(elementUnder)) {
      this.captureButtonInteraction(elementUnder, event);
    }
  }

  private trackMouseInteraction(event: MouseEvent, type: string): void {
    const elementUnder = document.elementFromPoint(
      event.clientX,
      event.clientY,
    ) as HTMLElement;

    if (elementUnder) {
      // Capture screenshot of interaction
      this.captureInteractionScreenshot(elementUnder, event);

      // Analyze button if applicable
      if (this.isButton(elementUnder)) {
        this.analyzeButtonClick(elementUnder, event);
      }

      // Record interaction data
      const interactionData: MouseInteractionData = {
        interaction_type: type as any,
        timestamp: new Date(),
        mouse_position: { x: event.clientX, y: event.clientY },
        element_position: this.getElementPosition(elementUnder),
        interaction_accuracy: this.calculateInteractionAccuracy(
          elementUnder,
          event,
        ),
        response_time: 0, // Will be calculated
        visual_feedback_detected: false,
        error_occurred: false,
      };

      // Start monitoring for response
      this.monitorInteractionResponse(elementUnder, interactionData);
    }
  }

  private trackPointerInteraction(event: PointerEvent): void {
    const elementUnder = document.elementFromPoint(
      event.clientX,
      event.clientY,
    ) as HTMLElement;

    // Enhanced tracking with pointer-specific data
    const enhancedData = {
      pointer_id: event.pointerId,
      pointer_type: event.pointerType,
      pressure: event.pressure,
      tilt_x: event.tiltX,
      tilt_y: event.tiltY,
      twist: event.twist,
      width: event.width,
      height: event.height,
    };

    // Store enhanced pointer data
    this.storeEnhancedPointerData(elementUnder, enhancedData, event);
  }

  private analyzeElementInteraction(
    elementUnder: HTMLElement | null,
    event: MouseEvent,
  ): ElementInteraction {
    if (!elementUnder) {
      return {
        element: null,
        element_type: "none",
        is_button: false,
        is_clickable: false,
        has_event_listeners: false,
        element_state: "none",
        interaction_confidence: 0,
        predicted_action: "none",
        screenshot_region: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          element_screenshot: "",
          context_screenshot: "",
        },
      };
    }

    const rect = elementUnder.getBoundingClientRect();

    return {
      element: elementUnder,
      element_type: elementUnder.tagName.toLowerCase(),
      is_button: this.isButton(elementUnder),
      is_clickable: this.isClickable(elementUnder),
      has_event_listeners: this.hasEventListeners(elementUnder),
      element_state: this.getElementState(elementUnder),
      interaction_confidence: this.calculateInteractionConfidence(elementUnder),
      predicted_action: this.predictAction(elementUnder),
      screenshot_region: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        element_screenshot: this.captureElementScreenshot(elementUnder),
        context_screenshot: this.captureContextScreenshot(elementUnder),
      },
    };
  }

  private startScreenCapture(): void {
    this.captureInterval = setInterval(async () => {
      await this.performAdvancedScreenCapture();
    }, 2000); // Capture every 2 seconds

    // Initial capture
    this.performAdvancedScreenCapture();
  }

  private async performAdvancedScreenCapture(): Promise<void> {
    try {
      // Capture current page state
      const currentScreenshot = await this.captureFullPage();

      // Detect and remove popups for original page capture
      const originalPageScreenshot = await this.captureOriginalPage();

      // Compare with previous screenshot
      const differenceMap = this.calculateDifferences(
        this.lastScreenshot,
        currentScreenshot,
      );

      // Detect changes and errors
      const detectedChanges = this.detectSignificantChanges(differenceMap);

      // Analyze popups and overlays
      const popupDetection = this.detectPopupsAndOverlays();

      // Detect visual errors
      const errorIndicators = this.detectVisualErrors(currentScreenshot);

      // Analyze all buttons
      const buttonAnalysis = this.analyzeAllButtons();

      // Get element positions
      const elementPositions = this.captureElementPositions();

      const captureData: ScreenCaptureData = {
        id: `capture_${Date.now()}`,
        timestamp: new Date(),
        full_page_screenshot: currentScreenshot,
        original_page_screenshot: originalPageScreenshot,
        difference_map: differenceMap,
        detected_changes: detectedChanges,
        popup_detection: popupDetection,
        error_indicators: errorIndicators,
        button_analysis: buttonAnalysis,
        element_positions: elementPositions,
      };

      this.screenCaptures.push(captureData);

      // Keep only last 50 captures
      if (this.screenCaptures.length > 50) {
        this.screenCaptures.shift();
      }

      // Update last screenshot
      this.lastScreenshot = currentScreenshot;
      this.originalPageScreenshot = originalPageScreenshot;

      // Process errors if found
      if (errorIndicators.length > 0) {
        this.processDetectedErrors(errorIndicators);
      }

      console.log(
        `📸 Advanced screen capture completed - ${detectedChanges.length} changes, ${errorIndicators.length} errors detected`,
      );
    } catch (error) {
      console.error("Screen capture failed:", error);
    }
  }

  private async captureFullPage(): Promise<string> {
    // Use html2canvas or similar to capture full page
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return "";

      // Set canvas size to page size
      canvas.width = Math.max(
        document.documentElement.scrollWidth,
        window.innerWidth,
      );
      canvas.height = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight,
      );

      // Create a simplified screenshot representation
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw elements (simplified representation)
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          ctx.fillStyle = this.getElementColor(element as HTMLElement);
          ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
        }
      });

      return canvas.toDataURL();
    } catch (error) {
      console.error("Full page capture failed:", error);
      return "";
    }
  }

  private async captureOriginalPage(): Promise<string> {
    // Temporarily hide popups and overlays
    const hiddenElements = this.temporarilyHidePopups();

    try {
      // Capture page without popups
      const originalScreenshot = await this.captureFullPage();

      // Restore hidden elements
      this.restoreHiddenElements(hiddenElements);

      return originalScreenshot;
    } catch (error) {
      // Make sure to restore elements even if capture fails
      this.restoreHiddenElements(hiddenElements);
      return "";
    }
  }

  private temporarilyHidePopups(): Array<{
    element: HTMLElement;
    originalStyle: string;
  }> {
    const hiddenElements: Array<{
      element: HTMLElement;
      originalStyle: string;
    }> = [];

    // Common popup selectors
    const popupSelectors = [
      ".modal",
      ".popup",
      ".overlay",
      ".tooltip",
      '[role="dialog"]',
      '[role="alertdialog"]',
      ".notification",
      ".toast",
      ".cookie-notice",
      ".gdpr-notice",
      "[data-popup]",
      "[data-modal]",
    ];

    popupSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlElement);

        if (
          computedStyle.display !== "none" &&
          computedStyle.visibility !== "hidden"
        ) {
          hiddenElements.push({
            element: htmlElement,
            originalStyle: htmlElement.style.display,
          });
          htmlElement.style.display = "none";
        }
      });
    });

    return hiddenElements;
  }

  private restoreHiddenElements(
    hiddenElements: Array<{ element: HTMLElement; originalStyle: string }>,
  ): void {
    hiddenElements.forEach(({ element, originalStyle }) => {
      element.style.display = originalStyle;
    });
  }

  private calculateDifferences(
    previous: string,
    current: string,
  ): DifferenceMap {
    if (!previous || !current) {
      return {
        changed_regions: [],
        pixel_differences: 0,
        similarity_score: 1.0,
        significant_changes: false,
        change_categories: [],
      };
    }

    // Simplified difference calculation
    const similarity = previous === current ? 1.0 : 0.8; // Simplified comparison

    return {
      changed_regions: this.detectChangedRegions(previous, current),
      pixel_differences: Math.floor((1 - similarity) * 1000),
      similarity_score: similarity,
      significant_changes: similarity < 0.95,
      change_categories: this.categorizeChanges(previous, current),
    };
  }

  private detectChangedRegions(
    previous: string,
    current: string,
  ): ChangedRegion[] {
    // Simplified change detection - in reality would use image comparison
    const regions: ChangedRegion[] = [];

    if (previous !== current) {
      // Detect some example regions
      regions.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        width: 100 + Math.random() * 200,
        height: 50 + Math.random() * 100,
        change_type: "modification",
        confidence: 0.8 + Math.random() * 0.2,
        affected_elements: [],
        before_screenshot: "",
        after_screenshot: "",
      });
    }

    return regions;
  }

  private detectSignificantChanges(
    differenceMap: DifferenceMap,
  ): DetectedChange[] {
    const changes: DetectedChange[] = [];

    // Analyze DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              changes.push({
                type: "element_added",
                element: node as HTMLElement,
                before_state: null,
                after_state: this.getElementState(node as HTMLElement),
                significance: "medium",
                error_potential: 0.3,
                auto_fix_available: false,
              });
            }
          });

          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              changes.push({
                type: "element_removed",
                element: null,
                before_state: this.getElementState(node as HTMLElement),
                after_state: null,
                significance: "medium",
                error_potential: 0.4,
                auto_fix_available: false,
              });
            }
          });
        }
      });
    });

    return changes;
  }

  private detectPopupsAndOverlays(): PopupDetection {
    const popups: DetectedPopup[] = [];
    const overlays: DetectedOverlay[] = [];
    const modals: DetectedModal[] = [];

    // Detect modals
    const modalElements = document.querySelectorAll(
      '[role="dialog"], .modal, .popup',
    );
    modalElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const rect = htmlElement.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        popups.push({
          element: htmlElement,
          type: "modal",
          blocking_level: this.calculateBlockingLevel(htmlElement),
          removal_method: this.determineRemovalMethod(htmlElement),
          screenshot_with: this.captureElementScreenshot(htmlElement),
          screenshot_without: "", // Would be captured after removal
        });
      }
    });

    // Detect overlays
    const overlayElements = document.querySelectorAll(".overlay, .backdrop");
    overlayElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      if (this.isVisibleOverlay(htmlElement)) {
        overlays.push({
          element: htmlElement,
          type: "backdrop",
          transparency: this.calculateTransparency(htmlElement),
          blocking_content: this.isBlockingContent(htmlElement),
        });
      }
    });

    return {
      popups_detected: popups,
      overlays_detected: overlays,
      modals_detected: modals,
      original_page_visible: overlays.length === 0 && popups.length === 0,
      popup_removal_successful: true, // Would be determined after removal attempt
    };
  }

  private detectVisualErrors(screenshot: string): ErrorIndicator[] {
    const errors: ErrorIndicator[] = [];

    // Detect broken images
    const brokenImages = document.querySelectorAll("img");
    brokenImages.forEach((img) => {
      if (img.naturalWidth === 0 && img.complete) {
        const rect = img.getBoundingClientRect();
        errors.push({
          type: "visual_error",
          severity: "medium",
          location: {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          },
          description: "Broken image detected",
          suggested_fix: "Check image source URL or provide fallback",
          confidence: 0.9,
          screenshot: this.captureElementScreenshot(img),
          element_info: {
            tag: img.tagName,
            src: img.src,
            alt: img.alt,
          },
        });
      }
    });

    // Detect layout errors
    const overlappingElements = this.detectOverlappingElements();
    overlappingElements.forEach((overlap) => {
      errors.push({
        type: "layout_error",
        severity: "high",
        location: overlap.area,
        description: "Overlapping elements detected",
        suggested_fix: "Adjust CSS positioning or z-index",
        confidence: 0.8,
        screenshot: this.captureRegionScreenshot(overlap.area),
        element_info: overlap.elements,
      });
    });

    // Detect text overflow
    const overflowElements = this.detectTextOverflow();
    overflowElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      errors.push({
        type: "content_error",
        severity: "medium",
        location: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        },
        description: "Text overflow detected",
        suggested_fix: "Increase container size or add text wrapping",
        confidence: 0.7,
        screenshot: this.captureElementScreenshot(element),
        element_info: {
          tag: element.tagName,
          content: element.textContent?.substring(0, 100),
        },
      });
    });

    // Detect invisible clickable elements
    const invisibleClickables = this.detectInvisibleClickables();
    invisibleClickables.forEach((element) => {
      const rect = element.getBoundingClientRect();
      errors.push({
        type: "interaction_error",
        severity: "high",
        location: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        },
        description: "Invisible clickable element detected",
        suggested_fix: "Make element visible or remove click handlers",
        confidence: 0.85,
        screenshot: this.captureElementScreenshot(element),
        element_info: {
          tag: element.tagName,
          visibility: getComputedStyle(element).visibility,
          opacity: getComputedStyle(element).opacity,
        },
      });
    });

    return errors;
  }

  private analyzeAllButtons(): ButtonAnalysis[] {
    const analyses: ButtonAnalysis[] = [];

    const buttons = document.querySelectorAll(
      'button, [role="button"], input[type="button"], input[type="submit"]',
    );

    buttons.forEach((button) => {
      const htmlButton = button as HTMLElement;
      const rect = htmlButton.getBoundingClientRect();

      const analysis: ButtonAnalysis = {
        button: htmlButton,
        position: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        },
        state: this.determineButtonState(htmlButton),
        is_working: this.testButtonFunctionality(htmlButton),
        click_target_accuracy: this.calculateClickTargetAccuracy(htmlButton),
        visual_feedback: this.analyzeVisualFeedback(htmlButton),
        accessibility_score: this.calculateAccessibilityScore(htmlButton),
        screenshot: this.captureElementScreenshot(htmlButton),
        mouse_interaction_data: this.getMouseInteractionData(htmlButton),
      };

      analyses.push(analysis);
    });

    return analyses;
  }

  // Helper methods
  private validateTrackingData(data: any): boolean {
    try {
      // Ensure basic structure exists
      if (!data) return false;

      // Validate timestamp
      if (!data.timestamp) return false;

      // Validate position (either position.x/y or x/y)
      const hasPosition =
        (data.position?.x !== undefined && data.position?.y !== undefined) ||
        (data.x !== undefined && data.y !== undefined);

      return hasPosition;
    } catch (error) {
      console.error("Error validating tracking data:", error);
      return false;
    }
  }

  private cleanupTrackingData(): void {
    try {
      // Remove any invalid tracking data
      this.mouseTracking = this.mouseTracking.filter((data) =>
        this.validateTrackingData(data),
      );
    } catch (error) {
      console.error("Error cleaning up tracking data:", error);
      // If cleanup fails, reset the array to prevent further errors
      this.mouseTracking = [];
    }
  }

  private calculateVelocity(event: MouseEvent): { x: number; y: number } {
    try {
      const lastTracking = this.mouseTracking[this.mouseTracking.length - 1];
      if (!lastTracking || !this.validateTrackingData(lastTracking)) {
        return { x: 0, y: 0 };
      }

      // Robust timestamp handling
      let lastTimestamp: number;
      if (lastTracking.timestamp instanceof Date) {
        lastTimestamp = lastTracking.timestamp.getTime();
      } else if (typeof lastTracking.timestamp === "number") {
        lastTimestamp = lastTracking.timestamp;
      } else if (typeof lastTracking.timestamp === "string") {
        lastTimestamp = new Date(lastTracking.timestamp).getTime();
      } else {
        console.warn(
          "Invalid timestamp format in mouseTracking:",
          lastTracking.timestamp,
        );
        return { x: 0, y: 0 };
      }

      const timeDiff = Date.now() - lastTimestamp;

      // Handle different position formats robustly
      const lastX = lastTracking.position?.x ?? (lastTracking as any).x ?? 0;
      const lastY = lastTracking.position?.y ?? (lastTracking as any).y ?? 0;

      const xDiff = event.clientX - lastX;
      const yDiff = event.clientY - lastY;

      return {
        x: timeDiff > 0 ? xDiff / timeDiff : 0,
        y: timeDiff > 0 ? yDiff / timeDiff : 0,
      };
    } catch (error) {
      console.error("Error in calculateVelocity:", error);
      return { x: 0, y: 0 };
    }
  }

  private calculateAcceleration(velocity: { x: number; y: number }): {
    x: number;
    y: number;
  } {
    try {
      const lastTracking = this.mouseTracking[this.mouseTracking.length - 1];
      if (!lastTracking) return { x: 0, y: 0 };

      // Ensure velocity exists and has proper structure
      const lastVelocity = lastTracking.velocity || { x: 0, y: 0 };

      return {
        x: velocity.x - lastVelocity.x,
        y: velocity.y - lastVelocity.y,
      };
    } catch (error) {
      console.error("Error in calculateAcceleration:", error);
      return { x: 0, y: 0 };
    }
  }

  private determineInteractionType(
    event: MouseEvent,
  ): "hover" | "click" | "drag" | "scroll" | "gesture" {
    if (event.buttons > 0) return "drag";
    return "hover";
  }

  private isInteractiveElement(element: HTMLElement): boolean {
    const interactiveTags = ["button", "a", "input", "select", "textarea"];
    return (
      interactiveTags.includes(element.tagName.toLowerCase()) ||
      element.hasAttribute("onclick") ||
      element.getAttribute("role") === "button"
    );
  }

  private isButton(element: HTMLElement): boolean {
    return (
      element.tagName.toLowerCase() === "button" ||
      element.getAttribute("role") === "button" ||
      (element.tagName.toLowerCase() === "input" &&
        ["button", "submit"].includes(element.getAttribute("type") || ""))
    );
  }

  private isClickable(element: HTMLElement): boolean {
    return (
      this.isInteractiveElement(element) ||
      getComputedStyle(element).cursor === "pointer"
    );
  }

  private hasEventListeners(element: HTMLElement): boolean {
    return (
      element.onclick !== null ||
      element.onmousedown !== null ||
      element.onmouseup !== null ||
      element.addEventListener !== undefined
    );
  }

  private getElementState(element: HTMLElement): string {
    const style = getComputedStyle(element);
    const states = [];

    if (element.hasAttribute("disabled")) states.push("disabled");
    if (style.visibility === "hidden") states.push("hidden");
    if (style.display === "none") states.push("not-displayed");
    if (style.opacity === "0") states.push("transparent");
    if (element.matches(":hover")) states.push("hover");
    if (element.matches(":active")) states.push("active");
    if (element.matches(":focus")) states.push("focus");

    return states.length > 0 ? states.join(",") : "normal";
  }

  private calculateInteractionConfidence(element: HTMLElement): number {
    let confidence = 0.5;

    if (this.isInteractiveElement(element)) confidence += 0.3;
    if (getComputedStyle(element).cursor === "pointer") confidence += 0.2;
    if (element.hasAttribute("onclick")) confidence += 0.2;
    if (element.getAttribute("role") === "button") confidence += 0.2;

    return Math.min(confidence, 1.0);
  }

  private predictAction(element: HTMLElement): string {
    const text = element.textContent?.toLowerCase() || "";
    const type = element.getAttribute("type")?.toLowerCase() || "";

    if (text.includes("submit") || type === "submit") return "form_submit";
    if (text.includes("cancel") || text.includes("close"))
      return "cancel_action";
    if (text.includes("save")) return "save_data";
    if (text.includes("delete")) return "delete_item";
    if (text.includes("edit")) return "edit_item";
    if (element.tagName.toLowerCase() === "a") return "navigate";

    return "generic_action";
  }

  private captureElementScreenshot(element: HTMLElement): string {
    // Simplified element screenshot capture
    try {
      const rect = element.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return "";

      canvas.width = rect.width;
      canvas.height = rect.height;

      // Simple representation
      ctx.fillStyle = this.getElementColor(element);
      ctx.fillRect(0, 0, rect.width, rect.height);

      return canvas.toDataURL();
    } catch (error) {
      return "";
    }
  }

  private captureContextScreenshot(element: HTMLElement): string {
    // Capture larger area around element
    const rect = element.getBoundingClientRect();
    const padding = 50;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return "";

      canvas.width = rect.width + padding * 2;
      canvas.height = rect.height + padding * 2;

      // Simple representation of context
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = this.getElementColor(element);
      ctx.fillRect(padding, padding, rect.width, rect.height);

      return canvas.toDataURL();
    } catch (error) {
      return "";
    }
  }

  private getElementColor(element: HTMLElement): string {
    const style = getComputedStyle(element);
    return style.backgroundColor || "#ffffff";
  }

  // Additional helper methods would continue here...

  // Public API
  public getMouseTrackingData(): MouseTrackingData[] {
    return [...this.mouseTracking];
  }

  public getScreenCaptures(): ScreenCaptureData[] {
    return [...this.screenCaptures];
  }

  public getLatestDifferences(): DifferenceMap | null {
    const latest = this.screenCaptures[this.screenCaptures.length - 1];
    return latest ? latest.difference_map : null;
  }

  public getDetectedErrors(): ErrorIndicator[] {
    const latest = this.screenCaptures[this.screenCaptures.length - 1];
    return latest ? latest.error_indicators : [];
  }

  public getButtonAnalyses(): ButtonAnalysis[] {
    const latest = this.screenCaptures[this.screenCaptures.length - 1];
    return latest ? latest.button_analysis : [];
  }

  public stop(): void {
    this.isTracking = false;

    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }

    console.log("🖱️ Advanced Mouse and Screen Capture stopped");
  }

  // Placeholder implementations for remaining methods
  private captureButtonInteraction(
    element: HTMLElement,
    event: MouseEvent,
  ): void {
    try {
      console.log("🔘 Button interaction captured:", {
        tag: element.tagName,
        id: element.id || "no-id",
        class: element.className || "no-class",
        text: element.textContent?.slice(0, 50) || "no-text",
        position: { x: event.clientX, y: event.clientY },
      });

      // Store interaction data
      const interactionData = {
        element_tag: element.tagName,
        element_id: element.id,
        element_class: element.className,
        element_text: element.textContent?.slice(0, 100),
        mouse_position: { x: event.clientX, y: event.clientY },
        timestamp: new Date(),
        interaction_type: "button_interaction",
      };

      // Add to mouse tracking history
      this.mouseTracking.push({
        position: { x: event.clientX, y: event.clientY },
        timestamp: new Date(),
        elementUnder: element,
        buttonStates: [
          event.buttons & 1 ? true : false,
          event.buttons & 2 ? true : false,
          event.buttons & 4 ? true : false,
        ],
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        pressure: (event as any).pressure || 0.5,
        tiltX: (event as any).tiltX || 0,
        tiltY: (event as any).tiltY || 0,
        twist: (event as any).twist || 0,
        interaction_type: "button_interaction" as any,
        element_interaction: interactionData,
      });

      // Capture screenshot of the interaction
      this.captureInteractionScreenshot(element, event);

      // Analyze button functionality
      this.analyzeButtonClick(element, event);
    } catch (error) {
      console.error("Error capturing button interaction:", error);
    }
  }

  private captureInteractionScreenshot(
    element: HTMLElement,
    event: MouseEvent,
  ): void {}
  private analyzeButtonClick(element: HTMLElement, event: MouseEvent): void {}
  private getElementPosition(element: HTMLElement): any {
    return {};
  }
  private calculateInteractionAccuracy(
    element: HTMLElement,
    event: MouseEvent,
  ): number {
    return 0.9;
  }
  private monitorInteractionResponse(
    element: HTMLElement,
    data: MouseInteractionData,
  ): void {}
  private storeEnhancedPointerData(
    element: HTMLElement | null,
    data: any,
    event: PointerEvent,
  ): void {}
  private processMouseTracking(): void {}
  private trackScrollInteraction(event: WheelEvent): void {}
  private trackPointerMovement(event: PointerEvent): void {}
  private categorizeChanges(
    previous: string,
    current: string,
  ): ChangeCategory[] {
    return [];
  }
  private calculateBlockingLevel(
    element: HTMLElement,
  ): "full" | "partial" | "none" {
    return "partial";
  }
  private determineRemovalMethod(
    element: HTMLElement,
  ): "close_button" | "escape_key" | "backdrop_click" | "automatic" {
    return "close_button";
  }
  private isVisibleOverlay(element: HTMLElement): boolean {
    return true;
  }
  private calculateTransparency(element: HTMLElement): number {
    return 0.5;
  }
  private isBlockingContent(element: HTMLElement): boolean {
    return true;
  }
  private detectOverlappingElements(): any[] {
    return [];
  }
  private detectTextOverflow(): HTMLElement[] {
    return [];
  }
  private detectInvisibleClickables(): HTMLElement[] {
    return [];
  }
  private captureRegionScreenshot(area: any): string {
    return "";
  }
  private captureElementPositions(): ElementPosition[] {
    return [];
  }
  private processDetectedErrors(errors: ErrorIndicator[]): void {}
  private determineButtonState(
    button: HTMLElement,
  ): "normal" | "hover" | "active" | "disabled" | "error" {
    return "normal";
  }
  private testButtonFunctionality(button: HTMLElement): boolean {
    return true;
  }
  private calculateClickTargetAccuracy(button: HTMLElement): number {
    return 0.9;
  }
  private analyzeVisualFeedback(button: HTMLElement): string {
    return "normal";
  }
  private calculateAccessibilityScore(button: HTMLElement): number {
    return 0.8;
  }
  private getMouseInteractionData(button: HTMLElement): MouseInteractionData[] {
    return [];
  }
}

// Global instance
export const advancedMouseScreenCapture = new AdvancedMouseScreenCapture();

// Make available globally
(window as any).advancedMouseScreenCapture = advancedMouseScreenCapture;
