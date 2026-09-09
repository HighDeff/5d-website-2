// Movable and Resizable System for Canvas Components
// Makes toolboxes, widgets, and tabs draggable and resizable

export interface MovableElement {
  id: string;
  element: HTMLElement;
  isDragging: boolean;
  isResizing: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  resizeHandle?: HTMLElement;
  dragHandle?: HTMLElement;
}

export class MovableResizableSystem {
  private static instance: MovableResizableSystem;
  private elements: Map<string, MovableElement> = new Map();
  private activeElement: MovableElement | null = null;
  private boundHandlers: any = {};

  private constructor() {
    this.initializeEventHandlers();
    this.observeDOM();
  }

  static getInstance(): MovableResizableSystem {
    if (!MovableResizableSystem.instance) {
      MovableResizableSystem.instance = new MovableResizableSystem();
    }
    return MovableResizableSystem.instance;
  }

  private initializeEventHandlers(): void {
    this.boundHandlers = {
      mouseMove: this.handleMouseMove.bind(this),
      mouseUp: this.handleMouseUp.bind(this),
      touchMove: this.handleTouchMove.bind(this),
      touchEnd: this.handleTouchEnd.bind(this),
    };

    document.addEventListener("mousemove", this.boundHandlers.mouseMove);
    document.addEventListener("mouseup", this.boundHandlers.mouseUp);
    document.addEventListener("touchmove", this.boundHandlers.touchMove, {
      passive: false,
    });
    document.addEventListener("touchend", this.boundHandlers.touchEnd);
  }

