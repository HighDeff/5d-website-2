interface DraggableCard {
  id: string;
  type: "product" | "category" | "button" | "text" | "image" | "video";
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: Record<string, any>;
  links: string[];
  isMonitored: boolean;
  subHandlers: string[];
}

interface CustomPage {
  id: string;
  userId: string;
  name: string;
  cards: DraggableCard[];
  routes: PageRoute[];
  isPublic: boolean;
  membershipRequired: "free" | "member" | "premium";
  createdAt: Date;
  lastModified: Date;
}

interface PageRoute {
  path: string;
  cardId: string;
  action: "navigate" | "popup" | "replace";
  fallback?: string;
}

interface ContainerBackup {
  id: string;
  pageId: string;
  cardId: string;
  originalContent: any;
  backupTime: Date;
  autoRestore: boolean;
}

class CustomPageBuilderAI {
  private customPages: Map<string, CustomPage> = new Map();
  private cardBackups: Map<string, ContainerBackup[]> = new Map();
  private monitoredCards: Set<string> = new Set();
  private brokenLinkRepairs: Map<string, string> = new Map();

  constructor() {
    this.loadCustomPages();
    this.startMonitoring();
  }

  /**
   * Create new custom page for user
   */
  createCustomPage(
    userId: string,
    name: string,
    membershipRequired: "free" | "member" | "premium" = "free",
  ): CustomPage {
    const pageId = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newPage: CustomPage = {
      id: pageId,
      userId,
      name,
      cards: [],
      routes: [],
      isPublic: false,
      membershipRequired,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    this.customPages.set(pageId, newPage);
    this.savePages();

    console.log(`🎨 Created custom page: ${name} for user ${userId}`);
    return newPage;
  }

  /**
   * Add draggable card to page
   */
  addCard(
    pageId: string,
    cardType: DraggableCard["type"],
    content: any,
    position: { x: number; y: number },
  ): DraggableCard {
    const page = this.customPages.get(pageId);
    if (!page) throw new Error("Page not found");

    const cardId = `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newCard: DraggableCard = {
      id: cardId,
      type: cardType,
      content: this.processCardContent(cardType, content),
      position,
      size: this.getDefaultSize(cardType),
      style: this.getDefaultStyle(cardType),
      links: [],
      isMonitored: true,
      subHandlers: [],
    };

    // Create backup immediately
    this.createCardBackup(pageId, cardId, newCard.content);

    page.cards.push(newCard);
    page.lastModified = new Date();

    // Start monitoring this card
    this.monitoredCards.add(cardId);

    this.savePages();
    console.log(`📦 Added ${cardType} card to page ${pageId}`);

    return newCard;
  }

  /**
   * Process different card types
   */
  private processCardContent(type: DraggableCard["type"], content: any): any {
    switch (type) {
      case "product":
        return {
          productId: content.id,
          name: content.name,
          price: content.price,
          image: content.image,
          category: content.category,
          sellerId: content.sellerId,
          displayMode: "card", // card, list, grid
        };

      case "category":
        return {
          categoryName: content.name,
          categoryId: content.id,
          products: content.products || [],
          displayStyle: "grid",
          itemsPerRow: 3,
        };

      case "button":
        return {
          text: content.text,
          action: content.action, // navigate, popup, api_call
          target: content.target,
          style: content.style || "primary",
          icon: content.icon,
        };

      case "text":
        return {
          content: content.text || content.content,
          format: content.format || "paragraph", // paragraph, heading, list
          style: content.style || {},
        };

      case "image":
        return {
          src: content.src || content.url,
          alt: content.alt || "Image",
          caption: content.caption,
          clickAction: content.clickAction,
        };

      case "video":
        return {
          src: content.src || content.url,
          thumbnail: content.thumbnail,
          autoplay: content.autoplay || false,
          controls: content.controls !== false,
        };

      default:
        return content;
    }
  }

  /**
   * Update card position and create backup
   */
  moveCard(
    pageId: string,
    cardId: string,
    newPosition: { x: number; y: number },
  ): boolean {
    const page = this.customPages.get(pageId);
    if (!page) return false;

    const card = page.cards.find((c) => c.id === cardId);
    if (!card) return false;

    // Create backup before moving
    this.createCardBackup(pageId, cardId, card);

    card.position = newPosition;
    page.lastModified = new Date();

    this.savePages();
    return true;
  }

  /**
   * Add sub-handler for card editing across pages
   */
  addSubHandler(cardId: string, handlerType: string, config: any): void {
    this.monitoredCards.add(cardId);

    // Find all pages with this card type and sync changes
    for (const [pageId, page] of this.customPages) {
      const cards = page.cards.filter(
        (c) => c.type === handlerType || c.id === cardId,
      );
      cards.forEach((card) => {
        card.subHandlers.push(handlerType);

        // Apply cross-page editing logic
        if (config.syncAcrossPages) {
          this.syncCardAcrossPages(card, config);
        }
      });
    }
  }

  /**
   * Create logical routes and add cards to reform broken pages
   */
  createLogicalRoute(
    pageId: string,
    path: string,
    cardId: string,
    action: PageRoute["action"],
  ): void {
    const page = this.customPages.get(pageId);
    if (!page) return;

    const route: PageRoute = {
      path,
      cardId,
      action,
      fallback: this.generateFallbackRoute(path),
    };

    page.routes.push(route);

    // Check for broken links and auto-repair
    this.checkAndRepairBrokenLinks(pageId);

    this.savePages();
  }

  /**
   * Auto-repair broken links by reforming pages
   */
  private checkAndRepairBrokenLinks(pageId: string): void {
    const page = this.customPages.get(pageId);
    if (!page) return;

    page.routes.forEach((route) => {
      // Check if route target exists
      const targetCard = page.cards.find((c) => c.id === route.cardId);
      if (!targetCard && route.fallback) {
        console.log(`🔧 Repairing broken route: ${route.path}`);

        // Create replacement card
        const fallbackCard = this.createFallbackCard(route);
        page.cards.push(fallbackCard);

        // Update route to point to new card
        route.cardId = fallbackCard.id;
        this.brokenLinkRepairs.set(route.path, fallbackCard.id);
      }
    });
  }

  private createFallbackCard(route: PageRoute): DraggableCard {
    return {
      id: `fallback-${Date.now()}`,
      type: "button",
      content: {
        text: "Page Not Found",
        action: "navigate",
        target: "/",
        style: "warning",
      },
      position: { x: 100, y: 100 },
      size: { width: 200, height: 50 },
      style: { backgroundColor: "#fbbf24", color: "#000" },
      links: [],
      isMonitored: true,
      subHandlers: ["error-recovery"],
    };
  }

  /**
   * Copy and paste containers with monitoring
   */
  copyCard(pageId: string, cardId: string): string {
    const page = this.customPages.get(pageId);
    if (!page) return "";

    const originalCard = page.cards.find((c) => c.id === cardId);
    if (!originalCard) return "";

    // Create backup before copying
    this.createCardBackup(pageId, cardId, originalCard);

    const copiedCardId = `copy-${Date.now()}-${cardId}`;
    const copiedCard: DraggableCard = {
      ...originalCard,
      id: copiedCardId,
      position: {
        x: originalCard.position.x + 20,
        y: originalCard.position.y + 20,
      },
      isMonitored: true,
    };

    page.cards.push(copiedCard);
    this.monitoredCards.add(copiedCardId);

    this.savePages();
    return copiedCardId;
  }

  /**
   * Create container backup for monitoring
   */
  private createCardBackup(pageId: string, cardId: string, content: any): void {
    const backup: ContainerBackup = {
      id: `backup-${Date.now()}`,
      pageId,
      cardId,
      originalContent: JSON.parse(JSON.stringify(content)),
      backupTime: new Date(),
      autoRestore: true,
    };

    const pageBackups = this.cardBackups.get(pageId) || [];
    pageBackups.push(backup);

    // Keep only last 10 backups per page
    if (pageBackups.length > 10) {
      pageBackups.shift();
    }

    this.cardBackups.set(pageId, pageBackups);
  }

  /**
   * Restore card from backup
   */
  restoreCardFromBackup(
    pageId: string,
    cardId: string,
    backupId?: string,
  ): boolean {
    const pageBackups = this.cardBackups.get(pageId);
    if (!pageBackups) return false;

    const backup = backupId
      ? pageBackups.find((b) => b.id === backupId)
      : pageBackups.filter((b) => b.cardId === cardId).pop(); // Most recent

    if (!backup) return false;

    const page = this.customPages.get(pageId);
    if (!page) return false;

    const card = page.cards.find((c) => c.id === cardId);
    if (!card) return false;

    // Restore content
    card.content = JSON.parse(JSON.stringify(backup.originalContent));
    page.lastModified = new Date();

    this.savePages();
    console.log(`🔄 Restored card ${cardId} from backup ${backup.id}`);
    return true;
  }

  /**
   * Get all selectable components (products, categories, buttons)
   */
  getSelectableComponents(): {
    products: any[];
    categories: any[];
    buttons: any[];
    templates: any[];
  } {
    // This would fetch from your product database
    return {
      products: this.getAvailableProducts(),
      categories: this.getAvailableCategories(),
      buttons: this.getDefaultButtons(),
      templates: this.getPageTemplates(),
    };
  }

  private getAvailableProducts(): any[] {
    // Fetch products from your product database
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    return products.slice(0, 20); // Limit for performance
  }

  private getAvailableCategories(): any[] {
    return [
      { id: "fashion", name: "Fashion", icon: "👗" },
      { id: "electronics", name: "Electronics", icon: "📱" },
      { id: "home", name: "Home & Garden", icon: "🏠" },
      { id: "beauty", name: "Beauty", icon: "💄" },
      { id: "sports", name: "Sports", icon: "⚽" },
    ];
  }

  private getDefaultButtons(): any[] {
    return [
      { text: "Shop Now", action: "navigate", target: "/collections" },
      { text: "Contact Us", action: "popup", target: "contact" },
      { text: "Add to Cart", action: "api_call", target: "addToCart" },
      { text: "View Details", action: "popup", target: "productDetails" },
      { text: "Back to Home", action: "navigate", target: "/" },
    ];
  }

  private getPageTemplates(): any[] {
    return [
      {
        id: "grid",
        name: "Product Grid",
        description: "Grid layout for products",
      },
      {
        id: "list",
        name: "Product List",
        description: "List layout for products",
      },
      {
        id: "hero",
        name: "Hero Section",
        description: "Large banner with CTA",
      },
      {
        id: "gallery",
        name: "Image Gallery",
        description: "Photo gallery layout",
      },
    ];
  }

  /**
   * Get user's custom pages (with membership filtering)
   */
  getUserPages(userId: string, userMembership: string): CustomPage[] {
    const userPages = Array.from(this.customPages.values()).filter(
      (page) => page.userId === userId,
    );

    // Filter by membership level
    return userPages.filter((page) => {
      switch (userMembership) {
        case "premium":
          return true; // Premium can access all
        case "member":
          return page.membershipRequired !== "premium";
        case "free":
          return page.membershipRequired === "free";
        default:
          return page.membershipRequired === "free";
      }
    });
  }

  /**
   * Render page for display
   */
  renderPage(pageId: string): string {
    const page = this.customPages.get(pageId);
    if (!page) return "<div>Page not found</div>";

    let html = `<div class="custom-page" data-page-id="${pageId}">`;

    page.cards.forEach((card) => {
      html += this.renderCard(card);
    });

    html += "</div>";
    return html;
  }

  private renderCard(card: DraggableCard): string {
    const style = `
      position: absolute;
      left: ${card.position.x}px;
      top: ${card.position.y}px;
      width: ${card.size.width}px;
      height: ${card.size.height}px;
    `;

    switch (card.type) {
      case "product":
        return `
          <div class="draggable-card product-card" data-card-id="${card.id}" style="${style}">
            <img src="${card.content.image}" alt="${card.content.name}" />
            <h3>${card.content.name}</h3>
            <p>$${card.content.price}</p>
          </div>
        `;

      case "button":
        return `
          <button class="draggable-card btn-card" data-card-id="${card.id}" style="${style}">
            ${card.content.text}
          </button>
        `;

      case "text":
        return `
          <div class="draggable-card text-card" data-card-id="${card.id}" style="${style}">
            ${card.content.content}
          </div>
        `;

      default:
        return `<div class="draggable-card" data-card-id="${card.id}" style="${style}">Unknown card type</div>`;
    }
  }

  private syncCardAcrossPages(card: DraggableCard, config: any): void {
    // Sync card changes across all pages that contain similar cards
    for (const [pageId, page] of this.customPages) {
      page.cards.forEach((otherCard) => {
        if (otherCard.type === card.type && config.syncFields) {
          config.syncFields.forEach((field: string) => {
            if (card.content[field] !== undefined) {
              otherCard.content[field] = card.content[field];
            }
          });
        }
      });
    }
  }

  private startMonitoring(): void {
    // Monitor cards every 10 seconds
    setInterval(() => {
      this.monitorCards();
    }, 10000);
  }

  private monitorCards(): void {
    for (const cardId of this.monitoredCards) {
      // Check if card elements exist in DOM
      const element = document.querySelector(`[data-card-id="${cardId}"]`);
      if (!element) {
        console.warn(`⚠️ Monitored card ${cardId} not found in DOM`);
        // Could trigger auto-repair here
      }
    }
  }

  private getDefaultSize(type: DraggableCard["type"]): {
    width: number;
    height: number;
  } {
    switch (type) {
      case "product":
        return { width: 250, height: 300 };
      case "category":
        return { width: 300, height: 200 };
      case "button":
        return { width: 150, height: 50 };
      case "text":
        return { width: 200, height: 100 };
      case "image":
        return { width: 300, height: 200 };
      case "video":
        return { width: 400, height: 300 };
      default:
        return { width: 200, height: 100 };
    }
  }

  private getDefaultStyle(type: DraggableCard["type"]): Record<string, any> {
    return {
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    };
  }

  private generateFallbackRoute(path: string): string {
    return path.includes("/product") ? "/collections" : "/";
  }

  private loadCustomPages(): void {
    try {
      const saved = localStorage.getItem("customPagesAI");
      if (saved) {
        const data = JSON.parse(saved);
        for (const [pageId, pageData] of Object.entries(data as any)) {
          const page: CustomPage = {
            ...pageData,
            createdAt: new Date(pageData.createdAt),
            lastModified: new Date(pageData.lastModified),
          };
          this.customPages.set(pageId, page);
        }
        console.log(`📄 Loaded ${this.customPages.size} custom pages`);
      }
    } catch (error) {
      console.error("Error loading custom pages:", error);
    }
  }

  private savePages(): void {
    try {
      const data = Object.fromEntries(this.customPages);
      localStorage.setItem("customPagesAI", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving custom pages:", error);
    }
  }
}

export const customPageBuilderAI = new CustomPageBuilderAI();
export type { DraggableCard, CustomPage, PageRoute, ContainerBackup };