  private observeDOM(): void {
    // Observe for new canvas elements, toolboxes, widgets, and tabs
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            this.checkAndMakeMovableResizable(element);

            // Check child elements too
            const candidates = element.querySelectorAll(this.getSelectors());
            candidates.forEach((candidate) => {
              this.checkAndMakeMovableResizable(candidate as HTMLElement);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Process existing elements
    setTimeout(() => {
      this.scanExistingElements();
    }, 1000);
  }

  private getSelectors(): string {
    return [
      // Canvas toolboxes and controls
      '[id*="canvas"]',
      '[id*="control"]',
      '[id*="panel"]',
      '[id*="toolbox"]',
      '[id*="widget"]',

      // AI system components
      '[id*="ai-"]',
      '[id*="diagnostic"]',
      '[id*="recovery"]',
      '[id*="fix"]',

      // Specific canvas components
      "#fixed-ai-controls",
      "#enhanced-magnetic-canvas",
      "#ai-diagnostic-container",
      "#simple-diagnostic-panel",
      "#canvas-measurement-tools",
      "#emergency-ai-controls",

      // React components with specific classes
      ".ai-control-center",
      ".data-recovery-center",
      ".diagnostic-console",
      ".canvas-container",
      ".widget-container",
      ".control-panel",

      // Cards and modals
      '[class*="card"]',
      '[class*="modal"]',
      '[class*="popup"]',
      '[class*="dialog"]',
    ].join(", ");
  }

  private scanExistingElements(): void {
    console.log("🔍 Scanning for movable/resizable elements...");

    const elements = document.querySelectorAll(this.getSelectors());
    let count = 0;

    elements.forEach((element) => {
      if (this.shouldMakeMovableResizable(element as HTMLElement)) {
        this.makeMovableResizable(element as HTMLElement);
        count++;
      }
    });

    console.log(`✅ Made ${count} elements movable and resizable`);
  }

  private checkAndMakeMovableResizable(element: HTMLElement): void {
    if (this.shouldMakeMovableResizable(element)) {
      this.makeMovableResizable(element);
    }
  }

  private shouldMakeMovableResizable(element: HTMLElement): boolean {
    // Skip if already processed
    if (element.dataset.movableResizable === "true") {
      return false;
    }

    // Skip if too small or hidden
    const rect = element.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 50) {
      return false;
    }

    // Skip if not positioned appropriately
    const style = window.getComputedStyle(element);
    if (style.position !== "fixed" && style.position !== "absolute") {
      // Only make fixed/absolute positioned elements movable
      return false;
    }

    // Skip if it's a child of another movable element
    let parent = element.parentElement;
    while (parent) {
      if (parent.dataset.movableResizable === "true") {
        return false;
      }
      parent = parent.parentElement;
    }

    return true;
  }

  public makeMovableResizable(
    element: HTMLElement,
    options: Partial<MovableElement> = {},
  ): void {
    const elementId =
      element.id ||
      `movable-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (!element.id) element.id = elementId;

    // Skip if already processed
    if (this.elements.has(elementId)) {
      return;
    }

    const rect = element.getBoundingClientRect();

    const movableElement: MovableElement = {
      id: elementId,
      element: element,
      isDragging: false,
      isResizing: false,
      startX: 0,
      startY: 0,
      startWidth: rect.width,
      startHeight: rect.height,
      startLeft: rect.left,
      startTop: rect.top,
      minWidth: options.minWidth || 200,
      minHeight: options.minHeight || 100,
      maxWidth: options.maxWidth || window.innerWidth,
      maxHeight: options.maxHeight || window.innerHeight,
    };

    // Ensure element is positioned
    if (
      element.style.position !== "fixed" &&
      element.style.position !== "absolute"
    ) {
      element.style.position = "fixed";
    }

    // Set initial position and size if not already set
    if (!element.style.left) element.style.left = `${rect.left}px`;
    if (!element.style.top) element.style.top = `${rect.top}px`;
    if (!element.style.width) element.style.width = `${rect.width}px`;
    if (!element.style.height) element.style.height = `${rect.height}px`;

    // Add drag handle
    this.addDragHandle(movableElement);

    // Add resize handle
    this.addResizeHandle(movableElement);

    // Mark as processed
    element.dataset.movableResizable = "true";

    // Store the element
    this.elements.set(elementId, movableElement);

    console.log(`✅ Made element movable/resizable: ${elementId}`);
  }

  private addDragHandle(movableElement: MovableElement): void {
    const element = movableElement.element;

    // Create drag handle
    const dragHandle = document.createElement("div");
    dragHandle.className = "movable-drag-handle";
    dragHandle.innerHTML = "⋮⋮";
    dragHandle.style.cssText = `
      position: absolute;
      top: 5px;
      right: 30px;
      width: 20px;
      height: 20px;
      background: rgba(0, 100, 200, 0.8);
      color: white;
      border: 1px solid #fff;
      border-radius: 4px;
      cursor: move;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      z-index: 10001;
      user-select: none;
      opacity: 0.7;
      transition: opacity 0.2s;
    `;

    // Show/hide on hover
    element.addEventListener("mouseenter", () => {
      dragHandle.style.opacity = "1";
    });

    element.addEventListener("mouseleave", () => {
      if (!movableElement.isDragging) {
        dragHandle.style.opacity = "0.7";
      }
    });

    // Drag functionality
    dragHandle.addEventListener("mousedown", (e) => {
      this.startDrag(movableElement, e);
    });

    dragHandle.addEventListener(
      "touchstart",
      (e) => {
        this.startDrag(movableElement, e.touches[0]);
      },
      { passive: false },
    );

    element.appendChild(dragHandle);
    movableElement.dragHandle = dragHandle;
  }

  private addResizeHandle(movableElement: MovableElement): void {
    const element = movableElement.element;

    // Create resize handle
    const resizeHandle = document.createElement("div");
    resizeHandle.className = "movable-resize-handle";
    resizeHandle.innerHTML = "⟲";
    resizeHandle.style.cssText = `
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 20px;
      height: 20px;
      background: rgba(0, 150, 100, 0.8);
      color: white;
      border: 1px solid #fff;
      border-radius: 4px;
      cursor: nw-resize;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      z-index: 10001;
      user-select: none;
      opacity: 0.7;
      transition: opacity 0.2s;
    `;

    // Show/hide on hover
    element.addEventListener("mouseenter", () => {
      resizeHandle.style.opacity = "1";
    });

    element.addEventListener("mouseleave", () => {
      if (!movableElement.isResizing) {
        resizeHandle.style.opacity = "0.7";
      }
    });

    // Resize functionality
    resizeHandle.addEventListener("mousedown", (e) => {
      this.startResize(movableElement, e);
    });

    resizeHandle.addEventListener(
      "touchstart",
      (e) => {
        this.startResize(movableElement, e.touches[0]);
      },
      { passive: false },
    );

    element.appendChild(resizeHandle);
    movableElement.resizeHandle = resizeHandle;
  }

  private startDrag(
    movableElement: MovableElement,
    event: MouseEvent | Touch,
  ): void {
    event.preventDefault?.();

    movableElement.isDragging = true;
    movableElement.startX = event.clientX;
    movableElement.startY = event.clientY;

    const rect = movableElement.element.getBoundingClientRect();
    movableElement.startLeft = rect.left;
    movableElement.startTop = rect.top;

    this.activeElement = movableElement;

    // Visual feedback
    movableElement.element.style.cursor = "moving";
    movableElement.element.style.opacity = "0.8";
    movableElement.element.style.zIndex = "10002";

    if (movableElement.dragHandle) {
      movableElement.dragHandle.style.background = "rgba(0, 150, 255, 1)";
    }

    console.log(`🔄 Started dragging: ${movableElement.id}`);
  }

  private startResize(
    movableElement: MovableElement,
    event: MouseEvent | Touch,
  ): void {
    event.preventDefault?.();

    movableElement.isResizing = true;
    movableElement.startX = event.clientX;
    movableElement.startY = event.clientY;

    const rect = movableElement.element.getBoundingClientRect();
    movableElement.startWidth = rect.width;
    movableElement.startHeight = rect.height;

    this.activeElement = movableElement;

    // Visual feedback
    movableElement.element.style.cursor = "nw-resize";
    movableElement.element.style.opacity = "0.8";
    movableElement.element.style.zIndex = "10002";

    if (movableElement.resizeHandle) {
      movableElement.resizeHandle.style.background = "rgba(0, 200, 100, 1)";
    }

    console.log(`📏 Started resizing: ${movableElement.id}`);
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.activeElement) return;

    if (this.activeElement.isDragging) {
      this.updateDrag(this.activeElement, event);
    } else if (this.activeElement.isResizing) {
      this.updateResize(this.activeElement, event);
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    if (!this.activeElement) return;

    event.preventDefault();
    const touch = event.touches[0];

    if (this.activeElement.isDragging) {
      this.updateDrag(this.activeElement, touch);
    } else if (this.activeElement.isResizing) {
      this.updateResize(this.activeElement, touch);
    }
  }

  private updateDrag(
    movableElement: MovableElement,
    event: MouseEvent | Touch,
  ): void {
    const deltaX = event.clientX - movableElement.startX;
    const deltaY = event.clientY - movableElement.startY;

    let newLeft = movableElement.startLeft + deltaX;
    let newTop = movableElement.startTop + deltaY;

    // Constrain to viewport
    const rect = movableElement.element.getBoundingClientRect();
    newLeft = Math.max(0, Math.min(window.innerWidth - rect.width, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - rect.height, newTop));

    movableElement.element.style.left = `${newLeft}px`;
    movableElement.element.style.top = `${newTop}px`;
  }

  private updateResize(
    movableElement: MovableElement,
    event: MouseEvent | Touch,
  ): void {
    const deltaX = event.clientX - movableElement.startX;
    const deltaY = event.clientY - movableElement.startY;

    let newWidth = movableElement.startWidth + deltaX;
    let newHeight = movableElement.startHeight + deltaY;

    // Apply constraints
    newWidth = Math.max(
      movableElement.minWidth,
      Math.min(movableElement.maxWidth, newWidth),
    );
    newHeight = Math.max(
      movableElement.minHeight,
      Math.min(movableElement.maxHeight, newHeight),
    );

    movableElement.element.style.width = `${newWidth}px`;
    movableElement.element.style.height = `${newHeight}px`;
  }

  private handleMouseUp(): void {
    this.endDragResize();
  }

  private handleTouchEnd(): void {
    this.endDragResize();
  }

  private endDragResize(): void {
    if (!this.activeElement) return;

    const movableElement = this.activeElement;

    // Reset state
    movableElement.isDragging = false;
    movableElement.isResizing = false;

    // Reset visual feedback
    movableElement.element.style.cursor = "";
    movableElement.element.style.opacity = "";
    movableElement.element.style.zIndex = "";

    if (movableElement.dragHandle) {
      movableElement.dragHandle.style.background = "rgba(0, 100, 200, 0.8)";
    }

    if (movableElement.resizeHandle) {
      movableElement.resizeHandle.style.background = "rgba(0, 150, 100, 0.8)";
    }

    // Save position/size
    this.saveElementState(movableElement);

    this.activeElement = null;

    console.log(`✅ Finished moving/resizing: ${movableElement.id}`);
  }

  private saveElementState(movableElement: MovableElement): void {
    // Save to localStorage for persistence
    const state = {
      id: movableElement.id,
      left: movableElement.element.style.left,
      top: movableElement.element.style.top,
      width: movableElement.element.style.width,
      height: movableElement.element.style.height,
      timestamp: Date.now(),
    };

    localStorage.setItem(`movable-${movableElement.id}`, JSON.stringify(state));
  }

  private loadElementState(movableElement: MovableElement): void {
    const saved = localStorage.getItem(`movable-${movableElement.id}`);
    if (saved) {
      try {
        const state = JSON.parse(saved);

        // Apply saved position/size
        if (state.left) movableElement.element.style.left = state.left;
        if (state.top) movableElement.element.style.top = state.top;
        if (state.width) movableElement.element.style.width = state.width;
        if (state.height) movableElement.element.style.height = state.height;

        console.log(`📋 Restored state for: ${movableElement.id}`);
      } catch (error) {
        console.warn(`Failed to load state for ${movableElement.id}:`, error);
      }
    }
  }

  // Public API
  public makeElementMovableResizable(
    elementId: string,
    options?: Partial<MovableElement>,
  ): boolean {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element not found: ${elementId}`);
      return false;
    }

    this.makeMovableResizable(element, options);
    return true;
  }

  public removeMovableResizable(elementId: string): boolean {
    const movableElement = this.elements.get(elementId);
    if (!movableElement) {
      return false;
    }

    // Remove handles
    if (movableElement.dragHandle) {
      movableElement.dragHandle.remove();
    }
    if (movableElement.resizeHandle) {
      movableElement.resizeHandle.remove();
    }

    // Remove data attribute
    movableElement.element.dataset.movableResizable = "false";

    // Remove from storage
    this.elements.delete(elementId);
    localStorage.removeItem(`movable-${elementId}`);

    console.log(`🗑️ Removed movable/resizable: ${elementId}`);
    return true;
  }

  public getMovableElements(): MovableElement[] {
    return Array.from(this.elements.values());
  }

  public resetElementPosition(elementId: string): boolean {
    const movableElement = this.elements.get(elementId);
    if (!movableElement) {
      return false;
    }

    // Reset to center of screen
    const centerX = (window.innerWidth - 400) / 2;
    const centerY = (window.innerHeight - 300) / 2;

    movableElement.element.style.left = `${centerX}px`;
    movableElement.element.style.top = `${centerY}px`;
    movableElement.element.style.width = "400px";
    movableElement.element.style.height = "300px";

    this.saveElementState(movableElement);

    console.log(`🔄 Reset position for: ${elementId}`);
    return true;
  }
}

// Global instance and functions
export const movableResizableSystem = MovableResizableSystem.getInstance();

// Global helper functions
(window as any).makeMovableResizable = (elementId: string, options?: any) => {
  return movableResizableSystem.makeElementMovableResizable(elementId, options);
};

(window as any).removeMovableResizable = (elementId: string) => {
  return movableResizableSystem.removeMovableResizable(elementId);
};

(window as any).resetElementPosition = (elementId: string) => {
  return movableResizableSystem.resetElementPosition(elementId);
};

(window as any).getMovableElements = () => {
  return movableResizableSystem.getMovableElements();
};

export default MovableResizableSystem;
